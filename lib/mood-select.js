import {
  FOLDER_TO_MOOD,
  TIME_BIN_ORDER,
  TIME_TO_SET,
  nightSet1,
  dawnSet2,
  daySet3,
  sunsetSet4,
  afternoonSet5,
  MOOD_FALLBACKS,
  MAX_IMAGES_PER_SET,
} from "./mood-config";

export { FOLDER_TO_MOOD, TIME_BIN_ORDER, TIME_TO_SET };

/** @param {number} progress */
export function getTimeSlotFromProgress(progress) {
  const p = Math.max(0, Math.min(1, Number(progress) || 0));
  return TIME_BIN_ORDER[Math.min(4, Math.floor(p * 5))];
}

/** @param {import('./mood-config').TimeSlot} time */
function getSet(time) {
  switch (time) {
    case "night": return nightSet1;
    case "dawn": return dawnSet2;
    case "day": return daySet3;
    case "sunset": return sunsetSet4;
    case "afternoon": return afternoonSet5;
    default: return daySet3;
  }
}

/** @param {import('./mood-config').ColorMood} mood */
export function pickFolderFromMood(mood) {
  for (const k of Object.keys(FOLDER_TO_MOOD)) if (FOLDER_TO_MOOD[k] === mood) return Number(k);
  const chain = MOOD_FALLBACKS[mood] || [];
  for (const alt of chain) for (const k of Object.keys(FOLDER_TO_MOOD)) if (FOLDER_TO_MOOD[k] === alt) return Number(k);
  return 3;
}

/**
 * @param {import('./mood-config').TimeSlot} time
 * @param {import('./mood-config').ColorMood} mood
 */
export function pickImageForTimeAndMood(time, mood) {
  const set = getSet(time);
  const exact = set.find((m) => m.colorMood === mood);
  if (exact) return exact;
  const chain = MOOD_FALLBACKS[mood] || [];
  for (const alt of chain) {
    const hit = set.find((m) => m.colorMood === alt);
    if (hit) return hit;
  }
  return set[0] || { id: `${TIME_TO_SET[time] || 3}-2`, time, weather: "clear", colorMood: mood, tags: [] };
}

/** @param {string} name */
export function chooseWeatherFromName(name = "") {
  const s = name.toLowerCase();
  if (/rain|wet|drizzle/.test(s)) return "rainy";
  if (/snow|flake/.test(s)) return "snowy";
  if (/fog|mist|haze|smog/.test(s)) return "foggy";
  if (/cloud/.test(s)) return "cloudy";
  return "clear";
}

/** @param {import('./mood-config').TimeSlot} time @param {number} idx */
export function buildGenimgId(time, idx = 2) {
  const setIdx = TIME_TO_SET[time] || 3;
  return `${setIdx}-${idx}`;
}
export function buildTvUrl(time, idx = 2) {
  return `/genimg/${buildGenimgId(time, idx)}.png`;
}

/** @param {import('./mood-config').TimeSlot} time */
export function buildRandomGenimgUrlForTime(time) {
  const setIdx = TIME_TO_SET[time] || 3;
  const max = MAX_IMAGES_PER_SET[setIdx] || 10;
  const k = Math.floor(Math.random() * max) + 1; // 1..max
  return `/genimg/${setIdx}-${k}.png`;
}

/**
 * Pick image matching time + mood + optional weather
 * @param {import('./mood-config').TimeSlot} time
 * @param {import('./mood-config').ColorMood} mood
 * @param {import('./mood-config').WeatherType} [weather]
 */
export function pickImageForTimeMoodWeather(time, mood, weather) {
  const set = getSet(time);
  const chain = [mood, ...((MOOD_FALLBACKS[mood] || []))];
  if (weather) {
    for (const m of chain) {
      const hit = set.find((img) => img.colorMood === m && img.weather === weather);
      if (hit) return hit;
    }
  }
  for (const m of chain) {
    const hit = set.find((img) => img.colorMood === m);
    if (hit) return hit;
  }
  return set[0] || null;
}

/**
 * Build recommended /genimg url for 3 selections
 * @param {import('./mood-config').TimeSlot} time
 * @param {import('./mood-config').ColorMood} mood
 * @param {import('./mood-config').WeatherType} weather
 */
export function buildUrlForSelection(time, mood, weather) {
  const chosen = pickImageForTimeMoodWeather(time, mood, weather);
  if (chosen && chosen.id) return `/genimg/${chosen.id}.png`;
  return buildRandomGenimgUrlForTime(time || "day");
}


