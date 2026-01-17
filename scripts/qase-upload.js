require("dotenv").config();
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const { XMLParser } = require("fast-xml-parser");

const QASE_API_TOKEN = process.env.QASE_API_TOKEN;
const QASE_PROJECT_CODE = process.env.QASE_PROJECT_CODE || "SAUCE";
const QASE_API_BASE_URL = process.env.QASE_API_BASE_URL || "https://api.qase.io/v1";



if (!QASE_API_TOKEN) {
    console.error("Missing env var: QASE_API_TOKEN");
    process.exit(1);
}

function listJUnitFiles() {
    const dir = path.join(process.cwd(), "cypress", "results");
    if (!fs.existsSync(dir)) return [];
    return fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".xml"))
        .map((f) => path.join(dir, f));
}

function toArray(v) {
    if (!v) return [];
    return Array.isArray(v) ? v : [v];
}

function extractCaseId(testName) {
    if (!testName) return null;
    const match = testName.match(/\[SAUCE-(\d+)\]/); // extrai [SAUCE-9]
    return match ? Number(match[1]) : null;
}

function parseJUnit(xml) {
    const parser = new XMLParser({ ignoreAttributes: false });
    const data = parser.parse(xml);

    // Pode vir como <testsuite> ou <testsuites><testsuite>
    const suites = data.testsuite ? [data.testsuite] : toArray(data.testsuites?.testsuite);

    const results = [];

    for (const suite of suites) {
        const testcases = toArray(suite.testcase);

        for (const tc of testcases) {
            const name = tc["@_name"] || "";
            const time = Number(tc["@_time"] || 0);

            let status = "passed";
            let comment = "";

            if (tc.failure) {
                status = "failed";
                const f = Array.isArray(tc.failure) ? tc.failure[0] : tc.failure;
                comment = String(f?.["#text"] || f?.["@_message"] || "Test failed");
            } else if (tc.skipped) {
                status = "skipped";
            }

            results.push({
                name,
                time,
                status,
                case_id: extractCaseId(name),
                comment,
            });
        }
    }

    return results;
}

async function createRun(caseIds) {
    const title = process.env.QASE_RUN_TITLE || `Local Cypress - ${new Date().toISOString()}`;

    const payload = {
        title,
        description: "Automated run from local machine (Cypress)",
        include_all_cases: false,
        cases: caseIds,
    };

    const res = await axios.post(`${QASE_API_BASE_URL}/run/${QASE_PROJECT_CODE}`, payload, {
        headers: { Token: QASE_API_TOKEN },
    });

    return res.data.result.id;
}

async function sendResult(runId, r) {
    if (!r.case_id) {
        console.warn(`Skipping (no case id): ${r.name}`);
        return;
    }

    const payload = {
        case_id: r.case_id,
        status: r.status, // passed | failed | skipped | blocked | invalid
        comment: r.comment,
        time: Math.round(r.time),
    };

    await axios.post(`${QASE_API_BASE_URL}/result/${QASE_PROJECT_CODE}/${runId}`, payload, {
        headers: { Token: QASE_API_TOKEN },
    });
}

(async () => {
    const files = listJUnitFiles();
    if (!files.length) {
        console.error("No JUnit XML found in cypress/results. Run Cypress first.");
        process.exit(1);
    }

    const allResults = files.flatMap((file) => {
        const xml = fs.readFileSync(file, "utf-8");
        return parseJUnit(xml);
    });

    const caseIds = [...new Set(allResults.map((r) => r.case_id).filter(Boolean))].sort(
        (a, b) => a - b
    );

    if (!caseIds.length) {
        console.error("No case ids found. Ensure titles contain [SAUCE-1], [SAUCE-2]...");
        process.exit(1);
    }

    const runId = await createRun(caseIds);
    console.log(`Created Qase Run: ${runId}`);

    for (const r of allResults) {
        await sendResult(runId, r);
    }

    console.log("Uploaded results to Qase successfully.");
})();
