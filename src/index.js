import Phaser from 'phaser';

const config = {
  // type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //  Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      // gravity: {
      //   y: 200
      // }
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

function create() {
  this.add.image(config.width / 2, config.height / 2, 'sky');
  // alternatively, image(0,0,'sky').setOrigin(0,0)

  bird = this.physics.add.sprite(config.width/10, config.height/2, 'bird').setOrigin(0);
  bird.body.velocity.x = VELOCITY;
}

// 60fps
function update() {
  if(bird.x >= (config.width - bird.width)) {
    bird.body.velocity.x = -(VELOCITY)
  } else if(bird.x <=0) {
    bird.body.velocity.x = VELOCITY;
  }
}


new Phaser.Game(config)