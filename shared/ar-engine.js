/*
 * Motor genérico de la experiencia AR.
 * No depende de ninguna pintura en particular: solo espera que el HTML
 * de cada cuadro defina estos tres elementos con estos IDs:
 *   #tapToStart   -> overlay que desbloquea el audio con el primer tap
 *   #target       -> <a-entity mindar-image-target="..."> del cuadro
 *   #musicaRitual -> <audio> a reproducir mientras el target está visible
 *
 * Cada carpeta en /paintings/<nombre>/ solo aporta su marker.mind,
 * su imagen/animación y su audio; esta lógica no cambia entre cuadros.
 */
(function () {
  const overlay = document.getElementById("tapToStart");
  const target = document.getElementById("target");
  const audio = document.getElementById("musicaRitual");

  let audioUnlocked = false;

  const AudioContext = window.AudioContext || window.webkitAudioContext;
  const audioContext = new AudioContext();
  const source = audioContext.createMediaElementSource(audio);
  source.connect(audioContext.destination);

  overlay.addEventListener("click", async () => {
    await audioContext.resume();
    audio.play();
    audio.pause();
    audio.currentTime = 0;

    audioUnlocked = true;
    overlay.style.display = "none";
  });

  target.addEventListener("targetFound", () => {
    if (!audioUnlocked) return;
    audio.play();
  });

  target.addEventListener("targetLost", () => {
    if (!audioUnlocked) return;
    audio.pause();
  });
})();
