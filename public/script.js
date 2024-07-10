// script.js
const options = {
    timenav_position: "top", // Position the navigation at the top
    scale_factor: 0.5, // Scale factor
    initial_zoom: 3, // Initial zoom level
    timenav_height_percentage: 25, // Height of the timeline navigation as a percentage
    duration: 1000, // Animation duration in milliseconds
    start_at_slide: 0 // Start at the first slide
  };
  
  function loadTimelineData(lang) {
    fetch(`/timeline_data_${lang}.json`)
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        if (data.timeline && data.timeline.events && data.timeline.events.length > 0) {
          // Add territory information to the text content
          data.timeline.events.forEach(event => {
            event.text.text += `<br><br><strong>Territoire :</strong> ${event.territory}`;
          });
          initializeTimeline(data.timeline);
        } else {
          console.error("The timeline configuration has no events.");
        }
      })
      .catch(error => {
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
  
  // Detect user's language preference
  const userLang = navigator.language || navigator.userLanguage;
  const lang = userLang.split("-")[0]; // Use the first part of the language code (e.g., 'en' from 'en-US')
  
  // Load the timeline data in the user's preferred language if available, otherwise default to English
  loadTimelineData(lang);
  