import {
    SAVE_ENTRY,
    SET_ENTRY_LIST,
    REMOVE_ENTRY
} from './journal.constants'

import _ from 'lodash'

function addOrReplace (array, item) {
    const i = array.findIndex(_item => _item.id === item.id)
    if (i > -1) array.splice(i, 1, item) // array[i] = item
    else array.unshift(item)
}

const mutations = {
    [SET_ENTRY_LIST] (state, list) {
        state.Entries = list
    },

    [SAVE_ENTRY] (state, entry) {
        addOrReplace(state.Entries, entry)
    },

    [REMOVE_ENTRY] (state, id) {
        state.Entries = _.filter(state.Entries, (et) => et.id !== id)
    }
}

export default mutations
