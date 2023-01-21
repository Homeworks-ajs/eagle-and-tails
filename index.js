#!/usr/bin/env node
const yargs = require('yargs/yargs')
const {hideBin} = require('yargs/helpers')
const Analizer = require("./Analizer");
const Score = require("./Score");
const readline = require('node:readline/promises');
const {stdin: input, stdout: output} = require('node:process');

const {
    safeApply, asyncWriteData, resolvePath, asyncGetData
} = require('./utills');
const fs = require("node:fs");

let path_to_log = "./default.log.json";

const line = yargs(hideBin(process.argv))
    .command({
        command: 'log <path>',
        aliases: ["l"],
        handler: ({path}) => {
            const safeResolve = safeApply(resolvePath, path);
            path_to_log = safeResolve();
            game().then((data) => {
                readAndWriteLog(path_to_log, data)
            }).catch((e) => console.log(e.message))
        }

    }).command({
        command: 'analyze [path]',
        aliases: ["a"],
        handler: ({path}) => {
            if(path) {
                const safeResolve = safeApply(resolvePath, path);
                path_to_log = safeResolve();
                asyncGetData(path_to_log, JSON.parse).then((data) => {
                    const {total, winCount} = Analizer.compute(data.games);

                    console.log(`Всего игр ${total}`)
                    console.log(`Всего побед ${winCount} и поражений ${total - winCount}`)
                    console.log(`Процент побед ${(winCount / total * 100).toFixed(1)}`)
                })
            }
        }
    })
    .command({
        command: 'create-log [path]',
        aliases: ["c"],
        handler: ({path}) => {
            if(path) {
                if(fs.existsSync(path)) return;
                asyncWriteData(path, {games: []}, (data) => JSON.stringify(data, null, 2))
                    .catch((err) => console.log(err.message))
            }
        }
    })
    .command({
        command: '*',
        handler: () => {
            game().then((data) => {
                readAndWriteLog(path_to_log, data)
            }).catch((e) => console.log(e.message))
        }
    }).argv

function readAndWriteLog(path, score) {
    asyncGetData(path, JSON.parse)
        .then((logs) => {
            logs.games.push(score);
            return logs;
        })
        .then((data) => asyncWriteData(path, data, (a) => JSON.stringify(a, null, 2)))
}

async function game() {
    const rl = readline.createInterface({input, output});

    const rnm = Math.random() <= .5 ? 1 : 2;
    let answer = "";
    console.log('Я загадал число, отгадай его: 1 или 2');
    answer = await rl.question('Введи число:\n');
    rl.close()
    if (!answer) {
        throw new Error("Нужно обязательно что-то ввести(")
    }
    const d = parseInt(answer)
    if (!d) {
        throw new Error("Это должно быть число")
    }
    if (d === rnm) {
        console.log("Отгадал!");
        return new Score(rnm, d, true)
    } else {
        console.log("Не отгадал!");
        return new Score(rnm, d, false)
    }
}