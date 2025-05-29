const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const path = require("path");

const buildDir = path.join(__dirname, "../build/static/js");
const isProduction = process.env.NODE_ENV === "production";

// Different obfuscation levels based on environment
const getObfuscationOptions = (level = "high") => {
  const baseOptions = {
    compact: true,
    log: false,
    renameGlobals: false,
    reservedNames: [
      // Preserve React and common library names
      "React",
      "ReactDOM",
      "useState",
      "useEffect",
      "useContext",
      "BrowserRouter",
      "Routes",
      "Route",
      "Link",
      "Navigate",
    ],
  };

  if (level === "high") {
    return {
      ...baseOptions,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 0.75,
      deadCodeInjection: true,
      deadCodeInjectionThreshold: 0.4,
      debugProtection: true,
      debugProtectionInterval: 2000,
      disableConsoleOutput: true,
      identifierNamesGenerator: "hexadecimal",
      numbersToExpressions: true,
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
      stringArrayThreshold: 0.75,
      transformObjectKeys: true,
      unicodeEscapeSequence: false,
    };
  }

  // Medium obfuscation for development testing
  return {
    ...baseOptions,
    controlFlowFlattening: false,
    deadCodeInjection: false,
    debugProtection: false,
    disableConsoleOutput: false,
    identifierNamesGenerator: "mangled",
    stringArray: true,
    stringArrayThreshold: 0.5,
    transformObjectKeys: false,
  };
};

function obfuscateFile(filePath, options) {
  try {
    const code = fs.readFileSync(filePath, "utf8");

    // Skip very small files (likely just imports/exports)
    if (code.length < 100) {
      console.log(`⏭️  Skipped (too small): ${path.basename(filePath)}`);
      return;
    }

    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, options);
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

  const options = getObfuscationOptions(isProduction ? "high" : "medium");
  const files = fs.readdirSync(dirPath);

  console.log(
    `🔒 Using ${isProduction ? "HIGH" : "MEDIUM"} obfuscation level...`
  );

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);
    const stat = fs.statSync(filePath);

    if (stat.isFile() && file.endsWith(".js") && !file.includes(".map")) {
      obfuscateFile(filePath, options);
    }
  });
}

console.log("🔒 Starting JavaScript obfuscation...");
obfuscateDirectory(buildDir);
console.log("✅ Obfuscation complete!");
