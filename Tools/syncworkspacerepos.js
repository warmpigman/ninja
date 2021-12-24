const exec = require('child_process').exec;
const packageJson = require('../package.json');
const path = require('path')
const dir = __dirname.includes("Tools") ? path.resolve(__dirname, '../') : __dirname
packageJson.workspaces.packages.forEach(workspace => {
    exec(`rsync -a ${path.join(dir, "node_modules")} ${path.join(dir, workspace)}`, {maxBuffer: 9e999}, (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }
    });
   
    
})