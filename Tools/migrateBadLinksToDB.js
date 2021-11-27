async function run() {
    const mongoose = require('mongoose')
    var { Schema, model } = mongoose
    const fs = require('fs')
    const scam = new Schema({
        website: String
    }, {
        minimize: false
    });

    var scamSchema = model('scam', scam);
    await mongoose.connect("mongodb://VQUzCLSs60TpfFcT9AViaS0VlVDlBTpLXTRrRdkCRO6mXkCCcYHV1us2k3DksZXd:fY2EL8sTwdVZRcvXssyb8jh85ut5hy6gbIcsYeDQxMUwd8O6x6loUumhxz3LKgqt@localhost:27017", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
    var links = await fs.readFileSync('../Assets/badLinks.txt')
    links = await links.toString().split('\n')
    links.forEach(async (link, index) => {
        if (link.length > 0) {
            await scamSchema.create({ website: link })
        }
        if(index == links.length-1){
            await mongoose.disconnect()
            console.log(`Successfully finished, added ${links.length} links.`)
            process.exit()
        }
    })
}
run()