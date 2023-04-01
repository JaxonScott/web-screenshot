import express, { Request, Response } from "express";
import cors from "cors";

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use("/images", express.static("screenshots"));

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello api!");
});

app.post("/screenshot", async (req: Request, res: Response) => {
  await captureScreenShot(req.body.screenshotUrl, req.body.name);
  res.send(`http://localhost:3001/images/${req.body.name}.jpeg`);
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

    //wait until there are no mor than 0 network connections for atleast 500ms to insure all imgs are loaded
    await page.goto(screenshotUrl, { waitUntil: "networkidle0" });
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
