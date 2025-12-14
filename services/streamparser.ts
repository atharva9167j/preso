// File: services/streamParser.ts

/**
 * Parses a streaming string from the AI to extract complete slides 
 * and the current HTML chunk in progress.
 */
export const parseLiveStream = (
  stream: string
): {
  completeSlides: { title: string; content: string }[];
  inProgressHtml: string;
} => {
  const completeSlides: { title: string; content: string }[] = [];
  let lastCompletedObjectEndIndex = 0;
  
  // Clean markdown code blocks if present
  let cleanStream = stream;
  if (stream.trim().startsWith("```json"))
    cleanStream = stream.substring(stream.indexOf("```json") + 7);
  else if (stream.trim().startsWith("```"))
    cleanStream = stream.substring(stream.indexOf("```") + 3);

  // Find the start of the slides array
  const arrayStartIndex = cleanStream.indexOf("[");
  if (arrayStartIndex === -1) return { completeSlides: [], inProgressHtml: "" };

  const jsonText = cleanStream.substring(arrayStartIndex + 1);
  let braceCount = 0;
  let currentObjectStartIndex = -1;
  let inString = false;
  
  // Walk through the string to find complete JSON objects inside the array
  for (let i = 0; i < jsonText.length; i++) {
    const char = jsonText[i];
    if (char === "\\") {
      i++;
      continue;
    }
    if (char === '"') {
      inString = !inString;
    }
    if (!inString) {
      if (char === "{") {
        if (braceCount === 0) currentObjectStartIndex = i;
        braceCount++;
      } else if (char === "}") {
        if (braceCount > 0) {
          braceCount--;
          if (braceCount === 0 && currentObjectStartIndex !== -1) {
            const objectString = jsonText.substring(
              currentObjectStartIndex,
              i + 1
            );
            try {
              const slide = JSON.parse(objectString);
              if (
                slide &&
                typeof slide.title === "string" &&
                typeof slide.content === "string"
              ) {
                // Update existing or add new
                const existingIndex = completeSlides.findIndex(
                  (s) => s.title === slide.title
                );
                if (existingIndex > -1) completeSlides[existingIndex] = slide;
                else completeSlides.push(slide);
                
                lastCompletedObjectEndIndex = i + 1;
              }
            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
            currentObjectStartIndex = -1;
          }
        }
      }
    }
  }

  // Extract the HTML of the slide currently being written
  let inProgressHtml = "";
  const partialStream = jsonText.substring(lastCompletedObjectEndIndex);
  const contentMatch = partialStream.match(/"content"\s*:\s*"/);
  
  if (contentMatch && contentMatch.index !== undefined) {
    let partialHtmlContent = partialStream
      .substring(contentMatch.index + contentMatch[0].length)
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/\\\\/g, "\\");
      
    // Try to close the HTML tags artificially to render a preview
    const firstTagEnd = partialHtmlContent.indexOf(">");
    if (firstTagEnd > -1) {
      const mainContainerOpenTag = partialHtmlContent.substring(
        0,
        firstTagEnd + 1
      );
      if (mainContainerOpenTag.startsWith("<div")) {
        const innerContent = partialHtmlContent.substring(firstTagEnd + 1);
        const lastBlockClose = innerContent.lastIndexOf("</div>");
        if (lastBlockClose > -1)
          inProgressHtml =
            mainContainerOpenTag +
            innerContent.substring(0, lastBlockClose + 6) +
            "</div>";
        else inProgressHtml = mainContainerOpenTag + "</div>";
      }
    }
  }
  
  return { completeSlides, inProgressHtml };
};

/**
 * Replace Pollinations URLs with the public API key format
 */
export const transformPollinationsURLs = (input: string, apiKey: string) => {
  const urlRegex = /https?:\/\/gen\.pollinations\.ai\/image\/([^\\"\s>]+)/gi;

  return input.replaceAll(urlRegex, (full, raw) => {
    let desc = raw.replace(/_/g, " ");
    desc = decodeURIComponent(desc);
    const encoded = encodeURIComponent(desc);

    return `https://gen.pollinations.ai/image/${encoded}?model=flux&key=${apiKey}`;
  });
}

/**
 * Converts <quickchart> tags to <img> tags
 */
export const convertQuickChartTags = (htmlString: string) => {
  const quickchartTagRegex = /<quickchart([\s\S]+?)>/g;

  return htmlString.replace(quickchartTagRegex, (match, attributesString) => {
    const cleanedAttributesString = attributesString
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'");

    const attributeRegex = /([\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g;
    const attributes: Record<string, string> = {};
    let attrMatch;

    while ((attrMatch = attributeRegex.exec(cleanedAttributesString)) !== null) {
      attributes[attrMatch[1]] = attrMatch[3];
    }

    if (!attributes.config) return match;

    const encodedConfig = encodeURIComponent(
      attributes.config.replaceAll("'", '"')
    );
    const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;
    let imgTag = `<img src=\\"${chartUrl}\\"`;

    for (const key in attributes) {
      if (key !== "config") {
        const escapedValue = attributes[key].replace(/"/g, "&quot;");
        imgTag += ` ${key}=\\"${escapedValue}\\"`;
      }
    }

    imgTag += ">";
    return imgTag;
  });
}