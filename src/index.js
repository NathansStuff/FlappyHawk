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

let bird

const pipeVerticalDistanceRange = [100,200]
const pipeHorizontalDistanceRange = [500,550]

let pipes
let pipeHoriontalDistance = 0
const VELOCITY = 200
const birdGravity = 400
const initialBirdPosition = {x: config.width * 0.1, y: config.height /2 }
let flapVelocity = 250
const pipesToRender = 4


// sets the variables
function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
  this.load.image('pipe', 'assets/pipe.png')
}

function create() {
  this.add.image(0,0, 'sky').setOrigin(0,0);
  bird = this.physics.add.sprite(initialBirdPosition.x, initialBirdPosition.y, 'bird').setOrigin(0);
  bird.body.gravity.y = birdGravity

  pipes = this.physics.add.group();

  for (let i=0; i < pipesToRender; i++) {
    const upperPipe = pipes.create(0,0, 'pipe').setOrigin(0,1);

    const lowerPipe = pipes.create(0,0, 'pipe').setOrigin(0,0);

    placePipe(upperPipe,lowerPipe)
  }
  pipes.setVelocityX(-200);

  this.input.keyboard.on('keydown_SPACE', flap);
}

// 60fps
function update() {
  if(bird.y <0 || bird.y >= config.height) {
    restartBirdPosition();
  }

  recyclePipes();

}



function placePipe(uPipe, lPipe) {
  const rightMostX = getRightMostPipe();
  const pipeVerticalDistance = Phaser.Math.Between(...pipeVerticalDistanceRange);
  const pipeVerticalPosition = Phaser.Math.Between(0 + 20, config.height - 20 - pipeVerticalDistance);
  const pipeHorizontalDistance = Phaser.Math.Between(...pipeHorizontalDistanceRange);


  uPipe.x = rightMostX + pipeHorizontalDistance;
  uPipe.y = pipeVerticalPosition;

  lPipe.x = uPipe.x;
  lPipe.y = uPipe.y + pipeVerticalDistance;
}

function flap() {
  bird.body.velocity.y = -flapVelocity;
}

function getRightMostPipe() {
  let rightMostX = 0;
  pipes.getChildren().forEach(function(pipe) {
    rightMostX = Math.max(pipe.x, rightMostX);
  })

  return rightMostX;
}

function restartBirdPosition() {
  bird.x = initialBirdPosition.x
  bird.y = initialBirdPosition.y
  bird.body.velocity.y = 0
}

function recyclePipes() {
  const tempPipes = [];
  pipes.getChildren().forEach(pipe => {
    if(pipe.getBounds().right <= 0) {
      tempPipes.push(pipe);
      if (tempPipes.length === 2) {
        placePipe(...tempPipes);
      }
    }
  })
}




new Phaser.Game(config)