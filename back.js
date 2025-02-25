let focusTabId = null;

// Initialize storage with default values if they don't exist
chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.local.get(["focusMode", "focusTabId"], (data) => {
        if (data.focusMode === undefined) {
            chrome.storage.local.set({ focusMode: false });
        }
        if (data.focusTabId === undefined) {
            chrome.storage.local.set({ focusTabId: null });
        }
    });
});


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggleFocusMode") {
        chrome.storage.local.get(["focusMode", "focusTabId"], (data) => {
            let isOn = !data.focusMode;
            chrome.storage.local.set({ focusMode: isOn });
            console.log(`Toggling Focus Mode: ${isOn ? "ON" : "OFF"}`);
            if (isOn) {
                // Open YouTube if not already opened
                chrome.tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
                    let focusVideoTab = tabs.find(tab => tab.url.includes("yLOM8R6lbzg")); // Match our video URL

                    if (focusVideoTab) {
                        console.log(`Focus video is already open in tab ${focusVideoTab.id}`);
                        chrome.storage.local.set({ focusTabId: focusVideoTab.id });
                    } else {
                        // 🔹 Open new tab if focus video isn't open
                        chrome.tabs.create({ url: "https://www.youtube.com/watch?v=yLOM8R6lbzg", active: false }, (tab) => {
                            console.log(`Opened new focus video tab: ${tab.id}`);
                            chrome.storage.local.set({ focusTabId: tab.id });
                        });
                    }
                });
            } else {
                // Turn off focus mode, close YouTube tab
                if (data.focusTabId) {
                    chrome.tabs.get(data.focusTabId, (tab) => {
                        if (chrome.runtime.lastError) {
                            console.warn("Tried to close a tab that no longer exists.");
                        } else {
                            console.log(`Closing YouTube Tab with ID: ${data.focusTabId}`);
                            chrome.tabs.remove(data.focusTabId, () => {
                                chrome.storage.local.set({ focusTabId: null });
                                console.log("Focus Mode disabled, tab closed.");
                            });
                        }
                    });
                }
                focusTabId = null;
            }
        });
    }

    if (message.action === "controlVideo") {
        chrome.storage.local.get(["focusTabId"], (data) => {
            if (data.focusTabId) {
                chrome.tabs.sendMessage(data.focusTabId, { action: message.command });
            }
        });
    }

    sendResponse({ success: true });
});

chrome.runtime.onStartup.addListener(() => {
    chrome.storage.local.get(["focusMode", "focusTabId"], (data) => {
        if (data.focusMode && data.focusTabId) {
            chrome.tabs.remove(data.focusTabId, () => {
                chrome.storage.local.set({ focusMode: false, focusTabId: null });
            });
        }
    });
});

chrome.tabs.onRemoved.addListener((closedTabId) => {
    console.log(`Tab closed: ${closedTabId}`); // Log every tab that closes

    chrome.storage.local.get(["focusTabId", "focusMode"], (data) => {
        console.log(`Stored focusTabId: ${data.focusTabId}, focusMode: ${data.focusMode}`); // Log stored tab info

        if (data.focusTabId === closedTabId) {
            console.log("Focus mode tab was closed by the user. Disabling Focus Mode.");

            // Disable Focus Mode when the associated tab is closed
            chrome.storage.local.set({ focusMode: false, focusTabId: null }, () => {
                console.log("Focus Mode disabled and tab ID cleared.");
            });
        }
    });
});
chrome.storage.local.get(null, (data) => console.log("Stored Data:", data));
