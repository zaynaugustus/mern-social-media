import usersDatabase from '../models/users.model.js';
import Post from '../models/posts.model.js';

export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await usersDatabase.findById(userId);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            userPicturePath: user.picturePath,
            description,
            picturePath,
            likes: {},
            comments: [],
        });

        await newPost.save();

        const allPosts = await Post.find();
        return res.status(201).json(allPosts);
    }
    catch (error) {
        res.status(409).json({ message: error.message });
    }
};

export const getFeedPosts = async (req, res) => {
    try {
        const allPosts = await Post.find();
        return res.status(200).json(allPosts);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId);
        const allUserPosts = await Post.find({ userId }); // <-- only userId instead of userId: userId
        return res.status(200).json(allUserPosts);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const likePost = async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;
        
        const post = await Post.findById(postId);

        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId); // <--
        }
        else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(postId, 
            { likes: post.likes}, 
            { new: true }
        );

        res.status(200).json(updatedPost);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
};