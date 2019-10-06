import FlexSearch from 'flexsearch'

const indexer = new FlexSearch({
    doc: {
        id: 'id',
        field: ['text', 'tags']
    }
})

const addToIndex = (item) => {
    console.log(`adding ${item.id} to index`)
    indexer.add(item)
}

// const BULK_SIZE = 1000
// const INDEX_INTERVAL = 500
// export function bulkIndex (list) {
//     if (!_.isArray(list)) throw new Error('Invalid data for indexing')
//     if (list.length > 0) {
//         const sub = list.slice(0, BULK_SIZE)
//         const rest = list.slice(BULK_SIZE)

//         indexer.add(sub)

//         setTimeout(bulkIndex.bind(null, rest), INDEX_INTERVAL)
//     } else console.log('Indexing complete!!!')
// }

export default indexer

export {
    addToIndex
}
