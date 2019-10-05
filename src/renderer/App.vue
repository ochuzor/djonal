<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
    name: 'djonal',
    created () {
        this.loadEntryList()
    },

    methods: {
        ...mapActions(['loadEntryList'])
    }
}
</script>

<style>
  /* CSS */
</style>
