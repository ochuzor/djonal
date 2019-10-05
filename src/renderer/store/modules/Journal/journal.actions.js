import {
    SAVE_ENTRY,
    SET_ENTRY_LIST
} from './journal.constants'

import db from '../../../db'

const actions = {
    loadEntryList ({ commit }) {
        return db.getEntryTopicList()
            .then(ls => commit(SET_ENTRY_LIST, ls))
    },

    saveEntry ({ commit }, entry) {
        return db.saveEntry(entry)
            .then((data) => {
                commit(SAVE_ENTRY, Object.assign({}, data))
                return data
            })
    }
}

export default actions
