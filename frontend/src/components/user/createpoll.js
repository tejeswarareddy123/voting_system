// src/CreatePoll.js

import React, { useState } from 'react';
import './createpoll.css'; // Import your custom CSS file
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


const CreatePoll = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['']);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1);
    setOptions(newOptions);
  };

  const handleSubmit = () => {
    const newPoll = {
      question,
      options,
    };

    axios
      .post('http://localhost:5000/users/polls', newPoll)
      .then((response) => {
        if(response.data.message==='Poll created successfully'){
          toast.success("poll created successfully");
          setQuestion('');
          setOptions(['']);
        }
      })
      .catch((error) => {
        toast.error('Error creating poll:');
      });
  };

  return (
    <div className="container">
      <div className="poll-form">
        <h2 className="title">Create a Poll</h2>
        <div>
          <input
            type="text"
            placeholder="Question"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="input"
          />
        </div>
        <div>
          {options.map((option, index) => (
            <div key={index} className="option-container">
              <input
                type="text"
                placeholder={`Option ${index + 1}`}
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                className="input"
              />
              <button onClick={() => handleRemoveOption(index)} className="remove-button">
                Remove
              </button>
            </div>
          ))}
          <button onClick={handleAddOption} className="add-button">
            Add Option
          </button>
        </div>
        <div>
          <button onClick={handleSubmit} className="submit-button">
            Create Poll
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
