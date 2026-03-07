"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MediaCard } from "@/components/media/MediaCard";
import { MediaDetailDialog } from "@/components/media/MediaDetailDialog";
import { groupByType } from "@/lib/groupByType";

interface DashboardEntry {
  id: string;
  status: string;
  rating: number | null;
  reviewText: string | null;
  isPublic: boolean;
  mediaItem: {
    id: string;
    externalId: string;
    source: string;
    title: string;
    year: number | null;
    posterUrl: string | null;
    overview: string | null;
    genres: string[];
    type: string;
    metadata: Record<string, unknown>;
  };
}

interface Selected {
  source: string;
  externalId: string;
  type: string;
  initialItem: { title: string; year: number | null; posterUrl: string | null; overview: string | null; genres: string[]; metadata: Record<string, unknown> };
  initialEntry: { id: string; status: string; rating: number | null; reviewText: string | null; isPublic: boolean };
}

interface DashboardSectionsProps {
  inProgress: DashboardEntry[];
  wantToConsume: DashboardEntry[];
  recentCompleted: DashboardEntry[];
}

export function DashboardSections({ inProgress, wantToConsume, recentCompleted }: DashboardSectionsProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<Selected | null>(null);

  function select(entry: DashboardEntry) {
    setSelected({
      source: entry.mediaItem.source,
      externalId: entry.mediaItem.externalId,
      type: entry.mediaItem.type,
      initialItem: {
        title: entry.mediaItem.title,
        year: entry.mediaItem.year,
        posterUrl: entry.mediaItem.posterUrl,
        overview: entry.mediaItem.overview,
        genres: entry.mediaItem.genres,
        metadata: entry.mediaItem.metadata,
      },
      initialEntry: {
        id: entry.id,
        status: entry.status,
        rating: entry.rating,
        reviewText: entry.reviewText,
        isPublic: entry.isPublic,
      },
    });
  }

  function renderGrid(entries: DashboardEntry[]) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
        {entries.map((entry) => (
          <MediaCard
            key={entry.id}
            id={entry.mediaItem.id}
            title={entry.mediaItem.title}
            year={entry.mediaItem.year}
            posterUrl={entry.mediaItem.posterUrl}
            mediaType={entry.mediaItem.type}
            status={entry.status}
            rating={entry.rating}
            onClick={() => select(entry)}
          />
        ))}
      </div>
    );
  }

  function renderGroupedSection(title: string, entries: DashboardEntry[]) {
    const groups = groupByType(entries);
    if (groups.length === 0) return null;
    return (
      <section>
        <h2 className="text-lg font-semibold text-zinc-900 mb-3">{title}</h2>
        <div className="flex flex-col gap-6">
          {groups.map((group) => (
            <div key={group.type}>
              <h3 className="text-sm font-medium text-zinc-500 mb-2">
                {group.icon} {group.label}
              </h3>
              {renderGrid(group.entries)}
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      {renderGroupedSection("Currently consuming", inProgress)}
      {renderGroupedSection("Want to consume", wantToConsume)}
      {renderGroupedSection("Recently completed", recentCompleted)}

      {selected && (
        <MediaDetailDialog
          key={`${selected.source}-${selected.externalId}`}
          source={selected.source}
          externalId={selected.externalId}
          type={selected.type}
          initialItem={selected.initialItem}
          initialEntry={selected.initialEntry}
          open={!!selected}
          onClose={() => setSelected(null)}
          onSuccess={() => {
            setSelected(null);
            router.refresh();
          }}
        />
      )}
    </>
  );
}
