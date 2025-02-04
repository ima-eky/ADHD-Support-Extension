document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('focus-toggle');
    const output = document.getElementById("output");
    const playButton = document.getElementById('focus-play');
    const pauseButton = document.getElementById('focus-pause');


 

    // Restore toggle state on popup open
    chrome.storage.local.get(['focusMode'], (result) => {
        toggle.checked = result.focusMode || false; // Default to false if undefined
        output.innerText = toggle.checked ? "Focus Mode Activated" : "Focus Mode deactivated";
    });

    // Add event listener for toggle change
    toggle.addEventListener('change', (event) => {
        const isOn = event.target.checked; // Check the state of the toggle
        output.innerText = isOn ? "Focus Mode Activated" : "Focus Mode deactivated";

        // Send a message to the background script
        chrome.runtime.sendMessage({ action: 'toggleFocusMode', isOn });

        // Save the toggle state
        chrome.storage.local.set({ focusMode: isOn });
    });
});


document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.getElementById('body-doubling-toggle');
    const audio = document.getElementById('audio-co-worker');
  
    // Restore toggle state on popup open
    chrome.storage.local.get(['bodyDoubling'], (result) => {
      toggle.checked = result.bodyDoubling || false; // Default to false if undefined
      if (toggle.checked) {
        audio.play(); // Play audio if body doubling is on
      }
    });
  
    // Add event listener for toggle change
    toggle.addEventListener('change', (event) => {
      const isOn = event.target.checked; // Check the state of the toggle
  
      // Play or pause audio based on toggle state
      if (isOn) {
        audio.play(); // Play the audio
      } else {
        audio.pause(); // Pause the audio
      }
  
      // Save the toggle state in storage
      chrome.storage.local.set({ bodyDoubling: isOn });
    });
  });

  const videoContainer = document.getElementById("video-container");

  // Function to activate Body Doubling (show the video)
  function activateBodyDoubling() {
      videoContainer.style.display = "block";  // Show the video
  }
  
  // Function to deactivate Body Doubling (hide the video)
  function deactivateBodyDoubling() {
      videoContainer.style.display = "none";  // Hide the video
  }
  
  // Example of event listener for a toggle button (you would replace this with the actual toggle in your UI)
  const toggleBodyDoubling = document.getElementById("body-doubling-toggle");
  
  toggleBodyDoubling.addEventListener("change", (event) => {
      if (event.target.checked) {
          activateBodyDoubling();
      } else {
          deactivateBodyDoubling();
      }
  });
  