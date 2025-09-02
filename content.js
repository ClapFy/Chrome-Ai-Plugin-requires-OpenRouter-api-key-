// Content script for AI Screen Assistant
// This script runs in the context of web pages

console.log('AI Screen Assistant content script loaded');

// Listen for messages from the popup or background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getPageInfo') {
    // Get basic information about the current page
    const pageInfo = {
      title: document.title,
      url: window.location.href,
      description: getMetaDescription(),
      textContent: getPageTextContent()
    };
    sendResponse({ success: true, data: pageInfo });
  }
});

function getMetaDescription() {
  const metaDesc = document.querySelector('meta[name="description"]');
  return metaDesc ? metaDesc.getAttribute('content') : '';
}

function getPageTextContent() {
  // Get visible text content from the page (excluding scripts, styles, etc.)
  const body = document.body;
  if (!body) return '';
  
  // Remove script and style elements
  const scripts = body.querySelectorAll('script, style, noscript, iframe, img');
  scripts.forEach(el => el.remove());
  
  // Get text content and clean it up
  let text = body.textContent || body.innerText || '';
  text = text.replace(/\s+/g, ' ').trim();
  
  // Limit to first 1000 characters to avoid overwhelming the AI
  return text.substring(0, 1000);
}
