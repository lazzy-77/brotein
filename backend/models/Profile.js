import mongoose from 'mongoose';

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  about_me: {
    type: String,
  },
  birthday: {
    type: Date,
    required: true,
  },
  sex: {
    type: String,
    required: true,
  },
  height: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  log_entries: [
    {
      // logId: {
      //   type: Number,
      //   required: true,
      // },
      logs: {
        type: [String],
        required: true,
      },
      date_of_log: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

const Profile = mongoose.model('profile', ProfileSchema);

export default Profile;
