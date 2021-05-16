import express from 'express';
const authRouter = express.Router();
import bcrypt from 'bcryptjs';
import auth from '../../middleware/auth.js';
import jwt from 'jsonwebtoken';
import config from 'config';
//import logger from '../../logger/logger.js';
import pkg from 'express-validator';
const { check, validationResult } = pkg;

//const NAMESPACE = 'user.js';

import User from '../../models/User.js';

// @route   GET api/auth
// @desc    Get user by token
// @access  Public
authRouter.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // leaves password from fetched data
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth
// @desc    Authenticate user & get token
// @access  Public
authRouter.post(
  '/',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() }); // returns error messages
    }

    const { email, password } = req.body;

    try {
      // See if user exists
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

      const isMatch = await bcrypt.compare(password.toString(), user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid Credentials' }] });
      }

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
      //logger.err(NAMESPACE, 'Authorization Request Failed.', err);
      res.status(500).send('Server error');
    }
  }
);

export default authRouter;
