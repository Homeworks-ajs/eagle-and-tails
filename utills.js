const fs = require("node:fs");
const path = require("path");

function asyncGetData(path, dateHandler = (data) => data) {
    const read = fs.createReadStream(path).setEncoding("UTF8");

    return new Promise((resolve, reject) => {
        let data = "";
        read.on("data", (chunk) => {
            data += chunk;
        })
        read.on("end", () => {
            read.close();
            resolve(dateHandler(data));
        })
    })
}

function asyncWriteData(path, writeData, dateHandler = (data) => data) {
    const writeStream = fs.createWriteStream(path);

    return new Promise((resolve, reject) => {
        writeStream.write(dateHandler(writeData))

        writeStream.on("error", () => {
            reject(true);
        })
    })
}


function resolvePath(logPath) {
    if (!fs.existsSync(logPath)) {
        throw new Error(`Path <${logPath}> doesn't exist`);
    }

    if (path.extname(logPath) !== ".json") {
        throw new Error(`Extension of log file must be .json`);
    }
    return logPath;
}

function safeApply(func, arg) {
    return () => {
        try {
            return func(arg);
        } catch (e) {
            console.log(e.message)
        }
    }
}

module.exports = {
    safeApply, asyncWriteData, resolvePath, asyncGetData
}