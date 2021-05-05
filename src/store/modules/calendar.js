import { db } from "../../firebase/";

const state = {
  events: [],
};
const mutations = {
  setEvents(state, events) {
    events.docs.forEach((doc) => {
      state.events.push(doc.data());
    });
  },
  setNewEvent(state, event) {
    state.events.push(event);
  },
  updEvent(state, updEvent) {
    state.events.forEach((event, index) => {
      if (updEvent.eventID === event.eventID) {
        state.events[index] = updEvent;
      }
    });
  },
  removeEvent(state, eventID) {
    state.events.forEach((event, index) => {
      if (event.eventID === eventID) {
        state.events.splice(index, 1);
      }
    });
  },
};
const actions = {
  async getEvents({ commit }, uid) {
    const events = await db.collection("events").where("uid", "==", uid).get();
    if (!events.empty) {
      commit("setEvents", events);
    }
  },
  async addNewEvent({ commit }, { event, uid }) {
    if (event.eventID) {
      db.collection("events").doc(event.eventID).update(event);
      commit("updEvent", event);
      return;
    }
    const newDoc = await db.collection("events").doc();
    event.eventID = newDoc.id;
    event.uid = uid;
    newDoc.set(event).then(() => {
      commit("setNewEvent", event);
    });
  },
  removeEvent({ commit }, event) {
    db.collection("events").doc(event.eventID).delete();
    commit("removeEvent", event.eventID);
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
