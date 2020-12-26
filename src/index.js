import Phaser from 'phaser';

const config = {
  // type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //  Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      gravity: {
        y: 400
      },
      debug: true,
    },
  },
  scene: {
    preload,
    create,
    update
  }
}

// sets the variables
function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
}

let bird
const VELOCITY = 200
let flapVelocity = 250

function create() {
  this.add.image(config.width / 2, config.height / 2, 'sky');
  bird = this.physics.add.sprite(config.width/10, config.height/2, 'bird').setOrigin(0);

  this.input.keyboard.on('keydown_SPACE', flap);
}

// 60fps
function update() {
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}


new Phaser.Game(config)