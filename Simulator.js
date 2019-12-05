let ball = {};
let Ambience;
let Chomp;

var panCount;

function preload()
{
  soundFormats('mp3');
	Ambience = loadSound('Ambience.mp3');
	Chomp = loadSound('Chomp.mp3');
	Distress = loadSound('Distress.mp3');
	masterVolume(0.2);
}

function setup()
{
  createCanvas(windowWidth, windowHeight);

	reverb = new p5.Reverb();
	reverb.process(Chomp, 1.25, 2.5); // p5.Reverb has parameters for time and decay rate
	// ambienceReverb = new p5.Reverb();
	// ambienceReverb.process(Ambience, 2, 3);

	Ambience.play();
	Ambience.loop();
}

function draw()
{
  background(0);

  ball.x = constrain(mouseX, 0, width);
  ellipse(ball.x, (height / 2), 100, 100);
}

function mousePressed()
{
	// Maps the ball's x location to a panning degree between -1.0 (left) and 1.0 (right)
	
  let panning = map(ball.x, 0, width, -1.0, 1.0);
	let randomMonsterSound = int(random(10));

	if (randomMonsterSound < 5)
	{
		Chomp.pan(panning);
		Chomp.play();
	}

	else if (randomMonsterSound >= 5)
	{
		Distress.pan(panning);
		Distress.play();
	}
}
