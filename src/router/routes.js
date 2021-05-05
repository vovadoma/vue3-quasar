import store from "../store/";

const ifAuthenticated = (to, from, next) => {
  if (store().getters["auth/isAuthenticated"]) {
    next();
    return;
  }
  next("/login");
};
// beforeEnter: ifAuthenticated,

const routes = [
  {
    path: "/",
    component: () => import("layouts/Main.vue"),
    children: [
      {
        path: "",
        component: () => import("pages/Index.vue"),
        beforeEnter: ifAuthenticated,
      },

      {
        name: "login",
        path: "/login",
        component: () => import("pages/auth/Login.vue"),
      },
      {
        name: "signup",
        path: "/signup",
        component: () => import("pages/auth/SignUp.vue"),
      },
      {
        name: "rooms",
        path: "/rooms/:roomID?",
        component: () => import("src/pages/Chat.vue"),
        props: true,
        beforeEnter: ifAuthenticated,
      },
      {
        name: "calendar",
        path: "/calendar",
        component: () => import("src/pages/Calendar.vue"),
        beforeEnter: ifAuthenticated,
      },
      {
        name: "storage",
        path: "/storage",
        component: () => import("src/pages/Storage.vue"),
        beforeEnter: ifAuthenticated,
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: "/:catchAll(.*)*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
