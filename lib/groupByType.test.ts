import { describe, it, expect } from "vitest";
import { groupByType } from "./groupByType";

function makeEntry(type: string, id = "1") {
  return { id, mediaItem: { type } };
}

describe("groupByType", () => {
  it("returns empty array for no entries", () => {
    expect(groupByType([])).toEqual([]);
  });

  it("groups entries by media type", () => {
    const entries = [makeEntry("MOVIE", "1"), makeEntry("BOOK", "2"), makeEntry("MOVIE", "3")];
    const groups = groupByType(entries);
    expect(groups).toHaveLength(2);
    expect(groups[0].type).toBe("MOVIE");
    expect(groups[0].entries).toHaveLength(2);
    expect(groups[1].type).toBe("BOOK");
    expect(groups[1].entries).toHaveLength(1);
  });

  it("includes label and icon for each group", () => {
    const entries = [makeEntry("TV_SHOW", "1")];
    const groups = groupByType(entries);
    expect(groups[0].label).toBe("TV Show");
    expect(groups[0].icon).toBe("📺");
  });

  it("preserves MEDIA_TYPES order", () => {
    const entries = [makeEntry("AUDIOBOOK", "1"), makeEntry("MOVIE", "2"), makeEntry("VIDEO_GAME", "3")];
    const groups = groupByType(entries);
    expect(groups.map((g) => g.type)).toEqual(["MOVIE", "AUDIOBOOK", "VIDEO_GAME"]);
  });

  it("omits types with no entries", () => {
    const entries = [makeEntry("BOOK", "1")];
    const groups = groupByType(entries);
    expect(groups).toHaveLength(1);
    expect(groups[0].type).toBe("BOOK");
  });
});
