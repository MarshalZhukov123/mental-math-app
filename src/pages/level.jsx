import { useParams } from "react-router";
import { useState, useEffect, useRef } from "react";

export default function Level() {
    const { branch, num } = useParams();

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
            <MathQuiz branch={branch} num={num} />
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

function MathQuiz({ branch, num }) {
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
    const resetGame = () => {
        setHealth(100);
    }
    const [elapsed, setElapsed] = useState(0);
    useEffect(() => {
        const timer = setInterval(() => {
            setElapsed((prevElapsed) => prevElapsed + 1);
        }, (1000));

        return () => clearInterval(timer);
    }, []);
    const startTime = useRef(Date.now());

    let [comboCnt, setComboCnt] = useState(0);

    const handleDeath = () => {
        setHealth(0);
        document.getElementById('my_modal_1').showModal();
    }

    // Answer submission
    const handleSubmit = (e) => {
        e.preventDefault();
        let correctAnswer = num1 + num2;
        (branch === "A" ? correctAnswer = num1 + num2 : branch === "S" ? correctAnswer = num1 - num2 : branch === "M" ? correctAnswer = num1 * num2 : correctAnswer = num1 / num2)
        if (parseInt(userAnswer, 10) === correctAnswer) {
            setFeedback('Correct!');
            setScore(score + comboCnt);
        } else {
            setFeedback(`Incorrect. The correct answer was ${correctAnswer}.`);
            setErrCnt(errCnt + 1);
            setHealth(health - (errCnt * 5));
            (health <= 0 ? { handleDeath } : null)
        }

        // Generate new numbers for the next question

        setNum1(branch === "D" ? numD[0] : Math.floor(Math.random() * num1F));
        setNum2(branch === "D" ? numD[1] : Math.floor(Math.random() * num1F));
        setUserAnswer('');

        // Calculate time spent
        const endTime = Date.now();
        const timeSpent = (endTime - startTime.current) / 1000;
        console.log(`Answered in ${timeSpent} seconds`);
        startTime.current = Date.now();

        // Keep track of correct answer combos
        const comboLim = 3;
        (((timeSpent < comboLim) && (parseInt(userAnswer, 10) === correctAnswer)) ? setComboCnt(comboCnt + 1) : setComboCnt(0));
        console.log(`Combo Count: ${comboCnt}`);
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
                />
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
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