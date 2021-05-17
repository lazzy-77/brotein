import express from 'express';
const postsRouter = express.Router();

// @route   GET api/post
// @desc    Test route
// @access  Public
postsRouter.get('/', (req, res) => res.send('Post route'));

export default postsRouter;
