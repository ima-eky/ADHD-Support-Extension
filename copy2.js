let videoTabId = null;

// Listen for messages from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleFocusMode') {
        const videoURL = "https://www.youtube.com/watch?v=6qXnPFytzU0";

        if (request.isOn) {
            if (!videoTabId) {
                // Create a new tab with the video URL and open it in the background
                chrome.tabs.create({ url: videoURL, active: false }, (tab) => {
                    videoTabId = tab.id; // Store the tab ID

                    chrome.scripting.executeScript({
                        target: { tabId: tab.id },
                        func: playYouTubeVideo,
                    });
                });
            }
        } else {
            if (videoTabId) {
                chrome.tabs.remove(videoTabId, () => {
                    videoTabId = null; // Reset the tab ID
                });
            }
        }
    }
});

function playYouTubeVideo() {
    // Add a delay to ensure the video element is loaded
    setTimeout(() => {
        const video = document.querySelector("video");
        if (video) {
            video.play();
        }
    }, 2000); // Adjust the delay as needed
}

// Listen for tab updates to check if the video is closed
chrome.tabs.onRemoved.addListener((tabId) => {
    if (tabId === videoTabId) {
        videoTabId = null; // Clear the tab ID
        chrome.storage.local.set({ focusMode: false }); // Reset storage state
    }
});
