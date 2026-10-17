export const DUNGEON1 = [
    ['S', 'E', '#', '#', '#', '#', '#'],
    ['#', 'E', '#', 'T', '#', '#', '#'],
    ['#', 'E', 'E', 'E', '#', '#', '#'],
    ['#', 'B', '#', 'E', 'E', 'B', 'T'],
    ['#', 'E', '#', '#', 'E', '#', '#'],
    ['#', 'T', '#', '#', 'B', '#', '#'],
    ['#', '#', '#', '#', 'T', '#', '#'],
];

export const DUNGEON2 = [
    ['S', 'E', 'E', '#', '#', '#', '#'],
    ['#', '#', 'E', 'T', '#', '#', '#'],
    ['#', 'E', 'E', 'E', '#', '#', '#'],
    ['#', 'B', '#', 'E', 'E', 'E', 'T'],
    ['#', 'E', '#', '#', 'E', '#', '#'],
    ['#', 'T', '#', '#', 'B', '#', '#'],
    ['#', '#', '#', '#', 'T', '#', '#'],
];

export const DUNGEON3 = [
    ['S', 'E', '#', '#', '#', '#', '#'],
    ['#', 'E', '#', 'T', '#', '#', '#'],
    ['#', 'E', 'E', 'E', '#', '#', '#'],
    ['#', 'B', '#', 'E', 'E', 'E', 'T'],
    ['#', 'E', '#', '#', 'B', '#', '#'],
    ['#', 'T', '#', '#', 'E', '#', '#'],
    ['#', '#', '#', '#', 'T', '#', '#'],
];

export const DUNGEONS = [
    { id: 1, name: "Mossy Ruins", requiredStars: 0, layout: DUNGEON1 },
    { id: 2, name: "Sunken Archive", requiredStars: 24, layout: DUNGEON2 },
    { id: 3, name: "Ashen Keep", requiredStars: 48, layout: DUNGEON3 },
];

const LOW_LEVEL_ENEMIES = ["Goblin", "Slime", "Wolf"];
const HIGH_LEVEL_ENEMIES = ["Ogre", "Wraith", "Golem"];

export function roomKey(row, column) {
    return `${row}-${column}`;
}

export function getNeighbors(layout, key) {
    const [row, column] = key.split("-").map(Number);
    return [[row - 1, column], [row + 1, column], [row, column - 1], [row, column + 1]]
        .filter(([nextRow, nextColumn]) => layout[nextRow]?.[nextColumn] && layout[nextRow][nextColumn] !== "#")
        .map(([nextRow, nextColumn]) => roomKey(nextRow, nextColumn));
}

export function getReachableRoomKeys(layout) {
    return layout.flatMap((row, rowIndex) => row.flatMap((room, columnIndex) =>
        room === "#" ? [] : [roomKey(rowIndex, columnIndex)]
    ));
}

export function getRoomDistances(layout) {
    const startRow = layout.findIndex((row) => row.includes("S"));
    const startColumn = layout[startRow].indexOf("S");
    const distances = { [roomKey(startRow, startColumn)]: 0 };
    const queue = [roomKey(startRow, startColumn)];

    for (let index = 0; index < queue.length; index += 1) {
        const key = queue[index];
        for (const neighbor of getNeighbors(layout, key)) {
            if (distances[neighbor] === undefined) {
                distances[neighbor] = distances[key] + 1;
                queue.push(neighbor);
            }
        }
    }
    return distances;
}

export function getTreasureRewards(layout) {
    const distances = getRoomDistances(layout);
    const treasures = getReachableRoomKeys(layout).filter((key) => {
        const [row, column] = key.split("-").map(Number);
        return layout[row][column] === "T";
    });
    const farthestTreasure = treasures.reduce((farthest, key) =>
        distances[key] > (distances[farthest] ?? -1) ? key : farthest, treasures[0]);

    return Object.fromEntries(treasures.map((key) => [key, key === farthestTreasure ? 24 : 12]));
}

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

export function createDungeonEncounters(layout) {
    return Object.fromEntries(layout.flatMap((row, rowIndex) =>
        row.flatMap((room, columnIndex) => room === "E" || room === "B"
            ? [[roomKey(rowIndex, columnIndex), createEncounter(room === "B")]]
            : [])
    ));
}

export function createDungeonRun(dungeon, previousRun) {
    const startRow = dungeon.layout.findIndex((row) => row.includes("S"));
    const startColumn = dungeon.layout[startRow].indexOf("S");
    const start = roomKey(startRow, startColumn);
    return {
        currentRoom: start,
        visited: [start],
        collectedTreasures: previousRun?.collectedTreasures || [],
        enemies: createDungeonEncounters(dungeon.layout),
    };
}

export function isDungeonComplete(dungeon, run) {
    const allRoomsVisited = getReachableRoomKeys(dungeon.layout).every((key) => run.visited.includes(key));
    const allEnemiesDefeated = Object.values(run.enemies).every((enemies) =>
        enemies.every((enemy) => enemy.health === 0)
    );
    return allRoomsVisited && allEnemiesDefeated;
}

export function canUnlockDungeon(index, dungeons, progress, totalStars) {
    if (index === 0) return true;
    const previousDungeon = dungeons[index - 1];
    return progress.completed.includes(previousDungeon.id) && totalStars >= dungeons[index].requiredStars;
}