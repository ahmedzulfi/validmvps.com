import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const HOST = 'validmvps.com';
const KEY = '4084d4668e0140aa8586691bbabd75e2';
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAP_PATH = path.join(__dirname, '../dist/sitemap-0.xml');

async function submitIndexNow() {
  try {
    if (!fs.existsSync(SITEMAP_PATH)) {
      console.error('Sitemap not found at', SITEMAP_PATH);
      console.log('Please run `npm run build` first.');
      return;
    }

    const sitemapContent = fs.readFileSync(SITEMAP_PATH, 'utf-8');
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    
    if (!urlMatches) {
      console.error('No URLs found in sitemap.');
      return;
    }

    const urlList = urlMatches.map(m => m.replace(/<\/?loc>/g, ''));
    
    console.log(`Submitting ${urlList.length} URLs to IndexNow...`);

    const response = await fetch('https://www.bing.com/IndexNow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: urlList
      })
    });

    if (response.ok) {
      console.log('✅ IndexNow submission successful!');
    } else {
      const errorText = await response.text();
      console.error(`❌ IndexNow submission failed with status ${response.status}: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Error submitting to IndexNow:', error);
  }
}

submitIndexNow();
