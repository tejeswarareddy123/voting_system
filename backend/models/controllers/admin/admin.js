const db = require("../../Entity")
const poll = db.POLL

const create_poll = async (req, res) => {
    try {
      const { question, options } = req.body;
      console.log("question", question)
      console.log("options", options);
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

  const polls_data = async (req, res) => {
    try {
      // Use Sequelize's findAll() method to retrieve all polls
      const polls = await poll.findAll();
      const formattedPolls = polls.map((poll) => ({
        id: poll.poll_id,
        question: poll.question,
        options: JSON.parse(poll.options), // Parse the "options" column
      }));
      console.log(formattedPolls);
      res.status(200).json({ message: "polls fetched", formattedPolls });
    } catch (error) {
      console.error('Error fetching polls:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  
const poll_results = async (req, res) => {
    try {
      const pollId = req.params.pollId;
      console.log("pollid", pollId)
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
    create_poll,
    polls_data,
    poll_results
  };