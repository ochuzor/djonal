import {SAVE_ENTRY} from './journal.constants'

const mutations = {
    [SAVE_ENTRY] () {
        console.log('saving entry')
    }
}

export default mutations
