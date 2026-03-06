const TICKET_PRICE = 600;
const QR_ENDPOINT = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=";
const PELMEN_SESSION_KEY = "pelmen_game_seen_v1";
const PELMEN_STAGE_TOTAL = 7;
const TEAMS = ["Команда Северный пар", "Команда Жар-печь", "Команда Морской дым"];
const pelmenFrameCache = new Map();
const QUIZ_RESULTS = {
  pelmeni: {
    title: "Ты пельмень сибирский",
    text: "Надёжный, плотный и без лишнего шума. На тебе держится компания, и именно ты первым находишь лучшее место у костра.",
  },
  khinkali: {
    title: "Ты хинкали",
    text: "Масштабный, громкий и харизматичный. Тебя невозможно не заметить, а любая сцена рядом с тобой становится главной.",
  },
  momo: {
    title: "Ты момо",
    text: "Лёгкий, любознательный и открытый новому. Ты любишь необычные сочетания, быстро находишь скрытые жемчужины и умеешь увлекать за собой.",
  },
  varenik: {
    title: "Ты вареник",
    text: "Мягкий, домашний и тёплый. Ты создаёшь атмосферу, в которой хочется задержаться надолго.",
  },
  gyoza: {
    title: "Ты гёдза",
    text: "Быстрый, острый и современный. Тебе нужен ритм, контраст и немного фестивального авантюризма.",
  },
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
  aboutCard4Title: "Семейный формат",
  aboutCard4Text: "Пространство для детей и родителей, мастер-классы, игровые станции и безопасный дневной ритм.",
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
  parkingNote: "Бесплатная парковка на 70 мест. Если хотите припарковаться у входа, приезжайте заранее.",
  mapLat: "43.1155",
  mapLon: "131.8855",
  mapZoom: "12",
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
  teamsEyebrow: "Командам",
  teamsTitle: "Подайте заявку на участие в конкурсе фестиваля.",
  teamsLead: "Заполните форму: заявка уходит организаторам и фиксируется в системе.",
  teamsApplyButton: "Подать заявку",
  teamsFormTitle: "Заявка команды",
  teamsLeaderLabel: "ФИО руководителя команды",
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
  teamsRegulationText: "Положение конкурса",
  teamsRegulationUrl: "/docs/regulation.pdf",
  teamsSuccessMessage: "Заявка отправлена. Организаторы свяжутся с вами.",
  ticketsEyebrow: "Билеты",
  ticketsTitle: "Оплата, персональные QR-коды и готовность к контролю на входе.",
  ticketPriceLabel: "Стандарт",
  ticketPriceValue: "600 ₽",
  ticketPriceText: "Доступ на все площадки фестиваля, концерт и вечерний огненный круг.",
  ticketFeature1: "Каждый билет получает собственный код и QR",
  ticketFeature2: "После оплаты билет сразу доступен на странице",
  ticketFeature3: "После сканирования билет можно использовать для голосования",
  ticketNote: "Оплата реализована как клиентский checkout внутри проекта. Для боевого запуска потребуется подключение настоящего эквайринга и серверной базы билетов.",
  ticketOfferNote: "Покупая билет, вы принимаете условия публичной оферты.",
  ticketOfferLinkText: "Ознакомиться с офертой",
  ticketOfferLinkUrl: "/offer",
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
  showJury: "true",
  showTeams: "true",
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
const CONTENT_BINDINGS = {
  heroEyebrow: { id: "content-hero-eyebrow", html: false },
  heroTitle: { id: "content-hero-title", html: false },
  heroLead: { id: "content-hero-lead", html: false },
  heroSideLabel: { id: "content-hero-side-label", html: false },
  heroSideDate: { id: "content-hero-side-date", html: false },
  heroSideSchedule: { id: "content-hero-side-schedule", html: true },
  heroSideNote: { id: "content-hero-side-note", html: false },
  countdownEyebrow: { id: "content-countdown-eyebrow", html: false },
  countdownNote: { id: "content-countdown-note", html: false },
  aboutEyebrow: { id: "content-about-eyebrow", html: false },
  aboutTitle: { id: "content-about-title", html: false },
  aboutCard1Title: { id: "content-about-card1-title", html: false },
  aboutCard1Text: { id: "content-about-card1-text", html: false },
  aboutCard2Title: { id: "content-about-card2-title", html: false },
  aboutCard2Text: { id: "content-about-card2-text", html: false },
  aboutCard3Title: { id: "content-about-card3-title", html: false },
  aboutCard3Text: { id: "content-about-card3-text", html: false },
  aboutCard4Title: { id: "content-about-card4-title", html: false },
  aboutCard4Text: { id: "content-about-card4-text", html: false },
  locationEyebrow: { id: "content-location-eyebrow", html: false },
  locationTitle: { id: "content-location-title", html: false },
  dateLabel: { id: "content-date-label", html: false },
  dateMain: { id: "content-date-main", html: false },
  dateNote: { id: "content-date-note", html: false },
  placeLabel: { id: "content-place-label", html: false },
  placeMain: { id: "content-place-main", html: false },
  placeNote: { id: "content-place-note", html: false },
  routeLabel: { id: "content-route-label", html: false },
  routeMain: { id: "content-route-main", html: false },
  routeNote: { id: "content-route-note", html: false },
  parkingNote: { id: "content-parking-note", html: false },
  locationCta: { id: "content-location-cta", html: false },
  programEyebrow: { id: "content-program-eyebrow", html: false },
  programItem1Time: { id: "content-program-item1-time", html: false },
  programItem1Title: { id: "content-program-item1-title", html: false },
  programItem2Time: { id: "content-program-item2-time", html: false },
  programItem2Title: { id: "content-program-item2-title", html: false },
  programItem3Time: { id: "content-program-item3-time", html: false },
  programItem3Title: { id: "content-program-item3-title", html: false },
  programItem4Time: { id: "content-program-item4-time", html: false },
  programItem4Title: { id: "content-program-item4-title", html: false },
  programItem5Time: { id: "content-program-item5-time", html: false },
  programItem5Title: { id: "content-program-item5-title", html: false },
  programItem6Time: { id: "content-program-item6-time", html: false },
  programItem6Title: { id: "content-program-item6-title", html: false },
  programItem7Time: { id: "content-program-item7-time", html: false },
  programItem7Title: { id: "content-program-item7-title", html: false },
  programItem8Time: { id: "content-program-item8-time", html: false },
  programItem8Title: { id: "content-program-item8-title", html: false },
  programItem9Time: { id: "content-program-item9-time", html: false },
  programItem9Title: { id: "content-program-item9-title", html: false },
  galleryEyebrow: { id: "content-gallery-eyebrow", html: false },
  galleryTitle: { id: "content-gallery-title", html: false },
  galleryMoreNote: { id: "content-gallery-more-note", html: false },
  galleryMoreLinkText: { id: "content-gallery-more-link-text", html: false },
  galleryCap1: { id: "content-gallery-cap1", html: false },
  galleryCap2: { id: "content-gallery-cap2", html: false },
  galleryCap3: { id: "content-gallery-cap3", html: false },
  galleryCap4: { id: "content-gallery-cap4", html: false },
  galleryCap5: { id: "content-gallery-cap5", html: false },
  juryEyebrow: { id: "content-jury-eyebrow", html: false },
  juryTitle: { id: "content-jury-title", html: false },
  juryName1: { id: "content-jury-name1", html: false },
  juryRegalia1: { id: "content-jury-regalia1", html: false },
  juryName2: { id: "content-jury-name2", html: false },
  juryRegalia2: { id: "content-jury-regalia2", html: false },
  juryName3: { id: "content-jury-name3", html: false },
  juryRegalia3: { id: "content-jury-regalia3", html: false },
  juryName4: { id: "content-jury-name4", html: false },
  juryRegalia4: { id: "content-jury-regalia4", html: false },
  juryName5: { id: "content-jury-name5", html: false },
  juryRegalia5: { id: "content-jury-regalia5", html: false },
  teamsEyebrow: { id: "content-teams-eyebrow", html: false },
  teamsTitle: { id: "content-teams-title", html: false },
  teamsLead: { id: "content-teams-lead", html: false },
  teamsApplyButton: { id: "content-teams-apply-button", html: false },
  teamsFormTitle: { id: "content-teams-form-title", html: false },
  teamsLeaderLabel: { id: "content-teams-leader-label", html: false },
  teamsPhoneLabel: { id: "content-teams-phone-label", html: false },
  teamsParticipantsLabel: { id: "content-teams-participants-label", html: false },
  teamsNominationsLabel: { id: "content-teams-nominations-label", html: false },
  teamsNomination1: { id: "content-teams-nomination1", html: false },
  teamsNomination2: { id: "content-teams-nomination2", html: false },
  teamsNomination3: { id: "content-teams-nomination3", html: false },
  teamsNomination4: { id: "content-teams-nomination4", html: false },
  teamsDishLabel: { id: "content-teams-dish-label", html: false },
  teamsConceptLabel: { id: "content-teams-concept-label", html: false },
  teamsEquipmentLabel: { id: "content-teams-equipment-label", html: false },
  teamsEquipmentNeedAll: { id: "content-teams-equipment-need-all", html: false },
  teamsEquipmentOwn: { id: "content-teams-equipment-own", html: false },
  teamsWishesLabel: { id: "content-teams-wishes-label", html: false },
  teamsSubmitButton: { id: "content-teams-submit-button", html: false },
  teamsRegulationText: { id: "content-teams-regulation-text", html: false },
  ticketsEyebrow: { id: "content-tickets-eyebrow", html: false },
  ticketsTitle: { id: "content-tickets-title", html: false },
  ticketPriceLabel: { id: "content-ticket-price-label", html: false },
  ticketPriceValue: { id: "content-ticket-price-value", html: false },
  ticketPriceText: { id: "content-ticket-price-text", html: false },
  ticketFeature1: { id: "content-ticket-feature1", html: false },
  ticketFeature2: { id: "content-ticket-feature2", html: false },
  ticketFeature3: { id: "content-ticket-feature3", html: false },
  ticketNote: { id: "content-ticket-note", html: false },
  ticketOfferNote: { id: "content-ticket-offer-note", html: false },
  ticketOfferLinkText: { id: "content-ticket-offer-link", html: false },
  voteEyebrow: { id: "content-vote-eyebrow", html: false },
  voteTitle: { id: "content-vote-title", html: false },
  voteTicketLabel: { id: "content-vote-ticket-label", html: false },
  voteButton: { id: "content-vote-button", html: false },
  voteScoreboard: { id: "content-vote-scoreboard", html: false },
  team1Name: { id: "content-team1-name", html: false },
  team1Desc: { id: "content-team1-desc", html: false },
  team2Name: { id: "content-team2-name", html: false },
  team2Desc: { id: "content-team2-desc", html: false },
  team3Name: { id: "content-team3-name", html: false },
  team3Desc: { id: "content-team3-desc", html: false },
  quizEyebrow: { id: "content-quiz-eyebrow", html: false },
  quizTitle: { id: "content-quiz-title", html: false },
  quizQ1Title: { id: "content-quiz-q1-title", html: false },
  quizQ1A1: { id: "content-quiz-q1-a1", html: false },
  quizQ1A2: { id: "content-quiz-q1-a2", html: false },
  quizQ1A3: { id: "content-quiz-q1-a3", html: false },
  quizQ1A4: { id: "content-quiz-q1-a4", html: false },
  quizQ1A5: { id: "content-quiz-q1-a5", html: false },
  quizQ2Title: { id: "content-quiz-q2-title", html: false },
  quizQ2A1: { id: "content-quiz-q2-a1", html: false },
  quizQ2A2: { id: "content-quiz-q2-a2", html: false },
  quizQ2A3: { id: "content-quiz-q2-a3", html: false },
  quizQ2A4: { id: "content-quiz-q2-a4", html: false },
  quizQ2A5: { id: "content-quiz-q2-a5", html: false },
  quizQ3Title: { id: "content-quiz-q3-title", html: false },
  quizQ3A1: { id: "content-quiz-q3-a1", html: false },
  quizQ3A2: { id: "content-quiz-q3-a2", html: false },
  quizQ3A3: { id: "content-quiz-q3-a3", html: false },
  quizQ3A4: { id: "content-quiz-q3-a4", html: false },
  quizQ3A5: { id: "content-quiz-q3-a5", html: false },
  quizQ4Title: { id: "content-quiz-q4-title", html: false },
  quizQ4A1: { id: "content-quiz-q4-a1", html: false },
  quizQ4A2: { id: "content-quiz-q4-a2", html: false },
  quizQ4A3: { id: "content-quiz-q4-a3", html: false },
  quizQ4A4: { id: "content-quiz-q4-a4", html: false },
  quizQ4A5: { id: "content-quiz-q4-a5", html: false },
  quizQ5Title: { id: "content-quiz-q5-title", html: false },
  quizQ5A1: { id: "content-quiz-q5-a1", html: false },
  quizQ5A2: { id: "content-quiz-q5-a2", html: false },
  quizQ5A3: { id: "content-quiz-q5-a3", html: false },
  quizQ5A4: { id: "content-quiz-q5-a4", html: false },
  quizQ5A5: { id: "content-quiz-q5-a5", html: false },
  quizButton: { id: "content-quiz-button", html: false },
  quizResultLabel: { id: "content-quiz-result-label", html: false },
  quizResultTitle: { id: "content-quiz-result-title", html: false },
  quizResultText: { id: "content-quiz-result-text", html: false },
  contactsEyebrow: { id: "content-contacts-eyebrow", html: false },
  contactsTitle: { id: "content-contacts-title", html: false },
  contactOrgTitle: { id: "content-contact-org-title", html: false },
  contactOrgPhone: { id: "content-contact-org-phone", html: false },
  contactOrgEmail: { id: "content-contact-org-email", html: false },
  contactPressTitle: { id: "content-contact-press-title", html: false },
  contactPressEmail: { id: "content-contact-press-email", html: false },
  contactPressSocial: { id: "content-contact-press-social", html: false },
  contactTicketTitle: { id: "content-contact-ticket-title", html: false },
  contactTicketEmail: { id: "content-contact-ticket-email", html: false },
  contactTicketNote: { id: "content-contact-ticket-note", html: false },
};

const ticketForm = document.querySelector("#ticket-form");
const teamApplyToggle = document.querySelector("#team-apply-toggle");
const teamApplyPanel = document.querySelector("#team-apply-panel");
const teamApplyForm = document.querySelector("#team-apply-form");
const teamApplyMessage = document.querySelector("#team-apply-message");
const paymentForm = document.querySelector("#payment-form");
const backToOrderButton = document.querySelector("#back-to-order");
const payButton = document.querySelector("#pay-button");
const paymentSummary = document.querySelector("#payment-summary");
const resultCard = document.querySelector("#ticket-result");
const ticketList = document.querySelector("#ticket-list");
const voteForm = document.querySelector("#vote-form");
const voteMessage = document.querySelector("#vote-message");
const voteResults = document.querySelector("#vote-results");
const programExpandButton = document.querySelector("#program-expand-button");
const quizForm = document.querySelector("#quiz-form");
const quizResult = document.querySelector("#quiz-result");
const quizProgress = document.querySelector("#quiz-progress");
const orderStepLabel = document.querySelector("#order-step-label");
const paymentStepLabel = document.querySelector("#payment-step-label");
const ticketsStepLabel = document.querySelector("#tickets-step-label");
const countdownNodes = {
  block: document.querySelector("#countdown-block"),
  days: document.querySelector("#countdown-days"),
  hours: document.querySelector("#countdown-hours"),
  minutes: document.querySelector("#countdown-minutes"),
  seconds: document.querySelector("#countdown-seconds"),
};

const checkinForm = document.querySelector("#checkin-form");
const checkinResult = document.querySelector("#checkin-result");
const logList = document.querySelector("#checkin-log-list");
const scannerReader = document.querySelector("#scanner-reader");
const scannerVideo = document.querySelector("#scanner-video");
const startScanButton = document.querySelector("#start-scan");
const stopScanButton = document.querySelector("#stop-scan");
const cameraStatus = document.querySelector("#camera-status");
const galleryCarousel = document.querySelector("#gallery-carousel");

const adminContentForm = document.querySelector("#admin-content-form");
const adminMessage = document.querySelector("#admin-message");
const adminResetButton = document.querySelector("#admin-reset-content");
const adminRefreshButton = document.querySelector("#admin-refresh-stats");
const adminExportQuizButton = document.querySelector("#admin-export-quiz");
const adminExportTicketsButton = document.querySelector("#admin-export-tickets");
const adminExportTeamsButton = document.querySelector("#admin-export-teams");
const adminResetTeamsButton = document.querySelector("#admin-reset-teams");
const adminResetTicketsButton = document.querySelector("#admin-reset-tickets");
const adminResetQuizButton = document.querySelector("#admin-reset-quiz");
const adminUserForm = document.querySelector("#admin-user-form");
const adminUserMessage = document.querySelector("#admin-user-message");
const adminUsersList = document.querySelector("#admin-users-list");
const adminTabs = document.querySelectorAll("[data-tab-target]");
const adminTabPanels = document.querySelectorAll("[data-tab-panel]");
const authForm = document.querySelector("#auth-form");
const authMessage = document.querySelector("#auth-message");
const authScreen = document.querySelector("#auth-screen");
const protectedApp = document.querySelector("#protected-app");
const logoutButton = document.querySelector("#logout-button");
const protectedRole = document.body.dataset.protectedRole || "";
const adminStats = {
  ticketsSold: document.querySelector("#stat-tickets-sold"),
  ticketsScanned: document.querySelector("#stat-tickets-scanned"),
  votesCast: document.querySelector("#stat-votes-cast"),
  quizTotal: document.querySelector("#stat-quiz-total"),
  teamsTotal: document.querySelector("#stat-teams-total"),
  votesList: document.querySelector("#admin-vote-results"),
  quizList: document.querySelector("#admin-quiz-results"),
  recentTickets: document.querySelector("#admin-recent-tickets"),
};

let pendingOrder = null;
let lastCreatedOrderTickets = [];
let protectedModulesInitialized = false;
let countdownTimerId = null;
let galleryState = {
  index: 0,
  slides: [],
  dots: [],
  track: null,
};
let scannerState = {
  stream: null,
  detector: null,
  html5Scanner: null,
  active: false,
  frameId: null,
  mode: "",
  lastRawValue: "",
  lastDetectedAt: 0,
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildPelmenImagePath(stage) {
  return `/images/pelmen${stage}.webp`;
}

function setPelmenStage(image, hint, stage) {
  if (!image) return;
  const currentStage = Number(image.dataset.stage || 0);
  if (currentStage === stage) return;
  const cached = pelmenFrameCache.get(stage);
  const nextSrc = cached?.src || buildPelmenImagePath(stage);
  image.src = nextSrc;
  image.dataset.stage = String(stage);
  image.alt = `Пельмень, этап ${stage}`;
  if (hint) hint.textContent = `Тапай на пельмень, чтобы слепить его. Этап ${stage}/7`;
}

function preloadPelmenFrames() {
  for (let stage = 1; stage <= PELMEN_STAGE_TOTAL; stage += 1) {
    const img = new Image();
    img.src = buildPelmenImagePath(stage);
    pelmenFrameCache.set(stage, img);
  }
}

function hidePelmenMiniGame(node) {
  if (!node) return;
  node.classList.remove("is-visible");
  node.classList.add("is-leaving");
  window.setTimeout(() => node.remove(), 520);
}

function movePelmenMiniGameRandom(node) {
  if (!node) return;
  const margin = 20;
  const rect = node.getBoundingClientRect();
  const halfWidth = Math.max(40, rect.width / 2);
  const halfHeight = Math.max(40, rect.height / 2);

  const minX = Math.round(halfWidth + margin);
  const maxX = Math.round(window.innerWidth - halfWidth - margin);
  const minY = Math.round(halfHeight + margin);
  const maxY = Math.round(window.innerHeight - halfHeight - margin);

  const targetX = maxX > minX ? getRandomInt(minX, maxX) : Math.round(window.innerWidth / 2);
  const targetY = maxY > minY ? getRandomInt(minY, maxY) : Math.round(window.innerHeight / 2);

  node.style.left = `${targetX}px`;
  node.style.top = `${targetY}px`;
}

function spawnPelmenMiniGame() {
  const sideVariants = ["left", "right", "top", "bottom"];
  const side = sideVariants[getRandomInt(0, sideVariants.length - 1)];
  const root = document.createElement("div");
  root.className = `pelmen-mini pelmen-mini--from-${side}`;
  const flightDistanceX = window.innerWidth * 0.65;
  const flightDistanceY = window.innerHeight * 0.55;
  const fromX = side === "left" ? -flightDistanceX : side === "right" ? flightDistanceX : 0;
  const fromY = side === "top" ? -flightDistanceY : side === "bottom" ? flightDistanceY : 0;
  root.style.setProperty("--pelmen-from-x", `${Math.round(fromX)}px`);
  root.style.setProperty("--pelmen-from-y", `${Math.round(fromY)}px`);

  root.innerHTML = `
    <p class="pelmen-mini__hint">Тапай на пельмень, чтобы слепить его. Этап 1/7</p>
    <button class="pelmen-mini__button" type="button" aria-label="Лепить пельмень" disabled>
      <img class="pelmen-mini__image" src="${buildPelmenImagePath(1)}" alt="Пельмень, этап 1">
    </button>
  `;

  const hint = root.querySelector(".pelmen-mini__hint");
  const button = root.querySelector(".pelmen-mini__button");
  const image = root.querySelector(".pelmen-mini__image");
  let stage = 1;
  setPelmenStage(image, hint, stage);

  button?.addEventListener("click", () => {
    stage += 1;
    if (!image) return;
    if (stage > PELMEN_STAGE_TOTAL) {
      hidePelmenMiniGame(root);
      return;
    }
    setPelmenStage(image, hint, stage);
    movePelmenMiniGameRandom(root);
    if (stage === PELMEN_STAGE_TOTAL) {
      window.setTimeout(() => hidePelmenMiniGame(root), 700);
    }
  });

  document.body.append(root);
  window.requestAnimationFrame(() => root.classList.add("is-visible"));
  window.setTimeout(() => {
    button?.removeAttribute("disabled");
    root.classList.add("is-ready");
  }, 560);
}

function initPelmenMiniGame() {
  if (protectedRole) return;
  preloadPelmenFrames();
  try {
    if (sessionStorage.getItem(PELMEN_SESSION_KEY) === "1") return;
    sessionStorage.setItem(PELMEN_SESSION_KEY, "1");
  } catch (error) {
    return;
  }
  window.setTimeout(spawnPelmenMiniGame, 10000);
}
async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.error || "Ошибка запроса.");
  }
  return payload;
}

async function downloadFile(url, fallbackName) {
  const response = await fetch(url, { credentials: "same-origin" });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.error || "Не удалось скачать файл.");
  }

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const disposition = response.headers.get("Content-Disposition") || "";
  const matchedName = disposition.match(/filename=\"?([^\";]+)\"?/i);

  link.href = objectUrl;
  link.download = matchedName?.[1] || fallbackName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(objectUrl);
}

const api = {
  login: async (role, username, password) => requestJson("/api/auth/login", { method: "POST", body: JSON.stringify({ role, username, password }) }),
  logout: async () => requestJson("/api/auth/logout", { method: "POST", body: JSON.stringify({}) }),
  authStatus: async (role) => requestJson(`/api/auth/status?role=${encodeURIComponent(role)}`),
  getContent: async () => (await requestJson("/api/content")).content,
  saveContent: async (content) => (await requestJson("/api/content", { method: "PUT", body: JSON.stringify({ content }) })).content,
  resetContent: async () => (await requestJson("/api/content", { method: "DELETE" })).content,
  getTickets: async () => (await requestJson("/api/tickets")).tickets,
  createOrder: async (order) => requestJson("/api/orders", { method: "POST", body: JSON.stringify(order) }),
  createTeamApplication: async (payload) => requestJson("/api/team-applications", { method: "POST", body: JSON.stringify(payload) }),
  checkin: async (code) => requestJson("/api/checkin", { method: "POST", body: JSON.stringify({ code }) }),
  vote: async (code, team) => requestJson("/api/vote", { method: "POST", body: JSON.stringify({ code, team }) }),
  recordQuiz: async (type) => requestJson("/api/quiz", { method: "POST", body: JSON.stringify({ type }) }),
  resetTickets: async () => requestJson("/api/reset/tickets", { method: "POST", body: JSON.stringify({}) }),
  resetQuiz: async () => requestJson("/api/reset/quiz", { method: "POST", body: JSON.stringify({}) }),
  resetTeams: async () => requestJson("/api/reset/teams", { method: "POST", body: JSON.stringify({}) }),
  getPublicStats: async () => requestJson("/api/public-stats"),
  getStats: async () => (await requestJson("/api/stats")).stats,
  getUsers: async () => (await requestJson("/api/admin/users")).users,
  createUser: async (payload) => (await requestJson("/api/admin/users", { method: "POST", body: JSON.stringify(payload) })).user,
  updateUserPassword: async (userId, password) => (await requestJson(`/api/admin/users/${encodeURIComponent(userId)}/password`, { method: "PATCH", body: JSON.stringify({ password }) })).user,
};

function buildQrUrl(ticket) {
  const payload = encodeURIComponent(`KOSTROVIE:${ticket.code}`);
  return `${QR_ENDPOINT}${payload}`;
}

function buildMapUrl(content) {
  const lat = Number.parseFloat(content.mapLat);
  const lon = Number.parseFloat(content.mapLon);
  const zoom = Number.parseInt(content.mapZoom, 10);
  const safeLat = Number.isFinite(lat) ? lat : 43.1155;
  const safeLon = Number.isFinite(lon) ? lon : 131.8855;
  const safeZoom = Number.isFinite(zoom) ? zoom : 12;
  return `https://yandex.ru/map-widget/v1/?ll=${encodeURIComponent(`${safeLon},${safeLat}`)}&z=${safeZoom}&pt=${encodeURIComponent(`${safeLon},${safeLat},pm2rdm`)}`;
}

function isEnabled(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
}

function applySectionVisibility(content) {
  const visibility = {
    countdown: isEnabled(content.showCountdown, true),
    about: isEnabled(content.showAbout, true),
    location: isEnabled(content.showLocation, true),
    program: isEnabled(content.showProgram, true),
    gallery: isEnabled(content.showGallery, true),
    jury: isEnabled(content.showJury, true),
    teams: isEnabled(content.showTeams, true),
    tickets: isEnabled(content.showTickets, true),
    vote: isEnabled(content.showVote, true),
    quiz: isEnabled(content.showQuiz, true),
    contacts: isEnabled(content.showContacts, true),
  };

  document.querySelectorAll("[data-section-key]").forEach((node) => {
    node.hidden = !visibility[node.dataset.sectionKey];
  });

  document.querySelectorAll("[data-nav-key]").forEach((node) => {
    node.hidden = !visibility[node.dataset.navKey];
  });
}

function sanitizeAssetPath(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";
  return trimmed.replace(/\\/g, "/");
}

function startCountdown(content) {
  if (countdownTimerId) {
    clearInterval(countdownTimerId);
    countdownTimerId = null;
  }
  if (!countdownNodes.block) return;

  const targetDate = new Date(String(content.festivalStartAt || DEFAULT_CONTENT.festivalStartAt));
  if (Number.isNaN(targetDate.getTime())) {
    countdownNodes.block.hidden = true;
    return;
  }

  const update = () => {
    const diffMs = targetDate.getTime() - Date.now();
    const safeDiff = Math.max(diffMs, 0);
    const totalSeconds = Math.floor(safeDiff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    countdownNodes.days.textContent = String(days);
    countdownNodes.hours.textContent = String(hours).padStart(2, "0");
    countdownNodes.minutes.textContent = String(minutes).padStart(2, "0");
    countdownNodes.seconds.textContent = String(seconds).padStart(2, "0");
  };

  update();
  countdownTimerId = window.setInterval(update, 1000);
}

function applyGalleryImages(content) {
  for (let index = 1; index <= 5; index += 1) {
    const card = document.querySelector(`[data-gallery-slot="${index}"]`);
    if (!card) continue;
    const path = sanitizeAssetPath(content[`galleryImage${index}`]);
    if (path) {
      card.style.backgroundImage = `linear-gradient(180deg, transparent, rgba(36, 22, 14, 0.58)), url("${path.replace(/"/g, "%22")}")`;
      card.classList.add("gallery-card--with-image");
    } else {
      card.style.backgroundImage = "";
      card.classList.remove("gallery-card--with-image");
    }
  }
}

function applyJuryPhotos(content) {
  for (let index = 1; index <= 5; index += 1) {
    const photo = document.querySelector(`[data-jury-photo-slot="${index}"]`);
    if (!photo) continue;
    const path = sanitizeAssetPath(content[`juryPhoto${index}`]);
    if (path) {
      photo.style.backgroundImage = `linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(36, 22, 14, 0.22)), url("${path.replace(/"/g, "%22")}")`;
    } else {
      photo.style.backgroundImage = "";
    }
  }
}

function setGallerySlide(nextIndex) {
  if (!galleryState.track || !galleryState.slides.length) return;
  const total = galleryState.slides.length;
  const safeIndex = ((nextIndex % total) + total) % total;
  galleryState.index = safeIndex;
  galleryState.track.style.transform = `translateX(-${safeIndex * 100}%)`;
  galleryState.dots.forEach((dot, index) => {
    dot.classList.toggle("gallery-dot--active", index === safeIndex);
    dot.setAttribute("aria-current", index === safeIndex ? "true" : "false");
  });
}

function initGalleryCarousel() {
  if (!galleryCarousel) return;
  const track = galleryCarousel.querySelector(".gallery-track");
  const slides = track ? Array.from(track.querySelectorAll(".gallery-slide")) : [];
  const dotsWrap = galleryCarousel.querySelector("[data-gallery-dots]");
  const prevButton = galleryCarousel.querySelector("[data-gallery-prev]");
  const nextButton = galleryCarousel.querySelector("[data-gallery-next]");
  if (!track || !slides.length || !dotsWrap || !prevButton || !nextButton) return;

  galleryState.track = track;
  galleryState.slides = slides;
  dotsWrap.innerHTML = slides
    .map((_, index) => `<button class="gallery-dot${index === 0 ? " gallery-dot--active" : ""}" type="button" data-gallery-dot="${index}" aria-label="Фото ${index + 1}"></button>`)
    .join("");
  galleryState.dots = Array.from(dotsWrap.querySelectorAll("[data-gallery-dot]"));

  prevButton.addEventListener("click", () => setGallerySlide(galleryState.index - 1));
  nextButton.addEventListener("click", () => setGallerySlide(galleryState.index + 1));
  galleryState.dots.forEach((dot) => {
    dot.addEventListener("click", () => {
      const index = Number(dot.getAttribute("data-gallery-dot"));
      setGallerySlide(index);
    });
  });

  setGallerySlide(0);
}

function tryDecodeUri(value) {
  try {
    return decodeURIComponent(value);
  } catch (error) {
    return value;
  }
}

function extractTicketCode(value) {
  const match = String(value || "").match(/PF26-[A-Z0-9]{6}/i);
  return match ? match[0].toUpperCase() : "";
}

function normalizeTicketInput(value) {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const candidates = [trimmed];
  const decodedOnce = tryDecodeUri(trimmed);
  if (decodedOnce !== trimmed) candidates.push(decodedOnce);
  const decodedTwice = tryDecodeUri(decodedOnce);
  if (decodedTwice !== decodedOnce) candidates.push(decodedTwice);

  for (const candidate of candidates) {
    const source = String(candidate).trim();
    if (!source) continue;

    if (source.startsWith("KOSTROVIE:")) {
      const code = extractTicketCode(source.split(":").at(-1));
      if (code) return code;
    }

    if (source.includes("data=")) {
      const tail = source.split("data=").at(-1);
      const tailCode = extractTicketCode(tail);
      if (tailCode) return tailCode;
      const decodedTailCode = extractTicketCode(tryDecodeUri(tail));
      if (decodedTailCode) return decodedTailCode;
    }

    const directCode = extractTicketCode(source);
    if (directCode) return directCode;
  }

  return trimmed;
}

function shouldProcessScan(rawValue) {
  const normalized = normalizeTicketInput(rawValue);
  if (!normalized) return false;
  const now = Date.now();
  if (normalized !== scannerState.lastRawValue || now - scannerState.lastDetectedAt > 1500) {
    scannerState.lastRawValue = normalized;
    scannerState.lastDetectedAt = now;
    return true;
  }
  return false;
}

function setCheckinInputValue(value) {
  const field = document.querySelector('#checkin-form input[name="code"]') || checkinForm?.querySelector("input");
  if (!field) return;
  field.value = String(value || "");
  field.dispatchEvent(new Event("input", { bubbles: true }));
}

function formatPrice(value) {
  return `${Number(value).toLocaleString("ru-RU")} ₽`;
}

function setStep(step) {
  if (!orderStepLabel || !paymentStepLabel || !ticketsStepLabel) return;
  orderStepLabel.classList.toggle("checkout-step--active", step === "order");
  paymentStepLabel.classList.toggle("checkout-step--active", step === "payment");
  ticketsStepLabel.classList.toggle("checkout-step--active", step === "tickets");
}

function setTeamApplyMessage(message, tone = "ok") {
  if (!teamApplyMessage) return;
  teamApplyMessage.classList.remove("info-message--warn", "info-message--ok");
  teamApplyMessage.classList.add(tone === "warn" ? "info-message--warn" : "info-message--ok");
  teamApplyMessage.textContent = message;
}

function initTeamApplyFlow() {
  if (!teamApplyToggle || !teamApplyPanel || !teamApplyForm) return;

  teamApplyToggle.addEventListener("click", () => {
    teamApplyPanel.hidden = !teamApplyPanel.hidden;
    if (!teamApplyPanel.hidden) {
      setTeamApplyMessage("Заполните форму и отправьте заявку.", "ok");
    }
  });

  teamApplyForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(teamApplyForm);
    const nominations = formData.getAll("nominations").map((item) => String(item || "").trim()).filter(Boolean);
    const payload = {
      leaderName: String(formData.get("leaderName") || "").trim(),
      phone: String(formData.get("phone") || "").trim(),
      participants: String(formData.get("participants") || "").trim(),
      nominations,
      dishDescription: String(formData.get("dishDescription") || "").trim(),
      concept: String(formData.get("concept") || "").trim(),
      equipmentMode: String(formData.get("equipmentMode") || "").trim(),
      wishes: String(formData.get("wishes") || "").trim(),
    };

    if (!payload.nominations.length) {
      setTeamApplyMessage("Выберите хотя бы одну номинацию.", "warn");
      return;
    }

    try {
      await api.createTeamApplication(payload);
      const successText = String((window.__appContent && window.__appContent.teamsSuccessMessage) || DEFAULT_CONTENT.teamsSuccessMessage);
      setTeamApplyMessage(successText, "ok");
      teamApplyForm.reset();
    } catch (error) {
      setTeamApplyMessage(error.message || "Не удалось отправить заявку. Попробуйте ещё раз.", "warn");
    }
  });
}

function validatePaymentData(data) {
  const cleanNumber = String(data.cardNumber || "").replace(/\s+/g, "");
  return cleanNumber.length >= 16 && /^\d{2}\/\d{2}$/.test(data.expiry) && /^\d{3}$/.test(data.cvv) && String(data.cardHolder || "").trim().length >= 4;
}

function setVoteMessage(message, mode) {
  if (!voteMessage) return;
  voteMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  voteMessage.innerHTML = message;
}

function setCheckinMessage(message, mode) {
  if (!checkinResult) return;
  checkinResult.className = `checkin-result ${mode ? `checkin-result--${mode}` : ""}`.trim();
  checkinResult.innerHTML = message;
}

function setAdminMessage(text, mode) {
  if (!adminMessage) return;
  adminMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  adminMessage.innerHTML = text;
}

function setAdminUserMessage(text, mode) {
  if (!adminUserMessage) return;
  adminUserMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  adminUserMessage.innerHTML = text;
}

function setAuthMessage(text, mode) {
  if (!authMessage) return;
  authMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  authMessage.innerHTML = text;
}

function setProtectedVisibility(authenticated) {
  if (authScreen) authScreen.hidden = authenticated;
  if (protectedApp) protectedApp.hidden = !authenticated;
}

function renderQuizResult(type) {
  if (!quizResult) return;
  const result = QUIZ_RESULTS[type];
  const restartLabel = "Пройти еще раз";
  quizResult.innerHTML = `
    <p class="eyebrow">Результат</p>
    <h3>${result.title}</h3>
    <p>${result.text}</p>
    <button type="button" class="button button--secondary" id="quiz-restart">${restartLabel}</button>
  `;
}

function resetQuizResultPanel() {
  if (!quizResult) return;
  const content = window.__appContent || DEFAULT_CONTENT;
  quizResult.innerHTML = `
    <p class="eyebrow">${content.quizResultLabel || DEFAULT_CONTENT.quizResultLabel}</p>
    <h3>${content.quizResultTitle || DEFAULT_CONTENT.quizResultTitle}</h3>
    <p>${content.quizResultText || DEFAULT_CONTENT.quizResultText}</p>
  `;
}

function renderOrderTickets(orderTickets) {
  if (!resultCard || !ticketList || !orderTickets.length) return;
  const first = orderTickets[0];
  document.querySelector("#ticket-order-title").textContent = `Заказ ${first.orderId.slice(0, 8).toUpperCase()}`;
  const orderPdfUrl = `/api/orders/${encodeURIComponent(first.orderId)}/pdf`;
  const subtitle = document.querySelector("#ticket-order-subtitle");
  subtitle.textContent = `${first.name}, оплачено ${formatPrice(first.orderTotal)}. Ниже все билеты из заказа.`;
  subtitle.appendChild(document.createElement("br"));
  const downloadAllLink = document.createElement("a");
  downloadAllLink.className = "button button--secondary";
  downloadAllLink.href = orderPdfUrl;
  downloadAllLink.setAttribute("download", "");
  downloadAllLink.textContent = "Скачать все билеты PDF";
  subtitle.appendChild(downloadAllLink);

  ticketList.innerHTML = orderTickets.map((ticket) => `
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
        <a class="button button--secondary" href="/api/tickets/${encodeURIComponent(ticket.code)}/pdf" download>Скачать билет PDF</a>
        <a class="button button--secondary" target="_blank" rel="noreferrer" href="${buildQrUrl(ticket)}">Открыть QR</a>
      </div>
    </article>
  `).join("");

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

function applyContent(content) {
  const merged = { ...DEFAULT_CONTENT, ...(content || {}) };
  window.__appContent = merged;
  document.title = merged.seoTitle || DEFAULT_CONTENT.seoTitle;
  const metaDescription = document.querySelector('meta[name="description"]');
  if (metaDescription) {
    metaDescription.setAttribute("content", merged.seoDescription || DEFAULT_CONTENT.seoDescription);
  }
  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) {
    ogTitle.setAttribute("content", merged.ogTitle || merged.seoTitle || DEFAULT_CONTENT.ogTitle);
  }
  const ogDescription = document.querySelector('meta[property="og:description"]');
  if (ogDescription) {
    ogDescription.setAttribute("content", merged.ogDescription || merged.seoDescription || DEFAULT_CONTENT.ogDescription);
  }
  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) {
    ogImage.setAttribute("content", merged.ogImage || DEFAULT_CONTENT.ogImage);
  }
  const canonicalLink = document.querySelector('link[rel="canonical"]');
  if (canonicalLink) {
    canonicalLink.setAttribute("href", merged.canonicalUrl || DEFAULT_CONTENT.canonicalUrl);
  }
  Object.entries(CONTENT_BINDINGS).forEach(([key, binding]) => {
    const node = document.querySelector(`#${binding.id}`);
    if (!node) return;
    if (binding.html) {
      node.innerHTML = merged[key];
    } else {
      node.textContent = merged[key];
    }
  });
  const offerLink = document.querySelector("#content-ticket-offer-link");
  if (offerLink) {
    const href = String(merged.ticketOfferLinkUrl || "").trim();
    if (href) {
      offerLink.setAttribute("href", href);
      offerLink.removeAttribute("aria-disabled");
    } else {
      offerLink.setAttribute("href", "#");
      offerLink.setAttribute("aria-disabled", "true");
    }
  }
  const regulationLink = document.querySelector("#content-teams-regulation-link");
  if (regulationLink) {
    const href = String(merged.teamsRegulationUrl || "").trim();
    regulationLink.setAttribute("href", href || "#");
  }
  const galleryMoreLink = document.querySelector("#content-gallery-more-link");
  if (galleryMoreLink) {
    const href = String(merged.galleryMoreLinkUrl || "").trim();
    if (href) {
      galleryMoreLink.setAttribute("href", href);
      galleryMoreLink.removeAttribute("aria-disabled");
    } else {
      galleryMoreLink.setAttribute("href", "#");
      galleryMoreLink.setAttribute("aria-disabled", "true");
    }
  }
  if (teamApplyForm) {
    const nominationMap = {
      nomination1: merged.teamsNomination1,
      nomination2: merged.teamsNomination2,
      nomination3: merged.teamsNomination3,
      nomination4: merged.teamsNomination4,
    };
    teamApplyForm.querySelectorAll('input[name="nominations"]').forEach((checkbox) => {
      const key = checkbox.value;
      checkbox.value = String(nominationMap[key] || key);
    });
  }
  const mapFrame = document.querySelector("#content-map-frame");
  if (mapFrame) mapFrame.src = buildMapUrl(merged);
  applySectionVisibility(merged);
  applyGalleryImages(merged);
  applyJuryPhotos(merged);
  startCountdown(merged);
  const teamInputs = document.querySelectorAll('#vote-form input[name="team"]');
  if (teamInputs[0]) teamInputs[0].value = merged.team1Name;
  if (teamInputs[1]) teamInputs[1].value = merged.team2Name;
  if (teamInputs[2]) teamInputs[2].value = merged.team3Name;
}

function fillAdminContentForm(content) {
  if (!adminContentForm) return;
  const merged = { ...DEFAULT_CONTENT, ...(content || {}) };
  Object.entries(merged).forEach(([key, value]) => {
    const field = adminContentForm.elements.namedItem(key);
    if (!field || field instanceof RadioNodeList) return;
    if (field.type === "checkbox") {
      field.checked = isEnabled(value, true);
      return;
    }
    field.value = String(value).replace(/<br\s*\/?>/g, "\n");
  });
}

async function renderVoteResults() {
  if (!voteResults) return;
  const payload = await api.getPublicStats();
  voteResults.innerHTML = payload.voteResults
    .map((item) => `<li><strong>${item.team}</strong><span>${item.votes} голосов</span></li>`)
    .join("");
}

async function renderCheckinLog() {
  if (!logList) return;
  const tickets = await api.getTickets();
  const usedTickets = tickets
    .filter((ticket) => ticket.accessStatus === "used")
    .sort((a, b) => new Date(b.usedAt) - new Date(a.usedAt));

  logList.innerHTML = usedTickets.length
    ? usedTickets.map((entry) => `<li><strong>${entry.code}</strong><span>${entry.name} • ${new Date(entry.usedAt).toLocaleString("ru-RU")}</span></li>`).join("")
    : "<li><strong>Пока нет отметок</strong><span>После первого прохода журнал появится здесь.</span></li>";
}

async function renderAdminStats() {
  if (!adminStats.ticketsSold) return;
  const stats = await api.getStats();

  adminStats.ticketsSold.textContent = String(stats.ticketsSold);
  adminStats.ticketsScanned.textContent = String(stats.ticketsScanned);
  adminStats.votesCast.textContent = String(stats.votesCast);
  adminStats.quizTotal.textContent = String(stats.quizTotal);
  if (adminStats.teamsTotal) adminStats.teamsTotal.textContent = String(stats.teamsTotal || 0);

  if (adminStats.votesList) {
    adminStats.votesList.innerHTML = stats.voteResults
      .map((item) => `<li><strong>${item.team}</strong><span>${item.votes} голосов</span></li>`)
      .join("");
  }

  if (adminStats.quizList) {
    adminStats.quizList.innerHTML = stats.quizResults
      .map((item) => `<li><strong>${item.title}</strong><span>${item.total} результатов</span></li>`)
      .join("");
  }

  if (adminStats.recentTickets) {
    adminStats.recentTickets.innerHTML = stats.recentTickets.length
      ? stats.recentTickets.map((ticket) => `<li><strong>${ticket.code}</strong><span>${ticket.name} • ${ticket.accessStatus === "used" ? "вошёл" : "не вошёл"}</span></li>`).join("")
      : "<li><strong>Пока пусто</strong><span>После первых продаж билеты появятся здесь.</span></li>";
  }
}

async function renderAdminUsers() {
  if (!adminUsersList) return;
  const users = await api.getUsers();

  adminUsersList.innerHTML = users.length
    ? users.map((user) => `
      <article class="admin-user-card">
        <div class="admin-user-card__header">
          <div>
            <p class="eyebrow">${user.role === "admin" ? "Администратор" : "Входной контроль"}</p>
            <h3>${user.username}</h3>
          </div>
          <p class="muted">Создан: ${new Date(user.createdAt).toLocaleString("ru-RU")}</p>
        </div>
        <form class="admin-user-password-form" data-user-id="${user.id}">
          <label>
            Новый пароль
            <input type="password" name="password" placeholder="Минимум 8 символов" minlength="8" required>
          </label>
          <button class="button button--secondary" type="submit">Сменить пароль</button>
        </form>
      </article>
    `).join("")
    : "<p class=\"muted\">Пользователей пока нет.</p>";

  adminUsersList.querySelectorAll(".admin-user-password-form").forEach((form) => {
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const userId = form.dataset.userId;
      const password = String(new FormData(form).get("password") || "");
      try {
        await api.updateUserPassword(userId, password);
        form.reset();
        setAdminUserMessage("<strong>Пароль обновлён.</strong><br>Новая учётная запись может использовать его сразу.", "ok");
        await renderAdminUsers();
      } catch (error) {
        setAdminUserMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
      }
    });
  });
}

async function processCheckin(rawCode) {
  const code = normalizeTicketInput(rawCode);
  try {
    const response = await api.checkin(code);
    const { ticket } = response;
    await renderCheckinLog();
    await renderAdminStats();
    setCheckinMessage(`<strong>Проход разрешён.</strong><br>${ticket.name} • ${ticket.code}<br>Время: ${new Date(ticket.usedAt).toLocaleString("ru-RU")}`, "ok");
    return true;
  } catch (error) {
    const message = error.message.includes("отсканирован")
      ? `<strong>${code}</strong><br>${error.message}`
      : `<strong>Ошибка.</strong><br>${error.message}`;
    setCheckinMessage(message, "warn");
    return false;
  }
}

async function scanFrame() {
  if (!scannerState.active || scannerState.mode !== "barcode-detector" || !scannerState.detector || !scannerVideo) return;

  try {
    const barcodes = await scannerState.detector.detect(scannerVideo);
    const barcode = barcodes.find((item) => item.rawValue);

    if (barcode?.rawValue && shouldProcessScan(barcode.rawValue)) {
      setCheckinInputValue(normalizeTicketInput(barcode.rawValue));
      await processCheckin(barcode.rawValue);
    }
  } catch (error) {
    if (cameraStatus) cameraStatus.textContent = "Ошибка распознавания камеры.";
  }

  scannerState.frameId = requestAnimationFrame(scanFrame);
}

async function startScanner() {
  if (!cameraStatus) return;
  if (scannerState.active) return;

  try {
    if (typeof Html5Qrcode !== "undefined" && scannerReader) {
      const html5Scanner = new Html5Qrcode("scanner-reader");
      const cameras = await Html5Qrcode.getCameras();
      if (!cameras.length) {
        cameraStatus.textContent = "Камера не найдена. Проверьте разрешения устройства.";
        return;
      }

      const preferredCamera = cameras.find((camera) => /back|rear|environment|зад/i.test(camera.label)) || cameras[0];
      await html5Scanner.start(
        preferredCamera.id,
        {
          fps: 10,
          qrbox: { width: 240, height: 240 },
          aspectRatio: 1.333334,
        },
        async (decodedText) => {
          if (!shouldProcessScan(decodedText)) return;
          setCheckinInputValue(normalizeTicketInput(decodedText));
          await processCheckin(decodedText);
        },
        () => {},
      );

      scannerState.html5Scanner = html5Scanner;
      scannerState.active = true;
      scannerState.mode = "html5-qrcode";
      cameraStatus.textContent = "Камера активна. Наведите QR-код билета в рамку.";
      return;
    }

    if (!scannerVideo || !("BarcodeDetector" in window)) {
      cameraStatus.textContent = "В этом браузере нет web-сканера QR. Используйте ручной ввод или USB-сканер.";
      return;
    }

    scannerVideo.hidden = false;
    scannerState.detector = new BarcodeDetector({ formats: ["qr_code"] });
    scannerState.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: "environment" } }, audio: false });
    scannerVideo.srcObject = scannerState.stream;
    await scannerVideo.play();
    scannerState.active = true;
    scannerState.mode = "barcode-detector";
    cameraStatus.textContent = "Камера активна. Наведите QR-код билета в кадр.";
    scanFrame();
  } catch (error) {
    cameraStatus.textContent = "Не удалось запустить камеру. Проверьте разрешения браузера и HTTPS.";
  }
}

async function stopScanner() {
  if (scannerState.frameId) cancelAnimationFrame(scannerState.frameId);
  if (scannerState.html5Scanner) {
    try {
      await scannerState.html5Scanner.stop();
    } catch (error) {
      // no-op: scanner may already be stopped
    }
    try {
      await scannerState.html5Scanner.clear();
    } catch (error) {
      // no-op
    }
  }
  if (scannerState.stream) scannerState.stream.getTracks().forEach((track) => track.stop());
  scannerState = {
    stream: null,
    detector: null,
    html5Scanner: null,
    active: false,
    frameId: null,
    mode: "",
    lastRawValue: "",
    lastDetectedAt: 0,
  };
  if (scannerVideo) {
    scannerVideo.srcObject = null;
    scannerVideo.hidden = true;
  }
  if (scannerReader) scannerReader.innerHTML = "";
  if (cameraStatus) cameraStatus.textContent = "Камера остановлена.";
}

function initTicketFlow() {
  if (!ticketForm || !paymentForm) return;

  if (lastCreatedOrderTickets.length) renderOrderTickets(lastCreatedOrderTickets);

  ticketForm.addEventListener("submit", (event) => {
    event.preventDefault();
    pendingOrder = Object.fromEntries(new FormData(ticketForm).entries());
    renderPaymentSummary(pendingOrder);
    ticketForm.hidden = true;
    paymentForm.hidden = false;
    resultCard.hidden = true;
    setStep("payment");
  });

  paymentForm.addEventListener("submit", async (event) => {
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

    try {
      payButton.textContent = "Оплата выполняется";
      const response = await api.createOrder({ ...pendingOrder, ...paymentData });
      lastCreatedOrderTickets = response.tickets;
      renderOrderTickets(lastCreatedOrderTickets);
      paymentForm.hidden = true;
      ticketForm.hidden = false;
      paymentForm.reset();
      ticketForm.reset();
      pendingOrder = null;
      await renderVoteResults();
      await renderAdminStats();
    } catch (error) {
      renderPaymentSummary({
        name: "Ошибка оплаты",
        quantity: pendingOrder?.quantity || 1,
        email: error.message,
      });
    } finally {
      if (payButton) payButton.textContent = "Оплатить";
    }
  });

  backToOrderButton?.addEventListener("click", () => {
    paymentForm.hidden = true;
    ticketForm.hidden = false;
    resultCard.hidden = true;
    setStep("order");
  });
}

function initVoteFlow() {
  if (!voteForm) return;

  voteForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(voteForm).entries());
    const code = normalizeTicketInput(data.ticketCode);

    try {
      const response = await api.vote(code, data.team);
      setVoteMessage(`<strong>Голос принят.</strong><br>Билет ${response.ticket.code} проголосовал за «${response.ticket.voteTeam}».`, "ok");
      await renderVoteResults();
      await renderAdminStats();
      voteForm.reset();
    } catch (error) {
      setVoteMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });
}

function initProgramPreview() {
  const programSection = document.querySelector("#program");
  const timelineItems = Array.from(programSection?.querySelectorAll(".timeline .timeline-item") || []);
  if (!timelineItems.length || !programExpandButton) return;

  const hiddenItems = timelineItems.slice(2);
  if (!hiddenItems.length) {
    programExpandButton.hidden = true;
    return;
  }

  let expanded = false;
  const applyState = () => {
    hiddenItems.forEach((item) => item.classList.toggle("timeline-item--collapsed", !expanded));
    programExpandButton.textContent = expanded ? "Скрыть" : "Показать полностью расписание";
  };

  applyState();
  programExpandButton.hidden = false;
  programExpandButton.addEventListener("click", () => {
    expanded = !expanded;
    applyState();
  });
}

function initQuizFlow() {
  if (!quizForm) return;

  const quizCards = Array.from(quizForm.querySelectorAll(".quiz-card"));
  if (!quizCards.length) return;
  const totalSteps = quizCards.length;
  const answers = {};
  let currentStep = 0;

  const renderStep = () => {
    quizCards.forEach((card, index) => {
      card.hidden = index !== currentStep;
    });
    if (quizProgress) {
      quizProgress.textContent = `Вопрос ${currentStep + 1} из ${totalSteps}`;
    }
  };

  const calculateWinner = () => {
    const scores = Object.values(answers).reduce((acc, value) => {
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
    const priority = ["momo", "pelmeni", "khinkali", "varenik", "gyoza"];
    return Object.entries(scores)
      .sort((a, b) => b[1] - a[1] || priority.indexOf(a[0]) - priority.indexOf(b[0]))[0]?.[0] || "pelmeni";
  };

  const completeQuiz = async () => {
    const winner = calculateWinner();
    quizForm.hidden = true;
    if (quizProgress) quizProgress.hidden = true;
    if (quizResult) {
      quizResult.hidden = false;
      quizResult.innerHTML = "<p class=\"eyebrow\">Результат</p><h3>Считаем результат...</h3><p>Подождите пару секунд.</p>";
    }

    try {
      await api.recordQuiz(winner);
      renderQuizResult(winner);
      await renderAdminStats();
    } catch (error) {
      if (quizResult) {
        quizResult.hidden = false;
        quizResult.innerHTML = `<p class="eyebrow">Ошибка</p><h3>Результат не сохранён</h3><p>${error.message}</p>`;
      }
    }
  };

  const restartQuiz = () => {
    quizForm.reset();
    quizForm.hidden = false;
    if (quizResult) quizResult.hidden = true;
    if (quizProgress) quizProgress.hidden = false;
    Object.keys(answers).forEach((key) => delete answers[key]);
    currentStep = 0;
    renderStep();
    resetQuizResultPanel();
  };

  quizForm.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement) || target.type !== "radio") return;
    if (!quizCards[currentStep]?.contains(target)) return;
    answers[target.name] = target.value;

    if (currentStep < totalSteps - 1) {
      currentStep += 1;
      renderStep();
      return;
    }

    void completeQuiz();
  });

  quizResult?.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const button = target.closest("#quiz-restart");
    if (!button) return;
    restartQuiz();
  });

  if (quizResult) quizResult.hidden = true;
  renderStep();
}

function initCheckinFlow() {
  if (!checkinForm) return;

  checkinForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const field = checkinForm.querySelector("input");
    await processCheckin(field.value);
    field.select();
  });

  startScanButton?.addEventListener("click", startScanner);
  stopScanButton?.addEventListener("click", stopScanner);
}

function initAdminPanel() {
  if (!adminContentForm) return;

  adminContentForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(adminContentForm);
    const content = { ...DEFAULT_CONTENT };

    Object.keys(DEFAULT_CONTENT).forEach((key) => {
      const field = adminContentForm.elements.namedItem(key);
      if (field && !(field instanceof RadioNodeList) && field.type === "checkbox") {
        content[key] = field.checked ? "true" : "false";
        return;
      }
      const value = String(formData.get(key) || "").trim();
      content[key] = key === "heroSideSchedule" ? value.replace(/\n/g, "<br>") : value;
    });

    try {
      const saved = await api.saveContent(content);
      applyContent(saved);
      setAdminMessage("<strong>Контент обновлён.</strong><br>Изменения сохранены на сервере и доступны всем устройствам.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });

  adminResetButton?.addEventListener("click", async () => {
    try {
      const content = await api.resetContent();
      fillAdminContentForm(content);
      setAdminMessage("<strong>Контент сброшен.</strong><br>Исходные тексты восстановлены на сервере.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });

  adminRefreshButton?.addEventListener("click", async () => {
    try {
      await renderAdminStats();
      setAdminMessage("<strong>Статистика обновлена.</strong>", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });

  adminExportQuizButton?.addEventListener("click", async () => {
    try {
      await downloadFile("/api/export/quiz.csv", "quiz-results.csv");
      setAdminMessage("<strong>Экспорт готов.</strong><br>Файл с результатами теста скачан.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка экспорта.</strong><br>${error.message}`, "warn");
    }
  });

  adminExportTicketsButton?.addEventListener("click", async () => {
    try {
      await downloadFile("/api/export/tickets.csv", "tickets-report.csv");
      setAdminMessage("<strong>Экспорт готов.</strong><br>Файл со статистикой билетов скачан.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка экспорта.</strong><br>${error.message}`, "warn");
    }
  });

  adminExportTeamsButton?.addEventListener("click", async () => {
    try {
      await downloadFile("/api/export/teams.csv", "teams-applications.csv");
      setAdminMessage("<strong>Экспорт готов.</strong><br>Файл со списком команд скачан.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка экспорта.</strong><br>${error.message}`, "warn");
    }
  });

  adminResetTeamsButton?.addEventListener("click", async () => {
    try {
      await api.resetTeams();
      await renderAdminStats();
      setAdminMessage("<strong>Команды сброшены.</strong><br>Список заявок команд очищен.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка сброса.</strong><br>${error.message}`, "warn");
    }
  });

  adminResetTicketsButton?.addEventListener("click", async () => {
    try {
      await api.resetTickets();
      await renderAdminStats();
      setAdminMessage("<strong>Билеты сброшены.</strong><br>Продажи, проходы и голоса по билетам очищены.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка сброса.</strong><br>${error.message}`, "warn");
    }
  });

  adminResetQuizButton?.addEventListener("click", async () => {
    try {
      await api.resetQuiz();
      await renderAdminStats();
      setAdminMessage("<strong>Тест сброшен.</strong><br>История прохождений очищена.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка сброса.</strong><br>${error.message}`, "warn");
    }
  });

  adminUserForm?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(adminUserForm).entries());
    try {
      const user = await api.createUser(payload);
      adminUserForm.reset();
      setAdminUserMessage(`<strong>Пользователь создан.</strong><br>${user.username} получил роль «${user.role === "admin" ? "Администратор" : "Входной контроль"}».`, "ok");
      await renderAdminUsers();
    } catch (error) {
      setAdminUserMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });
}

function initAdminTabs() {
  if (!adminTabs.length || !adminTabPanels.length) return;

  adminTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const target = tab.dataset.tabTarget;
      adminTabs.forEach((item) => item.classList.toggle("admin-tab--active", item === tab));
      adminTabPanels.forEach((panel) => panel.classList.toggle("admin-tab-panel--active", panel.dataset.tabPanel === target));
    });
  });
}

function initProtectedModules() {
  if (protectedModulesInitialized) return;
  if (protectedRole === "admin") {
    initAdminTabs();
    initAdminPanel();
  }
  if (protectedRole === "checkin") initCheckinFlow();
  protectedModulesInitialized = true;
}

function initProtectedAuth() {
  if (!protectedRole || !authForm) return Promise.resolve(false);

  logoutButton?.addEventListener("click", async () => {
    try {
      await api.logout();
    } finally {
      if (scannerState.active) stopScanner();
      setProtectedVisibility(false);
      setAuthMessage("Сессия завершена. Введите пароль снова.", "ok");
    }
  });

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const formData = new FormData(authForm);
    const username = String(formData.get("username") || "").trim();
    const password = String(formData.get("password") || "");

    try {
      await api.login(protectedRole, username, password);
      setProtectedVisibility(true);
      setAuthMessage("Авторизация выполнена.", "ok");
      initProtectedModules();
      if (protectedRole === "admin") {
        const content = await api.getContent();
        fillAdminContentForm(content);
        await renderAdminStats();
        await renderAdminUsers();
      }
      if (protectedRole === "checkin") {
        await renderCheckinLog();
      }
      authForm.reset();
    } catch (error) {
      setProtectedVisibility(false);
      setAuthMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });

  return api.authStatus(protectedRole)
    .then(async (status) => {
      setProtectedVisibility(status.authenticated);
      if (status.authenticated) {
        initProtectedModules();
        if (protectedRole === "admin") {
          const content = await api.getContent();
          fillAdminContentForm(content);
          await renderAdminStats();
          await renderAdminUsers();
        }
        if (protectedRole === "checkin") {
          await renderCheckinLog();
        }
      }
      return status.authenticated;
    })
    .catch(() => {
      setProtectedVisibility(false);
      return false;
    });
}

async function init() {
  setProtectedVisibility(!protectedRole);
  initPelmenMiniGame();
  initGalleryCarousel();
  try {
    const content = await api.getContent();
    applyContent(content);
    if (adminContentForm) fillAdminContentForm(content);
  } catch (error) {
    applyContent(DEFAULT_CONTENT);
  }

  initTicketFlow();
  initTeamApplyFlow();
  initVoteFlow();
  initProgramPreview();
  initQuizFlow();
  const authenticated = await initProtectedAuth();
  if (!protectedRole || authenticated) initProtectedModules();

  const tasks = [];
  if (voteResults) tasks.push(renderVoteResults());
  if (logList && (!protectedRole || authenticated)) tasks.push(renderCheckinLog());
  if (adminStats.ticketsSold && (!protectedRole || authenticated)) tasks.push(renderAdminStats());
  await Promise.all(tasks);
}

init();

window.addEventListener("beforeunload", () => {
  if (scannerState.active) stopScanner();
  if (countdownTimerId) clearInterval(countdownTimerId);
});
