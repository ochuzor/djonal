<template>
  <div>
    <button @click="selectDataFolder">choose folder</button>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
const { dialog } = require('electron').remote
const _ = require('lodash')

export default {
    data () {
        return ({})
    },

    methods: {
        ...mapActions(['setDataFolder']),

        selectDataFolder () {
            const folders = dialog.showOpenDialog({ properties: [ 'openDirectory' ], title: 'Choose data folder' })
            const selectedFolder = _.first(folders)
            if (!_.isEmpty(selectedFolder)) {
                this.setDataFolder(selectedFolder)
                    .then(() => {
                        return this.$router.push('/')
                    })
                    .catch(console.error)
            }
        }
    }
}
</script>
