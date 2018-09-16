var debug = false;
var lunarMode = false;

var screenWidth = 1280; //1280
var screenHeight = 800; //800
var hudHeight = 67;
var gravity = 10 //gravitational constant
var accelMax = 75; //how much over gravity we can fall
var accelMin = -50;

var integrityMax = 2000;
var integrity;
var horizDamage = 1;
var vertDamage = 10;


//player variables
var player;
var playerStartX = screenWidth/2;
var playerStartY = 35;
var playerVelocity = 20;
var playerStartVelocity = 2;
var playerRotation = 170;

var helicopter;

var goldBonus = 100;
var silverBonus = 60;
var bronzeBonus = 40;
var goldX = 600;
var goldY = 560;
var silverX = 105;
var silverY = 705;
var bronzeX = 905;
var bronzeY = 760;

//spotlight animation stuff
var spotlights;
var killboxes;
var tweens;
var killBoxOffsetX = 110;
var killBoxOffsetY = 75;
var killBoxTrailX = 70;

//score variables
var score = 0;
var landingFactor = 1;

//bools/gamestates
var hasJumped = false;
var alive = true;
var landed = false;
var paused = false;


//UI
var hudText;
var messageText;
var message = 'Press Space to Launch';;

//inputs
var qKey;
var pKey;
var leftKey;
var rightKey;
var upKey;
var downKey;
var spaceKey;

//elapsed time
var startTime;
var endTime;
var currentTime;

//game actors
var platforms; //generic ground
var gold;
var silver;
var bronze;


//asset variables
var parachuteName = 'parachute';
var helicopterName = 'helicopter';
var groundName = 'ground';
var spotlightName = 'spotlight';
var killboxName = 'hitbox';
var backgroundName = 'background';
var blackBackgroundName = 'blackbackground';
var foregroundName = 'foreground';
var goldName = 'gold';
var silverName = 'silver';
var bronzeName = 'bronze';
var explosionName = 'explosion';

var parachutePath = 'assets/parachute.png';
var helicopterPath = 'assets/helicopter.png';
var groundPath = 'assets/ground.png';
var spotlightPath = 'assets/spotlight.png';
var killboxPath = 'assets/killbox.png';
var backgroundPath = 'assets/background.png';
var blackBackgroundPath = 'assets/blackbackground.png';
var foregroundPath = 'assets/foreground.png';
var goldPath = 'assets/gold.png';
var silverPath = 'assets/silver.png';
var bronzePath = 'assets/bronze.png';
var explosionPath = 'assets/explosion.png';

//audio
var spottedExplosionName = 'spotted_explosion';
var fallExplosionName = 'fall_explosion';
var winMusicName = 'win_music';
var startMusicName = 'start_music';
var loseMusicName = 'lose_music';
var backgroundMusicName = 'background_music';

var spottedExplosionPath = 'sound/fx/spotted_explosion.mp3';
var fallExplosionPath = 'sound/fx/fall_explosion.mp3';
var winMusicPath = 'sound/music/win_music.mp3';
var startMusicPath = 'sound/music/start_music.mp3';
var loseMusicPath = 'sound/music/lose_music.mp3';
var backgroundMusicPath = 'sound//music/background_music.mp3';

var backgroundMusic;
var winMusic;
var loseMusic;
var fallFX;
var spottedFX;
var menuMusic;

var black =  "#000000";
var white = "#ffffff";
var green = "#00b605";
var red = "#d91d23";
var goldColor = '#e3cd00';
var silverColor = '#d9d9d9';
var bronzeColor = '#ffa111';

var gameEnded = false;
