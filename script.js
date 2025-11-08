// Parallax scroll effect
document.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxBg = document.querySelector('.parallax-bg');
    
    // Move the background at a different rate than the scroll
    parallaxBg.style.transform = `translateY(${scrolled * 0.5}px)`;
    
    // Optional: Add more parallax effects for other elements
    document.querySelectorAll('.content-section').forEach(section => {
        const distance = section.getBoundingClientRect().top;
        const opacity = 1 - Math.max(0, Math.min(1, distance / window.innerHeight));
        section.style.opacity = Math.max(0, opacity);
    });
});
