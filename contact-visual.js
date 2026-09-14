// Contact already contains WhatsApp links and a form; keep the floating shortcut clear of them.
const contactSection = document.querySelector('#contact');
const floatingContact = document.querySelector('.sticky-whatsapp');
if (contactSection && floatingContact && 'IntersectionObserver' in window) {
  new IntersectionObserver(([entry]) => {
    floatingContact.classList.toggle('contact-in-view', entry.isIntersecting);
  }).observe(contactSection);
}
