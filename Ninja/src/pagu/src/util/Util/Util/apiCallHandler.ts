var axios = require('axios')
var delay = (ms:number) => new Promise(resolve => setTimeout(resolve, ms))
module.exports = async function (url: String) {
    var response:any;
    await axios.get(url).then((res:any) => {
        return response = res
        }).catch(async (e:any)=> {
            if(e.response.status==400) {
                return response = {
                    "status": 400,
                    "message": "Bad Request",
                    "cause": e.response.cause
                }
            }
            else if(e.response.status==403) {
                return response = {
                    "status": 403,
                    "message": "Invalid API key",
                    "cause": e.response.cause
                }
            }
            else if(e.response.status==429) {
                await delay(e.response.headers['Retry-After']*1000)
                return response = await module.exports(url )
            }
        })
    return response
}