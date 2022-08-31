const canvas = document.querySelector("canvas");
canvas.width = 511;
canvas.height = 255;

const ctx = canvas.getContext("2d");

const gotStream = (stream) => {
  const audioContext = new AudioContext();

  const mediaStreamSource = audioContext.createMediaStreamSource(stream);

  const analyser = audioContext.createAnalyser();
  analyser.fftSize = 1024;
  analyser.smoothingTimeConstant = 0;

  mediaStreamSource.connect(analyser);
  //mediaStreamSource.connect( audioContext.destination );

  const data = new Uint8Array(analyser.frequencyBinCount);

  const loop = () => {
    analyser.getByteFrequencyData(data);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.beginPath()
    ctx.moveTo(0, data[0]);
    for(var i = 1; i < analyser.frequencyBinCount; i++) {
      ctx.lineTo(i, data[i]);
    };
    ctx.stroke();

    requestAnimationFrame(loop);
  };

  loop();
};

const buttonStart = document.querySelector(".start");

buttonStart.onclick = () => {
  buttonStart.disabled = true;
  navigator.getUserMedia(
    {audio: true}, gotStream, (error) => console.error(error));
};
