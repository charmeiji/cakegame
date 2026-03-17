const cakeState = {
  base: null,
  frosting: null,
  decorations: []
};

const IMAGE_DATA = {
  base: {
    vanilla: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    chocolate: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
  },
  frosting: {
    pink: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII=",
    black: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
  },
  decoration: {
    sprinkles: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAASsJTYQAAAAASUVORK5CYII="
  }
};

let currentDecorationId = 0;
let draggingDecoration = null;
let dragOffsetX = 0;
let dragOffsetY = 0;

document.addEventListener("DOMContentLoaded", () => {
  const cakeBaseEl = document.getElementById("cakeBase");
  const cakeFrostingEl = document.getElementById("cakeFrosting");
  const cakeDecorationsEl = document.getElementById("cakeDecorations");
  const workspaceEl = document.getElementById("cakeWorkspace");
  const trashcanEl = document.getElementById("trashcan");

  const serveBtn = document.getElementById("serveBtn");
  const addSprinklesBtn = document.getElementById("addSprinklesBtn");

  const customerIcon = document.getElementById("customerIcon");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalCloseBtn = document.getElementById("modalCloseBtn");

  document.querySelectorAll("[data-base]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-base");
      setBase(type, cakeBaseEl);
    });
  });

  document.querySelectorAll("[data-frosting]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const type = btn.getAttribute("data-frosting");
      setFrosting(type, cakeFrostingEl);
    });
  });

  addSprinklesBtn.addEventListener("click", () => {
    addDecoration("sprinkles", cakeDecorationsEl, workspaceEl);
  });

  serveBtn.addEventListener("click", () => {
    const score = calculateScore();
    let message;
    if (score === 3) {
      message = "Perfect cake!";
    } else if (score === 2) {
      message = "Not bad!";
    } else {
      message = "This cake is confusing...";
    }
    alert(message);
  });

  customerIcon.addEventListener("click", () => {
    openCustomerModal(modalOverlay);
  });

  modalCloseBtn.addEventListener("click", () => {
    closeCustomerModal(modalOverlay);
  });

  modalOverlay.addEventListener("click", (event) => {
    if (event.target === modalOverlay) {
      closeCustomerModal(modalOverlay);
    }
  });

  document.addEventListener("mousemove", (event) => {
    if (!draggingDecoration) return;
    const workspaceRect = workspaceEl.getBoundingClientRect();

    let newLeft = event.clientX - workspaceRect.left - dragOffsetX;
    let newTop = event.clientY - workspaceRect.top - dragOffsetY;

    const decoRect = draggingDecoration.getBoundingClientRect();
    const width = decoRect.width;
    const height = decoRect.height;

    if (newLeft < 0) newLeft = 0;
    if (newTop < 0) newTop = 0;
    if (newLeft + width > workspaceRect.width) {
      newLeft = workspaceRect.width - width;
    }
    if (newTop + height > workspaceRect.height) {
      newTop = workspaceRect.height - height;
    }

    draggingDecoration.style.left = `${newLeft}px`;
    draggingDecoration.style.top = `${newTop}px`;
  });

  document.addEventListener("mouseup", (event) => {
    if (!draggingDecoration) return;

    const trashRect = trashcanEl.getBoundingClientRect();
    const cursorInTrash =
      event.clientX >= trashRect.left &&
      event.clientX <= trashRect.right &&
      event.clientY >= trashRect.top &&
      event.clientY <= trashRect.bottom;

    if (cursorInTrash) {
      const id = draggingDecoration.getAttribute("data-id");
      cakeState.decorations = cakeState.decorations.filter(
        (dec) => String(dec.id) !== String(id)
      );
      draggingDecoration.remove();
    } else {
      draggingDecoration.style.cursor = "grab";
    }

    draggingDecoration = null;
  });

  function setBase(type, baseEl) {
    if (!IMAGE_DATA.base[type]) return;
    cakeState.base = type;
    baseEl.src = IMAGE_DATA.base[type];
  }

  function setFrosting(type, frostingEl) {
    if (!IMAGE_DATA.frosting[type]) return;
    cakeState.frosting = type;
    frostingEl.src = IMAGE_DATA.frosting[type];
  }

  function addDecoration(type, containerEl, workspace) {
    if (type !== "sprinkles") return;

    const img = document.createElement("img");
    img.src = IMAGE_DATA.decoration.sprinkles;
    img.alt = "Sprinkles decoration";
    img.className = "decoration";

    const id = currentDecorationId++;
    img.setAttribute("data-id", String(id));

    const workspaceRect = workspace.getBoundingClientRect();
    const approxSize = 40;
    const startLeft = workspaceRect.width / 2 - approxSize / 2;
    const startTop = workspaceRect.height / 2 - approxSize / 2;

    img.style.left = `${startLeft}px`;
    img.style.top = `${startTop}px`;

    img.addEventListener("mousedown", (event) => {
      event.preventDefault();
      draggingDecoration = img;
      const decoRect = img.getBoundingClientRect();
      dragOffsetX = event.clientX - decoRect.left;
      dragOffsetY = event.clientY - decoRect.top;
      img.style.cursor = "grabbing";
    });

    containerEl.appendChild(img);
    cakeState.decorations.push({ id, element: img });
  }
});

function calculateScore() {
  let score = 0;
  if (cakeState.base) score += 1;
  if (cakeState.frosting) score += 1;
  if (cakeState.decorations.length > 0) score += 1;
  return score;
}

function openCustomerModal(overlayEl) {
  overlayEl.classList.add("visible");
}

function closeCustomerModal(overlayEl) {
  overlayEl.classList.remove("visible");
}

