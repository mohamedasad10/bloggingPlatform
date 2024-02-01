document.addEventListener('DOMContentLoaded', async () => {
    const blogPostsContainer = document.getElementById('blog-posts');

    // Fetch and display existing blog posts
    const blogPosts = await fetch('http://localhost:3000/blog-posts').then(res => res.json());
    blogPosts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
            <p><em>By ${post.author}</em></p>
            <hr>
        `;
        blogPostsContainer.appendChild(postElement);
    });

    // Handle form submission to add a new blog post
    const blogForm = document.getElementById('blogForm');
    blogForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const title = document.getElementById('title').value;
        const content = document.getElementById('content').value;
        const author = document.getElementById('author').value;

        // Submit the new blog post to the server
        const response = await fetch('http://localhost:3000/blog-posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title, content, author }),
        });

        if (response.ok) {
            // Clear the form and reload the blog posts
            blogForm.reset();
            blogPostsContainer.innerHTML = '';
            const updatedBlogPosts = await fetch('http://localhost:3000/blog-posts').then(res => res.json());
            updatedBlogPosts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.innerHTML = `
                    <h3>${post.title}</h3>
                    <p>${post.content}</p>
                    <p><em>By ${post.author}</em></p>
                    <hr>
                `;
                blogPostsContainer.appendChild(postElement);
            });
        }
    });
});
