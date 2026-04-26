/**
 * Generate PDF export of the website for stakeholder review
 *
 * This script launches the development server, captures the full page
 * as a PDF, and saves it for content review.
 */

import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEV_SERVER_URL = 'http://localhost:5173';
const OUTPUT_PDF = path.join(__dirname, '..', 'honeyman-enterprises-review.pdf');

async function waitForServer(url, timeout = 30000) {
  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        console.log('✅ Development server is ready');
        return true;
      }
    } catch (error) {
      // Server not ready yet, wait and retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  throw new Error('Development server failed to start within timeout');
}

async function generatePDF() {
  console.log('🚀 Starting PDF generation...\n');

  // Start development server
  console.log('📦 Starting development server...');
  const serverProcess = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'pipe',
    shell: true
  });

  serverProcess.stdout.on('data', (data) => {
    console.log(`[Server] ${data.toString().trim()}`);
  });

  serverProcess.stderr.on('data', (data) => {
    console.error(`[Server Error] ${data.toString().trim()}`);
  });

  try {
    // Wait for server to be ready
    await waitForServer(DEV_SERVER_URL);

    // Additional delay to ensure full initialization
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\n🌐 Launching browser...');
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Set viewport for consistent rendering
    await page.setViewport({
      width: 1920,
      height: 1080,
      deviceScaleFactor: 2
    });

    console.log('📄 Loading website...');
    await page.goto(DEV_SERVER_URL, {
      waitUntil: 'networkidle0',
      timeout: 60000
    });

    // Wait for Vanta.js globe to initialize
    console.log('⏳ Waiting for animations to load...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Scroll to trigger lazy-loaded content
    console.log('📜 Scrolling through page...');
    await page.evaluate(async () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollSteps = Math.ceil(scrollHeight / viewportHeight);

      for (let i = 0; i < scrollSteps; i++) {
        window.scrollTo(0, i * viewportHeight);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Scroll back to top
      window.scrollTo(0, 0);
      await new Promise(resolve => setTimeout(resolve, 500));
    });

    console.log('🖨️  Generating PDF...');
    await page.pdf({
      path: OUTPUT_PDF,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0',
        right: '0',
        bottom: '0',
        left: '0'
      },
      preferCSSPageSize: false
    });

    console.log(`\n✅ PDF generated successfully!`);
    console.log(`📁 Location: ${OUTPUT_PDF}`);

    await browser.close();

  } catch (error) {
    console.error('\n❌ Error generating PDF:', error.message);
    throw error;
  } finally {
    // Kill the development server
    console.log('\n🛑 Stopping development server...');
    serverProcess.kill('SIGTERM');

    // Give it time to shut down gracefully
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (!serverProcess.killed) {
      serverProcess.kill('SIGKILL');
    }
  }
}

// Run the script
generatePDF()
  .then(() => {
    console.log('\n🎉 PDF generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 PDF generation failed:', error);
    process.exit(1);
  });
