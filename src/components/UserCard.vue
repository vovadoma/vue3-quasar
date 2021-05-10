<template>
  <div
    v-if="user"
    class="q-pt-md q-mb-md items-start text-center items-stretch column"
    style="width: 100%"
  >
    <q-card class="my-card bg-blue-grey-1">
      <q-card-section>
        <q-avatar
          size="100px"
          font-size="52px"
          color="primary"
          text-color="white"
          class="text-center"
        >
          <img v-if="avatar" :src="avatar" />
          <div v-else>
            {{ firstLetter }}
          </div>
        </q-avatar>
      </q-card-section>
      <q-card-section> {{ fullName }} </q-card-section>
    </q-card>
  </div>
</template>
<script>
  import { computed } from "vue";
  import { useStore } from "vuex";
  export default {
    setup() {
      const { state } = useStore();
      const user = computed(() => state.auth.user);
      const firstLetter = computed(() => user.value.firstName[0]);
      const fullName = computed(
        () => `${user.value.firstName} ${user.value.lastName}`,
      );
      const avatar = computed(() => user.value.avatarURL);
      return {
        user,
        firstLetter,
        fullName,
        avatar,
      };
    },
  };
</script>
