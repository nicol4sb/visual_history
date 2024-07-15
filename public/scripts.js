const options = {
    timenav_position: "bottom", // Position the navigation at the bottom
    scale_factor: 1, // Scale factor
    timenav_height_percentage: 25, // Height of the timeline navigation as a percentage
    duration: 200, // Animation duration in milliseconds
    start_at_slide: 0, // Start at the first slide
};

function loadTimelineData(type, lang) {
    fetch(`/timeline_data_${type}_${lang}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.timeline && data.timeline.events && data.timeline.events.length > 0) {
                initializeTimeline(data.timeline);
            } else {
                console.error("The timeline configuration has no events.");
            }
        })
        .catch(error => {
            console.error("Error loading timeline data:", error);
            // Load English version if the specified language file is not found
            if (lang !== "en") {
                console.log(`Trying to load the English version for type ${type}`);
                loadTimelineData(type, "en");
            }
        });
}

function initializeTimeline(timelineData) {
    const timelineContainer = document.getElementById("timeline-embed");
    new TL.Timeline(timelineContainer, timelineData, options);
    console.log("Timeline successfully loaded:", timelineData);
}

// Toggle menu visibility
function toggleMenu() {
    const menuItems = document.getElementById("menu-items");
    if (menuItems.style.display === "block") {
        menuItems.style.display = "none";
    } else {
        menuItems.style.display = "block";
        // Set a timeout to hide the menu after 5 seconds
        setTimeout(() => {
            menuItems.style.display = "none";
        }, 5000);
    }
}

// Select timeline and collapse the menu
function selectTimeline(type) {
    loadTimelineData(type, userLang);
    toggleMenu();
}

// Collapse menu when clicking outside
document.addEventListener("click", event => {
    const menuItems = document.getElementById("menu-items");
    const burgerMenu = document.querySelector(".burger-menu");

    if (menuItems.style.display === "block" && !burgerMenu.contains(event.target) && !menuItems.contains(event.target)) {
        menuItems.style.display = "none";
    }
});

// Detect user's language preference and set the default timeline
const userLang = (navigator.language || navigator.userLanguage).split("-")[0];

// Fetch timeline files and generate menu dynamically
document.addEventListener("DOMContentLoaded", () => {
    fetch("/list-timeline-files") // Server-side endpoint to list timeline files
        .then(response => {
            if (!response.ok) {
                throw new Error(`Failed to fetch timeline files: ${response.statusText}`);
            }
            return response.json();
        })
        .then(files => {
            const menuItems = document.getElementById("menu-items");
            const types = new Set(files.map(file => file.match(/timeline_data_(.*?)_/)[1]));
            types.forEach(type => {
                const button = document.createElement("button");
                button.textContent = type.charAt(0).toUpperCase() + type.slice(1);
                button.onclick = () => selectTimeline(type);
                menuItems.appendChild(button);
            });
        })
        .catch(error => {
            console.error("Error fetching timeline files:", error);
        });

    // Load default timeline (Antiquity)
    loadTimelineData("antiquity", userLang);
});
