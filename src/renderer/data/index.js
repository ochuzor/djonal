import _ from 'lodash'
import { DataIndexer } from '../indexer'

const config = {
    key: null,
    filePath: null,
    indexer: new DataIndexer()
}

const loadData = (key) => {
    return new Promise(resolve => {
        // const indexer = new DataIndexer()
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

export default {
    loadData,
    getAll,
    getOne,
    saveDoc,
    search
}
