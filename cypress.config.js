const { defineConfig } = require("cypress");
require("dotenv").config();


module.exports = defineConfig({

    reporter: "mocha-junit-reporter",
    reporterOptions: {
        mochaFile: "cypress/results/junit-[hash].xml",
        toConsole: false,
    },
    e2e: {
        baseUrl: "https://www.saucedemo.com",
    },
});

