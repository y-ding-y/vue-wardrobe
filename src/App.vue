<template>
  <div id="app">

    <router-view />

    <global-uploader></global-uploader>
  </div>
</template>

<script>
  import globalUploader from '@/components/vue-simple-uploader/GlobalUploader.vue'
  export default {
    name: 'App',
    components: {
      globalUploader
    },
  }
</script>

<style>
  * {
    margin: 0;
    padding: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
</style>