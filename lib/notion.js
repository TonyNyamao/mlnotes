import { Client } from "@notionhq/client";
import { notionBlocksToHtml, richTextToPlainText } from "./notionToHTML.js";

const COURSE_TEMPLATES = {
  c7: {
    id: "c7",
    tabLabel: "01 Foundation",
    heroTitle: "Machine Learning Associate — Course 7",
    heroDesc: "From What is ML? through to PCA. All algorithms built on scikit-learn built-in datasets with zero downloads required.",
    alertText: "",
  },
  c8: {
    id: "c8",
    tabLabel: "02 Ingestion",
    heroTitle: "Advanced Machine Learning — Course 8",
    heroDesc: "Decision Trees, Random Forests, and Naive Bayes. Tree-based methods and probabilistic classifiers on real sklearn datasets.",
    alertText: "",
  },
  c9: {
    id: "c9",
    tabLabel: "03 Processing",
    heroTitle: "Advanced Machine Learning II — Course 9",
    heroDesc: "Boosting, SVMs, Neural Networks, and advanced evaluation. The full professional ML toolkit used in industry.",
    alertText: "",
  },
};

function getNotionClient() {
  if (!process.env.NOTION_API_KEY) {
    throw new Error("NOTION_API_KEY is not configured");
  }

  return new Client({
    auth: process.env.NOTION_API_KEY,
  });
}

function getDatabaseId() {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not configured");
  }

  return process.env.NOTION_DATABASE_ID;
}

function getProperty(properties, propertyName) {
  return properties?.[propertyName] || null;
}

function getTitlePropertyText(properties, propertyName) {
  const property = getProperty(properties, propertyName);
  if (!property || property.type !== "title") {
    return "";
  }

  return richTextToPlainText(property.title).trim();
}

function getRichTextPropertyText(properties, propertyName) {
  const property = getProperty(properties, propertyName);
  if (!property || property.type !== "rich_text") {
    return "";
  }

  return richTextToPlainText(property.rich_text).trim();
}

function getSelectPropertyValue(properties, propertyName) {
  const property = getProperty(properties, propertyName);
  if (!property) {
    return "";
  }

  if (property.type === "select") {
    return property.select?.name || "";
  }

  if (property.type === "status") {
    return property.status?.name || "";
  }

  return "";
}

function normalizeNotebookCounter(counterValue, fallbackCounter) {
  if (typeof counterValue !== "string" || !counterValue.trim()) {
    return `[${fallbackCounter}]`;
  }

  const trimmed = counterValue.trim();
  return trimmed.startsWith("[") && trimmed.endsWith("]")
    ? trimmed
    : `[${trimmed.replace(/\[|\]/g, "")}]`;
}

function inferService(metaText) {
  const metaMatch = /dataset\s*:\s*(.+)$/i.exec(metaText || "");
  if (!metaMatch) {
    return "notion";
  }

  return metaMatch[1].trim();
}

function parseCodeCaptionMetadata(captionRichText, notebookId) {
  const captionText = richTextToPlainText(captionRichText || []).trim();
  if (!captionText) {
    return {};
  }

  try {
    const parsed = JSON.parse(captionText);
    return typeof parsed === "object" && parsed !== null ? parsed : {};
  } catch (error) {
    console.warn(`Invalid code caption metadata for notebook ${notebookId}:`, error);
    return {};
  }
}

function parseOutputData(rawOutputData) {
  if (rawOutputData === undefined || rawOutputData === null) {
    return "";
  }

  if (typeof rawOutputData !== "string") {
    return rawOutputData;
  }

  const trimmed = rawOutputData.trim();
  if (!trimmed) {
    return "";
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return rawOutputData;
  }
}

function buildCodeCellFromBlock(block, notebookId, fallbackCounter) {
  const metadata = parseCodeCaptionMetadata(block.code?.caption, notebookId);

  return {
    type: "code",
    counter: normalizeNotebookCounter(metadata.counter, fallbackCounter),
    label: metadata.label || `Step ${fallbackCounter}`,
    service: metadata.service || "notion",
    output: metadata.output || "text",
    outputData: parseOutputData(metadata.outputData),
    preText: metadata.preText || "",
    code: richTextToPlainText(block.code?.rich_text || []),
  };
}

function toNotebookCells(blocks, notebookId) {
  const cells = [];
  let markdownBlocks = [];
  let codeCounter = 1;

  const flushMarkdown = () => {
    if (!markdownBlocks.length) {
      return;
    }

    const html = notionBlocksToHtml(markdownBlocks).trim();
    if (html) {
      cells.push({
        type: "md",
        content: html,
      });
    }

    markdownBlocks = [];
  };

  for (const block of blocks) {
    if (block.type === "code") {
      flushMarkdown();
      cells.push(buildCodeCellFromBlock(block, notebookId, codeCounter));
      codeCounter += 1;
      continue;
    }

    markdownBlocks.push(block);
  }

  flushMarkdown();
  return cells;
}

async function queryAllDatabaseRows(notion, databaseId) {
  const pages = [];
  let nextCursor = undefined;

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      start_cursor: nextCursor,
      page_size: 100,
    });

    pages.push(...response.results.filter((result) => result.object === "page"));
    nextCursor = response.has_more ? response.next_cursor : undefined;
  } while (nextCursor);

  return pages;
}

async function listAllChildBlocks(notion, blockId) {
  const blocks = [];
  let nextCursor = undefined;

  do {
    const response = await notion.blocks.children.list({
      block_id: blockId,
      start_cursor: nextCursor,
      page_size: 100,
    });

    blocks.push(...response.results);
    nextCursor = response.has_more ? response.next_cursor : undefined;
  } while (nextCursor);

  return blocks;
}

function buildCourseSkeleton() {
  return Object.values(COURSE_TEMPLATES).map((course) => ({
    ...course,
    modules: [],
  }));
}

function sortByPhaseValue(a, b) {
  const getPhaseNumber = (value) => {
    const match = /(\d+)/.exec(value || "");
    return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER;
  };

  return getPhaseNumber(a.phase) - getPhaseNumber(b.phase);
}

function normalizeCourseCode(courseValue) {
  return (courseValue || "").trim().toLowerCase();
}

export async function fetchAllNotebooks() {
  const notion = getNotionClient();
  const databaseId = getDatabaseId();
  const pages = await queryAllDatabaseRows(notion, databaseId);

  const notebooks = {};

  for (const page of pages) {
    const properties = page.properties || {};
    const notebookId = getRichTextPropertyText(properties, "module_id") || page.id.replace(/-/g, "");
    const title = getTitlePropertyText(properties, "title") || "Untitled notebook";
    const phase = getRichTextPropertyText(properties, "phase") || "Phase";
    const meta = getRichTextPropertyText(properties, "meta");
    const alert = getRichTextPropertyText(properties, "alert");

    const blocks = await listAllChildBlocks(notion, page.id);
    const cells = toNotebookCells(blocks, notebookId);

    notebooks[notebookId] = {
      title,
      meta,
      phase,
      alert,
      cells,
    };
  }

  return notebooks;
}

export async function fetchCourseStructure() {
  const notion = getNotionClient();
  const databaseId = getDatabaseId();
  const pages = await queryAllDatabaseRows(notion, databaseId);

  const courses = buildCourseSkeleton();
  const courseIndexMap = new Map(courses.map((course, index) => [course.id, index]));

  for (const page of pages) {
    const properties = page.properties || {};

    const notebookId = getRichTextPropertyText(properties, "module_id") || page.id.replace(/-/g, "");
    const notebookTitle = getTitlePropertyText(properties, "title") || notebookId;
    const phase = getRichTextPropertyText(properties, "phase") || "Phase";
    const courseValue = normalizeCourseCode(getSelectPropertyValue(properties, "course"));
    const meta = getRichTextPropertyText(properties, "meta");

    if (!courseIndexMap.has(courseValue)) {
      continue;
    }

    const course = courses[courseIndexMap.get(courseValue)];
    let moduleEntry = course.modules.find((entry) => entry.phase === phase);

    if (!moduleEntry) {
      moduleEntry = {
        phase,
        navLabel: phase,
        notebooks: [],
      };
      course.modules.push(moduleEntry);
    }

    moduleEntry.notebooks.push({
      id: notebookId,
      label: notebookTitle,
      service: inferService(meta),
      phase,
    });
  }

  for (const course of courses) {
    course.modules.sort(sortByPhaseValue);
    for (const moduleEntry of course.modules) {
      moduleEntry.notebooks.sort((left, right) => left.label.localeCompare(right.label));
    }
  }

  return courses;
}
