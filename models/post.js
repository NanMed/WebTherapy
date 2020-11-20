const mongoose = require('mongoose');
const config = require('../config/db');
const User = require('../models/user');
const { post } = require('../routes/principal');

// Post Schema
var PostSchema = new mongoose.Schema({
  title: {type:String, requited:true},
  content: {type:String, required:true},
  createdBy: {type:String},
  iconBy: {type:String},
  roleBy: {type:String},
  likes: {type: Number, default:0},
  dislikes: {type:Number, default:0},
  postTime: {type:String},
  comments: [{
    postId: {type:String},
    comment: {type:String},
    createdBy: {type:String},
    iconBy: {type:String},
    commentTime: {type:String}
  }]
});


const Post = module.exports = mongoose.model('Post', PostSchema);


module.exports.getById = function(id, callback) {
  console.log("find by: "+ id);
 
  Post.findById(id, callback);
 
}
  
module.exports.getPostByTitle = function(title, callback){
  const query = {title: title}
  Post.findOne(query, callback);
}

module.exports.registerLikes = function(post, callback){
  // console.log(post);
  let id = post.id;
  let likes = post.likes;
  Post.updateOne({_id: id}, {likes : likes + 1}, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
};


module.exports.registerDislikes = function(post, callback){
  // console.log(post);
  let id = post.id;
  let dislikes = post.dislikes;
  Post.updateOne({_id: id}, {dislikes : dislikes + 1}, function(err, res) {
    if (err) throw err;
    console.log("1 document updated");
  });
};

module.exports.addComment = function(post, callback){
  console.log("Post en cometarios", post);
  let id = post.postId;
  let comment = post.comment;
  let idUser = post.createdBy;
  let iconUser = post.iconBy;
  let commentT = post.commentTime;
  Post.updateOne({_id: id}, { $push: { comments: { postId: id, comment: comment, createdBy: idUser, iconBy: iconUser, commentTime: commentT} } }, function(err, res) {
    if (err) throw err;
    console.log("1 document updated comments");
  });
};

// module.exports.aggregateAdmin = function(post, callback) {
//   console.log("agreggate: "+ post);
 
//   Post.aggregate([
//     {
//       $lookup:
//         {
//           from: "users",
//           pipeline: [
//             { $match: { role: 'ADMIN' } }
//          ],
//          as: "roleUser"
//         }
//     }
//   ]);
 
// }



