<template>
  <div class="q-pa-md flex justify-center">
    <q-uploader
      ref="upload"
      :factory="(files) => factoryFn(files)"
      class="storage_uploader"
    />
  </div>
  <q-spinner
    v-if="loading"
    class="absolute-center"
    size="5rem"
    color="primary"
  />
  <div v-else class="q-gutter-lg flex q-ma-md">
    <q-card v-for="(file, index) in files" :key="file.url" class="my-card">
      <q-card-section class="flex justify-between no-padding">
        <q-icon
          name="download"
          size="2rem"
          color="primary"
          class="cursor-pointer"
          @click="downloadFile(file.url, `data:${file.type},${file.name}`)"
        />
        <q-icon
          name="deleted"
          size="2rem"
          color="dark"
          class="cursor-pointer"
          @click="remove(file, index)"
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
  import { Dialog } from "quasar";
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
      const uploadFile = (params) => dispatch("storage/uploadFile", params);
      const getAllFiles = (params) => dispatch("storage/getAllFiles", params);
      const factoryFn = (files) => {
        const file = uploadFile({ file: files[0], user: user.value });
        upload.value.reset();
        return file?.url;
      };
      const removedFile = (file) => dispatch("storage/removedFile", file);
      const remove = (file, index) => {
        Dialog.create({
          title: "Remove file",
          message: "You are sure?",
        }).onOk(() =>
          removedFile({ user: user.value, file: file, index: index }),
        );
      };
      onMounted(() => getAllFiles({ user: user.value }));
      return {
        factoryFn,
        files,
        downloadFile,
        upload,
        loading,
        remove,
      };
    },
  };
</script>
<style lang="sass" scoped>
  .my-card
    width: 100%
    max-width: 250px
    padding: 20px
  .storage_uploader
    max-width: 300px
  .storage_file_name
    white-space: nowrap
    overflow: hidden
    text-overflow: ellipsis
</style>
