# AI Screen Assistant - Chrome Extension

A powerful Chrome extension that uses AI to answer questions about your screen content OR provide general AI assistance. The extension can capture screenshots and use the OpenRouter API to provide intelligent responses about what's visible on your screen, or answer any general questions you have.

## Features

- 🎨 **Modern macOS Design**: Beautiful, clean interface with glassmorphism effects and smooth animations
- 📸 **Automatic Screen Capture**: Screenshots are automatically taken when asking screen questions
- 🤖 **Dual AI Modes**: 
  - **Screen Questions**: Ask about what's visible on your screen (auto-captures)
  - **General AI**: Ask any question for AI assistance
- 💾 **Secure Storage**: Safely store API keys in Chrome's secure storage
- 🔒 **Privacy Focused**: Screenshots are processed locally and only sent to AI when needed
- 🔄 **Mode Switching**: Easy toggle between screen analysis and general AI chat with smooth transitions
- 🔑 **Personal API Keys**: Users provide their own OpenRouter API keys
- ✨ **Enhanced UX**: Hover effects, smooth animations, and intuitive visual feedback

## Prerequisites

- Google Chrome browser
- OpenRouter API key (get one at [https://openrouter.ai/](https://openrouter.ai/))

## Installation

### Method 1: Load Unpacked Extension (Recommended for Development)

1. Download or clone this repository to your local machine
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in top right)
4. Click "Load unpacked" and select the folder containing this extension
5. The extension should now appear in your extensions list

### Method 2: Pack Extension (For Distribution)

1. Follow steps 1-4 from Method 1
2. Click "Pack extension" button
3. Choose the extension directory
4. Chrome will create a `.crx` file and `.pem` key file
5. The `.crx` file can be distributed to other users

## Setup

### For Users

1. **Install the extension** (see Installation section above)
2. **Get OpenRouter API Key**: Visit [https://openrouter.ai/](https://openrouter.ai/) to get your API key
3. **Configure Extension**: Click the extension icon and enter your API key
4. **Start using**: The extension will save your API key securely

### For Developers/Distributors

1. **Distribute the extension** to users
2. **Users provide their own API keys** - no need to manage API costs
3. **Token limits still apply** per user for usage tracking

## Usage

### Two Modes Available

#### 📸 **Screen Questions Mode**
- **Capture Screen**: Click the "📸 Capture Screen" button to take a screenshot
- **Ask Question**: Type your question about what's visible on screen
- **Get AI Response**: Click "🤔 Ask AI" to receive an intelligent answer about your screen content

#### 🤔 **General AI Mode**
- **Ask Anything**: Type any question you want answered
- **Get AI Response**: Click "🤔 Ask AI" to receive AI assistance on any topic

### Mode Switching
- Use the toggle buttons at the top of the extension popup
- Switch between "📸 Screen Questions" and "🤔 General AI" modes
- Each mode has its own interface and question field

### API Key Management
- **Enter your API key** in the designated field
- **Key is saved securely** in Chrome's storage
- **No need to re-enter** on subsequent uses
- **Your key stays private** and is only used for your requests

### Token Management
- **View Usage**: See your current token usage in the progress bar
- **Track Limits**: Visual indicators for usage levels (green → yellow → red)
- **Reset Usage**: Click "Reset Usage" button to clear your token count
- **Automatic Tracking**: Token usage is estimated and tracked automatically

### Example Questions

#### Screen Questions:
- "What is this webpage about?"
- "What can I see in this image?"
- "Summarize the main content on this screen"
- "What are the key points in this document?"
- "Describe what's happening in this application"

#### General AI Questions:
- "How do I learn Python programming?"
- "What's the weather like in New York?"
- "Explain quantum computing in simple terms"
- "Write a recipe for chocolate chip cookies"
- "What are the benefits of meditation?"

### Keyboard Shortcuts

- **Ctrl+Enter** in any question textarea: Submit your question
- Works in both screen and general modes

## Technical Details

### Architecture

- **Manifest V3**: Uses the latest Chrome extension manifest version
- **Service Worker**: Background script handles screen capture and API calls
- **Content Script**: Runs on web pages to gather additional context
- **Popup Interface**: User-friendly interface with dual-mode support
- **Dual API Integration**: Handles both image-based and text-only AI requests
- **Native Screen Capture**: Uses Chrome's desktopCapture API for reliable screen capture
- **Configuration System**: Centralized settings in `config.js`

### Permissions

- `activeTab`: Access to the currently active tab
- `desktopCapture`: Permission to capture screen content using Chrome's native APIs
- `storage`: Store API keys and token usage data securely
- `scripting`: Execute scripts in tabs when needed
- `tabs`: Query and interact with browser tabs for screen capture

### API Integration

The extension integrates with OpenRouter API using:
- **Model**: `anthropic/claude-3.5-sonnet` (supports both text and image analysis)
- **Endpoint**: `https://openrouter.ai/api/v1/chat/completions`
- **Authentication**: User-provided API keys for personalized access
- **Dual Mode Support**: 
  - Screen mode: Sends image + text to AI
  - General mode: Sends text-only to AI
- **Token Tracking**: Estimates and tracks token usage per user

### Screen Capture Implementation

The extension uses Chrome's native `desktopCapture` API for reliable screen capture:
1. **Permission Request**: User selects which screen/window to capture
2. **Stream Processing**: Captures video stream and converts to image
3. **Local Processing**: Screenshot is processed locally before sending to AI
4. **Privacy First**: Only the captured image is sent, no other data

### Token Management System

- **Automatic Tracking**: Estimates token usage based on question and response length
- **Persistent Storage**: Token usage is saved across browser sessions
- **Visual Feedback**: Progress bar shows usage with color-coded warnings
- **Reset Functionality**: Users can reset their token usage if needed
- **Limit Enforcement**: Prevents usage when token limit is reached

## Troubleshooting

### Common Issues

1. **"No screenshot available"**
   - Make sure you're in Screen Questions mode
   - Capture the screen first before asking questions
   - Check that screen capture permissions are granted

2. **"Failed to capture screen"**
   - Ensure you've granted screen capture permissions
   - Try refreshing the extension
   - Make sure you're on a supported page (not chrome:// URLs)
   - Check that Chrome's desktop capture is working properly

3. **"Please enter your OpenRouter API key first"**
   - Enter your API key in the designated field
   - Make sure the key is valid and has sufficient credits
   - Check that you have credits in your OpenRouter account

4. **"API Error"**
   - Verify your OpenRouter API key is correct
   - Check that you have credits in your OpenRouter account
   - Ensure you're not hitting rate limits

5. **"Token limit reached"**
   - You've used your 100,000 token allocation
   - Click "Reset Usage" button to clear your count
   - Contact support if you need more tokens

6. **Extension not loading**
   - Verify all files are present in the extension directory
   - Check Chrome's developer console for errors
   - Try reloading the extension

7. **General AI questions not working**
   - Make sure you're in General AI mode
   - Verify your API key is entered correctly
   - Check that you have credits in your OpenRouter account

8. **Screen capture permissions denied**
   - Go to Chrome Settings > Privacy and security > Site Settings
   - Check Screen Capture permissions
   - Ensure the extension has permission to capture screen

### Debug Mode

To enable debug logging:
1. Open Chrome DevTools
2. Go to Console tab
3. Look for messages from "AI Screen Assistant"

## Security & Privacy

- **Local Processing**: Screenshots are processed locally before sending to AI
- **Secure Storage**: API keys and token usage are stored in Chrome's secure storage
- **No Data Collection**: The extension doesn't collect or store user data
- **API Security**: Only necessary data is sent to OpenRouter API
- **Mode-Specific Data**: Screen mode sends images, general mode sends only text
- **Native APIs**: Uses Chrome's built-in screen capture for security and reliability
- **Token Isolation**: Each user's token usage is tracked separately
- **Personal API Keys**: Users control their own API access and costs

## Development

### File Structure

```
├── manifest.json          # Extension configuration with permissions
├── config.js              # Configuration file for settings and limits
├── popup.html            # User interface with dual modes and API key input
├── popup.js              # Popup logic, mode switching, and API key management
├── background.js         # Service worker with dual AI support and token management
├── content.js            # Content script
├── icons/                # Extension icons
└── README.md             # This file
```

### Customization

- **Token Limits**: Modify limits in `config.js`
- **UI Colors**: Modify CSS variables in `popup.html`
- **AI Model**: Change the model in `config.js`
- **Permissions**: Update `manifest.json` as needed
- **API Endpoint**: Modify API calls in `background.js`
- **Mode Behavior**: Adjust prompts and logic in `background.js`
- **Screen Capture**: Modify capture logic in `background.js`

### Building

To build a distributable version:
1. Ensure all files are present
2. Use Chrome's "Pack extension" feature
3. Test the `.crx` file in a clean Chrome profile

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review Chrome's extension documentation
3. Check OpenRouter API documentation
4. Open an issue in the repository

## License

This project is open source and available under the MIT License.

## Changelog

### Version 1.3
- Restored user API key input functionality
- Users provide their own OpenRouter API keys
- Fixed screen capture getDisplayMedia error
- Enhanced error handling for screen capture
- Improved user experience with personal API key management

### Version 1.2
- Added token usage tracking with 100,000 token limit
- Implemented default API key system
- Added configuration file for easy customization
- Enhanced UI with token usage display and progress bar
- Added token reset functionality
- Improved error handling and user feedback

### Version 1.1
- Added General AI mode for non-screen questions
- Implemented mode switching interface
- Enhanced UI with dual-mode support
- Updated background script for dual API handling
- Fixed screen capture using Chrome's native desktopCapture API
- Added proper permissions for reliable screen capture

### Version 1.0
- Initial release
- Screen capture functionality
- OpenRouter API integration
- Modern UI design
- Secure API key storage
