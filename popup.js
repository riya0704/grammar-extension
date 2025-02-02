// Add an event listener to the "Check Grammar" button
document.getElementById('checkGrammar').addEventListener('click', async () => {
    // Get the text from the textarea
    const inputText = document.getElementById('inputText').value;
    const resultDiv = document.getElementById('result');
  
    // Check if the textarea is empty
    if (!inputText) {
      resultDiv.textContent = 'Please enter some text.';
      return;
    }
  
    // Show a loading message
    resultDiv.textContent = 'Checking grammar...';
  
    try {
      // Send the text to the LanguageTool API
      const response = await fetch('https://api.languagetool.org/v2/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `text=${encodeURIComponent(inputText)}&language=en-US`,
      });
  
      // Parse the API response
      const data = await response.json();
  
      // Check if there are any grammar issues
      if (data.matches && data.matches.length > 0) {
        let resultText = 'Grammar issues found:\n';
        data.matches.forEach((match, index) => {
          resultText += `${index + 1}. ${match.message}\n`;
        });
        resultDiv.textContent = resultText;
      } else {
        resultDiv.textContent = 'No grammar issues found!';
      }
    } catch (error) {
      // Handle errors
      resultDiv.textContent = 'Error checking grammar. Please try again.';
      console.error(error);
    }
  });
  // Load saved settings when the popup loads
document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['realTimeCheck'], (data) => {
    document.getElementById('realTimeToggle').checked = data.realTimeCheck !== false;
  });
});

// Save settings when the user toggles the checkbox
document.getElementById('realTimeToggle').addEventListener('change', (event) => {
  const realTimeCheck = event.target.checked;
  chrome.storage.sync.set({ realTimeCheck });
});