function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function safeHref(href) {
  if (!href || typeof href !== "string") {
    return "";
  }

  if (/^(https?:|mailto:|tel:)/i.test(href)) {
    return href;
  }

  return "";
}

function wrapWithAnnotations(text, annotations = {}) {
  let value = text;

  if (annotations.code) {
    value = `<code>${value}</code>`;
  }
  if (annotations.bold) {
    value = `<strong>${value}</strong>`;
  }
  if (annotations.italic) {
    value = `<em>${value}</em>`;
  }
  if (annotations.strikethrough) {
    value = `<s>${value}</s>`;
  }
  if (annotations.underline) {
    value = `<u>${value}</u>`;
  }

  return value;
}

export function richTextToPlainText(richText) {
  if (!Array.isArray(richText)) {
    return "";
  }

  return richText.map((segment) => segment?.plain_text || "").join("");
}

export function richTextToSafeHtml(richText) {
  if (!Array.isArray(richText)) {
    return "";
  }

  return richText
    .map((segment) => {
      const rawText = segment?.plain_text || "";
      const escapedText = escapeHtml(rawText);
      let html = wrapWithAnnotations(escapedText, segment?.annotations || {});

      const href = safeHref(segment?.href);
      if (href) {
        html = `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${html}</a>`;
      }

      return html;
    })
    .join("");
}

function calloutClassName(block) {
  const icon = block?.callout?.icon;
  const emoji = icon?.type === "emoji" ? icon.emoji : "";

  if (emoji === "📌") {
    return "warn";
  }

  if (emoji === "🟢") {
    return "tip";
  }

  return "tip";
}

function calloutPrefix(block) {
  const icon = block?.callout?.icon;
  if (icon?.type === "emoji" && icon.emoji) {
    return `${escapeHtml(icon.emoji)} `;
  }
  return "";
}

function paragraphToHtml(block) {
  return `<p>${richTextToSafeHtml(block.paragraph?.rich_text || [])}</p>`;
}

function headingToHtml(block, level) {
  const key = `heading_${level}`;
  return `<h${level}>${richTextToSafeHtml(block[key]?.rich_text || [])}</h${level}>`;
}

function listItemToHtml(block) {
  if (block.type === "bulleted_list_item") {
    return `<li>${richTextToSafeHtml(block.bulleted_list_item?.rich_text || [])}</li>`;
  }

  if (block.type === "numbered_list_item") {
    return `<li>${richTextToSafeHtml(block.numbered_list_item?.rich_text || [])}</li>`;
  }

  return "";
}

function codeBlockToHtml(block) {
  const codeText = richTextToPlainText(block.code?.rich_text || []);
  return `<pre><code>${escapeHtml(codeText)}</code></pre>`;
}

function quoteBlockToHtml(block) {
  return `<blockquote>${richTextToSafeHtml(block.quote?.rich_text || [])}</blockquote>`;
}

function calloutBlockToHtml(block) {
  const className = calloutClassName(block);
  const prefix = calloutPrefix(block);
  const content = richTextToSafeHtml(block.callout?.rich_text || []);
  return `<div class="${className}">${prefix}${content}</div>`;
}

export function notionBlockToHtml(block) {
  if (!block || typeof block !== "object") {
    return "";
  }

  switch (block.type) {
    case "paragraph":
      return paragraphToHtml(block);
    case "heading_1":
      return headingToHtml(block, 1);
    case "heading_2":
      return headingToHtml(block, 2);
    case "heading_3":
      return headingToHtml(block, 3);
    case "bulleted_list_item":
    case "numbered_list_item":
      return listItemToHtml(block);
    case "code":
      return codeBlockToHtml(block);
    case "callout":
      return calloutBlockToHtml(block);
    case "quote":
      return quoteBlockToHtml(block);
    default:
      return "";
  }
}

export function notionBlocksToHtml(blocks) {
  if (!Array.isArray(blocks) || !blocks.length) {
    return "";
  }

  const htmlParts = [];
  let listType = "";
  let listItems = [];

  const flushList = () => {
    if (!listType || !listItems.length) {
      listType = "";
      listItems = [];
      return;
    }

    const tagName = listType === "ul" ? "ul" : "ol";
    htmlParts.push(`<${tagName}>${listItems.join("")}</${tagName}>`);
    listType = "";
    listItems = [];
  };

  for (const block of blocks) {
    if (block.type === "bulleted_list_item") {
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      listItems.push(notionBlockToHtml(block));
      continue;
    }

    if (block.type === "numbered_list_item") {
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      listItems.push(notionBlockToHtml(block));
      continue;
    }

    flushList();
    const html = notionBlockToHtml(block);
    if (html) {
      htmlParts.push(html);
    }
  }

  flushList();
  return htmlParts.join("\n");
}
