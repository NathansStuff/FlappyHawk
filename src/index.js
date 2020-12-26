import Phaser from 'phaser';
import PlayScene from './scenes/playScene';
import MenuScene from './scenes/menuScene';
import preloadScene from './scenes/preloadScene';
import BestScoreScene from './scenes/bestScoreScene';
import PauseScene from './scenes/pauseScene';

const WIDTH = 800;
const HEIGHT = 600;
const BIRD_POSITION = {x: WIDTH /10, y: HEIGHT /2}

const SHARED_CONFIG = {
  width: WIDTH,
  height: HEIGHT,
  startPosition: BIRD_POSITION,
}

const Scenes = [preloadScene, MenuScene, PlayScene, PauseScene, BestScoreScene]

const initScenes = () => Scenes.map((Scene) => new Scene(SHARED_CONFIG))

const config = {
  // type: Phaser.AUTO,
  ...SHARED_CONFIG,
  physics: {
    //  Arcade physics plugin, manages physics simulation
    default: 'arcade',
    arcade: {
      debug: true,
    },
  },
  scene: initScenes()
}

new Phaser.Game(config)