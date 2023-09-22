var express = require('express');
var router = express.Router();
var User = require("../models/controllers/user/user");
var Admin = require("../models/controllers/admin/admin");




///Use routes
router.post("/",User.login);
router.post("/signup",User.create_user);
router.post("/polls",User.create_poll);
router.get("/polls",User.polls_data)
router.get("/:userId/submittedPolls",User.submitted_polls)
router.post("/submitPolls",User.submit_poll)
router.get("/polls/:pollId",User.poll_details);
router.get("/pollResults/:pollId",User.poll_results);


 


module.exports = router;
