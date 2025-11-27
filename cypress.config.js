const { defineConfig } = require("cypress");
const moment = require("moment");
const fs = require("fs");

const suiteName = process.env.SUITE || 'default';
const timestamp = moment().format('DDMMYYYY_HHmmss');
const reportFolder = `cypress/reports/${suiteName}-${timestamp}`;

fs.writeFileSync('lastReportFolder.txt', reportFolder);

module.exports = defineConfig({
  e2e: {
    chromeWebSecurity: false,
    baseUrl: "https://opencart.abstracta.us",
    specPattern: 'cypress/e2e/**/*.cy.js',

    setupNodeEvents(on, config) {
      // Implementación de eventos de Cypress
      on("task", {
        reportTo({ testCaseId, status }) {
          return null;
        },
      });

      // Configuración de navegadores
      on("before:browser:launch", (browser = {}, launchOptions) => {
        if (["chrome", "edge", "electron"].includes(browser.name)) {
          launchOptions.args.push("--disable-features=IsolateOrigins,site-per-process");
          launchOptions.args.push("--allow-insecure-localhost");
          launchOptions.args.push("--ignore-certificate-errors");
        }

        if (browser.name === "firefox") {
          launchOptions.preferences = {
            ...launchOptions.preferences,
            "permissions.default.geo": 1,
            "permissions.default.camera": 1,
            "permissions.default.microphone": 1,
            "permissions.default.desktop-notification": 1,
            "security.mixed_content.block_active_content": false,
            "network.stricttransportsecurity.preloadlist": false,
            "browser.safebrowsing.malware.enabled": false,
            "browser.safebrowsing.phishing.enabled": false,
            "dom.security.https_only_mode": false
          };
        }

        return launchOptions;
      });
    },

    // Configuración de Screenshots
    screenshotOnRunFailure: true,
    screenshotsFolder: "cypress/screenshots",

    // Configuración de Videos
    //video: true,
    //videosFolder: "cypress/videos",
    //videoCompression: 32,

    // Configuración de Reportes
    reporter: "mochawesome",
    reporterOptions: {
      reportDir: reportFolder,
      overwrite: false,
      html: true,
      json: true,
      charts: true,
      embeddedScreenshots: true,
    },
  },
});
