import { useState, useEffect, useRef } from "react";

// 'B' - boss room
// 'E' - enemy room
// 'S' - start point
// 'T' - treasure room
// '#' - not part of path

const DUNGEON1 = [
    ['S', 'E', '#', '#', '#', '#', '#'],
    ['#', 'E', '#', 'T', '#', '#', '#'],
    ['#', 'E', 'E', 'E', '#', '#', '#'],
    ['#', 'B', '#', 'E', 'E', 'B', 'T'],
    ['#', 'E', '#', '#', 'E', '#', '#'],
    ['#', 'T', '#', '#', 'B', '#', '#'],
    ['#', '#', '#', '#', 'T', '#', '#'],
]

const LOW_LEVEL_ENEMIES = ["Goblin", "Slime", "Wolf"];
const HIGH_LEVEL_ENEMIES = ["Ogre", "Wraith", "Golem"];

function createEnemy(name, tier, health, attackDamage, isBoss = false) {
    const isBuffed = Math.random() < 0.3;
    const multiplier = isBuffed ? 1.5 : 1;
    const maxHealth = Math.round(health * multiplier);

    return {
        id: `${name}-${Math.random().toString(36).slice(2)}`,
        name,
        tier,
        health: maxHealth,
        maxHealth,
        attackDamage: Math.round(attackDamage * multiplier),
        isBuffed,
        isBoss,
    };
}

function shuffle(items) {
    const shuffled = [...items];
    for (let index = shuffled.length - 1; index > 0; index -= 1) {
        const otherIndex = Math.floor(Math.random() * (index + 1));
        [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
    }
    return shuffled;
}

function createEncounter(isBossRoom) {
    const enemies = [];

    if (isBossRoom) {
        enemies.push(createEnemy("Dragon", "boss", 80, 12, true));
        const minionCount = 2 + Math.floor(Math.random() * 2);
        for (let index = 0; index < minionCount; index += 1) {
            const name = LOW_LEVEL_ENEMIES[Math.floor(Math.random() * LOW_LEVEL_ENEMIES.length)];
            enemies.push(createEnemy(name, "low", 12, 4));
        }
        return shuffle(enemies);
    }

    const enemyCount = 7 + Math.floor(Math.random() * 4);
    const lowLevelCount = Math.ceil(enemyCount / 2);
    for (let index = 0; index < lowLevelCount; index += 1) {
        const name = LOW_LEVEL_ENEMIES[Math.floor(Math.random() * LOW_LEVEL_ENEMIES.length)];
        enemies.push(createEnemy(name, "low", 12, 4));
    }
    for (let index = lowLevelCount; index < enemyCount; index += 1) {
        const name = HIGH_LEVEL_ENEMIES[Math.floor(Math.random() * HIGH_LEVEL_ENEMIES.length)];
        enemies.push(createEnemy(name, "high", 24, 7));
    }
    return shuffle(enemies);
}

function createDungeonEncounters(dungeon) {
    return Object.fromEntries(dungeon.flatMap((row, rowIndex) =>
        row.flatMap((room, columnIndex) => room === "E" || room === "B"
            ? [[`${rowIndex}-${columnIndex}`, createEncounter(room === "B")]]
            : [])
    ));
}






export default function Dungeon() {
    const [selectedRoom, setSelectedRoom] = useState([0, 0]);
    const [encounters, setEncounters] = useState(() => createDungeonEncounters(DUNGEON1));

    const [score, setScore] = useState(0);
    const [health, setHealth] = useState(100);
    const [errCnt, setErrCnt] = useState(0);
    const [comboCnt, setComboCnt] = useState(0);

    return (
        <div>
            <h1 className="text-3xl text-primary font-bold ml-4">Dungeon</h1>
            <div className="flex justify-between items-center">
                <div className="flex mr-4 flex-wrap gap-2 items-center">
                </div>
            </div>
            <hr className="m-2 border-primary" />
            <div className="flex">
                <div className="m-2 flex flex-col justify-center items-start">
                    <div className="grid grid-cols-7 gap-0 border border-primary">
                        {DUNGEON1.map((row, r) =>
                            row.map((room, c) => <Room key={`${r}-${c}`} room={room} current={selectedRoom[0] === r && selectedRoom[1] === c} onSelect={() => setSelectedRoom([r, c])} />)
                        )}
                    </div>
                    <div>
                        <hr className="mb-2 mt-2 border-primary" />

                        {/* Health bar made by Google Gemini */}
                        <div className="flex justify-between items-center">
                            <div className="w-full max-w-xs">
                                <div className="flex justify-between items-center">
                                    <span className="text-base font-medium"><strong>Health</strong></span>
                                    <span className="text-sm font-medium">{health}/100</span>
                                </div>
                                <progress
                                    className={`progress w-56 ${health > 30 ? 'progress-success' : 'progress-error'}`}
                                    value={health}
                                    max="100"
                                ></progress>
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <div className="badge badge-success w-24">Combo <strong>{comboCnt}</strong></div>
                            <div className="badge badge-error w-24">Errors <strong>{errCnt}</strong></div>
                        </div>
                        <hr className="mb-2 mt-2 border-primary" />
                        <div>
                            <hr className="mb-2 mt-2 border-primary" />
                            <div className="flex justify-between">
                                <div className="badge badge-accent w-24 h-16">Total Attack Damage<strong>{score}</strong></div>
                                <div className="badge badge-accent w-24 h-16">Previous Attack Damage<strong>{comboCnt}</strong></div>
                            </div>
                            <hr className="mb-2 mt-2 border-primary" />
                        </div>
                    </div>
                </div>
                <div>
                    <MathQuizRoom d={DUNGEON1} r={selectedRoom} encounters={encounters} setEncounters={setEncounters} health={health} setHealth={setHealth} score={score} setScore={setScore} errCnt={errCnt} setErrCnt={setErrCnt} comboCnt={comboCnt} setComboCnt={setComboCnt} />
                </div>
            </div>
        </div>
    )
}

function Room({ room, current, onSelect }) {
    return (
        <button type="button" disabled={room === "#"} className={`w-8 h-8 flex justify-center items-center text-black font-semibold ${room == "#" ? "bg-primary" : room == "S" ? "bg-accent" : room == "T" ? "bg-success" : room == "B" ? "bg-error" : "bg-secondary"} ${room === "#" ? null : "cursor-pointer"} ${current ? "animate-pulse" : ""}`} onClick={onSelect}>
            {room == "#" ? null : room}
        </button>
    );
}

// BUGS / THINGS TO WORK ON
// 1. Upon loading, the first problem often displays the wrong operator
// (The issue must be the operator and not the number generation because when the numbers are generated for division problems, the sign is not always a slash)
// 
function GiveProblem({ health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt, onAttack, onMistake }) {
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
                document.getElementById('my_modal_1')?.showModal();
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
                />
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
            <div className="badge badge-secondary">Time Elapsed: <strong>{elapsed}</strong></div>
            {feedback && <p>{feedback}</p>}
            <dialog id="my_modal_1" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">You Died!</h3>
                    <p className="py-4">Press ESC key or click the button below to close</p>
                    <div className="modal-action">
                        <form method="dialog">
                            {/* if there is a button in form, it will close the modal */}
                            <button className="btn">Close</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}

function DisplayEnemies({ enemies }) {
    if (enemies.length === 0) {
        return <p className="p-4">Select an enemy room to begin a fight.</p>;
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

function MathQuizRoom({ d, r, encounters, setEncounters, health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt }) {
    const roomKey = `${r[0]}-${r[1]}`;
    const enemies = encounters[roomKey] || [];

    const applyAttack = (damage) => {
        setEncounters((currentEncounters) => {
            const currentEnemies = currentEncounters[roomKey] || [];
            let remainingDamage = damage;
            const updatedEnemies = currentEnemies.map((enemy) => {
                if (enemy.health === 0 || remainingDamage === 0) return enemy;
                const appliedDamage = Math.min(enemy.health, remainingDamage);
                remainingDamage -= appliedDamage;
                return { ...enemy, health: enemy.health - appliedDamage };
            });
            return { ...currentEncounters, [roomKey]: updatedEnemies };
        });
    };

    const enemyAttackDamage = () => enemies.find((enemy) => enemy.health > 0)?.attackDamage || 0;

    return (
        <div>
            <DisplayEnemies enemies={enemies} />
            <GiveProblem health={health} setHealth={setHealth} score={score} setScore={setScore} errCnt={errCnt} setErrCnt={setErrCnt} comboCnt={comboCnt} setComboCnt={setComboCnt} onAttack={applyAttack} onMistake={enemyAttackDamage} />
        </div>
    );
}

