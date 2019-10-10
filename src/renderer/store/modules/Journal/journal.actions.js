import db from '../../../data'
import {
    SET_ENTRY_LIST,
    SAVE_ENTRY
} from './journal.constants'
import _ from 'lodash'

const { dialog } = require('electron').remote

class FileSaveCancelledError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FileSaveCancelledError'
    }
}

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

                const filePath = db.getConfig().filePath
                if (filePath) db.saveToFile()

                return doc
            })
    },

    saveDataToFile () {
        return new Promise(resolve => {
            const filePath = db.getConfig().filePath || dialog.showSaveDialog()
            if (!filePath) throw new FileSaveCancelledError('Saving cancelled')

            db.setConfig({filePath})
                .then(() => db.saveToFile())
                .then(resolve)
        })
    },

    loadFromFile ({ dispatch }) {
        return new Promise(resolve => {
            const filePath = _.first(dialog.showOpenDialog())
            if (filePath) {
                db.loadData(filePath)
                    .then(() => dispatch('loadEntries'))
                    .then(resolve)
            }
            resolve()
        })
    }
}

export default actions
