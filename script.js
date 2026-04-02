const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const revealItems = document.querySelectorAll(".reveal");
const tiltCards = document.querySelectorAll("[data-tilt]");
const countryList = [
  { name: "India", code: "+91", min: 10, max: 10 },
  { name: "United States", code: "+1", min: 10, max: 10 },
  { name: "United Kingdom", code: "+44", min: 10, max: 10 },
  { name: "Canada", code: "+1", min: 10, max: 10 },
  { name: "Australia", code: "+61", min: 9, max: 9 },
  { name: "United Arab Emirates", code: "+971", min: 9, max: 9 },
  { name: "Singapore", code: "+65", min: 8, max: 8 },
  { name: "Malaysia", code: "+60", min: 9, max: 10 },
  { name: "Germany", code: "+49", min: 10, max: 11 },
  { name: "France", code: "+33", min: 9, max: 9 },
  { name: "Netherlands", code: "+31", min: 9, max: 9 },
  { name: "South Africa", code: "+27", min: 9, max: 9 },
  { name: "Saudi Arabia", code: "+966", min: 9, max: 9 },
  { name: "Qatar", code: "+974", min: 8, max: 8 },
  { name: "Kuwait", code: "+965", min: 8, max: 8 },
  { name: "Japan", code: "+81", min: 10, max: 11 },
  { name: "South Korea", code: "+82", min: 9, max: 10 },
  { name: "New Zealand", code: "+64", min: 8, max: 10 },
  { name: "Brazil", code: "+55", min: 10, max: 11 },
  { name: "Mexico", code: "+52", min: 10, max: 10 }
];
const certifications = [
  {
    title: "ICITSS - Orientation Course",
    issuer: "The Institute of Chartered Accountants of India",
    issued: "Issued Dec 2023",
    id: "Bengaluru/OC/0016536"
  },
  {
    title: "ICITSS - Information Technology",
    issuer: "The Institute of Chartered Accountants of India",
    issued: "Issued Feb 2024",
    id: "Bengaluru/IT/0014648"
  },
  {
    title: "Microsoft Excel - Basic Excel / Advanced Excel Formulas",
    issuer: "Udemy",
    issued: "Issued Sep 2025",
    id: "UC-f5721685-a4ce-4f97-82a7-88492ccb2aef"
  },
  {
    title: "QuickBooks Online Payments",
    issuer: "Udemy",
    issued: "Issued Jul 2025",
    id: "UC-c31e9182-66b3-492e-8b57-4f4d12ce362f"
  },
  {
    title: "Deloitte Australia - Data Analytics",
    issuer: "Forage",
    issued: "Issued Jun 2025",
    id: "BrM2CwTWxRRcYxX52"
  },
  {
    title: "Investor Certification Examination",
    issuer: "National Institute of Securities Markets (NISM)",
    issued: "Issued Aug 2024 · Expires Aug 2026",
    id: "NISM-202400184167-ENROLMENT.NO: 2440329461"
  },
  {
    title: "Financial Modelling",
    issuer: "Jobaaj Learnings",
    issued: "Issued Aug 2024",
    id: "AJO0L50863"
  },
  {
    title: "Tally Prime, Tally ERP and GST Certificate of Completion",
    issuer: "Udemy Business",
    issued: "Issued Jan 2024",
    id: "UC-a20561b2-780f-4c5d-9e4a-254b1b3b803c"
  }
];

const countryTrigger = document.getElementById("countryTrigger");
const countryDropdown = document.getElementById("countryDropdown");
const countrySearch = document.getElementById("countrySearch");
const countryCodeLabel = document.getElementById("countryCodeLabel");
const countryCodeInput = document.getElementById("countryCodeInput");
const countryListElement = document.getElementById("countryList");
const contactForm = document.getElementById("contactForm");
const contactPhone = document.getElementById("contactPhone");
const phoneError = document.getElementById("phoneError");
const phoneHelper = document.getElementById("phoneHelper");
const contactName = document.getElementById("contactName");
const contactEmail = document.getElementById("contactEmail");
const emailError = document.getElementById("emailError");
const emailHelper = document.getElementById("emailHelper");
const contactReason = document.getElementById("contactReason");
const formStatus = document.getElementById("formStatus");
const ribbonTrack = document.getElementById("ribbonTrack");
const certificationRibbon = document.getElementById("certificationRibbon");
const themeToggle = document.getElementById("themeToggle");

let selectedCountry = countryList[0];
let certStartIndex = 0;
let ribbonIntervalId = null;
let ribbonResumeTimeoutId = null;
let ribbonStarted = false;

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach(item => revealObserver.observe(item));
} else {
  revealItems.forEach(item => item.classList.add("is-visible"));
}

tiltCards.forEach(card => {
  const onMove = event => {
    if (prefersReducedMotion) {
      return;
    }

    const bounds = card.getBoundingClientRect();
    const offsetX = event.clientX - bounds.left;
    const offsetY = event.clientY - bounds.top;
    const rotateY = ((offsetX / bounds.width) - 0.5) * 10;
    const rotateX = ((offsetY / bounds.height) - 0.5) * -10;

    card.classList.add("is-active");
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-2px)`;
  };

  const reset = () => {
    card.classList.remove("is-active");
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg) translateY(0)";
  };

  card.addEventListener("pointermove", onMove);
  card.addEventListener("pointerleave", reset);
});

function renderCountryOptions(filterText = "") {
  const query = filterText.trim().toLowerCase();
  const filteredCountries = countryList.filter(country => {
    return country.name.toLowerCase().includes(query) || country.code.includes(query);
  });

  countryListElement.innerHTML = "";

  if (!filteredCountries.length) {
    const emptyState = document.createElement("li");
    emptyState.className = "country-empty";
    emptyState.textContent = "No country or code matched your search.";
    countryListElement.appendChild(emptyState);
    return;
  }

  filteredCountries.forEach(country => {
    const listItem = document.createElement("li");
    const option = document.createElement("button");

    option.type = "button";
    option.className = "country-option";
    option.setAttribute("role", "option");
    option.dataset.code = country.code;
    option.innerHTML = `
      <span class="country-name">${country.name}</span>
      <span class="country-dial">${country.code}</span>
    `;

    if (country.code === selectedCountry.code && country.name === selectedCountry.name) {
      option.classList.add("is-selected");
    }

    option.addEventListener("click", () => {
      selectedCountry = country;
      countryCodeLabel.textContent = country.code;
      countryCodeInput.value = country.code;
      countryDropdown.hidden = true;
      countryTrigger.setAttribute("aria-expanded", "false");
      countrySearch.value = "";
      renderCountryOptions();
      validatePhone();
      countryTrigger.focus();
    });

    listItem.appendChild(option);
    countryListElement.appendChild(listItem);
  });
}

function toggleCountryDropdown(forceOpen) {
  const isOpening = typeof forceOpen === "boolean" ? forceOpen : countryDropdown.hidden;
  countryDropdown.hidden = !isOpening;
  countryTrigger.setAttribute("aria-expanded", String(isOpening));

  if (isOpening) {
    renderCountryOptions(countrySearch.value);
    window.setTimeout(() => countrySearch.focus(), 0);
  }
}

function validatePhone() {
  const digitsOnly = contactPhone.value.replace(/\D/g, "");
  const { min, max, name, code } = selectedCountry;
  const normalizedValue = contactPhone.value.trim();

  if (!normalizedValue) {
    phoneError.textContent = "";
    phoneError.classList.remove("is-visible");
    contactPhone.setCustomValidity("");
    return true;
  }

  if (!/^\d+$/.test(normalizedValue)) {
    phoneError.textContent = "Use digits only in the contact number.";
    phoneError.classList.add("is-visible");
    contactPhone.setCustomValidity("Use digits only in the contact number.");
    return false;
  }

  if (/^(\d)\1+$/.test(digitsOnly)) {
    phoneError.textContent = "This number looks invalid because all digits are the same.";
    phoneError.classList.add("is-visible");
    contactPhone.setCustomValidity(phoneError.textContent);
    return false;
  }

  if ("0123456789".includes(digitsOnly) || "9876543210".includes(digitsOnly)) {
    phoneError.textContent = "This number looks invalid because it is a simple sequence.";
    phoneError.classList.add("is-visible");
    contactPhone.setCustomValidity(phoneError.textContent);
    return false;
  }

  if (digitsOnly.length < min) {
    phoneError.textContent = `${name} numbers with ${code} need at least ${min} digits.`;
    phoneError.classList.add("is-visible");
    contactPhone.setCustomValidity(phoneError.textContent);
    return false;
  }

  if (digitsOnly.length > max) {
    phoneError.textContent = `${name} numbers with ${code} can have at most ${max} digits.`;
    phoneError.classList.add("is-visible");
    contactPhone.setCustomValidity(phoneError.textContent);
    return false;
  }

  phoneError.textContent = "";
  phoneError.classList.remove("is-visible");
  contactPhone.setCustomValidity("");
  return true;
}

function validateEmail() {
  const value = contactEmail.value.trim();
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  if (!value) {
    emailError.textContent = "";
    emailError.classList.remove("is-visible");
    contactEmail.setCustomValidity("");
    return true;
  }

  if (!emailPattern.test(value)) {
    emailError.textContent = "Enter a valid email address like name@example.com.";
    emailError.classList.add("is-visible");
    contactEmail.setCustomValidity(emailError.textContent);
    return false;
  }

  emailError.textContent = "";
  emailError.classList.remove("is-visible");
  contactEmail.setCustomValidity("");
  return true;
}

function validateName() {
  if (!contactName.value.trim()) {
    contactName.setCustomValidity("Enter your name.");
    return false;
  }

  contactName.setCustomValidity("");
  return true;
}

function validateReason() {
  if (!contactReason.value.trim()) {
    contactReason.setCustomValidity("Enter the reason for contact.");
    return false;
  }

  contactReason.setCustomValidity("");
  return true;
}

function syncContactRequirements() {
  const hasPhone = contactPhone.value.trim().length > 0;
  const hasEmail = contactEmail.value.trim().length > 0;

  contactPhone.required = !hasEmail;
  contactEmail.required = !hasPhone;

  // Keep the form labels in sync so users immediately know which field became optional.
  phoneHelper.textContent = hasEmail
    ? "Optional because email is filled"
    : "Required if email is empty";
  emailHelper.textContent = hasPhone
    ? "Optional because phone number is filled"
    : "Required if phone number is empty";

  if (hasPhone || hasEmail) {
    if (!contactPhone.value.trim()) {
      contactPhone.setCustomValidity("");
      phoneError.textContent = "";
      phoneError.classList.remove("is-visible");
    }

    if (!contactEmail.value.trim()) {
      contactEmail.setCustomValidity("");
      emailError.textContent = "";
      emailError.classList.remove("is-visible");
    }
  }
}

function renderCertificationRibbon() {
  if (!ribbonTrack) {
    return;
  }

  ribbonTrack.innerHTML = "";

  for (let offset = 0; offset < 3; offset += 1) {
    const cert = certifications[(certStartIndex + offset) % certifications.length];
    const card = document.createElement("article");
    card.className = "cert-card";
    card.innerHTML = `
      <span class="stack-kicker">${cert.issuer}</span>
      <h4>${cert.title}</h4>
      <p class="cert-issued">${cert.issued}</p>
      <p class="cert-id">Credential ID: ${cert.id}</p>
    `;
    ribbonTrack.appendChild(card);
  }
}

function advanceCertificationRibbon() {
  certStartIndex = (certStartIndex + 3) % certifications.length;
  renderCertificationRibbon();
}

function animateCertificationAdvance() {
  if (!ribbonTrack) {
    return;
  }

  ribbonTrack.classList.remove("is-animating-in");
  ribbonTrack.classList.add("is-animating-out");

  window.setTimeout(() => {
    advanceCertificationRibbon();
    ribbonTrack.classList.remove("is-animating-out");
    ribbonTrack.classList.add("is-animating-in");

    window.setTimeout(() => {
      ribbonTrack.classList.remove("is-animating-in");
    }, 650);
  }, 220);
}

function startCertificationRibbon() {
  if (ribbonIntervalId) {
    clearInterval(ribbonIntervalId);
  }
  ribbonStarted = true;
  ribbonIntervalId = window.setInterval(animateCertificationAdvance, 4200);
}

function pauseCertificationRibbon() {
  if (ribbonIntervalId) {
    clearInterval(ribbonIntervalId);
    ribbonIntervalId = null;
  }

  if (ribbonResumeTimeoutId) {
    clearTimeout(ribbonResumeTimeoutId);
  }

  ribbonResumeTimeoutId = window.setTimeout(() => {
    startCertificationRibbon();
  }, 5000);
}

function setTheme(theme) {
  document.body.setAttribute("data-theme", theme);
  themeToggle.checked = theme === "light";
  window.localStorage.setItem("theme", theme);
}

// Custom country picker keeps the closed state compact, but still shows full country names while searching.
renderCountryOptions();
renderCertificationRibbon();
syncContactRequirements();
setTheme(window.localStorage.getItem("theme") || "dark");

countryTrigger.addEventListener("click", () => {
  toggleCountryDropdown();
});

countrySearch.addEventListener("input", event => {
  renderCountryOptions(event.target.value);
});

document.addEventListener("click", event => {
  const picker = document.getElementById("countryPicker");
  if (!picker.contains(event.target)) {
    toggleCountryDropdown(false);
  }
});

contactPhone.addEventListener("input", () => {
  syncContactRequirements();
  validatePhone();
  formStatus.textContent = "";
});

contactEmail.addEventListener("input", () => {
  syncContactRequirements();
  validateEmail();
  formStatus.textContent = "";
});

contactName.addEventListener("input", () => {
  validateName();
  formStatus.textContent = "";
});

contactReason.addEventListener("input", () => {
  validateReason();
  formStatus.textContent = "";
});

contactForm.addEventListener("submit", event => {
  const hasPhone = contactPhone.value.trim().length > 0;
  const hasEmail = contactEmail.value.trim().length > 0;

  syncContactRequirements();
  const isPhoneValid = validatePhone();
  const isEmailValid = validateEmail();
  const isNameValid = validateName();
  const isReasonValid = validateReason();

  if ((!hasPhone && !hasEmail) || !isPhoneValid || !isEmailValid || !isNameValid || !isReasonValid) {
    event.preventDefault();
    if (!hasPhone && !hasEmail) {
      contactEmail.setCustomValidity("Enter either an email address or a mobile number.");
      contactPhone.setCustomValidity("Enter either a mobile number or an email address.");
      emailError.textContent = "Enter either an email address or a mobile number.";
      emailError.classList.add("is-visible");
      phoneError.textContent = "Enter either a mobile number or an email address.";
      phoneError.classList.add("is-visible");
    }
    formStatus.textContent = "Fill all required details before sending the enquiry.";
    contactForm.reportValidity();
    validateEmail();
    validatePhone();
  } else {
    contactEmail.setCustomValidity("");
    contactPhone.setCustomValidity("");
    formStatus.textContent = "";
  }
});

if (certificationRibbon) {
  ["pointerdown", "pointerenter", "click"].forEach(eventName => {
    certificationRibbon.addEventListener(eventName, pauseCertificationRibbon);
  });

  window.addEventListener("scroll", () => {
    pauseCertificationRibbon();
  }, { passive: true });

  const ribbonObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !ribbonStarted) {
        startCertificationRibbon();
      }
      if (entry.isIntersecting && !ribbonIntervalId) {
        ribbonResumeTimeoutId = window.setTimeout(() => {
          startCertificationRibbon();
        }, 1200);
      }
    });
  }, { threshold: 0.35 });

  ribbonObserver.observe(certificationRibbon);
}

themeToggle.addEventListener("click", () => {
  const currentTheme = document.body.getAttribute("data-theme") || "dark";
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

const canvas = document.getElementById("orbitalGrid");
const context = canvas.getContext("2d");
let particles = [];
let pointer = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.35 };

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  particles = Array.from({ length: Math.min(80, Math.floor(window.innerWidth / 18)) }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2.2 + 0.6,
    speedX: (Math.random() - 0.5) * 0.4,
    speedY: (Math.random() - 0.5) * 0.4
  }));
}

function drawBackground() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "rgba(7, 17, 27, 0.16)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  particles.forEach((particle, index) => {
    particle.x += particle.speedX;
    particle.y += particle.speedY;

    if (particle.x < 0 || particle.x > canvas.width) {
      particle.speedX *= -1;
    }
    if (particle.y < 0 || particle.y > canvas.height) {
      particle.speedY *= -1;
    }

    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.sqrt((dx * dx) + (dy * dy));

    context.beginPath();
    context.fillStyle = distance < 220 ? "rgba(125, 255, 207, 0.9)" : "rgba(149, 176, 205, 0.45)";
    context.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    context.fill();

    for (let next = index + 1; next < particles.length; next += 1) {
      const other = particles[next];
      const gapX = particle.x - other.x;
      const gapY = particle.y - other.y;
      const gap = Math.sqrt((gapX * gapX) + (gapY * gapY));

      if (gap < 120) {
        context.beginPath();
        context.strokeStyle = `rgba(95, 130, 165, ${0.16 - (gap / 1200)})`;
        context.lineWidth = 1;
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.stroke();
      }
    }
  });

  if (!prefersReducedMotion) {
    requestAnimationFrame(drawBackground);
  }
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("pointermove", event => {
  pointer = { x: event.clientX, y: event.clientY };
});

if (!prefersReducedMotion) {
  // Cursor glow adds a stronger interactive feel without changing the content layout.
  const cursorGlow = document.createElement("div");
  cursorGlow.className = "cursor-glow is-visible";
  document.body.appendChild(cursorGlow);

  window.addEventListener("pointermove", event => {
    cursorGlow.style.left = `${event.clientX}px`;
    cursorGlow.style.top = `${event.clientY}px`;
  });
}

resizeCanvas();

if (prefersReducedMotion) {
  drawBackground();
} else {
  requestAnimationFrame(drawBackground);
}
