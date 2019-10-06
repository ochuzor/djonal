<template>
<!-- https://codepen.io/anon/pen/xGyMjM https://stackoverflow.com/a/31648405 -->
    <div class="wrapper">

        <div class="top-nav">
            <input type="text" v-model.trim="searchTerm" />
        </div>

      <div class="side-nav">
        <div class="entry-list-itm" v-for="entry in entries" :key="entry.id" @click="selectEntry(entry)">
            {{entry.text}}
        </div>
      </div>

      <div class="content-wrapper">
        <div>
            <button @click="createNewEntry()">new</button>
            <button @click="saveChanges(selectedEntry)">save</button>
        </div>
        <textarea v-model="selectedEntry.text" placeholder="select or create a new entry to edit"></textarea>
      </div>

    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import shortid from 'shortid'
import db from '../db'

export default {
    data () {
        return ({
            selectedEntry: {
                id: shortid.generate(),
                text: ''
            },
            searchTerm: ''
        })
    },

    methods: {
        ...mapActions(['saveEntry']),

        saveChanges (item) {
            this.saveEntry(item)
                // .then(res => console.log('res ->', res))
                .catch(e => console.log('something aint right', e))
        },

        selectEntry (item) {
            db.getItem(item.id)
                .then(entry => {
                    this.selectedEntry = Object.assign({}, entry)
                })
                .catch(err => {
                    console.error('could not get item', item.id, err)
                })
        },

        createNewEntry () {
            const id = shortid.generate()
            this.selectedEntry = { id, text: 'eh...' }
        }
    },

    computed: {
        ...mapGetters(['getEntries']),
        entries: function () {
            return this.getEntries(this.searchTerm)
        }
    }
}
</script>

<style lang="scss">
    .wrapper {
        width: 100%;
        background-color: #fff;
    }

    .top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        width: 100%;
        background-color: green;
    }

    .side-nav {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        width: 250px;
        height: calc(100% - 60px);
        overflow-y: auto;
        background-color: red;
    }

    .content-wrapper {
        margin: 60px 0 0 250px;
        // padding: 0 30px;
        padding: 0;
        overflow-y: auto;
        position: fixed;
        left: 0;
        top: 0;
        height: calc(100% - 60px);;
        width: 100%;
        background-color: lightcyan;

        textarea {
            width: 98%;
            height: 100%;
        }
    }

    .entry-list-itm {
        background-color: #fff;

        // https://css-tricks.com/almanac/properties/t/text-overflow/
        text-overflow: ellipsis;

        /* Required for text-overflow to do anything */
        white-space: nowrap;
        overflow: hidden;

        height: 42px;
        padding: 3px;
    }
</style>>
