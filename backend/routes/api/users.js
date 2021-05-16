import express from 'express';
const usersRouter = express.Router();
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from 'config';
import logger from '../../logger/logger.js';
import pkg from 'express-validator';
const { check, validationResult } = pkg;

const NAMESPACE = 'user.js';

import User from '../../models/User.js';

// @route   GET api/users
// @desc    Register User
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
        return res
          .status(400)
          .json({ errors: [{ msg: 'User already exists' }] });
      }

      // Get users gravatar
      const pfp = gravatar.url(email, {
        s: '200', // default size
        r: 'pg', // rating
        d: 'mm', // default icon
      });

      user = new User({
        name,
        email,
        password,
        pfp,
      });

      // Encrypt password
      const salt = await bcrypt.genSalt(10); // creates hash and puts it into user password

      user.password = await bcrypt.hash(password.toString(), salt);

      await user.save(); // saves user

      // Return jsonwebtoken
      const payload = {
        user: {
          id: user.id,
        },
      };

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        { expiresIn: 360000 }, // change to 3600 for production
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      logger.err(NAMESPACE, 'Authorization Request Failed.', err);
      res.status(500).send('Server error');
    }
  }
);

export default usersRouter;
