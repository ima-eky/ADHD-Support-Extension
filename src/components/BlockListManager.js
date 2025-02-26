import { exp } from '@tensorflow/tfjs';
import React, { useEffect } from 'react';

export default function BlockListManager() {

    const [blockedSites, setBlockedSites] = React.useState([]);
    const [newSite, setNewSite] = React.useState('');   
    useEffect(() => {
        chrome.storage.local.get(["blockedSites"], (data) => {
            setBlockedSites(data.blockedSites || []);
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
    </div>
    );
}