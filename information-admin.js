'use strict';
// Редактор информационного сайта. Данные редактируются прямо в объекте data; «Сохранить» отправляет его на сервер.
const $ = id => document.getElementById(id);
const DRAFT_KEY = 'pelmenvaren-admin-draft';
let data = null, saved = '', tab = 'home', articleIndex = null, saving = false, draftTimer = null;

// ---------- Утилиты ----------
function h(tag, attrs = {}, ...children) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else if (k in el && k !== 'list') el[k] = v;
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of children.flat()) if (c !== null && c !== undefined && c !== false) el.append(c instanceof Node ? c : document.createTextNode(c));
  return el;
}
async function api(url, options = {}) {
  const res = await fetch(url, {...options, headers: {'Content-Type': 'application/json', ...(options.headers || {})}});
  let body = {};
  try { body = await res.json(); } catch {}
  if (!res.ok) { const e = Error(body.error || 'Сервер не ответил. Проверьте, что сайт запущен.'); e.status = res.status; throw e; }
  return body;
}
const json = () => JSON.stringify(data);
const isDirty = () => data && json() !== saved;
const time = d => d.toLocaleTimeString('ru-RU', {hour: '2-digit', minute: '2-digit'});

function setStatus(text, state = 'ok') { const s = $('status'); s.textContent = text; s.dataset.state = state; }
function changed() {
  if (isDirty()) setStatus('Есть несохранённые изменения', 'dirty'); else setStatus('Все изменения сохранены');
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    try { if (isDirty()) localStorage.setItem(DRAFT_KEY, JSON.stringify({revision: data.revision, json: json(), at: Date.now()})); else localStorage.removeItem(DRAFT_KEY); } catch {}
  }, 400);
}

// ---------- Поля ----------
function counter(input, max) {
  const c = h('span', {class: 'field__count'});
  const upd = () => { c.textContent = `${input.value.length} / ${max}`; c.classList.toggle('over', input.value.length > max); };
  input.addEventListener('input', upd); upd();
  return c;
}
function text(label, obj, key, opts = {}) {
  const {max = 300, multiline = false, hint, rows, tall = false, required = true, placeholder, onInput} = opts;
  const input = h(multiline ? 'textarea' : 'input', {value: obj[key] ?? '', maxLength: max + 200, rows, placeholder, required, class: tall ? 'tall' : undefined});
  input.addEventListener('input', () => { obj[key] = input.value; onInput && onInput(input.value); changed(); });
  return h('label', {class: 'field'}, h('span', {class: 'field__label'}, label, counter(input, max)), input, hint ? h('p', {class: 'hint'}, hint) : null);
}
function card(title, hint, ...children) {
  return h('section', {class: 'card'}, h('h2', {}, title), hint ? h('p', {class: 'hint'}, hint) : null, ...children);
}
// Список однотипных пунктов: добавить, переставить, удалить.
function repeat(arr, {max, make, item, addLabel}) {
  const box = h('div');
  const draw = () => {
    const items = h('div', {class: 'items'});
    arr.forEach((value, i) => {
      const tools = h('div', {class: 'item__tools'},
        h('button', {type: 'button', class: 'icon-btn', title: 'Выше', 'aria-label': 'Переместить выше', disabled: i === 0, onclick: () => { [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]]; changed(); draw(); }}, '↑'),
        h('button', {type: 'button', class: 'icon-btn', title: 'Ниже', 'aria-label': 'Переместить ниже', disabled: i === arr.length - 1, onclick: () => { [arr[i + 1], arr[i]] = [arr[i], arr[i + 1]]; changed(); draw(); }}, '↓'),
        h('button', {type: 'button', class: 'icon-btn', title: 'Удалить', 'aria-label': 'Удалить пункт', onclick: () => { if (confirm('Удалить этот пункт?')) { arr.splice(i, 1); changed(); draw(); } }}, '✕'));
      items.append(h('div', {class: 'item'}, h('div', {class: 'item__body'}, item(arr, i)), tools));
    });
    const add = arr.length < max ? h('button', {type: 'button', class: 'btn btn--ghost add', onclick: () => { arr.push(make()); changed(); draw(); const last = box.querySelectorAll('.item'); last[last.length - 1]?.querySelector('input,textarea')?.focus(); }}, '+ ' + addLabel) : h('p', {class: 'hint'}, `Больше ${max} добавить нельзя.`);
    box.replaceChildren(items, add);
  };
  draw();
  return box;
}

// ---------- Изображения ----------
// Уменьшаем фото в браузере, чтобы сайт грузился быстро даже со снимков телефона.
function shrink(file, maxSide) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, maxSide / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(url);
      let out = c.toDataURL('image/webp', 0.84);
      if (!out.startsWith('data:image/webp')) out = c.toDataURL('image/jpeg', 0.86);
      resolve(out);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(Error(`Не удалось открыть «${file.name}». Подойдут JPG, PNG или WEBP.`)); };
    img.src = url;
  });
}
async function upload(file, maxSide) {
  const dataUrl = await shrink(file, maxSide);
  const ext = dataUrl.startsWith('data:image/webp') ? '.webp' : '.jpg';
  const res = await api('/api/admin/upload-image', {method: 'POST', body: JSON.stringify({fileData: dataUrl, fileName: 'photo' + ext, prefix: 'site'})});
  return '/' + res.path.replace(/^\/+/, '');
}
function imageField(label, obj, key, {maxSide = 1600, optional = false, hint} = {}) {
  const thumb = h('div', {class: 'thumb'});
  const progress = h('span', {class: 'progress', role: 'status'});
  const drawThumb = () => thumb.replaceChildren(obj[key] ? h('img', {src: obj[key], alt: ''}) : 'Нет фото');
  const input = h('input', {type: 'file', accept: 'image/*', 'aria-label': label});
  input.addEventListener('change', async () => {
    const file = input.files[0]; if (!file) return;
    progress.textContent = 'Загружаю…';
    try { obj[key] = await upload(file, maxSide); drawThumb(); changed(); progress.textContent = 'Готово'; }
    catch (e) { progress.textContent = e.message; }
    input.value = '';
  });
  drawThumb();
  return h('div', {class: 'image-field'}, thumb, h('div', {},
    h('div', {class: 'field__label'}, label),
    h('div', {class: 'image-field__actions'},
      h('span', {class: 'btn btn--ghost btn--small file-btn'}, obj[key] ? 'Заменить' : 'Загрузить', input),
      optional && obj[key] ? h('button', {type: 'button', class: 'btn btn--danger btn--small', onclick: () => { obj[key] = ''; changed(); render(); }}, 'Убрать') : null,
      progress),
    hint ? h('p', {class: 'hint'}, hint) : null));
}

// ---------- Вкладки ----------
const TABS = [['home', 'Главная'], ['past', 'Как это было'], ['articles', 'Статьи'], ['partners', 'Партнёры'], ['seo', 'Для поисковиков']];
const sectionById = id => data.sections.find(s => s.id === id);

function homePanel() {
  const s = id => sectionById(id);
  return [
    card('Первый экран', 'Крупная надпись «Пельмень Варень» и фото героини остаются. Ниже — подзаголовок и вступление.',
      text('Подзаголовок', data, 'heading', {max: 250}),
      text('Вступление', data, 'lead', {max: 3000, multiline: true, hint: 'Коротко: что за фестиваль и что сейчас происходит. 2–3 предложения.'})),
    ...['about', 'program', 'visit'].map(id => card(s(id).title, id === 'visit' ? 'Дата, адрес, билеты, как добраться. Пустая строка разделяет абзацы.' : 'Пустая строка разделяет абзацы.',
      text('Заголовок раздела', s(id), 'title', {max: 250}),
      text('Текст', s(id), 'text', {max: 20000, multiline: true, rows: 6})))
  ];
}

function pastPanel() {
  const a = data.archive, past = sectionById('past');
  const gallery = h('div');
  const drawGallery = () => {
    const progress = h('span', {class: 'progress', role: 'status'});
    const input = h('input', {type: 'file', accept: 'image/*', multiple: true, 'aria-label': 'Добавить фото в альбом'});
    input.addEventListener('change', async () => {
      const files = [...input.files].slice(0, 40 - a.gallery.length);
      for (let i = 0; i < files.length; i++) {
        progress.textContent = `Загружаю ${i + 1} из ${files.length}…`;
        try { a.gallery.push({src: await upload(files[i], 1600), alt: ''}); changed(); }
        catch (e) { progress.textContent = e.message; return; }
      }
      drawGallery();
    });
    const grid = h('div', {class: 'gallery-grid'}, a.gallery.map((g, i) => h('div', {class: 'gallery-item'},
      h('img', {src: g.src, alt: ''}),
      text('Что на фото', g, 'alt', {max: 300, required: false, placeholder: 'Например: команда лепит вареники'}),
      h('div', {class: 'gallery-item__tools'},
        h('button', {type: 'button', class: 'icon-btn', 'aria-label': 'Раньше', disabled: i === 0, onclick: () => { [a.gallery[i - 1], a.gallery[i]] = [a.gallery[i], a.gallery[i - 1]]; changed(); drawGallery(); }}, '←'),
        h('button', {type: 'button', class: 'icon-btn', 'aria-label': 'Позже', disabled: i === a.gallery.length - 1, onclick: () => { [a.gallery[i + 1], a.gallery[i]] = [a.gallery[i], a.gallery[i + 1]]; changed(); drawGallery(); }}, '→'),
        h('button', {type: 'button', class: 'btn btn--danger btn--small', onclick: () => { if (confirm('Убрать фото из альбома?')) { a.gallery.splice(i, 1); changed(); drawGallery(); } }}, 'Убрать')))));
    gallery.replaceChildren(grid, a.gallery.length < 40 ? h('div', {class: 'image-field__actions'}, h('span', {class: 'btn btn--ghost file-btn'}, '+ Добавить фото', input), progress) : h('p', {class: 'hint'}, 'В альбоме уже 40 фото.'));
  };
  drawGallery();
  return [
    card('Текст раздела', 'Рассказ о прошлом фестивале. Пустая строка разделяет абзацы.',
      text('Заголовок', past, 'title', {max: 250}),
      text('Текст', past, 'text', {max: 20000, multiline: true, rows: 6})),
    card('Факты крупно', 'До 4 коротких фактов. Публикуйте только проверенные цифры.',
      repeat(a.facts, {max: 4, addLabel: 'Добавить факт', make: () => ({value: '', text: ''}), item: (arr, i) => h('div', {class: 'row'},
        text('Крупно', arr[i], 'value', {max: 40, placeholder: '16 мая 2026'}),
        text('Пояснение', arr[i], 'text', {max: 160}))})),
    card('Главное фото', null,
      imageField('Фото', a.photo, 'src', {optional: true}),
      text('Что на фото (для незрячих и поисковиков)', a.photo, 'alt', {max: 300, required: false}),
      text('Подпись под фото', a.photo, 'caption', {max: 300, required: false})),
    card('Фотоальбом', 'Лучшие кадры прошлого фестиваля. Фото уменьшаются автоматически. Можно выбрать сразу несколько.',
      gallery,
      text('Ссылка на все фото и видео', a, 'albumUrl', {max: 500, required: false, placeholder: 'https://disk.yandex.ru/…', hint: 'Например, папка на Яндекс.Диске или видео в VK. Появится кнопка «Все фото и видео фестиваля».'})),
    card('Как прошёл день', 'До 6 пунктов. Каждый пункт на сайте иллюстрирует следующий шаг лепки пельменя.',
      repeat(a.day, {max: 6, addLabel: 'Добавить пункт', make: () => ({time: '', text: ''}), item: (arr, i) => h('div', {class: 'row'},
        text('Время', arr[i], 'time', {max: 20, placeholder: '12:00'}),
        text('Что происходило', arr[i], 'text', {max: 160}))})),
    card('Номинации', null,
      repeat(a.nominations, {max: 12, addLabel: 'Добавить номинацию', make: () => ({title: '', text: ''}), item: (arr, i) => h('div', {},
        text('Название', arr[i], 'title', {max: 80}),
        text('Пояснение', arr[i], 'text', {max: 200, required: false}))})),
    card('Ещё в программе', 'Развлечения, станции, концерт — одним пунктом каждое.',
      repeat(a.extras, {max: 12, addLabel: 'Добавить пункт', make: () => '', item: (arr, i) => {
        const proxy = {v: arr[i]};
        return text(`Пункт ${i + 1}`, proxy, 'v', {max: 200, onInput: v => { arr[i] = v; }});
      }}))
  ];
}

const translit = s => s.toLowerCase().replace(/ё/g, 'е').split('').map(c => ({а:'a',б:'b',в:'v',г:'g',д:'d',е:'e',ж:'zh',з:'z',и:'i',й:'y',к:'k',л:'l',м:'m',н:'n',о:'o',п:'p',р:'r',с:'s',т:'t',у:'u',ф:'f',х:'kh',ц:'ts',ч:'ch',ш:'sh',щ:'shch',ъ:'',ы:'y',ь:'',э:'e',ю:'yu',я:'ya'})[c] ?? c).join('').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

function articlesPanel() {
  if (articleIndex !== null && data.articles[articleIndex]) return articleEditor(data.articles[articleIndex]);
  articleIndex = null;
  const list = h('div', {class: 'items'}, data.articles.map((a, i) => h('button', {type: 'button', class: 'article-row', onclick: () => { articleIndex = i; render(); window.scrollTo(0, 0); }},
    h('span', {}, h('strong', {}, a.title || 'Без названия'), h('span', {class: 'hint'}, a.description || 'Нет описания')),
    h('span', {class: 'chip' + (a.published ? ' chip--on' : '')}, a.published ? 'На сайте' : 'Черновик'))));
  return [card('Статьи', 'Черновики видны только здесь и в предпросмотре. Чтобы статья появилась на сайте, включите «Показывать на сайте» и сохраните.',
    h('button', {type: 'button', class: 'btn btn--primary add', onclick: () => { data.articles.unshift({slug: '', title: '', description: '', text: '', published: false, _auto: true}); articleIndex = 0; changed(); render(); }}, '+ Новая статья'),
    data.articles.length ? list : h('p', {class: 'hint'}, 'Статей пока нет. Нажмите «Новая статья».'))];
}

function articleEditor(a) {
  const slugInput = text('Адрес страницы', a, 'slug', {max: 100, hint: 'Латиница, цифры и дефис. Заполняется сам по заголовку.', onInput: () => { a._auto = false; }});
  const slugEl = slugInput.querySelector('input');
  const titleField = text('Заголовок', a, 'title', {max: 180, onInput: v => { if (a._auto || !a.slug) { a._auto = true; a.slug = translit(v); slugEl.value = a.slug; slugEl.dispatchEvent(new Event('input')); a._auto = true; } }});
  const textField = text('Текст статьи', a, 'text', {max: 50000, multiline: true, tall: true});
  const area = textField.querySelector('textarea');
  const insert = (prefix) => { const s = area.selectionStart, start = area.value.lastIndexOf('\n', s - 1) + 1; area.setRangeText(prefix, start, start, 'end'); area.focus(); area.dispatchEvent(new Event('input')); };
  const toolbar = h('div', {class: 'toolbar'},
    h('button', {type: 'button', class: 'btn btn--ghost btn--small', onclick: () => insert('\n')}, 'Новый абзац'),
    h('button', {type: 'button', class: 'btn btn--ghost btn--small', onclick: () => insert('• ')}, '• Пункт списка'));
  textField.insertBefore(toolbar, area);
  const check = h('input', {type: 'checkbox', checked: a.published});
  check.addEventListener('change', () => { a.published = check.checked; changed(); });
  return [
    h('button', {type: 'button', class: 'btn btn--ghost back', onclick: () => { articleIndex = null; render(); }}, '← Все статьи'),
    card(a.title || 'Новая статья', null,
      h('label', {class: 'switch'}, check, 'Показывать на сайте'),
      titleField,
      text('Краткое описание', a, 'description', {max: 500, multiline: true, rows: 2, hint: 'Показывается в карточке статьи и в поиске. 1–2 предложения.'}),
      slugInput,
      textField,
      h('div', {class: 'format-help'}, 'Как оформить: пустая строка — новый абзац. Короткая строка без точки в конце — подзаголовок. Строка с ', h('code', {}, '•'), ' или ', h('code', {}, '- '), ' в начале — пункт списка.'),
      h('p', {}, h('button', {type: 'button', class: 'btn btn--danger', onclick: () => { if (confirm(`Удалить статью «${a.title || 'без названия'}»? Удаление сохранится после нажатия «Сохранить».`)) { data.articles.splice(articleIndex, 1); articleIndex = null; changed(); render(); } }}, 'Удалить статью')))
  ];
}

function partnersPanel() {
  const a = data.archive;
  return [card('Партнёры', 'Логотипы показываются внизу главной. Перед публикацией убедитесь, что партнёр согласен.',
    text('Заголовок блока', a, 'partnersTitle', {max: 120}),
    repeat(a.partners, {max: 24, addLabel: 'Добавить партнёра', make: () => ({name: '', src: '', url: ''}), item: (arr, i) => h('div', {},
      imageField('Логотип', arr[i], 'src', {maxSide: 600}),
      text('Название', arr[i], 'name', {max: 120}),
      text('Сайт партнёра', arr[i], 'url', {max: 500, required: false, placeholder: 'https://…'}))}))];
}

function seoPanel() {
  const snippet = h('div', {class: 'snippet', 'aria-label': 'Так сайт может выглядеть в поиске'});
  const upd = () => snippet.replaceChildren(h('div', {class: 'snippet__url'}, 'pelmenvaren… › главная'), h('div', {class: 'snippet__title'}, data.title), h('div', {class: 'snippet__text'}, data.description));
  upd();
  const t = text('Заголовок для поиска', data, 'title', {max: 180, hint: 'Лучше до 60 символов: дальше поисковик обрежет.', onInput: upd});
  const d = text('Описание для поиска', data, 'description', {max: 500, multiline: true, rows: 3, hint: 'Лучше до 160 символов.', onInput: upd});
  return [card('Как сайт выглядит в поиске', 'Заголовок и описание главной страницы для Яндекса и Google. У статей свои — в карточке статьи.', t, d, snippet)];
}

function render() {
  $('tabs').replaceChildren(...TABS.map(([id, label]) => h('button', {type: 'button', role: 'tab', class: 'tab', 'aria-selected': String(tab === id), onclick: () => { tab = id; articleIndex = null; render(); window.scrollTo(0, 0); }}, label)));
  const panels = {home: homePanel, past: pastPanel, articles: articlesPanel, partners: partnersPanel, seo: seoPanel};
  $('panel').replaceChildren(...panels[tab]());
  $('tabs').querySelector('[aria-selected="true"]')?.scrollIntoView({block: 'nearest', inline: 'nearest'});
}

// ---------- Загрузка, сохранение, черновик ----------
function clean(d) { const c = structuredClone(d); c.articles.forEach(a => delete a._auto); return c; }
async function load() {
  const res = await api('/api/information');
  data = res.content; saved = json();
  $('login').hidden = true; $('editor').hidden = false; $('savebar').hidden = false; $('bar-actions').hidden = false;
  render(); setStatus('Все изменения сохранены');
  try {
    const draft = JSON.parse(localStorage.getItem(DRAFT_KEY) || 'null');
    if (draft && draft.json !== saved) {
      if (draft.revision === data.revision) {
        $('restore-text').textContent = `Есть несохранённые правки от ${new Date(draft.at).toLocaleString('ru-RU', {day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'})}. Восстановить их?`;
        $('restore').hidden = false;
        $('restore-yes').onclick = () => { data = JSON.parse(draft.json); $('restore').hidden = true; render(); changed(); };
        $('restore-no').onclick = () => { localStorage.removeItem(DRAFT_KEY); $('restore').hidden = true; };
      } else localStorage.removeItem(DRAFT_KEY);
    }
  } catch {}
}
async function save() {
  if (saving || !data) return;
  saving = true; $('save-btn').disabled = true; setStatus('Сохраняю…', 'busy');
  try {
    const res = await api('/api/information', {method: 'PUT', body: JSON.stringify({content: clean(data)})});
    const keep = data.articles.map(a => a._auto);
    data = res.content; data.articles.forEach((a, i) => { if (keep[i]) a._auto = keep[i]; });
    saved = json(); localStorage.removeItem(DRAFT_KEY);
    setStatus(`Сохранено в ${time(new Date())}`);
    render();
  } catch (e) {
    setStatus(e.status === 409 ? 'Данные изменились в другой вкладке. Скопируйте свои правки и обновите страницу.' : e.message, 'error');
  } finally { saving = false; $('save-btn').disabled = false; }
}
async function preview() {
  const a = tab === 'articles' && articleIndex !== null ? data.articles[articleIndex] : null;
  const copy = clean(data);
  let route = '/';
  if (a) { if (!a.slug) { setStatus('Заполните заголовок статьи, чтобы посмотреть её.', 'error'); return; } route = `/articles/${a.slug}/`; copy.articles[articleIndex].published = true; }
  try {
    const res = await api('/api/information/preview', {method: 'POST', body: JSON.stringify({content: copy, route})});
    $('preview-frame').srcdoc = res.html;
    $('preview-title').textContent = a ? 'Предпросмотр статьи' : 'Предпросмотр главной';
    $('preview').showModal();
  } catch (e) { setStatus(e.message, 'error'); }
}

$('login-form').addEventListener('submit', async e => {
  e.preventDefault(); $('login-error').textContent = '';
  try {
    await api('/api/auth/login', {method: 'POST', body: JSON.stringify({role: 'admin', username: e.target.username.value, password: e.target.password.value})});
    e.target.password.value = ''; await load();
  } catch (err) { $('login-error').textContent = err.status === 401 || err.status === 403 ? 'Неверный логин или пароль.' : err.message; }
});
$('save-btn').addEventListener('click', save);
$('preview-btn').addEventListener('click', preview);
$('preview-close').addEventListener('click', () => $('preview').close());
document.querySelectorAll('.segmented button').forEach(b => b.addEventListener('click', () => {
  document.querySelectorAll('.segmented button').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  $('preview-frame').dataset.device = b.dataset.device;
}));
$('logout').addEventListener('click', async () => {
  if (isDirty() && !confirm('Есть несохранённые изменения. Они останутся черновиком на этом устройстве. Выйти?')) return;
  try { await api('/api/auth/logout', {method: 'POST'}); } catch {}
  location.reload();
});
document.addEventListener('keydown', e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's' && data) { e.preventDefault(); save(); } });
window.addEventListener('beforeunload', e => { if (isDirty()) { e.preventDefault(); e.returnValue = ''; } });
api('/api/auth/status?role=admin').then(s => s.authenticated ? load() : null).catch(() => {});
