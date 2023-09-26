var express = require('express');
var router = express.Router();
var User = require("../models/controllers/user/user");
var Admin = require("../models/controllers/admin/admin");

//admin routes

router.post("/polls",Admin.create_poll);
router.get("/polls",Admin.polls_data)
router.get("/pollResults/:pollId",Admin.poll_results);



///User routes
router.post("/",User.login);
router.post("/signup",User.create_user);
router.get("/:userId/submittedPolls",User.submitted_polls)
router.post("/submitPolls",User.submit_poll)
router.get("/polls/:pollId",User.poll_details);



 


module.exports = router;
