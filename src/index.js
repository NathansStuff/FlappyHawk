import Phaser from 'phaser';

const config = {
  // type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //  Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
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
  this.load.image('pipe', 'assets/pipe.png')
}

let bird

const pipeVerticalDistanceRange = [100,200]
let pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange)
let pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance)

let upperPipe
let lowerPipe
const VELOCITY = 200
const birdGravity = 400
const initialBirdPosition = {x: config.width * 0.1, y: config.height /2 }
let flapVelocity = 250

function create() {
  this.add.image(0,0, 'sky').setOrigin(0,0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = birdGravity

  upperPipe = this.physics.add.sprite(300,pipeVerticalPosition, 'pipe').setOrigin(0,1)

  lowerPipe = this.physics.add.sprite(upperPipe.x, upperPipe.y+pipeVerticalDistance, 'pipe').setOrigin(0,0)

  this.input.keyboard.on('keydown_SPACE', flap);
}

// 60fps
function update() {
  if(bird.y <0 || bird.y >= config.height) {
    restartBirdPosition()
  }
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
  bird.body.velocity.y = 0
}


new Phaser.Game(config)