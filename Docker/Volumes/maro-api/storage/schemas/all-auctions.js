const mongoose = require('mongoose');
const allAuctionSchema = new mongoose.Schema({
  id: String,
  many: {
    sales: Array,
    auction: Object
  }
});
module.exports = mongoose.model('all-auctions', allAuctionSchema, 'all-auctions');
