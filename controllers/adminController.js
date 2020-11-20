const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');

module.exports.getAdmins= (req,res) => {
    User.find({'role' : 'ADMIN'}, (err, admins) => {
        if(err){
            res.json({ success: false, message: err})
        } else{
            if(!admins){
            res.json({ success: false, message: "No hay administradores"})
            } else {
            res.json({ success: true, administradores: admins})
            }
        }
    });
      
}