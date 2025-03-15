document.addEventListener('DOMContentLoaded', function() {
    const storyList = document.getElementById('story-list');
    const storyDescriptionContainer = document.querySelector('.story-description-container');
    const emptyText = document.querySelector('.empty-text');
    let currentStory = null;

    async function loadStories() {
        const response = await fetch('stories.json');
        const stories = await response.json();

        if (stories.length === 0) {
            emptyText.textContent = "The guy is lazy af, and hasn't added any stories yet";
            emptyText.style.display = 'block';
            storyList.style.display = 'none';
        } else {
            emptyText.style.display = 'none';
            storyList.style.display = 'block';
        }

        stories.forEach(story => {
            const storyItem = document.createElement('li');
            storyItem.classList.add('story-item');
            storyItem.dataset.story = story.path;
            storyItem.innerHTML = `
                <div class="story-header">
                    <div class="story-details">
                        <span class="story-title">${story.title}</span>
                        <span class="story-genre">${story.genre}</span>
                    </div>
                    <div class="story-actions">
                        <span class="story-words">${story.words}</span>
                        <span class="story-toggle">&#x25BC;</span>
                    </div>
                </div>
                <div class="story-description">
                    <p>${story.description}</p>
                    <a href="${story.path}" class="story-button">Read Story</a>
                </div>
            `;
            storyList.appendChild(storyItem);
        });

        addEventListeners();
    }

    function addEventListeners() {
        const storyItems = document.querySelectorAll('.story-item');

        function updateStoryDescriptions() {
            const isMobile = window.innerWidth < 768;
            const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;
            storyItems.forEach(item => {
                const description = item.querySelector('.story-description');
                const toggle = item.querySelector('.story-toggle');
                const readButton = item.querySelector('.story-button');
                if (isMobile) {
                    description.style.display = 'block';
                    toggle.style.display = 'none';
                    if (readButton) {
                        readButton.style.display = 'none';
                    }
                } else if (isTablet) {
                    description.style.display = 'none';
                    toggle.style.display = 'none';
                } else {
                    description.style.display = 'none';
                    toggle.style.display = 'block';
                    if (readButton) {
                        readButton.style.display = 'inline-block';
                    }
                }
            });

            if (isTablet) {
                storyDescriptionContainer.style.display = 'flex';
            } else {
                storyDescriptionContainer.style.display = 'none';
            }
        }

        storyItems.forEach(item => {
            const header = item.querySelector('.story-header');
            const description = item.querySelector('.story-description');
            const toggle = item.querySelector('.story-toggle');
            const readButton = item.querySelector('.story-button');

            header.addEventListener('click', () => {
                if (window.innerWidth >= 1024) {
                    const isOpen = description.style.display === 'block';
                    storyItems.forEach(i => {
                        i.querySelector('.story-description').style.display = 'none';
                        i.querySelector('.story-toggle').innerHTML = '&#x25BC;';
                    });
                    if (!isOpen) {
                        description.style.display = 'block';
                        toggle.innerHTML = '&#x25B2;';
                    }
                }
            });

            if (window.innerWidth < 768) {
                item.addEventListener('click', () => {
                    if (readButton) {
                        window.location.href = readButton.href;
                    }
                });
            }

            item.addEventListener('click', () => {
                if (window.innerWidth >= 768 && window.innerWidth < 1024) {
                    currentStory = item.dataset.story;
                    storyDescriptionContainer.innerHTML = description.innerHTML;
                    emptyText.style.display = 'none';
                }
            });
        });

        window.addEventListener('resize', updateStoryDescriptions);
        updateStoryDescriptions();
    }

    loadStories();
});