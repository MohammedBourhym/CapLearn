// Caption formatters for the CapLearn MCP server.
// Mirrors the app's client-side exports in front/src/utils/exportUtils.js.

const pad = (value, width = 2) => String(value).padStart(width, "0");

/**
 * Format seconds as hh:mm:ss,mmm (SRT) or hh:mm:ss.mmm (VTT).
 */
export function formatTimestamp(seconds, msSeparator = ",") {
  const safe = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const hours = Math.floor(safe / 3600);
  const minutes = Math.floor((safe % 3600) / 60);
  const secs = Math.floor(safe % 60);
  const ms = Math.floor((safe % 1) * 1000);

  return `${pad(hours)}:${pad(minutes)}:${pad(secs)}${msSeparator}${pad(ms, 3)}`;
}

/**
 * Plain text with one timestamped line per subtitle segment.
 */
export function toText(transcription) {
  const segments = transcription?.segments ?? [];
  if (!segments.length) return transcription?.text ?? "";

  const header = transcription.youtubeInfo
    ? `Title: ${transcription.youtubeInfo.title}\nURL: ${transcription.youtubeInfo.url}\n\n`
    : "";

  const lines = segments
    .map(
      (segment) =>
        `[${formatTimestamp(segment.start, ".")}] ${(segment.text ?? "").trim()}`
    )
    .join("\n");

  return header + lines;
}

/**
 * SubRip (.srt) format.
 */
export function toSrt(transcription) {
  const segments = transcription?.segments ?? [];
  if (!segments.length) return "";

  return segments
    .map(
      (segment, index) =>
        `${index + 1}\n` +
        `${formatTimestamp(segment.start)} --> ${formatTimestamp(segment.end)}\n` +
        `${(segment.text ?? "").trim()}\n`
    )
    .join("\n");
}

/**
 * WebVTT (.vtt) format.
 */
export function toVtt(transcription) {
  const segments = transcription?.segments ?? [];
  if (!segments.length) return "WEBVTT\n";

  const cues = segments
    .map(
      (segment, index) =>
        `${index + 1}\n` +
        `${formatTimestamp(segment.start, ".")} --> ${formatTimestamp(segment.end, ".")}\n` +
        `${(segment.text ?? "").trim()}\n`
    )
    .join("\n");

  return `WEBVTT\n\n${cues}`;
}

/**
 * Structured JSON. Word-level timestamps are included only when requested,
 * since they make the payload much larger.
 */
export function toJson(transcription, includeWords = false) {
  const segments = transcription?.segments ?? [];

  return JSON.stringify(
    {
      video: transcription?.youtubeInfo ?? null,
      text: transcription?.text ?? "",
      segments: segments.map((segment) => ({
        id: segment.id,
        start: segment.start,
        end: segment.end,
        text: segment.text,
        ...(includeWords ? { words: segment.words ?? [] } : {}),
      })),
    },
    null,
    2
  );
}
