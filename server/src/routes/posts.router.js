import express from 'express';
import { verifyToken } from '../../middleware/auth.js';
import {
    getUserPosts,
    getFeedPosts,
    likePost, 
} from '../controllers/posts.controller.js';

const postsRouter = express.Router();

postsRouter.get('/', getFeedPosts);
postsRouter.get('/:userId', verifyToken, getUserPosts);

postsRouter.patch('/:postId/like', verifyToken, likePost);

export default postsRouter;