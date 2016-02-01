var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Users = require('./users')

var SearchSchema = new Schema({
  query: { type: String },
  timestamp: { type: Date },
  user: { type: Schema.Types.ObjectId, ref: 'Users' },
  results: { type: String }
});

module.exports = mongoose.model('Search', SearchSchema);
