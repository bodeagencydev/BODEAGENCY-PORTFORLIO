import { readdir } from 'node:fs/promises';
import path from 'node:path';

import {
  type NicheVideos,
  type VideoItem,
  SUPPORTED_VIDEO_EXTENSIONS,
  VIDEO_ROOT,
} from '../data';

const PUBLIC_DIR = path.join(process.cwd(), 'public');
const VIDEOS_DIR = path.join(PUBLIC_DIR, VIDEO_ROOT);

const isSupportedVideoFile = (fileName: string): boolean => {
  const lower = fileName.toLowerCase();
  return SUPPORTED_VIDEO_EXTENSIONS.some((extension) => lower.endsWith(extension));
};

const toTitleCase = (value: string): string =>
  value
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

async function getDirectoryEntries(directory: string): Promise<string[]> {
  try {
    return await readdir(directory);
  } catch {
    return [];
  }
}

async function resolveNicheFolderCaseInsensitive(niche: string): Promise<string | null> {
  const normalizedNiche = niche.toLowerCase();
  const folders = await getDirectoryEntries(VIDEOS_DIR);

  const match = folders.find((folder) => folder.toLowerCase() === normalizedNiche);
  return match ?? null;
}

function sortCaseInsensitive(a: string, b: string): number {
  return a.localeCompare(b, undefined, { sensitivity: 'base', numeric: true });
}

export async function getAllNiches(): Promise<string[]> {
  const entries = await getDirectoryEntries(VIDEOS_DIR);

  return entries.map((entry) => entry.toLowerCase()).sort(sortCaseInsensitive);
}

export async function getVideosByNiche(nicheParam: string): Promise<NicheVideos | null> {
  const niche = nicheParam.toLowerCase();
  const folderName = await resolveNicheFolderCaseInsensitive(niche);

  if (!folderName) {
    return null;
  }

  const folderPath = path.join(VIDEOS_DIR, folderName);
  const files = await getDirectoryEntries(folderPath);

  const videos: VideoItem[] = files
    .filter(isSupportedVideoFile)
    .sort(sortCaseInsensitive)
    .map((fileName) => {
      const extension = path.extname(fileName);
      const baseName = fileName.slice(0, fileName.length - extension.length);

      // Keep actual casing for URL compatibility, but normalize identifiers for stable rendering.
      const src = `/${VIDEO_ROOT}/${folderName}/${fileName}`;
      const id = `${niche}/${fileName}`.toLowerCase();

      return {
        id,
        title: toTitleCase(baseName),
        src,
        fileName,
      };
    });

  return {
    niche,
    folderName,
    videos,
  };
}
