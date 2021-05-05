<template>
  <div class="q-pa-md flex justify-center">
    <q-uploader ref="upload" style="max-width: 300px" :factory="factoryFn" />
  </div>
  <q-spinner
    v-if="loading"
    class="absolute-center"
    size="5rem"
    color="primary"
  />
  <div v-else class="q-gutter-lg flex q-ma-md">
    <q-card v-for="file in files" :key="file.url" class="my-card">
      <q-card-section class="flex">
        <q-icon
          name="download"
          size="2rem"
          color="primary"
          class="cursor-pointer"
          @click="downloadFile(file.url, `data:${file.type},${file.name}`)"
        />
        <div class="text-h6 storage_file_name">{{ file.name }}</div>
        <div class="text-subtitle2 storage_file_name">{{ file.type }}</div>
      </q-card-section>
    </q-card>
  </div>
</template>
<script>
  import { useStore } from "vuex";
  import { ref, computed, onMounted } from "vue";
  import { storage } from "../firebase/";
  export default {
    setup() {
      const { state, dispatch, getters } = useStore();
      const user = computed(() => getters["auth/isUser"]);
      const files = computed(() => state.storage.files);
      const loading = computed(() => state.storage.loading);
      const upload = ref(null);

      const downloadFile = (url, name) => {
        var a = document.createElement("a");
        a.href = url;
        a.target = "_blank";
        a.setAttribute("download", name);
        a.click();
      };
      const uploadFile = (params) => {
        dispatch("storage/uploadFile", params);
      };
      const getAllFiles = (params) => {
        dispatch("storage/getAllFiles", params);
      };
      const storageRef = storage.ref("s");
      const factoryFn = (files) => {
        const file = uploadFile({ file: files[0], user: user.value });
        upload.value.reset();
        return file?.url;
      };
      onMounted(() => {
        getAllFiles({ user: user.value });
      });
      return {
        factoryFn,
        storageRef,
        files,
        downloadFile,
        upload,
        loading,
      };
    },
  };
</script>
<style lang="sass" scoped>
  .my-card
    width: 100%
    max-width: 250px
  .storage_file_name
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
</style>
