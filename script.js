const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navBackdrop = document.querySelector(".nav-backdrop");

function toggleMenu(forceOpen) {
  const shouldOpen = typeof forceOpen === "boolean"
    ? forceOpen
    : !navLinks.classList.contains("active");

  navLinks.classList.toggle("active", shouldOpen);
  navBackdrop.classList.toggle("active", shouldOpen);
  document.body.classList.toggle("menu-open", shouldOpen);
  menuToggle.setAttribute("aria-expanded", String(shouldOpen));
  menuToggle.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu");
}

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => toggleMenu());

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => toggleMenu(false));
  });

  navBackdrop.addEventListener("click", () => toggleMenu(false));
}

function scrollToPanel(event) {
  const targetId = event.currentTarget.getAttribute("href")?.slice(1);
  const target = targetId ? document.getElementById(targetId) : null;

  if (!target) return;

  event.preventDefault();
  window.scrollTo({ left: target.offsetLeft, top: 0, behavior: "smooth" });
  history.pushState(null, "", `#${targetId}`);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", scrollToPanel);
});

if (window.location.hash) {
  const initialPanel = document.getElementById(window.location.hash.slice(1));
  if (initialPanel) {
    window.addEventListener("load", () => {
      window.scrollTo({ left: initialPanel.offsetLeft, top: 0, behavior: "instant" });
    }, { once: true });
  }
}

// -------------------------------
// Project Modal Functionality
// -------------------------------
const projectDetails = {
  project1: {
    title: "Hospital Management System",
    content: `
      <p><strong>Role:</strong> Frontend and database development</p>
      <p>Developed a web-based Hospital Management System using <strong>HTML, CSS, JavaScript</strong>, and <strong>SQL</strong>.</p>
      <h3>Key features</h3>
      <ul><li>Patient registration and appointment management.</li><li>Role-based dashboards for doctors and staff.</li><li>CRUD workflows and backend API integration.</li></ul>
      <p><strong>What I learned:</strong> Structuring data-driven workflows and designing interfaces for different user roles.</p>
    `
  },
  project2: {
    title: "Event Management System",
    content: `
      <p><strong>Role:</strong> Full-stack developer</p>
      <p>Developed a web-based Event Management System using the <strong>MERN Stack</strong> (MongoDB, Express.js, React.js, Node.js).</p>
      <h3>Key features</h3>
      <ul><li>Event creation, booking, and service management.</li><li>Separate user and admin dashboards.</li><li>API integration using Axios.</li></ul>
      <p><strong>What I learned:</strong> Connecting React interfaces to REST APIs and organizing multi-role product workflows.</p>
    `
  },
  project3: {
    title: "Alzheimer’s Disease Prediction using Federated Learning and Explainable AI",
    content: `
    <p><strong>Role:</strong> Machine learning developer</p>
    <p>AI-powered system to predict Alzheimer's disease while ensuring <strong>data privacy</strong> using Federated Learning.</p>
    <h3>Key features</h3>
    <ul><li>Privacy-preserving training on decentralized patient data.</li><li>Explainable AI techniques for interpreting predictions.</li><li>Model serving with Python, TensorFlow, Scikit-learn, SHAP, and Flask.</li></ul>
    <p><strong>What I learned:</strong> Balancing model performance, privacy, and explainability in a healthcare-focused application.</p>
  `
  }
};

const projectModal = document.getElementById("projectModal");
const modalBody = document.getElementById("modal-body");
const closeModalButton = document.querySelector(".close");
let lastFocusedElement;

function openProjectModal(projectId) {
  const project = projectDetails[projectId];
  if (!project) return;

  lastFocusedElement = document.activeElement;
  projectModal.style.display = "block";
  projectModal.setAttribute("aria-hidden", "false");
  modalBody.innerHTML = `<h2 id="modal-title">${project.title}</h2>${project.content}`;
  closeModalButton.focus();
}

function closeProjectModal() {
  projectModal.style.display = "none";
  projectModal.setAttribute("aria-hidden", "true");
  if (lastFocusedElement) lastFocusedElement.focus();
}

document.querySelectorAll(".project-details-btn").forEach((button) => {
  button.addEventListener("click", () => openProjectModal(button.dataset.project));
});

if (closeModalButton) {
  closeModalButton.addEventListener("click", closeProjectModal);
}

const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!contactForm.checkValidity()) {
      contactForm.reportValidity();
      formStatus.textContent = "Please complete all fields with valid information.";
      formStatus.className = "form-status error";
      return;
    }

    const formData = new FormData(contactForm);
    const recipient = contactForm.dataset.recipient;

    if (!recipient || recipient === "your-email@example.com") {
      formStatus.textContent = "Contact form is not configured yet. Add the portfolio email address first.";
      formStatus.className = "form-status error";
      return;
    }

    const subject = `Portfolio contact from ${formData.get("name")}`;
    const body = [
      `Name: ${formData.get("name")}`,
      `Email: ${formData.get("email")}`,
      "",
      formData.get("message")
    ].join("\n");

    try {
      window.location.href = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      formStatus.textContent = "Your email app should open with the message ready to send.";
      formStatus.className = "form-status success";
      contactForm.reset();
    } catch (error) {
      formStatus.textContent = "We could not open your email app. Please email us directly.";
      formStatus.className = "form-status error";
    }
  });
}

window.onclick = function (event) {
  if (event.target === projectModal) closeProjectModal();
};

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    if (projectModal.getAttribute("aria-hidden") === "false") closeProjectModal();
    if (navLinks.classList.contains("active")) toggleMenu(false);
  }
});
