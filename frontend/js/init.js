// Initialize sample data
function initializeSampleData() {
    // Check if data already exists
    if (localStorage.getItem('keaMedCollege_initialized')) return;
    
    // Sample news
    const sampleNews = [
        {
            id: 1,
            title: "New Research Center Opening",
            content: "Kea Med College is proud to announce the opening of our new state-of-the-art research center dedicated to medical innovation and discovery.",
            image: "images/research-center.jpg",
            date: new Date('2024-01-15').toISOString()
        },
        {
            id: 2,
            title: "Fall Admission Now Open",
            content: "Applications for the Fall 2024 semester are now being accepted. Don't miss your chance to join our prestigious medical program.",
            image: "images/admission-banner.jpg",
            date: new Date('2024-01-10').toISOString()
        }
    ];
    
    // Sample comments
    const sampleComments = [
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@email.com",
            comment: "Excellent facilities and faculty. My daughter is thriving in the nursing program!",
            date: new Date('2024-01-08').toISOString()
        }
    ];
    
    // Save sample data
    localStorage.setItem('keaMedCollege_news', JSON.stringify(sampleNews));
    localStorage.setItem('keaMedCollege_comments', JSON.stringify(sampleComments));
    localStorage.setItem('keaMedCollege_applications', JSON.stringify([]));
    localStorage.setItem('keaMedCollege_initialized', 'true');
}

// Call this function when the website loads
document.addEventListener('DOMContentLoaded', initializeSampleData);