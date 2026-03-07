import { MEDIA_TYPE_LABELS, MEDIA_TYPE_ICONS } from "@/lib/utils";

export interface GroupableEntry {
  mediaItem: { type: string };
}

export interface TypeGroup<T extends GroupableEntry> {
  type: string;
  label: string;
  icon: string;
  entries: T[];
}

const MEDIA_TYPES = ["MOVIE", "TV_SHOW", "BOOK", "AUDIOBOOK", "VIDEO_GAME"];

export function groupByType<T extends GroupableEntry>(entries: T[]): TypeGroup<T>[] {
  return MEDIA_TYPES.flatMap((type) => {
    const filtered = entries.filter((e) => e.mediaItem.type === type);
    if (filtered.length === 0) return [];
    return [{ type, label: MEDIA_TYPE_LABELS[type], icon: MEDIA_TYPE_ICONS[type], entries: filtered }];
  });
}
