import SimplexNoise from 'simplex-noise';
import PoissonDisk from 'poisson-disk';
import seedrandom from 'seedrandom';

let ground = [
  [2, 2, 1, 1, 4, 4, 1, 6, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 1, 6, 2, 2, 2],
  [2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2, 2, 2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2],
  [6, 1, 0, 0, 4, 4, 0, 0, 2, 2, 2, 2, 6, 1, 0, 0, 4, 4, 0, 0, 2, 2, 2],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 4, 4, 0, 0, 0, 2, 2],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [1, 1, 7, 1, 3, 3, 1, 7, 1, 1, 1, 1, 1, 1, 7, 1, 3, 3, 1, 7, 1, 1, 1],
  [3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3, 1, 3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3],
  [7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7, 1, 7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7],
  [2, 2, 1, 1, 4, 4, 1, 6, 2, 2, 2, 2, 2, 2, 1, 1, 4, 4, 1, 6, 2, 2, 2],
  [2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2, 2, 2, 6, 1, 0, 4, 4, 0, 0, 2, 2, 2],
  [6, 1, 0, 0, 4, 4, 0, 0, 2, 2, 2, 2, 6, 1, 0, 0, 4, 4, 0, 0, 2, 2, 2],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 2, 2, 2, 0, 0, 0, 0, 4, 4, 0, 0, 0, 2, 2],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 0, 0, 0, 0, 0],
  [1, 1, 7, 1, 3, 3, 1, 7, 1, 1, 1, 1, 1, 1, 7, 1, 3, 3, 1, 7, 1, 1, 1],
  [3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3, 1, 3, 7, 3, 3, 3, 3, 3, 3, 7, 3, 3],
  [7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7, 1, 7, 1, 7, 7, 3, 3, 7, 7, 1, 1, 7],
];

const groundNames = [];
groundNames[0] = 'water';
groundNames[1] = 'sand';
groundNames[2] = 'grass';
groundNames[3] = 'stone';
groundNames[4] = 'grasssand';
groundNames[5] = 'sandstone';
groundNames[6] = 'bush1';
groundNames[7] = 'bush2';
groundNames[8] = 'mushroom';
groundNames[9] = 'wall';
groundNames[10] = 'watersand';
groundNames[11] = 'wood';
groundNames[12] = 'window';

const objectNames = [];
objectNames[0] = '';
objectNames[1] = 'bush_2';
objectNames[2] = 'bush_3';
objectNames[3] = 'bush_5';
objectNames[4] = 'oak3';
objectNames[5] = 'oak2';


const groundIds = {
    water: 0,
    sand: 1,
    grass: 2,
    stone: 3,
    wood: 4,
    watersand: 5,
    grassand: 6,
    sandstone: 7,
    bush1: 8,
    bush2: 9,
    mushroom: 10,
    wall: 11,
    window: 12
}

const objectIds = {
    empty: 0,
    bush_2: 1,
    bush_3: 2,
    bush_5: 3,
    oak3: 4,
    oak2: 5,
}

const euclidean = (a, b) => {
    return a
        .map((x, i) => Math.abs( x - b[i] ) ** 2) // square the difference
        .reduce((sum, now) => sum + now) // sum
        ** (1/2)
}

const TAU = 2 * 3.14;

const generateField = (width, height, seed, offset, chunkSize) => {

    const gen = new SimplexNoise(seed);
    console.log(width, height, seed, offset, chunkSize);

    const noise2D = (nx, ny) => gen.noise2D(nx, ny),
    biome = (e) => {
        if (e < 0.1) {
            return groundIds.water;
        } else if (e < 0.15) {
            return groundIds.sand;
        }
        return groundIds.grass;
    },
    cylindernoise = (nx, ny) => {
        let angle_x = TAU * nx;
        return gen.noise3D(Math.cos(angle_x) / TAU, Math.sin(angle_x) / TAU, ny);
    },
    torusnoise = (nx, ny) => {
        let angle_x = TAU * nx, angle_y = TAU * ny;
        return gen.noise4D(Math.cos(angle_x) / TAU, Math.sin(angle_x) / TAU,
                       Math.cos(angle_y) / TAU, Math.sin(angle_y) / TAU);
    },
    biomeByCoord = (x, y, offset) => {
        let nx = offset.x + x / width * chunkSize.x, ny = offset.y + y / height * chunkSize.y,
        // e = (1 * noise(1 * nx, 1 * ny)
        // + 0.5 * noise(2 * nx, 2 * ny)
        // + 0.25 * noise(4 * nx, 4 * ny) + Math.sqrt(nx*nx + ny*ny) / Math.sqrt(0.5)) / 2,
        e = (1 + 1 * noise(1 * nx, 1 * ny)
        + 0.5 * noise(2 * nx, 2 * ny)
        + 0.25 * noise(4 * nx, 4 * ny) - Math.sqrt(nx*nx + ny*ny) / Math.sqrt(0.5)) / 2;
        return biome(e);
    },
    canAcces2NearChunks = (x, y) => {
        if (x == 0) {
            if (offset.x == 0) {
                return false;
            }
            return biomeByCoord(width, y, {x: offset.x - chunkSize.x, y: offset.y}) != groundIds.water;
        }
        if (y == 0) {
            if (offset.y == 0) {
                return false;
            }
            return biomeByCoord(x, height, {x: offset.x, y: offset.y - chunkSize.y}) != groundIds.water;
        }
        if (x == width) {
            if (offset.x == 1 - chunkSize.x) {
                return false;
            }
            return biomeByCoord(0, y, {x: offset.x + chunkSize.x, y: offset.y}) != groundIds.water;
        }
        if (y == height) {
            if (offset.y == 1 - chunkSize.y) {
                return false;
            }
            return biomeByCoord(x, 0, {x: offset.x, y: offset.y + chunkSize.y}) != groundIds.water;
        }
    },
    R = 5;
    width -= 1, height -= 1;

    const noise = torusnoise;

    let map = [new Array(width + 1).fill(groundIds.water)],
    rawObjects = [new Array(width + 1).fill(0)],
    rawWalkable = [new Array(width + 1).fill(0)];
    for (let y =0; y < height - 1; y++) {
        for (let x = 0; x < width - 1; x++) {
            if (x == 0) {
                map.push([0]);
                rawObjects.push([0]);
                rawWalkable.push([0]);
            }

            // map[y].push(groundIds.grass);
            rawObjects[y + 1].push(objectIds.empty);
            rawWalkable[y + 1].push(1);

            const bio = biomeByCoord(x, y, offset);
            if (bio == groundIds.water) {
                rawWalkable[y + 1][x + 1] = 0;
            }

            map[y + 1].push(bio);
            // noiseMap[y].push((1 + Math.min(1, 1 * noise(1 * nx, 1 * ny)
            // + 0.5 * noise(2 * nx, 2 * ny)
            // + 0.25 * noise(4 * nx, 4 * ny))) / 2);
        }
    }
    map.push(new Array(width + 1).fill(groundIds.water));
    rawObjects.push(new Array(width + 1).fill(0));
    rawWalkable.push(new Array(width + 1).fill(0))

    for (let x = 1; x < width; x++) {
        if (map[1][x] !== groundIds.water) {
            if (canAcces2NearChunks(x - 1, 0)) {
                map[0][x] = groundIds.stone;
                rawWalkable[0][x] = 1;
            } else {
                map[0][x] = groundIds.wall;
            }
        }
        if (map[height - 1][x] !== groundIds.water) {
            if (canAcces2NearChunks(x - 1, height)) {
                map[height][x] = groundIds.stone;
                rawWalkable[height][x] = 1;
            } else {
                map[height][x] = groundIds.wall;
            }
        }
    }

    for (let y = 1; y < height; y++) {
        if (map[y][1] !== groundIds.water) {
            if (canAcces2NearChunks(0, y - 1)) {
                map[y][0] = groundIds.stone;
                rawWalkable[y][0] = 1;
            } else {
                map[y][0] = groundIds.wall;
            }
        }
        rawWalkable[y].push(0);
        if (map[y][width - 1] !== groundIds.water) {
            if (canAcces2NearChunks(width, y - 1)) {
                map[y].push(groundIds.stone);
                rawWalkable[y][width] = 1;
            } else {
                map[y].push(groundIds.wall);
            }
        } else {
            map[y].push(groundIds.water);
        }
    }

    map[0][0] = groundIds.wall;
    map[height][0] = groundIds.wall;
    map[0][width] = groundIds.wall;
    map[height][width] = groundIds.wall;

    let viewport = [1, width - 1, 1, height - 1];
    var Sampling = new PoissonDisk(viewport, R, 30, new seedrandom(seed + offset));
    var allPoints = Sampling.all();
    Sampling.reset();

    while (true) {
      var point = Sampling.next();
      if (Sampling.done()) {
        break;
      }

      point.x = Math.floor(point.x);
      point.y = Math.floor(point.y);
      if (map[point.y][point.x] != groundIds.water) {
          rawObjects[point.y][point.x] = objectIds.oak2;
          rawWalkable[point.y][point.x] = 0;
      }
    }
    console.log(rawWalkable);
    ground = map, object = rawObjects, walkable = rawWalkable;
}

let object = [
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 1, 4, 0, 0, 4, 0, 0, 4, 3, 1, 2, 3, 0, 0, 0, 0, 0, 0, 4, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 1, 4, 0, 0, 4, 0, 0, 4, 3, 1, 2, 3, 0, 0, 0, 0, 0, 0, 4, 2, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

const direction = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

let walkable = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1],
  [1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0, 0, 1, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 1, 1],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const getGround = () => {return ground},
getObject = () => {return object},
getWalkable = () => {return walkable};

export default { getGround, getObject, direction, groundNames, objectNames, getWalkable, generateField };
