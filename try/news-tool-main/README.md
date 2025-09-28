# News Digest Tool

A Node.js application that fetches news articles from South African news feeds, summarizes them using OpenAI's GPT-4, and displays them in a beautiful HTML interface.

## Features

- 📰 Fetches latest articles from multiple SA news sources
- 🤖 AI-powered article summarization using OpenAI GPT-4
- 🌐 Beautiful HTML web interface
- 📱 Responsive design for mobile and desktop
- 🚀 Built-in web server
- 📝 Tracks seen articles to avoid duplicates

## News Sources

- MyBroadband
- Mail & Guardian
- Daily Maverick
- IOL News
- TechCentral

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your OpenAI API key:
```
OPENAI_API_KEY=your_openai_api_key_here
RESEND_API_KEY=your_resend_api_key_here  # Optional, for email functionality
```

3. Run the application:
```bash
node script.js
```

## Usage

1. Run the script to fetch and summarize news articles
2. The application will automatically start a web server on `http://localhost:3000`
3. Open your browser and navigate to `http://localhost:3000` to view the news digest
4. The HTML file is also saved as `news-digest.html` in the project directory

## Features

### Web Interface
- Clean, modern design with gradient background
- Responsive grid layout for article cards
- Hover effects and smooth transitions
- Mobile-friendly design

### Article Display
- Article titles and summaries
- Key facts extracted by AI
- Direct links to full articles
- Source attribution

### Server
- Built-in HTTP server
- Serves the news digest HTML page
- Graceful shutdown with Ctrl+C

## File Structure

```
news-tool-main/
├── script.js          # Main application file
├── package.json       # Dependencies and project info
├── seen.json         # Tracks processed articles
├── news-digest.html  # Generated HTML output (auto-created)
└── README.md         # This file
```

## Dependencies

- `openai` - AI summarization
- `fast-xml-parser` - RSS feed parsing
- `cheerio` - HTML parsing and content extraction
- `resend` - Email functionality (optional)
- `dotenv` - Environment variable management

## Customization

You can easily customize:
- News sources by modifying the `FEEDS` array
- Styling by editing the CSS in the `buildHtmlPage` function
- Server port by changing the default in `startWebServer()`
- Article limit by modifying the slice in `getArticlesFromFeed()`

## Notes

- The application tracks seen articles in `seen.json` to avoid reprocessing
- Email functionality is commented out by default but can be re-enabled
- The web server runs continuously until stopped with Ctrl+C
- Articles are limited to the latest from each feed to manage processing time
