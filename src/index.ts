import express, { Request, Response } from "express";
import cors from "cors";

import puppeteer from "puppeteer";
import fs from "fs";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());


app.post("/screenshot", async (req: Request, res: Response) => {
  await captureScreenShot(req.body.screenshotUrl, req.body.name);
  res.send("done 🚀");
});

app.listen(PORT, () => console.log(`live on port: ${PORT} `));

export default async function captureScreenShot(
  screenshotUrl: string,
  name: string
) {
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

    await page.goto(screenshotUrl);
    console.log(screenshotUrl);

    console.log("screenshot taken");
    await page.screenshot({ path: `screenshots/${name}.jpeg` });
  } catch (error) {
    console.log(`Error: ${error}`);
  } finally {
    await browser?.close();
    console.log(`\n🚀 screenshot taken`);
  }
}

// captureScreenShot();
