// https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e
import crypto from 'crypto'

export function getCipherKey (password) {
    return crypto.createHash('sha256').update(password).digest()
}

export function createCipherStream (password) {
    const initVect = crypto.randomBytes(16)
    const CIPHER_KEY = getCipherKey(password)
    const cipherStream = crypto.createCipheriv('aes256', CIPHER_KEY, initVect)

    return [ initVect, cipherStream ]
}

export function createDecipherStream (password, initVect) {
    const cipherKey = getCipherKey(password)
    return crypto.createDecipheriv('aes256', cipherKey, initVect)
}
