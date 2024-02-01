const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = 3000;

mongoose.connect('your_mongodb_uri', { useNewUrlParser: true, useUnifiedTopology: true });

const blogPostSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
    date: { type: Date, default: Date.now },
    comments: [{ text: String, author: String, date: { type: Date, default: Date.now } }]
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

app.use(express.static('public')); // Serve static files from 'public' directory
app.use(bodyParser.json());

app.post('/register', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Implement your user registration logic here

    return res.status(201).json({ message: 'User registered successfully' });
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    // Implement your user login logic here

    return res.status(200).json({ message: 'Login successful' });
});

app.post('/blog-posts', async (req, res) => {
    const { title, content, author } = req.body;

    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Title, content, and author are required' });
    }

    const newBlogPost = new BlogPost({ title, content, author });

    try {
        await newBlogPost.save();
        return res.status(201).json({ message: 'Blog post created successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error creating blog post' });
    }
});

app.get('/blog-posts', async (req, res) => {
    try {
        const blogPosts = await BlogPost.find();
        return res.status(200).json(blogPosts);
    } catch (error) {
        return res.status(500).json({ error: 'Error retrieving blog posts' });
    }
});

app.put('/blog-posts/:postId', async (req, res) => {
    const { title, content } = req.body;
    const { postId } = req.params;

    try {
        await BlogPost.findByIdAndUpdate(postId, { title, content });
        return res.status(200).json({ message: 'Blog post updated successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error updating blog post' });
    }
});

app.delete('/blog-posts/:postId', async (req, res) => {
    const { postId } = req.params;

    try {
        await BlogPost.findByIdAndDelete(postId);
        return res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error deleting blog post' });
    }
});

app.post('/blog-posts/:postId/comments', async (req, res) => {
    const { text, author } = req.body;
    const { postId } = req.params;

    try {
        await BlogPost.findByIdAndUpdate(postId, { $push: { comments: { text, author } } });
        return res.status(201).json({ message: 'Comment added successfully' });
    } catch (error) {
        return res.status(500).json({ error: 'Error adding comment' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
