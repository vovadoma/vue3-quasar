<template>
  <div class="row justify-center q-mt-xl absolute-center full-width">
    <q-form
      class="col-xs-11 col-sm-5 col-md-5 col-lg-3 col-xl-3 text-center q-gutter-lg"
      @submit.prevent="signUP"
    >
      <q-input
        v-model="formData.email"
        type="email"
        outlined
        dense
        placeholder="email"
        autocomplete="email"
      />
      <q-input
        v-model="formData.firstName"
        type="First name"
        outlined
        dense
        placeholder="First name"
      />
      <q-input
        v-model="formData.lastName"
        type="Lastname"
        outlined
        dense
        placeholder="Lastname"
      />
      <q-input
        v-model="formData.password"
        :type="isPwd ? 'password' : 'text'"
        outlined
        dense
        placeholder="password"
        autocomplete="new-password"
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-btn type="submit">Registration</q-btn>
    </q-form>
  </div>
</template>

<script>
  import { ref } from "vue";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";
  import { Notify } from "quasar";
  import { auth } from "../../firebase/";
  export default {
    setup() {
      const { dispatch } = useStore();
      const router = useRouter();
      const formData = ref({
        email: "",
        password: "",
        firstName: "",
        lastName: "",
      });
      const isPwd = ref(true);

      const signUp = (params) => {
        dispatch("auth/signUp", params);
      };
      const signUP = async () => {
        try {
          const resp = await auth.createUserWithEmailAndPassword(
            formData.value.email,
            formData.value.password,
          );
          if (resp?.user) {
            const user = resp.user;
            await signUp({ uid: user.uid, data: formData.value });
            router.push("/");
          }
        } catch (e) {
          Notify.create({
            message:
              "This email is already in use or invalid email. Please use another",
            color: "red",
          });
        }
      };
      return {
        formData,
        isPwd,
        signUP,
      };
    },
  };
</script>
