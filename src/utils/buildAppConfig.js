const shell = require("shelljs");
const fs = require("fs");
const path = require("path");
// const { log } = require('console');

// Path to your Flutter project directory

export const buildConfigApp = () => {
  const flutterProjectPath =
    "/Users/akshaywaghmare/Desktop/Development/Projects/Wemofy/convertto-fullstack/converrto-app-temp/Converrto";

  // Path to your config file
  const configFilePath =
    "/Users/akshaywaghmare/Desktop/Development/Projects/Wemofy/convertto-fullstack/converrto-backend/app_configs/config.json";

  // Path to the assets directory in the Flutter project
  const assetsDir = path.join(flutterProjectPath, "assets");

  // Ensure assets directory exists
  if (!fs.existsSync(assetsDir)) {
    fs.mkdirSync(assetsDir, { recursive: true });
  } else {
    console.log("Assets dir not present");
  }

  // Copy the config file to the assets directory
  const configDestination = path.join(assetsDir, "config.json");
  fs.copyFileSync(configFilePath, configDestination);
  console.log("Config file copied to assets directory");

  // Navigate to the Flutter project directory
  shell.cd(flutterProjectPath);

  console.log("In Flutter app now ready to runnn");

  const fluuterPath = "/Users/akshaywaghmare/Documents/flutter_new";
  shell.cd(fluuterPath);
  // shell.exec('');
  if (shell.exec('export PATH="$PATH:`pwd`/flutter/bin"').code !== 0) {
    shell.echo("Error: Flutter install failed");
    shell.exit(1);
  }

  shell.cd(flutterProjectPath);
  // Run the Flutter build command
  if (shell.exec("flutter run").code !== 0) {
    shell.echo("Error: Flutter build failed");
    shell.exit(1);
  }

  // Path to the generated APK file
  // const apkPath = path.join(flutterProjectPath, 'build', 'app', 'outputs', 'flutter-apk', 'app-release.apk');

  if (!fs.existsSync(apkPath)) {
    shell.echo("Error: APK not found");
    shell.exit(1);
  }

  // Output the path of the APK file
  // console.log(`APK generated at: ${apkPath}`);
  console.log(`APK runned `);
};
