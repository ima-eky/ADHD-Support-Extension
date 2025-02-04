document.addEventListener("DOMContentLoaded", () => {
    const playRandomVideoBtn = document.getElementById("playRandomVideo");
    const videoContainer = document.getElementById("videoContainer");
    const videoPlayer = document.getElementById("videoPlayer");
    const nextButton = document.getElementById("nextVideo");
    const toggleSwitch = document.getElementById("toggleFocusMode");
    const playButton = document.getElementById("playVideo");
    const pauseButton = document.getElementById("pauseVideo");

    const bodyDoublingVideos = [
        "https://www.youtube.com/embed/yLOM8R6lbzg",
        "https://www.youtube.com/embed/heNl1IusphU?si=xf35QnYmvWrHJ44x",
        "https://www.youtube.com/embed/7izHQ7Ojt-s?si=NBf-NE06nHkijNxI",
        "https://www.youtube.com/embed/dkwp1bGNu2Q?si=G7Wr6BeDhEg7VBTf"
    ];

    function getRandomVideo() {
        const randomIndex = Math.floor(Math.random() * bodyDoublingVideos.length);
        return bodyDoublingVideos[randomIndex] + "?autoplay=1&modestbranding=1";
    }
     playRandomVideoBtn.addEventListener("click", () => {
        videoPlayer.src = getRandomVideo();
        videoContainer.style.display = "block"; // Show the video container
    });


    // Load a new random video
    nextButton.addEventListener("click", () => {
        videoPlayer.src = getRandomVideo();
    });
    // Load saved state
    chrome.storage.local.get(["focusMode"], (data) => {
        toggleSwitch.checked = data.focusMode || false;
    });

    toggleSwitch.addEventListener("change", () => {
        chrome.runtime.sendMessage({ action: "toggleFocusMode" }, () => {
            chrome.storage.local.get(["focusMode"], (data) => {
                toggleSwitch.checked = data.focusMode;
            });
        });
    });

    playButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "controlVideo", command: "playVideo" });
    });

    pauseButton.addEventListener("click", () => {
        chrome.runtime.sendMessage({ action: "controlVideo", command: "pauseVideo" });
    });
});
