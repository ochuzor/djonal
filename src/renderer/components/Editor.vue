<script>
    import Quill from 'quill'

    export default {
        props: {
            value: {
                type: String,
                default: ''
            }
        },

        data () {
            return {
                editor: null
            }
        },

        mounted () {
            this.editor = new Quill(this.$refs.editor, {
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, 4, false] }],
                        ['bold', 'italic', 'underline']
                    ]
                },
                placeholder: 'write somethin...',
                theme: 'snow',
                // theme: 'bubble',
                formats: ['bold', 'underline', 'header', 'italic']
            })
            // uses .toString() to sort of get a copy of added string
            this.editor.root.innerHTML = this.value.toString()

            this.editor.on('text-change', () => this.update())
        },

        methods: {
            update () {
                this.$emit('input', this.editor.getText() ? this.editor.root.innerHTML.toString() : '')
            },

            setTextValue (text = '') {
                this.editor.root.innerHTML = text.toString()
            }
        }
    }
</script>

<template>
    <div ref="editor"></div>
</template>
