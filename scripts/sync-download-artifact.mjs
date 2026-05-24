import { copyFile, mkdir, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceCandidates = [
  path.join(rootDir, "downloads", "LumiPDF_0.1.0_x64.msix"),
  path.join(rootDir, "store-package", "LumiPDF_0.1.0_x64.msix"),
];
const targetDir = path.join(rootDir, "dist", "downloads");
const targetFile = path.join(targetDir, "LumiPDF_0.1.0_x64.msix");

const sourceFile = sourceCandidates.find((candidate) => existsSync(candidate));

if (!sourceFile) {
  console.error(`No MSIX found. Expected one of: ${sourceCandidates.join(", ")}`);
  process.exit(1);
}

mkdir(targetDir, { recursive: true }, (mkdirError) => {
  if (mkdirError) {
    console.error(mkdirError);
    process.exit(1);
    return;
  }

  copyFile(sourceFile, targetFile, (copyError) => {
    if (copyError) {
      console.error(copyError);
      process.exit(1);
      return;
    }

    console.log(`Copied ${path.relative(rootDir, sourceFile)} -> ${path.relative(rootDir, targetFile)}`);
  });
});