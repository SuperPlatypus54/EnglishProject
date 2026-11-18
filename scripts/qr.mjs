import { mkdir, writeFile } from "node:fs/promises";
import { isIP } from "node:net";
import QRCode from "qrcode";

async function generatePosterCode() {
  if (process.argv.length !== 3) {
    throw new Error("Usage: npm run qr -- <public production URL>");
  }

  let url;
  try {
    url = new URL(process.argv[2]);
  } catch {
    throw new Error("Provide the full HTTPS production URL.");
  }

  if (
    url.protocol !== "https:" || url.username || url.password || url.hash ||
    !url.hostname.includes(".") || url.hostname.endsWith(".localhost") ||
    url.hostname.endsWith(".local") || url.hostname.endsWith(".example") ||
    isIP(url.hostname)
  ) {
    throw new Error("Provide the public HTTPS address of the deployed workstation.");
  }

  const response = await fetch(url, { signal: AbortSignal.timeout(10_000) });
  if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
    throw new Error("The address did not load as a public webpage. Check the URL and deployment protection.");
  }
  if (!/<meta\s+name="application-name"\s+content="MeridianOS"\s*\/?>/i.test(await response.text())) {
    throw new Error("The address did not return the MeridianOS workstation.");
  }

  const finalURL = new URL(response.url);
  if (finalURL.protocol !== "https:") {
    throw new Error("The production address must resolve to an HTTPS page.");
  }

  const graphic = await QRCode.toString(finalURL.href, {
    type: "svg",
    margin: 4,
    width: 512,
    errorCorrectionLevel: "M",
    color: { dark: "#000000", light: "#ffffff" },
  });
  await mkdir("qr", { recursive: true });
  await writeFile("qr/evidence-03.svg", graphic);
  console.log(`Saved qr/evidence-03.svg for ${finalURL.href}`);
}

generatePosterCode().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
