const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Post = require('../models/post');
const Notification = require('../models/notification');
const PostController = require('../controllers/postController');
const UserController = require('../controllers/userController'); 
const NotificationController = require('../controllers/notificationController');
const AdminController = require('../controllers/adminController');
const config = require('../config/db')

// Register
router.post('/register', UserController.register);
router.put('/updateProfile/:id', UserController.update);

//Post
router.put('/editPost/:id', PostController.updatePost);
router.delete('/deletePost/:id', PostController.deletePost);
router.post('/newPost', PostController.registerPost);

//Posts filters
router.post('/allPosts', PostController.showAllPosts);
router.post('/mostLikedPosts', PostController.mostLikePosts);
router.post('/adminPosts', PostController.adminPosts);

//like
router.post('/likePost', PostController.registerLikes);

//dislike
router.post('/dislikePost', PostController.registerDislikes);

//addComments
router.put('/addComment', PostController.addCommentPost);

//get notifications
router.post('/showNotifications', NotificationController.showNotifications);
// Authenticate
router.post('/authenticate', UserController.auth);

// Profile
router.get('/profile', passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});

router.get('/userPost/:id', UserController.getPost);

//Notificaciones
router.post('/addNotification', NotificationController.registerNotification);

//Administradores
router.get('/getAdmins', AdminController.getAdmins);

module.exports = router; 