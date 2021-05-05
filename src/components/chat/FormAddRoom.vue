<template>
  <q-card class="q-pa-md">
    <div class="text-body1">New Room</div>
    <q-form ref="formMessage" autofocus @submit.prevent="addNewRoom">
      <q-card-section>
        <q-input
          v-model="newRoomName"
          dense
          outlined
          placeholder="Enter the name of the room"
          :rules="[(val) => !!val || '']"
          no-error-icon
          class="self-center"
          bg-color="grey-2"
        />
      </q-card-section>
      <q-card-section class="q-gutter-lg">
        <q-btn v-close-popup label="Cancel" />
        <q-btn v-close-popup label="Create" type="submit" />
      </q-card-section>
    </q-form>
  </q-card>
</template>
<script>
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  import { Notify } from "quasar";
  import { useRouter } from "vue-router";
  export default {
    props: {
      action: {
        type: String,
        required: true,
      },
    },
    setup(props) {
      const { dispatch, state } = useStore();
      const router = useRouter();
      const newRoomName = ref("");
      const user = computed(() => state.auth.user).value;
      const rooms = computed(() => state.chat.rooms).value;

      const createRoom = async (params) => {
        try {
          const room = await dispatch("chat/createRoom", params);
          router.push({ name: "rooms", params: { roomID: room?.roomID } });
        } catch (e) {
          Notify.create({ message: "Room not found", color: "red" });
        }
      };
      const addNewRoom = () => {
        if (props.action === "create") {
          createRoom({
            user: user,
            roomName: newRoomName.value,
            action: props.action,
          });
        } else if (props.action === "join") {
          for (let i = 0; i < rooms.length; i++) {
            if (rooms[i].roomID === newRoomName.value) {
              router.push({
                name: "rooms",
                params: { roomID: newRoomName.value },
              });
              return;
            }
          }
          createRoom({
            user: user,
            roomName: newRoomName.value,
            action: props.action,
          });
        }
      };
      return {
        newRoomName,
        addNewRoom,
      };
    },
  };
</script>
<style lang=""></style>
