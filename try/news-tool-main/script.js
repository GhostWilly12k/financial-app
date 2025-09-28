import "dotenv/config";

import { XMLParser } from "fast-xml-parser";
import * as cheerio from "cheerio";
import OpenAI from "openai";
import { Resend } from "resend";
import http from "http";
import { fileURLToPath } from "url";
import { dirname } from "path";

import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const FEEDS = [
  "https://bizmag.co.za/feed/",
  "https://mybroadband.co.za/news/feed/",
  "https://mg.co.za/feed/",
  "https://www.dailymaverick.co.za/dmrss/",
  "https://rss.iol.io/iol/news",
  "https://techcentral.co.za/feed/",
];

const openai = new OpenAI();
const resend = new Resend(process.env.RESEND_API_KEY);

const seenFile = path.resolve("./seen.json");
let seen = [];
if (fs.existsSync(seenFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(seenFile, "utf8"));
    seen = data.seen || [];
  } catch (e) {
    console.error("Error reading seen.json, starting fresh:", e);
    seen = [];
  }
}

async function fetchHtml(url) {
  const res = await fetch(url, {
    headers: {
      // Some sites serve simpler HTML to bots; this UA helps get full article.
      "User-Agent":
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari",
      "Accept-Language": "en",
      Accept: "text/html,application/xhtml+xml",
    },
  });
  if (!res.ok) {
    throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
  }
  return await res.text();
}

function extractArticleText(html, url) {
  const $ = cheerio.load(html);

  // Remove obvious non-article elements
  [
    "script",
    "style",
    "noscript",
    "header",
    "footer",
    "nav",
    "aside",
    ".advert",
    ".ads",
    // "[class*='ad-']",
    // "[id*='ad-']",
    ".newsletter",
    ".subscribe",
    ".paywall",
    ".promo",
  ].forEach((sel) => $(sel).remove());

  // Try a few likely containers (tweak / add as needed)
  const candidates = [
    "article",
    "[itemprop='articleBody']",
    ".article__content",
    ".article-content",
    ".single-article__content",
    ".entry-content",
    ".post-content",
    ".content__article-body",
    ".td-post-content",
    ".c-article-content",
    ".l-article__body",
  ];

  let $container = null;
  for (const sel of candidates) {
    const el = $(sel).first();
    if (el && el.length && el.text().trim().length > 200) {
      $container = el;
      break;
    }
  }
  // Fallback: biggest <div> by text length
  if (!$container) {
    let bestEl = null;
    let bestLen = 0;
    $("div").each((_, el) => {
      const len = $(el).text().trim().length;
      if (len > bestLen) {
        bestLen = len;
        bestEl = el;
      }
    });
    $container = bestEl ? $(bestEl) : $("body");
  }

  // Convert paragraphs and headings to text lines
  const blocks = [];
  $container.find("p, h1, h2, h3, li, blockquote").each((_, el) => {
    const t = $(el).text().replace(/\s+/g, " ").trim();
    if (t) blocks.push(t);
  });

  // Gentle de-duplication (some CMS repeat standfirsts)
  const seen = new Set();
  const lines = [];
  for (const b of blocks) {
    const key = b.slice(0, 120); // prefix key
    if (!seen.has(key)) {
      seen.add(key);
      lines.push(b);
    }
  }

  // Join and lightly normalize
  const fullText = lines.join("\n\n").trim();
  // Basic sanity guard
  if (fullText.length < 500) {
    throw new Error("Article extraction seems too short; adjust selectors.");
  }

  // Optional: cap very long articles to keep tokens in check
  const MAX_CHARS = 12000; // ~ 1.5–2k tokens rough
  const clipped =
    fullText.length > MAX_CHARS ? fullText.slice(0, MAX_CHARS) : fullText;

  return { text: clipped, approxChars: clipped.length, sourceUrl: url };
}

async function summariseArticle(article) {
  const summary = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content: `You are a financial news explainer for students and enthusiasts. 
Your role is to extract the most important, factual takeaways from an article AND highlight 
learning opportunities that deepen financial understanding.


                Guidelines:
- Focus on who, what, where, when, why, and how — especially in finance, economics, business, and policy.
- Highlight key actors (companies, regulators, policymakers, investors, institutions).
- Clarify market/economic impacts (stocks, bonds, currencies, commodities, industries).
- Identify any financial concepts students should explore (e.g., interest rates, inflation, short-selling).
- Skip fluff, opinions, and vague phrasing.
- Write in simple, clear language, avoiding jargon unless it's a core finance term.
- Add why this news matters both to markets and to financial learners.
- Return only valid JSON.


                Example output as JSON:
{
  "keyFacts": [
    "Central bank raised interest rates by 0.25% to fight inflation.",
    "This impacts borrowing costs for consumers and businesses.",
    "Stock markets fell in response, particularly in the tech sector."
  ],
  "learningOpportunities": [
    "Study how interest rate changes affect stock and bond prices.",
    "Review the role of central banks in controlling inflation.",
    "Explore why tech companies are more sensitive to interest rates."
  ]
}
`,
      },
      {
        role: "user",
        content: `Article: ${article.text}`,
      },
    ],
  });

  return JSON.parse(summary.choices[0].message.content.trim()).keyFacts;
}

async function getArticlesFromFeed(url) {
  const parser = new XMLParser();
  let response = await fetch(url);
  const data = await response.text();

  let jObj = parser.parse(data);

  let items = jObj.rss.channel.item.slice(0, 1);

  return items;
}

function buildArticleCard({ title, summary, url }) {
  const summaryHtml = `<ul class="summary-list">${summary
    .map((point) => `<li class="summary-point">${point}</li>`)
    .join("")}</ul>`;

  return `
  <article class="article-card">
    <header class="article-header">
      <h2 class="article-title">${title}</h2>
    </header>
    <div class="article-content">
      ${summaryHtml}
      <div class="article-actions">
        <a href="${url}" class="read-more-btn" target="_blank">Read Full Article</a>
      </div>
    </div>
    <footer class="article-footer">
      <a href="${url}" class="source-link" target="_blank">Source</a>
    </footer>
  </article>
  `;
}

function buildHtmlPage(summaries) {
  const articlesHtml = summaries.map(s => buildArticleCard(s)).join("");
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>News Digest - ${currentDate}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap" rel="stylesheet">
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        :root {
            --background: oklch(1 0 0);
            --foreground: oklch(0.35 0 0);
            --card: oklch(0.98 0 0);
            --card-foreground: oklch(0.25 0 0);
            --primary: oklch(0.55 0.15 200);
            --primary-foreground: oklch(1 0 0);
            --secondary: oklch(0.65 0.18 65);
            --secondary-foreground: oklch(1 0 0);
            --muted: oklch(0.98 0 0);
            --muted-foreground: oklch(0.35 0 0);
            --accent: oklch(0.65 0.18 65);
            --accent-foreground: oklch(1 0 0);
            --border: oklch(0.92 0 0);
            --input: oklch(0.98 0 0);
            --ring: oklch(0.55 0.15 200);
            --radius: 0.5rem;
        }

        body {
            font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%);
            min-height: 100vh;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 40px;
            color: white;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 10px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            font-weight: 700;
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .back-button {
            background-color: rgba(255, 255, 255, 0.15);
            color: var(--primary-foreground);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 12px 24px;
            border-radius: var(--radius);
            text-decoration: none;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.2s;
            display: inline-block;
            margin-top: 20px;
            backdrop-filter: blur(10px);
        }
        
        .back-button:hover {
            background-color: rgba(255, 255, 255, 0.25);
            border-color: rgba(255, 255, 255, 0.3);
            color: var(--primary-foreground);
            text-decoration: none;
            transform: translateY(-2px);
        }

        .articles-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .article-card {
            background: var(--card);
            border-radius: var(--radius);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            border: 1px solid var(--border);
            overflow: hidden;
            transition: transform 0.2s ease, box-shadow 0.2s ease;
        }

        .article-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }

        .article-header {
            background: linear-gradient(135deg, var(--primary), var(--accent));
            color: var(--primary-foreground);
            padding: 20px;
            text-align: center;
        }

        .article-title {
            font-size: 1.3rem;
            line-height: 1.4;
            margin: 0;
            font-weight: 600;
        }

        .article-content {
            padding: 25px;
            color: var(--card-foreground);
        }

        .summary-list {
            list-style: none;
            padding: 0;
            margin: 0 0 20px 0;
        }

        .summary-point {
            margin-bottom: 12px;
            padding-left: 20px;
            position: relative;
            line-height: 1.6;
            font-size: 15px;
        }

        .summary-point:before {
            content: "•";
            color: var(--primary);
            font-weight: bold;
            position: absolute;
            left: 0;
        }

        .article-actions {
            text-align: center;
            margin-top: 25px;
        }

        .read-more-btn {
            background: var(--primary);
            color: var(--primary-foreground);
            padding: 12px 24px;
            text-decoration: none;
            border-radius: calc(var(--radius) - 2px);
            font-weight: 600;
            transition: all 0.2s ease;
            display: inline-block;
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }

        .read-more-btn:hover {
            background: oklch(0.5 0.15 200);
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .article-footer {
            background: var(--muted);
            padding: 15px;
            text-align: center;
            border-top: 1px solid var(--border);
        }

        .source-link {
            color: var(--primary);
            text-decoration: none;
            font-size: 14px;
            font-weight: 500;
        }

        .source-link:hover {
            text-decoration: underline;
        }

        .no-articles {
            text-align: center;
            color: white;
            font-size: 1.2rem;
            margin-top: 50px;
        }

        .footer {
            text-align: center;
            color: white;
            margin-top: 40px;
            opacity: 0.8;
        }

        @media (max-width: 768px) {
            .header h1 {
                font-size: 2rem;
            }
            
            .articles-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .article-content {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>📰 News Digest</h1>
            <p>Stay informed with AI-powered summaries</p>
            <p><strong>${currentDate}</strong></p>
            <a href="http://localhost:3000" class="back-button">🛡️ Back to First Principles Bank</a>
        </header>
        
        <main class="articles-grid">
            ${summaries.length > 0 ? articlesHtml : '<div class="no-articles">No new articles today. Check back later!</div>'}
        </main>
        
        <footer class="footer">
            <p>Generated with AI • Updated automatically</p>
        </footer>
    </div>
</body>
</html>`;
}

async function saveHtmlFile(html) {
  const htmlPath = path.join(__dirname, 'news-digest.html');
  fs.writeFileSync(htmlPath, html);
  console.log(`HTML file saved to: ${htmlPath}`);
  return htmlPath;
}

async function sendDigestEmail(html) {
  console.log("Sending email...");

  const { error } = await resend.emails.send({
    from: "News Digest <newsdigest@honourablemembergpt.com>",
    to: ["kamokhumalo04@gmail.com"],
    subject: "Stay Up to Date 🧠",
    html: html,
  });

  if (error) {
    return console.error({ error });
  }

  console.log("Email sent successfully!");
}

function startWebServer(port = 3001) {
  const server = http.createServer((req, res) => {
    if (req.url === '/' || req.url === '/news-digest.html') {
      try {
        const htmlPath = path.join(__dirname, 'news-digest.html');
        const html = fs.readFileSync(htmlPath, 'utf8');
        
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
      } catch (error) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('News digest not found. Run the script first to generate summaries.');
      }
    } else if (req.url === '/refresh') {
      // Trigger refresh of summaries
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Refresh triggered. Check the console for updates.');
      // Note: In a real implementation, you might want to trigger the summary generation
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Not found');
    }
  });

  server.listen(port, () => {
    console.log(`\n🌐 Web server running at http://localhost:${port}`);
    console.log(`📰 View your news digest at: http://localhost:${port}`);
    console.log(`\nPress Ctrl+C to stop the server`);
  });

  return server;
}

async function generateSummaries() {
  let summaries = [];
  let newSeen = [...seen];

  await Promise.all(
    FEEDS.map(async (feed) => {
      const items = await getArticlesFromFeed(feed);
      for (const item of items) {
        try {
          const url = item.link;

          if (seen.includes(url)) {
            console.log(`Already seen article, skipping: ${url}`);
            continue;
          }

          console.log(`Fetching article from feed ${feed}: ${url}`);
          const html = await fetchHtml(url);

          const article = extractArticleText(html, url);
          console.log(
            `Extracted article text, approx ${article.approxChars} chars. Summarizing...`
          );

          const summary = await summariseArticle(article);
          summaries.push({
            title: item.title,
            summary,
            url: article.sourceUrl,
          });

          newSeen.push(url);
        } catch (err) {
          console.error("Error processing item:", err);
        }
      }
    })
  );
  fs.writeFileSync(seenFile, JSON.stringify({ seen: newSeen }, null, 2));

  return summaries;
}

// Main execution
async function main() {
  console.log("🚀 Starting news digest generation...\n");
  
  const summaries = await generateSummaries();

  if (summaries.length) {
    console.log(`\n📊 Generated ${summaries.length} summaries`);
    
    // Generate HTML page
    const html = buildHtmlPage(summaries);
    await saveHtmlFile(html);
    
    // Optionally still send email (uncomment if you want both)
    // const emailHtml = summaries.map((s) => buildEmailTemplate(s)).join("<hr/>");
    // await sendDigestEmail(emailHtml);
    
    console.log("\n✅ News digest generated successfully!");
  } else {
    console.log("No new articles to summarise.");
    // Still create an empty HTML page
    const html = buildHtmlPage([]);
    await saveHtmlFile(html);
  }
  
  // Start web server
  const server = startWebServer();
  
  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n👋 Shutting down server...');
    server.close(() => {
      console.log('Server closed.');
      process.exit(0);
    });
  });
}

main().catch(console.error);
