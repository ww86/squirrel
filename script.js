/**
 * 3. STATE & CONTROLLER
 */
let userResponses = {};
let currentView = "welcome";

// --- DOM HELPERS ---
const $ = (id) => document.getElementById(id);
const setText = (id, txt) => {
  const el = $(id);
  if (el) el.innerText = txt;
};
const setHTML = (id, html) => {
  const el = $(id);
  if (el) el.innerHTML = html;
};
const setStyle = (id, prop, val) => {
  const el = $(id);
  if (el) el.style[prop] = val;
};
const toggleClass = (id, cls, state) => {
  const el = $(id);
  if (el) el.classList.toggle(cls, state);
};

function showModal(message, onConfirm) {
  setText("modal-message", message);
  toggleClass("modal-overlay", "active", true);

  const confirmBtn = $("modal-confirm");
  const cancelBtn = $("modal-cancel");

  // Clone nodes to clear previous listeners
  const newConfirmBtn = confirmBtn.cloneNode(true);
  const newCancelBtn = cancelBtn.cloneNode(true);
  confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
  cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);

  newConfirmBtn.addEventListener("click", () => {
    toggleClass("modal-overlay", "active", false);
    onConfirm();
  });

  newCancelBtn.addEventListener("click", () => {
    toggleClass("modal-overlay", "active", false);
  });
}

const createInputHTML = (q) => {
  if (q.type === "choice") {
    const maxLen = Math.max(...q.answers.map(a => a.label.length));
    const gridClass = maxLen < 28 ? "choice-grid" : "";
    
    const optionsHTML = q.answers
      .map(
        (a, ai) => `
                        <div class="choice-option" data-qid="${q.id}" onclick="pickChoice('${q.id}', ${ai}, this)">
                            ${a.label}
                        </div>
                    `,
      )
      .join("");
    
    return `<div class="${gridClass}">${optionsHTML}</div>`;
  }
  if (q.type === "number") {
    return `<input type="number" class="number-input" placeholder="0-100" oninput="storeInput('${q.id}', this.value)">`;
  }
  if (q.type === "text") {
    return `<input type="text" class="text-input" placeholder="..." oninput="storeInput('${q.id}', this.value)">`;
  }
  return "";
};

const createQuestionHTML = (q, idx) => `
                <div class="q-item">
                    <div class="q-number">${(idx + 1).toString().padStart(2, "0")}</div>
                    <div>
                        <div class="q-prompt">${q.prompt}</div>
                        ${createInputHTML(q)}
                    </div>
                </div>
            `;

const views = {
  welcome: "view-welcome",
  exam: "view-exam",
  results: "view-results",
};

function setView(viewId) {
  Object.values(views).forEach((id) =>
    toggleClass(id, "active", id === views[viewId]),
  );
  currentView = viewId;
  window.scrollTo(0, 0);

  if (viewId === "exam") {
    const btn = $("action-btn");
    $("site-header").appendChild(btn);
    setText("action-btn", "Submit Answers");
    renderExam();
  } else if (viewId === "results") {
    setStyle("action-btn", "display", "none");
    processScoring();
  }
}

$("action-btn").addEventListener("click", () => {
  if (currentView === "welcome") {
    setView("exam");
  } else if (currentView === "exam") {
    showModal("Are you certain you wish to submit your answers?", () => {
      setView("results");
    });
  }
});

function renderExam() {
  const html = QUESTION_SET.map((q, idx) => createQuestionHTML(q, idx)).join(
    "",
  );
  setHTML("questions-container", html);
}

window.pickChoice = (qid, idx, el) => {
  userResponses[qid] = idx;
  document
    .querySelectorAll(`[data-qid="${qid}"]`)
    .forEach((o) => o.classList.remove("selected"));
  el.classList.add("selected");
};

window.storeInput = (qid, val) => {
  userResponses[qid] = val;
};

/**
 * 4. MODULAR SCORING ENGINE
 */

// --- SCORING HELPERS ---
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

/**
 * Advanced Scalable Scoring Engine
 *
 * This engine handles axis sparsity (the "8 directions" problem).
 * It uses a geometric decay series s_{i+1} = s_i + (v_i - s_i) * r^i.
 *
 * Logic:
 * 1. Separates positive and negative impacts.
 * 2. Treats missing questions and explicit 0.0 as "neutral" (zeros).
 * 3. Splits zeros between pos/neg lists (rounding down if odd).
 * 4. Sorts by magnitude to prioritize "significant" results.
 * 5. Uses decay ratio 'r' that increases with test length (N) to
 *    maintain "stickiness" for consistent users while penalizing flukes.
 */
function calculateAdvancedScore(responses, category, axisId, totalQuestions) {
  const allEffects = responses.map((r) => r[category]?.[axisId]);

  // Extract non-zero contributions
  const posValues = allEffects.filter((v) => v > 0);
  const negValues = allEffects.filter((v) => v < 0).map((v) => Math.abs(v));

  // Each list is clipped/padded to exactly half (ceil) the number of questions
  const targetLen = Math.ceil(totalQuestions / 2);

  const processList = (list) => {
    // Sort by magnitude descending
    list.sort((a, b) => b - a);

    // Clip or Pad to targetLen
    let processed = list.slice(0, targetLen);
    while (processed.length < targetLen) {
      processed.push(0);
    }

    if (processed.length === 0) return 0;
    const peak = processed[0];
    if (peak === 0) return 0;

    // 1. Calculate Arithmetic Average
    const avg = processed.reduce((acc, v) => acc + v, 0) / targetLen;

    // 2. Calculate Geometric Decay Weighted Score
    let s = peak;
    const r = Math.pow(0.5, 1 / (1 + totalQuestions / 8));
    for (let i = 1; i < processed.length; i++) {
      const k = Math.pow(r, i);
      s = s + (processed[i] - s) * k;
    }

    // 3. Scale results between the average and the peak value
    const weight = s / peak;
    return avg + weight * (peak - avg);
  };

  const scorePos = processList(posValues);
  const scoreNeg = processList(negValues);

  return scorePos - scoreNeg;
}

async function processScoring() {
  // 1. Gather all raw responses in order
  const responses = QUESTION_SET.map((q) => {
    const response = {
      id: q.id,
      answerIndex: userResponses[q.id],
    };
    if (q.type === "choice" && userResponses[q.id] !== undefined) {
      const answer = q.answers[userResponses[q.id]];
      response.personality = answer.personality;
      response.independent = answer.independent;
      response.iq = answer.iq;
    }
    return response;
  });

  const totalN = QUESTION_SET.length;

  // 2. Specialized modular processing
  const final = {
    personality: {},
    independent: {},
    iq: calculateIQ(responses),
  };

  AXES_LABELS.forEach((ax) => {
    final.personality[ax.id] = calculateAdvancedScore(
      responses,
      "personality",
      ax.id,
      totalN,
    );
  });

  INDEPENDENT_VARS.forEach((v) => {
    // Independent variables are a simple additive sum clamped 0-100
    const sum = responses.reduce((acc, r) => acc + (r.independent?.[v.id] || 0), 0);
    final.independent[v.id] = clamp(sum, 0, 100);
  });

  // 3. Cryptographic Key Derivation (for future Easter Egg decryption)
  const sessionKey = await deriveKeyFromAnswers(responses);
  console.log("Session Encryption Key Derived:", sessionKey);
  // The sessionKey will be used in the future to attempt decryption of the egg.

  renderResults(final);
}

function calculateIQ(responses) {
  const changes = responses.map(r => r.iq || 0);
  // IQ remains additive but starts at 100
  let score = clamp(changes.reduce((acc, v) => acc + v, 100), 100, 200);
  if (score > 100) { score += 30;  }
  return score;
}

/**
 * Derives a SHA-256 hash from the sequence of answer indices.
 * This hash serves as a de-encryption key for the future easter egg.
 */
async function deriveKeyFromAnswers(responses) {
  // We use the sequence of selected indices as the raw material for the key
  const answerSequence = responses.map((r) => r.answerIndex ?? "X").join("|");
  const encoder = new TextEncoder();
  const data = encoder.encode(answerSequence);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

/**
 * 5. RESULT RENDERING
 */
function renderResults(data) {
  // Archetype logic based on 8 possible combinations
  const profileKey = AXES_LABELS.map((ax) =>
    data.personality[ax.id] >= 0 ? "+" : "-",
  ).join("");

  const arch = ARCHETYPES[profileKey] || ARCHETYPES["++++"];

  // Highest absolute axis for dominant
  const absoluteAxes = AXES_LABELS.map((ax) => ({
    label: data.personality[ax.id] >= 0 ? ax.pos : ax.neg,
    val: Math.abs(data.personality[ax.id]),
  }));
  const dominant = absoluteAxes.sort((a, b) => b.val - a.val)[0];

  setText("res-archetype", arch.name);
  setText("res-desc", arch.desc);
  setHTML(
    "res-img",
    `<img src="${arch.image}" alt="${arch.name}" style="width: 100%; height: 100%; object-fit: cover;">`,
  );
  setText("res-dominant", `Dominant Modality: ${dominant.label}`);

  // Render Personality Axes
  const axesHtml = AXES_LABELS.map(ax => {
    const val = data.personality[ax.id]; // -1 to 1
    const width = Math.abs(val) * 50;
    const left = val >= 0 ? 50 : 50 - width;
    return `
      <div class="axis-meter">
        <div class="axis-label-group">
          <span class="axis-side-label neg">${ax.neg}</span>
          <span class="axis-side-label pos">${ax.pos}</span>
        </div>
        <div class="axis-bar-bg">
          <div class="axis-bar-fill" style="width: ${width}%; left: ${left}%"></div>
        </div>
      </div>
    `;
  }).join("");
  setHTML("res-axes", axesHtml);

  // IQ Logic
  const iqVal = Math.round(data.iq);
  const zScore = (iqVal - 100) / 15;
  const percentile = calculatePercentile(zScore).toFixed(1);

  setText("res-iq-val", iqVal);
  setText("res-percentile", percentile);

  const iqTitle = getIqTitle(iqVal);
  setText("res-iq-title", iqTitle.text);
  setStyle("res-iq-title", "color", iqTitle.color);
  setHTML("res-iq-img", `<img src="${iqTitle.image}" alt="${iqTitle.text}">`);

  drawBellCurve(iqVal);
  drawSpider(data.independent);
}

/**
 * Calculates the percentile of a Z-score using the Abramowitz and Stegun
 * approximation (Formula 26.2.17).
 */
function calculatePercentile(z) {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp((-z * z) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.7814779 + t * (-1.821256 + t * 1.330274))));
  return (z > 0 ? 1 - p : p) * 100;
}

function getIqTitle(iq) {
  return (
    IQ_THRESHOLDS.find((t) => iq >= t.min) ||
    IQ_THRESHOLDS[IQ_THRESHOLDS.length - 1]
  );
}

/**
 * 6. VISUALIZATION ENGINE
 */
function drawBellCurve(iq) {
  const canvas = $("bell-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const padding = 35;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  // Statistical Constants
  const mean = 100;
  const sd = 15;
  const minIQ = 40;
  const maxIQ = 200; // Scaled to allow space for higher scores
  const range = maxIQ - minIQ;

  ctx.clearRect(0, 0, w, h);

  // Helper to map IQ to X coordinate
  const getX = (val) => ((val - minIQ) / range) * chartW + padding;

  // 1. Draw X-Axis
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.15)";
  ctx.lineWidth = 1;
  ctx.moveTo(padding, h - padding);
  ctx.lineTo(w - padding, h - padding);
  ctx.stroke();

  // 2. Prepare Curve Path
  const points = [];
  for (let x = 0; x <= chartW; x++) {
    const iqAtX = minIQ + (x / chartW) * range;
    const z = (iqAtX - mean) / sd;
    const y = h - padding - Math.exp(-0.5 * z * z) * chartH;
    points.push({ x: x + padding, y: y });
  }

  // 3. Draw Fill
  ctx.beginPath();
  ctx.moveTo(points[0].x, h - padding);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.lineTo(points[points.length - 1].x, h - padding);
  ctx.closePath();

  const gradient = ctx.createLinearGradient(0, padding, 0, h - padding);
  gradient.addColorStop(0, "rgba(255,255,255,0.08)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fill();

  // 4. Draw Curve Line (With Glow)
  ctx.shadowBlur = 10;
  ctx.shadowColor = "rgba(255,255,255,0.3)";
  ctx.beginPath();
  ctx.strokeStyle = "rgba(255,255,255,0.6)";
  ctx.lineWidth = 2;
  ctx.moveTo(points[0].x, points[0].y);
  points.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.stroke();
  ctx.shadowBlur = 0;

  // 5. Comparison Points (Squirrely Scientists)
  const comparisons = [
    { name: "Chippenheimer", val: 135 },
    { name: "Enrico Furmi", val: 145 },
    { name: "Isaac Nuton", val: 155 },
    { name: "Marie Scurrie", val: 165 }
  ];

  ctx.font = "italic 10px SF Mono, monospace";
  comparisons.forEach((c, i) => {
    const cx = getX(c.val);
    const cz = (c.val - mean) / sd;
    const cy = h - padding - Math.exp(-0.5 * cz * cz) * chartH;

    // Vertical staggering moved higher up
    const offset = 45 + (i * 25);
    const horizLen = 6;

    // Inverted L shape
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.10)";
    ctx.moveTo(cx, cy);
    ctx.lineTo(cx, cy - offset);           // Vertical
    ctx.lineTo(cx + horizLen, cy - offset); // Horizontal to the right
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText(c.name, cx + horizLen + 4, cy - offset + 3);
  });

  // 6. Axis Ticks & Labels
  ctx.fillStyle = "rgba(255,255,255,0.4)";
  ctx.font = "8px SF Mono, monospace";
  ctx.textAlign = "center";
  const ticks = [60, 80, 100, 120, 140, 160, 180];
  ticks.forEach(val => {
    const x = getX(val);
    ctx.fillText(val, x, h - padding + 16);
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255,255,255,0.15)";
    ctx.moveTo(x, h - padding);
    ctx.lineTo(x, h - padding + 4);
    ctx.stroke();
  });

  // 7. User Score Marker
  const userX = getX(iq);
  const clampedUserX = clamp(userX, padding, w - padding);

  ctx.beginPath();
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 3]);
  ctx.moveTo(clampedUserX, 10);
  ctx.lineTo(clampedUserX, h - padding);
  ctx.stroke();
  ctx.setLineDash([]);

  // Label for User Score
  ctx.fillStyle = "#fff";
  ctx.font = "bold 9px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText("YOU", clampedUserX + 6, 20);

  const userZ = (iq - mean) / sd;
  const userY = h - padding - Math.exp(-0.5 * userZ * userZ) * chartH;
  if (userX >= padding && userX <= w - padding) {
      ctx.shadowBlur = 15;
      ctx.shadowColor = "#fff";
      ctx.beginPath();
      ctx.fillStyle = "#fff";
      ctx.arc(userX, userY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
  }
}

function drawSpider(indData) {
  const canvas = $("spider-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const w = canvas.width;
  const h = canvas.height;
  const center = { x: w / 2, y: h / 2 };
  const numVars = INDEPENDENT_VARS.length;
  const maxRadius = Math.min(w, h) / 2 - 40; // Max radius, leaving space for labels
  const dataRadius = maxRadius * 0.8; // Data points are within this radius

  ctx.clearRect(0, 0, w, h);

  // Helper to get coordinates for a given value and angle
  const getCoords = (value, angle, r = dataRadius) => ({
    x: center.x + Math.cos(angle) * r * value,
    y: center.y + Math.sin(angle) * r * value,
  });

  // 1. Draw Concentric Circles (Background Web)
  ctx.strokeStyle = "#eee";
  ctx.lineWidth = 1;
  const steps = 4; // 0, 25, 50, 75, 100%
  for (let i = 1; i <= steps; i++) {
    ctx.beginPath();
    ctx.arc(center.x, center.y, (dataRadius / steps) * i, 0, Math.PI * 2);
    ctx.stroke();
  }

  // 2. Draw Spokes and Numerical Labels
  ctx.strokeStyle = "#e5e5e5";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#888";
  ctx.font = "7px SF Mono, monospace";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (let i = 0; i < numVars; i++) {
    const angle = ((Math.PI * 2) / numVars) * i - Math.PI / 2;
    const end = getCoords(1, angle, dataRadius);

    ctx.beginPath();
    ctx.moveTo(center.x, center.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();

    // Numerical labels for the first spoke (top)
    if (i === 0) {
      for (let j = 1; j <= steps; j++) {
        const value = (j / steps) * 100;
        const labelCoords = getCoords(j / steps, angle, dataRadius);
        ctx.fillText(value, labelCoords.x + 8, labelCoords.y);
      }
    }
  }

  // 3. Draw Data Path
  ctx.beginPath();
  const dataFillGradient = ctx.createLinearGradient(0, 0, w, h);
  dataFillGradient.addColorStop(0, "rgba(0, 0, 0, 0.03)");
  dataFillGradient.addColorStop(1, "rgba(0, 0, 0, 0.08)");
  ctx.fillStyle = dataFillGradient;
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1.5;

  let firstPoint = true;
  INDEPENDENT_VARS.forEach((v, i) => {
    const angle = ((Math.PI * 2) / numVars) * i - Math.PI / 2;
    const score = clamp(indData[v.id] || 0, 0, 100) / 100; // Normalized score
    const { x, y } = getCoords(score, angle);

    if (firstPoint) {
      ctx.moveTo(x, y);
      firstPoint = false;
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 4. Draw Data Point Markers
  ctx.fillStyle = "black";
  INDEPENDENT_VARS.forEach((v, i) => {
    const angle = ((Math.PI * 2) / numVars) * i - Math.PI / 2;
    const score = clamp(indData[v.id] || 0, 0, 100) / 100;
    const { x, y } = getCoords(score, angle);
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();
  });

  // 5. Draw Variable Labels
  ctx.fillStyle = "var(--text-primary)";
  ctx.font = "bold 11px Inter, sans-serif";
  ctx.textAlign = "center";
  INDEPENDENT_VARS.forEach((v, i) => {
    const angle = ((Math.PI * 2) / numVars) * i - Math.PI / 2;
    const labelOffset = dataRadius + 25; // Offset from center
    const x = center.x + Math.cos(angle) * labelOffset;
    const y = center.y + Math.sin(angle) * labelOffset;
    ctx.fillText(v.label.toUpperCase(), x, y);
  });
}
