import { readdir } from 'node:fs/promises'
import { resolve, parse, join } from 'node:path'
import * as readline from 'node:readline'
import ffmpeg from 'fluent-ffmpeg'

export async function getFiles(dir: string): Promise<string[]> {
    const dirents = await readdir(dir, { withFileTypes: true });

    const files = await Promise.all(dirents.map((dirent) => {
        const res = resolve(dir, dirent.name);
        return dirent.isDirectory() ? getFiles(res) : res;
    }));

    return Array.prototype.concat(...files);
}

export function ConvertFile(FileLocation: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const fileData = parse(FileLocation)

        ffmpeg(FileLocation)
            .audioCodec('libopus')
            .on('error', function (err) {
                console.error('An error occurred: ' + err.message);
                reject(err)
            })
            .on('end', function () {
                resolve()
            })
            .save(join(fileData.dir, `${fileData.name}.opus`))
    })
}

export function askQuestion (question: string, expected: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const rl = readline.createInterface(process.stdin, process.stdout);
        rl.question(question + '\n', (answer) => {
            if (answer.toLowerCase() !== expected.toLowerCase()) { return reject() }
            return resolve()
        })
    })
}

export async function keyPress (): Promise<void> {
    console.log('\nPress Any Key To Exit')
    process.stdin.setRawMode(true)
    return new Promise(resolve => process.stdin.once('data', data => {
        console.log('\n^C')
        process.exit(1)
    }))
}