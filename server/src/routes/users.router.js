import express from 'express';
import {
    getUser,
    getUserFriends,
    addRemoveFriend
} from '../controllers/users.controller.js'

const usersRouter = express.Router();

usersRouter.get('/', (req, res) => res.status(200).json({ message: 'Users' }));
usersRouter.get('/:id', getUser)
usersRouter.get('/:id/friends', getUserFriends);

// put when entirely change the data
// patch when some modifications are to be done
usersRouter.patch('/:id/:friendId', addRemoveFriend);

export default usersRouter;