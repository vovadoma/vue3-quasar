<template>
  <q-layout>
    <q-header elevated>
      <Header class="gt-xs" />
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <Footer class="lt-sm" />
  </q-layout>
</template>

<script>
  import Header from "../components/Header";
  import Footer from "../components/Footer";
  export default {
    components: {
      Header,
      Footer,
    },
  };
</script>
