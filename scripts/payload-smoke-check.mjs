import fs from "node:fs";
import vm from "node:vm";
import handler from "../api/notion-proxy.js";
import { notionBlocksToHtml } from "../lib/notionToHTML.js";

const failures = [];
const notes = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function loadConst(filePath, constName) {
  const source = fs.readFileSync(filePath, "utf8");
  const context = vm.createContext({});
  new vm.Script(source, { filename: filePath }).runInContext(context);
  return new vm.Script(constName).runInContext(context);
}

function validateCoursesShape(courses) {
  check(Array.isArray(courses), "COURSES should be an array");
  if (!Array.isArray(courses)) return;

  check(courses.length > 0, "COURSES should not be empty");
  courses.forEach((course, index) => {
    check(isObject(course), `COURSES[${index}] should be an object`);
    if (!isObject(course)) return;

    check(typeof course.id === "string" && course.id.length > 0, `COURSES[${index}].id should be non-empty string`);
    check(typeof course.tabLabel === "string", `COURSES[${index}].tabLabel should be string`);
    check(typeof course.heroTitle === "string", `COURSES[${index}].heroTitle should be string`);
    check(Array.isArray(course.modules), `COURSES[${index}].modules should be array`);

    const modules = Array.isArray(course.modules) ? course.modules : [];
    modules.forEach((moduleEntry, moduleIndex) => {
      check(isObject(moduleEntry), `COURSES[${index}].modules[${moduleIndex}] should be object`);
      if (!isObject(moduleEntry)) return;

      check(typeof moduleEntry.navLabel === "string", `COURSES[${index}].modules[${moduleIndex}].navLabel should be string`);
      check(Array.isArray(moduleEntry.notebooks), `COURSES[${index}].modules[${moduleIndex}].notebooks should be array`);

      const notebooks = Array.isArray(moduleEntry.notebooks) ? moduleEntry.notebooks : [];
      notebooks.forEach((notebook, notebookIndex) => {
        check(isObject(notebook), `Notebook entry should be object at ${index}/${moduleIndex}/${notebookIndex}`);
        if (!isObject(notebook)) return;

        check(typeof notebook.id === "string" && notebook.id.length > 0, `Notebook id missing at ${index}/${moduleIndex}/${notebookIndex}`);
        check(typeof notebook.label === "string", `Notebook label missing at ${index}/${moduleIndex}/${notebookIndex}`);
      });
    });
  });
}

function validateNotebooksShape(notebooks) {
  check(isObject(notebooks), "NOTEBOOKS should be an object map");
  if (!isObject(notebooks)) return;

  const notebookEntries = Object.entries(notebooks);
  check(notebookEntries.length > 0, "NOTEBOOKS should not be empty");

  notebookEntries.forEach(([notebookId, notebook]) => {
    check(isObject(notebook), `NOTEBOOKS[${notebookId}] should be object`);
    if (!isObject(notebook)) return;

    check(typeof notebook.title === "string", `NOTEBOOKS[${notebookId}].title should be string`);
    check(typeof notebook.phase === "string", `NOTEBOOKS[${notebookId}].phase should be string`);
    check(Array.isArray(notebook.cells), `NOTEBOOKS[${notebookId}].cells should be array`);

    const cells = Array.isArray(notebook.cells) ? notebook.cells : [];
    check(cells.length > 0, `NOTEBOOKS[${notebookId}] should have at least one cell`);

    cells.forEach((cell, cellIndex) => {
      check(isObject(cell), `NOTEBOOKS[${notebookId}].cells[${cellIndex}] should be object`);
      if (!isObject(cell)) return;

      check(typeof cell.type === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].type should be string`);

      if (cell.type === "md") {
        check(typeof cell.content === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].content should be string`);
      } else if (cell.type === "code") {
        check(typeof cell.counter === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].counter should be string`);
        check(typeof cell.label === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].label should be string`);
        check(typeof cell.service === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].service should be string`);
        check(typeof cell.code === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].code should be string`);
        check(typeof cell.output === "string", `NOTEBOOKS[${notebookId}].cells[${cellIndex}].output should be string`);
      } else {
        check(false, `Unsupported cell type '${cell.type}' at NOTEBOOKS[${notebookId}].cells[${cellIndex}]`);
      }
    });
  });
}

function validateNotionToHtmlCoverage() {
  const rich = (text) => [{
    plain_text: text,
    href: null,
    annotations: {
      bold: false,
      italic: false,
      strikethrough: false,
      underline: false,
      code: false,
    },
  }];

  const blocks = [
    { type: "heading_2", heading_2: { rich_text: rich("Heading") } },
    { type: "paragraph", paragraph: { rich_text: rich("Paragraph") } },
    { type: "bulleted_list_item", bulleted_list_item: { rich_text: rich("Bullet") } },
    { type: "numbered_list_item", numbered_list_item: { rich_text: rich("Numbered") } },
    { type: "code", code: { rich_text: rich("print('x')"), caption: [] } },
    { type: "callout", callout: { icon: { type: "emoji", emoji: "🟢" }, rich_text: rich("Tip") } },
    { type: "callout", callout: { icon: { type: "emoji", emoji: "📌" }, rich_text: rich("Warn") } },
    { type: "quote", quote: { rich_text: rich("Quote") } },
  ];

  const html = notionBlocksToHtml(blocks);
  check(html.includes("<h2>Heading</h2>"), "notionToHTML should render heading_2");
  check(html.includes("<p>Paragraph</p>"), "notionToHTML should render paragraph");
  check(html.includes("<ul><li>Bullet</li></ul>"), "notionToHTML should render bulleted list items");
  check(html.includes("<ol><li>Numbered</li></ol>"), "notionToHTML should render numbered list items");
  check(html.includes("<pre><code>print(&#39;x&#39;)</code></pre>"), "notionToHTML should render code blocks");
  check(html.includes("<div class=\"tip\">"), "notionToHTML should map 🟢 to .tip");
  check(html.includes("<div class=\"warn\">"), "notionToHTML should map 📌 to .warn");
  check(html.includes("<blockquote>Quote</blockquote>"), "notionToHTML should render quote blocks");
}

async function validateProxyContract() {
  const invalidReq = new Request("https://example.com/api/notion-proxy?type=bad");
  const invalidResp = await handler(invalidReq);

  check(invalidResp.status === 400, "Proxy should return 400 for invalid type");
  check((invalidResp.headers.get("cache-control") || "").includes("s-maxage=300"), "Proxy should set cache-control s-maxage=300");
  check((invalidResp.headers.get("content-type") || "").includes("application/json"), "Proxy should set JSON content-type");

  const oldApiKey = process.env.NOTION_API_KEY;
  const oldDbId = process.env.NOTION_DATABASE_ID;

  delete process.env.NOTION_API_KEY;
  delete process.env.NOTION_DATABASE_ID;

  const missingEnvReq = new Request("https://example.com/api/notion-proxy?type=notebooks");
  const missingEnvResp = await handler(missingEnvReq);
  check(missingEnvResp.status === 500, "Proxy should return 500 when env vars are missing");

  if (oldApiKey) process.env.NOTION_API_KEY = oldApiKey;
  if (oldDbId) process.env.NOTION_DATABASE_ID = oldDbId;

  if (!oldApiKey || !oldDbId) {
    notes.push("Live proxy success-shape check skipped because NOTION_API_KEY / NOTION_DATABASE_ID are not set locally.");
  }
}

async function main() {
  const courses = loadConst("./data/courses.js", "COURSES");
  const notebooks = loadConst("./data/notebooks.js", "NOTEBOOKS");

  validateCoursesShape(courses);
  validateNotebooksShape(notebooks);
  validateNotionToHtmlCoverage();
  await validateProxyContract();

  if (failures.length > 0) {
    console.log("SMOKE CHECK FAILED");
    failures.forEach((failure, index) => {
      console.log(`${index + 1}. ${failure}`);
    });
    notes.forEach((note) => console.log(`NOTE: ${note}`));
    process.exit(1);
  }

  console.log("SMOKE CHECK PASSED");
  console.log("Validated:");
  console.log("- Fallback payload shape for courses and notebooks");
  console.log("- Block-to-HTML mapping coverage");
  console.log("- Proxy contract for invalid type and missing env");
  notes.forEach((note) => console.log(`NOTE: ${note}`));
}

main().catch((error) => {
  console.error("Smoke check crashed:", error);
  process.exit(1);
});
