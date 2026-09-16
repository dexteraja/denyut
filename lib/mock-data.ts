import type { Interest, Video, VideoAuthor, Comment, UserProfile } from "./types";

export const INTERESTS: Interest[] = [
  { slug: "hewan-peliharaan", label: "Hewan Peliharaan", emoji: "🐱" },
  { slug: "komedi", label: "Komedi", emoji: "😂" },
  { slug: "otomotif", label: "Otomotif", emoji: "🏍️" },
  { slug: "kuliner", label: "Kuliner", emoji: "🍜" },
  { slug: "musik", label: "Musik", emoji: "🎧" },
  { slug: "olahraga", label: "Olahraga", emoji: "⚽" },
  { slug: "fashion", label: "Fashion", emoji: "👗" },
  { slug: "gaming", label: "Gaming", emoji: "🎮" },
  { slug: "travel", label: "Travel", emoji: "🧳" },
  { slug: "edukasi", label: "Edukasi", emoji: "📚" },
  { slug: "seni", label: "Seni & Kerajinan", emoji: "🎨" },
  { slug: "kecantikan", label: "Kecantikan", emoji: "💄" },
];

const AUTHORS: VideoAuthor[] = [
  { id: "u1", username: "kucing.gemoy", name: "Kucing Gemoy Official", avatarUrl: "https://i.pravatar.cc/150?img=47", followerCount: 284000 },
  { id: "u2", username: "bang_reza", name: "Reza Automotif", avatarUrl: "https://i.pravatar.cc/150?img=12", followerCount: 91200 },
  { id: "u3", username: "dapurmama", name: "Dapur Mama Nita", avatarUrl: "https://i.pravatar.cc/150?img=32", followerCount: 512000 },
  { id: "u4", username: "komedi.receh", name: "Receh Comedy", avatarUrl: "https://i.pravatar.cc/150?img=8", followerCount: 1200000 },
  { id: "u5", username: "sarahtraveling", name: "Sarah Jalan-Jalan", avatarUrl: "https://i.pravatar.cc/150?img=25", followerCount: 76500 },
  { id: "u6", username: "beatmaker.id", name: "Beatmaker ID", avatarUrl: "https://i.pravatar.cc/150?img=15", followerCount: 43200 },
  { id: "u7", username: "gamer_senja", name: "Senja Gaming", avatarUrl: "https://i.pravatar.cc/150?img=51", followerCount: 158000 },
  { id: "u8", username: "putri.artsy", name: "Putri Artsy", avatarUrl: "https://i.pravatar.cc/150?img=45", followerCount: 29800 },
  { id: "u9", username: "fitclub.jkt", name: "FitClub Jakarta", avatarUrl: "https://i.pravatar.cc/150?img=33", followerCount: 67300 },
  { id: "u10", username: "glowupwithme", name: "Glow Up With Me", avatarUrl: "https://i.pravatar.cc/150?img=23", followerCount: 203000 },
];

// Sample video sources — vertical (9:16) test clips from free stock sites
// Using reliable CDN URLs that serve vertical MP4s
const SAMPLE_SOURCES = [
  "https://assets.mixkit.co/videos/preview/mixkit-woman-walking-in-the-forest-31848-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-girl-dancing-in-the-rain-31956-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-jumping-in-the-air-at-sunset-31856-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-enjoying-the-sunset-at-the-beach-31952-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-person-walking-in-the-forest-slow-motion-31847-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-young-woman-dancing-in-the-street-31957-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-surfing-on-a-wave-31870-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-doing-yoga-at-sunrise-31862-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-couple-walking-on-the-beach-at-sunset-31949-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-running-in-the-mountains-31855-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-reading-a-book-in-a-park-31943-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-person-drinking-coffee-in-a-cafe-31941-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-man-playing-guitar-on-the-street-31937-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-taking-photos-with-phone-31935-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-group-of-friends-laughing-together-31930-large.mp4",
];

const GRADIENTS = [
  "from-violet-600 via-fuchsia-600 to-rose-500",
  "from-cyan-500 via-blue-600 to-indigo-700",
  "from-amber-400 via-orange-500 to-rose-600",
  "from-emerald-500 via-teal-600 to-cyan-700",
  "from-pink-500 via-rose-600 to-red-600",
  "from-lime-400 via-emerald-500 to-teal-600",
];

type VideoSeed = {
  caption: string;
  hashtags: string[];
  interestSlugs: string[];
  authorIdx: number;
};

const VIDEO_SEEDS: VideoSeed[] = [
  { caption: "POV: kucingmu minta makan jam 5 pagi 😹🐾", hashtags: ["kucinglucu", "petsoftiktok", "gemoy"], interestSlugs: ["hewan-peliharaan", "komedi"], authorIdx: 0 },
  { caption: "Modifikasi CBR ini beneran gila sih, budget cuma segini!", hashtags: ["motovlog", "modifikasi", "cbr"], interestSlugs: ["otomotif"], authorIdx: 1 },
  { caption: "Resep rendang 3 jam yang bikin nagih, anti gagal!", hashtags: ["resepmasakan", "rendang", "kuliner"], interestSlugs: ["kuliner"], authorIdx: 2 },
  { caption: "Ekspektasi vs realita kerja WFH minggu ini 💀", hashtags: ["receh", "wfh", "relate"], interestSlugs: ["komedi"], authorIdx: 3 },
  { caption: "3 hari di Labuan Bajo, ini itinerary hemat versi aku", hashtags: ["travel", "labuanbajo", "itinerary"], interestSlugs: ["travel"], authorIdx: 4 },
  { caption: "Bikin beat lofi dari suara hujan, hasilnya di luar dugaan", hashtags: ["lofi", "beatmaking", "musikindie"], interestSlugs: ["musik"], authorIdx: 5 },
  { caption: "Clutch 1v4 di ranked, tangan masih gemetar 😭", hashtags: ["mobilelegends", "clutch", "gaming"], interestSlugs: ["gaming"], authorIdx: 6 },
  { caption: "Proses lukis wajah realis pakai cat akrilik, 6 jam jadi", hashtags: ["seni", "akrilik", "prosesberkarya"], interestSlugs: ["seni"], authorIdx: 7 },
  { caption: "Home workout 15 menit, ga perlu gym ga perlu alat", hashtags: ["homeworkout", "fitness", "sehat"], interestSlugs: ["olahraga"], authorIdx: 8 },
  { caption: "Skincare routine malam buat kulit kusam, murah meriah", hashtags: ["skincare", "glowup", "beautytips"], interestSlugs: ["kecantikan"], authorIdx: 9 },
  { caption: "Anak kucing baru ketemu cermin pertama kali, reaksinya!", hashtags: ["kucinglucu", "kittens", "fyp"], interestSlugs: ["hewan-peliharaan"], authorIdx: 0 },
  { caption: "Drift pertama kali nyoba, hasil... lumayan ancur 😂", hashtags: ["drift", "otomotif", "gagal"], interestSlugs: ["otomotif", "komedi"], authorIdx: 1 },
  { caption: "Street food Jogja jam 2 pagi, worth it banget!", hashtags: ["streetfood", "jogja", "kulineran"], interestSlugs: ["kuliner", "travel"], authorIdx: 2 },
  { caption: "Kalau bos WA jam 11 malam tuh rasanya...", hashtags: ["receh", "kerja", "kantorlife"], interestSlugs: ["komedi"], authorIdx: 3 },
  { caption: "Naik gunung sendirian, ini yang aku pelajari", hashtags: ["hiking", "soloTravel", "gunung"], interestSlugs: ["travel", "edukasi"], authorIdx: 4 },
  { caption: "Cover lagu daerah versi elektronik, worth listen!", hashtags: ["musiktradisional", "remix", "cover"], interestSlugs: ["musik"], authorIdx: 5 },
  { caption: "Setup gaming 5 juta an, worth it apa nggak?", hashtags: ["setupgaming", "pcbuild", "gaming"], interestSlugs: ["gaming"], authorIdx: 6 },
  { caption: "Belajar teknik pointilis dari nol, sabar itu kunci", hashtags: ["pointilis", "belajarSeni", "artprocess"], interestSlugs: ["seni", "edukasi"], authorIdx: 7 },
  { caption: "Outfit kondangan budget 200rb, tetep kelihatan mahal", hashtags: ["ootd", "fashiontips", "budgetfriendly"], interestSlugs: ["fashion"], authorIdx: 9 },
  { caption: "Fun fact fisika yang jarang orang tahu, mind blown", hashtags: ["faktaunik", "sains", "edukasi"], interestSlugs: ["edukasi"], authorIdx: 8 },
];

function seededRandom(seed: number) {
  let value = seed;
  return () => {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}

function buildVideos(): Video[] {
  const rand = seededRandom(42);
  return VIDEO_SEEDS.map((seed, i) => {
    const author = AUTHORS[seed.authorIdx];
    const viewCount = Math.floor(8000 + rand() * 4_800_000);
    const likeRatio = 0.06 + rand() * 0.18;
    const likeCount = Math.floor(viewCount * likeRatio);
    const isViralPick = viewCount > 2_000_000;
    return {
      id: `v${i + 1}`,
      caption: seed.caption,
      hashtags: seed.hashtags,
      interestSlugs: seed.interestSlugs,
      playbackUrl: SAMPLE_SOURCES[i % SAMPLE_SOURCES.length],
      thumbnailUrl: "",
      posterColor: GRADIENTS[i % GRADIENTS.length],
      durationSec: Math.floor(18 + rand() * 90),
      author,
      viewCount,
      likeCount,
      commentCount: Math.floor(likeCount * (0.02 + rand() * 0.05)),
      shareCount: Math.floor(likeCount * (0.01 + rand() * 0.03)),
      bookmarkCount: Math.floor(likeCount * (0.03 + rand() * 0.08)),
      viralScore: viewCount / 100000 + likeCount / 10000,
      createdAt: new Date(Date.now() - i * 3600_000 * rand() * 48).toISOString(),
      isViralPick,
    };
  });
}

export const VIDEOS: Video[] = buildVideos();

export function getViralVideos(limit = 6): Video[] {
  return [...VIDEOS].sort((a, b) => b.viralScore - a.viralScore).slice(0, limit);
}

export function getVideosByInterests(slugs: string[]): Video[] {
  if (slugs.length === 0) return VIDEOS;
  return VIDEOS.filter((v) => v.interestSlugs.some((s) => slugs.includes(s)));
}

export function getVideosByHashtag(tag: string): Video[] {
  const lowerTag = tag.toLowerCase();
  return VIDEOS.filter((v) => v.hashtags.some((h) => h.toLowerCase() === lowerTag));
}

const COMMENT_SEEDS = [
  "wkwkwk relate banget ini 😂",
  "keren banget prosesnya!",
  "izin save ya kak buat referensi",
  "ini di mana kak lokasinya?",
  "suara aslinya enak bgt buat lofi",
  "gemesin bgt anjay 🥹",
  "tutorial lengkapnya ada gak kak?",
  "auto follow abis liat ini",
  "ini sound apa ya buat backsoundnya",
  "real hardworkers pay off 🔥",
];

export function getCommentsForVideo(videoId: string): Comment[] {
  const rand = seededRandom(videoId.length * 7 + 13);
  const count = 4 + Math.floor(rand() * 5);
  return Array.from({ length: count }).map((_, i) => {
    const author = AUTHORS[Math.floor(rand() * AUTHORS.length)];
    return {
      id: `${videoId}-c${i}`,
      videoId,
      author: { username: author.username, avatarUrl: author.avatarUrl, name: author.name },
      text: COMMENT_SEEDS[Math.floor(rand() * COMMENT_SEEDS.length)],
      createdAt: new Date(Date.now() - i * 1800_000).toISOString(),
      likeCount: Math.floor(rand() * 340),
    };
  });
}

export function getUserProfile(username: string): UserProfile | null {
  const author = AUTHORS.find((a) => a.username === username);
  if (!author) return null;
  const videos = VIDEOS.filter((v) => v.author.id === author.id);
  return {
    id: author.id,
    username: author.username,
    name: author.name,
    bio: "Bikin konten random tiap hari 🎬 | kolab DM aja",
    avatarUrl: author.avatarUrl,
    followerCount: author.followerCount,
    followingCount: Math.floor(author.followerCount * 0.02) + 40,
    likeCount: videos.reduce((sum, v) => sum + v.likeCount, 0),
    videos,
  };
}

export function getAllAuthors(): VideoAuthor[] {
  return AUTHORS;
}
