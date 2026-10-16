import { useState } from "react"
import { useNavigate } from "react-router";

export default function Map() {

    const [levels, setLevels] = useState([
        // Addition
        { num: 1, branch: "A", subtopic: "One-Digit Addition", stars: 3, gems: 3, isBoss: false, isCurrent: 0 },
        { num: 2, branch: "A", subtopic: "One-Digit and Two-Digit Addition", stars: 2, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 3, branch: "A", subtopic: "One-Digit and Two-Digit Addition", stars: 1, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 4, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 1 },
        { num: 5, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "A", subtopic: "One-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "A", subtopic: "Two-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "A", subtopic: "Two-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "A", subtopic: "Two-Digit and Four-Digit Addition", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "A", subtopic: "Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "A", subtopic: "Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "A", subtopic: "Two-Digit and Three-Digit Addition", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "A", subtopic: "Three-Digit Addition", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },

        // Subtraction
        { num: 1, branch: "S", subtopic: "One-Digit Subtraction", stars: 3, gems: 3, isBoss: false, isCurrent: 0 },
        { num: 2, branch: "S", subtopic: "One-Digit and Two-Digit Subtraction", stars: 2, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 3, branch: "S", subtopic: "One-Digit and Two-Digit Subtraction", stars: 1, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 4, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 1 },
        { num: 5, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "S", subtopic: "One-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "S", subtopic: "Two-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "S", subtopic: "Two-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "S", subtopic: "Two-Digit and Four-Digit Subtraction", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "S", subtopic: "Two-Digit and Three-Digit Subtraction", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "S", subtopic: "Three-Digit Subtraction", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },

        // Multiplication
        { num: 1, branch: "M", subtopic: "One-Digit Multiplication", stars: 3, gems: 3, isBoss: false, isCurrent: 0 },
        { num: 2, branch: "M", subtopic: "One-Digit Multiplication", stars: 2, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 3, branch: "M", subtopic: "One-Digit Multiplication", stars: 1, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 4, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 1 },
        { num: 5, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "M", subtopic: "One-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "M", subtopic: "One-Digit and Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "M", subtopic: "Two-Digit Multiplication", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },

        // Division
        { num: 1, branch: "D", subtopic: "Division", stars: 3, gems: 3, isBoss: false, isCurrent: 0 },
        { num: 2, branch: "D", subtopic: "Division", stars: 2, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 3, branch: "D", subtopic: "Division", stars: 1, gems: 0, isBoss: false, isCurrent: 0 },
        { num: 4, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 1 },
        { num: 5, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 6, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 7, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 8, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 9, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 10, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 11, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 12, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 13, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 14, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 15, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
        { num: 16, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 17, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 18, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 19, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: false, isCurrent: 2 },
        { num: 20, branch: "D", subtopic: "Division", stars: 0, gems: 0, isBoss: true, isCurrent: 2 },
    ]);

    const [selectedLevel, setSelectedLevel] = useState(null);

    const navigate = useNavigate();
    const handleLevelClick = () => {
        navigate(`/level/${selectedLevel.branch}/${selectedLevel.num}`);
    };

    return (
        <div>
            <h1 className="text-3xl text-primary font-bold ml-4">Map</h1>
            <div className="flex justify-between items-center">
                <h2 className="text-lg text-accent font-semibold ml-4">Welcome, [username]!</h2>
                <div className="flex mr-4 flex-wrap gap-2 items-center">
                    <div className="tooltip" data-tip="Daily Streak Counter">
                        <button className="bg-secondary btn"># 🔥</button>
                    </div>
                    <div className="tooltip" data-tip="Number of Stars Collected">
                        <button className="bg-secondary btn"># ⭐</button>
                    </div>
                    <div className="tooltip" data-tip="Number of Gems Collected">
                        <button className="bg-secondary btn"># 💎</button>
                    </div>
                    <div className="tooltip" data-tip="User Avatar">
                        <img src="/path/to/streak-image.png" alt="Avatar" />
                    </div>
                </div>
            </div>
            <hr className="m-2 border-primary" />
            <h2 className="text-xl text-secondary font-semibold mt-12 ml-12 mb-3">Addition</h2>
            <div className="flex flex-wrap gap-6 ml-12">
                {levels.slice(0, 20).map((level, index) => (
                    <Level key={index} level={level} setSelectedLevel={setSelectedLevel} />
                ))}
            </div>

            <h2 className="text-xl text-secondary font-semibold mt-12 ml-12 mb-3">Subtraction</h2>
            <div className="flex flex-wrap gap-6 ml-12">
                {levels.slice(20, 40).map((level, index) => (
                    <Level key={index} level={level} setSelectedLevel={setSelectedLevel} />
                ))}
            </div>

            <h2 className="text-xl text-secondary font-semibold mt-12 ml-12 mb-3">Multiplication</h2>
            <div className="flex flex-wrap gap-6 ml-12">
                {levels.slice(40, 60).map((level, index) => (
                    <Level key={index} level={level} setSelectedLevel={setSelectedLevel} />
                ))}
            </div>

            <h2 className="text-xl text-secondary font-semibold mt-12 ml-12 mb-3">Division</h2>
            <div className="flex flex-wrap gap-6 ml-12">
                {levels.slice(60, 80).map((level, index) => (
                    <Level key={index} level={level} setSelectedLevel={setSelectedLevel} />
                ))}
            </div>

            {selectedLevel && (
                <dialog id="my_modal_2" className="modal modal-open">
                    <div className="modal-box">
                        <div className="flex justify-between">
                            <h3 className="flex font-bold text-lg">Level {selectedLevel.branch}{selectedLevel.num}{selectedLevel.isBoss ? <p className="ml-3 text-error font-bold">[BOSS]</p> : ''}</h3>
                            <div>
                                <span>
                                    {[...Array(selectedLevel.stars)].map((_, i) => (
                                        <span key={i} className="text-yellow-400">&#9733;</span>
                                    ))}
                                </span>
                                <span className="ml-3">
                                    {[...Array(selectedLevel.gems)].map((_, i) => (
                                        <span key={i}>💎</span>
                                    ))}
                                </span>

                            </div>
                        </div>
                        <hr />
                        <p className="py-2">Best Completion Time: [time]</p>
                        <div className="flex justify-end">
                            <div className="tooltip" data-tip="Earn gems by completing this level again in hard mode!">
                                <button className={`flex justify-self-end p-2 text-xs mr-2 btn ${selectedLevel.isCurrent === 1 ? 'btn-disabled' : selectedLevel.isCurrent === 0 ? 'btn-primary' : 'btn-disabled'}`} onClick={handleLevelClick}>{selectedLevel.isCurrent === 1 ? 'LOCKED' : selectedLevel.isCurrent === 0 ? 'HARD MODE' : 'LOCKED'}</button>
                            </div>
                            <button className={`flex justify-self-end p-2 text-xs ml-2 btn ${selectedLevel.isCurrent === 1 ? 'btn-primary' : selectedLevel.isCurrent === 0 ? 'btn-secondary' : 'btn-disabled'}`} onClick={handleLevelClick}>{selectedLevel.isCurrent === 1 ? 'PLAY' : selectedLevel.isCurrent === 0 ? 'PLAY AGAIN' : 'LOCKED'}</button>
                        </div>

                    </div>

                    <form method="dialog" className="modal-backdrop" onClick={() => setSelectedLevel(null)}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </div>
    )
}

function Level({ level, setSelectedLevel }) {

    let { num, branch, subtopic, stars, gems, isBoss, isCurrent } = level;

    return (
        <div>
            <div className="flex justify-between">
                <div>
                    {[...Array(stars)].map((_, i) => (
                        <span key={i} className="text-yellow-400">&#9733;</span>
                    ))}
                    {stars === 0 ? <br /> : null}
                </div>
                <div>
                    {[...Array(gems)].map((_, i) => (
                        <span key={i}>💎</span>
                    ))}
                </div>
            </div>
            <button data-tip={subtopic} className={`btn tooltip ${isBoss ? 'border-3 border-error' : 'border-1 border-primary'} ${stars === 3 ? 'bg-success' : stars === 2 ? 'bg-warning' : stars === 1 ? 'bg-error' : 'bg-gray-300'} text-black w-30`} onClick={() => setSelectedLevel(level)}>{branch}{num}</button>
            <p className="text-xs justify-self-center font-semibold">{isCurrent === 1 ? 'CURRENT' : ''}</p>
        </div>
    )
}