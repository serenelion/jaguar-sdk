const puppeteer = require('puppeteer');
const fs = require('fs');

async function takeScreenshot() {
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setViewport({ width: 1920, height: 1080 });
        
        // Take landing page screenshot
        await page.goto('http://localhost:5000');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: '/tmp/landing-page.png', fullPage: true });
        
        // Take chat page screenshot
        await page.goto('http://localhost:5000/chat');
        await page.waitForLoadState('networkidle');
        await page.screenshot({ path: '/tmp/chat-page.png', fullPage: true });
        
        await browser.close();
        console.log('Screenshots taken successfully');
    } catch (error) {
        console.error('Screenshot failed:', error.message);
    }
}

takeScreenshot();