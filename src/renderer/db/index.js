import _ from 'lodash'
import {EntryItems} from '../store/modules/Journal/journal.data'
import indexer, { addToIndex } from '../indexer'

import fs from 'fs'
import path from 'path'

const dbFileName = 'db.txt'
const dbFilePath = path.join('C:\\Projects\\djonal-db', dbFileName)

const LIST_TITLE_CUT_OFF = 100

function addOrReplace (array, item) {
    const i = array.findIndex(_item => _item.id === item.id)
    if (i > -1) array.splice(i, 1, item) // array[i] = item
    else array.unshift(item)
}

const saveToDisk = _.throttle(() => {
    try {
        fs.writeFileSync(dbFilePath, indexer.export(), 'utf-8')
    } catch (e) {
        console.error('error witing file', e)
    }
}, 1500)

const initDb = (lsEntries = EntryItems) => {
    // @todo: first empty the db
    return new Promise((resolve) => {
        lsEntries.map(addToIndex)

        resolve()
    })
}

const saveEntry = (data) => {
    return new Promise(resolve => {
        const itm = _.pick(data, ['id', 'text'])
        addOrReplace(EntryItems, itm)
        addToIndex(itm)
        saveToDisk()

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
