const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const config = require('../config/db');  

let rolesValidos = {
  values: ["ADMIN", "USER"],
  message: '{VALUE} no es un role válido'
}

// User Schema
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'USER',
    required: [true],
    enum: rolesValidos,
  },
  icon: {
    type:String,
    required: false
  },
  desc: {
  type: String,
  },
  trabajo: {
  type: String,
  },
  face: {
    type: String,
  },
  twt: {
    type: String,
  },
});


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}


module.exports.getUserByUsername = function(email, callback){
  const query = {email: email}
  User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(newUser.password, salt, (err, hash) => {
      if(err) throw err;
      newUser.password = hash;
      newUser.save(callback);
    });
  });
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
      if(err) throw err;
      callback(null, isMatch);
    });
  }

  
