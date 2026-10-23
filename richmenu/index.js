require("dotenv").config();

const fs = require("fs");
const axios = require("axios");

const TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

const richMenu = JSON.parse(
  fs.readFileSync("./richmenu.json", "utf8")
);

async function createRichMenu() {
  console.log("Creating Rich Menu...");

  const response = await axios.post(
    "https://api.line.me/v2/bot/richmenu",
    richMenu,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data.richMenuId;
}

async function uploadRichMenuImage(richMenuId) {
  console.log("Uploading Rich Menu image...");

  const image = fs.readFileSync("./richmenu.png");

  await axios.post(
    `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
    image,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "image/png",
      },
      maxBodyLength: Infinity,
    }
  );
}

async function setDefaultRichMenu(richMenuId) {
  console.log("Setting default Rich Menu...");

  await axios.post(
    `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
    null,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
      },
    }
  );
}

async function main() {
  try {
    if (!TOKEN) {
      throw new Error(
        "LINE_CHANNEL_ACCESS_TOKEN is missing in .env"
      );
    }

    // 1. Create
    const richMenuId = await createRichMenu();

    console.log("Rich Menu ID:", richMenuId);

    // 2. Upload image
    await uploadRichMenuImage(richMenuId);

    // 3. Set default
    await setDefaultRichMenu(richMenuId);

    console.log("");
    console.log("✅ Rich Menu setup completed!");
    console.log("Rich Menu ID:", richMenuId);
  } catch (error) {
    console.error("");
    console.error("❌ Error:");

    if (error.response) {
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
  }
}

main();