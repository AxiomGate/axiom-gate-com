(function () {
  "use strict";

  var cfg = window.SITE_CONFIG || {};
  var formReady = cfg.FORM_ENDPOINT && cfg.FORM_ENDPOINT.indexOf("YOUR_FORM_ID") === -1;
  var bookingsReady = /^https:\/\//.test(cfg.BOOKINGS_URL || "");

  // ---- Mobile nav ----
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  // ---- "Book a call" links ----
  // Without a real Bookings URL they keep their fallback href (contact.html#book).
  if (bookingsReady) {
    document.querySelectorAll("[data-bookings]").forEach(function (a) {
      a.href = cfg.BOOKINGS_URL;
      a.target = "_blank";
      a.rel = "noopener";
    });
  }
  document.querySelectorAll("[data-bookings-pending]").forEach(function (el) {
    el.hidden = bookingsReady;
  });
  document.querySelectorAll("[data-bookings-only]").forEach(function (el) {
    el.hidden = !bookingsReady;
  });

  // ---- Contact email ----
  if (cfg.CONTACT_EMAIL) {
    document.querySelectorAll("[data-email]").forEach(function (a) {
      a.href = "mailto:" + cfg.CONTACT_EMAIL;
      a.textContent = cfg.CONTACT_EMAIL;
    });
  }

  // ---- Contact form ----
  var form = document.getElementById("contact-form");
  if (!form) return;
  var status = document.getElementById("form-status");
  var submit = form.querySelector("button[type=submit]");

  function show(kind, msg) {
    status.className = "form-status show " + kind;
    status.textContent = msg;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    if (!formReady) {
      show("warn", "This form isn't connected yet (site in setup). Please email " +
        (cfg.CONTACT_EMAIL || "us") + " directly for now.");
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";
    fetch(cfg.FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" }
    }).then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      form.reset();
      show("ok", "Thanks — your message is in. We'll reply within one business day.");
    }).catch(function () {
      show("err", "Something went wrong sending that. Please email " + cfg.CONTACT_EMAIL + " instead.");
    }).then(function () {
      submit.disabled = false;
      submit.textContent = "Send message";
    });
  });
})();
