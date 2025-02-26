import { exp } from '@tensorflow/tfjs';
import React, { useEffect } from 'react';

export default function BlockListManager() {
    const [blockedSites, setBlockedSites] = React.useState([]);
    const [newSite, setNewSite] = React.useState('');   
    const [startTime, setStartTime] = React.useState(null);
    const [endTime, setEndTime] = React.useState(null);

    useEffect(() => {
        chrome.storage.local.get(["blockedSites", "blockSchedule"], (data) => {
            setBlockedSites(data.blockedSites || []);
            if (data.blockSchedule) {
              setStartTime(data.blockSchedule.startTime);
              setEndTime(data.blockSchedule.endTime);
            }
        });
    }, []);

    const addSite = () => {
        if (newSite) {
          const updatedSites = [...blockedSites, newSite]; // Add new site to the list
          setBlockedSites(updatedSites); // Update React state
          chrome.storage.local.set({ blockedSites: updatedSites }); // Save in Chrome storage
          setNewSite(""); // Clear input field
        }
      };

      const removeSite = (site) => {
        const updatedSites = blockedSites.filter((s) => s !== site);
        setBlockedSites(updatedSites);
        chrome.storage.local.set({ blockedSites: updatedSites }); // Update storage
      };

      const saveSchedule = () => {
        if (startTime && endTime) {
            chrome.storage.local.set({ blockSchedule: { start: startTime, end: endTime } });
            chrome.runtime.sendMessage({ action: "updateBlockSchedule" });
        }
      };
    
return (
    <div className="p-4 w-64">
        <h2 className="text-lg font-bold">Blocked Websites</h2>
        <input
        type="text"
        placeholder="Enter site (e.g., facebook.com)"
        value={newSite}
        onChange={(e) => setNewSite(e.target.value)}
        className="border p-2 rounded w-full mt-2"
        />
        <button
        onClick={addSite}
        className="bg-red-500 text-white px-4 py-2 rounded mt-2 w-full"
        >
        Block Site
        </button>

        <ul className="mt-4">
        {blockedSites.map((site, index) => (
            <li key={index} className="flex justify-between bg-gray-100 p-2 rounded mt-2">
            {site}
            <button
                onClick={() => removeSite(site)}
                className="bg-gray-400 text-white px-2 rounded"
            >
                Remove
            </button>
            </li>
        ))}
        </ul>
        <h2 className="text-lg font-bold mt-4">Blocking Schedule</h2>
        <label>Start Time:</label>
        <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded w-full" />
        
        <label>End Time:</label>
        <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded w-full" />

        <button onClick={saveSchedule} className="bg-blue-500 text-white px-4 py-2 rounded mt-2 w-full">
            Save Schedule
        </button>
    </div>
    );
}