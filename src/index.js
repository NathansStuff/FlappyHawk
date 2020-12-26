import Phaser from 'phaser';

const config = {
  // type: Phaser.AUTO,
  width: 800,
  height: 600,
  physics: {
    //  Arcade physics plugin, manages physics simulation
    default: 'arcade'
  },
  scene: {
    preload,
    create
  }
}

// sets the variables
function preload() {
  this.load.image('sky', 'assets/sky.png')
  this.load.image('bird', 'assets/bird.png')
}

let bird

function create() {
  this.add.image(config.width / 2, config.height / 2, 'sky');
  // alternatively, image(0,0,'sky').setOrigin(0,0)

  bird = this.add.sprite(config.width/10, config.height/2, 'bird').setOrigin(0);
}
new Phaser.Game(config)