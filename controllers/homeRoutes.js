const router = require('express').Router();
const { Post, User, Comment } = require('../models');
const withAuth = require('../utils/auth.js');
const { formatDate } = require('../utils/helpers.js');

// Home page route
router.get('/', async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['name'] }],
    });

    const posts = postData.map((post) => {
      const postPlain = post.get({ plain: true });
      postPlain.formattedDate = formatDate(postPlain.created_on);
      return postPlain;
    });

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
      pageTitle: 'Tech Blog',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Single post route
router.get('/post/:id', async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = postData.get({ plain: true });
    post.formattedDate = formatDate(post.created_on);

    res.render('posts', {
      ...post,
      logged_in: req.session.logged_in,
      pageTitle: 'Post Details',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Dashboard route
router.get('/dashboard', withAuth, async (req, res) => {
  try {
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [
        {
          model: Post,
          where: { user_id: req.session.user_id },
          required: false,
        },
      ],
    });

    if (!userData) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const user = userData.get({ plain: true });
    user.posts = user.posts.map((post) => {
      post.formattedDate = formatDate(post.created_on);
      return post;
    });

    res.render('dashboard', {
      ...user,
      logged_in: true,
      pageTitle: 'Your Dashboard',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Login route
router.get('/login', (req, res) => {
  if (req.session.logged_in) {
    res.redirect('/dashboard');
    return;
  }

  res.render('login', { pageTitle: 'Login' });
});

// Signup route
router.get('/signup', (req, res) => {
  res.render('signup', { pageTitle: 'Sign Up' });
});

// New post route
router.get('/new-post', withAuth, (req, res) => {
    res.render('newpost', {
        pageTitle: 'New Post',
        logged_in: req.session.logged_in,
    });
});

// Edit Post Route
router.get('/editpost/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [{ model: User, attributes: ['name'] }],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = postData.get({ plain: true });
    post.formattedDate = formatDate(post.created_on);

    res.render('editpost', {
      ...post,
      id: req.params.id,
      logged_in: req.session.logged_in,
      pageTitle: 'Edit Post',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// Comment Post Route
router.get('/commentpost/:id', withAuth, async (req, res) => {
  try {
    const postData = await Post.findByPk(req.params.id, {
      include: [
        { model: User, attributes: ['name'] },
        { model: Comment, include: [{ model: User, attributes: ['name'] }] },
      ],
    });

    if (!postData) {
      res.status(404).json({ message: 'No post found with this id' });
      return;
    }

    const post = postData.get({ plain: true });
    post.formattedDate = formatDate(post.created_on);
    post.comments = post.comments.map((comment) => {
      comment.formattedDate = formatDate(comment.created_on);
      return comment;
    });

    res.render('commentpost', {
      ...post,
      logged_in: req.session.logged_in,
      pageTitle: 'Comment',
    });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
