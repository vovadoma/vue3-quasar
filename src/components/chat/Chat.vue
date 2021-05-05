<template>
  <div :class="$q.screen.lt.md ? '' : 'q-pt-md'">
    <q-item class="bg-primary" dense>
      <q-btn
        v-if="$q.screen.lt.md"
        label="Rooms"
        flat
        color="white"
        @click="editDraver = !editDraver"
      />
      <q-btn-dropdown color="white" label="Menu" flat>
        <q-list>
          <q-item v-close-popup clickable @click="removePersonRoom">
            <q-item-section>
              <q-item-label>Exit</q-item-label>
            </q-item-section>
          </q-item>

          <q-item v-close-popup clickable @click="copyBtn">
            <q-item-section>
              <q-item-label>Copy ID</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-btn-dropdown>
    </q-item>
    <q-scroll-area
      ref="scroll"
      :style="
        $q.screen.lt.md
          ? 'height: calc(100vh - 150px)'
          : 'height: calc(100vh - 250px)'
      "
      class="overflow-hidden"
    >
      <div>
        <q-chat-message
          v-for="m in messages"
          :key="m.date"
          class="q-px-md"
          :name="m.fullName"
          :text="[`${m.message}`]"
          :sent="m.uid === user.uid"
          :stamp="moment(m.date).fromNow()"
        />
      </div>
    </q-scroll-area>
    <q-form
      ref="formMessage"
      class="flex justify-center"
      autofocus
      @submit="sendMessage"
    >
      <q-input
        v-model="message"
        dense
        outlined
        rounded
        placeholder="message"
        :rules="[(val) => !!val || '']"
        no-error-icon
        style="width: 80%"
        class="self-center"
        bg-color="grey-2"
      >
        <template #after>
          <q-btn round dense flat icon="send" @submit="sendMessage" />
        </template>
      </q-input>
    </q-form>
  </div>
</template>

<script>
  import { ref, computed, watch } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import moment from "moment";

  export default {
    emits: ["update:draver"],
    setup(props, { emit }) {
      const { state, dispatch, getters } = useStore();
      const route = useRoute();
      const router = useRouter();
      const scroll = ref(null);
      const formMessage = ref(null);
      const copyBtn = () => navigator.clipboard.writeText(roomID);
      const editDraver = ref(false);
      const message = ref("");
      const dataChat = computed(() => state.chat.dataChat);
      const messages = computed(() => dataChat.value.messages);
      const user = computed(() => getters["auth/isUser"]);
      const roomID = route.params.roomID;
      const fullName = computed(
        () => `${user.value.firstName} ${user.value.lastName}`,
      );

      const scrollToBottom = () => {
        const scrollTarget = scroll.value.getScrollTarget();
        const duration = 10;
        scroll.value.setScrollPosition(
          "vertical",
          scrollTarget.scrollHeight,
          duration,
        );
      };
      const removePersonRoom = () => {
        dispatch("chat/removePersonRoom", { roomID: roomID, user: user.value });
        router.push("/rooms");
      };
      const newMessage = (params) => dispatch("chat/newMessage", params);
      const sendMessage = () => {
        newMessage({
          roomID: roomID,
          message: message.value,
          user: user.value,
        });
        message.value = "";
        formMessage.value.reset();
        scrollToBottom();
      };
      watch(editDraver, () => {
        emit("update:draver", editDraver.value);
      });

      return {
        scroll,
        formMessage,
        messages,
        message,
        user,
        fullName,
        sendMessage,
        removePersonRoom,
        router,
        copyBtn,
        moment,
        editDraver,
      };
    },
  };
</script>

<style>
  .chat {
    flex-wrap: wrap;
  }
</style>
