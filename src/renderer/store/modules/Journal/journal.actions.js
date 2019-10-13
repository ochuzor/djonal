import db from '../../../data'
import {
    SET_ENTRY_LIST,
    SAVE_ENTRY
} from './journal.constants'
import _ from 'lodash'

const vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

const { dialog } = require('electron').remote

const getUserPassword = () => {
    return new Promise((resolve) => {
        vex.dialog.prompt({
            message: 'Enter password',
            placeholder: 'Password',
            callback: resolve
        })
    })
}

const getUserConfirmation = (message = 'Are you sure?') => {
    return new Promise(resolve => {
        vex.dialog.confirm({
            message,
            callback: resolve
        })
    })
}

class FileSaveCancelledError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FileSaveCancelledError'
    }
}

const actions = {
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
        const getFileSavePath = () => Promise.resolve(dialog.showSaveDialog())
        const getFilePathAndPassword = () => {
            return getFileSavePath()
                .then((fpath) => {
                    return getUserPassword()
                        .then((password) => [fpath, password])
                })
        }

        return new Promise((resolve, reject) => {
            const {filePath, key} = db.getConfig()
            const prom = filePath ? Promise.resolve([filePath, key]) : getFilePathAndPassword()
            prom.then(([filePath, key]) => {
                if (!filePath) throw new FileSaveCancelledError('Saving cancelled')
                if (!key) throw new Error('Invalid key')

                return db.setConfig({filePath, key})
            })
                .then(() => db.saveToFile())
                .catch(reject)
        })
    },

    loadFromFile ({ dispatch, state }) {
        return new Promise((resolve, reject) => {
            if (state.Entries.length && !db.getConfig().filePath) {
                getUserConfirmation('Save current file?')
                    .then(isConfirmed => {
                        return isConfirmed ? dispatch('saveDataToFile') : dispatch('openFile')
                    })
                    .then(resolve)
                    .catch(reject)
            } else {
                dispatch('openFile')
                    .then(resolve)
                    .catch(reject)
            }
        })
    },

    openFile ({ dispatch }) {
        return new Promise((resolve, reject) => {
            const filePath = _.first(dialog.showOpenDialog())

            if (filePath) {
                getUserPassword()
                    .then(password => {
                        return db.loadData(filePath, password)
                            .then(() => dispatch('loadEntries'))
                            .then(resolve)
                    })
                    .catch(reject)
            }
        })
    },

    newFile ({ dispatch, state }) {
        return new Promise((resolve, reject) => {
            const dbChanges = () => db.startNew().then(() => dispatch('loadEntries'))
            if (state.Entries.length && !db.getConfig().filePath) {
                getUserConfirmation('Save current file?')
                    .then(resp => {
                        return resp ? dispatch('saveDataToFile') : dbChanges()
                    })
                    .then(resolve)
                    .catch(reject)
            } else {
                dbChanges()
                    .then(resolve)
                    .catch(reject)
            }
        })
    }
}

export default actions
