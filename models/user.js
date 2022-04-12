const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Лев Ел Джонсон',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  about: {
    type: String,
    default: 'Примарх легиона темных ангелов',
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  avatar: {
    type: String,
    default: 'https://i.pinimg.com/originals/a9/81/35/a9813599b69c30b90f4a37d024ea147f.jpg',
    required: true,
  },
});
module.exports = mongoose.model('user', userSchema);
