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

  // Add animation classes to elements on load
  addInitialAnimations();
  
  // Initialize drag functionality
  initializeDragFunctionality();

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
        
        // Now ask the AI with the captured screenshot
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

  // Drag functionality
  function initializeDragFunctionality() {
    const header = document.querySelector('.header');
    if (!header) return;
    
    let isDragging = false;
    let startX, startY;
    let xOffset = 0, yOffset = 0;

    // Make the entire popup draggable by adding position fixed to body
    document.body.style.position = 'fixed';
    document.body.style.left = '50px';
    document.body.style.top = '50px';
    document.body.style.zIndex = '10000';

    // Add drag handle visual indicator
    const dragHandle = document.createElement('div');
    dragHandle.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="white">
        <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
      </svg>
    `;
    
    dragHandle.style.cssText = `
      position: absolute;
      top: 8px;
      right: 8px;
      width: 20px;
      height: 20px;
      background: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: move;
      opacity: 0.7;
      transition: all 0.2s ease;
    `;
    
    dragHandle.title = "Drag to move window";
    
    // Hover effect for drag handle
    dragHandle.addEventListener('mouseenter', () => {
      dragHandle.style.opacity = '1';
      dragHandle.style.background = 'rgba(255, 255, 255, 0.3)';
      dragHandle.style.transform = 'scale(1.1)';
    });
    
    dragHandle.addEventListener('mouseleave', () => {
      dragHandle.style.opacity = '0.7';
      dragHandle.style.background = 'rgba(255, 255, 255, 0.2)';
      dragHandle.style.transform = 'scale(1)';
    });
    
    header.appendChild(dragHandle);
    header.style.cursor = 'move';
    header.style.userSelect = 'none';
    header.style.position = 'relative';

    // Add hover effect to header
    const hoverIndicator = document.createElement('div');
    hoverIndicator.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #667eea, #764ba2);
      border-radius: 2px;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
    `;
    header.appendChild(hoverIndicator);

    header.addEventListener('mouseenter', () => {
      hoverIndicator.style.opacity = '1';
    });

    header.addEventListener('mouseleave', () => {
      hoverIndicator.style.opacity = '0';
    });

    // Mouse events for dragging
    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
      startX = e.clientX - xOffset;
      startY = e.clientY - yOffset;
      isDragging = true;
      
      document.body.style.cursor = 'grabbing';
      document.body.style.boxShadow = '0 25px 80px rgba(0, 0, 0, 0.4)';
      document.body.style.transform = 'scale(1.02)';
      
      e.preventDefault();
    }

    function dragMove(e) {
      if (!isDragging) return;

      e.preventDefault();
      
      xOffset = e.clientX - startX;
      yOffset = e.clientY - startY;

      // Constrain to viewport
      const maxX = window.innerWidth - document.body.offsetWidth;
      const maxY = window.innerHeight - document.body.offsetHeight;
      
      xOffset = Math.max(0, Math.min(maxX, xOffset));
      yOffset = Math.max(0, Math.min(maxY, yOffset));

      document.body.style.left = `${xOffset}px`;
      document.body.style.top = `${yOffset}px`;
    }

    function dragEnd(e) {
      if (!isDragging) return;
      
      isDragging = false;
      document.body.style.cursor = 'default';
      document.body.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.3)';
      document.body.style.transform = 'scale(1)';
    }
  }
});
