<template>
  <q-toolbar>
    <q-tabs v-if="user">
      <q-route-tab flat :to="{ path: '/' }" icon="home">Home</q-route-tab>
      <q-route-tab flat :to="{ name: 'rooms' }" icon="sms">Chat</q-route-tab>
      <q-route-tab flat :to="{ path: '/calendar' }" icon="event"
        >Calendar</q-route-tab
      >
      <q-route-tab flat :to="{ path: '/storage' }" icon="storage"
        >storage</q-route-tab
      >
      <q-route-tab flat :to="{ path: '/payment' }" icon="payment">payment</q-route-tab>
    </q-tabs>
    <q-space />
    <div v-if="user" class="flex">
      <div class="self-center q-mr-md">{{ fullName }}</div>
      <q-btn icon-right="exit_to_app" @click="logoutUser">Logout</q-btn>
    </div>
    <div v-else>
      <q-tabs inline-label>
        <q-route-tab to="/signup" exact label="Sign Up" no-caps />
        <q-route-tab to="/login" label="Log In" no-caps />
      </q-tabs>
    </div>
  </q-toolbar>
</template>

<script>
  import { computed } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { auth } from "../firebase/";
  export default {
    setup() {
      const { state, dispatch } = useStore();
      const router = useRouter();
      const user = computed(() => state.auth.user);
      const fullName = computed(
        () => `${user.value?.firstName} ${user.value?.lastName}`,
      );
      const logout = (params) => dispatch("auth/logout", params);
      const logoutUser = async () => {
        logout(user.value);
        await auth.signOut();
        router.push("/login");
      };
      return {
        router,
        user,
        fullName,
        logout,
        logoutUser,
      };
    },
  };
</script>
