const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  // gravatar allows attachment of a pfp associated to an email
  profilePic: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default User = mongoose.model('user', UserSchema);
