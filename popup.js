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