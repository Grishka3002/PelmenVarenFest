const http = require("http");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_ROOT = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_ROOT || ROOT;
const SQLITE_PATH = process.env.SQLITE_PATH || path.join(DATA_ROOT, "festival.sqlite");
const LEGACY_DB_PATH = path.join(ROOT, "db.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const CHECKIN_PASSWORD = process.env.CHECKIN_PASSWORD || "checkin123";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const CHECKIN_USERNAME = process.env.CHECKIN_USERNAME || "checkin";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_HOURS || 12) * 60 * 60 * 1000;
const TICKET_PRICE = 2500;
const QUIZ_RESULTS = {
  pelmeni: "Ты пельмень сибирский",
  khinkali: "Ты хинкали",
  momo: "Ты момо",
  varenik: "Ты вареник",
  gyoza: "Ты гёдза",
};
const DEFAULT_CONTENT = {
  seoTitle: "Костровье | фестиваль ремесла, музыки и северной кухни",
  seoDescription: "Лендинг фестиваля в русско-славянском стиле: программа, карта, галерея, билеты, голосование, тест и вход по QR-коду.",
  ogTitle: "Костровье | фестиваль ремесла, музыки и северной кухни",
  ogDescription: "Лендинг фестиваля в русско-славянском стиле: программа, карта, галерея, билеты, голосование, тест и вход по QR-коду.",
  ogImage: "",
  canonicalUrl: "",
  heroEyebrow: "18 июля 2026 • Владивосток • этнопарк «Берег Сварога»",
  heroTitle: "Лендинг фестиваля в русско-славянском духе с билетом и входом по QR.",
  heroLead: "Музыка у костра, ремесленные дворы, ярмарка, северная кухня, игры, хороводы и вечерний огненный круг на берегу.",
  heroSideLabel: "Главный день",
  heroSideDate: "18.07",
  heroSideSchedule: "Сбор гостей с 11:00<br>Открытие в 12:00<br>Огненный финал в 21:30",
  heroSideNote: "После оплаты гость получает персональные билеты с уникальными кодами и QR, которые сканируются на входе.",
  countdownEyebrow: "До открытия фестиваля",
  countdownNote: "Счётчик идёт до официального старта фестивального дня.",
  festivalStartAt: "2026-07-18T11:00:00+10:00",
  aboutEyebrow: "О фестивале",
  aboutTitle: "Тёплый, плотный, ремесленный визуальный образ вместо шаблонного промо-сайта.",
  aboutCard1Title: "Живая традиция",
  aboutCard1Text: "Песни, пляс, гусли, барабаны, ремесленные мастерские и семейные обряды без музейной пыли.",
  aboutCard2Title: "Еда и ярмарка",
  aboutCard2Text: "Печи, травяные сборы, фермерские продукты, авторская керамика, ткани, дерево и кузнечное дело.",
  aboutCard3Title: "Современный вход",
  aboutCard3Text: "Оплата, персональные QR-билеты, сканирование на входе, голосование по номеру билета и развлекательные механики на странице.",
  locationEyebrow: "Где и когда",
  locationTitle: "Вся практическая информация на одной странице.",
  dateLabel: "Дата",
  dateMain: "Суббота, 18 июля 2026 года",
  dateNote: "Вход гостей с 11:00. Первая сцена запускается в 12:00.",
  placeLabel: "Место",
  placeMain: "Этнопарк «Берег Сварога», Владивосток",
  placeNote: "Лесная поляна, ремесленный двор, береговая сцена, фуд-корт и детская зона.",
  routeLabel: "Как добраться",
  routeMain: "Фестивальный шаттл от центра города каждые 40 минут.",
  routeNote: "Парковка ограничена, гостям рекомендуем трансфер или такси.",
  mapLat: "43.1155",
  mapLon: "131.8855",
  mapZoom: "12",
  locationCta: "Купить билет",
  programEyebrow: "Программа",
  programTitle: "День разбит по крупным событиям, чтобы гостю было легко спланировать маршрут.",
  programItem1Time: "12:00",
  programItem1Title: "Открытие круга",
  programItem1Text: "Общий сбор, приветствие ведущих, хор, гусли и первый хоровод у главной сцены.",
  programItem2Time: "14:00",
  programItem2Title: "Ремесленные дворы",
  programItem2Text: "Кузнечное шоу, резьба по дереву, ткачество, роспись и мастер-классы для семей.",
  programItem3Time: "17:30",
  programItem3Title: "Большой концерт",
  programItem3Text: "Фолк-группы, этно-электроника, северные барабаны, народный вокал и танцевальный блок.",
  programItem4Time: "21:30",
  programItem4Title: "Огненный финал",
  programItem4Text: "Огненное шоу на берегу, световые инсталляции и закрывающий круг у костра.",
  galleryEyebrow: "Фотоальбом",
  galleryTitle: "Блок можно наполнить реальными кадрами без изменения структуры страницы.",
  galleryCap1: "Береговая сцена",
  galleryCap2: "Ремесленный двор",
  galleryCap3: "Огненный круг",
  galleryCap4: "Ярмарка мастеров",
  galleryCap5: "Семейные мастер-классы",
  galleryImage1: "",
  galleryImage2: "",
  galleryImage3: "",
  galleryImage4: "",
  galleryImage5: "",
  ticketsEyebrow: "Билеты",
  ticketsTitle: "Оплата, персональные QR-коды и готовность к контролю на входе.",
  ticketPriceLabel: "Стандарт",
  ticketPriceValue: "2 500 ₽",
  ticketPriceText: "Доступ на все площадки фестиваля, концерт и вечерний огненный круг.",
  ticketFeature1: "Каждый билет получает собственный код и QR",
  ticketFeature2: "После оплаты билет сразу доступен на странице",
  ticketFeature3: "После сканирования билет можно использовать для голосования",
  ticketNote: "Оплата реализована как клиентский checkout внутри проекта. Для боевого запуска потребуется подключение настоящего эквайринга и серверной базы билетов.",
  voteEyebrow: "Голосование",
  voteTitle: "Проголосовать может только гость, чей билет уже отсканирован на входе.",
  voteTicketLabel: "Номер билета",
  voteButton: "Отдать голос",
  voteScoreboard: "Таблица голосов",
  team1Name: "Команда Северный пар",
  team1Desc: "Сибирские пельмени и таёжные травы",
  team2Name: "Команда Жар-печь",
  team2Desc: "Огонь, дымок и авторская подача",
  team3Name: "Команда Морской дым",
  team3Desc: "Дальний Восток и северный берег",
  quizEyebrow: "Тест",
  quizTitle: "Какой ты пельмень?",
  quizQ1Title: "1. Какой ритм дня тебе ближе?",
  quizQ1A1: "Собранный и прямой",
  quizQ1A2: "Громкий и харизматичный",
  quizQ1A3: "Спокойный и тёплый",
  quizQ1A4: "Быстрый и дерзкий",
  quizQ1A5: "Любознательный и лёгкий на подъём",
  quizQ2Title: "2. Что берёшь на фестивале первым?",
  quizQ2A1: "Самую шумную сцену",
  quizQ2A2: "Уличную еду и движ",
  quizQ2A3: "Лужайку и плед",
  quizQ2A4: "Ярмарку и ремесло",
  quizQ2A5: "Необычную локальную закуску",
  quizQ3Title: "3. Что для тебя идеальная компания?",
  quizQ3A1: "Близкие люди и душевный разговор",
  quizQ3A2: "Надёжные друзья без лишнего шума",
  quizQ3A3: "Те, кто готовы к спонтанности",
  quizQ3A4: "Яркие лидеры и артисты",
  quizQ3A5: "Путешественники и исследователи вкусов",
  quizQ4Title: "4. Какой вкус ты выбираешь?",
  quizQ4A1: "Острый и хрустящий",
  quizQ4A2: "Классический и насыщенный",
  quizQ4A3: "Пряный и мощный",
  quizQ4A4: "Нежный и домашний",
  quizQ4A5: "Воздушный и неожиданно тонкий",
  quizQ5Title: "5. Какая роль тебе ближе на фестивале?",
  quizQ5A1: "Опора компании и человек-план",
  quizQ5A2: "Главный за настроение и эффектный вход",
  quizQ5A3: "Открывать новое и вести всех в неожиданные точки",
  quizQ5A4: "Создавать уют и собирать людей рядом",
  quizQ5A5: "Добавлять драйв, скорость и немного хаоса",
  quizButton: "Узнать результат",
  quizResultLabel: "Результат",
  quizResultTitle: "Твой пельмень ждёт тебя.",
  quizResultText: "Ответь на четыре вопроса, и блок покажет твой гастро-характер.",
  showCountdown: "true",
  showAbout: "true",
  showLocation: "true",
  showProgram: "true",
  showGallery: "true",
  showTickets: "true",
  showVote: "true",
  showQuiz: "true",
  showContacts: "true",
  contactsEyebrow: "Контакты",
  contactsTitle: "Блок для связи с гостями, партнёрами и прессой.",
  contactOrgTitle: "Организаторы",
  contactOrgPhone: "+7 (999) 000-12-34",
  contactOrgEmail: "hello@kostroviefest.ru",
  contactPressTitle: "Партнёры и медиа",
  contactPressEmail: "press@kostroviefest.ru",
  contactPressSocial: "@kostrovie_fest",
  contactTicketTitle: "Вопросы по билетам",
  contactTicketEmail: "tickets@kostroviefest.ru",
  contactTicketNote: "Входной контроль доступен по отдельной закрытой ссылке.",
};
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".sqlite": "application/octet-stream",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

let database = null;
let databaseReady = null;
const sessions = new Map();

function parseBody(req) {
  return (async () => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (!chunks.length) return {};
    return JSON.parse(Buffer.concat(chunks).toString("utf8"));
  })();
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(payload));
}

function sendCsv(res, filename, content) {
  res.writeHead(200, {
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": `attachment; filename="${filename}"`,
  });
  res.end(`\uFEFF${content}`);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeHtmlAttribute(value) {
  return escapeHtml(value).replace(/"/g, "&quot;");
}

function parseCookies(req) {
  const header = req.headers.cookie || "";
  return header.split(";").reduce((acc, part) => {
    const [key, ...rest] = part.trim().split("=");
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join("="));
    return acc;
  }, {});
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sid = cookies.sid;
  if (!sid) return null;
  const session = sessions.get(sid) || null;
  if (!session) return null;
  if (session.expiresAt <= Date.now()) {
    sessions.delete(sid);
    return null;
  }
  return session;
}

function createSession(user) {
  const sid = crypto.randomUUID();
  sessions.set(sid, {
    userId: user.id,
    role: user.role,
    username: user.username,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL_MS,
  });
  return sid;
}

function clearSession(req, res) {
  const cookies = parseCookies(req);
  if (cookies.sid) sessions.delete(cookies.sid);
  res.setHeader("Set-Cookie", "sid=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax");
}

function setSessionCookie(res, sid) {
  res.setHeader("Set-Cookie", `sid=${sid}; HttpOnly; Path=/; SameSite=Lax`);
}

function requireRole(req, res, role) {
  const session = getSession(req);
  if (!session || session.role !== role) {
    sendError(res, 401, "Требуется авторизация.");
    return false;
  }
  session.expiresAt = Date.now() + SESSION_TTL_MS;
  return true;
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const actualHash = crypto.scryptSync(String(password), String(salt), 64);
  const expectedBuffer = Buffer.from(String(expectedHash), "hex");
  if (actualHash.length !== expectedBuffer.length) return false;
  return crypto.timingSafeEqual(actualHash, expectedBuffer);
}

function runTransaction(db, callback) {
  db.exec("BEGIN");
  try {
    const result = callback();
    db.exec("COMMIT");
    return result;
  } catch (error) {
    db.exec("ROLLBACK");
    throw error;
  }
}

function getMeta(db, key) {
  const row = db.prepare("SELECT value FROM app_meta WHERE key = ?").get(key);
  return row ? row.value : null;
}

function setMeta(db, key, value) {
  db.prepare("INSERT INTO app_meta(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value").run(key, String(value));
}

function mapUserRow(row) {
  return {
    id: row.id,
    role: row.role,
    username: row.username,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function listUsers(db) {
  return db.prepare("SELECT id, role, username, created_at, updated_at FROM users ORDER BY role, username").all().map(mapUserRow);
}

function findUserForLogin(db, role, username) {
  return db.prepare("SELECT * FROM users WHERE role = ? AND lower(username) = lower(?)").get(role, username);
}

function findUserById(db, id) {
  const row = db.prepare("SELECT id, role, username, created_at, updated_at FROM users WHERE id = ?").get(id);
  return row ? mapUserRow(row) : null;
}

function createUser(db, role, username, password) {
  const normalizedRole = String(role || "").trim();
  const normalizedUsername = String(username || "").trim();
  if (!["admin", "checkin"].includes(normalizedRole)) {
    throw new Error("Недопустимая роль.");
  }
  if (!/^[a-zA-Z0-9._-]{3,32}$/.test(normalizedUsername)) {
    throw new Error("Логин должен быть длиной 3-32 символа и содержать только буквы, цифры, ., _, -.");
  }
  if (String(password || "").length < 8) {
    throw new Error("Пароль должен быть не короче 8 символов.");
  }

  const now = new Date().toISOString();
  const id = crypto.randomUUID();
  const { salt, hash } = hashPassword(password);

  try {
    db.prepare(`
      INSERT INTO users(id, role, username, password_hash, password_salt, created_at, updated_at)
      VALUES(?, ?, ?, ?, ?, ?, ?)
    `).run(id, normalizedRole, normalizedUsername, hash, salt, now, now);
  } catch (error) {
    if (String(error.message).includes("UNIQUE")) {
      throw new Error("Пользователь с таким логином уже существует.");
    }
    throw error;
  }

  return findUserById(db, id);
}

function updateUserPassword(db, userId, password) {
  if (String(password || "").length < 8) {
    throw new Error("Пароль должен быть не короче 8 символов.");
  }
  const user = db.prepare("SELECT id FROM users WHERE id = ?").get(userId);
  if (!user) throw new Error("Пользователь не найден.");

  const now = new Date().toISOString();
  const { salt, hash } = hashPassword(password);
  db.prepare("UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?").run(hash, salt, now, userId);
  return findUserById(db, userId);
}

function seedDefaultUsers(db) {
  if (db.prepare("SELECT COUNT(*) AS total FROM users").get().total > 0) return;
  createUser(db, "admin", ADMIN_USERNAME, ADMIN_PASSWORD);
  createUser(db, "checkin", CHECKIN_USERNAME, CHECKIN_PASSWORD);
}

function seedContentDefaults(db) {
  const statement = db.prepare("INSERT INTO content(key, value) VALUES(?, ?) ON CONFLICT(key) DO NOTHING");
  runTransaction(db, () => {
    Object.entries(DEFAULT_CONTENT).forEach(([key, value]) => {
      statement.run(key, String(value ?? ""));
    });
  });
}

function saveContent(db, content) {
  const merged = { ...DEFAULT_CONTENT, ...(content || {}) };
  const insert = db.prepare("INSERT INTO content(key, value) VALUES(?, ?)");
  runTransaction(db, () => {
    db.exec("DELETE FROM content");
    Object.entries(merged).forEach(([key, value]) => {
      insert.run(key, String(value ?? ""));
    });
  });
  return getContent(db);
}

function getContent(db) {
  const rows = db.prepare("SELECT key, value FROM content").all();
  return rows.reduce((acc, row) => {
    acc[row.key] = row.value;
    return acc;
  }, { ...DEFAULT_CONTENT });
}

function normalizeTicketRecord(ticket) {
  const quantityInOrder = Math.max(1, Number(ticket.quantityInOrder || 1));
  const price = Number(ticket.price || TICKET_PRICE);
  return {
    id: String(ticket.id || crypto.randomUUID()),
    orderId: String(ticket.orderId || crypto.randomUUID()),
    code: String(ticket.code || ""),
    name: String(ticket.name || "").trim(),
    email: String(ticket.email || "").trim(),
    phone: String(ticket.phone || "").trim(),
    quantityInOrder,
    orderIndex: Math.max(1, Number(ticket.orderIndex || 1)),
    price,
    orderTotal: Number(ticket.orderTotal || quantityInOrder * price),
    paymentStatus: String(ticket.paymentStatus || "paid"),
    accessStatus: String(ticket.accessStatus || "new"),
    voteTeam: ticket.voteTeam ? String(ticket.voteTeam) : null,
    paidAt: ticket.paidAt ? String(ticket.paidAt) : null,
    createdAt: String(ticket.createdAt || new Date().toISOString()),
    paymentReference: String(ticket.paymentReference || ""),
    usedAt: ticket.usedAt ? String(ticket.usedAt) : null,
    votedAt: ticket.votedAt ? String(ticket.votedAt) : null,
  };
}

function insertTicket(db, ticket, options = {}) {
  const normalized = normalizeTicketRecord(ticket);
  const mode = options.replace ? "INSERT OR REPLACE" : "INSERT";
  db.prepare(`${mode} INTO tickets(
    id, order_id, code, name, email, phone, quantity_in_order, order_index, price, order_total,
    payment_status, access_status, vote_team, paid_at, created_at, payment_reference, used_at, voted_at
  ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      normalized.id,
      normalized.orderId,
      normalized.code,
      normalized.name,
      normalized.email,
      normalized.phone,
      normalized.quantityInOrder,
      normalized.orderIndex,
      normalized.price,
      normalized.orderTotal,
      normalized.paymentStatus,
      normalized.accessStatus,
      normalized.voteTeam,
      normalized.paidAt,
      normalized.createdAt,
      normalized.paymentReference,
      normalized.usedAt,
      normalized.votedAt,
    );
}

function insertQuizEntry(db, entry, options = {}) {
  const normalized = {
    id: String(entry.id || crypto.randomUUID()),
    type: String(entry.type || "").trim(),
    createdAt: String(entry.createdAt || new Date().toISOString()),
  };
  const mode = options.replace ? "INSERT OR REPLACE" : "INSERT";
  db.prepare(`${mode} INTO quiz_entries(id, type, created_at) VALUES(?, ?, ?)`)
    .run(normalized.id, normalized.type, normalized.createdAt);
}

function mapTicketRow(row) {
  return {
    id: row.id,
    orderId: row.order_id,
    code: row.code,
    name: row.name,
    email: row.email,
    phone: row.phone,
    quantityInOrder: row.quantity_in_order,
    orderIndex: row.order_index,
    price: row.price,
    orderTotal: row.order_total,
    paymentStatus: row.payment_status,
    accessStatus: row.access_status,
    voteTeam: row.vote_team,
    paidAt: row.paid_at,
    createdAt: row.created_at,
    paymentReference: row.payment_reference,
    usedAt: row.used_at,
    votedAt: row.voted_at,
  };
}

function getTickets(db) {
  return db.prepare("SELECT * FROM tickets ORDER BY created_at DESC").all().map(mapTicketRow);
}

function getTicketByCode(db, code) {
  const row = db.prepare("SELECT * FROM tickets WHERE code = ?").get(code);
  return row ? mapTicketRow(row) : null;
}

function getQuizEntries(db) {
  return db.prepare("SELECT id, type, created_at FROM quiz_entries ORDER BY created_at DESC").all().map((row) => ({
    id: row.id,
    type: row.type,
    createdAt: row.created_at,
  }));
}

function getState(db) {
  return {
    content: getContent(db),
    tickets: getTickets(db),
    quizEntries: getQuizEntries(db),
  };
}

function getTeamNames(state) {
  return [state.content.team1Name, state.content.team2Name, state.content.team3Name].filter(Boolean);
}

function buildStats(state) {
  const tickets = state.tickets;
  const sold = tickets.length;
  const scanned = tickets.filter((ticket) => ticket.accessStatus === "used").length;
  const revenue = tickets.reduce((sum, ticket) => sum + Number(ticket.price || 0), 0);
  const votesCast = tickets.filter((ticket) => ticket.voteTeam).length;
  const voteResults = getTeamNames(state)
    .map((team) => ({ team, votes: tickets.filter((ticket) => ticket.voteTeam === team).length }))
    .sort((a, b) => b.votes - a.votes);
  const quizResults = Object.entries(QUIZ_RESULTS)
    .map(([key, title]) => ({ key, title, total: state.quizEntries.filter((entry) => entry.type === key).length }))
    .sort((a, b) => b.total - a.total);
  const recentTickets = [...tickets]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8)
    .map((ticket) => ({
      code: ticket.code,
      name: ticket.name,
      accessStatus: ticket.accessStatus,
      createdAt: ticket.createdAt,
      voteTeam: ticket.voteTeam,
    }));

  return {
    ticketsSold: sold,
    ticketsScanned: scanned,
    ticketsRevenue: revenue,
    votesCast,
    quizTotal: state.quizEntries.length,
    voteResults,
    quizResults,
    recentTickets,
  };
}

function createTicketCode(db) {
  while (true) {
    const candidate = `PF26-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    const exists = db.prepare("SELECT 1 FROM tickets WHERE code = ?").get(candidate);
    if (!exists) return candidate;
  }
}

function buildQuizExportCsv(state) {
  const rows = [
    ["Время прохождения", "Результат"],
    ...state.quizEntries
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((entry) => [entry.createdAt, QUIZ_RESULTS[entry.type] || entry.type]),
  ];
  return rows.map((row) => row.map(escapeCsv).join(";")).join("\n");
}

function buildTicketsExportCsv(state) {
  const rows = [
    ["Время покупки", "Статус", "Номер билета", "ФИО", "Кол-во билетов в заказе", "Стоимость билета", "Сумма заказа"],
    ...state.tickets
      .slice()
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((ticket) => [
        ticket.paidAt || ticket.createdAt || "",
        ticket.accessStatus === "used" ? "Отсканирован" : "Не отсканирован",
        ticket.code,
        ticket.name,
        ticket.quantityInOrder,
        ticket.price,
        ticket.orderTotal,
      ]),
  ];
  return rows.map((row) => row.map(escapeCsv).join(";")).join("\n");
}

async function migrateLegacyJsonIfNeeded(db) {
  if (getMeta(db, "legacy_json_imported_at")) return;

  let legacy = null;
  try {
    const raw = await fs.readFile(LEGACY_DB_PATH, "utf8");
    legacy = JSON.parse(raw.replace(/^\uFEFF/, ""));
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn(`Failed to read legacy db.json: ${error.message}`);
    }
  }

  if (legacy && typeof legacy === "object") {
    runTransaction(db, () => {
      if (legacy.content && typeof legacy.content === "object") {
        Object.entries(legacy.content).forEach(([key, value]) => {
          db.prepare("INSERT INTO content(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value")
            .run(key, String(value ?? ""));
        });
      }

      if (Array.isArray(legacy.tickets)) {
        legacy.tickets.forEach((ticket) => {
          if (!ticket || typeof ticket !== "object") return;
          try {
            insertTicket(db, {
              ...ticket,
              code: String(ticket.code || createTicketCode(db)),
            }, { replace: true });
          } catch (error) {
            console.warn(`Skipped legacy ticket during migration: ${error.message}`);
          }
        });
      }

      if (Array.isArray(legacy.quizEntries)) {
        legacy.quizEntries.forEach((entry) => {
          if (!entry || typeof entry !== "object" || !QUIZ_RESULTS[String(entry.type || "").trim()]) return;
          try {
            insertQuizEntry(db, entry, { replace: true });
          } catch (error) {
            console.warn(`Skipped legacy quiz entry during migration: ${error.message}`);
          }
        });
      }
    });

    console.log(`Legacy db.json migrated to ${path.basename(SQLITE_PATH)}.`);
  }

  setMeta(db, "legacy_json_imported_at", new Date().toISOString());
}

async function ensureDatabase() {
  if (database) return database;
  if (databaseReady) return databaseReady;

  databaseReady = (async () => {
    await fs.mkdir(path.dirname(SQLITE_PATH), { recursive: true });
    const db = new DatabaseSync(SQLITE_PATH);
    db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;

      CREATE TABLE IF NOT EXISTS app_meta (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS content (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        role TEXT NOT NULL,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        password_salt TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

      CREATE TABLE IF NOT EXISTS tickets (
        id TEXT PRIMARY KEY,
        order_id TEXT NOT NULL,
        code TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        quantity_in_order INTEGER NOT NULL,
        order_index INTEGER NOT NULL,
        price INTEGER NOT NULL,
        order_total INTEGER NOT NULL,
        payment_status TEXT NOT NULL,
        access_status TEXT NOT NULL,
        vote_team TEXT,
        paid_at TEXT,
        created_at TEXT NOT NULL,
        payment_reference TEXT NOT NULL,
        used_at TEXT,
        voted_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_tickets_code ON tickets(code);
      CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);

      CREATE TABLE IF NOT EXISTS quiz_entries (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_quiz_entries_created_at ON quiz_entries(created_at DESC);
    `);

    await migrateLegacyJsonIfNeeded(db);
    seedContentDefaults(db);
    seedDefaultUsers(db);
    database = db;
    return db;
  })();

  return databaseReady;
}

async function handleApi(req, res, pathname) {
  const db = await ensureDatabase();

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const body = await parseBody(req);
    const role = String(body.role || "").trim();
    const username = String(body.username || "").trim();
    const password = String(body.password || "");

    if (!["admin", "checkin"].includes(role)) return sendError(res, 400, "Неизвестная зона доступа.");
    if (!username || !password) return sendError(res, 400, "Введите логин и пароль.");

    const user = findUserForLogin(db, role, username);
    if (!user || !verifyPassword(password, user.password_salt, user.password_hash)) {
      return sendError(res, 401, "Неверный логин или пароль.");
    }

    const sid = createSession({ id: user.id, role: user.role, username: user.username });
    setSessionCookie(res, sid);
    return sendJson(res, 200, { ok: true, role: user.role, user: { id: user.id, username: user.username } });
  }

  if (req.method === "POST" && pathname === "/api/auth/logout") {
    clearSession(req, res);
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/auth/status") {
    const role = String(new URL(req.url, `http://${req.headers.host}`).searchParams.get("role") || "");
    const session = getSession(req);
    if (session) session.expiresAt = Date.now() + SESSION_TTL_MS;
    const authenticated = !!session && session.role === role;
    return sendJson(res, 200, {
      authenticated,
      role: authenticated ? session.role : null,
      user: authenticated ? { id: session.userId, username: session.username } : null,
    });
  }

  if (req.method === "GET" && pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, date: new Date().toISOString() });
  }

  if (req.method === "GET" && pathname === "/api/content") {
    return sendJson(res, 200, { content: getContent(db) });
  }

  if (req.method === "GET" && pathname === "/api/public-stats") {
    const stats = buildStats(getState(db));
    return sendJson(res, 200, { voteResults: stats.voteResults });
  }

  if (req.method === "PUT" && pathname === "/api/content") {
    if (!requireRole(req, res, "admin")) return;
    const body = await parseBody(req);
    return sendJson(res, 200, { content: saveContent(db, body.content) });
  }

  if (req.method === "DELETE" && pathname === "/api/content") {
    if (!requireRole(req, res, "admin")) return;
    return sendJson(res, 200, { content: saveContent(db, DEFAULT_CONTENT) });
  }

  if (req.method === "GET" && pathname === "/api/tickets") {
    const session = getSession(req);
    if (!session || !["admin", "checkin"].includes(session.role)) {
      return sendError(res, 401, "Требуется авторизация.");
    }
    return sendJson(res, 200, { tickets: getTickets(db) });
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    const body = await parseBody(req);
    const quantity = Number(body.quantity);
    const cardNumber = String(body.cardNumber || "").replace(/\s+/g, "");

    if (!body.name || !body.email || !body.phone || !quantity || quantity < 1 || quantity > 4) {
      return sendError(res, 400, "Некорректные данные заказа.");
    }
    if (cardNumber.length < 16) {
      return sendError(res, 400, "Некорректные данные оплаты.");
    }

    const orderId = crypto.randomUUID();
    const createdAt = new Date().toISOString();
    const orderTotal = quantity * TICKET_PRICE;
    const last4 = cardNumber.slice(-4);
    const tickets = [];

    runTransaction(db, () => {
      for (let index = 0; index < quantity; index += 1) {
        const ticket = {
          id: crypto.randomUUID(),
          orderId,
          code: createTicketCode(db),
          name: String(body.name).trim(),
          email: String(body.email).trim(),
          phone: String(body.phone).trim(),
          quantityInOrder: quantity,
          orderIndex: index + 1,
          price: TICKET_PRICE,
          orderTotal,
          paymentStatus: "paid",
          accessStatus: "new",
          voteTeam: null,
          paidAt: createdAt,
          createdAt,
          paymentReference: `**** **** **** ${last4}`,
          usedAt: null,
          votedAt: null,
        };
        insertTicket(db, ticket);
        tickets.push(ticket);
      }
    });

    return sendJson(res, 201, { orderId, tickets });
  }

  if (req.method === "POST" && pathname === "/api/checkin") {
    if (!requireRole(req, res, "checkin")) return;
    const body = await parseBody(req);
    const code = String(body.code || "").trim();
    const ticket = getTicketByCode(db, code);

    if (!ticket) return sendError(res, 404, "Билет не найден.");
    if (ticket.accessStatus === "used") return sendError(res, 409, "Данный билет уже был отсканирован.");

    const usedAt = new Date().toISOString();
    db.prepare("UPDATE tickets SET access_status = ?, used_at = ? WHERE code = ?").run("used", usedAt, code);
    return sendJson(res, 200, { ticket: getTicketByCode(db, code) });
  }

  if (req.method === "POST" && pathname === "/api/vote") {
    const body = await parseBody(req);
    const code = String(body.code || "").trim();
    const team = String(body.team || "").trim();
    const state = getState(db);
    const ticket = state.tickets.find((item) => item.code === code);
    const teamNames = getTeamNames(state);

    if (!ticket) return sendError(res, 404, "Билет не найден.");
    if (ticket.accessStatus !== "used") return sendError(res, 409, "Голосование доступно только после сканирования билета.");
    if (ticket.voteTeam) return sendError(res, 409, `Билет уже голосовал за «${ticket.voteTeam}».`);
    if (!teamNames.includes(team)) return sendError(res, 400, "Неизвестная команда.");

    const votedAt = new Date().toISOString();
    db.prepare("UPDATE tickets SET vote_team = ?, voted_at = ? WHERE code = ?").run(team, votedAt, code);
    return sendJson(res, 200, { ticket: getTicketByCode(db, code) });
  }

  if (req.method === "POST" && pathname === "/api/quiz") {
    const body = await parseBody(req);
    const type = String(body.type || "").trim();
    if (!QUIZ_RESULTS[type]) return sendError(res, 400, "Неизвестный результат теста.");
    const entry = { id: crypto.randomUUID(), type, createdAt: new Date().toISOString() };
    insertQuizEntry(db, entry);
    return sendJson(res, 201, { entry });
  }

  if (req.method === "GET" && pathname === "/api/stats") {
    if (!requireRole(req, res, "admin")) return;
    return sendJson(res, 200, { stats: buildStats(getState(db)) });
  }

  if (req.method === "GET" && pathname === "/api/admin/users") {
    if (!requireRole(req, res, "admin")) return;
    return sendJson(res, 200, { users: listUsers(db) });
  }

  if (req.method === "POST" && pathname === "/api/admin/users") {
    if (!requireRole(req, res, "admin")) return;
    const body = await parseBody(req);
    try {
      const user = createUser(db, body.role, body.username, body.password);
      return sendJson(res, 201, { user });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  if (req.method === "PATCH" && pathname.startsWith("/api/admin/users/") && pathname.endsWith("/password")) {
    if (!requireRole(req, res, "admin")) return;
    const userId = pathname.split("/")[4];
    const body = await parseBody(req);
    try {
      const user = updateUserPassword(db, userId, body.password);
      return sendJson(res, 200, { user });
    } catch (error) {
      return sendError(res, 400, error.message);
    }
  }

  if (req.method === "POST" && pathname === "/api/reset/tickets") {
    if (!requireRole(req, res, "admin")) return;
    db.exec("DELETE FROM tickets");
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/reset/quiz") {
    if (!requireRole(req, res, "admin")) return;
    db.exec("DELETE FROM quiz_entries");
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && pathname === "/api/export/quiz.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "quiz-results.csv", buildQuizExportCsv(getState(db)));
  }

  if (req.method === "GET" && pathname === "/api/export/tickets.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "tickets-report.csv", buildTicketsExportCsv(getState(db)));
  }

  return sendError(res, 404, "Маршрут не найден.");
}

async function serveStatic(res, pathname) {
  const routeMap = {
    "/": "index.html",
    "/admin": "admin.html",
    "/checkin": "checkin.html",
  };
  const target = routeMap[pathname] || pathname.slice(1);
  const resolved = path.normalize(path.join(ROOT, target));

  if (!resolved.startsWith(ROOT)) {
    sendError(res, 403, "Доступ запрещён.");
    return;
  }

  try {
    const ext = path.extname(resolved).toLowerCase();

    if (target === "index.html") {
      const db = await ensureDatabase();
      const content = getContent(db);
      let html = await fs.readFile(resolved, "utf8");
      html = html.replace(
        /<title>[\s\S]*?<\/title>/i,
        `<title>${escapeHtml(content.seoTitle || DEFAULT_CONTENT.seoTitle)}</title>`,
      );
      html = html.replace(
        /<meta\s+name="description"\s+content="[^"]*"\s*>/i,
        `<meta name="description" content="${escapeHtmlAttribute(content.seoDescription || DEFAULT_CONTENT.seoDescription)}">`,
      );
      html = html.replace(
        /<meta\s+property="og:title"\s+content="[^"]*"\s*>/i,
        `<meta property="og:title" content="${escapeHtmlAttribute(content.ogTitle || content.seoTitle || DEFAULT_CONTENT.ogTitle)}">`,
      );
      html = html.replace(
        /<meta\s+property="og:description"\s+content="[^"]*"\s*>/i,
        `<meta property="og:description" content="${escapeHtmlAttribute(content.ogDescription || content.seoDescription || DEFAULT_CONTENT.ogDescription)}">`,
      );
      html = html.replace(
        /<meta\s+property="og:image"\s+content="[^"]*"\s*>/i,
        `<meta property="og:image" content="${escapeHtmlAttribute(content.ogImage || DEFAULT_CONTENT.ogImage)}">`,
      );
      html = html.replace(
        /<link\s+rel="canonical"\s+href="[^"]*"\s*>/i,
        `<link rel="canonical" href="${escapeHtmlAttribute(content.canonicalUrl || DEFAULT_CONTENT.canonicalUrl)}">`,
      );
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end(html);
      return;
    }

    const file = await fs.readFile(resolved);
    res.writeHead(200, { "Content-Type": MIME_TYPES[ext] || "application/octet-stream" });
    res.end(file);
  } catch (error) {
    sendError(res, 404, "Файл не найден.");
  }
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    if (url.pathname.startsWith("/api/")) {
      await handleApi(req, res, url.pathname);
      return;
    }
    await serveStatic(res, url.pathname);
  } catch (error) {
    console.error(error);
    sendError(res, 500, "Внутренняя ошибка сервера.");
  }
});

ensureDatabase()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server started on http://localhost:${PORT}`);
      console.log(`SQLite storage: ${SQLITE_PATH}`);
    });
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
