javascript// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('header');

    // Monitor page scroll status dynamically
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.borderBottom = '1px solid #eaeaea';
            header.style.transition = 'all 0.3s ease';
        } else {
            header.style.boxShadow = '0 2px 15px rgba(0, 0, 0, 0.05)';
            header.style.borderBottom = 'none';
        }
    });
});
