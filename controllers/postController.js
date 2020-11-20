const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const User = mongoose.model('User');

module.exports.registerPost = (req, res, next) => {
    var post = new Post(req.body);
    console.log("DENTRO DEL CONTROLLER", post);
    post.save().then(item => {
        //res.send(item);
        res.json({success: true, msg:'Publicación registrada'});
    })
    .catch(err => {
      res.json({success: false, msg:'Ocurrió un problema con la publicación'});
    });

};

module.exports.addCommentPost = (req, res) => {
  console.log("Req Body comentarios ", req.body);
  if (!req.body.postId) {
      res.json({ success: false, message: "No se especificó un id"});
  }else{
      Post.getById(req.body.postId, (err, post) =>{
          if(err){
              res.json({success:false, message: "Hubo un error"});
          }else{
            Post.addComment(req.body);
          }
      })
  }
};

module.exports.showPosts = (req, res) => {
  let id = req.body.id;
  Post.getPostById(id).then((post) => {
    if (post == null) {
      res.status(404).send('Not found');
      return;
    }
    res.send('Publicación encontrada');
  });
};

module.exports.registerLikes = (req, res) => {
    // console.log("Req Body is", req.body);
    if (!req.body.id) {
        res.json({ success: false, message: "No se especificó un id"});
    }else{
        Post.getById(req.body.id, (err, post) =>{
            if(err){
                res.json({success:false, message: "No es un id válido"});
            }else{
                console.log("1er else", post)
                if(!post){
                    res.json({success:false, message: "No se encontró el post"})
                }else{ 
                  console.log("2do else", post)
                    Post.registerLikes(post);
                    Post.find({}, (err, posts) => {
                      if(err){
                          res.json({ success: false, message: err})
                      } else{
                          if(!posts){
                              res.json({ success: false, message: "No hay posts"})
                          } else {
                              res.json({ success: true, post: posts})
                          }
                      }
                    }).sort({'_id': -1})                     
                }
            }
        })
    }
};


module.exports.registerDislikes = (req, res) => {  
  // console.log("Req Body is", req.body);
  if (!req.body.id) {
      res.json({ success: false, message: "No se especificó un id"});
  }else{
      Post.getById(req.body.id, (err, post) =>{
          if(err){
              res.json({success:false, message: "No es un id válido"});
          }else{
              console.log("1er else", post)
              if(!post){
                  res.json({success:false, message: "No se encontró el post"})
              }else{ 
                console.log("2do else", post)
                  Post.registerDislikes(post);
                  Post.find({}, (err, posts) => {
                    if(err){
                        res.json({ success: false, message: err})
                    } else{
                        if(!posts){
                            res.json({ success: false, message: "No hay posts"})
                        } else {
                            res.json({ success: true, post: posts})
                        }
                    }
                  }).sort({'_id': -1})              
              }
          }
      })
  }
};

module.exports.updatePost = (req, res) => {
    if (!req.body) {
      return res.status(400).send({
        message: "Data to update can not be empty!"
      });
    }
  
    const id = req.params.id;
  
    Post.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
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

module.exports.deletePost = async (req, res) => {
  await Post.findByIdAndDelete(req.params.id);
  res.json("Post deleted");
};

// module.exports.adminPosts = (req, res) => {
//   console.log("Req Body admin posts ", req.body);
//   User.aggregate([
//     { $addFields: { 'userId': { $toString: '$_id' }}},
//     {
//       $match: {
//         role: 'ADMIN'
//       }
//     },
//     {
//       $lookup: {
//         from: 'posts',
//         localField: 'userId',
//         foreignField: 'createdBy',
//         as: 'post'
//       }
//     }
//   ], (err, posts) => {
//     if(err){
//         res.json({ success: false, message: err})
//     } else{
//         if(!posts){
//             res.json({ success: false, message: "No hay posts"})
//         } else {
//             res.json({ success: true, post: posts})
//         }
//     }
//   })
// };

// module.exports.adminPosts = (req, res) => {
//   console.log("Req Body admin posts ", req.body);
//   User.aggregate([
//     { $addFields: { 'userId': { $toString: '$_id' }}},
//     {
//       $match: {
//         role: 'ADMIN'
//       }
//     },
//     {
//       $lookup: {
//         from: 'posts',
//         localField: 'userId',
//         foreignField: 'createdBy',
//         as: 'admin_posts'
//       }
//     },
//     // { $addFields: { 'postId': { $arrayElemAt: [ "$admin_posts", 0 ] }}},
//     {
//       $replaceRoot: { newRoot: { $mergeObjects: [ { $arrayElemAt: [ "$admin_posts", 0 ] }, "$$ROOT" ] } }
//     },
//     { $project: { 'admin_posts': 0 } }
//   ], (err, posts) => {
//     if(err){
//         res.json({ success: false, message: err})
//     } else{
//         if(!posts){
//             res.json({ success: false, message: "No hay posts"})
//         } else {
//             res.json({ success: true, post: posts})
//         }
//     }
//   })
// };

module.exports.adminPosts = (req, res) => {
  Post.find({roleBy: 'ADMIN'}, (err, posts) => {
    if(err){
        res.json({ success: false, message: err})
    } else{
        if(!posts){
            res.json({ success: false, message: "No hay posts"})
        } else {
            res.json({ success: true, post: posts})
        }
    }
  }).sort({'_id': -1})
};


module.exports.mostLikePosts = (req, res) => {
  Post.find({}, (err, posts) => {
    if(err){
        res.json({ success: false, message: err})
    } else{
        if(!posts){
            res.json({ success: false, message: "No hay posts"})
        } else {
            res.json({ success: true, post: posts})
        }
    }
  }).sort({'likes': -1})
};

module.exports.showAllPosts = (req, res) => {
  Post.find({}, (err, posts) => {
    if(err){
        res.json({ success: false, message: err})
    } else{
        if(!posts){
            res.json({ success: false, message: "No hay posts"})
        } else {
            res.json({ success: true, post: posts})
        }
    }
  }).sort({'_id': -1})
};
