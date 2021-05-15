import express from 'express';
const usersRouter = express.Router();
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import pkg from 'express-validator/check/index.js';
const { check, validationResult } = pkg;

import User from '../../models/User.js';

// @route   GET api/users
// @desc    Test route
// @access  Public
usersRouter.post(
  '/',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // returns error messages
    }

    const { name, email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (user) {
        res.status(400).json({ errors: [{ msg: 'User already exists!' }] });
      }

      // Get users profile pic (gravatar)
      const pfp = gravatar.url(email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default image
      });

      user = new User({
        name,
        email,
        pfp,
        password,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10);

      user.password = await bcrypt.hash(password, salt);

      await user.save();

      // Return jsonwebtoken

      res.send('User registered');
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default usersRouter;
