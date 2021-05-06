<template>
  <div v-if="!loading && user" class="flex row">
    <q-icon
      v-if="!tab && Screen.lt.sm"
      name="menu"
      size="2rem"
      @click="drawer = !drawer"
    />
    <q-drawer v-if="Screen.lt.sm" v-model="drawer">
      <UserRooms v-model:tab="tab" />
    </q-drawer>
    <UserRooms v-else v-model:tab="tab" />
    <div class="col-sm-1 col-xs-0"></div>
    <q-tab-panels
      v-model="tab"
      class="col-xs-12 col-sm-5 col-md-5 justify-center full-height"
      animated
      vertical
      outside-arrows
      transition-prev="jump-up"
      transition-next="jump-up"
    >
      <q-tab-panel :name="roomID" class="no-padding no-margin">
        <Chat v-model:drawer="drawer" />
      </q-tab-panel>
    </q-tab-panels>
    <div v-if="tab" class="col-xs-12 col-sm-2 col-md-2 col-lg-2">
      <UsersOnline />
    </div>
  </div>
</template>

<script>
  import { ref, computed, onMounted } from "vue";
  import { Notify, Screen } from "quasar";
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
      const roomID = computed(() => route.params.roomID);
      const tab = ref("");
      const loading = computed(() => state.auth.loading);
      const user = computed(() => getters["auth/isUser"]);
      const drawer = ref(false);
      const unscribeMessages = ref(null);
      const unscribeUsers = ref(null);

      drawer.value = Screen.lt.sm && !tab.value ? true : false;
      const signInRoom = (params) => dispatch("chat/signInRoom", params);
      const bindRoomMessage = (r) => dispatch("chat/bindRoomMessage", r);
      const bindRoomUsers = (r) => dispatch("chat/bindRoomUsers", r);
      onMounted(async () => {
        if (roomID.value) {
          try {
            await signInRoom({ roomID: roomID.value, user: user.value });
            unscribeMessages.value = await bindRoomMessage(roomID.value);
            unscribeUsers.value = await bindRoomUsers(roomID.value);
          } catch (e) {
            Notify.create({ message: "Room not found", color: "red" });
            router.push("/rooms");
          }
        }
      });
      onBeforeRouteUpdate(async (to, from) => {
        if (from.params.roomID && user.value.uid) {
          unscribeMessages.value();
          unscribeUsers.value();
        }
        if (to.params.roomID && user.value?.uid) {
          try {
            await signInRoom({ user: user.value, roomID: to.params.roomID });
            unscribeMessages.value = await bindRoomMessage(to.params.roomID);
            unscribeUsers.value = await bindRoomUsers(to.params.roomID);
          } catch (e) {
            Notify.create({ message: "Room not found", color: "red" });
            router.push("/rooms");
          }
        }
      });
      return {
        tab,
        loading,
        user,
        drawer,
        Screen,
        route,
        roomID,
      };
    },
  };
</script>

<style scoped lang="scss"></style>
