async function run() {
    const mongoose = require("mongoose");
    var { Schema, model } = mongoose;
    const fs = require("fs");
    const badWord = new Schema(
        {
            word: String,
            Severity: String
        },
        {
            minimize: false,
        }
    );

    var badWordSchema = model("badWord", badWord);
    await mongoose.connect(
        "mongodb://VQUzCLSs60TpfFcT9AViaS0VlVDlBTpLXTRrRdkCRO6mXkCCcYHV1us2k3DksZXd:fY2EL8sTwdVZRcvXssyb8jh85ut5hy6gbIcsYeDQxMUwd8O6x6loUumhxz3LKgqt@localhost:27019",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        }
    );
    var reallyBadWords = await fs.readFileSync("./Assets/reallyBadWords.txt");
    var maybeBadWords = await fs.readFileSync("./Assets/maybeBadWords.txt");
    reallyBadWords = await reallyBadWords.toString().split("\n");
    maybeBadWords = await maybeBadWords.toString().split("\n");
    reallyBadWords.forEach(async (word, index) => {
        if (link.length > 0) {
            await badWordSchema.create({ word: word, Severity: "rb" });
        }
        if (index == reallyBadWords.length - 1) {
            console.log(`Successfully finished, added ${reallyBadWords.length} really bad words.`);
        }
    });
    maybeBadWords.forEach(async (word, index) => {
        if (link.length > 0) {
            await badWordSchema.create({ word: word, Severity: "mb" });
        }
        if (index == maybeBadWords.length - 1) {
            console.log(`Successfully finished, added ${maybeBadWords.length} maybe bad words.`);
        }
    })
}
run();
