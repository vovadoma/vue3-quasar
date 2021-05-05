import { createStore } from "vuex";

import auth from "./modules/auth";
import chat from "./modules/chat";
import calendar from "./modules/calendar";
import storage from "./modules/storage";

export default function (/* { ssrContext } */) {
  const Store = createStore({
    modules: {
      auth,
      chat,
      calendar,
      storage,
    },
    // for dev mode only
    // strict: process.env.DEBUGGING
  });

  return Store;
}
