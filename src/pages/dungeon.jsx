import { useState, useEffect, useRef } from "react";
import { readDungeonProgress, readLevelProgress, saveDungeonProgress } from "./progression";
import { canUnlockDungeon, createDungeonRun, DUNGEONS, getNeighbors, getReachableRoomKeys, getTreasureRewards, isDungeonComplete, roomKey } from "./dungeonModel";

// 'B' - boss room
// 'E' - enemy room
// 'S' - start point
// 'T' - treasure room
// '#' - not part of path

export default function Dungeon() {
    const [dungeonProgress, setDungeonProgress] = useState(() => {
        const saved = readDungeonProgress();
        if (!saved.runs["1"]) {
            return {
                ...saved,
                runs: { ...saved.runs, "1": createDungeonRun(DUNGEONS[0]) },
            };
        }
        return saved;
    });
    const [selectedDungeonId, setSelectedDungeonId] = useState(1);
    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [errCnt, setErrCnt] = useState(0);
    const [comboCnt, setComboCnt] = useState(0);
    const [runId, setRunId] = useState(0);
    const [lootMessage, setLootMessage] = useState("");

    const dungeon = DUNGEONS.find((item) => item.id === selectedDungeonId);
    const run = dungeonProgress.runs[String(dungeon.id)];
    const currentRoom = run.currentRoom;
    const [roomRow, roomColumn] = currentRoom.split("-").map(Number);
    const currentRoomEnemies = run.enemies[currentRoom] || [];
    const currentRoomHasEnemies = currentRoomEnemies.some((enemy) => enemy.health > 0);
    const isComplete = dungeonProgress.completed.includes(dungeon.id) || isDungeonComplete(dungeon, run);
    const totalStars = Object.values(readLevelProgress().results)
        .reduce((total, result) => total + (Number(result.stars) || 0), 0) + dungeonProgress.stars;
    const treasureRewards = getTreasureRewards(dungeon.layout);

    useEffect(() => {
        saveDungeonProgress(dungeonProgress);
    }, [dungeonProgress]);

    useEffect(() => {
        if (!isComplete || dungeonProgress.completed.includes(dungeon.id)) return;
        setDungeonProgress((current) => ({
            ...current,
            completed: [...current.completed, dungeon.id],
        }));
    }, [dungeon.id, dungeonProgress.completed, isComplete]);

    const isDungeonUnlocked = (item, index) => canUnlockDungeon(index, DUNGEONS, dungeonProgress, totalStars);

    const selectDungeon = (item, index) => {
        if (!isDungeonUnlocked(item, index)) return;
        setDungeonProgress((current) => current.runs[String(item.id)]
            ? current
            : { ...current, runs: { ...current.runs, [item.id]: createDungeonRun(item) } });
        setSelectedDungeonId(item.id);
        setScore(0);
        setHealth(100);
        setErrCnt(0);
        setComboCnt(0);
        setLootMessage("");
        setRunId((current) => current + 1);
    };

    const moveToRoom = (targetKey) => {
        const isVisited = run.visited.includes(targetKey);
        const isAdjacent = getNeighbors(dungeon.layout, currentRoom).includes(targetKey);
        if (!isAdjacent || (currentRoomHasEnemies && !isVisited)) return;

        const [targetRow, targetColumn] = targetKey.split("-").map(Number);
        const reward = dungeon.layout[targetRow][targetColumn] === "T" && !run.collectedTreasures.includes(targetKey)
            ? treasureRewards[targetKey]
            : 0;

        setDungeonProgress((current) => {
            const currentRun = current.runs[String(dungeon.id)];
            const nextRun = {
                ...currentRun,
                currentRoom: targetKey,
                visited: currentRun.visited.includes(targetKey)
                    ? currentRun.visited
                    : [...currentRun.visited, targetKey],
                collectedTreasures: reward
                    ? [...currentRun.collectedTreasures, targetKey]
                    : currentRun.collectedTreasures,
            };
            return {
                ...current,
                stars: current.stars + reward,
                runs: { ...current.runs, [dungeon.id]: nextRun },
            };
        });
        setLootMessage(reward ? `Found ${reward} stars!` : "");
    };

    const applyAttack = (damage) => {
        setDungeonProgress((current) => {
            const currentRun = current.runs[String(dungeon.id)];
            const enemies = currentRun.enemies[currentRoom] || [];
            let remainingDamage = damage;
            const updatedEnemies = enemies.map((enemy) => {
                if (enemy.health === 0 || remainingDamage === 0) return enemy;
                const appliedDamage = Math.min(enemy.health, remainingDamage);
                remainingDamage -= appliedDamage;
                return { ...enemy, health: enemy.health - appliedDamage };
            });
            const nextRun = {
                ...currentRun,
                enemies: { ...currentRun.enemies, [currentRoom]: updatedEnemies },
            };
            return { ...current, runs: { ...current.runs, [dungeon.id]: nextRun } };
        });
    };

    const restartDungeon = () => {
        setDungeonProgress((current) => ({
            ...current,
            runs: {
                ...current.runs,
                [dungeon.id]: createDungeonRun(dungeon, current.runs[String(dungeon.id)]),
            },
        }));
        setScore(0);
        setHealth(100);
        setErrCnt(0);
        setComboCnt(0);
        setLootMessage("");
        setRunId((current) => current + 1);
    };

    const currentRoomKey = currentRoom;

    return (
        <main className="p-4">
            <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
                <div>
                    <h1 className="text-3xl text-primary font-bold">Dungeon</h1>
                    <p className="text-sm opacity-70">{dungeon.name} · {dungeon.layout.length} × {dungeon.layout[0].length}</p>
                </div>
                <div className="badge badge-warning h-10 px-3 font-semibold">{totalStars} stars</div>
            </div>
            <div className="mb-4 flex flex-wrap gap-2">
                {DUNGEONS.map((item, index) => {
                    const unlocked = isDungeonUnlocked(item, index);
                    return (
                        <button
                            key={item.id}
                            type="button"
                            className={`btn btn-sm ${item.id === dungeon.id ? "btn-primary" : "btn-outline"}`}
                            disabled={!unlocked}
                            onClick={() => selectDungeon(item, index)}
                        >
                            {item.name}{!unlocked ? ` · ${item.requiredStars} stars required` : dungeonProgress.completed.includes(item.id) ? " · Cleared" : ""}
                        </button>
                    );
                })}
            </div>
            <div className="flex flex-col gap-4 xl:flex-row xl:items-start">
                <section className="shrink-0">
                    <div className="grid grid-cols-7 border border-primary">
                        {dungeon.layout.map((row, rowIndex) => row.map((tile, columnIndex) => {
                            const key = roomKey(rowIndex, columnIndex);
                            const visited = run.visited.includes(key);
                            const revealed = visited || isComplete;
                            const isFrontier = !revealed && !currentRoomHasEnemies && getNeighbors(dungeon.layout, currentRoom).includes(key);
                            const isAdjacent = getNeighbors(dungeon.layout, currentRoom).includes(key);
                            const canMove = tile !== "#" && isAdjacent && (visited || !currentRoomHasEnemies);
                            const isCollectedTreasure = run.collectedTreasures.includes(key);
                            return (
                                <Room
                                    key={key}
                                    tile={tile}
                                    visible={revealed}
                                    frontier={isFrontier}
                                    current={key === currentRoomKey}
                                    cleared={visited && (tile === "E" || tile === "B") && !(run.enemies[key] || []).some((enemy) => enemy.health > 0)}
                                    collected={isCollectedTreasure}
                                    disabled={!canMove}
                                    onSelect={() => moveToRoom(key)}
                                />
                            );
                        }))}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2 text-sm">
                        <span className="badge badge-secondary">Visited {run.visited.length}/{getReachableRoomKeys(dungeon.layout).length}</span>
                        <span className="badge badge-accent">{run.collectedTreasures.length} treasures</span>
                    </div>
                    <div className="mt-3 max-w-xs">
                        <div className="flex justify-between text-sm"><strong>Health</strong><span>{health}/100</span></div>
                        <progress className={`progress w-full ${health > 30 ? "progress-success" : "progress-error"}`} value={health} max="100" />
                    </div>
                    <div className="mt-2 flex gap-2">
                        <div className="badge badge-success">Combo {comboCnt}</div>
                        <div className="badge badge-error">Errors {errCnt}</div>
                        <div className="badge badge-accent">Damage {score}</div>
                    </div>
                </section>
                <section className="min-w-0 flex-1">
                    <h2 className="mb-2 text-xl font-bold">Room {roomRow + 1}-{roomColumn + 1}</h2>
                    {lootMessage && <p className="mb-2 font-semibold text-warning">{lootMessage}</p>}
                    {isComplete && <p className="mb-2 font-semibold text-success">Dungeon cleared. The full map is revealed.</p>}
                    {dungeon.layout[roomRow][roomColumn] === "T" && (
                        <p className="mb-2">{run.collectedTreasures.includes(currentRoom) ? "Treasure collected." : `Treasure: ${treasureRewards[currentRoom]} stars`}</p>
                    )}
                    <MathQuizRoom
                        key={`${dungeon.id}-${runId}`}
                        r={[roomRow, roomColumn]}
                        roomType={dungeon.layout[roomRow][roomColumn]}
                        enemies={run.enemies[currentRoom] || []}
                        onAttack={applyAttack}
                        health={health}
                        setHealth={setHealth}
                        score={score}
                        setScore={setScore}
                        errCnt={errCnt}
                        setErrCnt={setErrCnt}
                        comboCnt={comboCnt}
                        setComboCnt={setComboCnt}
                        onRestart={restartDungeon}
                    />
                </section>
            </div>
        </main>
    );
}

function Room({ tile, visible, frontier, current, cleared, collected, disabled, onSelect }) {
    const color = !visible
        ? frontier ? "bg-base-200 text-base-content" : "bg-neutral text-neutral"
        : tile === "S" ? "bg-accent text-accent-content"
            : tile === "T" ? "bg-success text-success-content"
                : tile === "B" ? "bg-error text-error-content"
                    : tile === "E" ? "bg-secondary text-secondary-content"
                        : "bg-base-300 text-base-content";
    const label = !visible ? frontier ? "?" : "" : collected ? "★" : cleared ? "✓" : tile;

    return (
        <button
            type="button"
            disabled={disabled}
            aria-label={!visible ? frontier ? "Explore unknown room" : "Unexplored map" : `${tile} room${current ? ", current room" : ""}`}
            title={!visible ? frontier ? "Explore" : "Unexplored" : `${tile} room`}
            className={`flex h-10 w-10 items-center justify-center border border-base-100 text-sm font-bold ${color} ${current ? "ring-2 ring-primary ring-inset" : ""} ${disabled ? "cursor-default" : "cursor-pointer hover:brightness-110"}`}
            onClick={onSelect}
        >
            {label}
        </button>
    );
}

// BUGS / THINGS TO WORK ON
// 1. Upon loading, the first problem often displays the wrong operator
// (The issue must be the operator and not the number generation because when the numbers are generated for division problems, the sign is not always a slash)
// 
function GiveProblem({ health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt, onAttack, onMistake, onRestart }) {
    const [p, setP] = useState(Math.floor(Math.random() * 4));
    // 0 = Addition
    // 1 = Subtraction
    // 2 = Multiplication
    // 3 = Division
    const opsList = ["+", "-", "*", "/"];
    const [operator, setOperator] = useState(opsList[p]);
    const [num1, setNum1] = useState(Math.floor(Math.random() * 10));
    const [num2, setNum2] = useState(Math.floor(Math.random() * 10));

    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [elapsed, setElapsed] = useState(0);
    const startTime = useRef(Date.now());
    useEffect(() => {
        let rO = Math.floor(Math.random() * 4);
        let r = generateNumbers(opsList[rO]);
        setNum1(r[0]);
        setNum2(r[1]);
        setP(rO);
        setOperator(opsList[rO]);


        const timer = setInterval(() => {
            setElapsed((prevElapsed) => prevElapsed + 1);
        }, (1000));

        return () => clearInterval(timer);
    }, []);

    const generateNumbers = (op) => {
        let numbers = [Math.floor(Math.random() * 10), Math.floor(Math.random() * 10)]

        if (op === "/") {
            numbers[1] = Math.floor(Math.random() * 25) + 1;
            numbers[0] = numbers[1] * (1 + Math.floor(Math.random() * 25));
        }

        return numbers;
    }

    // Answer submission
    const handleSubmit = (e) => {
        e.preventDefault();
        let correctAnswer = null;
        (p === 0 ? correctAnswer = num1 + num2 : p === 1 ? correctAnswer = num1 - num2 : p === 2 ? correctAnswer = num1 * num2 : correctAnswer = Math.floor(num1 / num2));
        const wasCorrect = parseInt(userAnswer, 10) === correctAnswer;
        if (wasCorrect) {
            const attackDamage = comboCnt + 1;
            setFeedback('Correct!');
            setScore(score + attackDamage);
            onAttack(attackDamage);
        } else {
            setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
            setErrCnt(errCnt + 1);
            const remainingHealth = Math.max(0, health - onMistake());
            setHealth(remainingHealth);
            if (remainingHealth === 0) {
                document.getElementById('dungeon-death-modal')?.showModal();
            }
        }

        // Generate new numbers for the next question
        let rO = Math.floor(Math.random() * 4);
        let r = generateNumbers(opsList[rO]);
        setNum1(r[0]);
        setNum2(r[1]);
        setUserAnswer('');
        setP(rO);
        setOperator(opsList[rO]);

        // Calculate time spent
        const endTime = Date.now();
        const timeSpent = (endTime - startTime.current) / 1000;
        startTime.current = Date.now();

        // Keep track of correct answer combos
        const comboLim = 3;
        (timeSpent < comboLim && wasCorrect) ? setComboCnt(comboCnt + 1) : setComboCnt(0);
    };

    return (
        <div className="m-4 border rounded-lg p-4 border-primary w-120">
            <form onSubmit={handleSubmit}>
                <p className="mb-2">What is {num1} {operator} {num2}?</p>
                <input
                    className="input mr-4"
                    type="number"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Your answer"
                    required
                    disabled={health === 0}
                />
                <button className="btn btn-primary" type="submit" disabled={health === 0}>Submit</button>
            </form>
            <div className="badge badge-secondary">Time Elapsed: <strong>{elapsed}</strong></div>
            {feedback && <p>{feedback}</p>}
            <dialog id="dungeon-death-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">You Died!</h3>
                    <p className="py-4">Restart the dungeon to try again.</p>
                    <div className="modal-action">
                        <button type="button" className="btn btn-primary" onClick={onRestart}>Restart Dungeon</button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

function DisplayEnemies({ enemies, roomType }) {
    if (enemies.length === 0) {
        return <p className="p-4">{roomType === "T" ? "Treasure room" : "No enemies in this room"}</p>;
    }

    const defeatedCount = enemies.filter((enemy) => enemy.health === 0).length;

    return (
        <section className="m-4 max-w-2xl">
            <div className="mb-2 flex items-center justify-between">
                <h2 className="text-xl font-bold">Enemies</h2>
                <span>{defeatedCount}/{enemies.length} defeated</span>
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {enemies.map((enemy) => (
                    <article key={enemy.id} className={`border border-primary p-3 ${enemy.health === 0 ? "opacity-50" : ""}`}>
                        <div className="flex justify-between gap-2">
                            <strong>{enemy.name}{enemy.isBoss ? " (Boss)" : ""}</strong>
                            {enemy.isBuffed && <span className="badge badge-warning">Buffed</span>}
                        </div>
                        <div className="my-1 flex justify-between text-sm">
                            <span>{enemy.tier === "boss" ? "Boss" : `${enemy.tier} level`}</span>
                            <span>{enemy.health}/{enemy.maxHealth} HP</span>
                        </div>
                        <progress className="progress progress-error w-full" value={enemy.health} max={enemy.maxHealth} />
                    </article>
                ))}
            </div>
        </section>
    );
}

function MathQuizRoom({ roomType, enemies, onAttack, health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt, onRestart }) {
    const enemyAttackDamage = () => enemies.find((enemy) => enemy.health > 0)?.attackDamage || 0;

    return (
        <div className="flex flex-col items-start gap-4 lg:flex-row">
            <GiveProblem health={health} setHealth={setHealth} score={score} setScore={setScore} errCnt={errCnt} setErrCnt={setErrCnt} comboCnt={comboCnt} setComboCnt={setComboCnt} onAttack={onAttack} onMistake={enemyAttackDamage} onRestart={onRestart} />
            <DisplayEnemies enemies={enemies} roomType={roomType} />
        </div>
    );
}

