const mongoose = require('mongoose');
const config = require('../config/db');
const User = require('../models/user');
const Post = require('../models/post');

// Notification Schema
var NotificationSchema = new mongoose.Schema({
  action: {type:String, requited:true},
  userFrom: {type:String, required:true},
  userTo: {type:String, required:true},
  iconFrom: {type:String},
  actionTime: {type:String},
  idPost: {type:String},
  postTitle: {type:String},
  seen: {type: Boolean, default: false}
});


const Notification = module.exports = mongoose.model('Notification', NotificationSchema);

module.exports.updateSeen = function(notification, idUsuario, callback){
  Notification.updateMany({userTo: idUsuario}, {seen : true}, function(err, res) {
    if (err) throw err;
    console.log("documents updated");
  });
};