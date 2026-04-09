const http = require("http");
const fsNative = require("fs");
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { DatabaseSync } = require("node:sqlite");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const DATA_ROOT = process.env.RAILWAY_VOLUME_MOUNT_PATH || process.env.DATA_ROOT || ROOT;
const SQLITE_PATH = process.env.SQLITE_PATH || path.join(DATA_ROOT, "festival.sqlite");
const LEGACY_DB_PATH = path.join(ROOT, "db.json");
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const CHECKIN_PASSWORD = process.env.CHECKIN_PASSWORD || "checkin123";
const JURY_DEFAULT_PASSWORD = process.env.JURY_DEFAULT_PASSWORD || "jury12345";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const CHECKIN_USERNAME = process.env.CHECKIN_USERNAME || "checkin";
const SESSION_TTL_MS = Number(process.env.SESSION_TTL_HOURS || 12) * 60 * 60 * 1000;
const TICKET_PRICE = 600;
const TEAM_MAIN_LIMIT = 20;
const STATIC_MAP = { lat: "43.174647", lon: "132.713618", zoom: "12" };
const YOOKASSA_SHOP_ID = String(process.env.YOOKASSA_SHOP_ID || "").trim();
const YOOKASSA_SECRET_KEY = String(process.env.YOOKASSA_SECRET_KEY || "").trim();
const YOOKASSA_RETURN_URL = String(process.env.YOOKASSA_RETURN_URL || "").trim();
const YOOKASSA_WEBHOOK_URL = String(process.env.YOOKASSA_WEBHOOK_URL || "").trim();
const YOOKASSA_API_BASE = "https://api.yookassa.ru/v3";
const PUBLIC_BASE_URL = String(process.env.PUBLIC_BASE_URL || "").trim().replace(/\/+$/, "");
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
  ogImage: "/images/logo.png",
  canonicalUrl: "",
  heroEyebrow: "18 июля 2026 • Владивосток • этнопарк «Берег Сварога»",
  heroTitle: "Лендинг фестиваля в русско-славянском духе с билетом и входом по QR.",
  heroLead: "Музыка у костра, ремесленные дворы, ярмарка, северная кухня, игры, хороводы и вечерний огненный круг на берегу.",
  heroSideLabel: "Главный день",
  heroSideDate: "16.05",
  heroSideSchedule: "Сбор гостей с 11:00<br>Открытие в 12:00<br>Огненный финал в 21:30",
  heroSideNote: "После оплаты гость получает персональные билеты с уникальными кодами и QR, которые сканируются на входе.",
  heroStat1Value: "12+",
  heroStat1Text: "часов программы",
  heroStat2Value: "4",
  heroStat2Text: "тематические площадки",
  heroStat3Value: "1 QR",
  heroStat3Text: "на каждый билет",
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
  aboutCard4Title: "Семейный формат",
  aboutCard4Text: "Пространство для детей и родителей, мастер-классы, игровые станции и безопасный дневной ритм.",
  locationEyebrow: "Где и когда",
  locationTitle: "Вся практическая информация на одной странице.",
  dateLabel: "Дата",
  dateMain: "Суббота, 16 мая 2026 года",
  dateNote: "Вход гостей с 11:00. Первая сцена запускается в 12:00.",
  placeLabel: "Место",
  placeMain: "Этнопарк «Берег Сварога», Владивосток",
  placeNote: "Лесная поляна, ремесленный двор, береговая сцена, фуд-корт и детская зона.",
  routeLabel: "Как добраться",
  routeMain: "Фестивальный шаттл от центра города каждые 40 минут.",
  routeNote: "Парковка ограничена, гостям рекомендуем трансфер или такси.",
  parkingNote: "Бесплатная парковка на 70 мест. Если хотите припарковаться у входа, приезжайте заранее.",
  mapLat: STATIC_MAP.lat,
  mapLon: STATIC_MAP.lon,
  mapZoom: STATIC_MAP.zoom,
  locationCta: "Купить билет",
  programEyebrow: "Программа",
  programItem1Time: "12:00",
  programItem1Title: "Открытие круга",
  programItem2Time: "14:00",
  programItem2Title: "Ремесленные дворы",
  programItem3Time: "17:30",
  programItem3Title: "Большой концерт",
  programItem4Time: "21:30",
  programItem4Title: "Огненный финал",
  programItem5Time: "10:00",
  programItem5Title: "Регистрация команд",
  programItem6Time: "11:00",
  programItem6Title: "Открытие фуд-зоны",
  programItem7Time: "13:30",
  programItem7Title: "Конкурсная подача блюд",
  programItem8Time: "16:00",
  programItem8Title: "Мастер-классы шефов",
  programItem9Time: "19:00",
  programItem9Title: "Награждение победителей",
  galleryEyebrow: "Фотоальбом",
  galleryTitle: "Блок можно наполнить реальными кадрами без изменения структуры страницы.",
  galleryMoreNote: "Со всеми фотографиями можете ознакомиться по ссылке:",
  galleryMoreLinkText: "Смотреть все фото",
  galleryMoreLinkUrl: "#",
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
  juryEyebrow: "Жюри",
  juryTitle: "Пять экспертов оценивают команды и фестивальные подачи.",
  juryName1: "Александр Невский",
  juryRegalia1: "Шеф-повар, эксперт по региональной кухне Дальнего Востока.",
  juryPhoto1: "",
  juryName2: "Мария Белова",
  juryRegalia2: "Этнокультуролог, куратор ремесленных и гастрономических программ.",
  juryPhoto2: "",
  juryName3: "Илья Сомов",
  juryRegalia3: "Ресторатор, автор фестивалей локальной кухни.",
  juryPhoto3: "",
  juryName4: "Екатерина Ярова",
  juryRegalia4: "Фуд-журналист, обозреватель гастрономических событий.",
  juryPhoto4: "",
  juryName5: "Денис Ладов",
  juryRegalia5: "Бренд-шеф, судья кулинарных чемпионатов.",
  juryPhoto5: "",
  partnersEyebrow: "Партнёры",
  partnersTitle: "Люди и компании, которые помогают фестивалю состояться.",
  partner1Name: "",
  partner1Level: "",
  partner1Description: "",
  partner1Logo: "",
  partner2Name: "",
  partner2Level: "",
  partner2Description: "",
  partner2Logo: "",
  partner3Name: "",
  partner3Level: "",
  partner3Description: "",
  partner3Logo: "",
  partner4Name: "",
  partner4Level: "",
  partner4Description: "",
  partner4Logo: "",
  partner5Name: "",
  partner5Level: "",
  partner5Description: "",
  partner5Logo: "",
  partner6Name: "",
  partner6Level: "",
  partner6Description: "",
  partner6Logo: "",
  partner7Name: "",
  partner7Level: "",
  partner7Description: "",
  partner7Logo: "",
  partner8Name: "",
  partner8Level: "",
  partner8Description: "",
  partner8Logo: "",
  partner9Name: "",
  partner9Level: "",
  partner9Description: "",
  partner9Logo: "",
  partner10Name: "",
  partner10Level: "",
  partner10Description: "",
  partner10Logo: "",
  juryScoringTeams: "Команда Северный пар\nКоманда Жар-печь\nКоманда Морской дым",
  juryScoringCriteria: "Вкус\nПодача\nОригинальность\nТехника\nПрезентация",
  teamsEyebrow: "Командам",
  teamsTitle: "Подайте заявку на участие в конкурсе фестиваля.",
  teamsLead: "Заполните форму: заявка уходит организаторам и фиксируется в системе.",
  teamsApplyButton: "Подать заявку",
  teamsFormTitle: "Заявка команды",
  teamsLeaderLabel: "ФИО руководителя команды",
  teamsNameLabel: "Название команды",
  teamsOrganizationLabel: "Организация",
  teamsPhoneLabel: "Контактный телефон",
  teamsParticipantsLabel: "5 ФИО участников (включая капитана)",
  teamsNominationsLabel: "Выберите номинации (можно несколько)",
  teamsNomination1: "Лучшее традиционное блюдо",
  teamsNomination2: "Авторская интерпретация",
  teamsNomination3: "Лучшая подача",
  teamsNomination4: "Приз зрительских симпатий",
  teamsDishLabel: "Краткое описание блюда",
  teamsConceptLabel: "Концепция команды",
  teamsEquipmentLabel: "Базовое оборудование от организаторов",
  teamsEquipmentNeedAll: "Да, всё необходимо",
  teamsEquipmentOwn: "Будем работать со своим",
  teamsWishesLabel: "Особые пожелания и комментарии",
  teamsSubmitButton: "Отправить заявку",
  teamsApplyDisclaimer: "Если вы что-то заполнили неточно или данные изменились, повторно заполнять форму не нужно. Уточнения можно передать организатору.",
  teamsRegulationText: "Положение конкурса",
  teamsRegulationUrl: "/docs/regulation.pdf",
  teamsSuccessMessage: "Заявка отправлена. Организаторы свяжутся с вами.",
  teamsReserveMessage: "Вы добавлены в резерв. Организатор свяжется с вами при появлении места в основном списке.",
  teamsRegisteredPopupMessage: "Команда зарегистрирована. Следите за новостями и обновлениями в нашем Telegram-канале.",
  teamsRegisteredPopupCaption: "Подпишитесь, чтобы не пропустить новости фестиваля.",
  teamsRegisteredPopupLinkText: "Перейти в Telegram-канал",
  teamsRegisteredPopupLinkUrl: "https://t.me/",
  ticketsEyebrow: "Билеты",
  ticketsTitle: "Оплата, персональные QR-коды и готовность к контролю на входе.",
  ticketPriceLabel: "Стандарт",
  ticketPriceValue: "600 ₽",
  ticketPriceText: "Доступ на все площадки фестиваля, концерт и вечерний огненный круг.",
  ticketFeature1: "Каждый билет получает собственный код и QR",
  ticketFeature2: "После оплаты билет сразу доступен на странице",
  ticketFeature3: "После сканирования билет можно использовать для голосования",
  ticketNote: "Оплата реализована как клиентский checkout внутри проекта. Для боевого запуска потребуется подключение настоящего эквайринга и серверной базы билетов.",
  ticketsClosedDisclaimer: "Продажа билетов сейчас временно закрыта. Вся актуальная информация о старте продажи билетов будет на сайте.",
  ticketsClosedCtaText: "Подписаться на Маори-Лукьяновка",
  ticketsClosedCtaUrl: "https://t.me/maori_lukyanovka",
  ticketOfferNote: "Покупая билет, вы принимаете условия публичной оферты.",
  ticketOfferLinkText: "Ознакомиться с офертой",
  ticketOfferLinkUrl: "/offer",
  legalEyebrow: "Оплата и документы",
  legalTitle: "Информация для гостей фестиваля",
  legalCard1Title: "Что входит в билет",
  legalCard1Text1: "Электронный билет дает право разового посещения фестиваля «Пельмень Варень» в выбранную дату. После оплаты покупатель получает электронный билет с уникальным номером и QR-кодом для прохода на площадку.",
  legalCard1Text2: "Актуальная стоимость билета указана в разделе «Билеты» на этой странице.",
  legalCard2Title: "Как оформить заказ",
  legalCard2Text1: "Покупатель заполняет форму заказа на сайте, указывает имя, e-mail, телефон и количество билетов, затем переходит на защищенную страницу оплаты ЮKassa.",
  legalCard2Text2: "После успешной оплаты электронные билеты формируются автоматически и становятся доступны для скачивания на сайте.",
  legalCard3Title: "Оплата и оказание услуги",
  legalCard3Text1: "Оплата принимается банковской картой через платежный сервис ЮKassa. Услуга считается оказанной после предоставления покупателю оплаченного электронного билета.",
  legalCard3Text2: "Срок предоставления услуги: сразу после подтверждения оплаты платежной системой.",
  legalCard4Title: "Отказ от покупки и возврат",
  legalCard4Text1: "Покупатель вправе отказаться от покупки до момента начала мероприятия. Для возврата необходимо направить обращение организатору по контактам, указанным ниже, с номером заказа, номером билета и данными покупателя.",
  legalCard4Text2: "Обращение рассматривается организатором в течение 3 рабочих дней. При подтверждении возврата денежные средства перечисляются тем же способом оплаты в срок до 10 рабочих дней, в зависимости от банка-эмитента.",
  legalCard4Text3: "Если услуга уже оказана полностью, возврат осуществляется по правилам законодательства РФ и условиям публичной оферты.",
  legalContactsTitle: "Контакты и реквизиты",
  legalContactsPhoneLabel: "Телефон:",
  legalContactsPhoneValue: "+7 (914) 792-58-26",
  legalContactsEmailLabel: "E-mail:",
  legalContactsEmailValue: "Katerina.gerashchenko@gmail.com",
  legalContactsSelfEmployedLabel: "Самозанятый:",
  legalContactsSelfEmployedValue: "ГЕРАЩЕНКО ЕКАТЕРИНА ГЕОРГИЕВНА",
  legalContactsInnLabel: "ИНН:",
  legalContactsInnValue: "253905392205",
  legalDocsTitle: "Документы",
  legalDocsOfferText: "Публичная оферта",
  legalDocsOfferUrl: "https://disk.yandex.ru/i/mhC9SWzujcxQEQ",
  legalDocsRulesText: "Правила поведения на фестивале",
  legalDocsRulesUrl: "https://disk.yandex.ru/i/JHPvBiIw1BtPHg",
  legalDocsPrivacyText: "Политика обработки персональных данных",
  legalDocsPrivacyUrl: "/privacy",
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
  team4Name: "Команда 4",
  team4Desc: "",
  team5Name: "Команда 5",
  team5Desc: "",
  team6Name: "Команда 6",
  team6Desc: "",
  team7Name: "Команда 7",
  team7Desc: "",
  team8Name: "Команда 8",
  team8Desc: "",
  team9Name: "Команда 9",
  team9Desc: "",
  team10Name: "Команда 10",
  team10Desc: "",
  team11Name: "Команда 11",
  team11Desc: "",
  team12Name: "Команда 12",
  team12Desc: "",
  team13Name: "Команда 13",
  team13Desc: "",
  team14Name: "Команда 14",
  team14Desc: "",
  team15Name: "Команда 15",
  team15Desc: "",
  team16Name: "Команда 16",
  team16Desc: "",
  team17Name: "Команда 17",
  team17Desc: "",
  team18Name: "Команда 18",
  team18Desc: "",
  team19Name: "Команда 19",
  team19Desc: "",
  team20Name: "Команда 20",
  team20Desc: "",
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
  showJury: "true",
  showPartners: "true",
  showTeams: "true",
  showTickets: "true",
  showVote: "true",
  showQuiz: "true",
  showContacts: "true",
  contactsEyebrow: "Контакты",
  contactsTitle: "Блок для связи с гостями, партнёрами и прессой.",
  contactOrgTitle: "Организаторы",
  contactOrgPhone: "+7 (914) 792-58-26",
  contactOrgEmail: "Katerina.gerashchenko@gmail.com",
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
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

let database = null;
let databaseReady = null;
const sessions = new Map();
let resolvedPdfFontPath = null;

function parseBody(req) {
  return (async () => {
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    if (!chunks.length) return {};
    const raw = Buffer.concat(chunks).toString("utf8");
    const contentType = String(req.headers["content-type"] || "").toLowerCase();
    if (contentType.includes("application/json")) {
      return JSON.parse(raw);
    }
    if (contentType.includes("application/x-www-form-urlencoded")) {
      return Object.fromEntries(new URLSearchParams(raw).entries());
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return Object.fromEntries(new URLSearchParams(raw).entries());
    }
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

function sendXlsx(res, filename, buffer) {
  res.writeHead(200, {
    "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": buffer.length,
  });
  res.end(buffer);
}

function sendPdf(res, filename, buffer) {
  res.writeHead(200, {
    "Content-Type": "application/pdf",
    "Content-Disposition": `attachment; filename="${filename}"`,
    "Content-Length": buffer.length,
  });
  res.end(buffer);
}

function sendError(res, status, message) {
  sendJson(res, status, { error: message });
}

function escapeCsv(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

function getPublicBaseUrl(req) {
  if (PUBLIC_BASE_URL) return PUBLIC_BASE_URL;
  const proto = String(req.headers["x-forwarded-proto"] || "http").split(",")[0].trim() || "http";
  const host = String(req.headers["x-forwarded-host"] || req.headers.host || "").split(",")[0].trim();
  return host ? `${proto}://${host}` : "";
}

function isYooKassaConfigured() {
  return Boolean(YOOKASSA_SHOP_ID && YOOKASSA_SECRET_KEY);
}

function formatPaymentAmount(value) {
  return Number(value).toFixed(2);
}

function getYooKassaReturnUrl(req, order) {
  const baseUrl = YOOKASSA_RETURN_URL || `${getPublicBaseUrl(req)}/`;
  const url = new URL(baseUrl);
  url.searchParams.set("order", order.id);
  return url.toString();
}

function getYooKassaWebhookUrl(req) {
  return YOOKASSA_WEBHOOK_URL || `${getPublicBaseUrl(req)}/api/payments/yookassa/webhook`;
}

function getYooKassaPaymentId(paymentReference) {
  return String(paymentReference || "").trim().replace(/^YooKassa\s*#\s*/i, "");
}

function formatStoredPaymentReference(paymentReference) {
  const raw = String(paymentReference || "").trim();
  if (!raw) return "";
  return raw.includes("#") ? raw : `YooKassa #${raw}`;
}

async function requestYooKassa(endpoint, options = {}) {
  const method = options.method || "GET";
  const headers = {
    Authorization: `Basic ${Buffer.from(`${YOOKASSA_SHOP_ID}:${YOOKASSA_SECRET_KEY}`, "utf8").toString("base64")}`,
    Accept: "application/json",
    ...options.headers,
  };
  let body;
  if (options.body !== undefined) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(options.body);
  }
  if (options.idempotenceKey) {
    headers["Idempotence-Key"] = String(options.idempotenceKey);
  }

  const response = await fetch(`${YOOKASSA_API_BASE}${endpoint}`, {
    method,
    headers,
    body,
  });
  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;
  if (!response.ok) {
    const message = payload?.description || payload?.error_description || payload?.type || `ЮKassa вернула ошибку ${response.status}.`;
    throw new Error(message);
  }
  return payload;
}

async function createYooKassaPayment(req, order) {
  return requestYooKassa("/payments", {
    method: "POST",
    idempotenceKey: order.id,
    body: {
      amount: {
        value: formatPaymentAmount(order.totalAmount),
        currency: "RUB",
      },
      capture: true,
      confirmation: {
        type: "redirect",
        return_url: getYooKassaReturnUrl(req, order),
      },
      description: `Билеты на фестиваль Пельмень Варень (${order.quantity})`,
      metadata: {
        orderId: order.id,
        invId: order.invId,
      },
    },
  });
}

async function getYooKassaPayment(paymentId) {
  return requestYooKassa(`/payments/${encodeURIComponent(paymentId)}`);
}

async function syncOrderWithYooKassaPayment(db, order) {
  if (!order || !isYooKassaConfigured()) {
    return { order, tickets: order?.status === "paid" ? getTicketsByOrderId(db, order.id) : [], payment: null };
  }

  const paymentId = getYooKassaPaymentId(order.paymentReference);
  if (!paymentId) {
    return { order, tickets: order.status === "paid" ? getTicketsByOrderId(db, order.id) : [], payment: null };
  }

  const payment = await getYooKassaPayment(paymentId);
  const paymentStatus = String(payment?.status || "").trim();
  const metadataOrderId = String(payment?.metadata?.orderId || "").trim();
  if (metadataOrderId && metadataOrderId !== order.id) {
    throw new Error("ЮKassa вернула платеж для другого заказа.");
  }

  if (paymentStatus === "succeeded" && order.status !== "paid") {
    const paidAt = payment?.captured_at || payment?.created_at || new Date().toISOString();
    runTransaction(db, () => {
      updateOrderPaymentStatus(db, order.id, {
        status: "paid",
        paymentReference: payment.id,
        paidAt,
      });
      issueTicketsForPaidOrder(db, {
        ...order,
        status: "paid",
        paymentReference: payment.id,
        paidAt,
      });
    });
  } else if (paymentStatus === "canceled" && order.status === "pending") {
    updateOrderPaymentStatus(db, order.id, {
      status: "canceled",
      paymentReference: payment.id,
      paidAt: null,
    });
  }

  const nextOrder = getOrderById(db, order.id);
  const tickets = nextOrder?.status === "paid" ? getTicketsByOrderId(db, order.id) : [];
  return { order: nextOrder, tickets, payment };
}

function excelColumnName(index) {
  let current = index + 1;
  let name = "";
  while (current > 0) {
    const remainder = (current - 1) % 26;
    name = String.fromCharCode(65 + remainder) + name;
    current = Math.floor((current - 1) / 26);
  }
  return name;
}

function buildXlsxCell(value, rowIndex, columnIndex) {
  const cellRef = `${excelColumnName(columnIndex)}${rowIndex + 1}`;
  if (typeof value === "number" && Number.isFinite(value)) {
    return `<c r="${cellRef}"><v>${value}</v></c>`;
  }
  return `<c r="${cellRef}" t="inlineStr"><is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`;
}

function buildXlsxSheetXml(rows) {
  const body = rows
    .map((row, rowIndex) => `<row r="${rowIndex + 1}">${row.map((value, columnIndex) => buildXlsxCell(value, rowIndex, columnIndex)).join("")}</row>`)
    .join("");
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    `<sheetData>${body}</sheetData>`,
    "</worksheet>",
  ].join("");
}

function buildXlsxWorkbookXml(sheetNames) {
  const sheets = sheetNames
    .map((name, index) => `<sheet name="${escapeXml(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`)
    .join("");
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">',
    `<sheets>${sheets}</sheets>`,
    "</workbook>",
  ].join("");
}

function buildXlsxWorkbookRelsXml(sheetCount) {
  const relationships = [];
  for (let index = 0; index < sheetCount; index += 1) {
    relationships.push(`<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`);
  }
  relationships.push(`<Relationship Id="rId${sheetCount + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>`);
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    relationships.join(""),
    "</Relationships>",
  ].join("");
}

function buildXlsxRootRelsXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">',
    '<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>',
    "</Relationships>",
  ].join("");
}

function buildXlsxContentTypesXml(sheetCount) {
  const overrides = [
    '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>',
    '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>',
  ];
  for (let index = 0; index < sheetCount; index += 1) {
    overrides.push(`<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`);
  }
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">',
    '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>',
    '<Default Extension="xml" ContentType="application/xml"/>',
    overrides.join(""),
    "</Types>",
  ].join("");
}

function buildXlsxStylesXml() {
  return [
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>',
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">',
    '<fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>',
    '<fills count="2"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill></fills>',
    '<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>',
    '<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>',
    '<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>',
    '<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>',
    "</styleSheet>",
  ].join("");
}

function makeCrcTable() {
  const table = new Uint32Array(256);
  for (let index = 0; index < 256; index += 1) {
    let crc = index;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 1) ? (0xedb88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[index] = crc >>> 0;
  }
  return table;
}

const CRC_TABLE = makeCrcTable();

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function zipStoreFiles(files) {
  const localParts = [];
  const centralParts = [];
  let offset = 0;

  files.forEach((file) => {
    const nameBuffer = Buffer.from(file.name, "utf8");
    const contentBuffer = Buffer.isBuffer(file.content) ? file.content : Buffer.from(file.content, "utf8");
    const crc = crc32(contentBuffer);

    const localHeader = Buffer.alloc(30);
    localHeader.writeUInt32LE(0x04034b50, 0);
    localHeader.writeUInt16LE(20, 4);
    localHeader.writeUInt16LE(0, 6);
    localHeader.writeUInt16LE(0, 8);
    localHeader.writeUInt16LE(0, 10);
    localHeader.writeUInt16LE(0, 12);
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(contentBuffer.length, 18);
    localHeader.writeUInt32LE(contentBuffer.length, 22);
    localHeader.writeUInt16LE(nameBuffer.length, 26);
    localHeader.writeUInt16LE(0, 28);
    localParts.push(localHeader, nameBuffer, contentBuffer);

    const centralHeader = Buffer.alloc(46);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(0, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(contentBuffer.length, 20);
    centralHeader.writeUInt32LE(contentBuffer.length, 24);
    centralHeader.writeUInt16LE(nameBuffer.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    centralParts.push(centralHeader, nameBuffer);

    offset += localHeader.length + nameBuffer.length + contentBuffer.length;
  });

  const centralDirectory = Buffer.concat(centralParts);
  const centralOffset = offset;
  const endRecord = Buffer.alloc(22);
  endRecord.writeUInt32LE(0x06054b50, 0);
  endRecord.writeUInt16LE(0, 4);
  endRecord.writeUInt16LE(0, 6);
  endRecord.writeUInt16LE(files.length, 8);
  endRecord.writeUInt16LE(files.length, 10);
  endRecord.writeUInt32LE(centralDirectory.length, 12);
  endRecord.writeUInt32LE(centralOffset, 16);
  endRecord.writeUInt16LE(0, 20);

  return Buffer.concat([...localParts, centralDirectory, endRecord]);
}

function buildXlsxWorkbook(sheets) {
  const files = [
    { name: "[Content_Types].xml", content: buildXlsxContentTypesXml(sheets.length) },
    { name: "_rels/.rels", content: buildXlsxRootRelsXml() },
    { name: "xl/workbook.xml", content: buildXlsxWorkbookXml(sheets.map((sheet) => sheet.name)) },
    { name: "xl/_rels/workbook.xml.rels", content: buildXlsxWorkbookRelsXml(sheets.length) },
    { name: "xl/styles.xml", content: buildXlsxStylesXml() },
  ];

  sheets.forEach((sheet, index) => {
    files.push({
      name: `xl/worksheets/sheet${index + 1}.xml`,
      content: buildXlsxSheetXml(sheet.rows),
    });
  });

  return zipStoreFiles(files);
}

function normalizeOrderRecord(order) {
  return {
    id: String(order.id || crypto.randomUUID()),
    invId: String(order.invId || `${Date.now()}${Math.floor(Math.random() * 1000)}`),
    name: String(order.name || "").trim(),
    email: String(order.email || "").trim(),
    phone: String(order.phone || "").trim(),
    quantity: Math.max(1, Number(order.quantity || 1)),
    totalAmount: Number(order.totalAmount || 0),
    status: String(order.status || "pending"),
    paymentReference: String(order.paymentReference || ""),
    createdAt: String(order.createdAt || new Date().toISOString()),
    updatedAt: String(order.updatedAt || order.createdAt || new Date().toISOString()),
    paidAt: order.paidAt ? String(order.paidAt) : null,
  };
}

function insertOrder(db, order, options = {}) {
  const normalized = normalizeOrderRecord(order);
  const mode = options.replace ? "INSERT OR REPLACE" : "INSERT";
  db.prepare(`${mode} INTO orders(
    id, inv_id, name, email, phone, quantity, total_amount, status, payment_reference, created_at, updated_at, paid_at
  ) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .run(
      normalized.id,
      normalized.invId,
      normalized.name,
      normalized.email,
      normalized.phone,
      normalized.quantity,
      normalized.totalAmount,
      normalized.status,
      normalized.paymentReference,
      normalized.createdAt,
      normalized.updatedAt,
      normalized.paidAt,
    );
}

function mapOrderRow(row) {
  return {
    id: row.id,
    invId: row.inv_id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    quantity: row.quantity,
    totalAmount: row.total_amount,
    status: row.status,
    paymentReference: row.payment_reference,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    paidAt: row.paid_at,
  };
}

function getOrderById(db, orderId) {
  const row = db.prepare("SELECT * FROM orders WHERE id = ?").get(orderId);
  return row ? mapOrderRow(row) : null;
}

function updateOrderPaymentStatus(db, orderId, payload) {
  const nextUpdatedAt = new Date().toISOString();
  db.prepare(`
    UPDATE orders
    SET status = ?, payment_reference = ?, updated_at = ?, paid_at = COALESCE(?, paid_at)
    WHERE id = ?
  `).run(
    String(payload.status || "paid"),
    String(payload.paymentReference || ""),
    nextUpdatedAt,
    payload.paidAt ? String(payload.paidAt) : null,
    orderId,
  );
  return getOrderById(db, orderId);
}

function issueTicketsForPaidOrder(db, order) {
  const existingTickets = getTicketsByOrderId(db, order.id);
  if (existingTickets.length) return existingTickets;

  const paidAt = order.paidAt || new Date().toISOString();
  const tickets = [];
  for (let index = 0; index < order.quantity; index += 1) {
    const ticket = {
      id: crypto.randomUUID(),
      orderId: order.id,
      code: createTicketCode(db),
      name: order.name,
      email: order.email,
      phone: order.phone,
      quantityInOrder: order.quantity,
      orderIndex: index + 1,
      price: TICKET_PRICE,
      orderTotal: order.totalAmount,
      paymentStatus: "paid",
      accessStatus: "new",
      voteTeam: null,
      paidAt,
      createdAt: order.createdAt,
      paymentReference: formatStoredPaymentReference(order.paymentReference) || `Заказ #${order.invId}`,
      usedAt: null,
      votedAt: null,
    };
    insertTicket(db, ticket);
    tickets.push(ticket);
  }
  return tickets;
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
  if (!["admin", "checkin", "jury"].includes(normalizedRole)) {
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
  for (let index = 1; index <= 5; index += 1) {
    createUser(db, "jury", `jury${index}`, JURY_DEFAULT_PASSWORD);
  }
}

function ensureDefaultJuryUsers(db) {
  const total = db.prepare("SELECT COUNT(*) AS total FROM users WHERE role = 'jury'").get().total;
  if (total > 0) return;
  for (let index = 1; index <= 5; index += 1) {
    createUser(db, "jury", `jury${index}`, JURY_DEFAULT_PASSWORD);
  }
}

function ensureTeamApplicationsSchema(db) {
  const columns = db.prepare("PRAGMA table_info(team_applications)").all();
  const hasStatus = columns.some((column) => column.name === "status");
  const hasTeamName = columns.some((column) => column.name === "team_name");
  const hasOrganization = columns.some((column) => column.name === "organization");
  if (!hasStatus) {
    db.exec("ALTER TABLE team_applications ADD COLUMN status TEXT NOT NULL DEFAULT 'main'");
  }
  if (!hasTeamName) {
    db.exec("ALTER TABLE team_applications ADD COLUMN team_name TEXT NOT NULL DEFAULT ''");
  }
  if (!hasOrganization) {
    db.exec("ALTER TABLE team_applications ADD COLUMN organization TEXT NOT NULL DEFAULT ''");
  }
  db.exec("CREATE INDEX IF NOT EXISTS idx_team_applications_status ON team_applications(status)");
}

function ensureOrdersSchema(db) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      inv_id TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total_amount INTEGER NOT NULL,
      status TEXT NOT NULL,
      payment_reference TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      paid_at TEXT
    )
  `);
  db.exec("CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status)");
  db.exec("CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC)");
}

function normalizeListValue(value) {
  return String(value || "")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getVotingTeamsFromContent(content) {
  const teams = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = String(content[`team${index}Name`] || "").trim();
    teams.push(name || `Команда ${index}`);
  }
  return teams;
}

function getJuryConfig(content) {
  const teams = getVotingTeamsFromContent(content);
  const criteria = normalizeListValue(content.juryScoringCriteria).length
    ? normalizeListValue(content.juryScoringCriteria)
    : normalizeListValue(DEFAULT_CONTENT.juryScoringCriteria);
  return { teams, criteria };
}

function seedContentDefaults(db) {
  const statement = db.prepare("INSERT INTO content(key, value) VALUES(?, ?) ON CONFLICT(key) DO NOTHING");
  const upsert = db.prepare("INSERT INTO content(key, value) VALUES(?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value");
  runTransaction(db, () => {
    Object.entries(DEFAULT_CONTENT).forEach(([key, value]) => {
      statement.run(key, String(value ?? ""));
    });
    upsert.run("mapLat", STATIC_MAP.lat);
    upsert.run("mapLon", STATIC_MAP.lon);
    upsert.run("mapZoom", STATIC_MAP.zoom);
  });
}

function saveContent(db, content) {
  const merged = { ...DEFAULT_CONTENT, ...(content || {}) };
  merged.mapLat = STATIC_MAP.lat;
  merged.mapLon = STATIC_MAP.lon;
  merged.mapZoom = STATIC_MAP.zoom;
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

function getTicketsByOrderId(db, orderId) {
  return db.prepare("SELECT * FROM tickets WHERE order_id = ? ORDER BY order_index ASC").all(orderId).map(mapTicketRow);
}

function getQuizEntries(db) {
  return db.prepare("SELECT id, type, created_at FROM quiz_entries ORDER BY created_at DESC").all().map((row) => ({
    id: row.id,
    type: row.type,
    createdAt: row.created_at,
  }));
}

function getTeamApplications(db) {
  return db.prepare("SELECT * FROM team_applications ORDER BY created_at DESC").all().map((row) => {
    let nominations = [];
    try {
      nominations = JSON.parse(row.nominations || "[]");
    } catch (error) {
      nominations = [];
    }
    return {
      id: row.id,
      leaderName: row.leader_name,
      teamName: row.team_name || "",
      organization: row.organization || "",
      phone: row.phone,
      participants: row.participants,
      nominations: Array.isArray(nominations) ? nominations : [],
      dishDescription: row.dish_description,
      concept: row.concept,
      equipmentMode: row.equipment_mode,
      wishes: row.wishes || "",
      status: row.status === "reserve" ? "reserve" : "main",
      createdAt: row.created_at,
    };
  });
}

function getJuryScores(db) {
  return db.prepare(`
    SELECT id, juror_user_id, juror_username, team_name, criterion_name, score, created_at, updated_at
    FROM jury_scores
    ORDER BY team_name, criterion_name, juror_username
  `).all().map((row) => ({
    id: row.id,
    jurorUserId: row.juror_user_id,
    jurorUsername: row.juror_username,
    teamName: row.team_name,
    criterionName: row.criterion_name,
    score: Number(row.score || 0),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }));
}

function getState(db) {
  return {
    content: getContent(db),
    tickets: getTickets(db),
    quizEntries: getQuizEntries(db),
    teamApplications: getTeamApplications(db),
    juryScores: getJuryScores(db),
  };
}

function getTeamNames(state) {
  return getVotingTeamsFromContent(state.content);
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

  const juryConfig = getJuryConfig(state.content);
  const juryTeamTotals = juryConfig.teams.map((team) => {
    const byCriterion = juryConfig.criteria.map((criterion) => {
      const total = state.juryScores
        .filter((entry) => entry.teamName === team && entry.criterionName === criterion)
        .reduce((sum, entry) => sum + Number(entry.score || 0), 0);
      return { criterion, total };
    });
    const total = byCriterion.reduce((sum, item) => sum + item.total, 0);
    return { team, total, byCriterion };
  });
  const juryCriterionTotals = juryConfig.criteria.map((criterion) => ({
    criterion,
    total: state.juryScores
      .filter((entry) => entry.criterionName === criterion)
      .reduce((sum, entry) => sum + Number(entry.score || 0), 0),
  }));
  const juryJudgesTotal = new Set(state.juryScores.map((entry) => entry.jurorUserId)).size;

  return {
    ticketsSold: sold,
    ticketsScanned: scanned,
    ticketsRevenue: revenue,
    votesCast,
    quizTotal: state.quizEntries.length,
    teamsTotal: state.teamApplications.filter((entry) => entry.status !== "reserve").length,
    teamsReserveTotal: state.teamApplications.filter((entry) => entry.status === "reserve").length,
    juryScoresTotal: state.juryScores.length,
    juryJudgesTotal,
    juryTeamTotals,
    juryCriterionTotals,
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

function buildTeamsExportCsv(state, mode = "all") {
  const filtered = state.teamApplications.filter((entry) => {
    if (mode === "reserve") return entry.status === "reserve";
    if (mode === "main") return entry.status !== "reserve";
    return true;
  });
  const rows = [
    [
      "Время заявки",
      "ID заявки",
      "Статус",
      "ФИО руководителя",
      "Название команды",
      "Организация",
      "Телефон",
      "Участники",
      "Номинации",
      "Описание блюда",
      "Концепция",
      "Оборудование",
      "Пожелания",
    ],
    ...filtered.map((entry) => [
      entry.createdAt,
      entry.id,
      entry.status === "reserve" ? "Резерв" : "Основной список",
      entry.leaderName,
      entry.teamName,
      entry.organization,
      entry.phone,
      entry.participants,
      entry.nominations.join(", "),
      entry.dishDescription,
      entry.concept,
      entry.equipmentMode === "need_all" ? "Да, всё необходимо" : "Будем работать со своим",
      entry.wishes,
    ]),
  ];
  return rows.map((row) => row.map(escapeCsv).join(";")).join("\n");
}

function buildJuryScoresExportCsv(state) {
  const rows = [
    ["Время", "Судья", "Команда", "Критерий", "Балл"],
    ...state.juryScores
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .map((entry) => [
        entry.updatedAt || entry.createdAt || "",
        entry.jurorUsername,
        entry.teamName,
        entry.criterionName,
        entry.score,
      ]),
  ];
  return rows.map((row) => row.map(escapeCsv).join(";")).join("\n");
}

function buildJuryScoresExportExcel(state) {
  const detailedEntries = state.juryScores
    .slice()
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));

  const teamNames = Array.from(new Set(detailedEntries.map((entry) => entry.teamName))).sort((a, b) => a.localeCompare(b, "ru"));
  const jurorNames = Array.from(new Set(detailedEntries.map((entry) => entry.jurorUsername))).sort((a, b) => a.localeCompare(b, "ru"));
  const detailRows = [
    ["Время", "Судья", "Команда", "Критерий", "Балл"],
    ...detailedEntries.map((entry) => [
      entry.updatedAt || entry.createdAt || "",
      entry.jurorUsername,
      entry.teamName,
      entry.criterionName,
      Number(entry.score || 0),
    ]),
  ];
  const summaryRows = [
    ["Строка", "Баллы"],
  ];

  teamNames.forEach((teamName) => {
    const teamEntries = detailedEntries.filter((entry) => entry.teamName === teamName);
    const total = teamEntries.reduce((sum, entry) => sum + Number(entry.score || 0), 0);
    summaryRows.push([teamName, total]);

    jurorNames.forEach((jurorName) => {
      const jurorTotal = teamEntries
        .filter((entry) => entry.jurorUsername === jurorName)
        .reduce((sum, entry) => sum + Number(entry.score || 0), 0);
      summaryRows.push([`${teamName} (${jurorName})`, jurorTotal]);
    });
  });

  return buildXlsxWorkbook([
    { name: "Scores", rows: detailRows },
    { name: "Summary", rows: summaryRows },
  ]);
}

function buildTicketQrPayload(ticket) {
  return `KOSTROVIE:${ticket.code}`;
}

function resolvePdfFontPath() {
  if (resolvedPdfFontPath !== null) return resolvedPdfFontPath || null;

  const candidates = [
    process.env.PDF_FONT_PATH,
    "/usr/share/fonts/TTF/DejaVuSans.ttf",
    "/usr/share/fonts/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    "/usr/share/fonts/truetype/noto/NotoSans-Regular.ttf",
    "C:\\Windows\\Fonts\\arial.ttf",
    "C:\\Windows\\Fonts\\segoeui.ttf",
  ].filter(Boolean);

  resolvedPdfFontPath = candidates.find((fontPath) => fsNative.existsSync(fontPath)) || "";
  if (!resolvedPdfFontPath) {
    console.warn("PDF font with Cyrillic support not found. Set PDF_FONT_PATH for readable Russian text in tickets.");
  }
  return resolvedPdfFontPath || null;
}
function renderTicketPage(doc, ticket, content, qrBuffer, fontPath) {
  const title = content.seoTitle || "Костровье";
  const location = content.placeMain || "Этнопарк «Берег Сварога», Владивосток";
  const dateText = content.dateMain || "Суббота, 18 июля 2026 года";
  if (fontPath) doc.font(fontPath);
  const leftX = 76;
  const qrX = 340;
  const qrY = 210;
  const qrSize = 170;
  const columnGap = 24;
  const textWidth = qrX - leftX - columnGap;
  const pageWidth = 595;
  const pageHeight = 842;

  doc.save();
  doc.rect(0, 0, pageWidth, pageHeight).fill("#F2EADF");
  doc.fillOpacity(0.18).circle(70, 60, 140).fill("#B98A3B");
  doc.fillOpacity(0.12).circle(520, 110, 120).fill("#8E2F1F");
  doc.fillOpacity(0.08).circle(545, 790, 160).fill("#B98A3B");
  doc.restore();

  doc.roundedRect(42, 42, 511, 758, 20).fillColor("#F7EFE5").fill();
  doc.roundedRect(42, 42, 511, 758, 20).lineWidth(1).strokeColor("#C8B8A8").stroke();
  doc.roundedRect(56, 56, 483, 730, 16).fillColor("#FBF4EA").fill();
  doc.roundedRect(56, 56, 483, 730, 16).lineWidth(1).strokeColor("#E2D6CB").stroke();

  doc.fillColor("#7F2E1F").fontSize(11).text("ФЕСТИВАЛЬНЫЙ БИЛЕТ", leftX, 86);
  doc.fillColor("#21150E").fontSize(24);
  const titleY = 108;
  const titleHeight = doc.heightOfString(title, { width: textWidth });
  doc.text(title, leftX, titleY, { width: textWidth });

  const metaY = titleY + titleHeight + 14;
  doc.fillColor("#51423A").fontSize(12).text(`Дата: ${dateText}`, leftX, metaY, { width: textWidth });
  doc.text(`Место: ${location}`, leftX, metaY + 20, { width: textWidth });

  const ownerLabelY = metaY + 64;
  doc.fillColor("#21150E").fontSize(13).text("Владелец билета", leftX, ownerLabelY);
  doc.fontSize(20).text(ticket.name || "Гость", leftX, ownerLabelY + 20, { width: textWidth });

  const ticketLabelY = ownerLabelY + 72;
  doc.fillColor("#7F2E1F").fontSize(12).text("Номер билета", leftX, ticketLabelY);
  doc.fillColor("#21150E").fontSize(22).text(ticket.code, leftX, ticketLabelY + 18);
  doc.fillColor("#51423A").fontSize(12).text(`Заказ: ${ticket.orderId.slice(0, 8).toUpperCase()}`, leftX, ticketLabelY + 52);
  doc.text(`Билет: ${ticket.orderIndex}/${ticket.quantityInOrder}`, leftX, ticketLabelY + 70);
  doc.text(`Стоимость: ${ticket.price} ₽`, leftX, ticketLabelY + 88);
  doc.text(`Оплачен: ${new Date(ticket.paidAt || ticket.createdAt).toLocaleString("ru-RU")}`, leftX, ticketLabelY + 106);

  doc.image(qrBuffer, qrX, qrY, { fit: [qrSize, qrSize], align: "center", valign: "center" });
  doc.fillColor("#51423A").fontSize(11).text("Покажите этот QR-код на входе.", qrX - 8, qrY + qrSize + 10, { width: qrSize + 16, align: "center" });
  doc.fillColor("#51423A").fontSize(10).text(buildTicketQrPayload(ticket), qrX - 8, qrY + qrSize + 32, { width: qrSize + 16, align: "center" });

  doc.fillColor("#7F2E1F").fontSize(12).text("Правила прохода", 76, 500);
  doc.fillColor("#51423A").fontSize(11).text("1. Один QR-код = один проход на территорию.", 76, 522);
  doc.text("2. На территории есть бесплатная парковка на 70 мест.", 76, 540);
  doc.text("3. Передача билета третьим лицам после прохода невозможна.", 76, 558);
  doc.text("4. Сохраните PDF или скрин QR-кода до посещения.", 76, 576);

  doc.fillColor("#8D7A6D").fontSize(10).text("Сформировано автоматически. Подлинность подтверждается в модуле check-in.", 76, 742, { width: 440 });
}

async function buildTicketsPdfBuffer(tickets, content) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 42 });
    const fontPath = resolvePdfFontPath();
    const chunks = [];
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    (async () => {
      try {
        for (let index = 0; index < tickets.length; index += 1) {
          if (index > 0) doc.addPage();
          const ticket = tickets[index];
          const qrBuffer = await QRCode.toBuffer(buildTicketQrPayload(ticket), { type: "png", width: 340, margin: 1 });
          renderTicketPage(doc, ticket, content, qrBuffer, fontPath);
        }
        doc.end();
      } catch (error) {
        reject(error);
      }
    })();
  });
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

      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        inv_id TEXT NOT NULL UNIQUE,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT NOT NULL,
        quantity INTEGER NOT NULL,
        total_amount INTEGER NOT NULL,
        status TEXT NOT NULL,
        payment_reference TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        paid_at TEXT
      );

      CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
      CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

      CREATE TABLE IF NOT EXISTS quiz_entries (
        id TEXT PRIMARY KEY,
        type TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_quiz_entries_created_at ON quiz_entries(created_at DESC);

      CREATE TABLE IF NOT EXISTS team_applications (
        id TEXT PRIMARY KEY,
        leader_name TEXT NOT NULL,
        team_name TEXT NOT NULL,
        organization TEXT NOT NULL,
        phone TEXT NOT NULL,
        participants TEXT NOT NULL,
        nominations TEXT NOT NULL,
        dish_description TEXT NOT NULL,
        concept TEXT NOT NULL,
        equipment_mode TEXT NOT NULL,
        wishes TEXT,
        status TEXT NOT NULL DEFAULT 'main',
        created_at TEXT NOT NULL
      );

      CREATE INDEX IF NOT EXISTS idx_team_applications_created_at ON team_applications(created_at DESC);

      CREATE TABLE IF NOT EXISTS jury_scores (
        id TEXT PRIMARY KEY,
        juror_user_id TEXT NOT NULL,
        juror_username TEXT NOT NULL,
        team_name TEXT NOT NULL,
        criterion_name TEXT NOT NULL,
        score INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS idx_jury_scores_unique
        ON jury_scores(juror_user_id, team_name, criterion_name);
      CREATE INDEX IF NOT EXISTS idx_jury_scores_team ON jury_scores(team_name);
      CREATE INDEX IF NOT EXISTS idx_jury_scores_criterion ON jury_scores(criterion_name);
    `);

    ensureOrdersSchema(db);
    ensureTeamApplicationsSchema(db);
    await migrateLegacyJsonIfNeeded(db);
    seedContentDefaults(db);
    seedDefaultUsers(db);
    ensureDefaultJuryUsers(db);
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

    if (!["admin", "checkin", "jury"].includes(role)) return sendError(res, 400, "Неизвестная зона доступа.");
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
    if (!session || !["admin", "checkin", "jury"].includes(session.role)) {
      return sendError(res, 401, "Требуется авторизация.");
    }
    return sendJson(res, 200, { tickets: getTickets(db) });
  }

  if (req.method === "GET" && pathname === "/api/jury/config") {
    if (!requireRole(req, res, "jury")) return;
    const session = getSession(req);
    const content = getContent(db);
    const config = getJuryConfig(content);
    const myScores = db.prepare(`
      SELECT team_name, criterion_name, score
      FROM jury_scores
      WHERE juror_user_id = ?
    `).all(session.userId).map((row) => ({
      teamName: row.team_name,
      criterionName: row.criterion_name,
      score: Number(row.score || 0),
    }));
    return sendJson(res, 200, { teams: config.teams, criteria: config.criteria, myScores });
  }

  if (req.method === "POST" && pathname === "/api/jury/scores") {
    if (!requireRole(req, res, "jury")) return;
    const session = getSession(req);
    const body = await parseBody(req);
    const scores = Array.isArray(body.scores) ? body.scores : [];
    const content = getContent(db);
    const config = getJuryConfig(content);
    const teamSet = new Set(config.teams);
    const criterionSet = new Set(config.criteria);
    const uniqueKeySet = new Set();

    if (!config.teams.length || !config.criteria.length) {
      return sendError(res, 400, "Администратор ещё не настроил команды или критерии.");
    }
    if (!scores.length) {
      return sendError(res, 400, "Передайте оценки.");
    }

    for (const item of scores) {
      const teamName = String(item.teamName || "").trim();
      const criterionName = String(item.criterionName || "").trim();
      const score = Number(item.score);
      if (!teamSet.has(teamName)) return sendError(res, 400, "Некорректная команда в оценках.");
      if (!criterionSet.has(criterionName)) return sendError(res, 400, "Некорректный критерий в оценках.");
      if (!Number.isInteger(score) || score < 1 || score > 10) return sendError(res, 400, "Оценка должна быть целым числом от 1 до 10.");
      const uniqueKey = `${teamName}::${criterionName}`;
      if (uniqueKeySet.has(uniqueKey)) return sendError(res, 400, "Обнаружены дубли по команде и критерию.");
      uniqueKeySet.add(uniqueKey);
    }

    const now = new Date().toISOString();
    runTransaction(db, () => {
      db.prepare("DELETE FROM jury_scores WHERE juror_user_id = ?").run(session.userId);
      const insert = db.prepare(`
        INSERT INTO jury_scores(
          id, juror_user_id, juror_username, team_name, criterion_name, score, created_at, updated_at
        ) VALUES(?, ?, ?, ?, ?, ?, ?, ?)
      `);
      scores.forEach((item) => {
        insert.run(
          crypto.randomUUID(),
          session.userId,
          session.username,
          String(item.teamName).trim(),
          String(item.criterionName).trim(),
          Number(item.score),
          now,
          now,
        );
      });
    });

    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/orders") {
    const body = await parseBody(req);
    const quantity = Number(body.quantity);

    if (!body.name || !body.email || !body.phone || !quantity || quantity < 1 || quantity > 4) {
      return sendError(res, 400, "Некорректные данные заказа.");
    }
    if (!isYooKassaConfigured()) {
      return sendError(res, 503, "ЮKassa еще не настроена. Добавьте shopId и secret key в переменные окружения.");
    }

    const createdAt = new Date().toISOString();
    const order = normalizeOrderRecord({
      id: crypto.randomUUID(),
      invId: `${Date.now()}${Math.floor(Math.random() * 1000)}`.slice(0, 18),
      name: String(body.name).trim(),
      email: String(body.email).trim(),
      phone: String(body.phone).trim(),
      quantity,
      totalAmount: quantity * TICKET_PRICE,
      status: "pending",
      paymentReference: "",
      createdAt,
      updatedAt: createdAt,
      paidAt: null,
    });

    insertOrder(db, order);
    try {
      const payment = await createYooKassaPayment(req, order);
      const paymentUrl = String(payment?.confirmation?.confirmation_url || "").trim();
      const paymentId = String(payment?.id || "").trim();
      if (!paymentUrl || !paymentId) {
        throw new Error("ЮKassa не вернула ссылку на оплату.");
      }
      updateOrderPaymentStatus(db, order.id, {
        status: "pending",
        paymentReference: paymentId,
        paidAt: null,
      });
      return sendJson(res, 201, {
        orderId: order.id,
        paymentId,
        paymentUrl,
        webhookUrl: getYooKassaWebhookUrl(req),
      });
    } catch (error) {
      return sendError(res, 502, error.message || "Не удалось создать платеж в ЮKassa.");
    }
  }

  if (req.method === "GET" && /^\/api\/orders\/[^/]+$/.test(pathname) && !pathname.endsWith("/pdf")) {
    const orderId = decodeURIComponent(pathname.split("/")[3] || "").trim();
    let order = getOrderById(db, orderId);
    if (!order) return sendError(res, 404, "Заказ не найден.");
    let tickets = order.status === "paid" ? getTicketsByOrderId(db, order.id) : [];
    if (order.status === "pending" && order.paymentReference && isYooKassaConfigured()) {
      try {
        const synced = await syncOrderWithYooKassaPayment(db, order);
        order = synced.order || order;
        tickets = synced.tickets;
      } catch (error) {
        // keep local status if provider is temporarily unavailable
      }
    }
    return sendJson(res, 200, { order, tickets });
  }

  if (req.method === "POST" && pathname === "/api/payments/yookassa/webhook") {
    const notification = await parseBody(req);
    const event = String(notification?.event || "").trim();
    const paymentId = String(notification?.object?.id || "").trim();

    if (!paymentId || !["payment.succeeded", "payment.canceled", "payment.waiting_for_capture"].includes(event)) {
      return sendJson(res, 200, { ok: true });
    }

    try {
      const payment = await getYooKassaPayment(paymentId);
      const orderId = String(payment?.metadata?.orderId || "").trim();
      if (!orderId) return sendJson(res, 200, { ok: true });
      const order = getOrderById(db, orderId);
      if (!order) return sendJson(res, 200, { ok: true });
      await syncOrderWithYooKassaPayment(db, order);
      return sendJson(res, 200, { ok: true });
    } catch (error) {
      return sendError(res, 400, error.message || "Не удалось обработать webhook ЮKassa.");
    }
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

  if (req.method === "POST" && pathname === "/api/team-applications") {
    const body = await parseBody(req);
    const leaderName = String(body.leaderName || "").trim();
    const teamName = String(body.teamName || "").trim();
    const organization = String(body.organization || "").trim();
    const phone = String(body.phone || "").trim();
    const participants = String(body.participants || "").trim();
    const nominations = Array.isArray(body.nominations)
      ? body.nominations.map((item) => String(item || "").trim()).filter(Boolean)
      : [];
    const dishDescription = String(body.dishDescription || "").trim();
    const concept = String(body.concept || "").trim();
    const equipmentMode = String(body.equipmentMode || "").trim();
    const wishes = String(body.wishes || "").trim();

    if (!leaderName || !teamName || !organization || !phone || !participants || !nominations.length || !dishDescription || !concept || !equipmentMode) {
      return sendError(res, 400, "Заполните обязательные поля заявки.");
    }
    if (!["need_all", "own"].includes(equipmentMode)) {
      return sendError(res, 400, "Некорректный вариант по оборудованию.");
    }

    const mainTeamsTotal = db.prepare("SELECT COUNT(*) AS total FROM team_applications WHERE status != 'reserve' OR status IS NULL").get().total;
    const status = mainTeamsTotal >= TEAM_MAIN_LIMIT ? "reserve" : "main";
    const reservePosition = status === "reserve"
      ? db.prepare("SELECT COUNT(*) AS total FROM team_applications WHERE status = 'reserve'").get().total + 1
      : 0;

    const createdAt = new Date().toISOString();
    const id = crypto.randomUUID();
    db.prepare(`
      INSERT INTO team_applications(
        id, leader_name, team_name, organization, phone, participants, nominations, dish_description, concept, equipment_mode, wishes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      id,
      leaderName,
      teamName,
      organization,
      phone,
      participants,
      JSON.stringify(nominations),
      dishDescription,
      concept,
      equipmentMode,
      wishes,
      status,
      createdAt,
    );
    return sendJson(res, 201, { ok: true, id, createdAt, status, reservePosition });
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

  if (req.method === "POST" && pathname === "/api/reset/teams") {
    if (!requireRole(req, res, "admin")) return;
    db.exec("DELETE FROM team_applications");
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "POST" && pathname === "/api/reset/jury-scores") {
    if (!requireRole(req, res, "admin")) return;
    db.exec("DELETE FROM jury_scores");
    return sendJson(res, 200, { ok: true });
  }

  if (req.method === "GET" && /^\/api\/tickets\/[^/]+\/pdf$/.test(pathname)) {
    const code = decodeURIComponent(pathname.split("/")[3] || "").trim();
    const ticket = getTicketByCode(db, code);
    if (!ticket) return sendError(res, 404, "Билет не найден.");
    const pdf = await buildTicketsPdfBuffer([ticket], getContent(db));
    return sendPdf(res, `ticket-${ticket.code}.pdf`, pdf);
  }

  if (req.method === "GET" && /^\/api\/orders\/[^/]+\/pdf$/.test(pathname)) {
    const orderId = decodeURIComponent(pathname.split("/")[3] || "").trim();
    const tickets = getTicketsByOrderId(db, orderId);
    if (!tickets.length) return sendError(res, 404, "Заказ не найден.");
    const pdf = await buildTicketsPdfBuffer(tickets, getContent(db));
    return sendPdf(res, `order-${orderId.slice(0, 8)}-tickets.pdf`, pdf);
  }

  if (req.method === "GET" && pathname === "/api/export/quiz.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "quiz-results.csv", buildQuizExportCsv(getState(db)));
  }

  if (req.method === "GET" && pathname === "/api/export/tickets.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "tickets-report.csv", buildTicketsExportCsv(getState(db)));
  }

  if (req.method === "GET" && pathname === "/api/export/teams.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "teams-applications.csv", buildTeamsExportCsv(getState(db)));
  }

  if (req.method === "GET" && pathname === "/api/export/teams-reserve.csv") {
    if (!requireRole(req, res, "admin")) return;
    return sendCsv(res, "teams-reserve.csv", buildTeamsExportCsv(getState(db), "reserve"));
  }

  if (req.method === "GET" && pathname === "/api/export/jury-scores.xlsx") {
    if (!requireRole(req, res, "admin")) return;
    return sendXlsx(res, "jury-scores.xlsx", buildJuryScoresExportExcel(getState(db)));
  }

  return sendError(res, 404, "Маршрут не найден.");
}

async function serveStatic(res, pathname) {
  const routeMap = {
    "/": "index.html",
    "/admin": "admin.html",
    "/checkin": "checkin.html",
    "/jury": "jury.html",
    "/offer": "offer.html",
    "/privacy": "privacy.html",
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
