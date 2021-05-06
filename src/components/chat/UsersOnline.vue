<template>
  <q-card :class="Screen.lt.md ? '' : 'q-ml-xl'" class="bg-blue-grey-1 q-mt-lg">
    <q-scroll-area
      ref="scroll"
      :set-scroll-position="220"
      class="usersOnline_scroll_area"
    >
      <div v-for="user in users" :key="user" class="q-px-md text-center">
        <q-badge
          rounded
          class="q-pa-xs"
          :color="user.online ? 'green' : 'red'"
        />
        {{ user.firstName }} {{ user.lastName }}
      </div>
    </q-scroll-area>
  </q-card>
</template>

<script>
  import { useStore } from "vuex";
  import { computed } from "vue";
  import { Screen } from "quasar";
  export default {
    setup() {
      const { state, dispatch } = useStore();
      const dataChat = computed(() => state.chat.dataChat);
      const users = computed(() => dataChat.value.users || []);
      const getUsers = () => dispatch("chat/getUsers");
      return {
        dataChat,
        users,
        getUsers,
        Screen,
      };
    },
  };
</script>

<style lang="sass" scoped>
  .usersOnline_scroll_area
    height: calc(100vh - 400px)
</style>
