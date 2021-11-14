var Util = require('../util')
var {Collection} = require('@discordjs/collection')
var util = require('../../../../../node_modules/discord.js/src/util/Util.js')
/** 
 * internal guild cache handler
 * @extends {EventEmitter}
 */
class guildCacheHandler extends Collection {

    toJSON() {
        return this.map((e:any) => (typeof e?.toJSON === 'function' ? e.toJSON() : util.flatten(e)));
      }
      
}
    module.exports = guildCacheHandler