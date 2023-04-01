import express, { Request, Response } from "express";

import puppeteer from "puppeteer";
import fs from "fs";

const app = express();
const PORT = 3001;
// const url = "https://github.com/JaxonScott";

app.get("/screenshot/:id", async (req: Request, res: Response) => {
  await captureScreenShot(req.params.id).then(() => {
    res.send("screen shot taken");
  });
});

app.listen(PORT, () => console.log(`live on port: ${PORT} `));

export default async function captureScreenShot(id: string) {
  if (!fs.existsSync("screenshots")) {
    fs.mkdirSync("screenshots");
  }
  let browser = null;

  try {
    console.log("browser open...");
    browser = await puppeteer.launch({ headless: true });

    console.log("new browser page opened...");
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 1080 });

    await page.goto(`https://github.com/${id}`);

    console.log("screenshot taken");
    await page.screenshot({ path: `screenshots/github${id}.jpeg` });
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    await browser?.close();
    console.log(`\n🚀 Github screenshot taken`);
  }
}

// captureScreenShot();
