var Game = new Phaser.Class({

    Extends: Phaser.Scene,

    initialize:

        function Game() {
            Phaser.Scene.call(this, {key: 'game'});
            window.GAME = this;

            this.controls;
            this.track;
        },

    create: function () {

        if(debug) console.log("Enter Create");
        if(debug) console.log("Initializing Sprites");

        //static group for ground, these are unnaffected by physics
        platforms = this.physics.add.staticGroup();
        platforms.create(screenWidth/2,screenHeight, groundName).setDisplaySize(screenWidth, screenHeight/15).refreshBody();

        //set background
        this.add.image(screenWidth / 2, screenHeight / 2, backgroundName).setDisplaySize(screenWidth,screenHeight);

        //create landing zones
        gold = this.physics.add.staticGroup();
        gold.create(goldX, goldY, goldName).setSize(80,0,true).setVisible(false);
        this.add.text(goldX-2, goldY+10, 'Gold', {fontSize: '16px', fill: goldColor});

        silver = this.physics.add.staticGroup();
        silver.create(silverX, silverY, silverName).setSize(70,0,true).setVisible(false);;
        this.add.text(silverX-15, silverY+10, 'Silver', {fontSize: '16px', fill: silverColor});

        bronze = this.physics.add.staticGroup();
        bronze.create(bronzeX, bronzeY, bronzeName).setSize(70,0,true).setVisible(false);;
        this.add.text(bronzeX-15, bronzeY+10, 'Bronze', {fontSize: '16px', fill: bronzeColor});


        //add helicopter
        helicopter = this.physics.add.sprite(playerStartX, playerStartY, helicopterName).setDisplaySize(64,64);
        helicopter.setBounce(0);
        helicopter.setGravityY(-1 * gravity); //for now we have to suspend these objects
        helicopter.setGravityX(0);
        helicopter.setCollideWorldBounds(true);

        //add player sprite to game world
        player = this.physics.add.sprite(playerStartX, playerStartY, parachuteName);
        player.setBounce(0);
        player.setCollideWorldBounds(true);
        player.setCircle(player.width/2)
        player.visible = false;

        this.physics.pause();

        //collider between player and platforms
        this.physics.add.collider(player, platforms, playerCrash, null, this);

        //for landing zones
        this.physics.add.collider(player, gold, landGold, null, this);
        this.physics.add.collider(player, silver, landSilver, null, this);
        this.physics.add.collider(player, bronze, landBronze, null, this);

        //static group for spotlight
        spotlights = [];
        killBoxes = [];
        tweens = []; //keep track of tweens so we can pause/unpause them


        if(debug) console.log("Creating Tweens");
        //to add a spotlight, add the x and y coordinates, and the rotation below
        var xSP = [540, 656, 844, 211, 60];
        var ySP = [430, 482, 648, 558, 625];
        var rotSP = [-90,-90, -90, -90, -90];
        var durSP = [5000,3000,5000,5000, 5000];

        for(let i = 0; i < xSP.length; i++){
            var temp = this.physics.add.image(xSP[i], ySP[i], spotlightName);
            temp.setScale(0.1).setRotation(rotSP[i]);
            temp.setGravityY(-1 * gravity); //for now we have to suspend these objects
            temp.setGravityX(0);
            spotlights.push(temp);
        }

        //create tweens for spotlights, in the future we can add more configs for different spotlight types
        for (let i = 0; i < spotlights.length; i++) {
            var temp = this.tweens.add({
                targets: spotlights[i],
                angle: 45,
                duration: durSP[i],
                ease: 'Power.5',
                yoyo: true,
                delay: 1000,
                loop: -1
            });

            tweens.push(temp);
        }

        //initialize killzones, creates the hitbox that floats above the spotlight
        for (let i = 0; i < spotlights.length; i++) {

            var killbox = this.physics.add.image((spotlights[i].x - killBoxOffsetX), (spotlights[i].y - killBoxOffsetY), killboxName);
            killbox.setScale(0.1);
            killbox.setGravityY(-1 * gravity);
            killbox.setGravityX(0);

            var temp = this.tweens.add({
                targets: killbox,
                x: (spotlights[i].x + killBoxTrailX),
                duration: 5000,
                ease: 'Power.5',
                yoyo: true,
                delay: 1000,
                loop: -1
            });

            killbox.setCircle(killbox.width/2);
            killBoxes.push(killbox);
            tweens.push(temp);
        }


        //overlap between player and spotlights
        for (let i = 0; i < spotlights.length; i++) {

            this.physics.add.overlap(player, killBoxes[i], playerSeen, null, this);

        }

        if(debug) console.log("Creating UI");
        //initialize UI
        var headerPanel = new Phaser.Geom.Rectangle(0, 0, screenWidth, 2*playerStartY/3);
        var graphics = this.add.graphics({ fillStyle: { color: 0x000000 } });
        graphics.fillRectShape(headerPanel);
        this.hudText = this.add.text(2, 2, '   ', {fontSize: '16px', fill: white});
        messageText = this.add.text(screenWidth/2-100, 2, message, {fontSize: '16px', fill: green});

        if(debug) console.log("Initializing Input");
        //setup key press listeners
        qKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
        pKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
        leftKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        rightKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        upKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        downKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        enterKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);

    },


    update: function () {


        //allow player to reset midair
        if (qKey.isDown && hasJumped &&!gameEnded) {
            this.physics.pause();
            pauseTweens(tweens);
            this.restart()
            if(debug) console.log("Q Pressed");
            qKey.reset();
        }

        if(pKey.isDown && !gameEnded && hasJumped){

            if(paused==false){
                this.physics.pause();
                pauseTweens(tweens);
                paused = true;
            } else{
                this.physics.resume();
                UnPauseTweens(tweens);
                paused = false;
            }

            pKey.reset();

        }

        //if the parachute hasnt jumped yet, wait for signal to
        if (spaceKey.isDown && !hasJumped) {
            hasJumped = true;
            player.visible = true;
            helicopter.visible = false;
            message = '';
            this.physics.resume();
            startTime = new Date();
            currentTime = startTime;
            if(debug) console.log("Space Pressed");
            if(debug) console.log("Start Time is " + startTime);
        }

        //if parachute has jumped, start tracking time
        if (hasJumped && alive && !landed && !paused) {
            currentTime = new Date();
            var elapsed = currentTime - startTime;
            this.hudText.setText('Time: ' + parseInt((elapsed / 1000).toString())
                + '  Accel: ' + player.body.acceleration.y
                + '  X: ' + parseInt(player.x).toString()
                + '  Y: ' + parseInt(player.y).toString());
            this.hudText.setColor(white);
        }

        //if player is midair
        if (hasJumped) {
            if (leftKey.isDown) {
                player.setVelocityX(-1 * playerVelocity);
                player.setRotation(45);

            } else if (rightKey.isDown) {
                player.setVelocityX(playerVelocity);
                player.setRotation(-45);

            } else if (upKey.isDown) {
                if (player.body.acceleration.y > (-1 * gravity)) { //player cant fall upwards
                    var decrement = player.body.acceleration.y - 1;
                    player.body.setAccelerationY(decrement);
                } else{
                    if(debug) console.log("Player at min acceleration");
                }

                player.setRotation(0);

            } else if (downKey.isDown) {

                if (player.body.acceleration.y < accelMax) {
                    var increment = player.body.acceleration.y + 1;
                    player.body.setAccelerationY(increment);
                } else{
                    if(debug) console.log("Player at max acceleration");
                }

                player.setRotation(0);

            } else {
                if (hasJumped) {
                   //set back to original rotiation
                    player.setRotation(0);
                }
            }
        }
        //if player is choosing starting position
        else if (!hasJumped) {
            if (leftKey.isDown) {

                helicopter.flipX = false;

                player.x -= playerStartVelocity;
                helicopter.x = player.x;


            } else if (rightKey.isDown) {

                helicopter.flipX = true;

                player.x += playerStartVelocity;
                helicopter.x = player.x;

            } else {
            }
        }
        //if the player jumped and died, present lose screen
        if (!alive && hasJumped &&!landed) {

            if(!gameEnded){
                this.physics.pause();
                pauseTweens(tweens);
                this.doDeath();
                gameEnded = true;
            }

            if (enterKey.isDown) {
                enterKey.reset();
                this.restart();
                this.scene.start('mainmenu');
            }

        }
        //if the player landed on a zone, display this
        if (alive && hasJumped && landed) {

            if(!gameEnded){
                this.physics.pause();
                pauseTweens(tweens);
                this.doLand();
                gameEnded = true;
            }
            if (enterKey.isDown) {
                enterKey.reset();
                this.restart();
                this.scene.start("mainmenu");
            }
        }
    }, restart: function (){

        //reset variables
        gameEnded = false;
        hasJumped = false;
        alive = true;
        landed = false;
        score = 0;
        messageText.setText(message);
        player.setVelocity(0, 0);
        player.body.setAccelerationY(0);
        player.x = playerStartX;
        player.y = playerStartY;
        player.visible = false;
        helicopter.visible = true;

        for(let i = 0; i < platforms.length; i++){

            platforms[i].setVelocity(0, 0);
            platforms[i].setAngularVelocity(0);
            platforms[i].setGravityY(-1*gravity);
            platforms[i].setGravityX(0);
        }

        UnPauseTweens(tweens);

        if(debug) console.log("Restarting Game");
    },

    doLand: function () {

            player.setVelocity(0, 0);
            endTime = new Date();

            var diffTime = endTime - startTime;
            score = landingFactor - (diffTime / 1000); //the less time it took the better
            messageText.setText('You Win! Score ' + parseInt(score) + ' Press Enter to Restart');
            messageText.setColor(green);

    },

    doDeath: function(){

    messageText.setText('You Lose! Enter to Restart');
    messageText.setColor(red);
    player.setVelocity(0,0);

}

});

