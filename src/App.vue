<template>
  <router-view />
</template>
<script>
  import { useStore } from "vuex";
  import { computed } from "vue";
  import { db } from "./firebase";
  export default {
    name: "App",
    setup() {
      const { getters } = useStore();
      const user = computed(() => getters["auth/isUser"]);
      window.addEventListener("beforeunload", async (event) => {
        await db
          .collection("users")
          .doc(user.value.uid)
          .update({ online: false });
        event.preventDefault();
      });
    },
  };
</script>
