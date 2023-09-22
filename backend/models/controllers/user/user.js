const { Op } = require("sequelize")
const db = require("../../Entity")
const bcrypt=require("bcrypt")
const jwt = require('jsonwebtoken');
const secretkey='jman';
const Sequelize = require('sequelize');




const user = db.USER
const admin = db.ADMIN_TRAINING
const training = db.TRAININGS
const poll=db.POLL
const SubmittedPoll=db.SUBMITTED_POLL

///login
const login = async (req, res) => {
    console.log(req.body)
    const { email, password } = req.body
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    const isValid = /@jmangroup\.com$/.test(email);
    if (!isValid) {
        res.send("invaild mail")
    }
    else if (!passwordRegex.test(password)){
        res.send("Passoword is weak")
    }
    else {
        try {
        
            const valid_user = await user.findOne({
                where: {
                    mail: req.body.email,
                    password:req.body.password
                   
                }})
                if (valid_user.isadmin) {
                    res.send({data:valid_user.id,message:"Admin logged"})
                }
                else if (!valid_user.isadmin)  {
                    console.log("user Login success");
                    // res.send({data:valid_user.id,message:"User logged"})
                    res.status(201).json({data:valid_user.id,message:"User logged"});
                }
                else{
                    res.send("Unauthorized user")
                }
            
        } catch (error) {
            res.send("user not exist")
        }
    }
}


///sign up
const create_user = async (req, res) => {
   
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;

    const isValid = /@jmangroup\.com$/

    try {
        if (req.body.name && req.body.email && req.body.password) {
            var { name, email, password } = req.body
            if(!passwordRegex.test(password))
            {
                res.send("Passoword is weak")
            }
            else if(!isValid.test(email))
            {
                res.send("not an organisation mail")
            }
            
            else{
                
                await user.create({
                    name: name,
                    mail:email,
                    password: password
                });

                res.send({ statusCode: 200, message: 'response success' })
            }
        }
        else {
            res.send("Response failed to add to DB")
        }
    } catch (error) {
        res.send({ statusCode: 400, message: 'username or mail id already exists' })

    }}

const create_poll = async (req, res) => {
    try {
        const { question, options } = req.body;
        console.log("question",question)
        console.log("options",options);
        // Create a new poll record in the database using the Sequelize model
        const newPoll = await poll.create({
          question,
          options: JSON.stringify(options),
        });
    
        res.status(201).json({ message: 'Poll created successfully', pollId: newPoll.poll_id });
      } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ error: 'Internal server error' });
      }

}

const polls_data=async(req,res)=>{
    try {
        // Use Sequelize's findAll() method to retrieve all polls
        const polls = await poll.findAll();
        const formattedPolls = polls.map((poll) => ({
            id: poll.poll_id,
            question: poll.question,
            options: JSON.parse(poll.options), // Parse the "options" column
        }));
        res.status(200).json(formattedPolls);
      } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const submitted_polls = async(req,res)=>{
    try {
        const userId = req.params.userId;
    
        // Use Sequelize's findAll() method to retrieve submitted polls for the specified user
        const submittedPolls = await SubmittedPoll.findAll({
          attributes: ['poll_id', 'selected_option_index'],
          where: {
            user_id: userId,
          },
        });
    
        // Send the retrieved submitted polls as JSON response
        res.status(200).json(submittedPolls);
      } catch (error) {
        console.error('Error fetching submitted polls:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const submit_poll = async(req,res)=> {
    try {
        const submittedPoll = req.body;
        console.log("submitted poll",submittedPoll);
        // Ensure submittedPoll is an object
        if (typeof submittedPoll !== 'object') {
          return res.status(400).json({ error: 'Invalid data format' });
        }
    
        // Use Sequelize's create() method to insert submitted poll data into the database
        await SubmittedPoll.create({
          user_id: submittedPoll.userId,
          poll_id: submittedPoll.pollId,
          selected_option_index: submittedPoll.selectedOptionIndex,
        });
    
        // Send a success response
        res.status(201).json({ message: 'Poll submitted successfully' });
      } catch (error) {
        console.error('Error inserting submitted poll data:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const poll_details=async(req,res)=>{
    try {
        console.log("request",req);
        const pollId = req.params.pollId;
        
        // Query the database to retrieve a specific poll by pollId using Sequelize
        const pollData = await poll.findOne({
          where: { poll_id: pollId },
        });
        if (!pollData) {
          res.status(404).json({ error: 'Poll not found' });
          return;
        }
    
        // Parse the options field as JSON
        console.log('Options before parsing:', pollData.options);
        const parseddata={
            poll_id: pollData.poll_id,
            question: pollData.question,
            options: JSON.parse(pollData.options)
        }
        console.log("options after parsing",parseddata);
        res.status(200).json(parseddata);
      } catch (error) {
        console.error('Error fetching poll details:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
}

const poll_results = async(req,res)=>{
    try {
        const pollId = req.params.pollId;
        console.log("pollid",pollId)
        // Query the database to get poll results using Sequelize
        const pollResults = await SubmittedPoll.findAll({
          attributes: [
            'selected_option_index',
            [Sequelize.fn('COUNT', 'selected_option_index'), 'voteCount'],
          ],
          where: { poll_id: pollId },
          group: 'selected_option_index',
        });
    
        res.status(200).json(pollResults);
      } catch (error) {
        console.error('Error fetching poll results:', error);
        res.status(500).json({ error: 'Internal server error' });
      }
    
}

module.exports = {
    login,
    create_user,
    create_poll,
    polls_data,
    submitted_polls,
    submit_poll,
    poll_results,
    poll_details
};