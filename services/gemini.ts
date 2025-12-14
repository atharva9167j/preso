// File: services/gemini.ts
import { GoogleGenAI, Type } from "@google/genai";
import { OutlineItem, Theme } from "../types";
import { getApiKey } from "./db";
import {
  FLASH_PREVIEW_MODEL,
  FLASH_LITE_MODEL,
  FLASH_OLD_MODEL,
  POLLINATIONS_PUBLIC_API_KEY
} from "../constants";
import * as Prompts from "../prompts";

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
    (async () => {
      const apiKey = (await getApiKey()) || process.env.GEMINI_API_KEY;
      this.ai = new GoogleGenAI({ apiKey });
    })();
  }

  /**
   * A private helper to wrap API calls with a retry mechanism.
   * Retries up to `maxRetries` times with linear backoff.
   * Aborts immediately on 429 (rate limit) errors.
   */
  private async _withRetry<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3
  ): Promise<T> {
    let lastError: Error | undefined;
    for (let i = 0; i < maxRetries; i++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;
        // Check for 429 Too Many Requests
        if (error.message && error.message.includes("429") || error.code == 429) {
          console.error("Rate limit exceeded (429). Aborting retries.");
          throw error; // Re-throw the 429 error immediately
        }
        console.warn(
          `Attempt ${i + 1} of ${maxRetries} failed. Retrying in ${i + 1}s...`,
          error
        );
        // Wait for an increasing amount of time
        await new Promise((res) => setTimeout(res, 1000 * (i + 1)));
      }
    }
    throw new Error(
      `AI service failed after ${maxRetries} attempts. Last error: ${lastError?.message}`
    );
  }

  // --- STAGE 1: RESEARCH & OUTLINE ---

  async createOutline(
    mode: "prompt" | "text" | "document",
    inputData: string,
    noOfSlides: number = 10
  ): Promise<OutlineItem[]> {
    const systemInstruction = Prompts.getOutlineSystemInstruction(mode, inputData, noOfSlides);
    const prompt = `${systemInstruction}\n${Prompts.OUTLINE_JSON_STRUCTURE}`;
    let contents: any = [
        { text: prompt },
    ];
    if(mode == "document")
    {
      contents.push({
            inlineData: {
                mimeType: 'application/pdf',
                data: inputData
            }
        })
    }

    try {
      const response = await this._withRetry(() =>
        this.ai.models.generateContent({
          model: FLASH_LITE_MODEL,
          contents: contents,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                outline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      points: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "points"],
                  },
                },
              },
              required: ["outline"],
            },
          },
        })
      );

      const text = response.text || "{}";
      const data = JSON.parse(cleanJsonString(text));
      if (!data.outline) {
        throw new Error("AI returned an invalid outline structure.");
      }
      return data.outline.map((item: any, i: number) => ({
        ...item,
        id: item.id || `slide-${i}`,
      }));
    } catch (error) {
      console.error("Failed to create outline:", error);
      throw new Error(error);
    }
  }

  // --- STAGE 1.5: REMIX OUTLINE ---

  async refineOutline(
    currentOutline: OutlineItem[],
    instruction: string
  ): Promise<OutlineItem[]> {
    const prompt = Prompts.getRefineOutlinePrompt(currentOutline, instruction);

    try {
      const response = await this._withRetry(() =>
        this.ai.models.generateContent({
          model: FLASH_LITE_MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                outline: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      id: { type: Type.STRING },
                      title: { type: Type.STRING },
                      points: {
                        type: Type.ARRAY,
                        items: { type: Type.STRING },
                      },
                    },
                    required: ["title", "points"],
                  },
                },
              },
              required: ["outline"],
            },
          },
        })
      );
      const data = JSON.parse(cleanJsonString(response.text || "{}"));
      if (!data.outline) {
        throw new Error("AI returned an invalid outline structure.");
      }
      return data.outline;
    } catch (error) {
      console.error("Failed to refine outline:", error);
      throw new Error(error);
    }
  }

  async generateColorPalettes(prompt: string): Promise<string[][]> {
    const aiPrompt = Prompts.getColorPalettePrompt(prompt);

    try {
      const response = await this._withRetry(() =>
        this.ai.models.generateContent({
          model: FLASH_LITE_MODEL,
          contents: aiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                palettes: {
                  type: Type.ARRAY,
                  items: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              required: ["palettes"],
            },
          },
        })
      );

      const text = response.text || "{}";
      const data = JSON.parse(cleanJsonString(text));
      if (!data.palettes || !Array.isArray(data.palettes)) {
        throw new Error("AI returned an invalid palette structure.");
      }
      return data.palettes;
    } catch (error) {
      console.error("Failed to generate color palettes:", error);
      throw new Error(error);
    }
  }

  // --- STAGE 2: SLIDE GENERATION ---

  async *generatePresentationStream(
    title: string,
    outline: OutlineItem[],
    theme: Theme,
    mode: "concise" | "balanced" | "theory",
    customizationPrompt: string
  ): AsyncGenerator<string> {
    
    const formattedOutline = outline
      .map(
        (s, i) =>
          `Slide ${i + 1}: ${s.title}\n   - Content Focus: ${s.points.join(", ")}`
      )
      .join("\n");

    const prompt = Prompts.getPresentationSystemPrompt(title, theme, mode, customizationPrompt, formattedOutline);
    
    const responseStream = await this._withRetry(() =>
      this.ai.models.generateContentStream({
        model: FLASH_PREVIEW_MODEL,
        contents: prompt,
        config: {
          thinkingConfig: {
            thinkingBudget: 16192,
            includeThoughts: true,
          },
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              slides: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                  },
                  required: ["title", "content"],
                },
              },
            },
            required: ["slides"],
          },
        },
      })
    );

    for await (const chunk of responseStream) {
      if (chunk.text) yield chunk.text;
    }
  }

  // --- TOKENIZATION HELPERS ---

  private replaceImagesWithPlaceholders(
    html: string
  ): { cleanedHtml: string; imageMap: Map<string, string> } {
    const imageMap = new Map<string, string>();
    let imgCounter = 0;

    const cleanedHtml = html.replace(
      /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
      (match, src: string) => {
        if (!src.startsWith('https')) {
          const placeholder = `https://placeholder.img/id-${imgCounter++}`;
          imageMap.set(placeholder, src);
          return match.replace(src, placeholder);
        } else {
          return match;
        }
      }
    );

    return { cleanedHtml, imageMap };
  }

  private restoreImages(
    html: string,
    imageMap: Map<string, string>
  ): string {

    function transformPollinationsURLs(input: string) {
      const urlRegex =
        /https?:\/\/gen\.pollinations\.ai\/image\/([^\\"\s>]+)/gi;
      return input.replaceAll(urlRegex, (full, raw) => {
        let desc = raw.replace(/_/g, " ");
        desc = decodeURIComponent(desc);
        const encoded = encodeURIComponent(desc);
        return `https://gen.pollinations.ai/image/${encoded}?model=flux&key=${POLLINATIONS_PUBLIC_API_KEY}`;
      });
    }

    function convertQuickChartTags(htmlString) {
      const quickchartTagRegex = /<quickchart([\s\S]+?)>/g;
      return htmlString.replace(
        quickchartTagRegex,
        (match, attributesString) => {
          const cleanedAttributesString = attributesString
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'");
          const attributeRegex = /([\w-]+)\s*=\s*(["'])([\s\S]*?)\2/g;
          const attributes: Record<string, string> = {};
          let attrMatch;
          while (
            (attrMatch = attributeRegex.exec(cleanedAttributesString)) !==
            null
          ) {
            attributes[attrMatch[1]] = attrMatch[3];
          }
          if (!attributes.config) {
            console.error(
              "QuickChart tag found without a parsable 'config' attribute. Original tag:",
              match
            );
            return match;
          }
          const encodedConfig = encodeURIComponent(
            attributes.config.replaceAll("'", '"')
          );
          const chartUrl = `https://quickchart.io/chart?c=${encodedConfig}`;
          let imgTag = `<img src=${chartUrl}`;
          for (const key in attributes) {
            if (key !== "config") {
              imgTag += ` ${key}=${attributes[key]}`;
            }
          }
          imgTag += ">";
          return imgTag;
        }
      );
    }

    let restoredHtml = convertQuickChartTags(transformPollinationsURLs(html));
    
    for (const [placeholder, originalSrc] of imageMap.entries()) {
      const escapedPlaceholder = placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escapedPlaceholder, 'g');
      restoredHtml = restoredHtml.replace(regex, originalSrc);
    }
    
    return restoredHtml;
  }

  // --- EDIT CONTENT (Updated) ---

  async editContent(
    currentContent: string,
    instruction: string,
    context: "slide" | "element" = "slide"
  ): Promise<string> {
    // 1. Tokenize Images
    const { cleanedHtml, imageMap } = this.replaceImagesWithPlaceholders(currentContent);

    const prompt = Prompts.getEditContentPrompt(cleanedHtml, instruction, context);

    try {
      const response = await this._withRetry(() =>
        this.ai.models.generateContent({
          model: FLASH_PREVIEW_MODEL,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: { html: { type: Type.STRING } },
              required: ["html"],
            },
          },
        })
      );
      const text = response.text || `{ "html": "" }`;
      const data = JSON.parse(cleanJsonString(text));
      
      let newHtml = data.html || currentContent;

      // 2. Detokenize (Restore Images)
      newHtml = this.restoreImages(newHtml, imageMap);

      return newHtml;

    } catch (error) {
      console.error("Failed to edit content:", error);
      throw new Error(error);
    }
  }

  // --- RESTYLE DECK (Updated) ---

  async restyleDeck(
    slides: { id: string; title: string; content: string }[],
    oldTheme: Theme,
    newTheme: Theme
  ): Promise<{ id: string; title: string; content: string }[]> {
    
    // 1. Tokenize Images globally across ALL slides
    const globalImageMap = new Map<string, string>();
    let globalImgCounter = 0;

    const slidesWithPlaceholders = slides.map(slide => {
      const cleaned = slide.content.replace(
        /<img[^>]+src=["']([^"']+)["'][^>]*>/gi,
        (match, src) => {
          const placeholder = `https://placeholder.img/global-id-${globalImgCounter++}`;
          globalImageMap.set(placeholder, src);
          return match.replace(src, placeholder);
        }
      );
      return { ...slide, content: cleaned };
    });

    const prompt = Prompts.getRestyleDeckPrompt(newTheme, oldTheme, slidesWithPlaceholders);

    try {
      const response = await this._withRetry(() =>
        this.ai.models.generateContent({
          model: FLASH_PREVIEW_MODEL,
          contents: prompt,
          config: {
            thinkingConfig: { thinkingBudget: 16192, includeThoughts: true },
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                slides: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      content: { type: Type.STRING },
                    },
                    required: ["title", "content"],
                  },
                },
              },
              required: ["slides"],
            },
          },
        })
      );

      const text = response.text || "{}";
      const data = JSON.parse(cleanJsonString(text));

      if (!data.slides || !Array.isArray(data.slides)) {
        throw new Error("AI returned an invalid deck structure.");
      }

      const updatedSlides = slides.map((originalSlide, i) => {
        const updatedSlide = data.slides[i];
        if (!updatedSlide) return originalSlide;

        // 2. Detokenize (Restore Images) for this specific slide
        const contentWithRestoredImages = this.restoreImages(updatedSlide.content, globalImageMap);

        return { ...originalSlide, content: contentWithRestoredImages };
      });

      return updatedSlides;
    } catch (error) {
      console.error("Failed to restyle deck:", error);
      throw new Error(error);
    }
  }

  async refineText(
    text: string,
    action: "expand" | "condense" | "rewrite" | "tone"
  ): Promise<string> {
      const prompt = Prompts.getRefineTextPrompt(text, action);
      try {
        const response = await this._withRetry(() =>
          this.ai.models.generateContent({
            model: FLASH_OLD_MODEL,
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              responseSchema: {
                type: Type.OBJECT,
                properties: { text: { type: Type.STRING } },
                required: ["text"],
              },
            },
          })
        );
        const responseText = response.text || `{ "text": "" }`;
        console.log(response.text)
        const data = JSON.parse(cleanJsonString(responseText));
        return data.text || text;
      } catch (error) {
        console.error("Failed to refine text:", error);
        throw new Error(error);
      }
  }
}

export const geminiService = new GeminiService();