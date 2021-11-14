module.exports = async function (target: any, data: any, paguClient: any) {
    var balSchema = paguClient.schemas.get("bal")
    data = new balSchema({
        ID: target,
        bal: 0,
        claims: {
            lastWork: new Date(0),
            lastRoll: new Date(0),
            lastDaily: new Date(0),
            lastWeekly: new Date(0),
            lastMonthly: new Date(0)
        },
        inventory: {},
        safe: false,
        cache: {
            amountReceived: 0,
            amountGiven: 0,
            dupeWeekly: 0,
            job: "none",
        }
    })
    await data.save()
    return data
}