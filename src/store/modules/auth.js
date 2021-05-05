import { db } from "../../firebase/";

const state = { user: null, loading: null };

const mutations = {
  startFetch(state) {
    state.loading = true;
    state.user = null;
  },
  setUser(state, user) {
    state.user = user;
    state.user.online = true;
    localStorage.setItem("user-login", JSON.stringify(user));
    state.loading = false;
  },
  logout(state) {
    state.user = null;
    localStorage.removeItem("user-login");
    state.loading = false;
  },
};
const actions = {
  async signUp({ commit }, { uid, data }) {
    commit("startFetch");
    data.uid = uid;
    data.online = true;
    try {
      await db.collection("users").doc(uid).set(data);
      commit("setUser", data);
    } catch (e) {
      throw e;
    }
  },
  async login({ commit }, user) {
    commit("startFetch");
    const { docs } = await db
      .collection("users")
      .where("uid", "==", user.uid)
      .get();
    if (docs.length) {
      await db.collection("users").doc(user.uid).update({ online: true });
      commit("setUser", docs[0].data());
    }
  },
  async logout({ commit }, user) {
    await db.collection("users").doc(user.uid).update({ online: false });
    commit("logout");
  },
};
const getters = {
  isAuthenticated() {
    const user = JSON.parse(localStorage.getItem("user-login")) || {};
    return Boolean(user.uid);
  },
  isUser() {
    return JSON.parse(localStorage.getItem("user-login")) || {};
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
