// Configuration file for AI Screen Assistant
const CONFIG = {
  // Extension metadata
  EXTENSION_NAME: 'AI Screen Assistant',
  EXTENSION_VERSION: '1.13',
  
  // OpenRouter API configuration
  OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
  
  // Mode-specific configurations
  MODES: {
    screen: {
      name: 'Screen Questions',
      model: 'anthropic/claude-3.5-sonnet',
      maxTokens: 1500,
      maxInputTokens: 4000, // Maximum input tokens (image + text)
      maxOutputTokens: 1500, // Maximum output tokens
      temperature: 0.3, // Lower temperature for more focused, accurate screen analysis
      description: 'Optimized for analyzing screen content with high accuracy'
    },
    general: {
      name: 'General AI',
      model: 'anthropic/claude-3.5-sonnet',
      maxTokens: 2000,
      maxInputTokens: 8000, // Maximum input tokens (text only)
      maxOutputTokens: 2000, // Maximum output tokens
      temperature: 0.7, // Higher temperature for more creative, varied responses
      description: 'Balanced for creative and informative general AI assistance'
    }
  },
  
  // Default settings
  DEFAULT_MODEL: 'anthropic/claude-3.5-sonnet',
  DEFAULT_MAX_TOKENS: 1500,
  DEFAULT_MAX_INPUT_TOKENS: 4000,
  DEFAULT_MAX_OUTPUT_TOKENS: 1500,
  DEFAULT_TEMPERATURE: 0.5
};
