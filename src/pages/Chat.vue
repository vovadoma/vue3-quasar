<template>
  <div v-if="!loading && user" class="flex row">
    <q-drawer v-if="$q.screen.lt.md" v-model="draver">
      <UserRooms v-model:tab="tab" />
    </q-drawer>
    <UserRooms v-else v-model:tab="tab" />
    <div :class="$q.screen.lt.md ? '' : 'col-1'"></div>
    <q-tab-panels
      v-model="tab"
      class="justify-center"
      :class="$q.screen.lt.md ? 'col-12' : 'col-6'"
      animated
      vertical
      outside-arrows
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel :name="$route.params.roomID" class="no-padding no-margin">
        <Chat v-model:draver="draver" />
      </q-tab-panel>
    </q-tab-panels>
    <div
      v-if="tab"
      :class="$q.screen.lt.md ? 'col-12' : 'col-2'"
      class="q-mt-md"
    >
      <div class="text-center text-h5">Users</div>
      <UsersOnline />
    </div>
  </div>
</template>

<script>
  import { ref, computed, onMounted } from "vue";
  import { Notify } from "quasar";
  import { useStore } from "vuex";
  import { onBeforeRouteUpdate, useRoute, useRouter } from "vue-router";
  import UserRooms from "../components/chat/UserRooms";
  import UsersOnline from "../components/chat/UsersOnline";
  import Chat from "../components/chat/Chat";
  export default {
    components: {
      UserRooms,
      Chat,
      UsersOnline,
    },

    setup() {
      const { state, getters, dispatch } = useStore();
      const route = useRoute();
      const router = useRouter();
      const tab = ref("");
      const loading = computed(() => state.auth.loading);
      const user = computed(() => getters["auth/isUser"]);
      const draver = ref(false);
      const signInRoom = (params) => dispatch("chat/signInRoom", params);
      onMounted(async () => {
        if (route.params.roomID) {
          try {
            await signInRoom({
              roomID: route.params.roomID,
              user: user.value,
            });
          } catch (e) {
            Notify.create({ message: "Room not found", color: "red" });
            router.push("/rooms");
          }
        }
      }),
        onBeforeRouteUpdate((to, from) => {
          if (to.params.roomID && user.value?.uid) {
            signInRoom({
              user: user.value,
              roomID: to.params.roomID,
            });
          }
        });
      return {
        tab,
        loading,
        user,
        draver,
      };
    },
  };
</script>
