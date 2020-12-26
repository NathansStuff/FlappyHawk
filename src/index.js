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

function preload() {
  this.load.image('sky', 'assets/sky.png')
}

function create() {
  this.add.image(config.width / 2, config.height / 2, 'sky')
}

new Phaser.Game(config)