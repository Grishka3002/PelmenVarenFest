const TICKET_PRICE = 600;
const QR_ENDPOINT = "https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=";
const PELMEN_SESSION_KEY = "pelmen_game_seen_v1";
const STATIC_MAP = { lat: 43.174647, lon: 132.713618, zoom: 12 };
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
  dateMain: "Суббота, 18 июля 2026 года",
  dateNote: "Вход гостей с 11:00. Первая сцена запускается в 12:00.",
  placeLabel: "Место",
  placeMain: "Этнопарк «Берег Сварога», Владивосток",
  placeNote: "Лесная поляна, ремесленный двор, береговая сцена, фуд-корт и детская зона.",
  routeLabel: "Как добраться",
  routeMain: "Фестивальный шаттл от центра города каждые 40 минут.",
  routeNote: "Парковка ограничена, гостям рекомендуем трансфер или такси.",
  parkingNote: "Бесплатная парковка на 70 мест. Если хотите припарковаться у входа, приезжайте заранее.",
  mapLat: String(STATIC_MAP.lat),
  mapLon: String(STATIC_MAP.lon),
  mapZoom: String(STATIC_MAP.zoom),
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
  legalCard2Text1: "Покупатель заполняет форму заказа на сайте, указывает имя, e-mail, телефон и количество билетов, затем переходит на защищенную страницу оплаты Robokassa.",
  legalCard2Text2: "После успешной оплаты электронные билеты формируются автоматически и становятся доступны для скачивания на сайте.",
  legalCard3Title: "Оплата и оказание услуги",
  legalCard3Text1: "Оплата принимается банковской картой через платежный сервис Robokassa. Услуга считается оказанной после предоставления покупателю оплаченного электронного билета.",
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
const CONTENT_BINDINGS = {
  heroEyebrow: { id: "content-hero-eyebrow", html: false },
  heroTitle: { id: "content-hero-title", html: false },
  heroLead: { id: "content-hero-lead", html: false },
  heroSideLabel: { id: "content-hero-side-label", html: false },
  heroSideDate: { id: "content-hero-side-date", html: false },
  heroSideSchedule: { id: "content-hero-side-schedule", html: true },
  heroSideNote: { id: "content-hero-side-note", html: false },
  heroStat1Value: { id: "content-hero-stat1-value", html: false },
  heroStat1Text: { id: "content-hero-stat1-text", html: false },
  heroStat2Value: { id: "content-hero-stat2-value", html: false },
  heroStat2Text: { id: "content-hero-stat2-text", html: false },
  heroStat3Value: { id: "content-hero-stat3-value", html: false },
  heroStat3Text: { id: "content-hero-stat3-text", html: false },
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
  partnersEyebrow: { id: "content-partners-eyebrow", html: false },
  partnersTitle: { id: "content-partners-title", html: false },
  teamsEyebrow: { id: "content-teams-eyebrow", html: false },
  teamsTitle: { id: "content-teams-title", html: false },
  teamsLead: { id: "content-teams-lead", html: false },
  teamsApplyButton: { id: "content-teams-apply-button", html: false },
  teamsFormTitle: { id: "content-teams-form-title", html: false },
  teamsLeaderLabel: { id: "content-teams-leader-label", html: false },
  teamsNameLabel: { id: "content-teams-name-label", html: false },
  teamsOrganizationLabel: { id: "content-teams-organization-label", html: false },
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
  legalEyebrow: { id: "content-legal-eyebrow", html: false },
  legalTitle: { id: "content-legal-title", html: false },
  legalCard1Title: { id: "content-legal-card1-title", html: false },
  legalCard1Text1: { id: "content-legal-card1-text1", html: false },
  legalCard1Text2: { id: "content-legal-card1-text2", html: false },
  legalCard2Title: { id: "content-legal-card2-title", html: false },
  legalCard2Text1: { id: "content-legal-card2-text1", html: false },
  legalCard2Text2: { id: "content-legal-card2-text2", html: false },
  legalCard3Title: { id: "content-legal-card3-title", html: false },
  legalCard3Text1: { id: "content-legal-card3-text1", html: false },
  legalCard3Text2: { id: "content-legal-card3-text2", html: false },
  legalCard4Title: { id: "content-legal-card4-title", html: false },
  legalCard4Text1: { id: "content-legal-card4-text1", html: false },
  legalCard4Text2: { id: "content-legal-card4-text2", html: false },
  legalCard4Text3: { id: "content-legal-card4-text3", html: false },
  legalContactsTitle: { id: "content-legal-contacts-title", html: false },
  legalContactsPhoneLabel: { id: "content-legal-contacts-phone-label", html: false },
  legalContactsPhoneValue: { id: "content-legal-contacts-phone-value", html: false },
  legalContactsEmailLabel: { id: "content-legal-contacts-email-label", html: false },
  legalContactsEmailValue: { id: "content-legal-contacts-email-value", html: false },
  legalContactsSelfEmployedLabel: { id: "content-legal-contacts-self-employed-label", html: false },
  legalContactsSelfEmployedValue: { id: "content-legal-contacts-self-employed-value", html: false },
  legalContactsInnLabel: { id: "content-legal-contacts-inn-label", html: false },
  legalContactsInnValue: { id: "content-legal-contacts-inn-value", html: false },
  legalDocsTitle: { id: "content-legal-docs-title", html: false },
  legalDocsOfferText: { id: "content-legal-docs-offer-link", html: false },
  legalDocsRulesText: { id: "content-legal-docs-rules-link", html: false },
  legalDocsPrivacyText: { id: "content-legal-docs-privacy-link", html: false },
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
const paymentSummary = document.querySelector("#payment-summary");
const resultCard = document.querySelector("#ticket-result");
const ticketList = document.querySelector("#ticket-list");
const voteForm = document.querySelector("#vote-form");
const voteTeamGrid = document.querySelector("#vote-team-grid");
const voteMessage = document.querySelector("#vote-message");
const voteResults = document.querySelector("#vote-results");
const ticketCtaButtons = document.querySelectorAll("[data-ticket-cta]");
const programExpandButton = document.querySelector("#program-expand-button");
const quizForm = document.querySelector("#quiz-form");
const quizResult = document.querySelector("#quiz-result");
const quizProgress = document.querySelector("#quiz-progress");
const centerDisclaimer = document.querySelector("#center-disclaimer");
const teamRegisteredPopup = document.querySelector("#team-registered-popup");
const teamRegisteredPopupMessage = document.querySelector("#team-registered-popup-message");
const teamRegisteredPopupCaption = document.querySelector("#team-registered-popup-caption");
const teamRegisteredPopupLink = document.querySelector("#team-registered-popup-link");
const partnerPopup = document.querySelector("#partner-popup");
const partnerPopupLevel = document.querySelector("#partner-popup-level");
const partnerPopupTitle = document.querySelector("#partner-popup-title");
const partnerPopupLogo = document.querySelector("#partner-popup-logo");
const partnerPopupDescription = document.querySelector("#partner-popup-description");
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
const partnersCarousel = document.querySelector("#partners-carousel");
const partnersTrack = document.querySelector("#partners-track");

const adminContentForm = document.querySelector("#admin-content-form");
const adminMessage = document.querySelector("#admin-message");
const adminResetButton = document.querySelector("#admin-reset-content");
const adminRefreshButton = document.querySelector("#admin-refresh-stats");
const adminExportQuizButton = document.querySelector("#admin-export-quiz");
const adminExportTicketsButton = document.querySelector("#admin-export-tickets");
const adminExportTeamsButton = document.querySelector("#admin-export-teams");
const adminExportReserveTeamsButton = document.querySelector("#admin-export-reserve-teams");
const adminExportJuryScoresButton = document.querySelector("#admin-export-jury-scores");
const adminResetTeamsButton = document.querySelector("#admin-reset-teams");
const adminResetTicketsButton = document.querySelector("#admin-reset-tickets");
const adminResetQuizButton = document.querySelector("#admin-reset-quiz");
const adminResetJuryScoresButton = document.querySelector("#admin-reset-jury-scores");
const adminJurySummary = document.querySelector("#admin-jury-summary");
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
const juryScoreForm = document.querySelector("#jury-score-form");
const jurySaveButton = document.querySelector("#jury-save-button");
const juryMessage = document.querySelector("#jury-message");
const adminStats = {
  ticketsSold: document.querySelector("#stat-tickets-sold"),
  ticketsScanned: document.querySelector("#stat-tickets-scanned"),
  votesCast: document.querySelector("#stat-votes-cast"),
  quizTotal: document.querySelector("#stat-quiz-total"),
  teamsTotal: document.querySelector("#stat-teams-total"),
  teamsReserve: document.querySelector("#stat-teams-reserve"),
  juryScoresTotal: document.querySelector("#stat-jury-scores"),
  votesList: document.querySelector("#admin-vote-results"),
  quizList: document.querySelector("#admin-quiz-results"),
  recentTickets: document.querySelector("#admin-recent-tickets"),
};

let pendingOrder = null;
let lastCreatedOrderTickets = [];
let protectedModulesInitialized = false;
let countdownTimerId = null;
let centerDisclaimerTimerId = null;
let teamRegisteredPopupClickHandler = null;
let teamRegisteredPopupTimerId = null;
let galleryState = {
  index: 0,
  slides: [],
  dots: [],
  track: null,
};
let partnersState = {
  focusTimerId: null,
  focusCards: [],
  carousel: null,
  autoplayTimerId: null,
  resetTimerId: null,
  currentIndex: 0,
  mode: "",
  loopLength: 0,
  sourcePartners: [],
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
let juryState = {
  teams: [],
  criteria: [],
  scoreMap: new Map(),
  selectedTeam: "",
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
    if (stage < PELMEN_STAGE_TOTAL) {
      movePelmenMiniGameRandom(root);
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
  getOrder: async (orderId) => requestJson(`/api/orders/${encodeURIComponent(orderId)}`),
  confirmRobokassaSuccess: async (params) => {
    const search = new URLSearchParams(params);
    return requestJson(`/api/payments/robokassa/success?${search.toString()}`);
  },
  createTeamApplication: async (payload) => requestJson("/api/team-applications", { method: "POST", body: JSON.stringify(payload) }),
  checkin: async (code) => requestJson("/api/checkin", { method: "POST", body: JSON.stringify({ code }) }),
  vote: async (code, team) => requestJson("/api/vote", { method: "POST", body: JSON.stringify({ code, team }) }),
  recordQuiz: async (type) => requestJson("/api/quiz", { method: "POST", body: JSON.stringify({ type }) }),
  resetTickets: async () => requestJson("/api/reset/tickets", { method: "POST", body: JSON.stringify({}) }),
  resetQuiz: async () => requestJson("/api/reset/quiz", { method: "POST", body: JSON.stringify({}) }),
  resetTeams: async () => requestJson("/api/reset/teams", { method: "POST", body: JSON.stringify({}) }),
  resetJuryScores: async () => requestJson("/api/reset/jury-scores", { method: "POST", body: JSON.stringify({}) }),
  getPublicStats: async () => requestJson("/api/public-stats"),
  getStats: async () => (await requestJson("/api/stats")).stats,
  getUsers: async () => (await requestJson("/api/admin/users")).users,
  createUser: async (payload) => (await requestJson("/api/admin/users", { method: "POST", body: JSON.stringify(payload) })).user,
  updateUserPassword: async (userId, password) => (await requestJson(`/api/admin/users/${encodeURIComponent(userId)}/password`, { method: "PATCH", body: JSON.stringify({ password }) })).user,
  getJuryConfig: async () => requestJson("/api/jury/config"),
  saveJuryScores: async (scores) => requestJson("/api/jury/scores", { method: "POST", body: JSON.stringify({ scores }) }),
};

function buildQrUrl(ticket) {
  const payload = encodeURIComponent(`KOSTROVIE:${ticket.code}`);
  return `${QR_ENDPOINT}${payload}`;
}

function buildMapUrl() {
  const safeLat = STATIC_MAP.lat;
  const safeLon = STATIC_MAP.lon;
  const safeZoom = STATIC_MAP.zoom;
  const ll = encodeURIComponent(`${safeLon},${safeLat}`);
  const pt = encodeURIComponent(`${safeLon},${safeLat},pm2rdm`);
  return `https://yandex.ru/map-widget/v1/?ll=${ll}&z=${safeZoom}&l=map&pt=${pt}&lang=ru_RU`;
}

function isEnabled(value, fallback = true) {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value).trim().toLowerCase() === "true";
}

function parseMultilineList(value) {
  return String(value || "")
    .split(/\r?\n|;/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getVotingTeams(content) {
  const teams = [];
  for (let index = 1; index <= 20; index += 1) {
    const name = String(content[`team${index}Name`] || "").trim();
    teams.push({
      name: name || `Команда ${index}`,
      desc: String(content[`team${index}Desc`] || "").trim(),
    });
  }
  return teams;
}

function getPartners(content) {
  const partners = [];
  for (let index = 1; index <= 10; index += 1) {
    const name = String(content[`partner${index}Name`] || "").trim();
    const level = String(content[`partner${index}Level`] || "").trim();
    const description = String(content[`partner${index}Description`] || "").trim();
    const logo = sanitizeAssetPath(content[`partner${index}Logo`]);
    if (!name && !level && !description && !logo) continue;
    partners.push({ name, level, description, logo });
  }
  return partners;
}

function buildPartnerInitials(name) {
  const words = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2);
  if (!words.length) return "PV";
  return words.map((word) => word[0]?.toUpperCase() || "").join("");
}

function buildPartnerCard(partner, duplicate = false) {
  const card = document.createElement("button");
  card.className = "partner-card";
  card.type = "button";
  if (duplicate) card.setAttribute("aria-hidden", "true");

  const logo = document.createElement("div");
  logo.className = "partner-card__logo";
  if (partner.logo) {
    const image = document.createElement("img");
    image.src = partner.logo;
    image.alt = partner.name ? `Логотип ${partner.name}` : "Логотип партнёра";
    image.loading = "lazy";
    logo.appendChild(image);
  } else {
    const fallback = document.createElement("span");
    fallback.className = "partner-card__logo-fallback";
    fallback.textContent = buildPartnerInitials(partner.name);
    logo.appendChild(fallback);
  }

  const content = document.createElement("div");
  content.className = "partner-card__content";

  if (partner.level) {
    const level = document.createElement("p");
    level.className = "partner-card__level";
    level.textContent = partner.level;
    content.appendChild(level);
  }

  const title = document.createElement("h3");
  title.textContent = partner.name || "Партнёр фестиваля";
  content.appendChild(title);

  card.append(logo, content);
  return card;
}

function stopPartnerFocusTracking() {
  if (partnersState.focusTimerId) {
    clearInterval(partnersState.focusTimerId);
    partnersState.focusTimerId = null;
  }
}

function stopPartnerAutoplay() {
  if (partnersState.autoplayTimerId) {
    clearInterval(partnersState.autoplayTimerId);
    partnersState.autoplayTimerId = null;
  }
}

function stopPartnerResetTimer() {
  if (partnersState.resetTimerId) {
    clearTimeout(partnersState.resetTimerId);
    partnersState.resetTimerId = null;
  }
}

function updatePartnerFocus() {
  if (!partnersState.carousel || !partnersState.focusCards.length) return;
  if (partnersState.mode === "slider") {
    partnersState.focusCards.forEach((card, index) => {
      card.classList.toggle("partner-card--active", index === partnersState.currentIndex);
    });
    return;
  }
  const carouselRect = partnersState.carousel.getBoundingClientRect();
  const centerX = carouselRect.left + carouselRect.width / 2;
  let closestCard = null;
  let minDistance = Number.POSITIVE_INFINITY;

  partnersState.focusCards.forEach((card) => {
    const rect = card.getBoundingClientRect();
    const distance = Math.abs(rect.left + rect.width / 2 - centerX);
    if (distance < minDistance) {
      minDistance = distance;
      closestCard = card;
    }
  });

  partnersState.focusCards.forEach((card) => {
    card.classList.toggle("partner-card--active", card === closestCard);
  });
}

function centerPartnerCard(index, smooth = true) {
  if (!partnersState.carousel || !partnersState.focusCards.length) return;
  const total = partnersState.focusCards.length;
  const safeIndex = ((index % total) + total) % total;
  const card = partnersState.focusCards[safeIndex];
  if (!card) return;
  partnersState.currentIndex = safeIndex;
  const targetLeft = Math.max(0, card.offsetLeft - ((partnersState.carousel.clientWidth - card.offsetWidth) / 2));
  partnersState.carousel.scrollTo({
    left: targetLeft,
    behavior: smooth ? "smooth" : "auto",
  });
  updatePartnerFocus();
}

function openPartnerPopup(partner) {
  if (!partnerPopup || !partner) return;
  if (partnerPopupLevel) partnerPopupLevel.textContent = partner.level || "";
  if (partnerPopupTitle) partnerPopupTitle.textContent = partner.name || "Партнёр фестиваля";
  if (partnerPopupDescription) partnerPopupDescription.textContent = partner.description || "Описание скоро появится.";
  if (partnerPopupLogo) {
    partnerPopupLogo.innerHTML = "";
    if (partner.logo) {
      const image = document.createElement("img");
      image.src = partner.logo;
      image.alt = partner.name ? `Логотип ${partner.name}` : "Логотип партнёра";
      image.loading = "lazy";
      partnerPopupLogo.appendChild(image);
    } else {
      const fallback = document.createElement("span");
      fallback.className = "partner-card__logo-fallback";
      fallback.textContent = buildPartnerInitials(partner.name);
      partnerPopupLogo.appendChild(fallback);
    }
  }
  partnerPopup.hidden = false;
}

function closePartnerPopup() {
  if (partnerPopup) partnerPopup.hidden = true;
}

function normalizePartnerLoopPosition() {
  stopPartnerResetTimer();
  if (partnersState.mode !== "slider" || !partnersState.loopLength) return;
  const loopStart = partnersState.loopLength;
  const loopEnd = partnersState.loopLength * 2;
  if (partnersState.currentIndex < loopEnd) return;
  partnersState.resetTimerId = window.setTimeout(() => {
    partnersState.currentIndex -= partnersState.loopLength;
    centerPartnerCard(partnersState.currentIndex, false);
  }, 900);
}

function startPartnerAutoplay() {
  stopPartnerAutoplay();
  if (partnersState.mode !== "slider" || partnersState.focusCards.length <= 1) return;
  partnersState.autoplayTimerId = window.setInterval(() => {
    centerPartnerCard(partnersState.currentIndex + 1, true);
    normalizePartnerLoopPosition();
  }, 6000);
}

function schedulePartnerAutoplayResume() {
  stopPartnerAutoplay();
  window.setTimeout(() => {
    if (partnersState.mode === "slider" && !partnerPopup?.hidden) return;
    startPartnerAutoplay();
  }, 7000);
}

function bindPartnerCardClicks() {
  if (!partnersState.focusCards.length) return;
  partnersState.focusCards.forEach((card, index) => {
    const realIndex = Number(card.dataset.partnerRealIndex || 0);
    card.addEventListener("click", () => {
      stopPartnerAutoplay();
      stopPartnerResetTimer();
      if (partnersState.currentIndex === index) {
        openPartnerPopup(partnersState.sourcePartners[realIndex]);
        return;
      }
      closePartnerPopup();
      centerPartnerCard(index, true);
      normalizePartnerLoopPosition();
      schedulePartnerAutoplayResume();
    });
  });
}

function renderPartners(content) {
  if (!partnersCarousel || !partnersTrack) return;
  stopPartnerFocusTracking();
  stopPartnerAutoplay();
  stopPartnerResetTimer();
  partnersTrack.innerHTML = "";
  partnersCarousel.classList.remove("partners-carousel--slider", "partners-carousel--static");
  partnersTrack.classList.remove("partners-track--slider", "partners-track--static");
  partnersTrack.style.removeProperty("--partners-duration");
  partnersState.focusCards = [];
  partnersState.carousel = partnersCarousel;
  partnersState.currentIndex = 0;
  partnersState.mode = "";
  partnersState.loopLength = 0;
  partnersState.sourcePartners = [];

  const section = document.querySelector("#partners");
  const navLink = document.querySelector('[data-nav-key="partners"]');
  const partners = getPartners(content);
  const shouldShow = isEnabled(content.showPartners, true) && partners.length > 0;
  if (section) section.hidden = !shouldShow;
  if (navLink) navLink.hidden = !shouldShow;
  if (!shouldShow) return;
  partnersState.sourcePartners = partners;

  if (partners.length <= 5) {
    partnersState.mode = "static";
    partnersCarousel.classList.add("partners-carousel--static");
    partnersTrack.classList.add("partners-track--static");
    partners.forEach((partner, index) => {
      const card = buildPartnerCard(partner);
      card.dataset.partnerRealIndex = String(index);
      partnersTrack.appendChild(card);
    });
    partnersState.focusCards = Array.from(partnersTrack.querySelectorAll(".partner-card"));
    bindPartnerCardClicks();
    updatePartnerFocus();
    if (partnersState.focusCards.length > 1) {
      partnersState.focusTimerId = window.setInterval(updatePartnerFocus, 220);
    }
    return;
  }

  partnersState.mode = "slider";
  partnersState.loopLength = partners.length;
  partnersCarousel.classList.add("partners-carousel--slider");
  partnersTrack.classList.add("partners-track--slider");
  const allPartners = [...partners, ...partners, ...partners];
  allPartners.forEach((partner, index) => {
    const card = buildPartnerCard(partner, index < partners.length || index >= partners.length * 2);
    card.dataset.partnerRealIndex = String(index % partners.length);
    partnersTrack.appendChild(card);
  });
  partnersState.focusCards = Array.from(partnersTrack.querySelectorAll(".partner-card"));
  bindPartnerCardClicks();
  window.requestAnimationFrame(() => {
    centerPartnerCard(partners.length, false);
    startPartnerAutoplay();
  });
}

function renderVoteTeamCards(content) {
  if (!voteTeamGrid) return;
  const selectedTeam = voteForm?.querySelector('input[name="team"]:checked')?.value || "";
  const teams = getVotingTeams(content);
  const fullResults = buildVoteResultsForAllTeams(window.__voteResults || [], content);
  const voteMap = new Map(fullResults.map((item) => [item.team, Number(item.votes || 0)]));
  voteTeamGrid.innerHTML = teams.map((team, index) => `
    <label class="team-card team-card--scroll">
      <input type="radio" name="team" value="${team.name}" ${index === 0 ? "required" : ""} ${selectedTeam === team.name ? "checked" : ""}>
      <span>${team.name}</span>
      <small>${team.desc || "Без описания"}</small>
      <em class="team-card__votes">${Number(voteMap.get(team.name) || 0)} голосов</em>
    </label>
  `).join("");
}

function buildVoteResultsForAllTeams(rawVoteResults, content) {
  const teams = getVotingTeams(content);
  const voteMap = new Map(
    (Array.isArray(rawVoteResults) ? rawVoteResults : [])
      .map((item) => [String(item.team || "").trim(), Number(item.votes || 0)]),
  );
  return teams.map((team) => ({
    team: team.name,
    votes: voteMap.get(team.name) || 0,
  }));
}

function getRoleTitle(role) {
  if (role === "admin") return "Администратор";
  if (role === "checkin") return "Входной контроль";
  if (role === "jury") return "Жюри";
  return role;
}

function applySectionVisibility(content) {
  const visibility = {
    countdown: isEnabled(content.showCountdown, true),
    about: isEnabled(content.showAbout, true),
    location: isEnabled(content.showLocation, true),
    program: isEnabled(content.showProgram, true),
    gallery: isEnabled(content.showGallery, true),
    jury: isEnabled(content.showJury, true),
    partners: isEnabled(content.showPartners, true),
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

function normalizeExternalUrl(rawUrl) {
  const value = String(rawUrl || "").trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value.replace(/^\/+/, "")}`;
}

function openExternalUrl(rawUrl) {
  const normalizedUrl = normalizeExternalUrl(rawUrl);
  if (!normalizedUrl) return false;
  const popup = window.open(normalizedUrl, "_blank", "noopener,noreferrer");
  return Boolean(popup);
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

function showCenterDisclaimer(message, duration = 5000) {
  if (!centerDisclaimer) return;
  if (centerDisclaimerTimerId) {
    clearTimeout(centerDisclaimerTimerId);
    centerDisclaimerTimerId = null;
  }
  const text = String(message || "").trim();
  if (!text) return;
  centerDisclaimer.innerHTML = "";
  const textNode = document.createElement("p");
  textNode.className = "center-disclaimer__text";
  textNode.textContent = text;
  centerDisclaimer.appendChild(textNode);

  const content = window.__appContent || DEFAULT_CONTENT;
  const ctaText = String(content.ticketsClosedCtaText || DEFAULT_CONTENT.ticketsClosedCtaText).trim();
  const ctaUrl = normalizeExternalUrl(content.ticketsClosedCtaUrl || DEFAULT_CONTENT.ticketsClosedCtaUrl);
  if (ctaText && ctaUrl && text === String(content.ticketsClosedDisclaimer || DEFAULT_CONTENT.ticketsClosedDisclaimer).trim()) {
    const link = document.createElement("a");
    link.className = "button";
    link.href = ctaUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    link.textContent = ctaText;
    link.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      openExternalUrl(ctaUrl);
    });
    centerDisclaimer.appendChild(link);
  }
  centerDisclaimer.hidden = false;
  centerDisclaimer.classList.add("center-disclaimer--visible");
  centerDisclaimerTimerId = window.setTimeout(() => {
    centerDisclaimer.classList.remove("center-disclaimer--visible");
    centerDisclaimer.hidden = true;
  }, duration);
}

function hideTeamRegisteredPopup() {
  if (!teamRegisteredPopup) return;
  teamRegisteredPopup.hidden = true;
  if (teamRegisteredPopupTimerId) {
    clearTimeout(teamRegisteredPopupTimerId);
    teamRegisteredPopupTimerId = null;
  }
  if (teamRegisteredPopupClickHandler) {
    document.removeEventListener("click", teamRegisteredPopupClickHandler, true);
    teamRegisteredPopupClickHandler = null;
  }
}

function showTeamRegisteredPopup(content) {
  if (!teamRegisteredPopup || !teamRegisteredPopupMessage || !teamRegisteredPopupLink) return;
  const message = String(content.teamsRegisteredPopupMessage || DEFAULT_CONTENT.teamsRegisteredPopupMessage).trim();
  const caption = String(content.teamsRegisteredPopupCaption || DEFAULT_CONTENT.teamsRegisteredPopupCaption).trim();
  const linkText = String(content.teamsRegisteredPopupLinkText || DEFAULT_CONTENT.teamsRegisteredPopupLinkText).trim();
  const linkUrl = normalizeExternalUrl(content.teamsRegisteredPopupLinkUrl || DEFAULT_CONTENT.teamsRegisteredPopupLinkUrl);

  teamRegisteredPopupMessage.textContent = message;
  if (teamRegisteredPopupCaption) {
    teamRegisteredPopupCaption.textContent = caption;
    teamRegisteredPopupCaption.hidden = !caption;
  }
  teamRegisteredPopupLink.textContent = linkText || DEFAULT_CONTENT.teamsRegisteredPopupLinkText;
  if (linkUrl) {
    teamRegisteredPopupLink.href = linkUrl;
    teamRegisteredPopupLink.onclick = (event) => {
      event.preventDefault();
      event.stopPropagation();
      openExternalUrl(linkUrl);
      window.setTimeout(() => hideTeamRegisteredPopup(), 120);
    };
    teamRegisteredPopupLink.hidden = false;
  } else {
    teamRegisteredPopupLink.onclick = null;
    teamRegisteredPopupLink.hidden = true;
  }

  teamRegisteredPopup.hidden = false;

  if (teamRegisteredPopupClickHandler) {
    document.removeEventListener("click", teamRegisteredPopupClickHandler, true);
  }
  teamRegisteredPopupClickHandler = (event) => {
    const target = event?.target;
    if (target instanceof Element && target.closest("#team-registered-popup-link")) {
      window.setTimeout(() => hideTeamRegisteredPopup(), 120);
      return;
    }
    hideTeamRegisteredPopup();
  };
  window.setTimeout(() => {
    if (teamRegisteredPopup.hidden) return;
    document.addEventListener("click", teamRegisteredPopupClickHandler, true);
  }, 0);

  teamRegisteredPopupTimerId = window.setTimeout(() => {
    hideTeamRegisteredPopup();
  }, 20000);
}

function initTeamApplyFlow() {
  if (!teamApplyToggle || !teamApplyPanel || !teamApplyForm) return;

  teamApplyToggle.addEventListener("click", () => {
    const content = window.__appContent || DEFAULT_CONTENT;
    showCenterDisclaimer(content.teamsApplyDisclaimer || DEFAULT_CONTENT.teamsApplyDisclaimer, 5000);
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
      teamName: String(formData.get("teamName") || "").trim(),
      organization: String(formData.get("organization") || "").trim(),
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
      const response = await api.createTeamApplication(payload);
      const content = window.__appContent || DEFAULT_CONTENT;
      const successText = response.status === "reserve"
        ? String(content.teamsReserveMessage || DEFAULT_CONTENT.teamsReserveMessage)
        : String(content.teamsSuccessMessage || DEFAULT_CONTENT.teamsSuccessMessage);
      setTeamApplyMessage(successText, "ok");
      teamApplyForm.reset();
      showTeamRegisteredPopup(content);
    } catch (error) {
      setTeamApplyMessage(error.message || "Не удалось отправить заявку. Попробуйте ещё раз.", "warn");
    }
  });
}

function initTicketCtaGuard() {
  if (!ticketCtaButtons.length) return;
  ticketCtaButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const content = window.__appContent || DEFAULT_CONTENT;
      if (isEnabled(content.showTickets, true)) return;
      event.preventDefault();
      showCenterDisclaimer(content.ticketsClosedDisclaimer || DEFAULT_CONTENT.ticketsClosedDisclaimer, 5000);
    });
  });
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
    ${order.email}<br>
    После подтверждения вы перейдете на страницу тестовой оплаты Robokassa.
  `;
}

async function restorePaidOrderFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const orderId = String(params.get("Shp_orderId") || params.get("order") || "").trim();
  const paymentState = String(params.get("payment") || "").trim();
  const paymentFailedByHash = window.location.hash === "#payment-failed";
  const robokassaInvId = String(params.get("InvId") || "").trim();
  const robokassaOutSum = String(params.get("OutSum") || "").trim();
  const robokassaSignature = String(params.get("SignatureValue") || "").trim();

  if (!orderId) {
    if (paymentState === "failed" || paymentFailedByHash) {
      ticketForm.hidden = true;
      paymentForm.hidden = false;
      resultCard.hidden = true;
      renderPaymentSummary({
        name: "Оплата не завершена",
        quantity: 1,
        email: "Robokassa вернула пользователя без подтверждения оплаты.",
      });
      setStep("payment");
      if (paymentFailedByHash) {
        window.history.replaceState({}, "", window.location.pathname + window.location.search);
      }
    }
    return;
  }

  ticketForm.hidden = true;
  paymentForm.hidden = false;
  resultCard.hidden = true;
  renderPaymentSummary({
    name: "Проверяем оплату",
    quantity: 1,
    email: "Ожидаем подтверждение Robokassa и выдачу билетов.",
  });
  setStep("payment");

  if (robokassaInvId && robokassaOutSum && robokassaSignature) {
    try {
      const response = await api.confirmRobokassaSuccess({
        InvId: robokassaInvId,
        OutSum: robokassaOutSum,
        SignatureValue: robokassaSignature,
        Shp_orderId: orderId,
      });
      if (response.order?.status === "paid" && Array.isArray(response.tickets) && response.tickets.length) {
        lastCreatedOrderTickets = response.tickets;
        renderOrderTickets(lastCreatedOrderTickets);
        paymentForm.hidden = true;
        ticketForm.hidden = false;
        ticketForm.reset();
        pendingOrder = null;
        const paramsToClear = ["Shp_orderId", "payment", "InvId", "OutSum", "SignatureValue"];
        paramsToClear.forEach((key) => params.delete(key));
        const nextQuery = params.toString();
        window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
        return;
      }
    } catch (error) {
      // fallback to polling below
    }
  }

  const startedAt = Date.now();
  while (Date.now() - startedAt < 20000) {
    try {
      const response = await api.getOrder(orderId);
      if (response.order?.status === "paid" && Array.isArray(response.tickets) && response.tickets.length) {
        lastCreatedOrderTickets = response.tickets;
        renderOrderTickets(lastCreatedOrderTickets);
        paymentForm.hidden = true;
        ticketForm.hidden = false;
        ticketForm.reset();
        pendingOrder = null;
        await renderVoteResults();
        const paramsToClear = ["Shp_orderId", "payment", "InvId", "OutSum", "SignatureValue"];
        paramsToClear.forEach((key) => params.delete(key));
        const nextQuery = params.toString();
        window.history.replaceState({}, "", `${window.location.pathname}${nextQuery ? `?${nextQuery}` : ""}`);
        return;
      }
    } catch (error) {
      // keep polling until timeout
    }
    await new Promise((resolve) => window.setTimeout(resolve, 1500));
  }

  renderPaymentSummary({
    name: "Оплата обрабатывается",
    quantity: 1,
    email: "Robokassa еще не прислала подтверждение. Обновите страницу через несколько секунд.",
  });
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
  [
    ["#content-legal-docs-offer-link", merged.legalDocsOfferUrl],
    ["#content-legal-docs-rules-link", merged.legalDocsRulesUrl],
    ["#content-legal-docs-privacy-link", merged.legalDocsPrivacyUrl],
  ].forEach(([selector, href]) => {
    const link = document.querySelector(selector);
    if (!link) return;
    const normalizedHref = String(href || "").trim();
    if (normalizedHref) {
      link.setAttribute("href", normalizedHref);
      link.removeAttribute("aria-disabled");
    } else {
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
    }
  });
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
  if (mapFrame) {
    const mapUrl = buildMapUrl();
    const mapVersion = encodeURIComponent(`${STATIC_MAP.lat}|${STATIC_MAP.lon}|${STATIC_MAP.zoom}`);
    mapFrame.src = `${mapUrl}&v=${mapVersion}`;
  }
  applySectionVisibility(merged);
  applyGalleryImages(merged);
  applyJuryPhotos(merged);
  renderPartners(merged);
  renderVoteTeamCards(merged);
  startCountdown(merged);
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
  const content = window.__appContent || DEFAULT_CONTENT;
  const fullResults = buildVoteResultsForAllTeams(payload.voteResults, content);
  window.__voteResults = fullResults;
  renderVoteTeamCards(content);
  voteResults.innerHTML = fullResults
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
  if (adminStats.teamsReserve) adminStats.teamsReserve.textContent = String(stats.teamsReserveTotal || 0);
  if (adminStats.juryScoresTotal) adminStats.juryScoresTotal.textContent = String(stats.juryScoresTotal || 0);

  if (adminStats.votesList) {
    const content = window.__appContent || DEFAULT_CONTENT;
    const fullResults = buildVoteResultsForAllTeams(stats.voteResults, content);
    adminStats.votesList.innerHTML = fullResults
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

  renderAdminJurySummary(stats);
}

function renderAdminJurySummary(stats) {
  if (!adminJurySummary) return;
  const teamRows = Array.isArray(stats.juryTeamTotals) ? stats.juryTeamTotals : [];
  const criterionRows = Array.isArray(stats.juryCriterionTotals) ? stats.juryCriterionTotals : [];

  if (!teamRows.length || !criterionRows.length) {
    adminJurySummary.innerHTML = "<p class=\"muted\">Пока нет оценок жюри. Команды берутся автоматически из вкладки «Голосование».</p>";
    return;
  }

  const teamTableRows = teamRows
    .map((row) => {
      const byCriterion = (row.byCriterion || []).map((item) => `${item.criterion}: ${item.total}`).join(" • ");
      return `<tr><td>${row.team}</td><td>${row.total}</td><td>${byCriterion || "—"}</td></tr>`;
    })
    .join("");

  const criterionTableRows = criterionRows
    .map((row) => `<tr><td>${row.criterion}</td><td>${row.total}</td></tr>`)
    .join("");

  adminJurySummary.innerHTML = `
    <p class="muted">Выставлено оценок: <strong>${Number(stats.juryScoresTotal || 0)}</strong>. Судей с заполненными оценками: <strong>${Number(stats.juryJudgesTotal || 0)}</strong>.</p>
    <table>
      <thead>
        <tr><th>Команда</th><th>Сумма баллов</th><th>По критериям</th></tr>
      </thead>
      <tbody>${teamTableRows}</tbody>
    </table>
    <table>
      <thead>
        <tr><th>Критерий</th><th>Сумма баллов</th></tr>
      </thead>
      <tbody>${criterionTableRows}</tbody>
    </table>
  `;
}

function setJuryMessage(message, mode = "") {
  if (!juryMessage) return;
  juryMessage.className = `info-message ${mode ? `checkin-result--${mode}` : ""}`.trim();
  juryMessage.innerHTML = message;
}

function renderJuryScoreForm() {
  if (!juryScoreForm) return;
  const { teams, criteria, scoreMap, selectedTeam } = juryState;
  if (!teams.length || !criteria.length) {
    juryScoreForm.innerHTML = "<p class=\"muted\">Администратор ещё не настроил список команд и критериев.</p>";
    return;
  }

  const options = Array.from({ length: 10 }, (_, idx) => idx + 1)
    .map((value) => `<option value="${value}">${value}</option>`)
    .join("");

  const selected = selectedTeam || teams[0];
  const rows = criteria.map((criterion, index) => {
    const key = `${selected}::${criterion}`;
    const current = scoreMap.get(key) || "";
    return `
      <label class="jury-score-row">
        <span>${criterion}</span>
        <select data-criterion="${criterion}" name="jury-criterion-${index}" required>
          <option value="">Оценка</option>
          ${options.replace(`value="${current}"`, `value="${current}" selected`)}
        </select>
      </label>
    `;
  }).join("");

  juryScoreForm.innerHTML = `
    <label class="jury-score-row">
      <span>Команда</span>
      <select id="jury-team-select">
        ${teams.map((team) => `<option value="${team}" ${team === selected ? "selected" : ""}>${team}</option>`).join("")}
      </select>
    </label>
    <article class="jury-team-card">
      <h3>${selected}</h3>
      ${rows}
    </article>
  `;
}

function initJuryFlow() {
  if (!juryScoreForm || !jurySaveButton) return;

  const load = async () => {
    const config = await api.getJuryConfig();
    let teams = Array.isArray(config.teams) ? config.teams : [];
    let criteria = Array.isArray(config.criteria) ? config.criteria : [];
    if (!teams.length) {
      const content = await api.getContent();
      teams = getVotingTeams(content).map((item) => item.name);
    }
    if (!criteria.length) {
      criteria = parseMultilineList(DEFAULT_CONTENT.juryScoringCriteria);
    }
    const scoreMap = new Map((Array.isArray(config.myScores) ? config.myScores : [])
      .map((item) => [`${item.teamName}::${item.criterionName}`, String(item.score)]));
    juryState = {
      teams,
      criteria,
      scoreMap,
      selectedTeam: teams[0] || "",
    };
    renderJuryScoreForm();
  };

  juryScoreForm.addEventListener("change", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLSelectElement)) return;
    if (target.id === "jury-team-select") {
      juryState.selectedTeam = target.value;
      renderJuryScoreForm();
      return;
    }
    if (!target.dataset.criterion || !juryState.selectedTeam) return;
    juryState.scoreMap.set(`${juryState.selectedTeam}::${target.dataset.criterion}`, target.value);
  });

  jurySaveButton.addEventListener("click", async () => {
    if (!juryState.teams.length || !juryState.criteria.length) {
      setJuryMessage("<strong>Нечего сохранять.</strong><br>Администратор ещё не настроил команды и критерии.", "warn");
      return;
    }

    const selectedTeam = juryState.selectedTeam || juryState.teams[0];
    for (const criterion of juryState.criteria) {
      const raw = juryState.scoreMap.get(`${selectedTeam}::${criterion}`) || "";
      const score = Number(raw);
      if (!Number.isInteger(score) || score < 1 || score > 10) {
        setJuryMessage("<strong>Заполните все оценки выбранной команды.</strong><br>Для каждого критерия выберите число от 1 до 10.", "warn");
        const field = juryScoreForm.querySelector(`select[data-criterion="${criterion}"]`);
        if (field instanceof HTMLElement) field.focus();
        return;
      }
    }

    const scores = Array.from(juryState.scoreMap.entries())
      .map(([key, value]) => {
        const delimiter = key.indexOf("::");
        return {
          teamName: key.slice(0, delimiter),
          criterionName: key.slice(delimiter + 2),
          score: Number(value),
        };
      })
      .filter((item) => Number.isInteger(item.score) && item.score >= 1 && item.score <= 10);

    try {
      await api.saveJuryScores(scores);
      setJuryMessage("<strong>Оценки сохранены.</strong><br>Вы можете изменить их позже и сохранить снова.", "ok");
    } catch (error) {
      setJuryMessage(`<strong>Ошибка.</strong><br>${error.message}`, "warn");
    }
  });

  void load()
    .then(() => setJuryMessage("Оценки выставляются по шкале от 1 до 10.", ""))
    .catch((error) => setJuryMessage(`<strong>Ошибка загрузки.</strong><br>${error.message}`, "warn"));
}

async function renderAdminUsers() {
  if (!adminUsersList) return;
  const users = await api.getUsers();

  adminUsersList.innerHTML = users.length
    ? users.map((user) => `
      <article class="admin-user-card">
        <div class="admin-user-card__header">
          <div>
            <p class="eyebrow">${getRoleTitle(user.role)}</p>
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

  ticketForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    pendingOrder = Object.fromEntries(new FormData(ticketForm).entries());
    resultCard.hidden = true;

    try {
      const submitButton = ticketForm.querySelector('button[type="submit"]');
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.textContent = "Переходим в Robokassa";
        submitButton.disabled = true;
      }
      const response = await api.createOrder({ ...pendingOrder });
      window.location.href = response.paymentUrl;
    } catch (error) {
      paymentForm.hidden = false;
      ticketForm.hidden = true;
      renderPaymentSummary({
        name: "Ошибка оплаты",
        quantity: pendingOrder?.quantity || 1,
        email: error.message,
      });
      setStep("payment");
      const submitButton = ticketForm.querySelector('button[type="submit"]');
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.textContent = "Перейти к оплате";
        submitButton.disabled = false;
      }
    }
  });

  backToOrderButton?.addEventListener("click", () => {
    paymentForm.hidden = true;
    ticketForm.hidden = false;
    resultCard.hidden = true;
    setStep("order");
  });

  restorePaidOrderFromQuery();
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

  adminExportReserveTeamsButton?.addEventListener("click", async () => {
    try {
      await downloadFile("/api/export/teams-reserve.csv", "teams-reserve.csv");
      setAdminMessage("<strong>Экспорт готов.</strong><br>Файл с резервом команд скачан.", "ok");
    } catch (error) {
      setAdminMessage(`<strong>Ошибка экспорта.</strong><br>${error.message}`, "warn");
    }
  });

  adminExportJuryScoresButton?.addEventListener("click", async () => {
    try {
      await downloadFile("/api/export/jury-scores.xlsx", "jury-scores.xlsx");
      setAdminMessage("<strong>Экспорт готов.</strong><br>Скачан Excel-файл с листами `Scores` и `Summary`.", "ok");
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

  adminResetJuryScoresButton?.addEventListener("click", async () => {
    try {
      await api.resetJuryScores();
      await renderAdminStats();
      setAdminMessage("<strong>Баллы жюри сброшены.</strong><br>Все оценки удалены.", "ok");
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
      setAdminUserMessage(`<strong>Пользователь создан.</strong><br>${user.username} получил роль «${getRoleTitle(user.role)}».`, "ok");
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
  if (protectedRole === "jury") initJuryFlow();
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
      if (protectedRole === "jury") {
        setJuryMessage("Оценки выставляются по шкале от 1 до 10.");
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
        if (protectedRole === "jury") {
          setJuryMessage("Оценки выставляются по шкале от 1 до 10.");
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
  hideTeamRegisteredPopup();
  if (partnerPopup) {
    partnerPopup.addEventListener("click", (event) => {
      if (event.target === partnerPopup) {
        closePartnerPopup();
        if (partnersState.mode === "slider") startPartnerAutoplay();
      }
    });
  }
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
  initTicketCtaGuard();
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
