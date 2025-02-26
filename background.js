let focusTabId = null;

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

            if (isOn) {
                chrome.tabs.query({ url: "https://www.youtube.com/*" }, (tabs) => {
                    let focusVideoTab = tabs.find(tab => tab.url.includes("yLOM8R6lbzg"));
                    if (focusVideoTab) {
                        chrome.storage.local.set({ focusTabId: focusVideoTab.id });
                    } else {
                        chrome.tabs.create({ url: "https://www.youtube.com/watch?v=yLOM8R6lbzg", active: false }, (tab) => {
                            chrome.storage.local.set({ focusTabId: tab.id });
                        });
                    }
                });
            } else {
                if (data.focusTabId) {
                    chrome.tabs.get(data.focusTabId, (tab) => {
                        if (!chrome.runtime.lastError) {
                            chrome.tabs.remove(data.focusTabId, () => {
                                chrome.storage.local.set({ focusTabId: null });
                            });
                        }
                    });
                }
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
    chrome.storage.local.get(["focusTabId", "focusMode"], (data) => {
        if (data.focusTabId === closedTabId) {
            chrome.storage.local.set({ focusMode: false, focusTabId: null });
        }
    });
});

// Function to update blocked sites
function updateBlockedSites() {
    chrome.storage.local.get(["blockedSites"], (data) => {
      const blockedSites = data.blockedSites || [];
      
      // Convert sites into Chrome rule format
      const rules = blockedSites.map((site, index) => ({
        id: index + 1,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: site, resourceTypes: ["main_frame"] }
      }));
  
      // Update extension's blocking rules
      chrome.declarativeNetRequest.updateDynamicRules({
        removeRuleIds: blockedSites.map((_, index) => index + 1),
        addRules: rules
      });
    });
  }
  
  // Listen for changes to blocked sites and update rules
  chrome.storage.onChanged.addListener(updateBlockedSites);
  
  // Initial setup when the extension starts
  chrome.runtime.onInstalled.addListener(updateBlockedSites);
  chrome.runtime.onStartup.addListener(updateBlockedSites);
  
