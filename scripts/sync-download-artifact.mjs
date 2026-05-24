import { copyFile, mkdir, existsSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourceCandidates = [
  path.join(rootDir, "src-tauri", "target", "release", "bundle", "msi", "LumiPDF_0.1.0_x64_en-US.msi"),
  path.join(rootDir, "src-tauri", "target", "release", "bundle", "msi", "LumiPDF_0.1.0_x64.msi"),
  path.join(rootDir, "downloads", "LumiPDF.msi"),
  path.join(rootDir, "store-package", "LumiPDF.msi"),
];
const versionedTargetDir = path.join(rootDir, "dist", "downloads", "v1.0.0");
const versionedTargetFile = path.join(versionedTargetDir, "LumiPDF.msi");

const sourceFile = sourceCandidates.find((candidate) => existsSync(candidate));

if (!sourceFile) {
  console.log(`No MSI found yet. Expected one of: ${sourceCandidates.join(", ")}`);
  process.exit(0);
}

const publicTargetDir = path.join(rootDir, "public", "downloads", "v1.0.0");
const publicTargetFile = path.join(publicTargetDir, "LumiPDF.msi");

mkdir(publicTargetDir, { recursive: true }, (publicMkdirError) => {
  if (publicMkdirError) {
    console.error(publicMkdirError);
    process.exit(1);
    return;
  }

  copyFile(sourceFile, publicTargetFile, (publicCopyError) => {
    if (publicCopyError) {
      console.error(publicCopyError);
      process.exit(1);
      return;
    }

    mkdir(versionedTargetDir, { recursive: true }, (versionedMkdirError) => {
      if (versionedMkdirError) {
        console.error(versionedMkdirError);
        process.exit(1);
        return;
      }

      copyFile(sourceFile, versionedTargetFile, (versionedCopyError) => {
        if (versionedCopyError) {
          console.error(versionedCopyError);
          process.exit(1);
          return;
        }

        console.log(`Copied ${path.relative(rootDir, sourceFile)} -> ${path.relative(rootDir, publicTargetFile)}`);
      });
    });
  });
});