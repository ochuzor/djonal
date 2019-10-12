import _ from 'lodash'
// import fs from 'fs'

import { DataIndexer } from '../indexer'
import { getCipherKey } from './encryption-handler'
import * as fileHandler from './file-handler'

const config = {
    key: null,
    filePath: null,
    indexer: new DataIndexer()
}

const loadData = (filePath, password) => {
    return new Promise((resolve, reject) => {
        const key = getCipherKey(password)
        fileHandler.loadTextFromFile(filePath, key)
            .then((textData) => {
                const indexer = new DataIndexer()
                indexer.initWith(textData)

                config.key = key
                config.indexer = indexer
                config.filePath = filePath
            })
            .then(resolve)
            .catch(reject)
    })
}

const startNew = () => {
    return new Promise(resolve => {
        config.key = null
        config.filePath = null
        config.indexer = new DataIndexer()

        resolve()
    })
}

const getAll = () => {
    return new Promise(resolve => {
        resolve(config.indexer.getAll())
    })
}

const getOne = (id) => {
    return new Promise(resolve => {
        resolve(config.indexer.getDocument(id))
    })
}

const saveDoc = (data) => {
    return new Promise(resolve => {
        const doc = _.pick(data, ['id', 'text'])
        config.indexer.addToIndex(doc)
        resolve(Object.assign({}, doc))
    })
}

const search = (searhTerm) => {
    return config.indexer.search(searhTerm)
}

const getConfig = () => {
    return _.pick(config, ['filePath', 'key'])
}

const setConfig = (opts) => {
    const filePath = opts.filePath
    _.assign(config, {filePath, key: getCipherKey(opts.key)})

    return Promise.resolve()
}

const saveToFile = () => {
    return new Promise((resolve, reject) => {
        const { filePath, key, indexer } = config
        const text = indexer.toString()
        fileHandler.saveToFile(filePath, text, key)
            .then(resolve)
            .catch(reject)
    })
}

export default {
    loadData,
    getAll,
    getOne,
    saveDoc,
    search,
    getConfig,
    setConfig,
    saveToFile: _.throttle(saveToFile, 1000),
    startNew
}
