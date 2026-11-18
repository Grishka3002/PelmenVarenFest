const fs = require('node:fs');
const path = require('node:path');
const defaults = {
  revision: 0,
  title: 'Пельмень Варень — приморский фестиваль пельменей и вареников',
  description: 'Гастрофестиваль «Пельмень Варень» в Приморье: как прошёл первый фестиваль в 2026 году и что известно о новом сезоне. Билеты продаются только на площадке.',
  heading: 'Приморский фестиваль пельменей и вареников',
  lead: 'Команды лепят и варят на костре, гости пробуют, жюри выбирает лучших. Первый фестиваль прошёл 16 мая 2026 года в Лукьяновке у подножия Пидана. Сейчас готовим новый сезон: дату и место объявим здесь.',
  sections: [
    {id:'about', title:'О фестивале', text:'«Пельмень Варень» — праздник домашней кухни под открытым небом. Команды из Приморья — семьи, друзья, коллеги, кафе — привозят свои рецепты и готовят пельмени и вареники прямо на поляне, в котлах на костре. Гости пробуют, болеют за команды, играют на станциях, слушают концерт и гуляют по ярмарке.\n\nВ новом сезоне сохраняем идею первого фестиваля, а программу и организацию обновляем.'},
    {id:'program', title:'Новый сезон', text:'Дата — [дата]. Место проведения — [место]. Программа нового сезона формируется.'},
    {id:'past', title:'Как это было в 2026', text:'Первый Приморский гастрофестиваль «Пельмень Варень» прошёл 16 мая 2026 года в деревне Лукьяновке Шкотовского района, на территории центра активного отдыха «Подножие Пидана». Команды соревновались в шести номинациях, гости пробовали пельмени и вареники, играли на станциях и фотографировались в двух фотозонах.\n\nФотоотчёт фестиваля — ниже. Все материалы доступны в альбоме на Яндекс Диске.'},
    {id:'visit', title:'Информация гостям', text:'Билеты будут продаваться только на площадке фестиваля. Дату, адрес, стоимость входа, способы оплаты и возрастные условия объявим отдельно.'}
  ],
  // Прошлый фестиваль: по положению 2026 и материалам оргкомитета.
  archive: {
    facts: [
      {value:'16 мая 2026', text:'первый фестиваль в Лукьяновке, у подножия Пидана'},
      {value:'6 номинаций', text:'от классического пельменя до скоростной лепки'},
      {value:'5 человек', text:'в каждой команде. Участие для команд бесплатное'}
    ],
    photo: {src:'/images/season/festival-2026.webp', alt:'Участники и организаторы у баннера «Пельмень Варень» на поляне фестиваля', caption:'Команды и организаторы у баннера фестиваля, 16 мая 2026'},
    gallery: [
      {src:'/images/report-2026/IMG_3132.jpg', alt:'Баннер «Пельмень Варень» на лесной поляне'},
      {src:'/images/report-2026/B62A3284.jpg', alt:'Пельмени с маслом в подносе'},
      {src:'/images/report-2026/IMG_3188.jpg', alt:'Котлы над костром в лесу'},
      {src:'/images/report-2026/IMG_3152.jpg', alt:'Изделия в форме пельменей на деревянной подставке'}
    ],
    albumUrl: 'https://yadi.sk/d/q1wA7-uUI-yGsA',
    day: [
      {time:'11:00', text:'Встречаем гостей, открывается ярмарка'},
      {time:'12:00', text:'Торжественное открытие фестиваля'},
      {time:'12:00–13:30', text:'Команды лепят и варят, идёт конкурс скоростной лепки'},
      {time:'13:30', text:'Команды представляют свои блюда на сцене'},
      {time:'14:00', text:'Дегустация, оценка профессионального и народного жюри'},
      {time:'14:30', text:'Награждение победителей'}
    ],
    nominations: [
      {title:'Классический пельмень', text:'традиционные рецепты с мясной начинкой'},
      {title:'Пельмень дальневосточный', text:'дары моря и дикоросы Приморья'},
      {title:'Нежный вареник', text:'ягоды, творог, картошка, капуста, грибы'},
      {title:'Авторский взгляд', text:'самые необычные пельмени и вареники'},
      {title:'Лучшая презентация', text:'артистизм команды на сцене'},
      {title:'Скоростная лепка', text:'кто больше и аккуратнее слепит за отведённое время'}
    ],
    extras: ['Концерт на сценической поляне', 'Станции: бои подушками, канат, ходули, «Царевна Несмеяна»', 'Две фотозоны: из берёзы и сена и нейрофотозона в образах старорусских героев', 'Ярмарка мастеров', 'Своя фестивальная валюта для станций и фотозоны', 'Гимн фестиваля «Пельмень Варень»'],
    partnersTitle: 'Нам помогали в 2026',
    partners: [
      {name:'Щедрая поляна', src:'/images/season/partner-shchedraya-polyana.webp', url:''},
      {name:'Проект «Лица»', src:'/images/partner/2.webp', url:''},
      {name:'Семечки «Джинн»', src:'/images/partner/3.webp', url:''},
      {name:'Центр «Мой бизнес»', src:'/images/partner/4.webp', url:''},
      {name:'МТС', src:'/images/partner/5.webp', url:''}
    ]
  },
  articles: [{slug:'tickets-on-site', title:'Как купить билет на «Пельмень Варень»', description:'Продажа билетов на площадке и информация перед поездкой.', text:'В новом сезоне билеты будут продаваться только на площадке фестиваля. Оформлять онлайн-заказ заранее не нужно.\n\nСтоимость входа, способы оплаты и часы работы кассы пока не объявлены. Эти сведения добавим после утверждения.\n\nПеред поездкой проверьте дату, адрес и условия посещения в разделе для гостей. Цены из материалов прошлого сезона не подтверждают стоимость входа на новый фестиваль.', published:true}]
};

// Персонажи фестиваля (фирменный стиль, не редактируются).
const mascots = [
  {name:'Пельмешка', src:'mascot-pelmeshka', text:'Классика. Надёжный, домашний, всегда к месту.'},
  {name:'Варенька Вишневич', src:'mascot-varenka', text:'Нежная душа со сладкой начинкой.'},
  {name:'Гёдзик', src:'mascot-gedzik', text:'Хрустит снаружи, мягкий внутри.'},
  {name:'Доктор Момо', src:'mascot-momo', text:'Мудрец из Непала, готовится на пару.'},
  {name:'Хинкалидзе', src:'mascot-hinkalidze', text:'Щедрый, полон бульона и сюрпризов.'}
];

const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const paragraphs = text => text.split(/\n\s*\n/).filter(Boolean).map(p=>`<p>${esc(p).replace(/\n/g,'<br>')}</p>`).join('');
// Текст статьи: пустая строка — новый абзац; короткая строка без точки в конце — подзаголовок; строки с «•» или «- » — список.
function richText(text) {
  return text.split(/\n\s*\n/).map(b=>b.trim()).filter(Boolean).map(block=>{
    const lines=block.split('\n').map(l=>l.trim()).filter(Boolean);
    if(lines.length===1&&lines[0].length<=90&&!/[.!?:;…,»)"]$/.test(lines[0])&&!/^(•|- )/.test(lines[0]))return `<h2>${esc(lines[0])}</h2>`;
    let html='',list=[],para=[];
    const flush=()=>{if(para.length){html+=`<p>${para.map(esc).join('<br>')}</p>`;para=[];}if(list.length){html+=`<ul>${list.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>`;list=[];}};
    for(const line of lines){const m=line.match(/^(?:•|- )\s*(.+)$/);if(m){if(para.length){const p=para;para=[];html+=`<p>${p.map(esc).join('<br>')}</p>`;}list.push(m[1]);}else{if(list.length)flush();para.push(line);}}
    flush();
    return html;
  }).join('');
}

// Проверки. Сообщения называют поле, чтобы в редакторе было понятно, что исправить.
const fail = message => { throw Error(message); };
function str(v, max, label, optional=false) {
  if (optional && (v === undefined || v === null || (typeof v === 'string' && !v.trim()))) return '';
  if (typeof v !== 'string' || !v.trim()) fail(`Заполните поле «${label}».`);
  if (v.length > max) fail(`Поле «${label}» длиннее ${max} символов.`);
  return v.trim();
}
const IMAGE_SRC = /^\/images\/(?!.*\.\.)[A-Za-z0-9_\-./]+\.(?:webp|png|jpe?g|gif)$/;
function image(v, label, optional=false) {
  const value = str(v, 300, label, optional);
  if (value && !IMAGE_SRC.test(value)) fail(`«${label}»: нужен файл из папки сайта /images.`);
  return value;
}
function link(v, label) {
  const value = str(v, 500, label, true);
  if (value && !/^https:\/\/[^\s"'<>]+$/.test(value)) fail(`«${label}»: ссылка должна начинаться с https://`);
  return value;
}
function list(v, max, label, item) {
  if (v === undefined) return [];
  if (!Array.isArray(v)) fail(`Неверный список «${label}».`);
  if (v.length > max) fail(`В списке «${label}» не больше ${max} пунктов.`);
  return v.map((x, i) => item(x || {}, i + 1));
}
function validateArchive(a) {
  if (!a || typeof a !== 'object') return structuredClone(defaults.archive);
  const photo = a.photo || {};
  return {
    facts: list(a.facts, 4, 'Факты', (f,n)=>({value:str(f.value,40,`Факт ${n}: крупно`), text:str(f.text,160,`Факт ${n}: пояснение`)})),
    photo: {src:image(photo.src,'Главное фото',true), alt:str(photo.alt,300,'Описание главного фото',true), caption:str(photo.caption,300,'Подпись к главному фото',true)},
    gallery: list(a.gallery ?? defaults.archive.gallery, 40, 'Фотоальбом', (g,n)=>({src:image(g.src,`Фото ${n}`), alt:str(g.alt,300,`Фото ${n}: описание`,true)})),
    albumUrl: link(a.albumUrl ?? defaults.archive.albumUrl, 'Ссылка на все фото и видео'),
    day: list(a.day, 6, 'Как прошёл день', (d,n)=>({time:str(d.time,20,`День, пункт ${n}: время`), text:str(d.text,160,`День, пункт ${n}: что происходило`)})),
    nominations: list(a.nominations, 12, 'Номинации', (x,n)=>({title:str(x.title,80,`Номинация ${n}: название`), text:str(x.text,200,`Номинация ${n}: пояснение`,true)})),
    extras: list(a.extras, 12, 'Ещё в программе', (x,n)=>str(typeof x==='string'?x:'',200,`Программа, пункт ${n}`)),
    partnersTitle: str(a.partnersTitle ?? defaults.archive.partnersTitle, 120, 'Заголовок партнёров'),
    partners: list(a.partners, 24, 'Партнёры', (p,n)=>({name:str(p.name,120,`Партнёр ${n}: название`), src:image(p.src,`Партнёр ${n}: логотип`), url:link(p.url,`Партнёр ${n}: сайт`)}))
  };
}
function validate(input) {
  const data={revision:input.revision,title:str(input.title,180,'Заголовок для поиска'),description:str(input.description,500,'Описание для поиска'),heading:str(input.heading,250,'Заголовок главной'),lead:str(input.lead,3000,'Вступление')};
  if(!Number.isInteger(data.revision)||data.revision<0)fail('Неверная версия документа.');
  if(!Array.isArray(input.sections)||input.sections.length!==4)fail('Нужны четыре раздела главной.');
  data.sections=defaults.sections.map((base,i)=>({id:base.id,title:str(input.sections[i].title,250,`Раздел «${base.title}»: заголовок`),text:str(input.sections[i].text,20000,`Раздел «${base.title}»: текст`)}));
  data.archive=validateArchive(input.archive);
  if(!Array.isArray(input.articles)||input.articles.length>100)fail('Допустимо до 100 статей.');
  const slugs=new Set();
  data.articles=input.articles.map((a,i)=>{const n=`Статья ${i+1}`;const slug=str(a.slug,100,`${n}: адрес`);if(!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))fail(`${n}: адрес — только латиница, цифры и дефис.`);if(slugs.has(slug))fail(`${n}: такой адрес уже есть у другой статьи.`);slugs.add(slug);if(typeof a.published!=='boolean')fail(`${n}: неверный статус.`);return {slug,title:str(a.title,180,`${n}: заголовок`),description:str(a.description,500,`${n}: краткое описание`),text:str(a.text,50000,`${n}: текст`),published:a.published};});
  return data;
}
function createStore(file) {
  const read=()=>fs.existsSync(file)?validate(JSON.parse(fs.readFileSync(file,'utf8'))):structuredClone(defaults);
  const save=input=>{const data=validate(input);if(data.revision!==read().revision){const error=Error('Данные изменились в другой вкладке. Перезагрузите редактор перед сохранением.');error.status=409;throw error;}data.revision++;fs.mkdirSync(path.dirname(file),{recursive:true});const tmp=file+'.tmp';fs.writeFileSync(tmp,JSON.stringify(data,null,2),'utf8');fs.renameSync(tmp,file);return data;};
  return {read,save};
}

const section = (data,id) => data.sections.find(s=>s.id===id);
const articleCards = articles => articles.map(a=>`<li class="article-card"><a href="/articles/${a.slug}/"><span class="article-card__title">${esc(a.title)}</span><span class="article-card__text">${esc(a.description)}</span></a></li>`).join('');

function renderPast(past, a) {
  const facts = a.facts.length ? `<dl class="facts">${a.facts.map(f=>`<div><dt>${esc(f.value)}</dt><dd>${esc(f.text)}</dd></div>`).join('')}</dl>` : '';
  const photo = a.photo.src ? `<figure class="photo"><img src="${esc(a.photo.src)}" alt="${esc(a.photo.alt)}" loading="lazy">${a.photo.caption?`<figcaption>${esc(a.photo.caption)}</figcaption>`:''}</figure>` : '';
  const album = a.albumUrl ? `<p class="album"><a class="button report__album" href="${esc(a.albumUrl)}">Все фото и видео на Яндекс Диске</a></p>` : '';
  const gallery = a.gallery.length ? `<section class="report" id="photo-report" aria-labelledby="report-title"><div class="report__heading"><h3 id="report-title">Фотоотчёт 2026</h3><p class="note">Нажмите на снимок, чтобы рассмотреть его.</p></div><ul class="gallery">${a.gallery.map((g,i)=>`<li><a href="${esc(g.src)}" data-report-photo aria-label="Открыть фото ${i+1}: ${esc(g.alt)}"><img src="${esc(g.src)}" alt="${esc(g.alt)}" loading="lazy" decoding="async"><span class="report__caption">${esc(g.alt)}</span></a></li>`).join('')}</ul>${album}<dialog class="photo-viewer" aria-label="Просмотр фотоотчёта"><div class="photo-viewer__tools"><p class="photo-viewer__count" aria-live="polite"></p><button type="button" data-close autofocus>Закрыть ×</button></div><img class="photo-viewer__image" alt=""><div class="photo-viewer__navigation"><button type="button" data-previous aria-label="Предыдущее фото">← Назад</button><a data-original target="_blank" rel="noopener">Открыть файл</a><button type="button" data-next aria-label="Следующее фото">Далее →</button></div></dialog><script src="/information-gallery.js" defer></script></section>` : '';
  const day = a.day.length ? `<h3 class="sub">Как прошёл день</h3><p class="note">Пока команды лепили, день складывался, как пельмень: от начинки до последнего защипа.</p><ol class="day">${a.day.map((d,i)=>`<li><img src="/images/season/stage-${i+1}.webp" width="420" height="286" alt="" loading="lazy"><time>${esc(d.time)}</time><span>${esc(d.text)}</span></li>`).join('')}</ol>` : '';
  const noms = a.nominations.length ? `<div><h3 class="sub">Номинации</h3><ul class="nominations">${a.nominations.map(n=>`<li><strong>${esc(n.title)}</strong>${n.text?` — ${esc(n.text)}`:''}</li>`).join('')}</ul></div>` : '';
  const extras = a.extras.length ? `<div><h3 class="sub">Ещё в программе</h3><ul class="extras">${a.extras.map(e=>`<li>${esc(e)}</li>`).join('')}</ul></div>` : '';
  return `<section class="block past" id="past"><div class="past__intro"><h2>${esc(past.title)}</h2>${paragraphs(past.text)}</div>${gallery || (album ? `<section class="report" id="photo-report" aria-labelledby="report-title"><div class="report__heading"><h3 id="report-title">Фотоотчёт 2026</h3></div>${album}</section>` : '')}${facts}${photo}${day}${noms||extras?`<div class="past__columns">${noms}${extras}</div>`:''}</section>`;
}

function renderHome(data, published) {
  const about=section(data,'about'), program=section(data,'program'), past=section(data,'past'), visit=section(data,'visit'), a=data.archive;
  const relatives=published.find(x=>x.slug==='pelmeni-gyoza-khinkali-momo');
  return `
<section class="hero" aria-labelledby="hero-title">
  <span class="hero__flowers" aria-hidden="true"></span>
  <div class="hero__inner">
    <div class="hero__text">
      <span class="wordmark" role="img" aria-label="Пельмень Варень"></span>
      <h1 id="hero-title">${esc(data.heading)}</h1>
      <p class="hero__lead">${esc(data.lead)}</p>
      <div class="hero__actions">
        ${a.gallery.length || a.albumUrl ? '<a class="button button--milk" href="#photo-report">Фотоотчёт 2026</a>' : `<a class="button button--milk" href="#past">${esc(past.title)}</a>`}
        <a class="button button--line" href="#visit">Информация гостям</a>
      </div>
    </div>
    <img class="hero__mascot" src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt="Пельмешка — персонаж фестиваля">
  </div>
</section>
<div class="rushnik" aria-hidden="true"></div>

<section class="block about" id="about">
  <div class="about__text">
    <h2>${esc(about.title)}</h2>
    ${paragraphs(about.text)}
  </div>
  <img class="about__mascot" src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt="Пельмешка — главный персонаж фестиваля" loading="lazy">
</section>

${renderPast(past, a)}

<section class="block characters" id="characters" aria-labelledby="characters-title">
  <h2 id="characters-title">Какой ты пельмень?</h2>
  <p class="note">Персонажи фестиваля. В квизе прошлого сезона гости узнавали, на кого из них похожи.${relatives?` <a href="/articles/${relatives.slug}/">Чем они отличаются на самом деле</a>`:''}</p>
  <ul class="mascots">${mascots.map(m=>`<li><img src="/images/season/${m.src}.webp" alt="" loading="lazy"><strong>${esc(m.name)}</strong><span>${esc(m.text)}</span></li>`).join('')}</ul>
</section>

<section class="block season" id="program">
  <h2>${esc(program.title)}</h2>
  ${paragraphs(program.text)}
</section>

<section class="block visit" id="visit">
  <div class="visit__text">
    <h2>${esc(visit.title)}</h2>
    ${paragraphs(visit.text)}
  </div>
  <figure class="photo photo--small">
    <img src="/images/season/venue-aerial.webp" width="1400" height="788" alt="Поляна и парковка центра активного отдыха «Подножие Пидана» с высоты" loading="lazy">
    <figcaption>Площадка первого фестиваля с высоты. Где пройдёт новый сезон, сообщим отдельно.</figcaption>
  </figure>
</section>

${published.length?`<section class="block articles" aria-labelledby="articles-title">
  <h2 id="articles-title">Почитать</h2>
  <ul class="article-list">${articleCards(published.slice(0,6))}</ul>
  <p><a class="more" href="/articles/">Все статьи</a></p>
</section>`:''}

${a.partners.length?`<section class="block partners" aria-labelledby="partners-title">
  <h2 id="partners-title">${esc(a.partnersTitle)}</h2>
  <ul class="partner-list">${a.partners.map(p=>{const img=`<img src="${esc(p.src)}" alt="${esc(p.name)}" loading="lazy">`;return `<li>${p.url?`<a href="${esc(p.url)}" rel="noopener">${img}</a>`:img}</li>`;}).join('')}</ul>
</section>`:''}`;
}

function render(data,route,base='') {
  if(!data.archive)data={...data,archive:structuredClone(defaults.archive)};
  let title=data.title,description=data.description,body;
  const published=data.articles.filter(a=>a.published);
  if(route==='/')body=renderHome(data,published);
  else if(route==='/articles/'){title='Статьи о фестивале «Пельмень Варень»';description='Материалы о фестивале, пельменях и варениках.';body=`<section class="block page-head"><h1>Статьи</h1><p class="note">О фестивале, пельменях, варениках и их родственниках.</p></section><section class="block">${published.length?`<ul class="article-list">${articleCards(published)}</ul>`:'<p>Материалы готовятся.</p>'}</section>`;}
  else {
    const article=published.find(a=>route===`/articles/${a.slug}/`);if(!article)return null;
    title=article.title;description=article.description;
    const more=published.filter(a=>a!==article).slice(0,3);
    body=`<article class="block article"><p class="crumbs"><a href="/articles/">Все статьи</a></p><h1>${esc(article.title)}</h1><p class="article__lead">${esc(article.description)}</p><div class="article__body">${richText(article.text)}</div></article>${more.length?`<section class="block articles"><h2>Ещё почитать</h2><ul class="article-list">${articleCards(more)}</ul></section>`:''}`;
  }
  return `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(description)}"><meta name="theme-color" content="#f2eadf"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(description)}">${base?`<link rel="canonical" href="${esc(base+route)}"><meta property="og:image" content="${esc(base+'/images/season/mascot-pelmeshka.webp')}">`:''}<link rel="icon" href="/images/logo.webp"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Golos+Text:wght@400;500;600;700&family=Cormorant+SC:wght@400;600;700&display=swap"><link rel="stylesheet" href="/information.css"></head><body${route==='/'?' class="home"':''}><a class="skip-link" href="#main">К содержимому</a><header class="topbar"><a class="brand" href="/"><img src="/images/season/mascot-pelmeshka.webp" width="420" height="604" alt=""><span>Пельмень Варень</span></a><nav class="nav" aria-label="Главная навигация"><a href="/#about">О фестивале</a><a href="/#past">Как это было</a><a href="/#program">Новый сезон</a><a href="/#visit">Гостям</a><a href="/articles/">Статьи</a></nav></header><main id="main">${body}</main><footer class="footer"><div class="rushnik" aria-hidden="true"></div><div class="footer__inner"><span class="wordmark wordmark--small" role="img" aria-label="Пельмень Варень"></span><p>Приморский гастрофестиваль пельменей и вареников. Билеты продаются только на площадке фестиваля.</p><nav aria-label="Ссылки в подвале"><a href="/#past">Как это было</a><a href="/#visit">Гостям</a><a href="/articles/">Статьи</a></nav></div></footer></body></html>`;
}
module.exports={defaults,validate,createStore,render,richText};
