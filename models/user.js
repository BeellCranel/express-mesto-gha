const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://i.pinimg.com/originals/0c/80/82/0c8082ba6179d05c09a31b1b7ba10550.jpg',
    required: true,
  },
});
module.exports = mongoose.model('user', userSchema);
