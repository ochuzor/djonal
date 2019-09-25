import mutations from './Journal/journal.mutations'
import actions from './Journal/journal.actions'

const state = {
    Entries: [
        {id: 1, text: 'something'}
    ]
}

export default {
    state,
    mutations,
    actions
}
