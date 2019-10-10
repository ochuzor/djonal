import _ from 'lodash'
import { DataIndexer } from '../indexer'
import fs from 'fs'

const config = {
    key: null,
    filePath: null,
    indexer: new DataIndexer()
}

const loadData = (filePath) => {
    return new Promise(resolve => {
        console.log('opening file ->', filePath)
        const fileData = fs.readFileSync(filePath, 'utf-8')
        const indexer = new DataIndexer()
        indexer.initWith(fileData)

        config.indexer = indexer
        config.filePath = filePath

        // const key = key
        // @NB: only assign to config AFTER loading is successful
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
    return _.pick(config, ['filePath'])
}

const setConfig = (opts) => {
    const cfg = _.pick(opts, ['key', 'filePath'])
    _.assign(config, cfg)

    return Promise.resolve()
}

const saveToFile = () => {
    return new Promise(resolve => {
        fs.writeFileSync(config.filePath, config.indexer.toString(), 'utf-8')
        resolve()
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
    saveToFile: _.throttle(saveToFile, 1000)
}
