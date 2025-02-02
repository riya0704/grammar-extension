// Load saved settings when the page loads
document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get(['openaiKey', 'language', 'realTimeCheck'], (data) => {
      document.getElementById('openaiKey').value = data.openaiKey || '';
      document.getElementById('language').value = data.language || 'en-US';
      document.getElementById('realTimeCheck').checked = data.realTimeCheck !== false;
    });
  });
  
  // Save settings when the user clicks the "Save Settings" button
  document.getElementById('saveSettings').addEventListener('click', () => {
    const openaiKey = document.getElementById('openaiKey').value;
    const language = document.getElementById('language').value;
    const realTimeCheck = document.getElementById('realTimeCheck').checked;
  
    chrome.storage.sync.set({ openaiKey, language, realTimeCheck }, () => {
      alert('Settings saved!');
    });
  });
  // View feedback
document.getElementById('viewFeedback').addEventListener('click', () => {
    chrome.storage.sync.get(['feedback'], (data) => {
      const feedbackOutput = document.getElementById('feedbackOutput');
      feedbackOutput.textContent = JSON.stringify(data.feedback || [], null, 2);
    });
  });
  
  // Export feedback
  document.getElementById('exportFeedback').addEventListener('click', () => {
    chrome.storage.sync.get(['feedback'], (data) => {
      const feedback = JSON.stringify(data.feedback || [], null, 2);
      const blob = new Blob([feedback], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'feedback.json';
      a.click();
      URL.revokeObjectURL(url);
    });
  });