import express from 'express';
const profileRouter = express.Router();
import auth from '../../middleware/auth.js';
import pkg from 'express-validator';
const { check, validationResult } = pkg;

import Profile from '../../models/Profile.js';
import User from '../../models/User.js';

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
profileRouter.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'pfp']
    );

    if (!profile) {
      res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST api/profile
// @desc    Create or update user profile
// @access  Private
profileRouter.post(
  '/',
  [
    auth,
    [
      check('birthday', 'Birthday is required').not().isEmpty(),
      check('sex', 'sex is required').not().isEmpty(),
      check('height', 'height is required').not().isEmpty(),
      check('weight', 'weight is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { about_me, birthday, sex, height, weight } = req.body;

    // Build profile object
    const profileFields = {};
    profileFields.user = req.user.id;
    if (about_me) profileFields.about_me = about_me;
    if (birthday) profileFields.birthday = birthday;
    if (sex) profileFields.sex = sex;
    if (height) profileFields.height = height;
    if (weight) profileFields.weight = weight;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        // Update profile if exists
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        return res.json(profile);
      }

      // Create Profile if not exists
      profile = new Profile(profileFields);

      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
profileRouter.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'pfp']);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/profile/user/:user_id
// @desc    Get profile by user ID
// @access  Public
profileRouter.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'pfp']);

    if (!profile) return res.status(400).json({ msg: 'Profile not found' });

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/profile
// @desc    Delete profile, user & logs
// @access  Private
profileRouter.delete('/', auth, async (req, res) => {
  try {
    // @todo - remove users logs

    // Remove profile
    await Profile.findOneAndRemove({ user: req.user.id });
    // Remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: 'User deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/profile/logs
// @desc    Add profile logs
// @access  Private
profileRouter.put(
  '/logs',
  [auth, [check('logs', 'logs are required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { logs } = req.body;

    const newLog = {
      logs,
    };

    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.log_entries.unshift(newLog);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   DELETE api/profile/logs/:log_id
// @desc    Delete log from profile
// @access  Private
profileRouter.delete('/logs/:log_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // Get remove index
    const removeIndex = profile.log_entries
      .map(item => item.id)
      .indexOf(req.params.log_id);

    profile.log_entries.splice(removeIndex, 1);

    await profile.save();

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

export default profileRouter;
