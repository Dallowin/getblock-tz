<template>
    <div class="container mx-auto lg:my-auto px-4 lg:px-0">
        <div class="flex flex-col place-content-center h-screen">
            <h1 class="text-5xl">Crypto Exchange</h1>
            <h3 class="mt-4">Exchange fast and easy</h3>

            <div class="grid grid-cols-1 lg:grid-cols-11 mt-14 ">
                <div class="col-span-1 lg:col-span-5 flex relative">
                    <input-block v-model="fromCurrencyModel" class="rounded-l" @blur="onChangeFromModel" />
                    <selected-ticker :currency="fromCurrency" @click="stateFromModal = true"/>
                    <modal-list v-show="stateFromModal" :currencyType="'from'" :currencies="currencies" @closeModal="stateFromModal = false" />
                </div>
                <div class="rotate-90 lg:rotate-0 col-span-1 self-center mx-auto my-4 lg:my-0 cursor-pointer" @click="swapCoins()">
                    <swap-icon></swap-icon>
                </div>
                <div class="col-span-1 lg:col-span-5 flex relative">
                    <div v-if="errorExchange" class="absolute w-full h-full z-50 bg-gray-400 opacity-50 cursor-not-allowed"></div>
                    <input-block v-model="toCurrencyModel" class="rounded-l" />
                    <selected-ticker :currency="toCurrency" @click="stateToModal = true"/>
                    <modal-list v-show="stateToModal" :currencyType="'to'" :currencies="currencies" @closeModal="stateToModal = false"  />
                </div>
                
            </div>


            <div class="flex flex-col lg:flex-row items-end mt-6">
                <label for="wallet" class="w-full">
                    <span class="flex mb-2">Your {{ toCurrency.name }} address</span>
                    <input-block v-model="address" aria-placeholder="Your Ethereum address" id="wallet"  class="rounded" />
                </label>
                <button class="text-white uppercase font-medium rounded px-14 py-3 mt-6 lg:mt-0 lg:ml-8 w-full lg:w-auto" :class="[allowedToExchange]" >Exchange</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import store from '../store';
import { computed, nextTick, onMounted, ref, watch } from '@vue/runtime-core';

import SwapIcon from './Icons/SwapIcon.vue';
import ArrowIcon from './Icons/ArrowIcon.vue';
import CloseIcon from './Icons/CloseIcon.vue';
import InputBlock from './InputBlock.vue';
import SelectedTicker from "./SelectedTicker.vue"
import ModalList from './ModalList.vue';




onMounted(async () => {
    await store.dispatch("setMinAmount", {
        from<String>: fromCurrency.value.ticker,
        to<String>: toCurrency.value.ticker
    })
})


const stateToModal = ref<Boolean>(false)
const stateFromModal = ref<Boolean>(false)

const valueToCoin = ref<String>('')
const valueFromCoin = ref<String>('')
const address = ref<String>('')


const fromCurrency: Object = computed(() => {
    return store.state.fromCurrency
})

const toCurrency: Object = computed(() => {
    return store.state.toCurrency
})

const errorExchange: Boolean = computed(() => {
    return store.state.errorExchange
})


const fromCurrencyModel = computed(({
    get() {
      return store.state.fromCurrencyModel
    },
    set(value) {
      store.commit("setFromAmount", value)
    }
}))

const toCurrencyModel = computed(({
    get() {
      return store.state.toCurrencyModel
    },
    set(value) {
        store.commit("setToAmount", value)
    }
}))


const currencies: Array<Object> = computed(() => {
    return store.state.currencies
})

const allowedToExchange = computed(() => {
    if (errorExchange.value) return "bg-sky-300 cursor-not-allowed" 

    if (address.value.length === 0) return "bg-sky-300 cursor-not-allowed" 

    return "bg-sky-500 cursor-pointer" 
})


function swapCoins() {
    const stateToCoin: Object = Object.assign(toCurrency.value)
    const stateFromCoin: Object = Object.assign(fromCurrency.value)

    nextTick(() => {
        store.commit('setToCurrency', stateFromCoin)
        store.commit('setFromCurrency', stateToCoin)
        store.commit('setCurrenciesAmount', {
            fromMinAmout: toCurrencyModel.value,
            toMinAmout: fromCurrencyModel.value
        })
    })
 
    valueToCoin.value = stateFromCoin.name
}

watch(toCurrency, (newValue, beforeValue) => {
    if (newValue != beforeValue) {
        store.dispatch("setMinAmount", {
            from<String>: fromCurrency.value.ticker,
            to<String>: toCurrency.value.ticker
        })
    }
});

watch(fromCurrency, (newValue, beforeValue) => {
    if (newValue != beforeValue) {
        store.dispatch("setMinAmount", {
            from<String>: fromCurrency.value.ticker,
            to<String>: toCurrency.value.ticker
        })
    }
});


function onChangeFromModel(event) {
    const getFromMinAmount = localStorage.getItem("minAmountFrom")

    store.dispatch("onChangeAmount", {
        from<String>: fromCurrency.value.ticker,
        to<String>: toCurrency.value.ticker,
        amount: event.target.value
    })
}



</script>