<template>
  <input
    ref="input"
    type="file"
    name="image"
    accept="image/*"
    @change="setImage"
  />
  <div v-if="imgSrc" style="max-width: 500px" class="flex justify-center">
    <vue-cropper
      ref="cropper"
      :aspect-ratio="16 / 9"
      :src="imgSrc"
      preview=".preview"
      :view-mode="3"
    />
    <q-btn label="cancel" @click="imgSrc = null" />
    <q-btn label="upload" @click="cropImage" />
  </div>
</template>
<script>
  import VueCropper from "vue-cropperjs";
  import { ref, computed } from "vue";
  import { useStore } from "vuex";
  import "cropperjs/dist/cropper.css";
  export default {
    components: {
      VueCropper,
    },
    setup() {
      const { dispatch, getters } = useStore();
      const imgSrc = ref("");
      const input = ref(null);
      const cropper = ref(null);
      const cropImg = ref(null);
      const user = computed(() => getters["auth/isUser"]);
      const uploadAvatar = (params) => {
        dispatch("storage/uploadAvatar", params);
      };
      const cropImage = () => {
        cropImg.value = cropper.value.getCroppedCanvas().toDataURL();
        uploadAvatar({ user: user.value, file: cropImg.value });
      };
      const setImage = (e) => {
        const file = e.target.files[0];
        if (file.type.indexOf("image/") === -1) {
          alert("Please select an image file");
          return;
        }
        if (typeof FileReader === "function") {
          const reader = new FileReader();
          reader.onload = (event) => {
            imgSrc.value = event.target.result;
            cropper.value.replace(event.target.result);
          };
          reader.readAsDataURL(file);
        } else {
          alert("Sorry, FileReader API not supported");
        }
      };
      return {
        setImage,
        imgSrc,
        input,
        cropper,
        cropImg,
        cropImage,
      };
    },
  };
</script>
