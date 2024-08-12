// Dark Mode 
function darkMode() {
    var element = document.body;
    element.classList.toggle("dark-mode");
}

// users posts 

document.addEventListener('DOMContentLoaded', function () {
    const postsApi = 'https://jsonplaceholder.typicode.com/posts?_limit=50';
    const commentsApi = 'https://jsonplaceholder.typicode.com/comments?postId=';
    const todosApi = 'https://jsonplaceholder.typicode.com/todos?userId=';
    const randomImageApi = 'https://api.api-ninjas.com/v1/randomimage?category=technology';
    const apiKey = 'jmX5J29bgrFnyIrSkWLHiA==7vL13nlG6jcbkHai';

    // Function to fetch a random image URL
    const fetchRandomImage = async () => {
        try {
            const response = await fetch(randomImageApi, {
                headers: {
                    'X-Api-Key': apiKey
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch random image');
            }
            const contentType = response.headers.get('Content-Type');
            if (contentType.includes('application/json')) {
                const data = await response.json();
                return data.url;
            } else if (contentType.includes('image')) {
                const base64String = await response.text();
                return `data:image/jpeg;base64,${base64String}`;
            } else {
                throw new Error('Unsupported content type');
            }
        } catch (error) {
            console.error('Error fetching random image:', error);
            return ''; // Return empty string or handle error as needed
        }
    };

    // Fetch and display post data
    fetch(postsApi)
        .then(response => response.json())
        .then(async posts => {
            const postDataContainer = document.getElementById('post-data-container');
            let postsHtml = '';

            // Fetch random image for each post
            const imagePromises = posts.map(() => fetchRandomImage());
            const images = await Promise.all(imagePromises);

            posts.forEach((post, index) => {
                // Determine the "Published by" text based on the post index
                let publishedBy;
                if (index < 10) {
                    publishedBy = 'Leanne Graham';
                } else if (index < 20) {
                    publishedBy = 'Ervin Howell';
                } else if (index < 30) {
                    publishedBy = 'Clementine Bauch';
                } else if (index < 40) {
                    publishedBy = 'Patricia Lebsack';
                } else {
                    publishedBy = 'Chelsey Dietrich';
                }
                postsHtml += `
                    <div class="post-data" id="post-${post.id}">
                        <img src="${images[index]}" alt="${post.title} image">
                        <p style="font-size: 13px; color: #111;"><strong>Title:</strong> ${post.title}</p>
                        <p style="font-size: 13px; color: #111;"><strong>Body:</strong> ${post.body}</p><br>
                        <p style="font-size: 11px; color: #111;">Published by "${publishedBy}"</p><br>
                        <div class="post-buttons">
                            <button class="showCommentsBtn" data-post-id="${post.id}">Show Comments</button>
                            <button class="showTodosBtn" data-user-id="${post.userId}">Show Todos</button>
                        </div>
                    </div>
                `;
            });
            postDataContainer.innerHTML = postsHtml;

            // Add event listeners for each post's buttons
            document.querySelectorAll('.showCommentsBtn').forEach(button => {
                button.addEventListener('click', async function () {
                    const postId = this.getAttribute('data-post-id');
                    try {
                        const response = await fetch(commentsApi + postId);
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        const comments = await response.json();
                        const commentHtml = comments.map(comment => `
                            <div class="user-data">
                                <p><strong>Name:</strong> ${comment.name}</p>
                                <p><strong>Email:</strong> ${comment.email}</p>
                                <p><strong>Comment:</strong> ${comment.body}</p>
                            </div><br>
                        `).join('');
                        document.getElementById('comment-data-container').innerHTML = commentHtml;
                        document.getElementById('popup').style.display = 'flex';
                    } catch (error) {
                        console.error('Error fetching comments:', error);
                    }
                });
            });

            document.querySelectorAll('.showTodosBtn').forEach(button => {
                button.addEventListener('click', async function () {
                    const userId = this.getAttribute('data-user-id');
                    try {
                        const response = await fetch(todosApi + userId);
                        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                        const todos = await response.json();
                        const todoHtml = todos.map(todo => `
                            <div class="user-data">
                                <p><strong>Title:</strong> ${todo.title}</p>
                                <p><strong>Completed:</strong> ${todo.completed}</p>
                            </div><br>
                        `).join('');
                        document.getElementById('todo-data-container').innerHTML = todoHtml;
                        document.getElementById('popup2').style.display = 'flex';
                    } catch (error) {
                        console.error('Error fetching todos:', error);
                    }
                });
            });
        });

    // Close Popups
    document.getElementById('closePopupBtn').addEventListener('click', () => {
        document.getElementById('popup').style.display = 'none';
    });

    document.getElementById('closePopupBtn2').addEventListener('click', () => {
        document.getElementById('popup2').style.display = 'none';
    });

    // Close popup when clicking outside of the popup content
    document.querySelectorAll('.popup').forEach(popup => {
        popup.addEventListener('click', function (event) {
            if (event.target === this) {
                this.style.display = 'none';
            }
        });
    });
});


