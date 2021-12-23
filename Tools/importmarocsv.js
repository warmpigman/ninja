(async () => {
    const csv = require('csvtojson');
    const path = require('path')
    const fs = require('fs')
    const mongoose = require('mongoose')
    var i = 0;
    var total = 0;
    await mongoose.connect("mongodb://VQUzCLSs60TpfFcT9AViaS0VlVDlBTpLXTRrRdkCRO6mXkCCcYHV1us2k3DksZXd:fY2EL8sTwdVZRcvXssyb8jh85ut5hy6gbIcsYeDQxMUwd8O6x6loUumhxz3LKgqt@localhost:27019", {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    fs.readdirSync(path.join(__dirname, '../Docker/Volumes/maro-api/backup')).forEach((file, index, arr) => {
        if (file == "players.csv") return;
        if (file == "leaderboards.csv") file = "leaderboard.csv"
        // const Schema = require(path.join(__dirname, '../Docker/Volumes/maro-api/storage/schemas/', path.basename(file, '.csv'))).model(path.basename(file, '.csv')).schema
        const Schema = require(path.join(__dirname, '../Docker/Volumes/maro-api/storage/schemas/', path.basename(file, '.csv'))).schema
        const Model = mongoose.model(file == "leaderboard" ? "leaderboards" : path.basename(file, '.csv'), new mongoose.Schema(Schema))
        csv()
            .fromFile(path.join(__dirname, '../Docker/Volumes/maro-api/backup', file == "leaderboard.csv" ? "leaderboards.csv" : path.basename(file)))
            .then((jsonObj) => {
                Model.find({
                    _id: {
                        $in: jsonObj.map(e => e._id)
                    }
                }, (err, docs) => {
                    if (err) return console.log(err)
                    else {
                        let toAdd = jsonObj.filter(e => !docs.find(e2 => e2._id == e._id))
                        if(toAdd>0) {
                            Model.insertMany(toAdd, (err, docs) => {
                                if (err) console.log(err)
                                else console.log(`Successfully imported ${toAdd.length} ${file}`)
                                total+=toAdd.length
                                i++
                            })
                        } else i++
                        if (i == arr.length - 1) {
                            mongoose.disconnect()
                            console.log(`Successfully finished, ${total==0?"no":total} documents imported.`)
                            process.exit()
                        }
                    }
                })

            })
    })
})()