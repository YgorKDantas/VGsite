const progressBar = document.querySelector(".scroll-progress");
const topbar = document.querySelector(".topbar");
const glow = document.querySelector(".mouse-glow");
const revealElements = document.querySelectorAll(".reveal");
const mobileMenuBtn = document.getElementById("mobileMenuBtn");
const mobileMenu = document.getElementById("mobileMenu");
const leadForm = document.getElementById("leadForm");
const successModal = document.getElementById("successModal");
const closeModal = document.getElementById("closeModal");

const whatsappNumber = "5521992076599";

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

  progressBar.style.width = `${progress}%`;

  if (scrollTop > 20) {
    topbar.style.background = "rgba(2, 3, 12, 0.82)";
  } else {
    topbar.style.background = "rgba(2, 3, 12, 0.58)";
  }
});

window.addEventListener("mousemove", (event) => {
  if (!glow) return;
  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealElements.forEach((element) => revealObserver.observe(element));

mobileMenuBtn?.addEventListener("click", () => {
  mobileMenu.classList.toggle("active");
});

document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.remove("active"));
});

function animateCounter(element, target) {
  let current = 0;
  const duration = 1300;
  const start = performance.now();

  function update(now) {
    const progress = Math.min((now - start) / duration, 1);
    current = Math.floor(progress * target);
    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    const element = entry.target;
    const target = Number(element.dataset.counter);

    if (!Number.isNaN(target)) {
      animateCounter(element, target);
      counterObserver.unobserve(element);
    }
  });
}, { threshold: 0.4 });

document.querySelectorAll("[data-counter]").forEach((counter) => {
  counterObserver.observe(counter);
});

const plates = [
  { plate: "FSR6A62", status: "VEÍCULO AUTORIZADO", type: "allowed", confidence: "97%", camera: "Entrada 01" },
  { plate: "RJO2D19", status: "VISITANTE REGISTRADO", type: "allowed", confidence: "94%", camera: "Entrada 02" },
  { plate: "KPV7C41", status: "ALERTA BLACKLIST", type: "denied", confidence: "98%", camera: "Entrada 01" },
  { plate: "LNA4B88", status: "VEÍCULO AUTORIZADO", type: "allowed", confidence: "96%", camera: "Saída 01" }
];

const livePlate = document.getElementById("livePlate");
const carPlate = document.getElementById("carPlate");
const accessBadge = document.getElementById("accessBadge");
const liveTime = document.getElementById("liveTime");
const confidence = document.getElementById("confidence");
const activityList = document.getElementById("activityList");

let plateIndex = 0;

function updateLiveDashboard() {
  const item = plates[plateIndex];

  if (livePlate && accessBadge && confidence) {
    livePlate.textContent = item.plate;
    if (carPlate) carPlate.textContent = item.plate;
    accessBadge.textContent = item.status;
    accessBadge.className = `access-badge ${item.type === "denied" ? "denied" : "allowed"}`;
    confidence.textContent = item.confidence;
  }

  if (liveTime) {
    liveTime.textContent = new Date().toLocaleTimeString("pt-BR");
  }

  if (activityList) {
    const statusClass = item.type === "denied" ? "danger" : "";
    const label = item.type === "denied" ? "Blacklist" : "Autorizado";

    const row = document.createElement("div");
    row.innerHTML = `<span>${item.plate}</span><strong class="${statusClass}">${label}</strong><em>${item.camera}</em>`;

    activityList.prepend(row);

    while (activityList.children.length > 4) {
      activityList.removeChild(activityList.lastElementChild);
    }
  }

  plateIndex = (plateIndex + 1) % plates.length;
}

updateLiveDashboard();
setInterval(updateLiveDashboard, 3600);

leadForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const telefone = document.getElementById("telefone").value.trim();
  const email = document.getElementById("email").value.trim();
  const empresa = document.getElementById("empresa").value.trim();
  const interesse = document.getElementById("interesse").value.trim();
  const mensagem = document.getElementById("mensagem").value.trim();

  const text = `Olá! Tenho interesse no VisionGate.%0A%0A` +
    `Nome: ${encodeURIComponent(nome)}%0A` +
    `Telefone: ${encodeURIComponent(telefone)}%0A` +
    `E-mail: ${encodeURIComponent(email)}%0A` +
    `Empresa: ${encodeURIComponent(empresa)}%0A` +
    `Interesse: ${encodeURIComponent(interesse)}%0A` +
    `Mensagem: ${encodeURIComponent(mensagem || "Gostaria de solicitar uma apresentação comercial.")}`;

  successModal?.classList.add("active");

  setTimeout(() => {
    window.open(`https://wa.me/${whatsappNumber}?text=${text}`, "_blank");
  }, 650);
});

closeModal?.addEventListener("click", () => {
  successModal.classList.remove("active");
});

successModal?.addEventListener("click", (event) => {
  if (event.target === successModal) {
    successModal.classList.remove("active");
  }
});
