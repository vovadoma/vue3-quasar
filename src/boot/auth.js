import { auth } from "../firebase/";
import store from "../store/";

auth.onAuthStateChanged((user) => {
  if (user) {
    store().dispatch("auth/login", user);
  } else {
    store().commit("auth/logout");
  }
});

export default auth;
