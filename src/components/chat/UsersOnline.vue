<template>
  <q-scroll-area
    ref="scroll"
    style="height: calc(90vh - 300px)"
    :set-scroll-position="220"
  >
    <div v-for="user in users" :key="user" class="q-px-md text-center">
      <q-badge rounded class="q-pa-xs" :color="user.online ? 'green' : 'red'" />
      {{ user.firstName }} {{ user.lastName }}
    </div>
  </q-scroll-area>
</template>

<script>
  import { useStore } from "vuex";
  import { computed } from "vue";
  export default {
    setup() {
      const { state, dispatch } = useStore();
      const dataChat = computed(() => state.chat.dataChat);
      const users = computed(() => dataChat.value.users || []);

      //ACTIONS
      const getUsers = () => dispatch("chat/getUsers");
      return {
        dataChat,
        users,
        getUsers,
      };
    },
  };
</script>
