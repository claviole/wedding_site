const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "../build/static/js");

// Obfuscation options
const obfuscationOptions = {
  compact: true,
  controlFlowFlattening: true,
  controlFlowFlatteningThreshold: 0.75,
  deadCodeInjection: true,
  deadCodeInjectionThreshold: 0.4,
  debugProtection: true,
  debugProtectionInterval: 2000,
  disableConsoleOutput: true,
  identifierNamesGenerator: "hexadecimal",
  log: false,
  numbersToExpressions: true,
  renameGlobals: false,
  rotateStringArray: true,
  selfDefending: true,
  shuffleStringArray: true,
  simplify: true,
  splitStrings: true,
  splitStringsChunkLength: 10,
  stringArray: true,
  stringArrayEncoding: ["base64"],
  stringArrayIndexShift: true,
  stringArrayRotate: true,
  stringArrayShuffle: true,
  stringArrayWrappersCount: 2,
  stringArrayWrappersChainedCalls: true,
  stringArrayWrappersParametersMaxCount: 4,
  stringArrayWrappersType: "function",
  stringArrayThreshold: 0.75,
  transformObjectKeys: true,
  unicodeEscapeSequence: false,
};

function obfuscateFile(filePath) {
  try {
    const code = fs.readFileSync(filePath, "utf8");
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(
      code,
      obfuscationOptions
    );
    fs.writeFileSync(filePath, obfuscatedCode.getObfuscatedCode());
    console.log(`✅ Obfuscated: ${path.basename(filePath)}`);
  } catch (error) {
    console.error(`❌ Error obfuscating ${filePath}:`, error.message);
  }
}

function obfuscateDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    console.log('❌ Build directory not found. Run "npm run build" first.');
    return;
  }

  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && file.endsWith(".js") && !file.includes(".map")) {
      obfuscateFile(filePath);
    }
  });
}

console.log("🔒 Starting JavaScript obfuscation...");
obfuscateDirectory(buildDir);
console.log("✅ Obfuscation complete!");
