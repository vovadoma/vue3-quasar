import { db, firebase } from "../../firebase";
const state = {
  loading: null,
  rooms: [],
  dataChat: {
    messages: [],
    users: [],
  },
  limitMessage: 10,
  lastMessage: null,
};
const mutations = {
  startFetch(state) {
    state.loading = true;
    state.dataChat = {
      messages: [],
      users: [],
    };
    state.lastMessage = null;
  },
  startLoading(state) {
    state.loading = true;
  },
  addNewRoom(state, room) {
    state.rooms.push(room);
    state.loading = false;
  },
  setRooms(state, rooms) {
    state.rooms = [];
    rooms.forEach((doc) => {
      state.rooms.push(doc.data());
    });
    state.loading = false;
  },
  setUsers(state, data) {
    state.dataChat.users = data;
  },
  removeCurrentRoom(state, roomID) {
    state.loading = false;
    state.dataChat = [];
    state.rooms.forEach((room, index) => {
      if (room.roomID === roomID) {
        state.rooms.splice(index, 1);
      }
    });
  },
  addMessage(state, { data }) {
    state.dataChat?.messages.push(data.data());
    state.lastMessage = state.dataChat.messages[0];
    state.loading = false;
  },
  setNextMessage(state, docs) {
    docs.forEach((doc) => {
      state.dataChat?.messages.unshift(doc.data());
    });
    state.lastMessage = state.dataChat.messages[0];
    state.loading = false;
  },
  removeMessage(state, { oldIndex }) {
    state.dataChat.messages.splice(oldIndex, 1);
    state.loading = false;
  },

  addUsers(state, { data }) {
    data.data().users.forEach((user) => {
      state.dataChat?.users?.push(user);
    });
    state.loading = false;
  },
  removeUsers(state, { oldIndex }) {
    state.dataChat.users.splice(oldIndex, 1);
    state.loading = false;
  },
  updUsers(state, { oldIndex, data }) {
    state.dataChat.users = [];
    state.dataChat.users = [...data.data()?.users] || [];
    state.loading = false;
  },
};
const actions = {
  // ROOMS
  async createRoom({ commit }, { user, roomName, action = "create" }) {
    try {
      if (action === "join") {
        const room = await db.collection("rooms").doc(roomName).get();
        if (room.exists) {
          commit("addNewRoom", room.data());
          return room.data();
        }
        throw e;
      }
      commit("startFetch");
      const uid = user.uid;
      const newDoc = db.collection("rooms").doc();
      const room = {
        users: firebase.firestore.FieldValue.arrayUnion(uid),
        roomID: newDoc.id,
        roomName: roomName,
        admin: uid,
      };
      await db.collection("rooms").doc(room.roomID).set(room);
      commit("addNewRoom", room);
      return room;
    } catch (e) {
      throw e.message;
    }
  },

  async signInRoom({ commit, dispatch }, { roomID, user }) {
    commit("startFetch");
    const uid = user.uid;
    try {
      await db
        .collection("rooms")
        .doc(roomID)
        .update({ users: firebase.firestore.FieldValue.arrayUnion(uid) });
      dispatch("bindRoomMessage", roomID);
      dispatch("bindRoomUsers", roomID);
      return roomID;
    } catch (e) {
      commit("removeCurrentRoom");
      throw e;
    }
  },

  async getUsers({ state, commit }) {
    const arrays = [];
    const size = 10;
    for (let i = 0; i < Math.ceil(state.dataChat?.users?.length / size); i++) {
      arrays.push(state.dataChat.users.slice(i * size, i * size + size));
    }
    const data = await Promise.all(
      arrays.map((docs) => {
        return db.collection("users").where("uid", "in", docs).get();
      }),
    );
    const parseData = [];
    data.forEach((d) => {
      d.docs.forEach((doc) => {
        parseData.push(doc.data());
      });
    });
    commit("setUsers", parseData);
  },
  async getAllRooms({ commit }, uid) {
    commit("startFetch");
    const { docs } = await db
      .collection("rooms")
      .where("users", "array-contains", uid)
      .get();
    commit("setRooms", docs);
  },

  bindRoomUsers({ commit, dispatch }, roomID) {
    db.collection("rooms")
      .where("roomID", "==", roomID)
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const { newIndex, oldIndex, doc, type } = change;
          if (type === "added") {
            commit("addUsers", { newIndex, data: doc });
            dispatch("getUsers");
          }
          if (type === "modified") {
            commit("updUsers", { newIndex, oldIndex, data: doc });
            dispatch("getUsers");
          }
          if (type === "removed") {
            commit("removeUsers", { oldIndex, data: doc });
          }
        });
      });
  },

  async removePersonRoom({ commit }, { roomID, user }) {
    commit("startFetch");
    const uid = user.uid;
    await db
      .collection("rooms")
      .doc(roomID)
      .update({ users: firebase.firestore.FieldValue.arrayRemove(uid) });
    commit("removeCurrentRoom", roomID);
  },

  // MESSAGE
  bindRoomMessage({ commit, state }, roomID) {
    db.collection("rooms")
      .doc(roomID)
      .collection("messages")
      .limitToLast(state.limitMessage)
      .orderBy("date")
      .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          const { newIndex, oldIndex, doc, type } = change;
          if (type === "added") {
            commit("addMessage", { newIndex, data: doc });
          }
          if (type === "modified") {
            commit("updMessage", { newIndex, oldIndex, data: doc });
          }
          if (type === "removed") {
            commit("removeMessage", { oldIndex, data: doc });
          }
        });
      });
  },

  async nextMessage({ commit, state }, roomID) {
    if (state.lastMessage?.date) {
      commit("startLoading");
      const { docs } = await db
        .collection("rooms")
        .doc(roomID)
        .collection("messages")
        .orderBy("date", "desc")
        .startAfter(state.lastMessage?.date)
        .limit(state.limitMessage)
        .get();
      commit("setNextMessage", docs);
    }
  },
  newMessage(store, { roomID, message, user }) {
    const date = Date.now();
    db.collection("rooms")
      .doc(roomID)
      .collection("messages")
      .add({
        date: date,
        message: message,
        fullName: `${user.firstName} ${user.lastName}`,
        uid: user.uid,
        roomID: roomID,
      });
  },
};
const getters = {};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
