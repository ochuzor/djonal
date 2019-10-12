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

class FileSaveCancelledError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FileSaveCancelledError'
    }
}

const showWarning = (msg = 'Are you sure?') => {
    return new Promise(resolve => {
        const resp = dialog.showMessageBox({
            title: 'Warning',
            type: 'warning',
            buttons: ['No', 'Yes'],
            message: msg})

        resolve(resp)
    })
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
                .catch(reject)
        })
    },

    loadFromFile ({ dispatch, state }) {
        // @todo REFACTOR
        return new Promise(resolve => {
            if (state.Entries.length && !db.getConfig().filePath) {
                const resp = dialog.showMessageBox({
                    type: 'warning',
                    buttons: ['No', 'Yes'],
                    message: 'Save current file?'})

                const prom = resp ? dispatch('saveDataToFile') : dispatch('openFile')
                prom.then(resolve)
            } else {
                dispatch('openFile').then(resolve)
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
        return new Promise(resolve => {
            const dbChanges = () => db.startNew().then(() => dispatch('loadEntries'))
            if (state.Entries.length && !db.getConfig().filePath) {
                showWarning('Save current file?')
                    .then(resp => {
                        return resp ? dispatch('saveDataToFile') : dbChanges()
                    })
                    .then(resolve)
            } else {
                dbChanges().then(resolve)
            }
        })
    }
}

export default actions
