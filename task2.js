"use strict";

const LIMIT = 3;

// Each task has a unique ID and values of four types:
// string, number, Boolean and object.
const tasks = [
  {
    id: "t1",
    title: "Build semantic structure",
    tag: "HTML",
    priority: 1,
    status: "todo",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t2",
    title: "Label all form fields",
    tag: "HTML",
    priority: 2,
    status: "todo",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t3",
    title: "Create mobile breakpoints",
    tag: "CSS",
    priority: 1,
    status: "doing",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t4",
    title: "Style keyboard focus",
    tag: "CSS",
    priority: 2,
    status: "todo",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t5",
    title: "Practice random numbers",
    tag: "JS",
    priority: 1,
    status: "doing",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t6",
    title: "Explore strict equality",
    tag: "JS",
    priority: 2,
    status: "done",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t7",
    title: "Render cards from data",
    tag: "JS",
    priority: 1,
    status: "doing",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t8",
    title: "Try a new palette",
    tag: "CSS",
    priority: 3,
    status: "todo",
    required: false,
    details: { minutes: 10 },
  },
  {
    id: "t9",
    title: "Write image alternatives",
    tag: "HTML",
    priority: 2,
    status: "done",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t10",
    title: "Validate cross field rules",
    tag: "JS",
    priority: 1,
    status: "todo",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t11",
    title: "Practice event delegation",
    tag: "JS",
    priority: 2,
    status: "todo",
    required: true,
    details: { minutes: 20 },
  },
  {
    id: "t12",
    title: "Add hover effects",
    tag: "CSS",
    priority: 3,
    status: "todo",
    required: false,
    details: { minutes: 10 },
  },
];

const columns = [
  { id: "todo", name: "To do" },
  { id: "doing", name: "In progress" },
  { id: "done", name: "Done" },
];

const container = document.querySelector("#items");
const boardMessage = document.querySelector("#board-message");

// Create elements safely without innerHTML.
function node(tag, text, className) {
  const element = document.createElement(tag);
  element.textContent = text;

  if (className) {
    element.classList.add(className);
  }

  return element;
}

// One render function rebuilds the board after changes.
function renderBoard() {
  const query = document.querySelector("#search").value.trim().toLowerCase();

  const tag = document.querySelector("#filter").value;

  const order = document.querySelector("#sort").value === "asc" ? 1 : -1;

  const visible = tasks
    .filter((task) => {
      const matchesSearch = task.title.toLowerCase().includes(query);
      const matchesTag = tag === "all" || task.tag === tag;

      return matchesSearch && matchesTag;
    })
    .sort((a, b) => order * (a.priority - b.priority));

  // Calculate progress using our own loop.
  let completed = 0;

  for (const task of tasks) {
    if (task.status === "done") {
      completed += 1;
    }
  }

  document.querySelector("#progress").value = tasks.length
    ? (completed / tasks.length) * 100
    : 0;

  document.querySelector("#progress-label").textContent =
    `${completed} of ${tasks.length} tasks complete`;

  container.replaceChildren();

  for (const column of columns) {
    const section = node("section", "", "column");
    section.append(node("h3", column.name));

    const items = visible.filter((task) => {
      return task.status === column.id;
    });

    if (!items.length) {
      section.append(node("p", "No matching tasks.", "empty"));
    }

    for (const task of items) {
      const card = node("article", "", "card");

      const description =
        `${task.required ? "Core learning task" : "Optional exploration"}` +
        ` / ${task.details?.minutes ?? 20} min`;

      card.append(
        node("small", `${task.tag} / PRIORITY ${task.priority}`),
        node("h4", task.title),
        node("p", description),
      );

      for (const target of columns) {
        if (target.id === task.status) {
          continue;
        }

        const button = node("button", `Move to ${target.name}`);

        button.type = "button";
        button.dataset.id = task.id;
        button.dataset.target = target.id;

        card.append(button);
      }

      section.append(card);
    }

    container.append(section);
  }
}

// Event delegation: one listener handles all card buttons.
container.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-id]");

  if (!button || !container.contains(button)) {
    return;
  }

  const task = tasks.find((item) => {
    return item.id === button.dataset.id;
  });

  const target = button.dataset.target;

  if (!task || !columns.some((column) => column.id === target)) {
    return;
  }

  // Count all active cards, including cards hidden by filters.
  let active = 0;

  for (const item of tasks) {
    if (item.status === "doing") {
      active += 1;
    }
  }

  if (target === "doing" && task.status !== "doing" && active >= LIMIT) {
    boardMessage.textContent =
      `Move blocked: In progress already has ${LIMIT} cards. ` +
      "Move one out first.";

    return;
  }

  // Update the data before rendering.
  task.status = target;

  const destination = columns.find((column) => column.id === target);

  boardMessage.textContent = `${task.title} moved to ${destination.name}.`;

  renderBoard();

  // Restore keyboard focus after recreating the cards.
  container.querySelector(`button[data-id="${task.id}"]`)?.focus();
});

document.querySelector("#search").addEventListener("input", renderBoard);

for (const id of ["filter", "sort"]) {
  document.getElementById(id).addEventListener("change", renderBoard);
}

renderBoard();
