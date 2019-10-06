import _ from 'lodash'
import {EntryItems} from '../store/modules/Journal/journal.data'
import * as indexer from '../indexer'

const LIST_TITLE_CUT_OFF = 100

function addOrReplace (array, item) {
    const i = array.findIndex(_item => _item.id === item.id)
    if (i > -1) array.splice(i, 1, item) // array[i] = item
    else array.unshift(item)
}

const initDb = (lsEntries = EntryItems) => {
    // @todo: first empty the db
    return new Promise((resolve) => {
        lsEntries.map(indexer.addToIndex)

        resolve()
    })
}

const saveEntry = (data) => {
    return new Promise(resolve => {
        const itm = _.pick(data, ['id', 'text'])
        addOrReplace(EntryItems, itm)
        indexer.addToIndex(itm)

        resolve(Object.assign({}, itm))
    })
}

const getEntryTopicList = () => {
    return new Promise((resolve) => {
        const ls = _(EntryItems)
            .map(itm => ({
                id: itm.id,
                text: itm.text.substring(0, LIST_TITLE_CUT_OFF)
            }))
            .value()

        resolve(ls)
    })
}

const getItem = (id) => {
    return new Promise((resolve) => {
        const item = _.find(EntryItems, { id })
        const res = item ? _.pick(item, ['id', 'text']) : item

        resolve(res)
    })
}

export default {
    initDb,
    saveEntry,
    getEntryTopicList,
    getItem
}
