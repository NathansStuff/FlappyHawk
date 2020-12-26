import BaseScene from './baseScene';
import PlayScene from './playScene';

class BestScoreScene extends BaseScene {
    constructor(config) {
        super('BestScoreScene', config);
        this.config = config;
        this.bestScore = 0;
    }

    create() {
        super.create();
        const bestScore = localStorage.getItem('bestScore');
        this.add.text(...this.screenCenter, `Best Score: ${bestScore || 0}`, this.fontOptions).setOrigin(0.5);
    }
}

export default BestScoreScene;