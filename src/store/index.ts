import axios from 'axios'
import { createStore } from 'vuex'

const API_KEY = "c9155859d90d239f909d2906233816b26cd8cf5ede44702d422667672b58b0cd"

export default createStore({
    state: {
        currencies: [],
        fromCurrency: {
            featured:true,
            hasExternalId:false,
            image:"https://changenow.io/images/sprite/currencies/btc.svg",
            isFiat:false,
            isStable:false,
            name:"Bitcoin",
            supportsFixedRate:true,
            ticker:"btc"
        },
        toCurrency: {
            featured:true,
            hasExternalId:false,
            image:"https://changenow.io/images/sprite/currencies/eth.svg",
            isFiat:false,
            isStable:false,
            name:"Ethereum",
            supportsFixedRate:true,
            ticker:"eth"
        },
        toCurrencyModel: "",
        fromCurrencyModel: "",
        errorExchange: false
    },
    getters: {
    },
    mutations: {
        setCurrencies(state, payload: Array<Object>) {
            state.currencies = payload
        },
        setFromCurrency(state, payload: Object) {
            state.fromCurrency = payload
        },
        setToCurrency(state, payload: Object) {
            state.toCurrency = payload
        },
        setCurrenciesAmount(state, payload) {
            state.fromCurrencyModel = payload.fromMinAmout
            state.toCurrencyModel = payload.toMinAmout

            localStorage.setItem("minAmountFrom", payload.fromMinAmout)
            localStorage.setItem("minAmountTo", payload.toMinAmout)
        },
        setToAmount(state, payload) {
            state.toCurrencyModel = +payload
        },
        setFromAmount(state, payload) {
            state.fromCurrencyModel = +payload
        },
        setShowErrorExchange(state, payload) {
            state.errorExchange = payload
        }
    },
    actions: {
        async getAllCurrencies({ commit }) {
            try {
                const response = await axios("https://api.changenow.io/v1/currencies?active=true&fixedRate=true")

                if (response.status === 200) {
                    commit("setCurrencies", response.data)
                }
            } catch (error) {
                console.log(error)
            }
        },
        async setMinAmount({ commit, state }, payload) {
            try {
                const minAmountFrom = state.fromCurrencyModel
                console.log('reponse')
                const response = await axios(`https://api.changenow.io/v1/min-amount/${payload.from}_${payload.to}?api_key=${API_KEY}`)
                const responseExchange = await axios(`https://api.changenow.io/v1/exchange-amount/${response.data.minAmount}/${payload.from}_${payload.to}?api_key=${API_KEY}`)
                
                commit("setCurrenciesAmount", {
                    fromMinAmout: response.data.minAmount,
                    toMinAmout: responseExchange.data.estimatedAmount
                })

                commit("setToAmount", responseExchange.data.estimatedAmount)

                commit("setShowErrorExchange", false)
            } catch (error) {
                
            }
        },
        async onChangeAmount({ commit, state }, payload) {
            try {
                console.log('check', payload)
                const response = await axios(`https://api.changenow.io/v1/min-amount/${payload.from}_${payload.to}?api_key=${API_KEY}`)
            
                if (response.error)  {
                    commit("setShowErrorExchange", true)
                } else {
                    const responseExchange = await axios(`https://api.changenow.io/v1/exchange-amount/${payload.amount}/${payload.from}_${payload.to}?api_key=${API_KEY}`)
                
                    commit("setCurrenciesAmount", {
                        fromMinAmout: payload.amount,
                        toMinAmout: responseExchange.data.estimatedAmount
                    })

                    commit("setShowErrorExchange", false)
                }
            } catch (error) {
                commit("setShowErrorExchange", true)
                alert('This pair is disabled now')
            }
            
        }
    },
    modules: {
    }
})
