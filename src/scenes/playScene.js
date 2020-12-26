import BaseScene from './baseScene';

const pipesToRender = 4

class PlayScene extends BaseScene {
    constructor(config) {
        super('PlayScene', config)

        this.bird = null;
        this.pipes = null;
        this.isPaused = false;
        
        this.pipeHoriontalDistance = 0;
        
        this.flapVelocity = 300;

        this.score = 0;
        this.scoreText = '';
        this.bestScore = 0;
        this.bestScoreText = '';

        this.currentDifficulty = 'easy';
        this.difficulties = {
            'easy': {
                pipeVerticalDistanceRange: [150,200],
                pipeHorizontalDistanceRange: [300,350]
            },
            'normal': {
                pipeVerticalDistanceRange: [140,190],
                pipeHorizontalDistanceRange: [280,330]
            },
            'hard': {
                pipeVerticalDistanceRange: [120,170],
                pipeHorizontalDistanceRange: [250,310]
            }
        }
    }

    create() {
        this.currentDifficulty = 'hard';
        super.create();
        this.createBird();
        this.createPipes();
        this.createColliders();
        this.createScore();
        this.handleInputs();
        this.createPauseButton();
        this.listenToEvents();

        this.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('bird', { start: 8, end: 15 }),
            frameRate: 8, 
            repeat: -1 // infinitely
        })
        this.bird.play('fly');
    }

    update() {
        this.checkGameStatus();
        this.recyclePipes();
    }

    createBG() {
        this.add.image(0,0, 'sky').setOrigin(0,0);
    }

    createBird() {
        this.bird = this.physics.add.sprite(this.config.startPosition.x, this.config.startPosition.y, 'bird')
        .setOrigin(0)
        .setFlipX(true)
        .setScale(3);
        this.bird.body.gravity.y = 600;
        this.bird.setCollideWorldBounds(true);
    }

    createPipes() {
        this.pipes = this.physics.add.group();

        for (let i=0; i < pipesToRender; i++) {
            const upperPipe = this.pipes.create(0,0, 'pipe')
                .setImmovable(true)    
                .setOrigin(0,1);

            const lowerPipe = this.pipes.create(0,0, 'pipe')
            .setImmovable(true)    
            .setOrigin(0,0);

            this.placePipe(upperPipe,lowerPipe)
        }
        this.pipes.setVelocityX(-200);
    }

    createColliders() {
        this.physics.add.collider(this.bird, this.pipes, this.gameOver, null, this);
    }

    createScore() {
        this.score = 0;
        const bestScore = localStorage.getItem('bestScore');
        this.scoreText = this.add.text(16, 16, `Score: ${this.score}`, { fontSize: '32px', fill: '#000'})
        this.add.text(16, 48, `Best Score: ${bestScore || 0}`, { fontSize: '18px', fill: '#000'})
    }

    createPauseButton() {
        this.isPaused = false;
        const pauseButton = this.add.image(this.config.width-10,this.config.height-10, 'pause')
            .setScale(3)
            .setInteractive()
            .setOrigin(1,1);
        pauseButton.on('pointerdown', () => {
            this.isPaused = true;
            this.physics.pause();
            this.scene.pause();
            this.scene.launch('PauseScene');
        })
    }

    listenToEvents() {
        if (this.pauseEvent) {return;}
        this.pauseEvent = this.events.on('resume', () => {
            this.initialTime = 3;
            this.countDownText = this.add.text(...this.screenCenter, 'Fly in: ' + this.initialTime, this.fontOptions).setOrigin(0.5);
            this.timedEvent = this.time.addEvent({
                delay: 1000,
                callback: this.countDown,
                callbackScope: this,
                loop: true 
            })
        })
    }

    countDown() {
        this.initialTime--;
        this.countDownText.setText('Fly in: ' + this.initialTime);
        if (this.initialTime <= 0) {
            this.isPaused = false;
            this.countDownText.setText('');
            this.physics.resume();
            this.timedEvent.remove();
        }
    }

    handleInputs() {
        this.input.keyboard.on('keydown_SPACE', this.flap, this);
    }

    checkGameStatus() {
        if(this.bird.y >= (this.config.height - this.bird.height) || this.bird.y <= 0) {
            this.gameOver();
          };
    }

    placePipe(uPipe, lPipe) {
        const difficulty = this.difficulties[this.currentDifficulty];
        const rightMostX = this.getRightMostPipe();
        const pipeVerticalDistance = Phaser.Math.Between(...difficulty.pipeVerticalDistanceRange);
        const pipeVerticalPosition = Phaser.Math.Between(0 + 20, this.config.height - 20 - pipeVerticalDistance);
        const pipeHorizontalDistance = Phaser.Math.Between(...difficulty.pipeHorizontalDistanceRange);
      
      
        uPipe.x = rightMostX + pipeHorizontalDistance;
        uPipe.y = pipeVerticalPosition;
      
        lPipe.x = uPipe.x;
        lPipe.y = uPipe.y + pipeVerticalDistance;
    }
    
    recyclePipes() {
        const tempPipes = [];
        this.pipes.getChildren().forEach(pipe => {
            if(pipe.getBounds().right <= 0) {
            tempPipes.push(pipe);
            if (tempPipes.length === 2) {
                this.placePipe(...tempPipes);
                this.increaseScore();
                this.increaseDifficulty();
            }
            }
        })
    }

    increaseDifficulty() {
        // + 3 pipes from now when its generated
        if(this.score === 1) {
            this.currentDifficulty = 'normal' // begins at pipe 5
        } else if (this.score === 4) {
            this.currentDifficulty = 'hard' // begins at pipe 8
        }
    }

    gameOver() {
        this.physics.pause();
        this.bird.setTint(0xff0000);

        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.restart();
            },
            loop: false
        })
        
        this.saveBestScore();
    }

    saveBestScore() {
        const bestScoreText = localStorage.getItem('bestScore');
        const bestScore = bestScoreText && parseInt(bestScoreText, 10);

        if (!bestScore || this.score > bestScore) {
            localStorage.setItem('bestScore', this.score);
        }
    }

    flap() {
        if (this.isPaused) { return; }
        this.bird.body.velocity.y = -(this.flapVelocity);
    }
      
    getRightMostPipe() {
        let rightMostX = 0;
        this.pipes.getChildren().forEach(function(pipe) {
          rightMostX = Math.max(pipe.x, rightMostX);
        })
      
        return rightMostX;
    }

    increaseScore() {
        this.score ++;
        this.scoreText.setText(`Score: ${this.score}`)
    }
}

export default PlayScene;