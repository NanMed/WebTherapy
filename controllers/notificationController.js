const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');
const Notification = mongoose.model('Notification');

module.exports.registerNotification = (req, res, next) => {
    var noti = new Notification(req.body);
    console.log("Notificacion", noti);
    noti.save().then(item => {
        //res.send(item);
        res.json({success: true, msg:'Notificación registrada'});
    })
    .catch(err => {
      res.json({success: false, msg:'Ocurrió un problema con la notificación'});
    });

};

// module.exports.showNotifications = async (req, res) => {
//   console.log("El req", req.params)
//   await Notification.getById(req.params.id);
//   res.json("Notifications");
// };

module.exports.showNotifications = (req, res) => {
  // console.log("El req", req.body._id)
  Notification.find({'userTo': req.body._id}, (err, notificaciones) => {
    if(err){
      res.json({ success: false, message: err})
    } else{
        if(!notificaciones){
          res.json({ success: false, message: "No hay notificaciones"})
        } else {
          Notification.updateSeen(notificaciones, req.body._id);
          res.json({ success: true, notification: notificaciones})
        }
    }
  }).sort({'_id': -1})
};
