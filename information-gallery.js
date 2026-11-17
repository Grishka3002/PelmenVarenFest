(() => {
  document.querySelectorAll('.report').forEach(report => {
    const dialog = report.querySelector('dialog');
    if (!dialog || typeof dialog.showModal !== 'function') return;
    const links = [...report.querySelectorAll('[data-report-photo]')];
    const image = dialog.querySelector('img');
    const count = dialog.querySelector('[aria-live]');
    const original = dialog.querySelector('[data-original]');
    let index = 0;
    let opener;
    const show = next => {
      index = (next + links.length) % links.length;
      image.src = links[index].href;
      image.alt = links[index].querySelector('img').alt;
      original.href = links[index].href;
      count.textContent = `${index + 1} / ${links.length}`;
    };
    links.forEach((link, i) => link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      opener = link;
      show(i);
      dialog.showModal();
    }));
    dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-previous]').addEventListener('click', () => show(index - 1));
    dialog.querySelector('[data-next]').addEventListener('click', () => show(index + 1));
    dialog.addEventListener('keydown', event => {
      if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
        event.preventDefault();
        show(index + (event.key === 'ArrowLeft' ? -1 : 1));
      }
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
    dialog.addEventListener('close', () => { if (opener) opener.focus(); });
  });
})();
