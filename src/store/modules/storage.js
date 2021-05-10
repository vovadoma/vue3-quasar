import { storage, db } from "../../firebase";

const state = {
  files: [],
  loading: null,
};
const mutations = {
  startFetch(state) {
    state.loading = true;
  },
  setFiles(state, docs) {
    state.files = docs.map((doc) => doc.data());
    state.loading = false;
  },
  setFile(state, file) {
    state.files.unshift(file);
    state.loading = false;
  },
  removeFile(state, index) {
    state.files.splice(index, 1);
  },
};
const actions = {
  async uploadFile({ commit, state }, { file, user }) {
    commit("startFetch");
    const storageRef = storage.ref().child(`${user.uid}/${file.name}`);
    await storageRef.put(file, { contentType: file.type });
    const url = await storageRef.getDownloadURL();
    const f = {
      url: url,
      name: file.name,
      type: file.type,
      uid: user.uid,
    };
    const newDoc = db.collection("storage").doc();
    f.id = newDoc.id;
    await newDoc.set(f);
    commit("setFile", f);
  },
  async uploadAvatar({ commit, state }, { file, user }) {
    const storageRef = storage.ref().child(`${user.uid}/avatar`);
    await storageRef.putString(file, "data_url");
    const url = await storageRef.getDownloadURL();
    await db.collection("users").doc(user.uid).update({ avatarURL: url });
  },
  async getAllFiles({ commit }, { user }) {
    commit("startFetch");
    const { docs } = await db
      .collection("storage")
      .where("uid", "==", user.uid)
      .get();
    commit("setFiles", docs);
  },
  async removedFile({ commit }, { user, file, index }) {
    await storage.ref().child(`${user.uid}/${file.name}`).delete();
    await db.collection("storage").doc(file.id).delete();
    commit("removeFile", index);
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
