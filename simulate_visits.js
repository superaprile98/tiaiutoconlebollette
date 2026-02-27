import { chromium } from "playwright";

const url = "https://tiaiutoconlebollette.pages.dev";
const numVisits = 10;

const userAgents = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (iPad; CPU OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/118.0",
  "Mozilla/5.0 (Android 13; Mobile; rv:109.0) Gecko/119.0 Firefox/119.0",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
];

async function simulateVisit(i) {
  console.log(`🚀 Avvio visita #${i + 1}...`);
  const browser = await chromium.launch({ headless: true });

  // Usiamo un contesto separato per ogni visita per simulare utenti nuovi
  const context = await browser.newContext({
    userAgent: userAgents[i % userAgents.length],
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  try {
    // Naviga al sito e aspetta che sia tutto caricato (incluso lo script analytics)
    await page.goto(url, { waitUntil: "networkidle" });
    console.log(`✅ Visita #${i + 1} completata: ${await page.title()}`);

    // Rimaniamo sulla pagina per un po' per simulare un utente reale
    await page.waitForTimeout(5000);

    // Facciamo un piccolo scroll
    await page.evaluate(() => window.scrollBy(0, 500));
    await page.waitForTimeout(2000);
  } catch (error) {
    console.error(`❌ Errore durante la visita #${i + 1}:`, error.message);
  } finally {
    await browser.close();
  }
}

async function runTests() {
  console.log(`🧪 Inizio simulazione di ${numVisits} visite su ${url}\n`);
  for (let i = 0; i < numVisits; i++) {
    await simulateVisit(i);
  }
  console.log(
    "\n✨ Tutte le simulazioni sono terminate. Controlla la dashboard di Cloudfare tra 5-10 minuti!",
  );
}

runTests();
