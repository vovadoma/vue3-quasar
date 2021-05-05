<template>
  <div class="q-pa-md" style="width: 100%">
    <q-date
      v-model="currentDate"
      :events="eventsDate"
      event-color="green"
      style="width: 100%; height: calc(100vh - 150px)"
      today-btn
    >
      <div class="flex justify-end">
        <q-btn
          v-if="currentEvent"
          label="Remove event"
          @click="onRemoveEvent"
        />
        <q-btn
          :label="!currentEvent ? 'Add event' : 'Edit event'"
          :disable="!currentDate"
          @click="showEdit = true"
        />
      </div>
    </q-date>
  </div>
  <q-dialog v-model="showEdit">
    <FormAddEvent
      :date="currentDate"
      :current-event="currentEvent"
      @onSave="onSave"
    />
  </q-dialog>
</template>

<script>
  import FormAddEvent from "./FormAddEvent";
  import { Dialog } from "quasar";
  import { ref, computed, watch, onMounted } from "vue";
  import { useStore } from "vuex";
  export default {
    components: { FormAddEvent },
    props: {
      date: { require: false, type: String, default: () => "" },
      event: { type: Object, required: false, default: () => {} },
    },
    emits: ["update:date", "update:event"],
    setup(props, { emit }) {
      const { dispatch, state, getters } = useStore();
      const currentEvent = ref("");
      const currentDate = ref("");
      const showEdit = ref(false);
      const events = computed(() => state.calendar.events);
      const user = computed(() => getters["auth/isUser"]);
      const eventsDate = computed(() => events.value.map((e) => e.date));
      const addNewEvent = (params) => dispatch("calendar/addNewEvent", params);
      const getEvents = (params) => dispatch("calendar/getEvents", params);
      const removeEvent = (params) => dispatch("calendar/removeEvent", params);
      const onSave = (event) => {
        event.date = currentDate.value;
        currentEvent.value = { ...props.event };
        addNewEvent({ event: event, uid: user.value.uid });
        showEdit.value = false;
      };
      const onRemoveEvent = () => {
        Dialog.create({
          title: "Remove event",
          message: "Are u sure?",
          cancel: true,
        })
          .onOk(() => {
            removeEvent(currentEvent.value);
          })
          .onCancel(() => {
            console.log("cancel");
          });
      };

      watch(currentDate, () => {
        currentEvent.value = events.value.find((e) =>
          e.date === currentDate.value ? e : "",
        );
        emit("update:date", currentDate.value);
        emit("update:event", currentEvent.value);
      });

      onMounted(() => getEvents(user.value.uid));
      return {
        currentEvent,
        showEdit,
        currentDate,
        events,
        user,
        eventsDate,
        onSave,
        onRemoveEvent,
      };
    },

    methods: {},
  };
</script>
