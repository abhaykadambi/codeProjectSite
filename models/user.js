const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const userSchema = new Schema({
    email: { type: String, default: null },
    pwd: { type: String, default: null },
    username: { type: String, default:null }
});
var user = mongoose.model('user', userSchema);
module.exports = user;