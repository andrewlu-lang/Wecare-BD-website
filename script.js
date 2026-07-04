const WHATSAPP_NUMBER = "8801773962962";

function buildWhatsappUrl(message) {
  const number = WHATSAPP_NUMBER.trim();
  const encodedMessage = encodeURIComponent(message || "Hello Wecare, I need a quotation.");
  return number ? `https://wa.me/${number}?text=${encodedMessage}` : `https://wa.me/?text=${encodedMessage}`;
}

document.querySelectorAll(".js-whatsapp").forEach((link) => {
  link.href = buildWhatsappUrl(link.dataset.message);
  link.target = "_blank";
  link.rel = "noopener";
});

document.querySelectorAll(".js-catalog-download").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();

    const status = document.querySelector(".download-status");
    if (status) status.textContent = "Download started. Please check your browser downloads.";

    const downloadLink = document.createElement("a");
    downloadLink.href = link.href;
    downloadLink.download = link.getAttribute("download") || "catalog.pdf";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
  });
});

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".header-nav");

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

document.querySelectorAll(".js-quote-form").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = [
      "Hello Wecare, I need a quotation.",
      `Name: ${String(formData.get("name") || "").trim() || "Not provided"}.`,
      `WhatsApp: ${String(formData.get("phone") || "").trim() || "Not provided"}.`,
      `Product interest: ${String(formData.get("interest") || "General inquiry").trim() || "General inquiry"}.`,
      `Message: ${String(formData.get("message") || "").trim() || "Not provided"}.`,
    ].join(" ");

    window.open(buildWhatsappUrl(message), "_blank", "noopener");
    form.reset();
  });
});

const lightbox = document.querySelector("#product-lightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCloseControls = lightbox?.querySelectorAll(".lightbox-backdrop, .lightbox-close") || [];

function closeProductLightbox() {
  if (!lightbox || !lightboxImage) return;
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
  lightboxImage.alt = "";
  document.body.classList.remove("lightbox-open");
}

document.querySelectorAll(".product-image-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const image = button.querySelector("img");
    if (!lightbox || !lightboxImage || !image) return;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  });
});

lightboxCloseControls.forEach((control) => {
  control.addEventListener("click", closeProductLightbox);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductLightbox();
});

const sections = Array.from(document.querySelectorAll("main .screen[id]"));
const navLinks = Array.from(document.querySelectorAll(".nav-link[href^='#']"));

if ("IntersectionObserver" in window && sections.length && navLinks.length) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-35% 0px -45% 0px", threshold: [0.15, 0.35, 0.6] }
  );

  sections.forEach((section) => observer.observe(section));
}
