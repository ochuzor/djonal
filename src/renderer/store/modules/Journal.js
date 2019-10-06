import mutations from './Journal/journal.mutations'
import actions from './Journal/journal.actions'
import getters from './Journal/journal.getters'

const state = {
    Entries: []
}

export default {
    state,
    mutations,
    actions,
    getters
}
