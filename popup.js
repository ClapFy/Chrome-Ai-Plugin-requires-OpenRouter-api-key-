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
  const askScreenQuestionBtn = document.getElementById('askScreenQuestion');
  const askGeneralQuestionBtn = document.getElementById('askGeneralQuestion');
  const responseContent = document.getElementById('responseContent');

  // Configuration display elements
  const screenModel = document.getElementById('screenModel');
  const screenTemp = document.getElementById('screenTemp');
  const screenTokens = document.getElementById('screenTokens');
  const screenOutputTokens = document.getElementById('screenOutputTokens');
  const screenInputTokens = document.getElementById('screenInputTokens');
  const screenDescription = document.getElementById('screenDescription');
  const generalModel = document.getElementById('generalModel');
  const generalTemp = document.getElementById('generalTemp');
  const generalTokens = document.getElementById('generalTokens');
  const generalOutputTokens = document.getElementById('generalOutputTokens');
  const generalInputTokens = document.getElementById('generalInputTokens');
  const generalDescription = document.getElementById('generalDescription');

  // Add animation classes to elements on load
  addInitialAnimations();

  // Load saved API keys
  chrome.storage.sync.get(['openRouterApiKey'], function(result) {
    if (result.openRouterApiKey) {
      apiKeyInput.value = result.openRouterApiKey;
      generalApiKeyInput.value = result.openRouterApiKey;
    }
  });

  // Load and display mode configurations
  loadModeConfigurations();

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
        generalApiKeyInput.value = apiKey;
        showApiKeyStatus();
      });
    }
  });

  function showApiKeyStatus() {
    apiKeyStatus.classList.remove('hidden');
    apiKeyStatus.classList.add('success-pulse');
    setTimeout(() => {
      apiKeyStatus.classList.add('hidden');
      apiKeyStatus.classList.remove('success-pulse');
    }, 2000);
  }

  function loadModeConfigurations() {
    // Load config from background script
    chrome.runtime.sendMessage({ action: 'getConfig' }, function(config) {
      if (config && config.MODES) {
        // Display screen mode config
        screenModel.textContent = config.MODES.screen.model;
        screenTemp.textContent = config.MODES.screen.temperature;
        screenTokens.textContent = config.MODES.screen.maxTokens.toLocaleString();
        screenOutputTokens.textContent = config.MODES.screen.maxOutputTokens.toLocaleString();
        screenInputTokens.textContent = config.MODES.screen.maxInputTokens.toLocaleString();
        screenDescription.textContent = config.MODES.screen.description;

        // Display general mode config
        generalModel.textContent = config.MODES.general.model;
        generalTemp.textContent = config.MODES.general.temperature;
        generalTokens.textContent = config.MODES.general.maxTokens.toLocaleString();
        generalOutputTokens.textContent = config.MODES.general.maxOutputTokens.toLocaleString();
        generalInputTokens.textContent = config.MODES.general.maxInputTokens.toLocaleString();
        generalDescription.textContent = config.MODES.general.description;
      }
    });
  }

  // Mode switching with animations
  screenModeBtn.addEventListener('click', function() {
    screenModeBtn.classList.add('active');
    generalModeBtn.classList.remove('active');
    
    // Animate content transition
    generalModeContent.classList.add('slide-out-right');
    setTimeout(() => {
      generalModeContent.classList.remove('active', 'slide-out-right');
      screenModeContent.classList.add('active', 'slide-in-left');
      setTimeout(() => {
        screenModeContent.classList.remove('slide-in-left');
      }, 600);
    }, 300);
    
    animateTextChange(responseContent, 'Enter your API key and ask a question about your screen!');
  });

  generalModeBtn.addEventListener('click', function() {
    generalModeBtn.classList.add('active');
    screenModeBtn.classList.remove('active');
    
    // Animate content transition
    screenModeContent.classList.add('slide-out-left');
    setTimeout(() => {
      screenModeContent.classList.remove('active', 'slide-out-left');
      generalModeContent.classList.add('active', 'slide-in-right');
      setTimeout(() => {
        generalModeContent.classList.remove('slide-in-right');
      }, 600);
    }, 300);
    
    animateTextChange(responseContent, 'Enter your API key and ask any question!');
  });

  // Ask screen question button - automatically captures screen first
  askScreenQuestionBtn.addEventListener('click', function() {
    const question = screenQuestionTextarea.value.trim();
    const apiKey = apiKeyInput.value.trim();
    
    if (!question) {
      showAnimatedError('Please enter a question first.');
      return;
    }
    
    if (!apiKey) {
      showAnimatedError('Please enter your OpenRouter API key first.');
      return;
    }

    showAnimatedLoading('📸 Capturing screen...');
    
    // First capture the screen, then ask the AI
    chrome.runtime.sendMessage({ action: 'captureScreen' }, function(captureResponse) {
      if (captureResponse.success) {
        showAnimatedLoading('🤔 Analyzing your screen...');
        
        // Now ask the AI with the captured screenshot using screen mode config
        chrome.runtime.sendMessage({
          action: 'askAI',
          question: question,
          apiKey: apiKey,
          mode: 'screen'
        }, function(aiResponse) {
          if (aiResponse.success) {
            showAnimatedResponse(aiResponse.answer);
          } else {
            showAnimatedError('Error: ' + aiResponse.error);
          }
        });
      } else {
        showAnimatedError('Failed to capture screen: ' + captureResponse.error);
      }
    });
  });

  // Ask general question button
  askGeneralQuestionBtn.addEventListener('click', function() {
    const question = generalQuestionTextarea.value.trim();
    const apiKey = generalApiKeyInput.value.trim();
    
    if (!question) {
      showAnimatedError('Please enter a question first.');
      return;
    }
    
    if (!apiKey) {
      showAnimatedError('Please enter your OpenRouter API key first.');
      return;
    }

    showAnimatedLoading('🤔 Thinking...');
    
    // Ask AI using general mode config
    chrome.runtime.sendMessage({
      action: 'askAI',
      question: question,
      apiKey: apiKey,
      mode: 'general'
    }, function(response) {
      if (response.success) {
        showAnimatedResponse(response.answer);
      } else {
        showAnimatedError('Error: ' + response.error);
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

  // Animation functions
  function addInitialAnimations() {
    // Add staggered animations to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach((section, index) => {
      section.style.animationDelay = `${index * 0.1}s`;
      section.classList.add('fade-in-up');
    });

    // Add animation to header elements
    const headerElements = document.querySelectorAll('.header > *');
    headerElements.forEach((element, index) => {
      element.style.animationDelay = `${index * 0.2}s`;
      element.classList.add('scale-in');
    });

    // Add animation to mode toggle
    const modeToggle = document.querySelector('.mode-toggle');
    modeToggle.classList.add('bounce-in');
  }

  function showAnimatedLoading(message) {
    responseContent.innerHTML = `<div class="loading loading-dots">${message}</div>`;
    responseContent.classList.add('fade-in-up');
    setTimeout(() => {
      responseContent.classList.remove('fade-in-up');
    }, 800);
  }

  function showAnimatedError(message) {
    responseContent.innerHTML = `<div class="error error-shake">${message}</div>`;
    responseContent.classList.add('fade-in-up');
    setTimeout(() => {
      responseContent.classList.remove('fade-in-up');
    }, 800);
  }

  function showAnimatedResponse(answer) {
    responseContent.innerHTML = `<div class="response-content text-reveal">${answer}</div>`;
    responseContent.classList.add('fade-in-up');
    
    // Add character-by-character animation
    setTimeout(() => {
      animateTextCharacterByCharacter(answer);
    }, 800);
    
    setTimeout(() => {
      responseContent.classList.remove('fade-in-up');
    }, 800);
  }

  function animateTextChange(element, newText) {
    element.classList.add('fade-out');
    setTimeout(() => {
      element.innerHTML = newText;
      element.classList.remove('fade-out');
      element.classList.add('fade-in-up');
      setTimeout(() => {
        element.classList.remove('fade-in-up');
      }, 800);
    }, 300);
  }

  function animateTextCharacterByCharacter(text) {
    const responseDiv = responseContent.querySelector('.response-content');
    if (!responseDiv) return;
    
    responseDiv.innerHTML = '';
    const words = text.split(' ');
    
    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.style.marginRight = '4px';
      
      setTimeout(() => {
        wordSpan.classList.add('char-animation');
        wordSpan.style.animationDelay = `${wordIndex * 0.1}s`;
        wordSpan.textContent = word + ' ';
        responseDiv.appendChild(wordSpan);
      }, wordIndex * 100);
    });
  }
});
