<template>
  <div class="row justify-center absolute-center full-width">
    <q-form
      class="col-xs-11 col-sm-5 col-md-5 col-lg-3 col-xl-3 text-center q-gutter-lg"
      @submit.prevent="userLogin"
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
        v-model="formData.password"
        :type="isPwd ? 'password' : 'text'"
        outlined
        dense
        placeholder="password"
        autocomplete="current-password"
      >
        <template #append>
          <q-icon
            :name="isPwd ? 'visibility_off' : 'visibility'"
            class="cursor-pointer"
            @click="isPwd = !isPwd"
          />
        </template>
      </q-input>
      <q-btn type="submit">Login</q-btn>
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
      });
      const isPwd = ref(true);
      const login = (user) => dispatch("auth/login", user);
      const userLogin = () => {
        auth
          .signInWithEmailAndPassword(
            formData.value.email,
            formData.value.password,
          )
          .then((userCredential) => {
            let user = {
              email: userCredential.user.email,
              uid: userCredential.user.uid,
            };
            login(user).then(() => router.push("/"));
          })
          .catch((error) => {
            Notify.create({
              message: "Wrong Email or Password",
              color: "red",
            });
          });
      };
      return {
        formData,
        isPwd,
        userLogin,
      };
    },
    methods: {},
  };
</script>
