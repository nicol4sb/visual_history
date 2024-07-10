// script.js

// Detect user's language preference
const userLang = navigator.language || navigator.userLanguage;
const lang = userLang.split("-")[0]; // Use the first part of the language code (e.g., 'en' from 'en-US')

const options = {
  timenav_position: "bottom", // Position the navigation at the top
  scale_factor: 1, // Scale factor
  timenav_height_percentage: 10, // Height of the timeline navigation as a percentage
  timenav_mobile_height_percentage: 30,
  duration: 300, // Animation duration in milliseconds
  start_at_slide: 0, // Start at the first slide
  language:lang,
};

function loadTimelineData(lang) {
  fetch(`/timeline_data_${lang}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (
        data.timeline &&
        data.timeline.events &&
        data.timeline.events.length > 0
      ) {
        // Add territory information to the text content
        data.timeline.events.forEach((event) => {
          event.text.text += `<br><br><strong>Territoire :</strong> ${event.territory}`;
        });
        initializeTimeline(data.timeline);
      } else {
        console.error("The timeline configuration has no events.");
      }
    })
    .catch((error) => {
      console.error("Error loading timeline data:", error);
      // Load default language (English) if the specified language file is not found
      if (lang !== "en") {
        loadTimelineData("en");
      }
    });
}

function initializeTimeline(timelineData) {
  const timelineContainer = document.getElementById("timeline-embed");
  new TL.Timeline(timelineContainer, timelineData, options);
  console.log("Timeline successfully loaded:", timelineData);
}

// Load the timeline data in the user's preferred language if available, otherwise default to English
loadTimelineData(lang);
