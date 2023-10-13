window.onload = function load() {
  let canvas = document.getElementById("canv");
  if (!canvas) {
      console.error("Canvas element not found!");
      return;
  }

  let ctx = canvas.getContext("2d");

  let minutes = 2; // Set the initial minutes here
  let seconds = 0;
  let interval;
  let storedMinutes = minutes; // Store the initial minutes
  let storedSeconds = seconds; // Store the initial seconds
  let particles = [];

  let setTimeButton = document.getElementById('SetTime');
  if (setTimeButton) {
    setTimeButton.addEventListener('click', () => {
        storedMinutes = parseInt(document.getElementById('inputMinutes').value);
        storedSeconds = parseInt(document.getElementById('inputSeconds').value);
    });
  }

  function randomColor() {
      return '#' + Math.random().toString(16).slice(2, 8);
  }

  function randomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function createParticle(x, y) {
      return {
          location: {
              x: x,
              y: y
          },
          speed: {
              x: -2.5 + Math.random() * 5,
              y: -2.5 + Math.random() * 5
          },
          color: randomColor(),
          fontSize: randomInt(10, 30),
          word: "BALLS!"
      };
  }

  function flyText(ctx) {
      const numberOfParticles = 50;
      for (let i = 0; i < numberOfParticles; i++) {
          const xPos = Math.random() * window.innerWidth;
          const yPos = Math.random() * window.innerHeight;
          const particle = createParticle(xPos, yPos);
          particles.push(particle);

          ctx.fillStyle = particle.color;
          ctx.fillRect(particle.location.x, particle.location.y, particle.fontSize, particle.fontSize);
      }
  }

  function draw() {
      ctx.globalCompositeOperation = "source-over"; // Set blending mode to replace existing pixels

      // Clear the canvas by filling it with a solid color (optional, depends on your use case)
      ctx.fillStyle = "grey"; // Set the background color
      ctx.fillRect(0, 0, canvas.width, canvas.height); // Fill the canvas with the background color

      // Draw the flying text particles
      for (let i = 0; i < particles.length; i++) {
          let p = particles[i];
          ctx.beginPath();
          ctx.font = p.fontSize + "px Luckiest Guy";
          ctx.textAlign = "center";
          ctx.fillStyle = p.color;
          ctx.fillText(p.word, p.location.x, p.location.y);
          ctx.fill();
          ctx.stroke();

          p.location.x += p.speed.x;
          p.location.y += p.speed.y;
          p.speed.x += randomInt(-0.01, 0.01);
          p.speed.y += randomInt(-0.01, 0.01);
      }

      ctx.globalCompositeOperation = "source-over"; // Reset blending mode (optional, in case you modify it elsewhere)
  }

  function updateTimerDisplay() {
      document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
      document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
  }

  function startTimer() {
      interval = setInterval(() => {
          if (minutes === 0 && seconds === 0) {
              clearInterval(interval);
              flyText(ctx);
          } else {
              if (seconds === 0) {
                  if (minutes > 0) {
                      minutes--;
                      seconds = 59;
                  } else {
                      // Ensure minutes don't go negative
                      minutes = 0;
                      // Set seconds to zero to stop the timer when it reaches below zero
                      seconds = 0;
                      clearInterval(interval);
                  }
              } else {
                  seconds--;
              }
              updateTimerDisplay();
          }
      }, 1000);
  }


  let startButton = document.getElementById('Start');
  let stopButton = document.getElementById('Stop');
  let resetButton = document.getElementById('Reset');

  if (startButton) {
      startButton.addEventListener('click', startTimer);
  }

  if (stopButton) {
      stopButton.addEventListener('click', () => {
          clearInterval(interval);
      });
  }

  function resetTimer() {
      clearInterval(interval);
      minutes = storedMinutes; // Reset to stored minutes
      seconds = storedSeconds; // Reset to stored seconds
      updateTimerDisplay();
      clearCanvas();
  }

  if (resetButton) {
      resetButton.addEventListener('click', resetTimer);
  }

  function clearCanvas() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles = [];
  }

  setInterval(draw, 10);
}
