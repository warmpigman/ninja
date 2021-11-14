"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Path = require("path");
const fs = require("fs");
module.exports = function (options, paguClient) {
    try {
        async function registerSchemas(path, sub) {
            fs.readdirSync(path).forEach((file) => {
                const schema = require(Path.join(path, file));
                if (sub)
                    paguClient.schemas[sub].set(Path.basename(file, Path.extname(file)), schema);
                else
                    paguClient.schemas.set(Path.basename(file, Path.extname(file)), schema);
            });
        }
        if (options.optionsregisterSchemas || options.options.schemaDir) {
            let path = Path.join(process.cwd(), options.options.schemaDir ?? "dist/src/Schemas");
            if (!fs.existsSync(path))
                path = Path.join(__dirname, "dist/src/schemas");
            if (!fs.existsSync(path))
                throw "The \"schemas\" folder could not be found \n Try putting initalizing the client with a schemaDir leading to your schemas folder.";
            registerSchemas(path);
        }
        registerSchemas(Path.join(__dirname, "../../../../schemas"), "internal");
    }
    catch (e) {
        paguClient.Util.log(__filename, "error", e, true);
    }
};
