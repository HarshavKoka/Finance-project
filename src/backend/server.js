
import express from "express";
import cors from "cors";
import { chromium } from "playwright";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());


const loginConfigs = {
  IncomeTax: {
    url: "https://eportal.incometax.gov.in/iec/foservices/#/login",
    usernameSelector: "#userId",     
    passwordSelector: "#password",   
    submitSelector: "#login",        
  },
  GST: {
    url: "https://services.gst.gov.in/services/login",
    usernameSelector: "#username",
    passwordSelector: "#user_pass",
    submitSelector: "#loginBtn",
  },
  MCA: {
    url: "https://www.mca.gov.in/mcafoportal/login.do",
    usernameSelector: "#userName",
    passwordSelector: "#password",
    submitSelector: "#login",       
  },
};


app.get("/auto-login", async (req, res) => {
  const { group } = req.query;
  const config = loginConfigs[group];

  if (!config) {
    return res.status(400).json({ success: false, error: "Invalid group" });
  }

  let browser;
  try {
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(config.url, { waitUntil: "domcontentloaded" });
;

    await page.waitForTimeout(2000);

    const title = await page.title();
    const preview = (await page.content()).slice(0, 200);

    res.json({
      success: true,
      group,
      url: config.url,
      pageTitle: title,
      previewContent: preview,
    });
  } catch (error) {
    console.error("Auto-login error:", error);
    res.status(500).json({ success: false, error: error.message });
  } finally {
    if (browser) await browser.close();
  }
});

// Health check
app.get("/", (req, res) => {
  res.send("✅ Backend server is running...");
});

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
