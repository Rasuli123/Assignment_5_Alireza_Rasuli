"use strict";

const BUDGET = 20;
const MIN_SKILL = 1;
const MAX_SKILL = 10;
const CLASS_MIN = 5;

const takenNames = ["admin", "hero", "rasuli"];

const classSkills = {
  mage: "magic",
  warrior: "strength",
  rogue: "agility",
};

const skills = ["strength", "magic", "agility", "wisdom"];

const fields = ["name", "class", "color", ...skills];

const form = document.querySelector("#form");
const touched = new Set();

let submitted = false;

// Keep HTML constraints but disable browser popup messages.
form.noValidate = true;

function readCharacter() {
  const data = {};

  for (const field of fields) {
    data[field] = skills.includes(field)
      ? Number(form.elements[field].value)
      : form.elements[field].value.trim();
  }

  return data;
}

function sum(data) {
  let total = 0;

  for (const skill of skills) {
    total += data[skill];
  }

  return total;
}

function validate(data) {
  const errors = {};

  // First check native HTML constraints.
  for (const field of fields) {
    const input = form.elements[field];

    // Clear previous custom errors before checking validity.
    input.setCustomValidity("");

    if (!input.checkValidity()) {
      if (skills.includes(field)) {
        errors[field] = "Enter a whole number from 1 to 10.";
      } else if (field === "name") {
        errors[field] =
          "Use 3–20 characters: start with a letter; " +
          "letters, digits and spaces only.";
      } else {
        errors[field] = "Choose an available option.";
      }
    }
  }

  // Custom rule: reject taken names, ignoring letter case.
  if (takenNames.includes(data.name.toLowerCase())) {
    errors.name = "This name is already taken.";
  }

  if (!Object.hasOwn(classSkills, data.class)) {
    errors.class = "Choose an available class.";
  }

  if (!["violet", "teal", "amber"].includes(data.color)) {
    errors.color = "Choose an available color.";
  }

  for (const skill of skills) {
    if (
      !Number.isInteger(data[skill]) ||
      data[skill] < MIN_SKILL ||
      data[skill] > MAX_SKILL
    ) {
      errors[skill] = "Enter a whole number from 1 to 10.";
    }
  }

  // Custom class rules:
  // Mage -> magic >= 5
  // Warrior -> strength >= 5
  // Rogue -> agility >= 5
  const required = classSkills[data.class];

  if (required && data[required] < CLASS_MIN) {
    errors[required] =
      `${data.class} requires ${required} of at least ${CLASS_MIN}.`;
  }

  // Custom rule: all four skills must total exactly 20.
  if (sum(data) !== BUDGET && !errors.wisdom) {
    errors.wisdom =
      `All four skills must total exactly ${BUDGET}. ` +
      "Adjust your allocation.";
  }

  for (const field of fields) {
    form.elements[field].setCustomValidity(errors[field] || "");
  }

  return errors;
}

function characterCard(data, final = false) {
  const card = document.createElement("article");
  card.classList.add("character");

  if (["violet", "teal", "amber"].includes(data.color)) {
    card.classList.add(data.color);
  }

  const title = document.createElement("h3");
  title.textContent = data.name || "Your next hero";

  const info = document.createElement("p");
  info.textContent = `${final ? "Created" : "Draft"} / ${data.class}`;

  card.append(title, info);

  for (const skill of skills) {
    const line = document.createElement("p");

    line.textContent = `${skill}: ${Number.isFinite(data[skill]) ? data[skill] : "—"}`;

    card.append(line);
  }

  return card;
}

function updateForm() {
  const data = readCharacter();
  const errors = validate(data);

  document.querySelector("#preview").replaceChildren(characterCard(data));

  document.querySelector("#points").textContent =
    `Points left: ${BUDGET - sum(data)} / ${BUDGET}`;

  for (const field of fields) {
    const show = touched.has(field) || submitted;
    const errorElement = document.getElementById(`${field}-error`);

    errorElement.textContent = show ? errors[field] || "" : "";

    if (show) {
      form.elements[field].setAttribute(
        "aria-invalid",
        String(Boolean(errors[field])),
      );
    } else {
      form.elements[field].removeAttribute("aria-invalid");
    }
  }

  const errorCount = Object.keys(errors).length;

  document.querySelector("#summary").textContent =
    submitted && errorCount
      ? `${errorCount} fields need attention. Correct them below.`
      : "";

  return errors;
}

for (const field of fields) {
  const input = form.elements[field];

  input.addEventListener("blur", () => {
    touched.add(field);
    updateForm();
  });

  input.addEventListener("input", updateForm);
  input.addEventListener("change", updateForm);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  submitted = true;

  const errors = updateForm();
  const first = fields.find((field) => errors[field]);

  if (first) {
    form.elements[first].focus();
    return;
  }

  const data = readCharacter();

  const heading = document.createElement("h3");
  heading.textContent = "Character created successfully";
  heading.classList.add("success");

  document
    .querySelector("#result")
    .replaceChildren(heading, characterCard(data, true));

  // Prevent reusing the new name during this page session.
  takenNames.push(data.name.toLowerCase());

  form.reset();
  touched.clear();
  submitted = false;

  updateForm();
});

// Build the initial preview without displaying errors.
updateForm();
