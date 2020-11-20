const mongoose = require('mongoose'); 

const jwt = require('jsonwebtoken');
const config = require('../config/db')

const User = mongoose.model('User');
const Post = require('../models/post')

module.exports.register = (req, res, next) => { 
    var user = new User(req.body);
    User.addUser(user, (err, user) => {
        if(err){
          res.json({success: false, msg:'Fallo al registrar usuario'});
        } else {
          res.json({success: true, msg:'Usuario registrado'});
        }
    }); 
} 

module.exports.auth = (req, res, next) => { 
    const email = req.body.email;
    const password = req.body.password;
  
    User.getUserByUsername(email, (err, user) => {
      if(err) throw err;
      if(!user){
        return res.json({success: false, msg: 'Usuario no encontrado'});
      }
  
      User.comparePassword(password, user.password, (err, isMatch) => {
        if(err) throw err;
        if(isMatch){
          const token = jwt.sign({data:user}, config.secret, {
            expiresIn: 604800 // 1 week
            });
  
            res.json({
                success: true,
                token: 'JWT '+token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    icon: user.icon
                }
            });
        } else {
          return res.json({success: false, msg: 'Contraseña incorrecta'});
        }
      });
    });
} 

module.exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  User.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update id=${id}. Maybe it was not found!`
        });
      } else res.send({ message: "Updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating id=" + id
      });
    });
};

module.exports.getPost = async (req, res) => {
  const post = await Post.find({ createdBy: req.params.id });
  console.log(post);
  res.json(post);
};

