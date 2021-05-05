<template>
  <div class="bg-white q-pa-md">
    <q-form @submit="$emit('onSave', formData)">
      <q-input
        v-model="formData.eventName"
        placeholder="Add name"
        class="q-mb-xs"
        dense
        :rules="[(val) => !!val || 'Field not be empty']"
        no-error-icon
      />
      <q-editor v-model="formData.description" />
      <div class="flex justify-between">
        <q-btn v-close-popup label="Cancel" />
        <q-btn
          label="Save"
          type="submit"
          :disable="!formData.description || !formData.eventName"
        />
      </div>
    </q-form>
  </div>
</template>

<script>
  import { ref, onMounted } from "vue";
  export default {
    props: {
      date: { type: String, required: true },
      currentEvent: { type: Object, required: false, default: () => {} },
    },
    emits: ["onSave"],
    setup(props) {
      const formData = ref({
        eventName: "",
        description: "",
      });
      onMounted(() => {
        if (props.currentEvent) {
          formData.value = { ...props.currentEvent };
        }
      });
      return {
        formData,
      };
    },
  };
</script>
