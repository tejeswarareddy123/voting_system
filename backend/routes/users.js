var express = require('express');
var router = express.Router();
var User = require("../models/controllers/user/user");
var Admin = require("../models/controllers/admin/admin");



///Admin routes
// router.post('/admin',Admin.create_training)
// router.post('/dtrain',Admin.delete_training)
// router.get('/get_trainings',Admin.view_trainings)
// router.post('/restore',Admin.restore_trainings)
// router.get('/deleted_trainings',Admin.deleted_trainings)

///Use routes
router.post("/",User.login);// for creating the user
router.post("/signup",User.create_user);// for creating the user
router.post("/polls",User.create_poll);
router.get("/polls",User.polls_data)
router.get("/:userId/submittedPolls",User.submitted_polls)
router.post("/submitPolls",User.submit_poll)
router.get("/polls/:pollId",User.poll_details);
router.get("/pollResults/:pollId",User.poll_results);
//for registering user to the training

 


module.exports = router;
