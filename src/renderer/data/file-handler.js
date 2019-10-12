// https://medium.com/@brandonstilson/lets-encrypt-files-with-node-85037bea8c0e

import fs from 'fs'
import zlib from 'zlib'
import stream from 'stream'

import AppendInitVect from './AppendInitVectStream'
import { createCipherStream, createDecipherStream } from './encryption-handler'

function StringToStream (text) {
    const s = stream.Readable()
    s.push(text)
    s.push(null)

    return s
}

export const saveToFile = (filePath, text, key) => {
    return new Promise((resolve, reject) => {
        const [ initVect, cipherSteam ] = createCipherStream(key)
        const appendInitVect = new AppendInitVect(initVect)
        const writeStream = fs.createWriteStream(filePath)
        const gzip = zlib.createGzip()
        const readStream = StringToStream(text)

        readStream
            .pipe(gzip)
            .pipe(cipherSteam)
            .pipe(appendInitVect)
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', (e) => reject(e))
    })
}

export const loadTextFromFile = (filePath, key) => {
    return new Promise((resolve, reject) => {
        const readInitVect = fs.createReadStream(filePath, { start: 0, end: 15 })

        let initVect
        readInitVect.on('data', (chunk) => {
            initVect = chunk
        })
            .on('error', (e) => reject(e))

        readInitVect.on('close', () => {
            const decipher = createDecipherStream(key, initVect)
            const readStream = fs.createReadStream(filePath, { start: 16 })
            const unzip = zlib.createUnzip()

            let textData = ''

            readStream
                .pipe(decipher)
                .pipe(unzip)
                .on('data', (chunk) => {
                    textData += chunk.toString()
                })
                .on('end', () => resolve(textData))
                .on('error', (e) => reject(e))
        })
    })
}

export default {
    saveToFile,
    loadTextFromFile
}
