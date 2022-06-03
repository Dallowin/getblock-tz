<template>
    <input :placeholder="props.label"
    :value="props.modelValue"
    v-on:input="updateValue($event.target.value)" type="text" class="placeholder:italic placeholder:text-slate-400 block bg-gray-50 w-full border border-slate-200 py-3.5 px-4 shadow-sm focus:outline-none focus:border-sky-500 focus:ring-sky-500 focus:ring-1 sm:text-sm">
</template>


<script lang="ts" setup>
import {defineProps, defineEmits} from "vue"
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function updateValue(value) {
  emit('update:modelValue', value)
}
</script>