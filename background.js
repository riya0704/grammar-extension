// Listen for when the user clicks the extension icon
chrome.action.onClicked.addListener((tab) => {
    // Inject the content script into the current tab
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ['content.js'],
    });
  });