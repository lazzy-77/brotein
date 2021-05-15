import express from 'express';
const profileRouter = express.Router();

// @route   GET api/profile
// @desc    Test route
// @access  Public
profileRouter.get('/', (req, res) => res.send('Profile route'));

export default profileRouter;
