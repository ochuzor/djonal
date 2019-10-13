const vex = require('vex-js')
vex.registerPlugin(require('vex-dialog'))
vex.defaultOptions.className = 'vex-theme-os'

export const getUserPassword = () => {
    return new Promise((resolve) => {
        vex.dialog.prompt({
            message: 'Enter password',
            placeholder: 'Password',
            callback: resolve
        })
    })
}

export const getUserConfirmation = (message = 'Are you sure?') => {
    return new Promise(resolve => {
        vex.dialog.confirm({
            message,
            callback: resolve
        })
    })
}
