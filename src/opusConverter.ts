import { getFiles, ConvertFile } from './methods'
import { parse } from 'node:path'
import { rm } from 'node:fs/promises'
import PQueue from 'p-queue'

const CloneHeroSupportedFormats = ['.ogg', '.mp3', '.wav']

export default async function (options: { path: string, threads: number }) {
    console.log('Scanning for audio files')

    const files = await getFiles(options.path)

    const songFileIndex = files.filter((f) => {
        const p = parse(f)
        return CloneHeroSupportedFormats.includes(p.ext.toLowerCase())
    })

    console.log(`Found ${songFileIndex.length} files eligible for conversion to .opus`)

    const queue = new PQueue({ concurrency: options.threads })

    const songLengths = songFileIndex.length;
    for (let index = 0; index < songFileIndex.length; index++) {
        queue.add(async () => {
            console.log(`[${index} / ${songLengths}] Convert file: `, songFileIndex[index])
            await ConvertFile(songFileIndex[index])
            console.log(`[${index} / ${songLengths}] Remove file: `, songFileIndex[index])
            await rm(songFileIndex[index])
        })
    }

    await queue.onIdle();
    console.log('processing fininshed!')
}