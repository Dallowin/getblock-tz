<template>
    <button class="flex relative items-center justify-center bg-gray-50 w-2/5 border-r border-y rounded-r border-slate-200 py-3.5 px-4">
        <img :src="props.currency.image" alt="">
        <span class="mx-2 font-medium truncate ">{{ props.currency.name }}</span>
        <arrow-icon class="absolute right-3 cursor-pointer" />
    </button>
</template>

<script setup lang="ts">
import {defineProps} from "vue"
import ArrowIcon from "./Icons/ArrowIcon.vue"

const props = defineProps<{ 
    currency: Object 
}>()
</script>