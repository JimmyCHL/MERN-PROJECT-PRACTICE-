import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js';

export const getPosts = async(req, res) => {
    const { page } = req.query;
    try {
        const LIMIT = 2;
        const startIndex = (Number(page) - 1) * LIMIT; // get the starting index of every page
        const total = await PostMessage.countDocuments(); // get the total number of documents

        const posts = await PostMessage.find({}).sort({ _id: -1 }).limit(LIMIT).skip(startIndex);

        res.status(200).json({ data: posts, currentPage: Number(page), numberOfPages: Math.ceil(total / LIMIT) });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPost = async(req, res) => {
    const { id } = req.params;
    try {
        const post = await PostMessage.findById(id);

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getPostsBySearch = async(req, res) => {
    const { searchQuery, tags } = req.query;
    console.log(tags);
    console.log(searchQuery);
    console.log(req.query);

    try {
        const title = new RegExp(searchQuery, 'i'); // this is the easy to look for the regular expression pattern
        const posts = await PostMessage.find({ $or: [{ title }, { tags: { $in: tags.split(',') } }] });
        res.status(200).json({ data: posts });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

export const createPost = async(req, res) => {
    try {
        const post = req.body;

        const newPost = new PostMessage({...post, creator: req.userId, createdAt: new Date().toISOString() });

        await newPost.save();

        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePost = async(req, res) => {
    const { id: _id } = req.params;
    const post = req.body;
    console.log(_id);

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    //return new data not old data because of setting new: true
    const updatePost = await PostMessage.findByIdAndUpdate(_id, post, {
        new: true,
    });

    res.json(updatePost);
};

export const deletePost = async(req, res) => {
    const { id: _id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('No post with that id');

    await PostMessage.findByIdAndRemove(_id);

    res.json({ message: 'Post deleted successfully' });
};

export const likePost = async(req, res) => {
    const { id } = req.params;

    if (!req.userId) return res.json({ message: 'Unauthenticated' });

    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('No post with that id');

    const post = await PostMessage.findById(id);

    const index = post.likes.findIndex((id) => id === String(req.userId));

    if (index === -1) {
        post.likes.push(String(req.userId));
    } else {
        post.likes = post.likes.filter((id) => id !== String(req.userId));
    }

    const updatePost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.json(updatePost);
};

export const commentPost = async(req, res) => {
    const { id } = req.params;
    const { value } = req.body;

    const post = await PostMessage.findById(id);

    post.comments.push(value);

    const updatedPost = await PostMessage.findByIdAndUpdate(id, post, { new: true });

    res.status(200).json(updatedPost);
};