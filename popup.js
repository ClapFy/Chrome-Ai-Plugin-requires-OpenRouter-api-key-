document.addEventListener('DOMContentLoaded', function() {
  const apiKeyInput = document.getElementById('apiKey');
  const generalApiKeyInput = document.getElementById('generalApiKey');
  const apiKeyStatus = document.getElementById('apiKeyStatus');
  const screenModeBtn = document.getElementById('screenMode');
  const generalModeBtn = document.getElementById('generalMode');
  const screenModeContent = document.getElementById('screenModeContent');
  const generalModeContent = document.getElementById('generalModeContent');
  const screenQuestionTextarea = document.getElementById('screenQuestion');
  const generalQuestionTextarea = document.getElementById('generalQuestion');
  const captureScreenBtn = document.getElementById('captureScreen');
  const askScreenQuestionBtn = document.getElementById('askScreenQuestion');
  const askGeneralQuestionBtn = document.getElementById('askGeneralQuestion');
  const responseContent = document.getElementById('responseContent');

  // Load saved API keys
  chrome.storage.sync.get(['openRouterApiKey'], function(result) {
    if (result.openRouterApiKey) {
      apiKeyInput.value = result.openRouterApiKey;
      generalApiKeyInput.value = result.openRouterApiKey;
    }
  });

  // Save API key when changed (both inputs)
  apiKeyInput.addEventListener('blur', function() {
    const apiKey = apiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ openRouterApiKey: apiKey }, function() {
        // Update both inputs
        generalApiKeyInput.value = apiKey;
        showApiKeyStatus();
      });
    }
  });

  generalApiKeyInput.addEventListener('blur', function() {
    const apiKey = generalApiKeyInput.value.trim();
    if (apiKey) {
      chrome.storage.sync.set({ openRouterApiKey: apiKey }, function() {
        // Update both inputs
        apiKeyInput.value = apiKey;
        showApiKeyStatus();
      });
    }
  });

  function showApiKeyStatus() {
    apiKeyStatus.classList.remove('hidden');
    setTimeout(() => {
      apiKeyStatus.classList.add('hidden');
    }, 2000);
  }

  // Mode switching
  screenModeBtn.addEventListener('click', function() {
    screenModeBtn.classList.add('active');
    generalModeBtn.classList.remove('active');
    screenModeContent.classList.add('active');
    generalModeContent.classList.remove('active');
    responseContent.innerHTML = 'Enter your API key and ask a question about your screen!';
  });

  generalModeBtn.addEventListener('click', function() {
    generalModeBtn.classList.add('active');
    screenModeBtn.classList.remove('active');
    generalModeContent.classList.add('active');
    screenModeContent.classList.remove('active');
    responseContent.innerHTML = 'Enter your API key and ask any question!';
  });

  // Capture screen button
  captureScreenBtn.addEventListener('click', function() {
    responseContent.innerHTML = '<div class="loading">Capturing screen...</div>';
    
    chrome.runtime.sendMessage({ action: 'captureScreen' }, function(response) {
      if (response.success) {
        responseContent.innerHTML = '<div class="success">Screen captured successfully! Now ask a question about it.</div>';
      } else {
        responseContent.innerHTML = '<div class="error">Failed to capture screen: ' + response.error + '</div>';
      }
    });
  });

  // Ask screen question button
  askScreenQuestionBtn.addEventListener('click', function() {
    const question = screenQuestionTextarea.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (!question) {
      responseContent.innerHTML = '<div class="error">Please enter a question first.</div>';
      return;
    }
    
    if (!apiKey) {
      responseContent.innerHTML = '<div class="error">Please enter your OpenRouter API key first.</div>';
      return;
    }

    responseContent.innerHTML = '<div class="loading">🤔 Analyzing your screen...</div>';
    
    chrome.runtime.sendMessage({
      action: 'askAI',
      question: question,
      apiKey: apiKey,
      mode: 'screen'
    }, function(response) {
      if (response.success) {
        responseContent.innerHTML = '<div class="response-content">' + response.answer + '</div>';
      } else {
        responseContent.innerHTML = '<div class="error">Error: ' + response.error + '</div>';
      }
    });
  });

  // Ask general question button
  askGeneralQuestionBtn.addEventListener('click', function() {
    const question = generalQuestionTextarea.value.trim();
    const apiKey = generalApiKeyInput.value.trim();
    
    if (!question) {
      responseContent.innerHTML = '<div class="error">Please enter a question first.</div>';
      return;
    }
    
    if (!apiKey) {
      responseContent.innerHTML = '<div class="error">Please enter your OpenRouter API key first.</div>';
      return;
    }

    responseContent.innerHTML = '<div class="loading">🤔 Thinking...</div>';
    
    chrome.runtime.sendMessage({
      action: 'askAI',
      question: question,
      apiKey: apiKey,
      mode: 'general'
    }, function(response) {
      if (response.success) {
        responseContent.innerHTML = '<div class="response-content">' + response.answer + '</div>';
      } else {
        responseContent.innerHTML = '<div class="error">Error: ' + response.error + '</div>';
      }
    });
  });

  // Enter key shortcuts for both textareas
  screenQuestionTextarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      askScreenQuestionBtn.click();
    }
  });

  generalQuestionTextarea.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.ctrlKey) {
      askGeneralQuestionBtn.click();
    }
  });
});
