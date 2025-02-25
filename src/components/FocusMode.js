import { useState, useEffect } from "react";
import React from "react";

const FocusMode = () => {
    const [focusMode, setFocusMode] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);

    const bodyDoublingVideos = [
        "https://www.youtube.com/embed/yLOM8R6lbzg",
        "https://www.youtube.com/embed/heNl1IusphU?si=xf35QnYmvWrHJ44x",
        "https://www.youtube.com/embed/7izHQ7Ojt-s?si=NBf-NE06nHkijNxI",
        "https://www.youtube.com/embed/dkwp1bGNu2Q?si=G7Wr6BeDhEg7VBTf"
    ];

    useEffect(() => {
        chrome.storage.local.get(["focusMode"], (data) => {
            setFocusMode(data.focusMode || false);
        });
    }, []);

    const toggleFocusMode = () => {
        const newFocusMode = !focusMode;
        setFocusMode(newFocusMode);
        chrome.runtime.sendMessage({ action: "toggleFocusMode" });
    };

    const playRandomVideo = () => {
        const randomVideo = bodyDoublingVideos[Math.floor(Math.random() * bodyDoublingVideos.length)] + "?autoplay=1&modestbranding=1";
        setVideoUrl(randomVideo);
    };

    const nextVideo = () => {
        playRandomVideo();
    };

    const controlVideo = (command) => {
        chrome.runtime.sendMessage({ action: "controlVideo", command });
    };

    return (
        <div className="p-4 bg-gray-100 rounded-lg w-80 text-center">
            <div className="flex justify-between items-center p-2 bg-white rounded-lg shadow-md">
                <span>Focus Mode</span>
                <label className="relative inline-block w-12 h-6">
                    <input 
                        type="checkbox" 
                        checked={focusMode} 
                        onChange={toggleFocusMode} 
                        className="opacity-0 w-0 h-0"
                    />
                    <span className="absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-gray-300 rounded-full transition duration-300" />
                    <span className="absolute left-1 bottom-1 bg-white rounded-full w-4 h-4 transition duration-300 transform translate-x-0" style={{ transform: focusMode ? 'translateX(26px)' : 'translateX(0px)' }} />
                </label>
            </div>

            <div className="flex justify-center gap-4 mt-4">
                <button onClick={() => controlVideo("playVideo")} className="text-xl p-2 rounded-full bg-gray-200 hover:bg-gray-300"><i className="fa-solid fa-play"></i></button>
                <button onClick={() => controlVideo("pauseVideo")} className="text-xl p-2 rounded-full bg-gray-200 hover:bg-gray-300"><i className="fa-solid fa-pause"></i></button>
            </div>

            <button onClick={playRandomVideo} className="mt-4 bg-green-500 text-white p-2 rounded-lg hover:bg-green-600">🎥 Open Body Doubling Video</button>

            {videoUrl && (
                <div className="mt-4 bg-white p-2 rounded-lg shadow-md">
                    <iframe src={videoUrl} className="w-full h-56 rounded-lg" allowFullScreen></iframe>
                    <button onClick={nextVideo} className="mt-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600">🔄 Next Video</button>
                </div>
            )}
        </div>
    );
};

export default FocusMode;
