<template>
<!-- https://codepen.io/anon/pen/xGyMjM https://stackoverflow.com/a/31648405 -->
    <div class="wrapper">

        <div class="top-nav">
            <div>
                <button @click="createNew">New File</button>
                <button @click="openFile">Open File</button>
                <button @click="saveToFile">Save File</button>
            </div>

            <div>
                <input type="text" v-model.trim="searchTerm" />
            </div>
        </div>

      <div class="side-nav">
        <div :class="['entry-list-itm', entry.id === selectedEntry.id ? 'selected-item' : '']" 
            v-for="entry in entries" :key="entry.id" @click="selectEntry(entry)">
            <span v-html="entry.text"></span>
        </div>
      </div>

      <div class="content-wrapper">
        <div>
            <button @click="createNewEntry()">+</button>
            <button @click="deleteItem(selectedEntry)">delete</button>
            <button @click="saveChanges(selectedEntry)">save</button>
        </div>

        <medium-editor :text="selectedEntry.text" @edit="editText" />
      </div>

    </div>
</template>

<script>
import _ from 'lodash'
import shortid from 'shortid'
import data from '../data'
import { mapGetters, mapActions } from 'vuex'
import editor from 'vue2-medium-editor'

import { getUserConfirmation } from '../dialog-handlers'

export default {
    components: {
        'medium-editor': editor
    },

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
        ...mapActions(['loadEntries', 'saveEntry', 'saveDataToFile',
            'loadFromFile', 'newFile', 'deleteEntry']),

        deleteItem (item) {
            getUserConfirmation()
                .then((isConfirmed) => {
                    return isConfirmed ? this.deleteEntry(item.id) : null
                })
                .then(this.createNewEntry)
                .catch(console.error)
        },

        saveChanges (item) {
            if (item && !_.isEmpty(item.text)) {
                this.saveEntry(item)
                    .catch(e => console.log('something aint right', e))
            }
        },

        selectEntry (item) {
            data.getOne(item.id)
                .then(entry => {
                    this.selectedEntry = Object.assign({}, entry)
                })
                .catch(err => {
                    console.error('could not get item', item.id, err)
                })
        },

        createNewEntry () {
            const id = shortid.generate()
            this.selectedEntry = { id, text: '' }
        },

        saveToFile () {
            this.saveDataToFile()
                .catch(errResp => {
                    console.error(errResp.name)
                })
        },

        openFile () {
            this.loadFromFile()
                .then(this.createNewEntry)
                .catch(errResp => {
                    console.error(errResp.name)
                })
        },

        createNew () {
            this.newFile()
                .then(this.createNewEntry)
                .catch(console.error)
        },

        editText (operation) {
            // console.log('text ->', operation.api.origElements.innerHTML)
            this.selectedEntry.text = operation.api.origElements.innerHTML
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
    $color-primary-dark:  #826121;
    $color-primary-light: #d3b340;
    $color-secondary-dark: #836e4d;
    $color-secondary-light: #cfc96c;
    $color-tertiary: #ece7ce;

    .wrapper {
        width: 100%;
        // background-color: #fff;
    }

    .top-nav {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 60px;
        width: 100%;
        background-color: $color-primary-light;
    }

    .side-nav {
        position: fixed;
        top: 60px;
        left: 0;
        right: 0;
        width: 250px;
        height: calc(100% - 60px);
        overflow-y: auto;
        background-color: $color-secondary-light;
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
    }

    .entry-list-itm {
        background-color: $color-tertiary;

        // https://css-tricks.com/almanac/properties/t/text-overflow/
        text-overflow: ellipsis;

        /* Required for text-overflow to do anything */
        white-space: nowrap;
        overflow: hidden;

        height: 42px;
        padding: 3px;
        border-bottom: 1px solid #aaa;
        cursor: pointer;
        font-size: 14pt;
        
        &.selected-item {
            background-color: $color-primary-light;
            color: #fff;
        }
    }

    textarea.edit-box {
        font-size: 18pt;
    }
</style>>
