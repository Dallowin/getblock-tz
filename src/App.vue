<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'
import axios from 'axios'
import Main from './components/Main.vue'
import store from './store'

onMounted(async () => {
    await store.dispatch("getAllCurrencies")   
})
</script>

<template>
    <Main  />
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Vollkorn:wght@400;500;700&display=swap');
#app {
    font-family: Vollkorn, sans-serif;
}
</style>
