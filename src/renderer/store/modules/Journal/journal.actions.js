import db from '../../../data'
import {
    SET_ENTRY_LIST,
    SAVE_ENTRY
} from './journal.constants'

const actions = {
    initDb ({ commit }, options) {
        console.log('init db ->', options)
    },

    loadEntries ({ commit }) {
        return db.getAll()
            .then(docs => {
                commit(SET_ENTRY_LIST, docs)
                return docs
            })
    },

    saveEntry ({ commit }, data) {
        return db.saveDoc(data)
            .then(doc => {
                commit(SAVE_ENTRY, doc)
                return doc
            })
    }
}

export default actions
