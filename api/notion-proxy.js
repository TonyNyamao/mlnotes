import { fetchAllNotebooks, fetchCourseStructure } from "../lib/notion.js";

export const config = {
  runtime: "edge",
};

const JSON_HEADERS = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "s-maxage=300",
};

function jsonResponse(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: JSON_HEADERS,
  });
}

export default async function handler(request) {
  const requestUrl = new URL(request.url);
  const type = requestUrl.searchParams.get("type");

  if (type !== "notebooks" && type !== "courses") {
    return jsonResponse(
      {
        message: "Invalid type. Use ?type=notebooks or ?type=courses.",
      },
      400,
    );
  }

  const hasRequiredEnv = Boolean(process.env.NOTION_API_KEY) && Boolean(process.env.NOTION_DATABASE_ID);
  if (!hasRequiredEnv) {
    return jsonResponse(
      {
        message: "Notion environment variables are missing.",
      },
      500,
    );
  }

  try {
    const data = type === "notebooks"
      ? await fetchAllNotebooks()
      : await fetchCourseStructure();

    return jsonResponse(data, 200);
  } catch (error) {
    console.warn("Notion proxy request failed:", error);
    return jsonResponse(
      {
        message: "Failed to fetch Notion data.",
      },
      502,
    );
  }
}
