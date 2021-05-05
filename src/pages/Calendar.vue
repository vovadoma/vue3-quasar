<template>
  <div v-if="user">
    <q-splitter v-model="splitterModel" class="gt-sm">
      <template #before>
        <CalendarForm v-model:date="date" />
      </template>

      <template #after>
        <q-tab-panels v-model="date" animated>
          <q-tab-panel v-for="e in events" :key="e.date" :name="e.date">
            <div class="text-h4 q-mb-md">{{ e?.eventName }}</div>
            <p class="words">{{ e?.description }}</p>
            <q-dialog
              v-if="Screen.lt.md"
              v-model="showEvent"
              @before-hide="hideDialog()"
            >
              <q-card class="bg-white q-pa-md">
                <div class="text-h4">
                  {{ e?.eventName }}
                </div>
                <q-separator class="q-mb-md" />
                <p class="flex column words">{{ e?.description }}</p>
              </q-card>
            </q-dialog>
          </q-tab-panel>
        </q-tab-panels>
      </template>
    </q-splitter>

    <div v-if="Screen.lt.md">
      <CalendarForm v-model:date="date" v-model:event="event" />
    </div>
  </div>
</template>

<script>
  import { useStore } from "vuex";
  import { ref, computed, watch } from "vue";
  import { Screen } from "quasar";
  import CalendarForm from "../components/calendar/CalendarForm";
  export default {
    components: {
      CalendarForm,
    },
    setup() {
      const { state } = useStore();
      const splitterModel = 50;
      const date = ref("");
      const event = ref({});
      const showEvent = ref(false);
      const events = computed(() => state.calendar.events);
      const user = computed(() => state.auth.user);

      const hideDialog = () => (date.value = "");
      watch(event, () => {
        if (event.value?.eventID && Screen.lt.md) {
          showEvent.value = true;
        }
      });

      return {
        splitterModel,
        date,
        event,
        showEvent,
        events,
        user,
        hideDialog,
        Screen,
      };
    },
  };
</script>

<style scoped>
  .words {
    word-break: break-all;
  }
</style>
