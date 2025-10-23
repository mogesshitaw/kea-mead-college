// Main JavaScript for Kea Med College Website

// Initialize the website
document.addEventListener('DOMContentLoaded', function() {
    initializeWebsite();
});

function initializeWebsite() {
    loadNewsPreview();
    checkAdminStatus();
    
    // Initialize page-specific functions
    if (window.location.pathname.includes('news.html')) {
        loadAllNews();
    }
    
    if (window.location.pathname.includes('comments.html')) {
        loadComments();
    }
    
    if (window.location.pathname.includes('admin.html')) {
        // Admin page will be handled by admin.js
        return;
    }
}

// News Management Functions
function loadNewsPreview() {
    const newsContainer = document.getElementById('newsPreview');
    if (!newsContainer) return;
    
    const news = getNews().slice(0, 3); // Get latest 3 news items
    
    if (news.length === 0) {
        newsContainer.innerHTML = '<p class="text-center">No news available at the moment.</p>';
        return;
    }
    
    let newsHTML = '';
    news.forEach(item => {
        newsHTML += `
            <div class="col-md-4">
                <div class="card news-card h-100">
                    ${item.image ? `<img src="${item.image}" class="card-img-top" alt="${item.title}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.content.substring(0, 100)}...</p>
                        <small class="text-muted">${formatDate(item.date)}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    newsContainer.innerHTML = newsHTML;
}

function loadAllNews() {
    const newsContainer = document.getElementById('newsContainer');
    if (!newsContainer) return;
    
    const news = getNews();
    
    if (news.length === 0) {
        newsContainer.innerHTML = '<p class="text-center">No news articles available.</p>';
        return;
    }
    
    let newsHTML = '';
    news.forEach(item => {
        newsHTML += `
            <div class="col-lg-6 mb-4">
                <div class="card news-card h-100">
                    ${item.image ? `<img src="${item.image}" class="card-img-top" alt="${item.title}">` : ''}
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${item.content}</p>
                        <small class="text-muted">${formatDate(item.date)}</small>
                    </div>
                </div>
            </div>
        `;
    });
    newsContainer.innerHTML = newsHTML;
}
// Local Storage Functions for News
function getNews() {
    const news = localStorage.getItem('keaMedCollege_news');
    return news ? JSON.parse(news) : [];
}

function saveNews(news) {
    localStorage.setItem('keaMedCollege_news', JSON.stringify(news));
}
// Comments Management
function loadComments() {
    const commentsContainer = document.getElementById('commentsContainer');
    if (!commentsContainer) return;
    const comments = getComments();
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<p class="text-center">No comments yet. Be the first to share your feedback!</p>';
        return;
    }

    let commentsHTML = '';
    comments.forEach(comment => {
        commentsHTML += `
            <div class="comment">
                <h6>${comment.name}</h6>
                <p class="mb-1">${comment.comment}</p>
                <small class="text-muted">${formatDate(comment.date)}</small>
            </div>
        `;
    });
    
    commentsContainer.innerHTML = commentsHTML;
}

function submitComment(event) {
    event.preventDefault();
    
    const name = document.getElementById('commentName').value;
    const email = document.getElementById('commentEmail').value;
    const comment = document.getElementById('commentText').value;
    
    if (!name || !email || !comment) {
        alert('Please fill in all fields');
        return;
    }
    
    const comments = getComments();
    const newComment = {
        id: Date.now(),
        name: name,
        email: email,
        comment: comment,
        date: new Date().toISOString()
    };
    
    comments.unshift(newComment);
    saveComments(comments);
    
    // Reset form
    document.getElementById('commentForm').reset();
    
    // Reload comments
    loadComments();
    
    alert('Thank you for your feedback!');
}

function getComments() {
    const comments = localStorage.getItem('keaMedCollege_comments');
    return comments ? JSON.parse(comments) : [];
}

function saveComments(comments) {
    localStorage.setItem('keaMedCollege_comments', JSON.stringify(comments));
}

// Utility Functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function checkAdminStatus() {
    const isLoggedIn = localStorage.getItem('keaMedCollege_adminLoggedIn') === 'true';
    const adminControls = document.getElementById('adminNewsControls');
    
    if (adminControls && isLoggedIn) {
        adminControls.style.display = 'block';
    }
}