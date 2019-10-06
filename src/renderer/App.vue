<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'djonal',
    async created () {
        await this.initDb()
        await this.loadEntryList()
    },

    methods: {
        ...mapActions(['loadEntryList', 'initDb'])
    }
}
</script>

<style>
  /* CSS */
</style>
