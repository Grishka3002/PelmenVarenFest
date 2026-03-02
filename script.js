const STORAGE_KEY = "kostrovie-tickets";
const TICKET_PRICE = 2500;
const QR_ENDPOINT = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=";
const TEAMS = ["Команда Северный пар", "Команда Жар-печь", "Команда Морской дым"];
const QUIZ_RESULTS = {
  pelmeni: {
    title: "Ты пельмень сибирский",
    text: "Надёжный, плотный и без лишнего шума. На тебе держится компания, и именно ты первым находишь лучшее место у костра.",
  },
  khinkali: {
    title: "Ты хинкали",
    text: "Масштабный, громкий и харизматичный. Тебя невозможно не заметить, а любая сцена рядом с тобой становится главной.",
  },
  varenik: {
    title: "Ты вареник",
    text: "Мягкий, домашний и тёплый. Ты создаёшь атмосферу, в которой хочется задержаться надолго.",
  },
  gyoza: {
    title: "Ты гёдза",
    text: "Быстрый, острый и современный. Тебе нужен ритм, контраст и немного фестивального авантюризма.",
  },
  momo: {
    title: "Ты Ваня Ненашев или Момо",
    text: "Высокий, добрый и смешнявый",
  },
};

const ticketForm = document.querySelector("#ticket-form");
const paymentForm = document.querySelector("#payment-form");
const backToOrderButton = document.querySelector("#back-to-order");
const payButton = document.querySelector("#pay-button");
const paymentSummary = document.querySelector("#payment-summary");
const resultCard = document.querySelector("#ticket-result");
const ticketList = document.querySelector("#ticket-list");
const voteForm = document.querySelector("#vote-form");
const voteMessage = document.querySelector("#vote-message");
const voteResults = document.querySelector("#vote-results");
const quizForm = document.querySelector("#quiz-form");
const quizResult = document.querySelector("#quiz-result");
const orderStepLabel = document.querySelector("#order-step-label");
const paymentStepLabel = document.querySelector("#payment-step-label");
const ticketsStepLabel = document.querySelector("#tickets-step-label");

const checkinForm = document.querySelector("#checkin-form");
const checkinResult = document.querySelector("#checkin-result");
const logList = document.querySelector("#checkin-log-list");
const scannerVideo = document.querySelector("#scanner-video");
const startScanButton = document.querySelector("#start-scan");
const stopScanButton = document.querySelector("#stop-scan");
const cameraStatus = document.querySelector("#camera-status");

let pendingOrder = null;
let scannerState = {
  stream: null,
  detector: null,
  active: false,
  frameId: null,
  lastRawValue: "",
  lastDetectedAt: 0,
};

function loadTickets() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveTickets(tickets) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
}

function getLastOrderTickets() {
  const tickets = loadTickets();
  const latest = tickets.at(-1);
  if (!latest) return [];
  return tickets.filter((ticket) => ticket.orderId === latest.orderId);
}

function generateCode(existingCodes) {
  let code = "";
  do {
    code = `PF26-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
  } while (existingCodes.has(code));
  existingCodes.add(code);
  return code;
}

function formatPrice(value) {
  return `${value.toLocaleString("ru-RU")} ₽`;
}

function buildQrUrl(ticket) {
  const payload = encodeURIComponent(`KOSTROVIE:${ticket.code}`);
  return `${QR_ENDPOINT}${payload}`;
}

function normalizeTicketInput(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (trimmed.startsWith("KOSTROVIE:")) return trimmed.split(":").at(-1);
  if (trimmed.includes("data=KOSTROVIE%3A")) {
    const raw = decodeURIComponent(trimmed.split("data=").at(-1));
    return raw.split(":").at(-1);
  }
  return trimmed;
}

function setStep(step) {
  if (!orderStepLabel || !paymentStepLabel || !ticketsStepLabel) return;
  orderStepLabel.classList.toggle("checkout-step--active", step === "order");
  paymentStepLabel.classList.toggle("checkout-step--active", step === "payment");
  ticketsStepLabel.classList.toggle("checkout-step--active", step === "tickets");
}

function validatePaymentData(data) {
  const cleanNumber = data.cardNumber.replace(/\s+/g, "");
  return cleanNumber.length >= 16 && /^\d{2}\/\d{2}$/.test(data.expiry) && /^\d{3}$/.test(data.cvv) && data.cardHolder.trim().length >= 4;
}

function createPaidTickets(orderData) {
  const tickets = loadTickets();
  const existingCodes = new Set(tickets.map((ticket) => ticket.code));
  const orderId = crypto.randomUUID();
  const quantity = Number(orderData.quantity);
  const orderTotal = quantity * TICKET_PRICE;
  const createdAt = new Date().toISOString();
  const cardLast4 = orderData.cardNumber.replace(/\s+/g, "").slice(-4);

  const newTickets = Array.from({ length: quantity }, (_, index) => ({
    id: crypto.randomUUID(),
    orderId,
    code: generateCode(existingCodes),
    name: orderData.name.trim(),
    email: orderData.email.trim(),
    phone: orderData.phone.trim(),
    quantityInOrder: quantity,
    orderIndex: index + 1,
    price: TICKET_PRICE,
    orderTotal,
    paymentStatus: "paid",
    accessStatus: "new",
    voteTeam: null,
    paidAt: createdAt,
    createdAt,
    paymentReference: `**** **** **** ${cardLast4}`,
  }));

  saveTickets([...tickets, ...newTickets]);
  return newTickets;
}

function renderOrderTickets(orderTickets) {
  if (!resultCard || !ticketList || !orderTickets.length) return;

  document.querySelector("#ticket-order-title").textContent = `Заказ ${orderTickets[0].orderId.slice(0, 8).toUpperCase()}`;
  document.querySelector("#ticket-order-subtitle").textContent = `${orderTickets[0].name}, оплачено ${formatPrice(orderTickets[0].orderTotal)}. Ниже все билеты из заказа.`;

  ticketList.innerHTML = orderTickets
    .map((ticket) => `
      <article class="ticket-card">
        <img class="ticket-card__qr" src="${buildQrUrl(ticket)}" alt="QR-код билета ${ticket.code}">
        <div class="ticket-card__meta">
          <div>
            <p class="eyebrow">Билет ${ticket.orderIndex} из ${ticket.quantityInOrder}</p>
            <h3>${ticket.code}</h3>
          </div>
          <p><strong>Статус:</strong> ${ticket.accessStatus === "used" ? "Отсканирован" : "Ожидает входа"}</p>
          <p><strong>Оплата:</strong> ${ticket.paymentReference}</p>
          <p><strong>Стоимость:</strong> ${formatPrice(ticket.price)}</p>
          <a class="button button--secondary" target="_blank" rel="noreferrer" href="${buildQrUrl(ticket)}">Открыть QR</a>
        </div>
      </article>
    `)
    .join("");

  resultCard.hidden = false;
  setStep("tickets");
}

function renderPaymentSummary(order) {
  if (!paymentSummary) return;
  const total = Number(order.quantity) * TICKET_PRICE;
  paymentSummary.innerHTML = `
    <strong>${order.name}</strong><br>
    ${order.quantity} билет(а) • ${formatPrice(total)}<br>
    ${order.email}
  `;
}

function renderVoteResults() {
  if (!voteResults) return;
  const tickets = loadTickets();
  const totals = TEAMS.map((team) => ({
    team,
    votes: tickets.filter((ticket) => ticket.voteTeam === team).length,
  })).sort((a, b) => b.votes - a.votes);

  voteResults.innerHTML = totals
    .map((item) => `<li><strong>${item.team}</strong><span>${item.votes} голосов</span></li>`)
    .join("");
}

function setVoteMessage(message, mode) {
  if (!voteMessage) return;
  voteMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  voteMessage.innerHTML = message;
}

function renderQuizResult(type) {
  if (!quizResult) return;
  const result = QUIZ_RESULTS[type];
  quizResult.innerHTML = `
    <p class="eyebrow">Результат</p>
    <h3>${result.title}</h3>
    <p>${result.text}</p>
  `;
}

function renderCheckinLog() {
  if (!logList) return;

  const usedTickets = loadTickets()
    .filter((ticket) => ticket.accessStatus === "used")
    .sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));

  logList.innerHTML = usedTickets.length
    ? usedTickets.map((entry) => `<li><strong>${entry.code}</strong><span>${entry.name} • ${new Date(entry.usedAt).toLocaleString("ru-RU")}</span></li>`).join("")
    : "<li><strong>Пока нет отметок</strong><span>После первого прохода журнал появится здесь.</span></li>";
}

function setCheckinMessage(message, mode) {
  if (!checkinResult) return;
  checkinResult.className = `checkin-result ${mode ? `checkin-result--${mode}` : ""}`.trim();
  checkinResult.innerHTML = message;
}

function processCheckin(rawCode) {
  const code = normalizeTicketInput(rawCode);
  const tickets = loadTickets();
  const ticket = tickets.find((item) => item.code === code);

  if (!ticket) {
    setCheckinMessage("<strong>Билет не найден.</strong><br>Проверьте код или QR.", "warn");
    return false;
  }

  if (ticket.accessStatus === "used") {
    setCheckinMessage(`<strong>${ticket.code}</strong><br>Данный билет уже был отсканирован.`, "warn");
    return false;
  }

  ticket.accessStatus = "used";
  ticket.usedAt = new Date().toISOString();
  saveTickets(tickets);
  renderCheckinLog();

  setCheckinMessage(`<strong>Проход разрешён.</strong><br>${ticket.name} • ${ticket.code}<br>Время: ${new Date(ticket.usedAt).toLocaleString("ru-RU")}`, "ok");
  return true;
}

async function scanFrame() {
  if (!scannerState.active || !scannerState.detector || !scannerVideo) return;

  try {
    const barcodes = await scannerState.detector.detect(scannerVideo);
    const barcode = barcodes.find((item) => item.rawValue);

    if (barcode?.rawValue) {
      const now = Date.now();
      if (barcode.rawValue !== scannerState.lastRawValue || now - scannerState.lastDetectedAt > 1500) {
        scannerState.lastRawValue = barcode.rawValue;
        scannerState.lastDetectedAt = now;
        const field = checkinForm?.querySelector("input");
        if (field) field.value = normalizeTicketInput(barcode.rawValue);
        processCheckin(barcode.rawValue);
      }
    }
  } catch (error) {
    if (cameraStatus) cameraStatus.textContent = "Ошибка распознавания камеры.";
  }

  scannerState.frameId = requestAnimationFrame(scanFrame);
}

async function startScanner() {
  if (!scannerVideo || !cameraStatus) return;

  if (!("BarcodeDetector" in window)) {
    cameraStatus.textContent = "В этом браузере нет BarcodeDetector. Используйте ручной ввод или USB-сканер.";
    return;
  }

  try {
    scannerState.detector = new BarcodeDetector({ formats: ["qr_code"] });
    scannerState.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
    scannerVideo.srcObject = scannerState.stream;
    await scannerVideo.play();
    scannerState.active = true;
    cameraStatus.textContent = "Камера активна. Наведите QR в кадр.";
    scanFrame();
  } catch (error) {
    cameraStatus.textContent = "Не удалось запустить камеру. Проверьте разрешения браузера.";
  }
}

function stopScanner() {
  if (scannerState.frameId) cancelAnimationFrame(scannerState.frameId);
  if (scannerState.stream) {
    scannerState.stream.getTracks().forEach((track) => track.stop());
  }
  scannerState = {
    stream: null,
    detector: null,
    active: false,
    frameId: null,
    lastRawValue: "",
    lastDetectedAt: 0,
  };
  if (scannerVideo) scannerVideo.srcObject = null;
  if (cameraStatus) cameraStatus.textContent = "Камера остановлена.";
}

if (ticketForm && paymentForm) {
  const latestOrderTickets = getLastOrderTickets();
  if (latestOrderTickets.length) renderOrderTickets(latestOrderTickets);

  ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    pendingOrder = Object.fromEntries(new FormData(ticketForm).entries());
    renderPaymentSummary(pendingOrder);
    ticketForm.hidden = true;
    paymentForm.hidden = false;
    resultCard.hidden = true;
    setStep("payment");
  });

  paymentForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const paymentData = Object.fromEntries(new FormData(paymentForm).entries());
    if (!pendingOrder || !validatePaymentData(paymentData)) {
      renderPaymentSummary({
        name: "Проверьте данные карты",
        quantity: pendingOrder?.quantity || 1,
        email: "Заполните номер, срок, CVV и имя держателя.",
      });
      return;
    }

    payButton.textContent = "Оплата выполнена";
    const orderTickets = createPaidTickets({ ...pendingOrder, ...paymentData });
    renderOrderTickets(orderTickets);
    paymentForm.hidden = true;
    ticketForm.hidden = false;
    paymentForm.reset();
    ticketForm.reset();
    pendingOrder = null;
    renderVoteResults();
    setTimeout(() => {
      if (payButton) payButton.textContent = "Оплатить";
    }, 1200);
  });

  backToOrderButton?.addEventListener("click", () => {
    paymentForm.hidden = true;
    ticketForm.hidden = false;
    resultCard.hidden = true;
    setStep("order");
  });
}

if (voteForm) {
  renderVoteResults();

  voteForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(voteForm).entries());
    const code = normalizeTicketInput(data.ticketCode);
    const tickets = loadTickets();
    const ticket = tickets.find((item) => item.code === code);

    if (!ticket) {
      setVoteMessage("<strong>Билет не найден.</strong><br>Проверьте номер и попробуйте ещё раз.", "warn");
      return;
    }

    if (ticket.accessStatus !== "used") {
      setVoteMessage("<strong>Голос недоступен.</strong><br>Сначала этот билет должен быть отсканирован на входе.", "warn");
      return;
    }

    if (ticket.voteTeam) {
      setVoteMessage(`<strong>Голос уже засчитан.</strong><br>Билет ${ticket.code} уже голосовал за команду «${ticket.voteTeam}».`, "warn");
      return;
    }

    ticket.voteTeam = data.team;
    ticket.votedAt = new Date().toISOString();
    saveTickets(tickets);
    setVoteMessage(`<strong>Голос принят.</strong><br>Билет ${ticket.code} проголосовал за «${ticket.voteTeam}».`, "ok");
    renderVoteResults();
    voteForm.reset();
  });
}

if (quizForm) {
  quizForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(quizForm).entries());
    const scores = Object.values(data).reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});

    const winner = Object.entries(scores).sort((a, b) => b[1] - a[1])[0]?.[0] || "pelmeni";
    renderQuizResult(winner);
  });
}

if (checkinForm) {
  renderCheckinLog();

  checkinForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const field = checkinForm.querySelector("input");
    processCheckin(field.value);
    field.select();
  });

  startScanButton?.addEventListener("click", startScanner);
  stopScanButton?.addEventListener("click", stopScanner);
}

window.addEventListener("beforeunload", () => {
  if (scannerState.active) stopScanner();
});

