const state = {
    isAuthenticated: true
}

const mutations = {
    DECREMENT_MAIN_COUNTER (state) {
        state.main--
    },
    INCREMENT_MAIN_COUNTER (state) {
        state.main++
    }
}

const actions = {
    someAsyncTask ({ commit }) {
    // do something async
        commit('INCREMENT_MAIN_COUNTER')
    }
}

const getters = {
    isAuthenticated: (state) => state.isAuthenticated
}

export default {
    state,
    mutations,
    actions,
    getters
}
