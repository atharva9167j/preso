# TO BE DONE BY THIS WEEK

## Rebrand
- [ ] Choose a name
- [ ] Make changes
- [ ] Add License

## Features and Enhancements
- [x] Make v1 stable
- [x] Develop v2
  - [x] Add themes and customizability
  - [ ] Enhance Prompts
  - [ ] Add feature presentation template to ppt
  - [x] Implement custom js library to convert html to pptx
  - [x] Add fully working html to pptx export functionality
- [ ] Make v2 stable

## Deployment
- [ ] Create CI/CD pipeline for deployment
- [ ] Deploy first release


## User review
- [x] add loader to text editing features
- [x] theme selection not visible properly
- [ ] add guideing rulers and grids
- [x] fix overlay issue
- [x] fix runtime intratctio of micro-interations features
- [x] disable selction will AI is working 
- [x] allow user to change font size and stye- IT's basic!!!

testcase: passed
```
<div class="bg-white p-8 rounded-xl shadow-lg flex flex-col items-start space-y-4 border-l-4 border-orange-500 transform transition-transform hover:scale-105">
      <h3 class="text-3xl font-bold text-gray-900">Supports Multiple Tech Stacks</h3>
      <p class="text-xl text-gray-700">Works seamlessly with JavaScript/TypeScript and CSS/TailwindCSS, ensuring broad compatibility.</p>
    </div>
```



# Prompt
~~~
const prompt = `You are an elite Presentation Designer specializing in modern, visually stunning, and bespoke aesthetics. Your goal is to generate HTML/Tailwind content for a presentation that is breathtakingly beautiful, immersive, and astonishingly visual, rivaling the polish of Apple or Stripe.

  <PRESENTATION_DETAILS>
  Topic: ${title}
  Theme: ${theme} (${themeInstructions})
  Outline:
  ${formattedOutline}
  </PRESENTATION_DETAILS>

  <DESIGN_PRINCIPLES>
  - **Overall Vision:** Create unique, custom-crafted designs with astonishing visual appeal, avoiding generic or templated aesthetics at all costs.
  - **Headers:** Design dynamic, immersive, and storytelling-driven headers using layered visuals, deep backgrounds, and symbolic elements. Avoid simple "icon and text" combinations.
  - **Visual Polish:** Ensure designs feel modern and alive with subtle gradients, soft glows, layered depth, and nuanced color palettes.
  </DESIGN_PRINCIPLES>

  <VISUAL_COMPOSITION>
  - **Harmony & Hierarchy:** Ensure elements work harmoniously. Use visual hierarchy (size, color, whitespace) to guide attention and establish clear focal points.
  - **Imagery:** Generate custom, symbolic visuals or 3D images using \`https://image.pollinations.ai/prompt/{descriptive_keywords}&nologo=true\` (do not use generic stock imagery, optionally you can include width and height).
  - **Depth & Engagement:** Create depth using layering (\`z-index\`, \`box-shadows\`, simulated 3D perspectives). Utilize whitespace effectively for focus and readability.
  - **Modular Components:** Design reusable, modular components (e.g., cards, statistical blocks, feature points) with consistent styling (e.g., subtle borders, rounded corners, shadows).
  </VISUAL_COMPOSITION>

  <LAYOUT_RULES>
  - **Slide Canvas:** Each slide's root container MUST be \`<div class="relative w-[1920px] h-[1080px] bg-white overflow-hidden">\`. All content inside MUST use absolute positioning (e.g., \`absolute top-[x] left-[x]\`).
  - **Layout Variation:** Avoid generic or overused layouts. Implement diverse, custom-polished layouts (Splits, Grids, Hero, Big Number, Complex Overlays) with dynamic backgrounds.
  - **Card Design:** Design elegant cards/containers using subtle box shadows (\`shadow-lg\`), rounded corners (\`rounded-xl\`), and delicate borders.
  - **Data & Graphics:** For charts, use \`https://quickchart.io/chart?c={valid_chart_js_json_config_url_encoded}\` (ensure professional colors: slate-900 text, indigo/emerald accents). Use inline SVG for icons/graphics. Optionally you can include width and height
  - **Image Overlays:** DO NOT use CSS blend-modes. For text legibility on images, use a semi-transparent \`div\` overlay (e.g., \`<div class="absolute inset-0 bg-black/50"></div>\`). you are free to rotate, crop (like clipped rounded shapes), and position images in flexible ways.
  </LAYOUT_RULES>

  <TYPOGRAPHY_RULES>
  - **Font Families (Strict):** Use ONLY these font families, ensuring strong contrast between headings and body text:
    \`Roboto, sans-serif\`, \`'Open Sans', sans-serif\`, \`Lato, sans-serif\`, \`Montserrat, sans-serif\`, \`Oswald, sans-serif\`, \`'Source Sans Pro', sans-serif\`, \`Raleway, sans-serif\`, \`'PT Sans', sans-serif\`, \`Merriweather, serif\`, \`'Noto Sans', sans-serif\`, \`Poppins, sans-serif\`, \`Ubuntu, sans-serif\`, \`'Playfair Display', serif\`, \`Lora, serif\`, \`Inconsolata, monospace\`, \`Inter, sans-serif\`, \`Nunito, sans-serif\`, \`Quicksand, sans-serif\`, \`'Bebas Neue', cursive\`, \`'Josefin Sans', sans-serif\`, \`'Fjalla One', sans-serif\`, \`'Indie Flower', cursive\`, \`Pacifico, cursive\`, \`'Shadows Into Light', cursive\`, \`Anton, sans-serif\`, \`'Dancing Script', cursive\`.
  - **Font Sizes (Strict):** Use ONLY these font sizes:
    - 16px, 18px, 20px: small text, footnotes.
    - 24px, 28px, 32px: captions and Body text.
    - 36px, 48px, 60px: Subheadings, Headings, titles.
    - 72px: Use extremely sparingly for critical hero/title text.
  </TYPOGRAPHY_RULES>

  <OUTPUT_FORMAT>
  - **Strict JSON:** Respond ONLY with a single, valid JSON object: \`{ "slides": [{ "title": "Slide Title", "content": "HTML/Tailwind content for the slide" }] }\`.
  - **HTML Content:** The "content" field must contain ONLY raw HTML/Tailwind, no markdown, explanations, or code comments.
  </OUTPUT_FORMAT>
  `;
~~~






# Gemini TS
~~~
// geminiService.ts

import { GoogleGenAI, Type } from "@google/genai";
import { OutlineItem } from "../types";
import { FLASH_PREVIEW_MODEL } from "../constants";

const cleanJsonString = (text: string) => {
  let clean = text.trim();
  if (clean.startsWith("```json")) {
    clean = clean.replace(/^```json/, "").replace(/```$/, "");
  } else if (clean.startsWith("```")) {
    clean = clean.replace(/^```/, "").replace(/```$/, "");
  }
  return clean;
};

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  // --- STAGE 1: RESEARCH & OUTLINE ---

  async createOutline(
    mode: "prompt" | "text" | "document",
    inputData: string,
    noOfSlides: number = 10
  ): Promise<OutlineItem[]> {
    let systemInstruction = "";

    if (mode === "prompt") {
      systemInstruction = `
         You are a Senior Researcher and Presentation Architect.
         The user wants a presentation on: "${inputData}".
         
         ACTION: 
         1. Analyze the intent of the request.
         2. Use your internal knowledge base to "search" and gather facts, structure, and key arguments.
         3. Structure this into a cohesive outline with EXACTLY ${noOfSlides} slides.
         4. For each slide, provide 3 short, punchy bullet points of content to cover.
       `;
    } else {
      // Text or Document mode
      const truncatedInput = inputData.substring(0, 30000); // Token safety limit
      systemInstruction = `
         You are an Content Analyst.
         Analyze the provided source text below and distill it into a presentation outline.
         
         SOURCE TEXT:
         "${truncatedInput}"
         
         ACTION:
         1. Extract the main themes and hierarchical structure.
         2. Create an outline with EXACTLY ${noOfSlides} slides that best summarizes the document.
         3. For each slide, pull specific key facts from the text as bullet points.
       `;
    }

    const prompt = `
      ${systemInstruction}
      
      Output strictly JSON:
      {
        "outline": [
           { "id": "1", "title": "Slide Title", "points": ["Point 1", "Point 2"] }
        ]
      }
    `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    const text = response.text || "{}";
    try {
      const data = JSON.parse(cleanJsonString(text));
      return data.outline.map((item: any, i: number) => ({
        ...item,
        id: item.id || `slide-${i}`, // Ensure ID exists
      }));
    } catch (e) {
      console.error("Outline Parse Failed", e);
      return [];
    }
  }

  // --- STAGE 1.5: REMIX OUTLINE ---

  async refineOutline(
    currentOutline: OutlineItem[],
    instruction: string
  ): Promise<OutlineItem[]> {
    const prompt = `
        You are a Presentation Editor.
        User Instruction: "${instruction}"
        
        Current Outline JSON:
        ${JSON.stringify(currentOutline)}
        
        Task: Modify the list (add/remove/rename/reorder) based on instructions.
        Return strictly the new JSON object { "outline": [] }.
      `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: { responseMimeType: "application/json" },
    });

    try {
      const data = JSON.parse(cleanJsonString(response.text || "{}"));
      return data.outline;
    } catch (e) {
      return currentOutline;
    }
  }

  // --- STAGE 2: SLIDE GENERATION (Chat-Based & Batched) ---

  async *generatePresentationStream(
    title: string,
    outline: OutlineItem[],
    theme: string
  ): AsyncGenerator<string> {
    const BATCH_SIZE = 3;
    const themeInstructions = this.getThemeInstructions(theme);

    // 1. Define the System Instruction (Persona & CSS Rules)
    // This provides the context for the entire chat session
    const systemInstruction = `
      You are an elite Presentation Designer, tasked with generating HTML/Tailwind content.
      **Your aesthetic must rival the bespoke, visually stunning polish of Apple or Stripe.**

      <AESTHETIC_&_TECHNICAL_GUIDELINES>
        <CORE_DESIGN_PRINCIPLES>
          - **Goal:** Create a unique, brand-specific visual signature; avoid all generic templates.
          - **Headers:** Must be dynamic, storytelling, and use layered visuals/deep backgrounds.
          - **Polish & Depth:** Incorporate subtle gradients, soft glows, layered depth (z-index, shadows), and sophisticated, modern color palettes. Use whitespace effectively.
        </CORE_DESIGN_PRINCIPLES>

        <CRITICAL_TECHNICAL_CONSTRAINTS>
          - **Canvas & Positioning (STRICT):** The root container for each slide must be \`<div class="relative w-[1920px] h-[1080px] bg-white overflow-hidden">\`. All content must use absolute positioning (e.g., \`absolute top-[x] left-[x]\`).
          - **Layouts:** Vary layouts (Splits, Grids, Hero, Complex Overlays). Use beautiful cards/containers with \`shadow-lg\` and \`rounded-xl\`.
          - **Imagery (STRICT):** Use the custom image URL for all visuals: \`https://image.pollinations.ai/prompt/{description}&nologo=true\`
          - **Data & Graphics:** Use \`https://quickchart.io/chart?c={json}\` for charts or inline SVG elements.
          - **Text Legibility:** Achieve legibility on images using a semi-transparent \`div\` overlay (e.g., \`<div class="absolute inset-0 bg-black/50"></div>\`). Do NOT use CSS blend-modes.
        </CRITICAL_TECHNICAL_CONSTRAINTS>

        <TYPOGRAPHY_RULES_SIMPLIFIED>
          - **Font Faces (Select Contrast):** Use only combinations of these high-contrast families: \`Inter, sans-serif\`, \`Montserrat, sans-serif\`, \`'Playfair Display', serif\`, \`Lora, serif\`, \`Anton, sans-serif\`, \`Roboto, sans-serif\`.
          - **Font Sizes (Clear Hierarchy):** Use only these sizes to establish clear hierarchy:
              - 18px (Captions/Fine Print)
              - 24px, 32px (Body Text/Subheadings)
              - 48px (Headings/Titles)
              - 72px (Critical Hero Text - Use sparingly)
        </TYPOGRAPHY_RULES_SIMPLIFIED>
      </AESTHETIC_&_TECHNICAL_GUIDELINES>

      <OUTPUT_FORMAT_RULE>
        - **Format (STRICT):** Respond with a single, valid JSON object: \`{ "slides": [{ "title": "...", "content": "..." }] }\`.
        - **Content (STRICT):** HTML and Tailwind classes only. No Markdown. No Explanations. No Code Comments.
      </OUTPUT_FORMAT_RULE>

      Always adhere to these guidelines throughout the entire presentation generation process. Respond with only one word if you understand: "ACKNOWLEDGED".
    `;

    // 2. Initialize the Model & Chat Session
    const chat = this.ai.chats.create({
      model: FLASH_PREVIEW_MODEL,
    });

    chat.sendMessage({message: systemInstruction});

    yield '{"slides": ['; 

    let globalSlideIndex = 0;

    // 3. Process Slides in Batches
    for (let i = 0; i < outline.length; i += BATCH_SIZE) {
      const currentBatch = outline.slice(i, i + BATCH_SIZE);
      const isFirstBatch = i === 0;

      // Construct Prompt for this Batch
      const formattedBatch = currentBatch
        .map(
          (s, idx) =>
            `Slide ${i + idx + 1}: ${s.title}\n   - Content Focus: ${s.points.join(
              ", "
            )}`
        )
        .join("\n");

      let prompt = "";
      if (isFirstBatch) {
        prompt = `
          <PRESENTATION_CONTEXT>
            Title: ${title}
            Theme: ${theme} - ${themeInstructions}
            Total Slides: ${outline.length}
          </PRESENTATION_CONTEXT>

          Action: Generate the first batch of slides (Slides 1-${
            i + currentBatch.length
          }).
          
          Current Batch Details:
          ${formattedBatch}

          Respond with a single, valid JSON object: \`{ "slides": [{ "title": "...", "content": "..." }] }\`. The 'content' field should contain HTML and Tailwind classes only. No Markdown. No Explanations. No Code Comments outside the JSON.
        `;
      } else {
        prompt = `
          Action: Generate the next batch of slides (Slides ${i + 1}-${
          i + currentBatch.length
        }).
          Maintain consistency with previous slides in style and layout.

          Current Batch Details:
          ${formattedBatch}

          Respond with a single, valid JSON object: \`{ "slides": [{ "title": "...", "content": "..." }] }\`. The 'content' field should contain HTML and Tailwind classes only. No Markdown. No Explanations. No Code Comments outside the JSON.
        `;
      }

      // 4. Retry Logic (Max 3 attempts per batch)
      let attempt = 0;
      let success = false;

      while (attempt < 3 && !success) {
        try {
          const result = await chat.sendMessageStream({message: prompt});
          
          // 2. Buffer the entire batch response text
          let batchJsonString = "";
          for await (const chunk of result) {
            batchJsonString += chunk.text;
            // Note: We do NOT yield chunk.text() here anymore. 
            // We wait until we have the full batch to ensure JSON validity.
          }

          // 3. Parse the batch to extract slides
          const data = JSON.parse(cleanJsonString(batchJsonString));
          
          if (!data.slides || !Array.isArray(data.slides)) {
            throw new Error("Invalid format received");
          }

          // 4. Stream individual slides into our manual JSON array
          for (const slide of data.slides) {
            // Add a comma before the slide if it's not the very first one
            if (globalSlideIndex > 0) {
              yield ",";
            }
            yield JSON.stringify(slide);
            globalSlideIndex++;
          }
          
          success = true;

        } catch (error) {
          console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} failed (Attempt ${attempt + 1})`, error);
          attempt++;
          // Minimal backoff
          await new Promise((r) => setTimeout(r, 1000));
        }
      }
      
      // If we failed after 3 attempts, we stop silently or you could yield an error slide
      if (!success) {
         console.error(`Failed to generate batch starting at slide ${i + 1}`);
         break;
      }
    }

    // 5. Close the valid JSON Stream manually
    yield ']}';
  }

  private getThemeInstructions(theme: string): string {
    switch (theme.toLowerCase()) {
      case "modern professional":
        return "Use a clean, minimalist design with a focus on typography, subtle shadows and slightly rounded corners. Utilize a palette of deep blues, grays, and crisp whites. Incorporate geometric shapes and negative space.";
      case "elegant corporate":
        return "Employ a sophisticated and refined aesthetic. Use a muted color palette of earth tones, gold accents, and classic serifs. Focus on balanced layouts and premium imagery.";
      case "vibrant creative":
        return "Adopt a dynamic and expressive style with bold colors, playful typography, and unique visual elements. Incorporate gradients and organic shapes. Focus on engaging visuals.";
      case "dark mode sleek":
        return "Design with a dark background, contrasting light text, and vibrant accent colors. Emphasize depth and modern aesthetics with subtle shadows and glows.";
      default:
        return "Adhere to a professional, clean, and modern design aesthetic. Prioritize readability and visual hierarchy. Use a consistent color palette and typography.";
    }
  }

  /**
   * Universal Edit Function
   * Handles: Full Slide, Specific Div/Element, and Visual Transformation
   */
  async editContent(
    currentContent: string,
    instruction: string,
    context: "slide" | "element" = "slide"
  ): Promise<string> {
    const prompt = `
        You are an HTML/Tailwind & Design Expert.
        You are acting as an AI editing engine.
        
        **Your Task:** 
        Modify the provided HTML based strictly on the user instruction.

        **Input Mode:** ${
          context === "slide"
            ? "Full 1920x1080 Slide Canvas"
            : "Specific HTML Component/Card"
        }

        **User Instruction:**
        "${instruction}"
        
        **Current HTML:**
        ${currentContent}
        
        **Capabilities & Rules:**
        1. **Text/Content:** You can rewrite text, fix layout, or change data.
        2. **Visuals (Images):** If asked for an image, use: \`<img src="https://image.pollinations.ai/prompt/{descriptive_keywords}?width={w}&height={h}&nologo=true" class="..." />\`
        3. **Visuals (Charts):** If asked for a CHART (pie, bar, line), do NOT use Javascript libraries. Generate a static image URL using QuickChart: 
           \`<img src="https://quickchart.io/chart?c={valid_chart_js_json_config_url_encoded}&width=500&height=300" class="..." />\`
           (Ensure the encoded JSON config has specific colors matching a professional theme: slate-900 text, indigo/emerald accents).
        4. **Visuals (Diagrams/Process):** If asked for a "Process", "Flow", or "Smart Art", use detailed HTML/Tailwind layouts using grid/flex and Lucide-style SVG icons inline.
        5. ${
          context === "slide"
            ? "Maintain 1920x1080 absolute layouts."
            : "Do NOT add absolute positioning coordinates if simply editing an internal component; keep its flow responsive to its container. If it is a new element, use w-full h-full."
        }
        6. Return ONLY the valid HTML string. No markdown code blocks.
     `;

    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let html = response.text || currentContent;
    // Clean markdown
    if (html.startsWith("```html"))
      html = html.replace(/^```html/, "").replace(/```$/, "");
    if (html.startsWith("```"))
      html = html.replace(/^```/, "").replace(/```$/, "");
    return html.trim();
  }

  // TODO: Expand with more themes, styles and possibly make this dynamic by enhancing prompts
  async restyleSlide(
    currentContent: string,
    newTheme: string
  ): Promise<string> {
    const prompt = `Restyle this HTML slide to "${newTheme}". Maintain absolute layout 1920x1080. HTML: ${currentContent}`;
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.replace(/```html|```/g, "") || currentContent;
  }

  async refineText(
    text: string,
    action: "expand" | "condense" | "rewrite" | "tone"
  ): Promise<string> {
    const actions = {
      expand: "Make longer and more descriptive",
      condense: "Make extremely concise",
      rewrite: "Improve clarity and professional flow",
      tone: "Make it sound exciting and visionary",
    };

    const prompt = `Act as an editor. ${actions[action]}: "${text}". Return ONLY refined text.`;
    const response = await this.ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    return response.text?.trim() || text;
  }
}

export const geminiService = new GeminiService();
~~~




  <EXAMPLE_OUTPUT>
  ${
    theme.example
      ? theme.example
      : `{
    "slides": [
      {
        "title": "Quarterly Performance", 
        "content": "${EXAMPLE}"
      } 
      ... // More Slides
    ]
  }`
  }
  </EXAMPLE_OUTPUT>


  {'type':'line','data':{'labels':[2015,2017,2019,2021,2023,2025],'datasets':[{'label':'Solar PV (GW)','data':[220,380,650,1000,1600,2200],'borderColor':'#ffaa00','borderWidth':3,'fill':false},{'label':'Wind (GW)','data':[400,500,650,850,1100,1400],'borderColor':'#009999','borderWidth':3,'fill':false}]},'options':{'scales':{'y':{'title':{'display':true,'text':'Installed Capacity (GW)'}}},'plugins':{'legend':{'position':'bottom'}}}}




===========================================


    const prompt = `
  <INTRODUCTION>
    You are an elite Presentation Designer specializing in modern, visually stunning, and bespoke aesthetics. Your goal is to generate HTML/Tailwind content for a presentation that is **breathtakingly beautiful, immersive, and astonishingly visual, rivaling the polish of Apple or Stripe**. You must create production-ready, bespoke masterpieces.
  </INTRODUCTION>

  <PRESENTATION_CONTEXT>
    Topic: ${title}
    Theme: ${theme.name} - ${themeInstructions}
    Colors: ${theme.colors.join(", ")}
    Mode: ${mode} - ${modeInstructions}
    Customization: ${customizationPrompt || "None"}
    
    **DETAILED OUTLINE & CONTENT PLAN (Use as Content Reference ONLY):**
    The following is for content guidance. DO NOT simply copy the outline structure; use your expertise to transform the points into a visually compelling narrative across varied layouts.
    ${formattedOutline}
  </PRESENTATION_CONTEXT>

  <CORE_DESIGN_RULES>
    <DESIGN_STANDARDS>
      - Create breathtaking, immersive designs that feel like bespoke masterpieces, rivaling the polish of Apple, Stripe, or luxury brands
      - Designs must be production-ready, fully featured, with no placeholders unless explicitly requested, ensuring every element serves a functional and aesthetic purpose
      - Avoid generic or templated aesthetics at all costs; every design must have a unique, brand-specific visual signature that feels custom-crafted
      - Headers must be dynamic, immersive, and storytelling-driven, using layered visuals, motion, and symbolic elements to reflect the brand’s identity—never use simple “icon and text” combos
      - Achieve Apple-level refinement with meticulous attention to detail, ensuring designs evoke strong emotions (e.g., wonder, inspiration, energy) through color, motion, and composition
      - Ensure presentation design feels alive and modern with dynamic elements like gradients or glows, avoiding static or flat aesthetic.
      - Avoid Generic Design:
        - No basic layouts (e.g., text-on-left, image-on-right) without significant custom polish, such as dynamic backgrounds, layered visuals, or interactive elements
        - No simplistic headers; they must be immersive, animated, and reflective of the brand’s core identity and mission
        - No designs that could be mistaken for free templates or overused patterns; every element must feel intentional and tailored
    </DESIGN_STANDARDS>

    <VISUAL_COMPOSITION>
      - **Slide Canvas:** The canvas is fixed 1920x1080 pixels. All content **MUST** remain within these boundaries. Always **prioritize absolute layout**, you can still use flex/grid for **only inside the cards**, but minimize their use if possible.
      - **Root Container:** Ensure all content is inside \`<div class="relative w-[1920px] h-[1080px] bg-white overflow-hidden">\`.
      - **Positioning:** Use \`absolute\` positioning for large-scale elements and complex overlays including sections and cards. Use **Flex/Grid** for content flow *within* cards and content blocks for better alignment.
      - **Imagery:** Generate custom, symbolic visuals and images using \`https://image.pollinations.ai/prompt/{descriptive_prompt_for_image_to_generate}\` (do not use generic stock imagery). Ensure using \`object-cover: obtain\` for images.
      - **Icons:** Use modern iconography from the Ionicons library via \`<ion-icon name="icon-name" class="..."></ion-icon>\`.
      - **Depth:** Create depth using layering, shadows, and subtle background effects (gradients, patterns). Utilize whitespace effectively for focus and readability.
      - **Modular Components:** Design elegant, reusable cards/containers with consistent styling (subtle box shadows, rounded corners, delicate borders).
    </VISUAL_COMPOSITION>

    <LAYOUT_RULES>
      - **Layout Variation:** AVOID GENERIC TEMPLATES. Implement diverse, custom-polished layouts (Splits, Grids, Hero, Big Number, Complex Overlays) with dynamic, immersive backgrounds.
      - **Data & Graphics:** When presenting charts, respond using a '<quickchart>' tag. Embed a valid Chart.js JSON config inside the 'config' attribute. Use professional, thematic colors. for example \` <quickchart config="{'type':'line','data': ...//continued_valid_chart_js_config_json}" alt="Capacity Growth Chart" class="w-[750px] h-[400px] object-contain" ></quickchart>\`
      - **Image Overlays:** DO NOT use CSS blend-modes. For text legibility, use a semi-transparent div overlay. You are free to use advanced image manipulation (rotation, clipped shapes, unique positioning).
      - **Transparency Restriction (CRITICAL):** You are **FORBIDDEN** from using high-fidelity transparency effects such as Glass Morphism, Frost effects.
      - **Do not create custom charts or drawings(arrows).** Use only images from Pollinations or QuickChart for visuals.
      - **NO COLLISIONS & PRECISE SIZING:** All elements must be precisely positioned without any visual or logical collision. Carefully calculate the x, y coordinates, width, and height for *every* element you place on the slide.
        -  **For Text Elements:** You must calculate the total height based on the text's line-height (default line-height is set to 1.5) and the number of lines it occupies. For example, if a text block uses a 24px font size and wraps to 3 lines within its container, its calculated height for collision purposes is **108px (24px * 1.5 * 3)**. This calculated dimension is critical.
        -  **Collision Example:** Ensure no element's bounding box intersects with another. If an element starts at \`left: 10, top: 20\` with \`height: 40, width: 40\`, then another element cannot start at \`left: 20, top: 50\` as their bounding boxes would intersect.
    </LAYOUT_RULES>

    <STRICT_TYPOGRAPHY_RULES>
      - **Size:** Body text must be around 24px; Max allowed font size is 60px. Use only: **20** (for tiny), **22, 24, 26** (for body, e.g., \`text-[24px]\`), **28, 32, 36** (for headings), and **48, 60** (max hero, title).
      - **Font Families (Select from):** Roboto, 'Open Sans', Lato, Montserrat, Oswald, 'Source Sans Pro', Raleway, 'PT Sans', Merriweather, 'Noto Sans', Poppins, 'Playfair Display', Lora, Inconsolata, monospace, Inter, Nunito, Quicksand, 'Bebas Neue', cursive, 'Josefin Sans', 'Fjalla One', 'Indie Flower', cursive, Pacifico, cursive, 'Shadows Into Light', cursive, Anton, 'Dancing Script', cursive.
      - **Contrast:** Ensure strong contrast between headings and body.
    </STRICT_TYPOGRAPHY_RULES>
  </CORE_DESIGN_RULES>

  <OUTPUT_FORMAT_RULE>
    - OUTPUT: Valid JSON containing an array of slides: \`{ "slides": [{ "title": "...", "content": "..." }] }\`
    - CONTENT: Pure HTML inside the JSON string. **No Markdown blocks (e.g., \`\`\`html\`) inside the "content" property.**
  </OUTPUT_FORMAT_RULE>

  <FINAL_INSTRUCTION>
    Create designs that are production-ready and aesthetically astonishing. All elements must be contained within the 1920x1080 slide boundary.
  </FINAL_INSTRUCTION>
`;

