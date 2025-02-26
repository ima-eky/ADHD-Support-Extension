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


// Function to check if the current time is within the blocking period
function isWithinBlockingTime(startTime, endTime) {
    const now = new Date();
    const start = new Date();
    const end = new Date();
  
    const [startHours, startMinutes] = startTime.split(":");
    const [endHours, endMinutes] = endTime.split(":");
  
    start.setHours(parseInt(startHours, 10), parseInt(startMinutes, 10), 0);
    end.setHours(parseInt(endHours, 10), parseInt(endMinutes, 10), 0);
  
    return now >= start && now <= end;
  }
  
  // Function to update blocking rules based on time
  function updateBlocking() {
    chrome.storage.local.get(["blockedSites", "blockSchedule"], (data) => {
      const blockedSites = data.blockedSites || [];
      const schedule = data.blockSchedule;
  
      if (schedule && isWithinBlockingTime(schedule.start, schedule.end)) {
        // Block sites
        const rules = blockedSites.map((site, index) => ({
          id: index + 1,
          priority: 1,
          action: { type: "block" },
          condition: { urlFilter: site, resourceTypes: ["main_frame"] }
        }));
  
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: blockedSites.map((_, index) => index + 1),
          addRules: rules
        });
      } else {
        // Unblock sites
        chrome.declarativeNetRequest.updateDynamicRules({
          removeRuleIds: blockedSites.map((_, index) => index + 1),
          addRules: []
        });
      }
    });
  }
  
  // Listen for messages from popup.js when schedule is updated
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "updateBlockSchedule") {
      updateBlocking();
    }
  });
  
  // Set up periodic checking
  chrome.alarms.create("checkBlocking", { periodInMinutes: 1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "checkBlocking") {
      updateBlocking();
    }
  });
  
  // Run check on extension startup
  chrome.runtime.onStartup.addListener(updateBlocking);
  chrome.runtime.onInstalled.addListener(updateBlocking);
  
