import Assets from '../Assets';
import uri from '../utils/uri';
import { PixelRatio, Alert } from 'react-native';
import { Phaser } from 'expo-phaser';
import Settings from '../Settings';
import seedrandom from 'seedrandom';

const scale = PixelRatio.get();

import EasyStar from 'easystarjs';
import Level from '../game/map';
import Dude from '../game/dude';

class State {
  cursor = { x: 0, y: 0 };
  static get size() {
    return 36;
  }

  static get startPosition() {
    return {
      x: State.size * (11 - 0.5),
      y: State.size * (11 - 0.5),
    };
  }

  // player;
  // aliens;
  // bullets;
  // bulletTime = 0;
  // //   cursors;
  // //   fireButton;
  // explosions;
  // starfield;
  // score = 0;
  // scoreText;
  // lives;
  // enemyBullet;
  // firingTimer = 0;
  // stateText;
  // livingEnemies = [];

  constructor({ game, context, seed }) {
    this.game = game;
    this.context = context;
    this.seed = seed;
  }

  preload = () => {
    const { game } = this;
    game.time.advancedTiming = true;
    game.debug.renderShadow = false;
    game.stage.disableVisibilityChange = true;
    game.plugins.add(new Phaser.Plugin.Isometric(game));
    game.world.setBounds(0, 0, 2048, 2048);
    game.iso.anchor.setTo(0.5, 0.5);

    game.load.atlasJSONHash(
      'tileset',
      uri(Assets.sprites['tileset.png']),
      uri(Assets.sprites['tileset.json']),
    );
    game.load.atlasJSONHash(
      'char',
      uri(Assets.sprites['char.png']),
      uri(Assets.sprites['char.json']),
    );
    game.load.atlasJSONHash(
      'object',
      uri(Assets.sprites['object.png']),
      uri(Assets.sprites['object.json']),
    );
    this.offset = {x: 0, y: 0};
    this.chunkSize = {x: 0.5, y: 0.5};
  };

  updateControls = ({ velocity }) => {
    const { player } = this;
  };

  get width() {
    return this.game.world.width;
  }
  get height() {
    return this.game.world.height;
  }

  get fieldWidth() {
      return 21;
  }

  get fieldHeight() {
      return 21;
  }

  scaleNode = node => {
    node.width *= scale;
    node.height *= scale;
  };

  setTouch = (x, y) => {

    this.cursor = {
      x: x,
      y: y
    };
  };
  onTouchesBegan = (x, y, callback) => {
    this.pressing = true;
    this.callback = callback;
    this.setTouch(x, y);
  };

  onTouchesMoved = (x, y) => {
    this.setTouch(x, y);
  };

  onTouchesEnded = (x, y) => {
    this.setTouch(-1, -1);
    this.pressing = false;
  };

  onClick = (x, y, callback) => {
      console.log('wtf');
      this.onTouchesBegan(x, y, callback);
      this.update();
      this.onTouchesEnded(x, y);
  };

  generateGround = (seed, offset, chunkSize) => {
      Level.generateField(this.fieldWidth, this.fieldHeight, seed, offset, chunkSize);
      Level.ground = Level.getGround();
      Level.object = Level.getObject();
      Level.walkable = Level.getWalkable();

      this.easystar.setGrid(Level.walkable);
      this.easystar.setAcceptableTiles([1]);
      this.easystar.disableCornerCutting();
      this.game.camera.scale.x = 1;
      this.game.camera.scale.y = 1;

        this.groundGroup.removeAll();
        this.objectGroup.removeAll();
        this.objectGroup.add(this.dude.sprite);

      // Generate ground
      for (let y = 0; y < Level.ground.length; y += 1) {
        for (let x = 0; x < Level.ground[y].length; x += 1) {
          const tile = this.game.add.isoSprite(
            State.size * x,
            State.size * y,
            0,
            'tileset',
            Level.groundNames[Level.ground[y][x]],
            this.groundGroup,
          );

          // Anchor is bottom middle
          tile.anchor.set(0.5, 1 - (tile.height - tile.width / 2) / tile.height);
          tile.scale.x = Level.direction[y][x];
          tile.initialZ = 0;

          if (Level.ground[y][x] === 0) {
            // Add to water tiles
            tile.initialZ = -4;
            this.water.push(tile);
          }

          if (Level.ground[y][x] === 4) {
            // Make bridge higher
            tile.isoZ += 4;
            tile.initialZ += 4;

            // Put tile under bridge
            const waterUnderBridge = this.game.add.isoSprite(
              State.size * x,
              State.size * y,
              0,
              'tileset',
              Level.groundNames[0],
              this.groundGroup,
            );
            waterUnderBridge.anchor.set(0.5, 1);
            waterUnderBridge.initialZ = -4;
            this.water.push(waterUnderBridge);
          }
        }
      }

      // Generate objects
      for (let y = 0; y < Level.object.length; y += 1) {
        for (let x = 0; x < Level.object[y].length; x += 1) {
          if (Level.object[y][x] !== 0) {
            const tile = this.game.add.isoSprite(
              State.size * x,
              State.size * y,
              0,
              'object',
              Level.objectNames[Level.object[y][x]],
              this.objectGroup,
            );

            // Anchor is bottom middle
            tile.anchor.set(0.5, 1);
            tile.initialZ = 0;
          }
        }
      }

      this.game.iso.simpleSort(this.groundGroup);
  }

  create = () => {
    const { game } = this;
    game.camera.follow(this.dude);

    this.groundGroup = this.game.add.group();
    this.objectGroup = this.game.add.group();
    this.water = [];
    this.cursorPos = new Phaser.Plugin.Isometric.Point3();
    this.easystar = new EasyStar.js(); // eslint-disable-line new-cap
    this.finding = false;

    // Create dude
    this.dude = new Dude(this.game, State.startPosition);
    this.game.camera.follow(this.dude.sprite);

    this.generateGround(this.seed, this.offset, this.chunkSize);

    let walkable = [];

    for (let y = 0; y < Level.ground.length; y += 1) {
      for (let x = 0; x < Level.ground[y].length; x += 1) {
          if (Level.walkable[y][x] === 1) {
              walkable.push([x, y]);
          }
      }
  }

  let rng = new seedrandom(this.seed);
  let startPos = walkable[Math.floor(rng() * walkable.length)];
  this.dude.x = State.size * (startPos[0] - 0.5),
  this.dude.y = State.size * (startPos[1] - 0.5);
};

  ii = 0;
  update = () => {
    // Update the cursor position.
    //
    // It's important to understand that screen-to-isometric projection means
    // you have to specify a z position manually, as this cannot be easily
    // determined from the 2D pointer position without extra trickery.
    //
    // By default, the z position is 0 if not set.

    const point = {
      x: (this.cursor.x + this.game.camera.x) / this.game.camera.scale.x,
      y: (this.cursor.y + this.game.camera.y) / this.game.camera.scale.y + 32,
    };
    this.game.iso.unproject(
      point,
      this.cursorPos,
      // this.game.camera.scale.x,
      // 1 - this.game.camera.scale.x,
    );

    if (this.ii % 5 == 0) {
      // console.log(this.cursor, this.cursorPos.x, this.cursorPos.y);
    }

    this.ii += 1;
    // Loop through all tiles
    this.groundGroup.forEach((t, iii) => {
      const tile = t;
      const x = tile.isoX / State.size;
      const y = tile.isoY / State.size;
      const inBounds = tile.isoBounds.containsXY(
        this.cursorPos.x,
        this.cursorPos.y,
      );
      // if (this.ii % 5 == 0) {
      //   console.log('a', x, y);
      // }
      if (inBounds) {
        // console.log('in it');
      }

      // Test to see if the 3D position from above intersects
      // with the automatically generated IsoSprite tile bounds.
      if (!tile.selected && inBounds && !this.water.includes(tile)) {
        // If it does, do a little animation and tint change.
        tile.selected = true;
        if (!tile.inPath) {
          tile.tint = 0x86bfda;
        }
        this.game.add.tween(tile).to(
          {
            isoZ: tile.initialZ + 4,
          },
          200,
          Phaser.Easing.Quadratic.InOut,
          true,
        );
      } else if (tile.selected && !inBounds) {
        // If not, revert back to how it was.
        tile.selected = false;
        if (!tile.inPath) {
          tile.tint = 0xffffff;
        }
        this.game.add.tween(tile).to(
          {
            isoZ: tile.initialZ + 0,
          },
          200,
          Phaser.Easing.Quadratic.InOut,
          true,
        );
      }

      if (!this.finding && this.pressing && inBounds) {
        // Start path finding
        this.finding = true;
        const dp = this.dudePosition();
        console.log(dp);
        this.easystar.findPath(dp.x, dp.y, x, y, this.processPath.bind(this));
        this.easystar.calculate();
      }
    });

    this.water.forEach(w => {
      const waterTile = w;
      waterTile.isoZ =
        waterTile.initialZ +
        -2 * Math.sin((this.game.time.now + waterTile.isoX * 7) * 0.004) +
        -1 * Math.sin((this.game.time.now + waterTile.isoY * 8) * 0.005);
      waterTile.alpha = Phaser.Math.clamp(1 + waterTile.isoZ * 0.1, 0.2, 1);
    });

    if (this.isMoving) {
      this.move();
    }

    this.game.iso.simpleSort(this.objectGroup);
  };

  processPath(path) {
    this.finding = false;
    if (!path || path.length === 0) {
      return;
    }

    // Keep moving if already moving towards same direction;
    if (
      this.isMoving &&
      this.pathIndex < this.path.length &&
      path.length > 1 &&
      this.path[this.pathIndex].x === path[1].x &&
      this.path[this.pathIndex].y === path[1].y
    ) {
      this.pathIndex = 1;
    } else {
      this.pathIndex = 0;
    }

    this.isMoving = true;

    // Loop tiles
    this.groundGroup.forEach(t => {
      const tile = t;
      if (tile.inPath) {
        // Clear tint from previous path
        tile.tint = 0xffffff;
      }
      const x = tile.isoX / State.size;
      const y = tile.isoY / State.size;
      const inPath = path.some(point => point.x === x && point.y === y);
      if (inPath) {
        tile.tint = 0xaa3333;
        tile.inPath = true;
      } else {
        tile.inPath = false;
      }
    });
    this.path = path;
  }

  dudePosition() {
    return {
      x: Math.round(this.dude.x / State.size + 0.5),
      y: Math.round(this.dude.y / State.size + 0.5),
    };
  }

  move() {
    if (!this.path || this.pathIndex == this.path.length) {
      // No path or finished moving
      this.isMoving = false;
      this.dude.stop();

      this.groundGroup.forEach(t => {
        const tile = t;
        if (tile.inPath) {
          // Clear tint from previous path
          tile.tint = 0xffffff;
        }
    });

    let startPos = {};
    const last = this.path[this.path.length - 1];
    if (last.x == 0) {
        if (this.offset.x > 0) {
            this.offset.x -= this.chunkSize.x;
            startPos.x = State.size * (this.fieldWidth - 1 - 0.5);
        }
    } else if (last.x + 1 == this.fieldWidth) {
        if (this.offset.x + this.chunkSize.x < 1) {
            this.offset.x += this.chunkSize.x;
            startPos.x = State.size * -0.5;
        }
    }
    if (last.y == 0) {
        if (this.offset.y > 0) {
            this.offset.y -= this.chunkSize.y;
            startPos.y = State.size * (this.fieldHeight - 1 - 0.5);
        }
    } else if (last.y + 1 == this.fieldHeight) {
        if (this.offset.y + this.chunkSize.y < 1) {
            this.offset.y += this.chunkSize.y;
            startPos.y = State.size * -0.5;
        }
    }

    this.path = null;

    if (startPos.x !== undefined || startPos.y !== undefined) {
        this.generateGround(this.seed, this.offset, this.chunkSize);
        this.dude.x = startPos.x !== undefined ? startPos.x : State.size * (last.x - 0.5);
        this.dude.y = startPos.y !== undefined ? startPos.y : State.size * (last.y - 0.5);
    }
    if (this.callback) {
        this.callback(last);
        this.callback = undefined;
    }

      return;
    }
    const target = this.path[this.pathIndex];
    const x = this.dude.x + State.size / 2 - target.x * State.size;
    const y = this.dude.y + State.size / 2 - target.y * State.size;
    if (x === 0 && y === 0) {
      // Reached next tile
      this.pathIndex += 1;
    } else if (x < 0 && y === 0) {
      this.dude.x += 1;
      this.dude.play('walkFrontLeft');
    } else if (x > 0 && y === 0) {
      this.dude.x -= 1;
      this.dude.play('walkBackLeft');
    } else if (x === 0 && y < 0) {
      this.dude.y += 1;
      this.dude.play('walkFrontRight');
    } else if (x === 0 && y > 0) {
      this.dude.y -= 1;
      this.dude.play('walkBackRight');
    }
  }
}

export default State;
