const SET_DATA_FOLDER = 'SET_DATA_FOLDER'

const DATA_FOLDER_PATH_KEY = 'DATA_FOLDER_PATH_KEY'

const state = {
    isAuthenticated: false,
    dataFolder: localStorage.getItem(DATA_FOLDER_PATH_KEY) || null
}

const mutations = {
    [SET_DATA_FOLDER] (state, folderPath) {
        state.dataFolder = folderPath
        if (folderPath) localStorage.setItem(DATA_FOLDER_PATH_KEY, folderPath)
        else localStorage.removeItem(DATA_FOLDER_PATH_KEY)
    }
}

const actions = {
    setDataFolder ({ commit }, folderPath) {
        commit('SET_DATA_FOLDER', folderPath)
    },

    logOut ({ commit }) {
        commit('SET_DATA_FOLDER', '')
    }
}

const getters = {
    isAuthenticated: (state) => !!state.dataFolder
}

export default {
    state,
    mutations,
    actions,
    getters
}
