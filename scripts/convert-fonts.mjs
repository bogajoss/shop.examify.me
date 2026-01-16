import fs from "fs";
import { compress } from "wawoff2";

async function convert() {
  const regular = fs.readFileSync("public/fonts/HindSiliguri-Regular.ttf");
  const bold = fs.readFileSync("public/fonts/HindSiliguri-Bold.ttf");

  fs.writeFileSync(
    "public/fonts/HindSiliguri-Regular.woff2",
    await compress(regular),
  );
  fs.writeFileSync(
    "public/fonts/HindSiliguri-Bold.woff2",
    await compress(bold),
  );

  console.log("Fonts converted to WOFF2 successfully!");
}

convert();
