<template>
  <div
    v-if="!loading"
    class="q-mt-md q-pl-md col-3 col-lg-2 col-xl-2 userRooms_main"
  >
    <UserCard />
    <div class="flex justify-center text-black q-mb-md">
      <div v-if="$q.screen.gt.sm" class="text-weight-bold text-body1">
        Active chats
      </div>
      <div class="self-center">
        <q-icon name="add" size="1.5rem" class="cursor-pointer" />
        <q-menu anchor="center right" self="top left">
          <q-item v-close-popup clickable @click="showAddDialog('join')">
            <q-item-section class="text-center">Join to room</q-item-section>
          </q-item>
          <q-item v-close-popup clickable @click="showAddDialog('create')">
            <q-item-section class="text-center">
              Create new room
            </q-item-section>
          </q-item>
        </q-menu>
      </div>
    </div>
    <q-separator />
    <q-tabs
      v-model="editTab"
      vertical
      class="text-dark col-12"
      active-bg-color="blue-grey-1"
      active-color="dark"
    >
      <q-scroll-area class="userRooms_main">
        <q-route-tab
          v-for="room in rooms"
          :key="room.roomID"
          :to="{ name: 'rooms', params: { roomID: room.roomID } }"
          :name="room.roomID"
          :label="room.roomName"
        />
      </q-scroll-area>
    </q-tabs>
  </div>
  <q-dialog v-model="showNewDialog">
    <FormAddRoom :action="action" />
  </q-dialog>
</template>

<script>
  import { ref, onMounted, watch, computed } from "vue";
  import { useStore } from "vuex";
  import FormAddRoom from "./FormAddRoom";
  import UserCard from "../UserCard";

  export default {
    components: {
      FormAddRoom,
      UserCard,
    },
    props: { tab: { required: true, type: String, default: "" } },
    emits: ["update:tab"],
    setup(props, { emit }) {
      const { state, dispatch, getters } = useStore();
      const showNewDialog = ref(false);
      const action = ref("");
      const editTab = ref("");
      const user = computed(() => getters["auth/isUser"]);
      const rooms = computed(() => state.chat.rooms);
      const loading = computed(() => state.chat.loading).value;
      const showAddDialog = (event) => {
        action.value = event;
        showNewDialog.value = true;
      };
      const getAllRooms = (uid) => dispatch("chat/getAllRooms", uid);
      watch(editTab, () => emit("update:tab", editTab.value));
      onMounted(() => getAllRooms(user.value.uid));

      return {
        editTab,
        showNewDialog,
        action,
        showAddDialog,
        rooms,
        loading,
      };
    },
  };
</script>

<style lang="sass" scoped>
  .userRooms_main
    height: calc(100vh - 400px)
</style>
