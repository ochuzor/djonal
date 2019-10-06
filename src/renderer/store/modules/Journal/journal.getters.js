import indexer from '../../../indexer'

export default {
    getEntries: (state) => (searchTerm) => {
        return searchTerm ? indexer.search(searchTerm) : state.Entries
    }
}
