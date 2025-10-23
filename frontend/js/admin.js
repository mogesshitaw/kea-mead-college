// Admin Panel Functionality

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;
    
    initializeAdminPanel();
});

function initializeAdminPanel() {
    loadAdminStats();
    loadNewsForAdmin();
    loadCommentsForAdmin();
    loadApplicationsForAdmin();
    
    // Display admin username
    const username = localStorage.getItem('keaMedCollege_adminUsername');
    if (username) {
        const adminNameElement = document.getElementById('adminName');
        if (adminNameElement) {
            adminNameElement.textContent = username;
        }
    }
}

function loadAdminStats() {
    const newsCount = getNews().length;
    const commentsCount = getComments().length;
    const applicationsCount = getApplications().length;
    
    document.getElementById('newsCount').textContent = newsCount;
    document.getElementById('commentsCount').textContent = commentsCount;
    document.getElementById('applicationsCount').textContent = applicationsCount;
}

function loadNewsForAdmin() {
    const newsContainer = document.getElementById('adminNewsList');
    if (!newsContainer) return;
    
    const news = getNews();
    
    if (news.length === 0) {
        newsContainer.innerHTML = '<tr><td colspan="4" class="text-center">No news articles</td></tr>';
        return;
    }
    
    let newsHTML = '';
    news.forEach((item, index) => {
        newsHTML += `
            <tr>
                <td>${item.title}</td>
                <td>${item.content.substring(0, 50)}...</td>
                <td>${formatDate(item.date)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    newsContainer.innerHTML = newsHTML;
}

function loadCommentsForAdmin() {
    const commentsContainer = document.getElementById('adminCommentsList');
    if (!commentsContainer) return;
    
    const comments = getComments();
    
    if (comments.length === 0) {
        commentsContainer.innerHTML = '<tr><td colspan="4" class="text-center">No comments</td></tr>';
        return;
    }
    
    let commentsHTML = '';
    comments.forEach(comment => {
        commentsHTML += `
            <tr>
                <td>${comment.name}</td>
                <td>${comment.email}</td>
                <td>${comment.comment.substring(0, 50)}...</td>
                <td>${formatDate(comment.date)}</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    commentsContainer.innerHTML = commentsHTML;
}

function loadApplicationsForAdmin() {
    const applicationsContainer = document.getElementById('adminApplicationsList');
    if (!applicationsContainer) return;
    
    const applications = getApplications();
    
    if (applications.length === 0) {
        applicationsContainer.innerHTML = '<tr><td colspan="6" class="text-center">No applications</td></tr>';
        return;
    }
    
    let applicationsHTML = '';
    applications.forEach(application => {
        applicationsHTML += `
            <tr>
                <td>${application.fullName}</td>
                <td>${application.email}</td>
                <td>${application.phone}</td>
                <td>${application.program}</td>
                <td>${formatDate(application.date)}</td>
                <td>
                    <button class="btn btn-sm btn-info" onclick="viewApplication(${application.id})">
                        <i class="fas fa-eye"></i> View
                    </button>
                    <button class="btn btn-sm btn-danger" onclick="deleteApplication(${application.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </td>
            </tr>
        `;
    });
    
    applicationsContainer.innerHTML = applicationsHTML;
}

// Admin Actions
function addNews() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const image = document.getElementById('newsImage').value;
    
    if (!title || !content) {
        alert('Please fill in title and content');
        return;
    }
    
    const news = getNews();
    const newNews = {
        id: Date.now(),
        title: title,
        content: content,
        image: image || null,
        date: new Date().toISOString()
    };
    
    news.unshift(newNews);
    saveNews(news);
    
    // Close modal and reset form
    const modal = bootstrap.Modal.getInstance(document.getElementById('addNewsModal'));
    modal.hide();
    document.getElementById('addNewsForm').reset();
    
    // Reload data
    loadNewsForAdmin();
    loadAdminStats();
    
    alert('News added successfully!');
}

function deleteNews(id) {
    if (!confirm('Are you sure you want to delete this news article?')) return;
    
    const news = getNews();
    const updatedNews = news.filter(item => item.id !== id);
    saveNews(updatedNews);
    
    loadNewsForAdmin();
    loadAdminStats();
    
    alert('News deleted successfully!');
}

function deleteComment(id) {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    
    const comments = getComments();
    const updatedComments = comments.filter(comment => comment.id !== id);
    saveComments(updatedComments);
    
    loadCommentsForAdmin();
    loadAdminStats();
    
    alert('Comment deleted successfully!');
}

function deleteApplication(id) {
    if (!confirm('Are you sure you want to delete this application?')) return;
    
    const applications = getApplications();
    const updatedApplications = applications.filter(app => app.id !== id);
    saveApplications(updatedApplications);
    
    loadApplicationsForAdmin();
    loadAdminStats();
    
    alert('Application deleted successfully!');
}

function viewApplication(id) {
    const applications = getApplications();
    const application = applications.find(app => app.id === id);
    
    if (!application) {
        alert('Application not found');
        return;
    }
    
    // Display application details in a modal or alert
    let details = `
        Full Name: ${application.fullName}
        Email: ${application.email}
        Phone: ${application.phone}
        Program: ${application.program}
        Education: ${application.education}
        Experience: ${application.experience || 'N/A'}
        Applied: ${formatDate(application.date)}
    `;
    
    alert(details);
}

// Application Management Functions
function submitApplication(event) {
    event.preventDefault();
    
    const formData = {
        id: Date.now(),
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        program: document.getElementById('program').value,
        education: document.getElementById('education').value,
        experience: document.getElementById('experience').value,
        date: new Date().toISOString()
    };
    
    // Validate required fields
    if (!formData.fullName || !formData.email || !formData.phone || !formData.program || !formData.education) {
        alert('Please fill in all required fields');
        return;
    }
    
    const applications = getApplications();
    applications.push(formData);
    saveApplications(applications);
    
    // Reset form
    document.getElementById('applicationForm').reset();
    
    alert('Application submitted successfully! We will contact you soon.');
}

function getApplications() {
    const applications = localStorage.getItem('keaMedCollege_applications');
    return applications ? JSON.parse(applications) : [];
}

function saveApplications(applications) {
    localStorage.setItem('keaMedCollege_applications', JSON.stringify(applications));
}