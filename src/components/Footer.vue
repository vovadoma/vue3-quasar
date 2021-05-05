<template>
  <q-footer>
    <div v-if="user">
      <q-tabs>
        <q-route-tab flat :to="{ path: '/' }" icon="home" />
        <q-route-tab flat :to="{ name: 'rooms' }" icon="sms" />
        <q-route-tab flat :to="{ path: '/calendar' }" icon="event" />
        <q-route-tab flat :to="{ path: '/storage' }" icon="storage" />
        <div v-if="user" class="">
          <q-btn flat icon-right="exit_to_app" @click="logoutUser"></q-btn>
        </div>
      </q-tabs>
    </div>

    <div v-else class="flex justify-center">
      <q-tabs inline-label>
        <q-route-tab to="/signup" exact label="Sign Up" no-caps />
        <q-route-tab to="/login" label="Log In" no-caps />
      </q-tabs>
    </div>
  </q-footer>
</template>

<script>
  import { computed } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import { auth } from "../firebase/";
  export default {
    setup() {
      const { state, commit } = useStore();
      const router = useRouter();
      const user = computed(() => state.auth.user);
      const fullName = computed(
        () => `${user?.value.firstName} ${user?.value.lastName}`,
      );
      const logout = () => commit("auth/logout");
      const logoutUser = async () => {
        await auth.signOut();
        logout();
        router.push("/login");
      };
      return {
        user,
        fullName,
        logoutUser,
      };
    },
  };
</script>
