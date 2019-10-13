import _ from 'lodash'
import FlexSearch from 'flexsearch'

class DataIndexer {
    constructor () {
        this._indexer = new FlexSearch({
            doc: {
                id: 'id',
                field: ['text']
            }
        })
    }

    initWith (data) {
        this._indexer.import(data)
    }

    getDocument (id) {
        return Object.assign({}, this._indexer.find(id))
    }

    getAll () {
        const data = JSON.parse(this._indexer.export({index: false, doc: true}))
        const docs = _.values(_.first(data))
        return _.cloneDeep(docs)
    }

    addToIndex (doc) {
        this._indexer.add(doc)
    }

    removeFromIndex (id) {
        this._indexer.remove({id})
    }

    search (term) {
        return _.cloneDeep(this._indexer.search(term))
    }

    toString () {
        return this._indexer.export()
    }
}

export default DataIndexer

export {
    DataIndexer
}
