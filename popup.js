document.getElementById('focus-button').addEventListener('click', () => {
    const output = document.getElementById('output');
    if (output.innerText === "Focus mode activated!") {
        output.innerText = "";
    }
    else {
        output.innerText = "Focus mode activated!";
        window.open('https://www.youtube.com/watch?v=6qXnPFytzU0')
    }

});

let video;

document.getElementById('focus-toggle').addEventListener('change', (event) => {
    const output = document.getElementById("output");
    const videoURL = "https://www.youtube.com/watch?v=6qXnPFytzU0"
   

    if (event.target.checked) {
        output.innerText = "Focus Mode Activated";
        video = window.open(videoURL, '_blank');
    } else {
        output.innerText = "Focus Mode deactivated";

        if (video) {
            video.close();
            video = null;
        }
    }
});