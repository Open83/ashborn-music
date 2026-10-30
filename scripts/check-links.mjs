// Confirms the three listening links are exactly the supplied URLs and that each one resolves to MARATHON.
import { platforms } from "../lib/site.js";

const supplied = {
  spotify: "https://open.spotify.com/album/3kehhL89TDz0Q4PdQqay7W",
  apple: "https://music.apple.com/in/album/marathon-single/6827332319",
  youtube: "https://youtu.be/MlyVV1kXXsE",
};

const get = async (url, init) => {
  const res = await fetch(url, { redirect: "follow", headers: { "user-agent": "Mozilla/5.0 (link-check)" }, ...init });
  return { status: res.status, finalUrl: res.url, text: await res.text() };
};

let failed = false;
const report = (id, ok, detail) => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${id.padEnd(8)} ${detail}`);
  if (!ok) failed = true;
};

for (const p of platforms) {
  report(p.id + " url", p.url === supplied[p.id], p.url === supplied[p.id] ? "exactly as supplied" : `differs from supplied: ${p.url}`);
}

try {
  const o = await get(`https://open.spotify.com/oembed?url=${encodeURIComponent(supplied.spotify)}`);
  const j = JSON.parse(o.text);
  report("spotify", o.status === 200 && /marathon/i.test(j.title), `HTTP ${o.status}, title: ${j.title}`);
} catch (e) { report("spotify", false, String(e.message || e)); }

try {
  const o = await get(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(supplied.youtube)}`);
  const j = JSON.parse(o.text);
  report("youtube", o.status === 200 && /marathon/i.test(j.title), `HTTP ${o.status}, title: ${j.title}, channel: ${j.author_name}`);
} catch (e) { report("youtube", false, String(e.message || e)); }

try {
  const o = await get(supplied.apple);
  const title = (o.text.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "";
  report("apple", o.status === 200 && /marathon/i.test(title + o.text.slice(0, 20000)), `HTTP ${o.status}, title: ${title.trim()}`);
} catch (e) { report("apple", false, String(e.message || e)); }

process.exit(failed ? 1 : 0);
