const router = require('express').Router();
const { Post, User } = require('../../models');
const withAuth = require('../../utils/auth');
const { formatDate } = require('../../utils/helpers');

// Get all posts
router.get('/', withAuth, async (req, res) => {
  try {
    const postData = await Post.findAll({
      include: [{ model: User, attributes: ['username'] }],
    });

    const posts = postData.map((post) => {
      const postPlain = post.get({ plain: true });
      postPlain.formattedDate = formatDate(postPlain.created_on);
      return postPlain;
    });

    res.render('homepage', {
      posts,
      logged_in: req.session.logged_in,
    });
  } catch (err) {
    console.error('Error fetching posts:', err);
    res.status(500).json(err);
  }
});

// Post Routes
router.post('/', withAuth, async (req, res) => {
  try {
    const newPost = await Post.create({
      ...req.body,
      user_id: req.session.user_id,
    });
    res.status(200).json(newPost);
  } catch (err) {
    console.error('Error creating post:', err);
    res.status(400).json(err);
  }
});

// Update Routes
router.put('/:id', withAuth, async (req, res) => {
  try {
    const [affectedRows] = await Post.update(req.body, {
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    if (affectedRows > 0) {
      res.status(200).end();
    } else {
      res.status(404).json({ message: 'Post not found or not authorized' });
    }
  } catch (err) {
    console.error('Error updating post:', err);
    res.status(500).json(err);
  }
});

// Delete Posts
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const post = await Post.findByPk(req.params.id);

    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    if (post.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'User not authorized to delete this post' });
      return;
    }

    await Post.destroy({
      where: {
        id: req.params.id,
        user_id: req.session.user_id,
      },
    });

    res.status(200).end();
  } catch (err) {
    console.error('Error deleting post:', err);
    res.status(500).json(err);
  }
});

module.exports = router;


