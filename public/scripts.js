const options = {
  timenav_position: "bottom", // Position the navigation at the bottom
  scale_factor: 0.5, // Scale factor
  initial_zoom: 3, // Initial zoom level
  timenav_height_percentage: 25, // Height of the timeline navigation as a percentage
  duration: 200, // Animation duration in milliseconds
  start_at_slide: 0, // Start at the first slide
};

function loadTimelineData(type, lang) {
  fetch(`timeline_data_${type}_${lang}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data.timeline && data.timeline.events && data.timeline.events.length > 0) {
        initializeTimeline(data.timeline);
      } else {
        console.error("The timeline configuration has no events.");
      }
    })
    .catch((error) => {
      console.error("Error loading timeline data:", error);
      // Load default timeline (Antiquity) in the default language if the specified type is not found
      if (type !== "antiquity" || lang !== "en") {
        loadTimelineData("antiquity", "en");
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
function selectTimeline(type, lang) {
  loadTimelineData(type, lang);
  toggleMenu();
}

// Collapse menu when clicking outside
document.addEventListener("click", (event) => {
  const menuItems = document.getElementById("menu-items");
  const burgerMenu = document.querySelector(".burger-menu");

  if (menuItems.style.display === "block" && !burgerMenu.contains(event.target) && !menuItems.contains(event.target)) {
    menuItems.style.display = "none";
  }
});

// Detect user's language preference and set the default timeline
document.addEventListener("DOMContentLoaded", () => {
  const userLang = navigator.language || navigator.userLanguage;
  const lang = userLang.split("-")[0]; // Use the first part of the language code (e.g., 'en' from 'en-US')
  loadTimelineData("antiquity", lang);
});
