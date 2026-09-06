import { db, auth } from "./firebase-config.js";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  onSnapshot,
  query,
  orderBy,
  writeBatch,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";
import {
  signInAnonymously,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.0/firebase-auth.js";
import { GUESTS_SEED } from "./guests-seed.js";

// ── DOM refs ────────────────────────────────────────────────────────────
const rowsBody = document.getElementById("guest-rows");
const emptyState = document.getElementById("empty-state");
const seedBanner = document.getElementById("seed-banner");
const seedBtn = document.getElementById("seed-btn");
const errorBanner = document.getElementById("error-banner");
const syncIndicator = document.getElementById("sync-indicator");
const eventNameInput = document.getElementById("event-name");

const searchInput = document.getElementById("search-input");
const houseFilter = document.getElementById("house-filter");
const statusFilter = document.getElementById("status-filter");

const newNameInput = document.getElementById("new-name");
const newHouseInput = document.getElementById("new-house");
const newContactInput = document.getElementById("new-contact");
const newNotesInput = document.getElementById("new-notes");
const addBtn = document.getElementById("add-btn");
const nextNoLabel = document.getElementById("next-no");

const tallyEls = {
  total: document.getElementById("tally-total"),
  invited: document.getElementById("tally-invited"),
  accepted: document.getElementById("tally-accepted"),
  declined: document.getElementById("tally-declined"),
  awaiting: document.getElementById("tally-awaiting"),
};

// ── State ───────────────────────────────────────────────────────────────
let guests = []; // live snapshot from Firestore, each: {id, no, name, house, contact, invited, status, notes}
let filters = { search: "", house: "all", status: "all" };
let lastChangedId = null; // used to flash a row after an edit round-trips

const guestsCol = collection(db, "guests");
const eventDocRef = doc(db, "meta", "event");

// ── Auth then subscribe ─────────────────────────────────────────────────
setSyncState("connecting", "Connecting…");

signInAnonymously(auth).catch((err) => {
  showError(
    "Couldn't sign in to Firebase (" +
      err.code +
      "). In the Firebase console, enable Authentication → Sign-in method → Anonymous."
  );
});

onAuthStateChanged(auth, (user) => {
  if (user) subscribeToGuests();
});

function subscribeToGuests() {
  const q = query(guestsCol, orderBy("no"));
  onSnapshot(
    q,
    (snap) => {
      guests = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setSyncState("live", "Live");
      renderAll();
    },
    (err) => {
      setSyncState("error", "Sync error");
      showError(
        "Couldn't read the guest list (" +
          err.code +
          "). Check your Firestore security rules — see README.md."
      );
    }
  );

  onSnapshot(eventDocRef, (snap) => {
    if (snap.exists() && document.activeElement !== eventNameInput) {
      eventNameInput.value = snap.data().title || "";
    }
  });
}

window.addEventListener("online", () => setSyncState("live", "Live"));
window.addEventListener("offline", () =>
  setSyncState("offline", "Offline — changes will sync when reconnected")
);

function setSyncState(state, label) {
  syncIndicator.dataset.state = state;
  syncIndicator.innerHTML = '<span class="dot"></span> ' + label;
}

function showError(message) {
  errorBanner.hidden = false;
  errorBanner.innerHTML = "<p>" + message + "</p>";
}

// ── Rendering ───────────────────────────────────────────────────────────
function renderAll() {
  renderTally();
  renderHouseFilterOptions();
  renderRows();
  seedBanner.hidden = guests.length !== 0;
  nextNoLabel.textContent = nextNo();
}

function renderTally() {
  const total = guests.length;
  const invited = guests.filter((g) => g.invited).length;
  const accepted = guests.filter((g) => g.status === "Accepted").length;
  const declined = guests.filter((g) => g.status === "Declined").length;
  const awaiting = guests.filter((g) => g.status === "Awaiting response").length;

  tallyEls.total.textContent = total;
  tallyEls.invited.textContent = invited;
  tallyEls.accepted.textContent = accepted;
  tallyEls.declined.textContent = declined;
  tallyEls.awaiting.textContent = awaiting;
}

function renderHouseFilterOptions() {
  const current = houseFilter.value;
  const houses = Array.from(
    new Set(guests.map((g) => (g.house || "").trim()).filter(Boolean))
  ).sort();

  houseFilter.innerHTML = '<option value="all">All houses</option>';
  houses.forEach((h) => {
    const opt = document.createElement("option");
    opt.value = h;
    opt.textContent = h;
    houseFilter.appendChild(opt);
  });
  if (houses.includes(current)) houseFilter.value = current;
}

function matchesFilters(g) {
  const term = filters.search.trim().toLowerCase();
  const matchesSearch =
    !term ||
    (g.name || "").toLowerCase().includes(term) ||
    (g.notes || "").toLowerCase().includes(term) ||
    (g.contact || "").toLowerCase().includes(term);

  const matchesHouse = filters.house === "all" || g.house === filters.house;

  const matchesStatus =
    filters.status === "all" ||
    (filters.status === "none" && !g.status) ||
    g.status === filters.status;

  return matchesSearch && matchesHouse && matchesStatus;
}

function renderRows() {
  const filtered = guests.filter(matchesFilters);
  rowsBody.innerHTML = "";

  emptyState.hidden = filtered.length !== 0 || guests.length === 0;

  filtered.forEach((g) => {
    rowsBody.appendChild(buildRow(g));
  });
}

function buildRow(g) {
  const tr = document.createElement("tr");
  tr.dataset.id = g.id;
  if (g.id === lastChangedId) {
    tr.classList.add("row-flash");
    lastChangedId = null;
  }

  tr.innerHTML = `
    <td class="col-no">${g.no ?? ""}</td>
    <td><input class="cell-input name-input" data-field="name" value="${escapeAttr(g.name)}" placeholder="Guest name" /></td>
    <td><input class="cell-input house-input" data-field="house" value="${escapeAttr(g.house)}" placeholder="—" /></td>
    <td><input class="cell-input contact-input" data-field="contact" value="${escapeAttr(g.contact)}" placeholder="Add number" /></td>
    <td class="col-invited">
      <input type="checkbox" class="invited-check" data-field="invited" ${g.invited ? "checked" : ""} title="Invitation sent" />
    </td>
    <td>
      <select class="status-select" data-field="status" data-value="${escapeAttr(g.status)}">
        <option value="" ${!g.status ? "selected" : ""}>—</option>
        <option value="Accepted" ${g.status === "Accepted" ? "selected" : ""}>Accepted</option>
        <option value="Declined" ${g.status === "Declined" ? "selected" : ""}>Declined</option>
        <option value="Awaiting response" ${g.status === "Awaiting response" ? "selected" : ""}>Awaiting response</option>
      </select>
    </td>
    <td><input class="cell-input notes-input" data-field="notes" value="${escapeAttr(g.notes)}" placeholder="Add a note" /></td>
    <td class="col-actions"><button class="delete-btn" title="Remove guest">✕</button></td>
  `;

  // text fields save on blur (avoids a write per keystroke)
  tr.querySelectorAll('input[type="text"], input:not([type])').forEach((input) => {
    input.addEventListener("blur", () => {
      const field = input.dataset.field;
      if (g[field] === input.value) return;
      saveField(g.id, field, input.value);
    });
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") input.blur();
    });
  });

  tr.querySelector(".invited-check").addEventListener("change", (e) => {
    saveField(g.id, "invited", e.target.checked);
  });

  const statusSelect = tr.querySelector(".status-select");
  statusSelect.addEventListener("change", (e) => {
    statusSelect.dataset.value = e.target.value;
    saveField(g.id, "status", e.target.value);
  });

  tr.querySelector(".delete-btn").addEventListener("click", () => {
    if (confirm(`Remove ${g.name || "this guest"} from the list?`)) {
      deleteDoc(doc(db, "guests", g.id)).catch((err) =>
        showError("Couldn't remove guest (" + err.code + ").")
      );
    }
  });

  return tr;
}

function escapeAttr(value) {
  return String(value ?? "").replace(/"/g, "&quot;");
}

async function saveField(id, field, value) {
  lastChangedId = id;
  try {
    await updateDoc(doc(db, "guests", id), { [field]: value });
  } catch (err) {
    showError("Couldn't save that change (" + err.code + "). It may not have synced.");
  }
}

// ── Add guest ───────────────────────────────────────────────────────────
function nextNo() {
  if (guests.length === 0) return 1;
  return Math.max(...guests.map((g) => g.no || 0)) + 1;
}

async function addGuest() {
  const name = newNameInput.value.trim();
  if (!name) {
    newNameInput.focus();
    return;
  }

  const payload = {
    no: nextNo(),
    name,
    house: newHouseInput.value.trim(),
    contact: newContactInput.value.trim(),
    invited: false,
    status: "",
    notes: newNotesInput.value.trim(),
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(guestsCol, payload);
    newNameInput.value = "";
    newHouseInput.value = "";
    newContactInput.value = "";
    newNotesInput.value = "";
    newNameInput.focus();
  } catch (err) {
    showError("Couldn't add guest (" + err.code + ").");
  }
}

addBtn.addEventListener("click", addGuest);
[newNameInput, newHouseInput, newContactInput, newNotesInput].forEach((input) => {
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") addGuest();
  });
});

// ── Filters ─────────────────────────────────────────────────────────────
searchInput.addEventListener("input", (e) => {
  filters.search = e.target.value;
  renderRows();
});

houseFilter.addEventListener("change", (e) => {
  filters.house = e.target.value;
  renderRows();
});

statusFilter.addEventListener("change", (e) => {
  filters.status = e.target.value;
  renderRows();
});

// ── Event title ─────────────────────────────────────────────────────────
eventNameInput.addEventListener("blur", () => {
  setDoc(eventDocRef, { title: eventNameInput.value.trim() }, { merge: true }).catch(
    (err) => showError("Couldn't save the event name (" + err.code + ").")
  );
});
eventNameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") eventNameInput.blur();
});

// ── One-time starter import ─────────────────────────────────────────────
seedBtn.addEventListener("click", async () => {
  if (guests.length > 0) return;
  seedBtn.disabled = true;
  seedBtn.textContent = "Loading…";
  try {
    const batch = writeBatch(db);
    GUESTS_SEED.forEach((g) => {
      const ref = doc(guestsCol);
      batch.set(ref, { ...g, createdAt: serverTimestamp() });
    });
    await batch.commit();
  } catch (err) {
    showError("Couldn't load the starter list (" + err.code + ").");
    seedBtn.disabled = false;
    seedBtn.textContent = "Load starter list";
  }
});
