import * as Chalk from "chalk";
module.exports = function (path: string, type: string, data: any, fatal = false) {

    switch (typeof data) {
        case "object": {
            if(data instanceof Error) break;
             data = JSON.stringify(data, null, "\t")
            break;
        }
        case "string": {
            data = Chalk.bold(data)
            break;
        }
        default: {
            data = data.toString()
            break;
        }
    }
    switch (type.toLowerCase()) {
        case "error": {
            console.log(Chalk.bold(`${Chalk.bgRedBright('ERROR')}${Chalk.redBright(` in ${path}, Fatal:${fatal}`)}:`), data)
            if (fatal) process.exit(1)
            break;
        }
        case "log": {
            console.log(Chalk.bold(`${Chalk.bgCyan('LOG')}${Chalk.cyanBright(` from ${path}`)}:`), data)
            break;
        }
        case "warn": {
            console.log(Chalk.bold(`${Chalk.bgYellowBright('warn')}${Chalk.yellowBright(` from ${path}`)}:`), data)
            break;
        }
        case "success": {
            console.log(Chalk.bold(`${Chalk.bgGreenBright('SUCCESS')}${Chalk.greenBright(` from ${path}`)}:`), data)
            break;
        }
        default: {
            console.log(Chalk.bold(`${Chalk.bgCyan(`LOG - ${type}`)}${Chalk.cyanBright(` from ${path}`)}:${data}`))
            break;
        }
    }
}