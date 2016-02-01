var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  pwd: { type: String, select: false, required: true },
  email: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  phone: { type: String, default: null },
  votes: {
    count: { type: Number, default: 0 },
    ballots: [{
      _id: { select: false },
      id: { type: String },
      title: { type: String },
      like: { type: Boolean }
    }]
  },
  signupDate: { type: Date, default: null },
  lastLogin: { type: Date, default: null },
  lastUpdate: { type: Date, default: null },
  updateCount: { type: Number, default: 0 }
});
UserSchema.index({ "firstName": "text", "lastName": "text", "email": "text", "username": "text" });
module.exports = mongoose.model('Users', UserSchema);
