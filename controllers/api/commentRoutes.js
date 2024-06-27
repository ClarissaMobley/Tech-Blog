const router = require('express').Router();
const { Comment } = require('../../models');
const withAuth = require('../../utils/auth');

// Create a new comment
router.post('/', withAuth, async (req, res) => {
  try {
    const newComment = await Comment.create({
      ...req.body,
      user_id: req.session.user_id,
    });

    res.status(200).json(newComment);
  } catch (err) {
    console.error('Error creating comment:', err);
    res.status(400).json(err);
  }
});

module.exports = router;
