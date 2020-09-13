<template>
    <transition name="fade">
        <router-view></router-view>
    </transition>
</template>

<script>
export default {
    name: 'App'
}
</script>

<!-- Load Tailwind -->
<style src="./assets/css/tailwind.css"></style>

<style>
html, body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}
</style>
