<template>
  <div :class="Screen.lt.sm ? '' : 'q-pt-md'">
    <q-item class="bg-primary" dense>
      <q-btn
        v-if="Screen.lt.sm"
        label="Rooms"
        flat
        color="white"
        @click="editDrawer = !editDrawer"
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
      class="overflow-hidden chat_scroll_area"
      @scroll="(info) => scrollFunc(info)"
    >
      <q-spinner-dots
        v-if="loading"
        size="5rem"
        color="primary"
        class="flex absolute-top"
        style="margin: 0 auto"
      />

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
        class="self-center chat_sendMessage"
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
  import { ref, computed, watch, onMounted } from "vue";
  import { useStore } from "vuex";
  import { useRoute, useRouter } from "vue-router";
  import { Screen } from "quasar";
  import moment from "moment";

  export default {
    emits: ["update:drawer"],
    setup(props, { emit }) {
      const { state, dispatch, getters } = useStore();
      const route = useRoute();
      const router = useRouter();
      const scroll = ref(null);
      const formMessage = ref(null);
      const editDrawer = ref(false);
      const message = ref("");
      const dataChat = computed(() => state.chat.dataChat);
      const loading = computed(() => state.chat.loading);
      const messages = computed(() => dataChat.value.messages);
      const user = computed(() => getters["auth/isUser"]);
      const roomID = route.params.roomID;
      const fullName = computed(
        () => `${user.value.firstName} ${user.value.lastName}`,
      );
      const copyBtn = () => navigator.clipboard.writeText(roomID);
      const nextMessage = (params) => dispatch("chat/nextMessage", params);
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
        editDrawer.value = true;
      };

      const scrollFunc = async (info) => {
        const lastSize = info.verticalSize;
        if (info.verticalPosition === 0) {
          await nextMessage(roomID);
          scroll.value.setScrollPosition(
            "vertical",
            scroll.value.getScrollTarget().scrollHeight - lastSize,
          );
        }
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
      watch(editDrawer, () => {
        emit("update:drawer", editDrawer.value);
      });
      onMounted(() => {
        scrollToBottom();
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
        editDrawer,
        Screen,
        scrollFunc,
        loading,
      };
    },
  };
</script>

<style scoped lang="scss">
  .chat_sendMessage {
    width: 80%;
  }
  .chat_scroll_area {
    height: calc(100vh - 250px);
  }
</style>
