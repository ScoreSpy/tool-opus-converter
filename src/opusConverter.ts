import { getFiles, ConvertFile } from './methods'
import { parse } from 'node:path'
import { rm } from 'node:fs/promises'
import Queue from "queue-promise"

const CloneHeroSupportedFormats = ['.ogg', '.mp3', '.wav']

export default async function (options: { path: string, threads: number }) {
    console.log('Scanning for audio files')

    const files = await getFiles(options.path)

    const songFileIndex = files.filter((f) => {
        const p = parse(f)
        return CloneHeroSupportedFormats.includes(p.ext.toLowerCase())
    })

    console.log(`Found ${songFileIndex.length} files eligible for conversion to .opus`)

    const queue = new Queue({ concurrent: options.threads, start: true })

    const songLengths = songFileIndex.length;
    for (let index = 0; index < songFileIndex.length; index++) {
        queue.enqueue(async () => {
            console.log(`[${index} / ${songLengths}] Convert file: `, songFileIndex[index])
            await ConvertFile(songFileIndex[index])
            console.log(`[${index} / ${songLengths}] Remove file: `, songFileIndex[index])
            await rm(songFileIndex[index])
        })
    }

    queue.on("end", () => {
        console.log('processing fininshed!')
    });
}