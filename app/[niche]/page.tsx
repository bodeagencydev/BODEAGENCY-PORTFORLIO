import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { VideoCard } from '../components/video-card';
import { getAllNiches, getVideosByNiche } from '../lib/videos';

interface NichePageProps {
  params: Promise<{ niche: string }>;
}

export const runtime = 'nodejs';

export async function generateStaticParams() {
  const niches = await getAllNiches();
  return niches.map((niche) => ({ niche }));
}

export async function generateMetadata({ params }: NichePageProps): Promise<Metadata> {
  const { niche } = await params;
  const data = await getVideosByNiche(niche);

  if (!data) {
    return {
      title: 'Niche Not Found',
      description: `No videos were found for the niche "${niche}".`,
    };
  }

  return {
    title: `${data.niche} videos`,
    description: `Browse ${data.videos.length} videos for the ${data.niche} niche.`,
  };
}

export default async function NichePage({ params }: NichePageProps) {
  const { niche } = await params;
  const data = await getVideosByNiche(niche);

  if (!data) {
    notFound();
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Niche</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950 md:text-4xl">
          {data.niche}
        </h1>
        <p className="mt-2 text-sm text-zinc-600">
          {data.videos.length} video{data.videos.length === 1 ? '' : 's'} found in{' '}
          <span className="font-medium">{data.folderName}</span>.
        </p>
      </header>

      {data.videos.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="Video list">
          {data.videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </section>
      ) : (
        <section className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-8 text-center">
          <p className="text-sm text-zinc-600">No video files found in this niche yet.</p>
        </section>
      )}
    </main>
  );
}
