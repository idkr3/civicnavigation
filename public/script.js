const nav = document.querySelector(".nav");
const heroCopy = document.querySelector(".hero-copy");
const heroImage = document.querySelector(".hero-image-container img");
const eventImage = document.querySelector(".event-parallax-img");
const closingImage = document.querySelector(".closing img");
const cursor = document.querySelector(".cursor-dot");
const floatingBall = document.querySelector(".floating-ball");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 40);

  if (!reduceMotion) {
    const heroProgress = clamp(y / window.innerHeight, 0, 1);
    
    if (heroCopy) {
      heroCopy.style.opacity = `${1 - heroProgress * 1.35}`;
      heroCopy.style.marginTop = `${heroProgress * -70}px`;
    }

    if (heroImage) {
      heroImage.style.transform = `scale(${1.02 + heroProgress * 0.06}) rotate(${-3 + heroProgress * 2.5}deg)`;
    }

    if (eventImage) {
      const eventRect = eventImage.parentElement.getBoundingClientRect();
      const eventProgress = clamp((window.innerHeight - eventRect.top) / (window.innerHeight + eventRect.height), 0, 1);
      eventImage.style.transform = `scale(${1.12 - eventProgress * .12}) translateY(${(eventProgress - .5) * 5}%)`;
    }

    if (closingImage) {
      const closeRect = closingImage.parentElement.getBoundingClientRect();
      const closeProgress = clamp((window.innerHeight - closeRect.top) / (window.innerHeight + closeRect.height), 0, 1);
      closingImage.style.transform = `scale(${1.25 - closeProgress * .2}) rotate(${(closeProgress - .5) * 3}deg)`;
    }

    // Scroll-based ball animation in the About section
    if (floatingBall) {
      const ballSection = floatingBall.closest(".manifesto") || floatingBall.parentElement;
      const rect = ballSection.getBoundingClientRect();
      // Progress: 0 when section enters viewport, 1 when it leaves
      const totalHeight = rect.height + window.innerHeight;
      const scrolled = window.innerHeight - rect.top;
      const ballProgress = clamp(scrolled / totalHeight, 0, 1);

      // Rotate 0 -> 360deg across the section scroll
      const rotation = ballProgress * 360;
      // Float up and down: starts at +40px, peaks at 0, ends at -40px
      const yOffset = Math.sin(ballProgress * Math.PI) * -60;
      // Subtle scale: starts small, grows slightly then shrinks
      const scale = 0.88 + Math.sin(ballProgress * Math.PI) * 0.18;

      floatingBall.style.setProperty("--ball-rotate", `${rotation}deg`);
      floatingBall.style.setProperty("--ball-y", `${yOffset}px`);
      floatingBall.style.setProperty("--ball-scale", `${scale}`);
    }
  }
}

// Intersection Observer for scroll reveal animations
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .13 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${(index % 3) * 90}ms`;
  revealObserver.observe(element);
});

// FAQ Accordion Logic
document.querySelectorAll(".faq-trigger").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    const item = trigger.parentElement;
    const content = trigger.nextElementSibling;
    const isActive = item.classList.contains("active");

    // Close all other FAQ items
    document.querySelectorAll(".faq-accordion-item").forEach((otherItem) => {
      otherItem.classList.remove("active");
      otherItem.querySelector(".faq-content").style.maxHeight = null;
      otherItem.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
    });

    // Toggle current FAQ item
    if (!isActive) {
      item.classList.add("active");
      content.style.maxHeight = content.scrollHeight + "px";
      trigger.setAttribute("aria-expanded", "true");
    }
  });
});

// Modal Wizard Logic
const checkoutTriggers = document.querySelectorAll(".checkout-trigger");
const preorderModal = document.querySelector(".preorder-modal");
const preorderBackdrop = document.querySelector(".preorder-backdrop");
const preorderClose = document.querySelector(".preorder-close");
const preorderForm = document.querySelector(".preorder-form");
const preorderIntro = document.querySelector(".preorder-intro");
const preorderSuccess = document.querySelector(".preorder-success");
const finishPreorder = document.querySelector(".finish-preorder");

const nextBtn = document.querySelector(".wizard-btn-next");
const prevBtn = document.querySelector(".wizard-btn-prev");
const stepPanes = document.querySelectorAll(".wizard-pane");
const stepIndicators = document.querySelectorAll(".wizard-step");
const divisionSelect = document.getElementById("reg-division");
const feeAmountDisplay = document.getElementById("reg-fee-amount");
const submitRegistrationButton = document.querySelector(".confirm-preorder");

// Registration Confirmation variables
const ticketPlayerName = document.getElementById("ticket-player-name");
const ticketCodeDisplay = document.getElementById("ticket-code-display");
const ticketDivisionDisplay = document.getElementById("ticket-division-display");
const ticketDetailsDisplay = document.getElementById("ticket-details-display");
const ticketFeeDisplay = document.getElementById("ticket-fee-display");

function goToStep(step) {
  stepPanes.forEach(pane => {
    pane.classList.toggle("active", parseInt(pane.dataset.step) === step);
  });
  stepIndicators.forEach(indicator => {
    indicator.classList.toggle("active", parseInt(indicator.dataset.step) === step);
  });
}

// Next button step 1 -> step 2
nextBtn.addEventListener("click", () => {
  const step1Inputs = preorderForm.querySelectorAll('.wizard-pane[data-step="1"] input');
  let isValid = true;
  step1Inputs.forEach(input => {
    if (!input.reportValidity()) {
      isValid = false;
    }
  });
  if (isValid) {
    goToStep(2);
  }
});

// Back button step 2 -> step 1
prevBtn.addEventListener("click", () => {
  goToStep(1);
});

// Calculate registration fee dynamically
divisionSelect.addEventListener("change", (e) => {
  const val = e.target.value;
  let fee = "$0.00";
  if (val.includes("$5")) {
    fee = "$5.00";
  } else if (val.includes("$10")) {
    fee = "$10.00";
  }
  feeAmountDisplay.textContent = fee;
});

function openModal() {
  preorderForm.style.display = "";
  preorderIntro.style.display = "";
  preorderSuccess.classList.remove("show");
  preorderForm.reset();
  feeAmountDisplay.textContent = "$0.00";
  goToStep(1);
  
  document.body.classList.add("cart-open");
  preorderModal.classList.add("open");
  preorderBackdrop.classList.add("show");
  preorderModal.setAttribute("aria-hidden", "false");
  preorderClose.focus();
}

function closeModal() {
  document.body.classList.remove("cart-open");
  preorderModal.classList.remove("open");
  preorderBackdrop.classList.remove("show");
  preorderModal.setAttribute("aria-hidden", "true");
}

checkoutTriggers.forEach(btn => btn.addEventListener("click", openModal));
preorderClose.addEventListener("click", closeModal);
preorderBackdrop.addEventListener("click", closeModal);
finishPreorder.addEventListener("click", closeModal);

// Form Submission & Ticket Generation
preorderForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const formData = new FormData(preorderForm);
  const registration = Object.fromEntries(formData.entries());
  registration.updates = formData.get("updates") === "on";

  submitRegistrationButton.disabled = true;
  submitRegistrationButton.innerHTML = "Opening Secure Checkout <span>↗</span>";

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registration),
    });

    const result = await response.json();

    if (!response.ok || !result.url) {
      throw new Error(result.error || "Unable to start checkout.");
    }

    window.location.href = result.url;
  } catch (error) {
    alert(error.message);
    submitRegistrationButton.disabled = false;
    submitRegistrationButton.innerHTML = "Complete Registration <span>↗</span>";
  }
});

const checkoutStatus = new URLSearchParams(window.location.search).get("checkout");
const ticketCode = new URLSearchParams(window.location.search).get("ticket");

if (checkoutStatus === "success") {
  preorderForm.style.display = "none";
  preorderIntro.style.display = "none";
  preorderSuccess.classList.add("show");
  ticketPlayerName.textContent = "Paid player";
  ticketCodeDisplay.textContent = ticketCode || "Paid";
  ticketDivisionDisplay.textContent = "Payment complete";
  ticketDetailsDisplay.textContent = "Confirmation email sent";
  ticketFeeDisplay.textContent = "Paid";
  document.body.classList.add("cart-open");
  preorderModal.classList.add("open");
  preorderBackdrop.classList.add("show");
  preorderModal.setAttribute("aria-hidden", "false");
  stepIndicators.forEach(indicator => {
    indicator.classList.toggle("active", parseInt(indicator.dataset.step) === 3);
  });
}

if (checkoutStatus === "cancelled") {
  openModal();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && preorderModal.classList.contains("open")) closeModal();
});

// Custom interactive cursor
if (window.matchMedia("(pointer: fine)").matches) {
  window.addEventListener("pointermove", (event) => {
    cursor.style.left = `${event.clientX}px`;
    cursor.style.top = `${event.clientY}px`;
  });
  document.querySelectorAll("a, button").forEach((target) => {
    target.addEventListener("mouseenter", () => cursor.classList.add("is-hovering"));
    target.addEventListener("mouseleave", () => cursor.classList.remove("is-hovering"));
  });
}

window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);
onScroll();
