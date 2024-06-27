document.getElementById('edit-post-form').addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const title = document.getElementById('title').value.trim();
    const content = document.getElementById('content').value.trim();
    const postId = event.target.getAttribute('data-post-id');

    if (title && content) {
      const response = await fetch(`/api/posts/${postId}`, {
        method: 'PUT',
        body: JSON.stringify({ title, post_content: content }),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        document.location.replace('/dashboard');
      } else {
        alert('Failed to update post');
      }
    }
  });

  document.getElementById('delete-post').addEventListener('click', async () => {
    const postId = document.getElementById('edit-post-form').getAttribute('data-post-id');

    const response = await fetch(`/api/posts/${postId}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      document.location.replace('/dashboard');
    } else {
      alert('Failed to delete post');
    }
  });
