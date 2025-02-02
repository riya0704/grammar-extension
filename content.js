// Function to check spelling and grammar using OpenAI's GPT API
async function checkSpellingAndGrammar(text, apiKey) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a helpful spelling and grammar assistant. Correct any spelling and grammar mistakes in the following text and provide suggestions:',
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error checking spelling and grammar with OpenAI:', error);
    return null;
  }
}

// Function to create a sidebar for displaying suggestions
function createSidebar() {
  const sidebar = document.createElement('div');
  sidebar.id = 'grammar-sidebar';
  sidebar.style.position = 'fixed';
  sidebar.style.top = '0';
  sidebar.style.right = '0';
  sidebar.style.width = '300px';
  sidebar.style.height = '100%';
  sidebar.style.backgroundColor = '#f9f9f9';
  sidebar.style.boxShadow = '-2px 0 5px rgba(0, 0, 0, 0.1)';
  sidebar.style.zIndex = '1000';
  sidebar.style.padding = '10px';
  sidebar.style.overflowY = 'auto';
  document.body.appendChild(sidebar);
  return sidebar;
}

// Function to display suggestions in the sidebar
function displaySuggestion(sidebar, type, original, suggestion) {
  const suggestionDiv = document.createElement('div');
  suggestionDiv.style.marginBottom = '10px';
  suggestionDiv.style.padding = '10px';
  suggestionDiv.style.backgroundColor = '#fff';
  suggestionDiv.style.border = '1px solid #ddd';
  suggestionDiv.style.borderRadius = '4px';

  const typeLabel = document.createElement('strong');
  typeLabel.textContent = `${type}: `;
  suggestionDiv.appendChild(typeLabel);

  const originalText = document.createElement('span');
  originalText.textContent = original;
  suggestionDiv.appendChild(originalText);

  const arrow = document.createElement('span');
  arrow.textContent = ' → ';
  suggestionDiv.appendChild(arrow);

  const suggestionText = document.createElement('span');
  suggestionText.textContent = suggestion;
  suggestionDiv.appendChild(suggestionText);

  sidebar.appendChild(suggestionDiv);
}

// Listen for input events on textareas and input fields
document.addEventListener('input', async (event) => {
  const target = event.target;

  if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') {
    const text = target.value;

    // Load settings
    const { openaiKey, realTimeCheck } = await new Promise((resolve) => {
      chrome.storage.sync.get(['openaiKey', 'realTimeCheck'], resolve);
    });

    // Skip checking if real-time checking is disabled or API key is missing
    if (realTimeCheck === false || !openaiKey) return;

    // Check spelling and grammar with OpenAI's GPT
    const suggestion = await checkSpellingAndGrammar(text, openaiKey);

    // Display the suggestion in the sidebar
    if (suggestion) {
      let sidebar = document.getElementById('grammar-sidebar');
      if (!sidebar) {
        sidebar = createSidebar();
      }

      // Clear previous suggestions
      sidebar.innerHTML = '';

      // Parse the suggestion and display it
      const lines = suggestion.split('\n');
      lines.forEach((line) => {
        if (line.startsWith('Spelling:')) {
          const [original, corrected] = line.replace('Spelling: ', '').split(' → ');
          displaySuggestion(sidebar, 'Spelling', original, corrected);
        } else if (line.startsWith('Grammar:')) {
          const [original, corrected] = line.replace('Grammar: ', '').split(' → ');
          displaySuggestion(sidebar, 'Grammar', original, corrected);
        }
      });
    }
  }
});
// Function to display suggestions in the sidebar
function displaySuggestion(sidebar, type, original, suggestion) {
  const suggestionDiv = document.createElement('div');
  suggestionDiv.style.marginBottom = '10px';
  suggestionDiv.style.padding = '10px';
  suggestionDiv.style.backgroundColor = '#fff';
  suggestionDiv.style.border = '1px solid #ddd';
  suggestionDiv.style.borderRadius = '4px';

  const typeLabel = document.createElement('strong');
  typeLabel.textContent = `${type}: `;
  suggestionDiv.appendChild(typeLabel);

  const originalText = document.createElement('span');
  originalText.textContent = original;
  suggestionDiv.appendChild(originalText);

  const arrow = document.createElement('span');
  arrow.textContent = ' → ';
  suggestionDiv.appendChild(arrow);

  const suggestionText = document.createElement('span');
  suggestionText.textContent = suggestion;
  suggestionDiv.appendChild(suggestionText);

  // Add a "Report" button
  const reportButton = document.createElement('button');
  reportButton.textContent = 'Report';
  reportButton.style.marginLeft = '10px';
  reportButton.style.padding = '2px 6px';
  reportButton.style.backgroundColor = '#ffeb3b';
  reportButton.style.border = 'none';
  reportButton.style.borderRadius = '4px';
  reportButton.style.cursor = 'pointer';
  reportButton.addEventListener('click', () => {
    reportIncorrectSuggestion(type, original, suggestion);
  });
  suggestionDiv.appendChild(reportButton);

  sidebar.appendChild(suggestionDiv);
}

// Function to handle feedback submission
function reportIncorrectSuggestion(type, original, suggestion) {
  const feedback = {
    type,
    original,
    suggestion,
    timestamp: new Date().toISOString(),
  };

  // Save feedback to Chrome's storage
  chrome.storage.sync.get(['feedback'], (data) => {
    const feedbackList = data.feedback || [];
    feedbackList.push(feedback);
    chrome.storage.sync.set({ feedback: feedbackList }, () => {
      alert('Thank you for your feedback!');
    });
  });
}