export const VIDEO_ROOT = 'videos' as const;

export const SUPPORTED_VIDEO_EXTENSIONS = [
  '.mp4',
  '.webm',
  '.ogg',
  '.mov',
  '.m4v',
] as const;

export type SupportedVideoExtension = (typeof SUPPORTED_VIDEO_EXTENSIONS)[number];

export interface VideoItem {
  /**
   * Stable, lowercase identifier safe for React keys.
   */
  id: string;
  /**
   * Human-friendly label generated from the file name.
   */
  title: string;
  /**
   * Public URL used in the <video> source tag.
   */
  src: string;
  /**
   * Original file name from the filesystem.
   */
  fileName: string;
}

export interface NicheVideos {
  /**
   * Lowercase route segment requested by the user.
   */
  niche: string;
  /**
   * Folder name exactly as found on disk.
   */
  folderName: string;
  videos: VideoItem[];
}
