# AI Screen Assistant

A powerful Chrome extension that combines AI capabilities with screen analysis, allowing you to ask questions about your screen content or get general AI assistance.

## ✨ Features

- **🔍 Screen Analysis**: Ask questions about what's on your screen with automatic screenshot capture
- **🤖 General AI**: Get AI assistance for any question, not just screen-related
- **🎯 Mode-Specific Configurations**: Each mode has optimized settings for different use cases
- **🌡️ Smart Temperature Control**: Lower temperature (0.3) for screen analysis, higher (0.7) for creative responses
- **📊 Token Optimization**: Different max token limits per mode for cost efficiency
- **🎨 Modern macOS Design**: Beautiful, intuitive interface with smooth animations
- **⚡ Automatic Screenshots**: No need to manually capture - screenshots are taken automatically
- **🔐 Secure API Key Storage**: Your API keys are stored securely in Chrome's sync storage

## 🚀 How It Works

### Screen Questions Mode
- **Optimized for accuracy**: Lower temperature (0.3) ensures precise screen analysis
- **Higher token limit**: 1,500 tokens for detailed screen descriptions
- **Automatic capture**: Screenshots are taken automatically when asking questions
- **Perfect for**: Understanding complex interfaces, reading text, analyzing layouts

### General AI Mode
- **Balanced creativity**: Temperature (0.7) for varied, engaging responses
- **Extended responses**: 2,000 tokens for comprehensive answers
- **No screenshot needed**: Pure text-based AI assistance
- **Perfect for**: Writing help, explanations, brainstorming, general questions

## 📋 Requirements

- Google Chrome browser
- OpenRouter API key (get one at [openrouter.ai](https://openrouter.ai))
- Active internet connection

## 🛠️ Installation

1. **Download the extension**:
   - Clone this repository or download the ZIP file
   - Extract to a folder on your computer

2. **Load in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked" and select the extension folder

3. **Get your API key**:
   - Visit [openrouter.ai](https://openrouter.ai)
   - Sign up and get your API key
   - Copy the key to your clipboard

4. **Configure the extension**:
   - Click the extension icon in your toolbar
   - Paste your API key in the "OpenRouter API Key" field
   - The key will be saved automatically

## 📖 Usage

### Screen Questions
1. Click the extension icon
2. Make sure "Screen Questions" mode is selected
3. Type your question about what's on your screen
4. Click "🤔 Ask AI"
5. The extension automatically captures your screen and analyzes it
6. Get an AI-powered answer based on your screen content

### General AI Questions
1. Click the extension icon
2. Switch to "General AI" mode
3. Type any question you want to ask
4. Click "🤔 Ask AI"
5. Get an AI response without needing screen content

## ⚙️ Configuration

Each mode comes with pre-optimized settings:

| Mode | Model | Temperature | Max Tokens | Use Case |
|------|-------|-------------|------------|----------|
| **Screen** | Claude 3.5 Sonnet | 0.3 | 1,500 | Accurate screen analysis |
| **General** | Claude 3.5 Sonnet | 0.7 | 2,000 | Creative AI assistance |

## 🔧 Technical Details

- **Manifest Version**: 3
- **Permissions**: `activeTab`, `tabs`, `scripting`
- **Storage**: Chrome sync storage for API keys
- **API**: OpenRouter with Claude 3.5 Sonnet model
- **Screenshot**: Chrome native `captureVisibleTab` API

## 📝 Changelog

### Version 1.12 - Mode-Specific Configurations
- **New Feature**: Separate system configurations for each mode
- **Screen Mode**: Optimized for accuracy (temp: 0.3, tokens: 1,500)
- **General Mode**: Balanced for creativity (temp: 0.7, tokens: 2,000)
- **UI Enhancement**: Configuration display showing current settings
- **Smart Defaults**: Each mode automatically uses appropriate settings

### Version 1.11 - Clean Code & Optimization
- **Code Cleanup**: Removed drag functionality and unused code
- **Performance**: Streamlined background script operations
- **Maintenance**: Cleaner, more maintainable codebase

### Version 1.10 - Enhanced Animations
- **New Animations**: Text reveal, character-by-character typing
- **Smooth Transitions**: Enhanced mode switching animations
- **Visual Polish**: Loading states and success/error animations

### Version 1.9 - Automatic Screenshots & Modern UI
- **Auto-Capture**: Screenshots taken automatically when asking screen questions
- **Modern Design**: macOS-inspired interface with glassmorphism
- **Enhanced UX**: Improved visual hierarchy and smooth animations

### Version 1.8 - Simplified Interface
- **Streamlined UI**: Focused on core AI functionality
- **Removed Features**: Eliminated bookmark and token systems
- **Clean Design**: Minimalist, efficient interface

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues:
1. Check that your API key is correct
2. Ensure you have an active internet connection
3. Verify the extension has the necessary permissions
4. Try refreshing the page you're analyzing

## 🔮 Future Plans

- [ ] Support for additional AI models
- [ ] Custom temperature and token settings
- [ ] Batch screenshot analysis
- [ ] Voice input support
- [ ] Export conversation history

---

**Made with ❤️ for Chrome users who want AI-powered screen assistance**
