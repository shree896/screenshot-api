const express = require("express");
const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = 5000;

// Ensure the screenshots directory exists
const screenshotsDir = path.join(__dirname, "screenshots");
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

// 📸 Screenshot API Route
app.get("/screenshot", async (req, res) => {
    const { url } = req.query;

    if (!url) {
        return res.status(400).json({ error: "URL is required!" });
    }

    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: "load", timeout: 60000 });

        // Generate screenshot filename
        const fileName = `screenshot_${Date.now()}.png`;
        const filePath = path.join(screenshotsDir, fileName);

        await page.screenshot({ path: filePath, fullPage: true });

        await browser.close();

        // Send the screenshot as a downloadable file
        res.download(filePath, fileName);
    } catch (error) {
        console.error("Error taking screenshot:", error);
        res.status(500).json({ error: "Failed to capture screenshot" });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`🚀 Screenshot API is running at http://localhost:${PORT}`);
});
