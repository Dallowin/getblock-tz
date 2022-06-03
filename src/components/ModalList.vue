<template>
    <div class="wrapper absolute w-full z-50">
        <input-block v-model="search" placeholder="Search..." class="rounded rounded-b-none" />
        <close-icon class="absolute right-5 top-4 z-20 cursor-pointer" @click="closeModal()" />

        <div class="wrapper-list w-full max-h-40 overflow-y-scroll overflow-x-hidden rounder-b">
            <div @click="selectCoin(curr)" v-for="(curr, index) of filteredCurrencies" :key="index"
                class="flex relative items-center bg-gray-50 w-full cursor-pointer border border-t-0 border-y border-slate-200 py-3.5 px-4">
                <img height="20" width="20" :src="curr.image" alt="">
                <span class="mx-2 font-medium">{{ curr.name }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, defineEmits, nextTick } from 'vue'
import store from '../store';

import CloseIcon from './Icons/CloseIcon.vue';
import InputBlock from './InputBlock.vue';

const props = defineProps<{ 
    currencies: Array<Object>, 
    currencyType: String 
}>()

const emits = defineEmits<{
    (e: 'change', closeModal: Boolean): void,
    (e: 'change', changedCoin: Object): void
}>()

const search = ref<String>("")

const filteredCurrencies = computed(() => {
    return props.currencies.filter(item => {
            return item.name.toLowerCase().includes(search.value.toLowerCase())
    })
})

function selectCoin(item: Object) {
    search.value = item.name
    
    if (props.currencyType === 'to') store.commit('setToCurrency', item)
    if (props.currencyType === 'from') store.commit('setFromCurrency', item)

    emits('closeModal', true)
}


function closeModal() {
    if (!search.value.length) emits('closeModal', true)

    search.value = ''
}
</script>
