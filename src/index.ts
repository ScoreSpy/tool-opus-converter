import { access } from 'node:fs/promises'
import { askQuestion, keyPress } from './methods'
import { constants } from 'node:fs'
import { cpus } from 'node:os'
import { hideBin } from 'yargs/helpers'
import { resolve } from 'node:path'
import opusConverter from './opusConverter'
import yargs from 'yargs'

async function init() {
    console.log('ScoreSpy Opus Converter - 17/03/2023')
    console.log('--help for help\n')
    const argv = yargs(hideBin(process.argv)).argv as { [x: string]: string }

    const config = {
        path: ((process as any).pkg) ? process.cwd() : __dirname,
        threads: cpus().length
    }

    if (argv.help || argv.h) {
        console.log('-p OR --path | Specify target directory')
        console.log('-t OR --threads | Specify thread count')
        console.log('-h OR --help | Display help')
        return
    }

    if (argv.path) { config.path = resolve(argv.path) }
    if (argv.p) { config.path = resolve(argv.p) }

    if (argv.threads) { config.threads = parseInt(argv.threads, 10) }
    if (argv.t) { config.threads = parseInt(argv.t, 10) }

    if (isNaN(config.threads) || config.threads < 1) {
        throw new Error(`invalid thread count: ${config.threads}`)
    }

    try {
        await access(config.path, constants.F_OK)
    } catch (error) {
        throw new Error(`invalid path: ${config.path}`)
    }

    console.log('\n')
    console.log('-- CONFIG --')
    console.log('Path: ', config.path)
    console.log('Threads: ', config.threads)
    console.log('-- END CONFIG --\n')

    try {
        await askQuestion('Infomation correct? "Yes" or "No"', 'yes')
    } catch (error) {
        throw new Error('user abort')
    }

    try {
        await opusConverter(config)
    } catch (error) {
        console.error('Unhandled exception')
        throw new Error(error)
    }
}

init().then(() => {
    keyPress()
}).catch((e) => {
    console.error(e);
    keyPress()
})

setInterval(() => {
    // nasty hack that stops the terminal quitting out
}, 2147483647);