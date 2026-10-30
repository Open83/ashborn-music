// Single source of truth for page content and links.
// Copy marked "owner" was supplied by the artist. Lyric fragments are recorded verbatim in
// docs/creative/ASHBORN_ARTWORK_ACCEPTANCE_CRITERIA.md (section 3.1) and must not be altered.

import { resolveSiteUrl } from "./site-url.js";

export const site = {
  artist: "ASHBORN",
  track: "MARATHON",
  title: "ASHBORN — MARATHON | Official Release",
  description:
    "MARATHON, the debut single by ASHBORN, is out now on Spotify, Apple Music and YouTube. Some distances stay with you.",
  // Production origin: from NEXT_PUBLIC_SITE_URL, or on Vercel from VERCEL_PROJECT_PRODUCTION_URL (see lib/site-url.js).
  // With neither, canonical, og:url and absolute social-preview image URLs are omitted. No domain is invented.
  url: resolveSiteUrl(),
  // Instagram profile supplied by the owner on 2026-10-30, stored without the share-tracking parameter (?rpxt=…).
  // Its bio reads "Ashborn" and links to Spotify, but ownership has not been independently verified.
  instagram: "https://www.instagram.com/_sureshbhandari_",
};

export const hero = {
  descriptor: "DEBUT SINGLE · OUT NOW", // owner
  support: "Some distances stay with you.", // owner
  primary: "LISTEN TO MARATHON", // owner
  secondary: "EXPLORE THE STORY", // owner
  image: {
    width: 1145,
    height: 1374,
    alt: "A young man runs away along a wet, broken road beneath a huge shattered clock. Its hands and fragments hang in the sky, threads and torn cloth trail behind him, and the sun sets over a distant city.",
  },
};

// owner: the central message
export const message = {
  lead: "You spent your whole life running.",
  middle: ["Somewhere along the way,", "you lost the person you wanted to reach."],
  close: ["And even after everything broke,", "a part of you kept holding on."],
};

// Selected fragments, exactly as supplied. `lang` marks romanised Hindi (hi-Latn) or English.
export const lyrics = [
  { lang: "hi-Latn", lines: ["Bhaga hu mai puri life jese marathon"] },
  { lang: "hi-Latn", lines: ["Ye list bhale teri per ye shuru mere naam se"] },
  { lang: "en", lines: ["And I'm married to the game", "But she want to be together"] },
  { lang: "hi-Latn", lines: ["Kitne mafiname likhe mai ne tere naam pe"] },
];

// Official release links, exactly as supplied.
export const platforms = [
  { id: "spotify", name: "Spotify", url: "https://open.spotify.com/album/3kehhL89TDz0Q4PdQqay7W" },
  { id: "apple", name: "Apple Music", url: "https://music.apple.com/in/album/marathon-single/6827332319" },
  { id: "youtube", name: "YouTube", url: "https://youtu.be/MlyVV1kXXsE" },
];

// owner
export const closing = "Some things don't leave. They just become part of the distance.";
