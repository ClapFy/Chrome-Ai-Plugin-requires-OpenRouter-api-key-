// Background service worker for AI Screen Assistant
let currentScreenshot = null;

// Import configuration
importScripts('config.js');

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'captureScreen') {
    captureScreen().then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (request.action === 'askAI') {
    askAI(request.question, request.apiKey, request.mode).then(sendResponse);
    return true; // Keep message channel open for async response
  } else if (request.action === 'getConfig') {
    // Return the current configuration
    sendResponse(CONFIG);
    return false;
  }
});

async function captureScreen() {
  try {
    // Get the current active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab) {
      throw new Error('No active tab found');
    }

    // Use Chrome's native screenshot API
    const screenshot = await chrome.tabs.captureVisibleTab(tab.windowId, {
      format: 'jpeg',
      quality: 80
    });

    if (screenshot) {
      currentScreenshot = screenshot;
      return { success: true };
    } else {
      throw new Error('Failed to capture screenshot');
    }

  } catch (error) {
    console.error('Screen capture error:', error);
    return { success: false, error: error.message };
  }
}

async function askAI(question, apiKey, mode = 'screen') {
  try {
    // Use provided API key
    if (!apiKey || !apiKey.trim()) {
      return { 
        success: false, 
        error: 'Please enter your OpenRouter API key first.' 
      };
    }

    const keyToUse = apiKey.trim();

    // Get mode-specific configuration
    const modeConfig = CONFIG.MODES[mode] || CONFIG.MODES.screen;
    
    if (mode === 'screen') {
      // Screen mode requires a screenshot
      if (!currentScreenshot) {
        return { success: false, error: 'No screenshot available. Please capture the screen first.' };
      }

      // Prepare the prompt with context about the screenshot
      const prompt = `You are an AI assistant that can see screenshots. The user has shared a screenshot of their screen and is asking: "${question}"

Please analyze the screenshot and provide a helpful, accurate answer. If you can see text, images, or other content, describe what you observe and answer their question based on that information.

Be concise but thorough in your response.`;

      // Call OpenRouter API with image using mode-specific settings
      const response = await fetch(CONFIG.OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-screen-assistant.com',
          'X-Title': CONFIG.EXTENSION_NAME
        },
        body: JSON.stringify({
          model: modeConfig.model,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: prompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: currentScreenshot,
                    detail: 'high'
                  }
                }
              ]
            }
          ],
          max_tokens: modeConfig.maxTokens,
          temperature: modeConfig.temperature
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content || 'No response from AI';
      
      return { 
        success: true, 
        answer: answer
      };

    } else {
      // General mode - no screenshot needed
      const prompt = `You are a helpful AI assistant. The user is asking: "${question}"

Please provide a clear, helpful, and accurate answer to their question. Be informative and engaging in your response.`;

      // Call OpenRouter API without image using mode-specific settings
      const response = await fetch(CONFIG.OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${keyToUse}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://ai-screen-assistant.com',
          'X-Title': CONFIG.EXTENSION_NAME
        },
        body: JSON.stringify({
          model: modeConfig.model,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: modeConfig.maxOutputTokens,
          temperature: modeConfig.temperature
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices[0]?.message?.content || 'No response from AI';
      
      return { 
        success: true, 
        answer: answer
      };
    }
  } catch (error) {
    console.error('AI API error:', error);
    return { success: false, error: error.message };
  }
}

// Handle installation
chrome.runtime.onInstalled.addListener(() => {
  console.log(`${CONFIG.EXTENSION_NAME} v${CONFIG.EXTENSION_VERSION} installed successfully`);
});
