import confetti from 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.module.mjs';

const canvas = document.getElementById("wheel");
const ctx = canvas.getContext("2d");
const inputsContainer = document.getElementById("inputs");
const boostSelect = document.getElementById("boostSelect");
let participants = [];
let winner = null;
let oldTargetAngle = 0;
let totalRotation = 0;

// Ajouter un champ
function addInput(value = "") {
  const input = document.createElement("input");
  input.placeholder = "Participant " + (inputsContainer.children.length + 1);
  input.value = value;
  input.addEventListener("input", updateParticipants);
  inputsContainer.appendChild(input);
  updateParticipants();
}
document.getElementById("addBtn").addEventListener("click", () => addInput());

// Mettre à jour la liste
function updateParticipants() {
  participants = Array.from(inputsContainer.querySelectorAll("input"))
    .map(el => el.value.trim())
    .filter(v => v)
    .map(name => ({ name, removed: false, weight: 1 }));
  refreshBoostList();
  drawWheel();
}

function refreshBoostList() {
  boostSelect.innerHTML = "";
  participants.filter(p => !p.removed).forEach(p => {
    const opt = document.createElement("option");
    opt.textContent = p.name;
    boostSelect.appendChild(opt);
  });
}

// Dessiner la roulette
function drawWheel() {
  const active = participants.filter(p => !p.removed);
  const radius = canvas.width / 2;
  const totalWeight = active.reduce((sum, p) => sum + p.weight, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const startOffset = -Math.PI / 2;
  let startAngle = startOffset;
  let Tour =  1;

  for (let i = 0; i < active.length; i++) {
    const slice = 2 * Math.PI * (active[i].weight / totalWeight);
    const endAngle = startAngle + slice;
    const gradient = ctx.createRadialGradient(radius, radius, 50, radius, radius, radius);
    gradient.addColorStop(0, `hsl(${i * 360 / active.length}, 60%, 55%)`);
    gradient.addColorStop(1, `hsl(${i * 360 / active.length}, 80%, 35%)`);
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, startAngle, endAngle);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(startAngle + slice / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "#f0e6d2";
    ctx.font = "bold 20px Cinzel";
    ctx.fillText(active[i].name, radius - 10, 5);
    ctx.restore();

    startAngle = endAngle;
  }
}

// 🎯 SPIN
function spin(isPreSpin = false) {
  const active = participants.filter(p => !p.removed);
  if (active.length === 0) return alert("Aucun participant !");
  
  // 🫥 Cacher le gagnant pendant le spin
  const winnerEl = document.getElementById("winner");
  winnerEl.style.display = "none";

  canvas.classList.add("spinning");
  let flashInterval = startBackgroundFlashes();

  const totalWeight = active.reduce((sum, p) => sum + p.weight, 0);
  let rand = Math.random() * totalWeight;
  let chosen, chosenIndex;
  for (let i = 0; i < active.length; i++) {
    rand -= active[i].weight;
    if (rand <= 0) {
      chosen = active[i];
      chosenIndex = i;
      break;
    }
  }

  const sliceAngles = active.map(p => (p.weight / totalWeight) * 360);
  let targetAngle = sliceAngles.slice(0, chosenIndex).reduce((a, b) => a + b, 0);
  targetAngle += Math.random() * sliceAngles[chosenIndex];

  const randomSpinsCount = Math.floor(Math.random() * 4) + 5;
  const randomSpins = 360 * randomSpinsCount;
  totalRotation = totalRotation + oldTargetAngle + randomSpins + (360 - targetAngle);
  canvas.style.transform = `rotate(${totalRotation}deg)`;
  oldTargetAngle = targetAngle;

  setTimeout(() => {
    if (isPreSpin && Math.random() <= 0.1) {
      // on affiche le nombre de tour si on tombe dans le pourcentage de relance
      Tour += 1;
      winnerEl.innerHTML = `🎯 ${Tour}ᵉ tour 🎯`;
      winnerEl.style.display = "block";
      winnerEl.style.animation = "winnerPop 1s ease-out, winnerPulse 1.5s infinite alternate";
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
      setTimeout(() => {
        spin(true);
         }, 5000);
    } else {
      winner = chosen;
      canvas.classList.remove("spinning");
      stopBackgroundFlashes(flashInterval);
      document.body.style.backgroundColor = "";

      // 🎉 Afficher le gagnant à la fin
      winnerEl.innerHTML = `🏆 ${winner.name.toUpperCase()} 🏆`;
      winnerEl.style.display = "block";
      winnerEl.style.animation = "winnerPop 1s ease-out, winnerPulse 1.5s infinite alternate";
      Tour = 1;
      // 🎊 Confettis
      confetti({ particleCount: 300, spread: 120, origin: { y: 0.6 } });
    }
  }, 5000);
}

// 🌈 Effet : fond qui clignote
function startBackgroundFlashes() {
  return setInterval(() => {
    document.body.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 10%)`;
  }, 200);
}

function stopBackgroundFlashes(interval) {
  clearInterval(interval);
  document.body.style.backgroundColor = "";
}

// Relancer sans gagnant
function relaunchWithoutWinner() {
  if (!winner) return alert("Lancez d'abord la roulette !");
  const target = participants.find(p => p.name === winner.name);
  if (target) target.removed = true;
  winner = null;
  drawWheel();
  refreshBoostList();
  setTimeout(() => spin(), 500);
}

function boostParticipant() {
  const name = boostSelect.value;
  const p = participants.find(p => p.name === name);
  if (p) {
    p.weight += 1;
    drawWheel();
  }
}

function reduceChance() {
  const name = boostSelect.value;
  const p = participants.find(p => p.name === name);
  if (p && p.weight > 1) {
    p.weight -= 1;
    drawWheel();
  }
}

document.getElementById("spinBtn").addEventListener("click", spin);
document.getElementById("relaunchBtn").addEventListener("click", relaunchWithoutWinner);
document.getElementById("boostBtn").addEventListener("click", boostParticipant);
document.getElementById("reduceBtn").addEventListener("click", reduceChance);

for (let i = 1; i <= 5; i++) addInput("");