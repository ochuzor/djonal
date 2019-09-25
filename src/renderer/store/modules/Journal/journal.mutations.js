import {SAVE_ENTRY} from './journal.constants'

const mutations = {
    [SAVE_ENTRY] (state) {
        console.log('mutation: saving state')
    }
}

export default mutations
