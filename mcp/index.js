import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { toText, toSrt, toVtt, toJson } from "./formatters.js";

const API_URL = (process.env.CAPLEARN_API_URL || "http://localhost:3000").replace(/\/+$/, "");

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtu.be",
]);

const server = new McpServer({
  name: "caplearn",
  version: "1.0.0",
});

const toolResult = (text) => ({ content: [{ type: "text", text }] });
const toolError = (text) => ({ content: [{ type: "text", text }], isError: true });

server.registerTool(
  "get_captions",
  {
    title: "Get video captions",
    description:
      "Transcribe a YouTube video and return its captions using the CapLearn backend " +
      "(yt-dlp + ffmpeg + Groq Whisper). Long videos can take a while.",
    inputSchema: z.object({
      videoUrl: z
        .string()
        .url()
        .refine(
          (value) => {
            try {
              return YOUTUBE_HOSTS.has(new URL(value).hostname);
            } catch {
              return false;
            }
          },
          { message: "Must be a YouTube URL" }
        )
        .describe("Full YouTube URL, e.g. https://www.youtube.com/watch?v=..."),
      format: z
        .enum(["text", "srt", "vtt", "json"])
        .default("text")
        .describe(
          "Output format. 'text' is one timestamped line per segment; 'json' includes segment data."
        ),
      includeWords: z
        .boolean()
        .default(false)
        .describe("In JSON output, include per-word timestamps."),
    }),
  },
  async ({ videoUrl, format, includeWords }, extra) => {
    // Keep the client informed during long transcriptions when it asked for progress.
    const progressToken = extra._meta?.progressToken;
    let tick = 0;
    const timer =
      progressToken !== undefined
        ? setInterval(() => {
            extra
              .sendNotification({
                method: "notifications/progress",
                params: {
                  progressToken,
                  progress: ++tick,
                  message: "Extracting audio and transcribing…",
                },
              })
              .catch(() => {});
          }, 10_000)
        : undefined;

    // Don't keep the process alive just because of the progress timer.
    timer?.unref?.();

    try {
      const response = await fetch(`${API_URL}/api/subtitles/youtube`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl: videoUrl }),
        // Cancels this request if the MCP client goes away. Note: the backend
        // may continue its yt-dlp/ffmpeg/Groq work after the connection drops.
        signal: extra.signal,
      });

      const raw = await response.text();
      let data;
      try {
        data = raw ? JSON.parse(raw) : null;
      } catch {
        return toolError(
          `CapLearn returned a non-JSON response (HTTP ${response.status}): ${raw.slice(0, 300)}`
        );
      }

      if (!response.ok || !data?.success || !data?.transcription) {
        const reason = data?.error || data?.message || `HTTP ${response.status}`;
        return toolError(`CapLearn could not process the video: ${reason}`);
      }

      const transcription = data.transcription;
      const body =
        format === "srt"
          ? toSrt(transcription)
          : format === "vtt"
            ? toVtt(transcription)
            : format === "json"
              ? toJson(transcription, includeWords)
              : toText(transcription);

      return toolResult(body);
    } catch (error) {
      if (error?.name === "AbortError") {
        return toolError("Caption request was cancelled.");
      }
      return toolError(
        `Failed to reach the CapLearn backend at ${API_URL}: ${error?.message ?? error}. ` +
          "Is it running? Start it with `docker compose up -d` or `cd back && npm start`."
      );
    } finally {
      if (timer) clearInterval(timer);
    }
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);

// stdout is reserved for the MCP protocol — always log to stderr.
console.error(`CapLearn MCP server is running on stdio (backend: ${API_URL})`);
