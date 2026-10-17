import { useNavigate, useParams } from "react-router";
import { useState, useEffect, useRef } from "react";
import { completeLevel, isLevelUnlocked, readLevelProgress } from "./progression";

export default function Level() {
    const { branch, num } = useParams();
    const navigate = useNavigate();
    const [runId, setRunId] = useState(0);
    const isUnlocked = isLevelUnlocked(readLevelProgress(), branch, num);

    return (
        <div>
            <h1 className="text-3xl text-primary font-bold ml-4">Level {branch}{num}</h1>
            <div className="flex items-center">
                <h2 className="text-lg text-accent font-semibold ml-4">Objectives:</h2>
                <div className="flex ml-4 flex-wrap gap-2 items-center">
                    <div className="tooltip" data-tip="Get 8/10 or 16/20 problems correct">
                        <p className="text-lg flex justify-self-center">☆</p>
                        <button className="bg-error btn">80%</button>
                    </div>
                    <div className="tooltip" data-tip="Get 9/10 or 18/20 problems correct">
                        <p className="text-lg flex justify-self-center">☆</p>
                        <button className="bg-error btn">90%</button>
                    </div>
                    <div className="tooltip" data-tip="Get 10/10 or 20/20 problems correct">
                        <p className="text-lg flex justify-self-center">☆</p>
                        <button className="bg-error btn">100%</button>
                    </div>
                </div>
            </div>
            <hr className="m-2 border-primary" />
            {isUnlocked ? (
                <MathQuiz key={runId} branch={branch} num={num} onRestart={() => setRunId((current) => current + 1)} onReturnToMap={() => navigate("/")} />
            ) : (
                <div className="m-4">
                    <p>This level is locked. Complete earlier levels to unlock it.</p>
                    <button className="btn btn-primary mt-3" onClick={() => navigate("/")}>Return to map</button>
                </div>
            )}
        </div>

    );
}

// Decides the number of digits in each number
function num1MultFactor(branch, num) {
    let num1F = 10;
    let cycle = num % 20;
    if (branch === "A" || branch === "S") {
        if (cycle === 1) {
            num1F = 10;
        } else if (cycle === 2 || cycle === 3 || cycle === 7 || cycle === 8) {
            num1F = 100;
        } else if ((cycle >= 4 && cycle <= 6) || (cycle >= 9 && cycle <= 11) || (cycle >= 16 && cycle <= 19) || cycle === 0) {
            num1F = 1000;
        } else {
            num1F = 10000;
        }
    } else if (branch === "M") {
        if (cycle >= 1 && cycle <= 8) {
            num1F = 10;
        } else {
            num1F = 100;
        }
    }
    return num1F;
}
function num2MultFactor(branch, num) {
    let num2F = 10;
    let cycle = num % 20;
    if (branch === "A" || branch === "S") {
        if (cycle >= 1 && cycle <= 6) {
            num2F = 10;
        } else if (cycle >= 7 && cycle <= 15) {
            num2F = 100;
        } else {
            num2F = 1000;
        }
    } else if (branch === "M") {
        if (cycle >= 1 && cycle <= 16) {
            num2F = 10;
        } else {
            num2F = 100;
        }
    }
    return num2F;
}
function numsForDivision() {
    let num2 = Math.floor(Math.random() * 50) + 1;
    let num1 = num2 * (1 + Math.floor(Math.random() * 20));
    return ([num1, num2]);
}

function MathQuiz({ branch, num, onRestart, onReturnToMap }) {
    const num1F = num1MultFactor(branch, num);
    const num2F = num2MultFactor(branch, num);
    const numD = numsForDivision();
    const [num1, setNum1] = useState(branch === "D" ? numD[0] : Math.floor(Math.random() * num1F));
    const [num2, setNum2] = useState(branch === "D" ? numD[1] : Math.floor(Math.random() * num2F));
    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState('');
    const [score, setScore] = useState(0);
    const [errCnt, setErrCnt] = useState(0);
    const [health, setHealth] = useState(100);
    const [elapsed, setElapsed] = useState(0);
    const [answered, setAnswered] = useState(0);
    const [correctCount, setCorrectCount] = useState(0);
    const [earnedStars, setEarnedStars] = useState(0);
    const [isComplete, setIsComplete] = useState(false);
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed((prevElapsed) => prevElapsed + 1);
        }, (1000));

        return () => clearInterval(timer);
    }, []);
    const startTime = useRef(Date.now());

    let [comboCnt, setComboCnt] = useState(0);

    // Answer submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (health === 0 || isComplete) return;

        let correctAnswer = num1 + num2;
        (branch === "A" ? correctAnswer = num1 + num2 : branch === "S" ? correctAnswer = num1 - num2 : branch === "M" ? correctAnswer = num1 * num2 : correctAnswer = num1 / num2)
        const wasCorrect = parseInt(userAnswer, 10) === correctAnswer;
        const nextAnswered = answered + 1;
        const nextCorrectCount = correctCount + (wasCorrect ? 1 : 0);
        setAnswered(nextAnswered);
        let died = false;

        if (wasCorrect) {
            setCorrectCount(nextCorrectCount);
            setFeedback('Correct!');
            setScore(score + comboCnt + 1);
        } else {
            setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
            setErrCnt(errCnt + 1);
            const remainingHealth = Math.max(0, health - 10);
            setHealth(remainingHealth);
            if (remainingHealth === 0) {
                died = true;
                document.getElementById('level-death-modal')?.showModal();
            }
        }

        const nextDivisionNumbers = numsForDivision();
        setNum1(branch === "D" ? nextDivisionNumbers[0] : Math.floor(Math.random() * num1F));
        setNum2(branch === "D" ? nextDivisionNumbers[1] : Math.floor(Math.random() * num2F));
        setUserAnswer('');

        // Calculate time spent
        const endTime = Date.now();
        const timeSpent = (endTime - startTime.current) / 1000;
        startTime.current = Date.now();

        // Keep track of correct answer combos
        const comboLim = 3;
        (timeSpent < comboLim && wasCorrect) ? setComboCnt(comboCnt + 1) : setComboCnt(0);

        if (nextAnswered === 10 && !died) {
            const stars = nextCorrectCount === 10 ? 3 : nextCorrectCount >= 9 ? 2 : nextCorrectCount >= 8 ? 1 : 0;
            setEarnedStars(stars);
            setIsComplete(true);
            if (stars > 0) completeLevel(branch, num, stars);
            document.getElementById('level-complete-modal')?.showModal();
        }
    };

    let operator = "+";
    (branch === "A" ? operator = "+" : branch === "S" ? operator = "-" : branch === "M" ? operator = "*" : operator = "/")

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
                    disabled={health === 0 || isComplete}
                />
                <button className="btn btn-primary" type="submit" disabled={health === 0 || isComplete}>Submit</button>
            </form>
            <p className="mt-2 text-sm">Questions: {answered}/10 | Correct: {correctCount}</p>
            <hr className="mb-2 mt-2 border-primary" />

            {/* Health bar made by Google Gemini */}
            <div className="flex justify-between items-center">
                <div className="w-full max-w-xs">
                    <div className="flex justify-between">
                        <span className="text-base font-medium">Health</span>
                        <span className="text-sm font-medium">{health}/100</span>
                    </div>
                    <progress
                        className={`progress w-80 ${health > 30 ? 'progress-success' : 'progress-error'}`}
                        value={health}
                        max="100"
                    ></progress>
                </div>
                <div className="flex flex-col">
                    <div className="badge badge-error mb-1">Errors: {errCnt}</div>
                    <div className="badge badge-success mt-1">Combo: {comboCnt}</div>
                </div>
            </div>

            <hr className="mb-2 mt-2 border-primary" />

            <div className="badge badge-secondary">Time Elapsed: <strong>{elapsed}</strong></div>
            {feedback && <p>{feedback}</p>}
            <dialog id="level-death-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">You Died!</h3>
                    <p className="py-4">Restart this level to try again.</p>
                    <div className="modal-action">
                        <button type="button" className="btn btn-primary" onClick={onRestart}>Restart Level</button>
                    </div>
                </div>
            </dialog>
            <dialog id="level-complete-modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Level Complete</h3>
                    <p className="py-4">
                        {earnedStars > 0
                            ? `You earned ${earnedStars} star${earnedStars === 1 ? "" : "s"}.`
                            : "You need at least 8 correct answers to earn a star and unlock the next level."}
                    </p>
                    <div className="modal-action">
                        {earnedStars > 0 ? (
                            <button type="button" className="btn btn-primary" onClick={onReturnToMap}>Continue to Map</button>
                        ) : (
                            <button type="button" className="btn btn-primary" onClick={onRestart}>Restart Level</button>
                        )}
                    </div>
                </div>
            </dialog>
        </div>
    );
}

function Enemies() {
    const enemy = {
        name: "goblin",
        imageRef: "",
        health: 12 + (3 * Math.random()),
        dmg: 9 + (6 * Math.random()),
        atkSpeed: 10,
        isBuffed: false,
        isBoss: false
    }

    const [lvlEnemies, setLvlEnemies] = useState([
        { enemy }
    ]);

    return (
        <div>
            {lvlEnemies}
        </div>
    )
}