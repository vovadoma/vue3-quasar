import { storage, db } from "../../firebase";

const state = {
  files: [],
  loading: null,
};
const mutations = {
  startFetch() {
    state.loading = true;
  },
  setFiles(state, docs) {
    state.files = docs.map((doc) => doc.data());
    state.loading = false;
  },
  setFile(state, file) {
    state.files.push(file);
    state.loading = false;
  },
};
const actions = {
  async uploadFile({ commit }, { file, user }) {
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
    commit("setFile", f);
    await db.collection("storage").add(f);
    return f;
  },
  async getAllFiles({ commit }, { user }) {
    commit("startFetch");
    const { docs } = await db
      .collection("storage")
      .where("uid", "==", user.uid)
      .get();
    commit("setFiles", docs);
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
