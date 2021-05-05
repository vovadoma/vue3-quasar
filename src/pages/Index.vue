<template>
  <q-page class="flex flex-center">
    <div class="flex self-stretch full-width">
      <q-btn
        label="Chat"
        to="/rooms"
        color="indigo-6"
        class="text-h5 no-border-radius content-center flex full-width"
        icon="sms"
      />
      <q-btn
        label="Calendar"
        to="/calendar"
        color="indigo-6"
        class="text-h5 no-border-radius content-center flex full-width"
        icon="event"
      />
      <q-btn
        label="Storage"
        to="/storage"
        color="indigo-6"
        class="text-h5 no-border-radius content-center flex full-width"
        icon="storage"
      />
    </div>
  </q-page>
</template>

<script>
  export default {
    name: "PageIndex",
  };
</script>

<style scoped>
  .main_btn {
    width: 100%;
  }
</style>
