chrome.runtime.onMessage.addListener((message) => {
    let video = document.querySelector("video");

    if (!video) return;

    if (message.action === "playVideo") {
        video.play();
    }

    if (message.action === "pauseVideo") {
        video.pause();
    }
});
