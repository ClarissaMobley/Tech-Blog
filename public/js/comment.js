document.getElementById('comment-form').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    const commentContent = document.getElementById('comment-content').value.trim();
    const postId = window.location.pathname.split('/').pop();
  
    if (commentContent) {
      const response = await fetch('/api/comments', {
        method: 'POST',
        body: JSON.stringify({ post_id: postId, comment_text: commentContent }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.ok) {
        document.location.reload();
      } else {
        alert('Failed to add comment');
      }
    }
  });
  