// background.js
chrome.runtime.onInstalled.addListener(() => {
  // Initialize default settings
  chrome.storage.sync.get(['blockedSites', 'isEnabled'], (result) => {
    if (!result.blockedSites) {
      chrome.storage.sync.set({ blockedSites: [] });
    }
    if (result.isEnabled === undefined) {
      chrome.storage.sync.set({ isEnabled: true });
    }
  });
});

// Listen for messages from popup (keeping for future extensibility)
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'updateRules') {
    // Content script handles blocking now, but we can add logic here if needed
    console.log('Blocked sites updated:', request.sites);
  }
});
