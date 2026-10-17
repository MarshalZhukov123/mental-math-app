import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import { applyLevelProgress, readLevelProgress, readDailyStreak, readTotalStars, recordDailyActivity, resetDailyStreak, resetLevelProgress } from "./progression";

export default function Map() {

    const [levels, setLevels] = useState([
        // Addition
        { num: 1, branch: "A", subtopic: "One-Digit Addition", stars: 0, isBoss: false, isCurrent: 1 },
        { num: 2, branch: "A", subtopic: "One-Digit and Two-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 3, branch: "A", subtopic: "One-Digit and Two-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 4, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 5, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "A", subtopic: "Two-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "A", subtopic: "Two-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "A", subtopic: "Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "A", subtopic: "Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "A", subtopic: "Three-Digit Addition", stars: 0, isBoss: true, isCurrent: 2 },

        // Subtraction
        { num: 1, branch: "S", subtopic: "One-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 1 },
        { num: 2, branch: "S", subtopic: "One-Digit and Two-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 3, branch: "S", subtopic: "One-Digit and Two-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 4, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 5, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "S", subtopic: "Two-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "S", subtopic: "Two-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, isBoss: true, isCurrent: 2 },

        // Multiplication
        { num: 1, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 1 },
        { num: 2, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 3, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 4, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 5, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, isBoss: true, isCurrent: 2 },

        // Division
        { num: 1, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 1 },
        { num: 2, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 3, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 4, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 5, branch: "D", subtopic: "Division", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "D", subtopic: "Division", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "D", subtopic: "Division", stars: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "D", subtopic: "Division", stars: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "D", subtopic: "Division", stars: 0, isBoss: true, isCurrent: 2 },
    ]);
    const [streak, setStreak] = useState(readDailyStreak);
    const [totalStars, setTotalStars] = useState(readTotalStars);
    const [showResetConfirmation, setShowResetConfirmation] = useState(false);

    useEffect(() => {
        setLevels((currentLevels) => applyLevelProgress(currentLevels, readLevelProgress()));
        setStreak(recordDailyActivity());
        setTotalStars(readTotalStars());
    }, []);

    const [selectedLevel, setSelectedLevel] = useState(null);

    const navigate = useNavigate();
    const handleLevelClick = () => {
        navigate(`/level/${selectedLevel.branch}/${selectedLevel.num}`);
    };
    const handleResetStats = () => {
        resetLevelProgress();
        setStreak(resetDailyStreak());
        setTotalStars(0);
        setLevels((currentLevels) => applyLevelProgress(currentLevels, { results: {}, unlockedByBranch: {} }));
        setSelectedLevel(null);
        setShowResetConfirmation(false);
    };

    return (
        <div>
            <h1 className="text-3xl text-primary font-bold ml-4">Map</h1>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                <div>
                    <h2 className="text-lg text-accent font-semibold">Welcome, [username]!</h2>
                    <p className="text-sm opacity-70">Choose a level to continue your practice.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <div className="tooltip" data-tip={`Longest streak: ${streak.longestStreak} days`}>
                        <span className="badge badge-secondary h-10 px-3 font-semibold" aria-label={`${streak.currentStreak} day streak`}>
                            <span aria-hidden="true">🔥</span> {streak.currentStreak} day{streak.currentStreak === 1 ? "" : "s"}
                        </span>
                    </div>
                    <span className="badge badge-warning h-10 px-3 font-semibold" aria-label={`${totalStars} stars earned`}>
                        {totalStars} <span aria-hidden="true">★</span>
                    </span>
                    <button className="btn btn-outline btn-sm" onClick={() => setShowResetConfirmation(true)}>Reset stats</button>
                </div>
            </div>
            <hr className="m-2 border-primary" />
            <LevelSection title="Addition" levels={levels.slice(0, 20)} setSelectedLevel={setSelectedLevel} />
            <LevelSection title="Subtraction" levels={levels.slice(20, 40)} setSelectedLevel={setSelectedLevel} />
            <LevelSection title="Multiplication" levels={levels.slice(40, 60)} setSelectedLevel={setSelectedLevel} />
            <LevelSection title="Division" levels={levels.slice(60, 80)} setSelectedLevel={setSelectedLevel} />

            {selectedLevel && (
                <dialog id="my_modal_2" className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex justify-between">
                            <h3 className="flex font-bold text-lg">Level {selectedLevel.branch}{selectedLevel.num}{selectedLevel.isBoss ? <p className="ml-3 text-error font-bold">[BOSS]</p> : ''}</h3>
                            <span className="text-yellow-400" aria-label={`${selectedLevel.stars} stars`}>
                                {"★".repeat(selectedLevel.stars)}
                            </span>
                        </div>
                        <hr />
                        <p className="py-2">{selectedLevel.subtopic}</p>
                        <div className="flex justify-end">
                            <button className="btn btn-primary" disabled={selectedLevel.isCurrent === 2} onClick={handleLevelClick}>
                                {selectedLevel.isCurrent === 2 ? 'LOCKED' : selectedLevel.isCurrent === 1 ? 'PLAY' : 'REPLAY'}
                            </button>
                        </div>

                    </div>

                    <form method="dialog" className="modal-backdrop" onClick={() => setSelectedLevel(null)}>
                        <button>close</button>
                    </form>
                </dialog>
            )}

            {showResetConfirmation && (
                <div className="modal modal-open" role="dialog" aria-modal="true" aria-labelledby="reset-stats-title">
                    <div className="modal-box">
                        <h3 id="reset-stats-title" className="text-lg font-bold">Reset all stats?</h3>
                        <p className="py-4">This clears earned stars, level unlocks, and your daily streak. This cannot be undone.</p>
                        <div className="modal-action">
                            <button className="btn btn-ghost" onClick={() => setShowResetConfirmation(false)}>Cancel</button>
                            <button className="btn btn-error" onClick={handleResetStats}>Reset stats</button>
                        </div>
                    </div>
                    <button className="modal-backdrop" aria-label="Cancel reset" onClick={() => setShowResetConfirmation(false)} />
                </div>
            )}
        </div>
    )
}

function LevelSection({ title, levels, setSelectedLevel }) {
    return (
        <section className="mt-6 px-4 sm:px-6">
            <div className="mb-3 flex items-baseline justify-between border-b border-base-300 pb-2">
                <h2 className="text-lg font-semibold text-secondary">{title}</h2>
                <span className="text-xs opacity-60">{levels.length} levels</span>
            </div>
            <div className="grid grid-cols-5 gap-2 sm:grid-cols-10 xl:grid-cols-20">
                {levels.map((level) => (
                    <Level key={`${level.branch}-${level.num}`} level={level} setSelectedLevel={setSelectedLevel} />
                ))}
            </div>
        </section>
    );
}

function Level({ level, setSelectedLevel }) {
    const { num, branch, subtopic, stars, isBoss, isCurrent } = level;
    const style = isCurrent === 2
        ? "btn-ghost opacity-45"
        : isCurrent === 1
            ? "btn-primary ring-2 ring-accent ring-offset-2"
            : stars > 0
                ? "btn-success"
                : "btn-outline";

    return (
        <button
            type="button"
            data-tip={subtopic}
            aria-label={`Level ${branch}${num}${isBoss ? ", boss level" : ""}, ${stars} stars${isCurrent === 2 ? ", locked" : ""}`}
            title={`${subtopic}${isBoss ? " · Boss level" : ""}`}
            className={`tooltip btn btn-square relative h-11 min-h-11 w-11 p-0 ${style} ${isBoss ? "border-2 border-error" : "border border-base-300"}`}
            onClick={() => setSelectedLevel(level)}
        >
            <span className="text-sm font-semibold">{num}</span>
            <span className="absolute bottom-0.5 text-[9px] leading-none text-warning-content">
                {stars > 0 ? "★".repeat(stars) : isCurrent === 1 ? "NOW" : isBoss ? "BOSS" : ""}
            </span>
        </button>
    )
}