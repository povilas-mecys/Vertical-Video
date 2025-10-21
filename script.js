document.addEventListener('DOMContentLoaded', () => {
    // Select elements by their unique IDs. This works perfectly with the new semantic HTML.
    const container = document.getElementById('shorts-container');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    
    // A safeguard to ensure all necessary elements are present before running the script.
    if (!container || !prevBtn || !nextBtn) {
        console.error("Carousel elements not found. Please ensure the HTML has elements with IDs: 'shorts-container', 'prev-btn', and 'next-btn'.");
        return;
    }

    // The children of the container are now <article> tags, which is correct.
    const items = Array.from(container.children);
    const totalItems = items.length;
    let currentIndex = 0;

    // This function handles the visual update of the carousel.
    const updateCarousel = () => {
        // scrollIntoView provides a smooth, CSS-driven scroll to the active item.
        const currentItem = items[currentIndex];
        if(currentItem) {
            currentItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
        }

        // Update button states for accessibility and usability.
        // Disable the 'previous' button when viewing the first item.
        prevBtn.disabled = currentIndex === 0;
        // Disable the 'next' button when viewing the last item.
        nextBtn.disabled = currentIndex === totalItems - 1;
    };

    // Event listener for the 'Next' button.
    nextBtn.addEventListener('click', () => {
        if (currentIndex < totalItems - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Event listener for the 'Previous' button.
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } 
    });

    // Set the initial state of the carousel buttons on page load.
    updateCarousel();
    
    // This part handles updating the buttons if the user manually swipes on a touch device.
    // A timeout prevents the code from running too often while scrolling.
    let scrollTimeout;
    container.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            const scrollLeft = container.scrollLeft;
            const itemWidth = container.clientWidth; // Use clientWidth for accurate width of the visible area
            const newIndex = Math.round(scrollLeft / itemWidth);

            if (newIndex !== currentIndex) {
                currentIndex = newIndex;
                // Only update the button state, no need to trigger another scroll.
                prevBtn.disabled = currentIndex === 0;
                nextBtn.disabled = currentIndex === totalItems - 1;
            }
        }, 150); // A 150ms debounce delay.
    });
});

