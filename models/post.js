const mongoose = require('mongoose'),
Schema = mongoose.Schema;
const postSchema = new Schema({
    title: { type:String, default:null },
    author: { type: String, default: null },
    postContent: { type: String, default: null },
    views: {type:Number, default:null},
    likes: { type: Number, default:0 },
    datePosted: { type: String, default:null},
    langCon: {type: String, default:null},
    discription: {type: String, default:null}
});
var post = mongoose.model('post', postSchema);
module.exports = post;