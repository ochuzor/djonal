import db from '../../../data'

export default {
    getEntries: (state) => (searchTerm) => {
        return searchTerm ? db.search(searchTerm) : state.Entries
    }
}
