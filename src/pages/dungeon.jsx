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






export default function Dungeon() {
    const [selectedRoom, setSelectedRoom] = useState([0, 0]);

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
                            row.map((room, c) => <Room room={room} current={selectedRoom[0] === r && selectedRoom[1] === c} />)
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
                    <MathQuizRoom d={DUNGEON1} r={selectedRoom} health={health} setHealth={setHealth} score={score} setScore={setScore} errCnt={errCnt} setErrCnt={setErrCnt} comboCnt={comboCnt} setComboCnt={setComboCnt} />
                </div>
            </div>
        </div>
    )
}

function Room({ room, current }) {
    return (
        <button className={`w-8 h-8 flex justify-center items-center text-black font-semibold ${room == "#" ? "bg-primary" : room == "S" ? "bg-accent" : room == "T" ? "bg-success" : room == "B" ? "bg-error" : "bg-secondary"} ${room === "#" ? null : "cursor-pointer"} ${current ? "animate-pulse" : ""}`} onClick={() => MathQuizRoom(DUNGEON1, room)}>
            {room == "#" ? null : room}
        </button>
    );
}

// BUGS / THINGS TO WORK ON
// 1. Upon loading, the first problem often displays the wrong operator
// (The issue must be the operator and not the number generation because when the numbers are generated for division problems, the sign is not always a slash)
// 
function GiveProblem({ d, r, health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt }) {
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


        const timer = setInterval(() => {
            setElapsed((prevElapsed) => prevElapsed + 1);
        }, (1000));

        return () => clearInterval(timer);
    }, []);

    const handleDeath = () => {
        setHealth(0);
        document.getElementById('my_modal_1').showModal();
    }
    const resetGame = () => {
        setHealth(100);
    }

    const generateNumbers = (op) => {
        console.log(op);
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
        console.log(p, correctAnswer);
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
        console.log(`Answered in ${timeSpent} seconds`);
        startTime.current = Date.now();

        // Keep track of correct answer combos
        const comboLim = 3;
        (((timeSpent < comboLim) && (parseInt(userAnswer, 10) === correctAnswer)) ? setComboCnt(comboCnt + 1) : setComboCnt(0));
        console.log(`Combo Count: ${comboCnt}`);
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

const ENEMIES = [
    { name: "goblin", imageRef: "", health: 10, atk: 3 },
    { name: "ogre", imageRef: "", health: 20, atk: 10 },
    { name: "dragon", imageRef: "", health: 1, atk: 1 }


]

function DisplayEnemies({ d, r, health, setHealth, score, setScore }) {
    const [enemies, setEnemies] = useState([

    ])

    return (
        <div>map enemies here</div>
    )
}

function MathQuizRoom({ d, r, health, setHealth, score, setScore, errCnt, setErrCnt, comboCnt, setComboCnt }) {

    return (
        <div>
            <div>
                hero and enemies
                <DisplayEnemies d={MathQuizRoom.d} r={MathQuizRoom.r} health={health} setHealth={setHealth} score={score} setScore={setScore} />
            </div>
            <div>
                <GiveProblem d={MathQuizRoom.d} r={MathQuizRoom.r} health={health} setHealth={setHealth} score={score} setScore={setScore} errCnt={errCnt} setErrCnt={setErrCnt} comboCnt={comboCnt} setComboCnt={setComboCnt} />
            </div>
        </div>
    )
}

