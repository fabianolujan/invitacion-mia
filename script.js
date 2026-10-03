// ✏️ Datos editables de la invitación
const CONFIG = {
  whatsapp: "51949754762", // Perú (+51) 949 754 762
  venue: "Sueño Dorado",
  address: "Asociación Niño Jesús, 2.ª Etapa\nMz. A, Lt. 23 · Ref. Av. San Martín", // \n = salto de línea
  mapQuery: "-12.0216873,-76.8926567", // punto exacto del local (de maps.app.goo.gl/EmhF3m6ALSTvFLYs5)
  spotify: "https://open.spotify.com/track/3wUuC7hhfBKySCo53Q6AEE", // Noche – Vico y su Grupo Karicia ← pega aquí el link de Spotify (canción, playlist o álbum)
};

const waLink = (text) => `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(text)}`;

// Dirección y mapa
const addressText = CONFIG.address || "Dirección por confirmar";
const mapQuery = CONFIG.mapQuery || CONFIG.address.replace(/\n/g, ", ");
document.querySelectorAll("[data-venue]").forEach((el) => (el.textContent = CONFIG.venue));
document.querySelectorAll("[data-address]").forEach((el) => (el.textContent = addressText));
document.querySelector("#map").src = `https://maps.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=17&output=embed`;
document.querySelector("#maps-link").href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapQuery)}`;

// Reproductor de Spotify
const spotifyMatch = CONFIG.spotify.match(/open\.spotify\.com\/(?:intl-[a-z]+\/)?(track|playlist|album)\/([A-Za-z0-9]+)/);
if (spotifyMatch) {
  const [, type, id] = spotifyMatch;
  const player = document.createElement("iframe");
  player.src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;
  player.height = type === "track" ? 152 : 352;
  player.title = "Música de los XV de Mia en Spotify";
  player.loading = "lazy";
  player.allow = "autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture";
  document.querySelector("#player").replaceChildren(player);
}
document.querySelector("#song-request").href = waLink("¡Hola! 🎶 La canción que no puede faltar en los XV de Mia es: ");

// Foto de Mia en la cámara: si no existe foto-mia.jpg se muestra el diseño de respaldo
const photo = document.querySelector("#foto-mia");
const markEmpty = () => photo.closest(".camera").classList.add("camera--empty");
photo.addEventListener("error", markEmpty);
if (photo.complete && photo.naturalWidth === 0) markEmpty();

// Formulario de confirmación → WhatsApp
document.querySelector("#rsvp-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const data = new FormData(event.target);
  const name = data.get("nombre").trim();
  const people = Number(data.get("personas"));
  const message =
    data.get("asiste") === "si"
      ? `¡Hola! 💖 Soy ${name} y confirmo mi asistencia a los XV de Mia el sábado 07/11/2026. Asistiremos ${people} ${people === 1 ? "persona" : "personas"}. ✨`
      : `¡Hola! Soy ${name}. Lamentablemente no podré asistir a los XV de Mia, pero le deseo una noche maravillosa. 💖`;
  window.open(waLink(message), "_blank", "noopener");
});

// Brillitos: estrellas y destellos repartidos en cada sección
const sparkleColors = ["#ec5f99", "#d81b6a", "#f5a9c6", "#d4a24c", "#ffffff"];

// en celulares con pocos núcleos se dibujan menos brillitos
const sparkleDensity = (navigator.hardwareConcurrency || 4) <= 4 ? 0.6 : 1;
const sections = document.querySelectorAll(".hero, .section");

sections.forEach((section) => {
  const layer = document.createElement("div");
  layer.className = "glitter";
  layer.setAttribute("aria-hidden", "true");
  const colors = sparkleColors;
  const count = Math.round(Math.min(80, (section.offsetWidth * section.offsetHeight) / 12000) * sparkleDensity);
  for (let i = 0; i < count; i++) {
    const item = document.createElement("i");
    // la mayoría de brillitos van a los costados, donde hay más espacio libre
    const onSide = Math.random() < 0.7;
    const left = onSide ? (Math.random() < 0.5 ? Math.random() * 22 : 78 + Math.random() * 22) : Math.random() * 100;
    const isStar = Math.random() < 0.45;
    const size = isStar ? (onSide ? 10 : 8) + Math.random() * (onSide ? 20 : 12) : 2 + Math.random() * 4;
    item.className = isStar ? "star" : "dot";
    item.style.cssText = `left:${left}%;top:${Math.random() * 100}%;width:${size}px;height:${size}px;color:${colors[i % colors.length]};--dur:${2 + Math.random() * 3}s;--delay:${-Math.random() * 5}s`;
    layer.append(item);
  }
  section.prepend(layer);
  section.classList.add("paused");
});

// Estrellitas blancas en la tarjeta "Let's Party!": la mayoría a los costados del texto
const inviteSky = document.querySelector(".invite__sky");
for (let i = 0; i < Math.round(40 * sparkleDensity); i++) {
  const item = document.createElement("i");
  const isStar = i % 3 !== 0;
  const left = isStar ? (Math.random() < 0.5 ? Math.random() * 20 : 80 + Math.random() * 20) : Math.random() * 100;
  const size = isStar ? 5 + Math.random() * 8 : 2 + Math.random() * 3;
  item.className = isStar ? "star5" : "dot";
  item.style.cssText = `left:${left}%;top:${20 + Math.random() * 62}%;width:${size}px;height:${size}px;color:#fff;--dur:${2 + Math.random() * 3}s;--delay:${-Math.random() * 5}s`;
  inviteSky.append(item);
}

// Solo se animan las secciones que están en pantalla (o a punto de verse)
const animationObserver = new IntersectionObserver(
  (entries) => entries.forEach((entry) => entry.target.classList.toggle("paused", !entry.isIntersecting)),
  { rootMargin: "200px 0px" }
);
sections.forEach((section) => animationObserver.observe(section));

// Cuenta regresiva
const target = Date.UTC(2026, 10, 8, 0, 0, 0); // 7 Nov, 7:00 p. m. en Perú (UTC-5)

const units = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const distance = Math.max(0, target - Date.now());
  const day = 86_400_000;
  const hour = 3_600_000;
  const minute = 60_000;
  const values = {
    days: Math.floor(distance / day),
    hours: Math.floor((distance % day) / hour),
    minutes: Math.floor((distance % hour) / minute),
    seconds: Math.floor((distance % minute) / 1000),
  };
  Object.entries(values).forEach(([key, value]) => {
    units[key].textContent = String(value).padStart(2, "0");
  });
}

updateCountdown();
setInterval(updateCountdown, 1000);

// Aparición suave al hacer scroll
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Agregar al calendario
document.querySelector("#calendar-button").addEventListener("click", () => {
  const calendar = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "DTSTART:20261108T000000Z",
    "DTEND:20261108T050000Z",
    "SUMMARY:XV años de Mia Luz Rafaella Herrera Trinidad",
    `LOCATION:${`${CONFIG.venue} - ${addressText.replace(/\n/g, ", ")}`.replace(/[,;]/g, "\\$&")}`,
    "DESCRIPTION:Confirma tu asistencia por WhatsApp al 949 754 762.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const file = new Blob([calendar], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = url;
  link.download = "xv-mia.ics";
  link.click();
  URL.revokeObjectURL(url);
});
