var Preloader = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Preloader() {
            Phaser.Scene.call(this, {key: 'preloader'});
        },

    preload: function () {

        if(debug) console.log("Loading Assets");
        this.load.image(backgroundName, backgroundPath);
        this.load.image(blackBackgroundName, blackBackgroundPath);
        this.load.image(groundName, groundPath);
        this.load.image(spotlightName, spotlightPath);
        this.load.image(killboxName, killboxPath);
        this.load.image(goldName, goldPath);
        this.load.image(silverName, silverPath);
        this.load.image(bronzeName, bronzePath);
        this.load.image(helicopterName, helicopterPath);
        this.load.spritesheet(parachuteName, parachutePath, { frameWidth: 64, frameHeight: 64, endFrame: 2 });
        this.load.spritesheet(explosionName, explosionPath, { frameWidth: 128, frameHeight: 128, endFrame: 18 });
    },

    create: function ()
    {

        if(debug) console.log("Creating Spritesheets");

        this.anims.create({
            key: 'left',
            frames: [ { key: parachuteName, frame: 0 } ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: parachuteName, frame: 1 } ],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: [ { key: parachuteName, frame: 2 } ],
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: explosionName,
            frames: this.anims.generateFrameNumbers(explosionName, { start: 0, end: 19, first: 0}),
            frameRate: 25,

        });

        this.scene.start('mainmenu');

    }


});