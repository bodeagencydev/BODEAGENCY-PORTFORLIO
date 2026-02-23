import type { VideoItem } from '../data';

interface VideoCardProps {
  video: VideoItem;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm">
      <video
        className="h-auto w-full bg-black"
        controls
        preload="metadata"
        aria-label={video.title}
      >
        <source src={video.src} />
        Your browser does not support the video tag.
      </video>

      <div className="p-4">
        <h2 className="line-clamp-2 text-sm font-medium text-zinc-900 md:text-base">{video.title}</h2>
        <p className="mt-1 text-xs text-zinc-500">{video.fileName}</p>
      </div>
    </article>
  );
}
