let cursor = {}; // Vector that tracks the cursor's coordinates
let frameTimer;
let baseHeight;

let maxNumberOfChompeds = 3; // Max number of Chompeds that can inhibit the world
let chompeds = [];

let deathMark = 0;
let deathCountDown = 5;

screen = "GameIntro";

function preload()
{
	Ambience = loadSound('White_Noiz.mp3');
	Background = loadSound('Background.mp3');
	Chomp = loadSound('Chomp.mp3');
	Distress = loadSound('Distress.mp3');
	Sword = loadSound('Sword.mp3');
	ChompedDeath = loadSound('Chomped_Death.mp3');
	PlayerDistress = loadSound('Player_Distress.mp3');
	PlayerDeath = loadSound('Player_Death.mp3');
	Heartbeat = loadSound('Heartbeat_Sound.mp3');
	LeftFootstep = loadSound('Left_Footsteps.mp3');
	RightFootstep = loadSound('Right_Footsteps.mp3');

	baseHeight = windowHeight * (7/8); // Sets the y-coordinate for all entities
}

function setup()
{
  createCanvas(windowWidth, windowHeight);
	background(0);
	mainPlayer = new Player((width / 2), 100); // Creates the player from the Player class written at the bottom of the document
	mainDagger = new Dagger(mainPlayer.startPosition); // Creates the dagger for the Player to wield

	chompReverb = new p5.Reverb(); // Adds reverb to the "Chomp" sound effect
	chompReverb.process(Chomp, 1.5, 2.0);

	distressReverb = new p5.Reverb(); // Adds reverb to the "Distress" sound effect
	distressReverb.process(Distress, 1.5, 2.0);

	Ambience.play(0, 1, 0);
	Ambience.loop();

	Background.play(0, 1, 0.1);
	Background.loop();
}

function draw()
{
  background(0);
	frameTimer = (frameCount + 100) % 1000;

	mainDagger.display();
	mainPlayer.display();

	if (screen == "GameEnd") // End of the game
	{
		background(0);

		push();
		fill(178, 120, 51);
		textAlign(CENTER);
		textFont("Courier");
		textSize(100);
		text("END OF SIMULATION", (width / 2), (height / 2));
		pop();

		// PlayerDeath.play(0.25);
		Ambience.setVolume(0, 0.5);
		Sword.setVolume(0);
		Chomp.setVolume(0);
		Distress.setVolume(0);
		PlayerDistress.setVolume(0);

	}

	else if (screen == "GameIntro") // Starting screen
	{
		Sword.setVolume(0);

		push();
		fill(178, 120, 51);
		textAlign(CENTER);
		textFont("Courier");
		textSize(100);
		text("SIMULATOR", (width / 2), (height / 2));
		pop();

		push();
		fill(178, 120, 51);
		textAlign(CENTER);
		textFont("Courier");
		textSize(50);
		text("Press DOWN to start simulation", (width / 2), (height - 250));
		pop();

		if (keyPressed && (keyCode == DOWN_ARROW))
		{
			Sword.setVolume(1);
			Ambience.setVolume(0.1, 1);
			screen = "GameStart";
		}
	}

	else if (screen == "GameStart") // Game starts and plays out
	{
		if ((frameTimer % int(random(300, 350))) == 0) // Has a chance to spawn a Chomped every 300 frames
		{
			if (chompeds.length < maxNumberOfChompeds) // Checks how many Chompeds can be onscreen
			{
				let spawnChanceRoll = int(random(10));

				if (spawnChanceRoll < 5)
				{
					chompeds.push(new Chomped(100, 75));
				}
			}
		}
		for (var i = 0; i < chompeds.length; i ++) // Spawns the Chompeds
		{
			chompeds[i].display();
			chompeds[i].move(mainPlayer.startPosition, mainPlayer.size);
			chompeds[i].chompSoundEffect(i);

			if (chompeds[i].spawnPosition > mainPlayer.startPosition) // Checks if the Chomped is to the right of the player
			{
				if ((chompeds[i].spawnPosition - (chompeds[i].size / 2)) - (mainPlayer.startPosition + (mainPlayer.size / 2)) <= 0)
				{
					deathMark ++;

					if ((deathMark % 100) == 0) // Plays PlayerDistress when a Chomped touches the player
					{
						PlayerDistress.play();
						deathCountDown --;
					}

					if ((deathCountDown == 1) && ((deathMark % 100) == 0)) // Starts the heart beating if on one life
					{
						Heartbeat.play(0, 0.5);
						Heartbeat.loop();
					}

					if (deathCountDown == 0) // Takes player to end screen when dead
					{
						PlayerDeath.play();
						Heartbeat.setVolume(0);
						screen = "GameEnd";
					}
				}
			}

			else if (chompeds[i].spawnPosition < mainPlayer.startPosition) // Checks if the Chomped is to the left of the player
			{
				if ((mainPlayer.startPosition - (mainPlayer.size / 2)) - (chompeds[i].spawnPosition + (chompeds[i].size / 2)) <= 0)
				{
					deathMark ++;

					if ((deathMark % 100) == 0) // Plays PlayerDistress when a Chomped touches the player
					{
						PlayerDistress.play();
						deathCountDown --;
					}

					if ((deathCountDown == 1) && ((deathMark % 100) == 0)) // Starts the heart beating if on one life
					{
						Heartbeat.play(0, 0.5);
						Heartbeat.loop();
					}

					if (deathCountDown == 0) // Takes player to end screen when dead
					{
						PlayerDeath.play();
						Heartbeat.setVolume(0);
						screen = "GameEnd";
					}
				}
			}
		}
	}
}

function mousePressed() // Activates the sword
{
	Sword.play(0, 1.3, 0.5);
	for (var i = 0; i < chompeds.length; i ++)
	{
		if (chompeds[i].spawnPosition > mainPlayer.startPosition) // Checks if the Chomped is to the right of the player
		{
			if (((chompeds[i].spawnPosition - (chompeds[i].size / 2)) - (mainDagger.daggerPosition + 175)) <= 0) // Finds if the dagger and a Chomped reach other
			{
				Distress.play();
				chompeds.splice(i, 1);
			}
		}
		else if (chompeds[i].spawnPosition < mainPlayer.startPosition) // Checks if the Chomped is to the left of the player
		{
			if (((mainDagger.daggerPosition - 175) - (chompeds[i].spawnPosition + (chompeds[i].size / 2))) <= 0)
			{
				Distress.play();
				chompeds.splice(i, 1);
			}
		}
	}
}

function keyPressed() // Horizontal movement for the playable entity
{
	if (keyCode == LEFT_ARROW)
	{
		if (mainPlayer.startPosition >= 0)
		{
			mainPlayer.move(-mainPlayer.size, 0);
			mainDagger.move(-mainPlayer.size, 0);
			LeftFootstep.play();
		}
	}

	if (keyCode == RIGHT_ARROW)
	{
		if (mainPlayer.startPosition <= width)
		{
			mainPlayer.move(mainPlayer.size, 0);
			mainDagger.move(mainPlayer.size, 0);
			RightFootstep.play();
		}
	}
}

  /////////////////////////////////////////////////////////////////////
 ////////////////////////////// CLASSES //////////////////////////////
/////////////////////////////////////////////////////////////////////

class Player // Player class for creating a playable character
{
	constructor(startPosition, size)
	{
		this.startPosition = startPosition;
		this.size = size;
	}

	display() // Displays a white rectangle at the player's location
	{
		push();
		fill(220, 220, 0);
		rectMode(CENTER);
		square(this.startPosition, baseHeight, this.size);
		pop();
	}

	move(speed)
	{
		this.startPosition += speed;
	}
}

class Chomped // Creates Chomped entities that the player must defeat
{
	constructor(size, health)
	{
		this.size = size;
		this.health = health;

		this.spawnPosition = 0;
		this.isHitByPlayer = false;

		this.randomSideSpawn = int(random(10));
		if (this.randomSideSpawn < 5) // Spawns the Chomped on the left side of the screen
		{
			this.spawnPosition = 0;
		}
		else if (this.randomSideSpawn >= 5) // Spawns the Chomped on the right side of the screen
		{
			this.spawnPosition = width;
		}
	}

	display()
	{
		push();
		rectMode(CENTER);

		fill(0, 100, 0);

		if (this.spawnPosition > mainPlayer.startPosition) // Checks if the Chomped is to the right of the player
		{
			if (((this.spawnPosition - (this.size / 2)) - (mainDagger.daggerPosition + 175)) <= 0) // Finds if the dagger and a Chomped overlap
			{
				fill(100, 0, 0);
			}
		}
		else if (this.spawnPosition < mainPlayer.startPosition) // Checks if the Chomped is to the left of the player
		{
			if (((mainDagger.daggerPosition - 175) - (this.spawnPosition + (this.size / 2))) <= 0) // Finds if the dagger and a Chomped overlap
			{
				fill(100, 0, 0);
			}
		}
		square(this.spawnPosition, baseHeight, this.size);
		pop();
	}

	move(playerPosition, playerSize) // Makes the Chomped move toward the player
	{
		if (this.spawnPosition < (playerPosition - (playerSize / 10)))
		{
			this.spawnPosition += int(random(2));
		}
		else if (this.spawnPosition > (playerPosition + (playerSize / 10)))
		{
			this.spawnPosition -= int(random(2));
		}
	}

	chompSoundEffect(index) // Triggers the "Chomp" sound effect occasionally
	{
		let indexFrame = index * 100;

		if (indexFrame == frameTimer || (indexFrame + 250) == frameTimer || (indexFrame + 500) == frameTimer || (indexFrame + 750) == frameTimer)
		{
			let panningFromLeft = map(this.spawnPosition, 0, mainPlayer.startPosition, -1.0, 0.0);
			let panningFromRight = map(this.spawnPosition, mainPlayer.startPosition, width, 0.0, 1.0);
			let distanceFromLeft = map(this.spawnPosition, 0, mainPlayer.startPosition, 0.1, 0.8, true);
			let distanceFromRight = map(this.spawnPosition, mainPlayer.startPosition, width, 0.8, 0.1, true);

			if (this.spawnPosition == mainPlayer.startPosition)
			{
				Chomp.play(2, random(0.75, 1.00), 0.75);
			}
			else if (this.spawnPosition < mainPlayer.startPosition)
			{
				Chomp.pan(panningFromLeft);
				Chomp.play(2, random(0.75, 1.00), distanceFromLeft);
			}
			else if (this.spawnPosition > mainPlayer.startPosition)
			{
				Chomp.pan(panningFromRight);
				Chomp.play(2, random(0.75, 1.00), distanceFromRight);
			}
		}
	}
}

class Dagger
{
	constructor(daggerPosition)
	{
		this.daggerPosition = daggerPosition;
	}

	display()
	{
		push();
		fill(200);
		rectMode(CENTER);
		rect(this.daggerPosition, baseHeight, 350, 10);
		pop();
	}

	move(speed)
	{
		this.daggerPosition += speed;
	}
}
