const STORAGE_KEY = "mentalMathLevelProgress";
const STREAK_STORAGE_KEY = "mentalMathDailyStreak";
const DUNGEON_STORAGE_KEY = "mentalMathDungeonProgress";
const DEFAULT_HIGHEST_UNLOCKED = 1;

export const EMPTY_STREAK = {
    currentStreak: 0,
    longestStreak: 0,
    lastActiveDate: null,
};

export function readLevelProgress() {
    if (typeof window === "undefined") {
        return { results: {}, unlockedByBranch: {} };
    }

    try {
        const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "{}");
        return {
            results: saved.results || {},
            unlockedByBranch: saved.unlockedByBranch || {},
        };
    } catch {
        return { results: {}, unlockedByBranch: {} };
    }
}

export function isLevelUnlocked(progress, branch, num) {
    const highestUnlocked = Math.max(
        Number(progress.unlockedByBranch[branch]) || 0,
        DEFAULT_HIGHEST_UNLOCKED,
    );
    return Number(num) <= highestUnlocked;
}

export function completeLevel(branch, num, stars) {
    const progress = readLevelProgress();
    const levelNumber = Number(num);
    const key = `${branch}-${levelNumber}`;
    const previous = progress.results[key] || { stars: 0 };
    const bestStars = Math.max(previous.stars, stars);

    progress.results[key] = { stars: bestStars };
    progress.unlockedByBranch[branch] = Math.max(
        Number(progress.unlockedByBranch[branch]) || DEFAULT_HIGHEST_UNLOCKED,
        levelNumber + 1,
    );

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

export function resetLevelProgress() {
    window.localStorage.removeItem(STORAGE_KEY);
    window.localStorage.removeItem(DUNGEON_STORAGE_KEY);
}

export function readDungeonProgress() {
    if (typeof window === "undefined") {
        return { stars: 0, completed: [], runs: {} };
    }

    try {
        const saved = JSON.parse(window.localStorage.getItem(DUNGEON_STORAGE_KEY) || "{}");
        return {
            stars: Number(saved.stars) || 0,
            completed: Array.isArray(saved.completed) ? saved.completed : [],
            runs: saved.runs && typeof saved.runs === "object" ? saved.runs : {},
        };
    } catch {
        return { stars: 0, completed: [], runs: {} };
    }
}

export function saveDungeonProgress(progress) {
    window.localStorage.setItem(DUNGEON_STORAGE_KEY, JSON.stringify(progress));
}

export function readTotalStars() {
    const levelStars = Object.values(readLevelProgress().results)
        .reduce((total, result) => total + (Number(result.stars) || 0), 0);
    return levelStars + readDungeonProgress().stars;
}

export function readDailyStreak() {
    if (typeof window === "undefined") return EMPTY_STREAK;

    try {
        const saved = JSON.parse(window.localStorage.getItem(STREAK_STORAGE_KEY) || "{}");
        return {
            currentStreak: Number(saved.currentStreak) || 0,
            longestStreak: Number(saved.longestStreak) || 0,
            lastActiveDate: saved.lastActiveDate || null,
        };
    } catch {
        return EMPTY_STREAK;
    }
}

function getLocalDateKey(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}

export function recordDailyActivity(date = new Date()) {
    const previous = readDailyStreak();
    const today = getLocalDateKey(date);
    if (previous.lastActiveDate === today) return previous;

    const dayGap = previous.lastActiveDate
        ? (Date.parse(`${today}T00:00:00Z`) - Date.parse(`${previous.lastActiveDate}T00:00:00Z`)) / 86400000
        : 0;
    const currentStreak = dayGap === 1 ? previous.currentStreak + 1 : 1;
    const streak = {
        currentStreak,
        longestStreak: Math.max(previous.longestStreak, currentStreak),
        lastActiveDate: today,
    };

    window.localStorage.setItem(STREAK_STORAGE_KEY, JSON.stringify(streak));
    return streak;
}

export function resetDailyStreak() {
    window.localStorage.removeItem(STREAK_STORAGE_KEY);
    return EMPTY_STREAK;
}

export function applyLevelProgress(levels, progress) {
    return levels.map((level) => {
        const result = progress.results[`${level.branch}-${level.num}`];
        const isUnlocked = isLevelUnlocked(progress, level.branch, level.num);
        return {
            ...level,
            stars: result?.stars || 0,
            isCurrent: !isUnlocked ? 2 : level.num === Math.max(
                Number(progress.unlockedByBranch[level.branch]) || 0,
                DEFAULT_HIGHEST_UNLOCKED,
            ) ? 1 : 0,
        };
    });
}