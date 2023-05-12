class Dungeon extends Phaser.Scene {
    constructor(){
        super('dungeon')
    }

    create(){
        this.add.text(50,50, "Entering Medusa's Lair");
        this.input.on('pointerdown', ()=>{
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('outro'));
        });
    }
}

class Intro extends Phaser.Scene {
    constructor() {
        super('intro')
    }
    create() {
        this.add.text(50,50, "Adventure awaits!").setFontSize(50);
        this.add.text(50,100, "Click anywhere to begin.").setFontSize(20);
        this.input.on('pointerdown', () => {
            this.cameras.main.fade(1000, 0,0,0);
            this.time.delayedCall(1000, () => this.scene.start('example'));
        });
    }
}

class Outro extends Phaser.Scene {
    constructor() {
        super('outro');
    }
    create() {
        this.add.text(50, 50, "That's all!").setFontSize(50);
        this.add.text(50, 100, "Click anywhere to restart.").setFontSize(20);
        this.input.on('pointerdown', () => this.scene.start('intro'));
    }
}

class Example extends Phaser.Scene
{
    constructor(){
        super('example');
    }
    lastFired = 0;
    cursors;
    stats;
    speed;
    wizard;
    bullets;

    preload ()
    {
        this.load.image('wizard', 'assets/pink pixel wizard.png');
        this.load.image('bullet', 'assets/pixel projectile.png');
    }

    create ()
    {
        class Bullet extends Phaser.GameObjects.Image
        {
            constructor (scene)
            {
                super(scene, 0, 0, 'bullet');

                this.speed = Phaser.Math.GetSpeed(400, 1);
            }

            fire (x, y)
            {
                this.setPosition(x, y - 50);

                this.setActive(true);
                this.setVisible(true);
            }

            update (time, delta)
            {
                this.y -= this.speed * delta;

                if (this.y < -50)
                {
                    this.setActive(false);
                    this.setVisible(false);
                }
            }
        }

        this.bullets = this.add.group({
            classType: Bullet,
            maxSize: 10,
            runChildUpdate: true
        });

        this.wizard = this.add.sprite(400, 500, 'wizard').setDepth(1);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.speed = Phaser.Math.GetSpeed(300, 1);
    }

    update (time, delta)
    {
        if (this.cursors.left.isDown)
        {
            this.wizard.x -= this.speed * delta;
        }
        else if (this.cursors.right.isDown)
        {
            this.wizard.x += this.speed * delta;
        }
        else if (this.cursors.up.isDown)
        {
            this.wizard.y -= this.speed * delta;
        }
        else if (this.cursors.down.isDown)
        {
            this.wizard.y += this.speed * delta;
        }

        if (this.cursors.space.isDown && time > this.lastFired)
        {
            const bullet = this.bullets.get();

            if (bullet)
            {
                bullet.fire(this.wizard.x, this.wizard.y);

                this.lastFired = time + 100;
            }
        }
    }
}

const game = new Phaser.Game({
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1920,
        height: 1080
    },
    scene: [Intro, Dungeon, Example, Outro],
    title: "Adventure Game",
});

