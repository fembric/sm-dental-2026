(() => {
  const dialog = document.querySelector('#appointment-dialog');
  const form = document.querySelector('#booking-form');
  if (!form) return;
  // Scope local drafts to this site, including a GitHub Pages repository prefix.
  const root = new URL('../', document.currentScript.src).pathname;
  const key = 'sm-booking-drafts-v1:' + root;
  const status = document.querySelector('[data-booking-status]');
  const list = document.querySelector('[data-booking-list]');
  const count = document.querySelector('[data-booking-count]');
  const exportButton = document.querySelector('[data-booking-export]');
  const dateField = form.elements.date;
  const timeField = form.elements.time;
  const moscowDate = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'Europe/Moscow' }).format(new Date());
  function updateRange() {
    const today = moscowDate();
    const end = new Date(today + 'T12:00:00Z');
    end.setUTCDate(end.getUTCDate() + 90);
    dateField.min = today;
    dateField.max = end.toISOString().slice(0, 10);
  }
  function read() {
    const rows = JSON.parse(localStorage.getItem(key) || '[]');
    if (!Array.isArray(rows) || rows.some(r => !r || ['id', 'name', 'phone', 'date', 'time', 'context'].some(k => typeof r[k] !== 'string'))) throw Error('Invalid storage');
    return rows;
  }
  function write(rows) { localStorage.setItem(key, JSON.stringify(rows)); }
  const announce = (message, error = false) => { status.textContent = message; status.classList.toggle('is-error', error); };
  function render() {
    list.replaceChildren();
    try {
      const rows = read();
      count.textContent = '(' + rows.length + ')';
      exportButton.disabled = !rows.length;
      if (!rows.length) { const p = document.createElement('p'); p.textContent = 'Сохранённых заявок пока нет.'; list.append(p); }
      for (const row of [...rows].reverse()) {
        const card = document.createElement('article'); card.className = 'booking-record';
        const title = document.createElement('h3'); title.textContent = row.date.split('-').reverse().join('.') + ' · ' + row.time + ' МСК';
        const person = document.createElement('p'); person.textContent = row.name + ' · ' + row.phone;
        const note = document.createElement('p'); note.className = 'small-note'; note.textContent = row.context + ' · Не отправлена в клинику';
        const remove = document.createElement('button'); remove.type = 'button'; remove.className = 'text-link'; remove.textContent = 'Удалить заявку';
        remove.addEventListener('click', () => {
          if (remove.dataset.confirm !== 'yes') { remove.dataset.confirm = 'yes'; remove.textContent = 'Подтвердить удаление'; return; }
          try { write(read().filter(r => r.id !== row.id)); render(); announce('Заявка удалена с этого устройства.'); }
          catch { announce('Не удалось удалить заявку: хранилище браузера недоступно.', true); }
        });
        card.append(title, person, note, remove); list.append(card);
      }
    } catch { count.textContent = ''; exportButton.disabled = true; list.textContent = 'Не удалось прочитать заявки. Данные не перезаписаны. Проверьте настройки хранения в браузере.'; }
  }
  function clearErrors() { for (const field of form.elements) field.setCustomValidity?.(''); }
  form.addEventListener('input', () => { clearErrors(); status.textContent = ''; });
  form.addEventListener('submit', event => {
    event.preventDefault(); updateRange();
    const name = form.elements.name.value.trim();
    const phone = form.elements.phone.value.trim();
    const digits = phone.replace(/\D/g, '');
    if (name.length < 2) form.elements.name.setCustomValidity('Введите имя: минимум два символа.');
    if (!/^[+\d\s().-]+$/.test(phone) || digits.length < 10 || digits.length > 15) form.elements.phone.setCustomValidity('Введите телефон: от 10 до 15 цифр.');
    const date = dateField.value, time = timeField.value;
    if (date && time && new Date(date + 'T' + time + ':00+03:00').getTime() <= Date.now()) timeField.setCustomValidity('Выберите время в будущем, по Москве.');
    if (!form.reportValidity()) return;
    try {
      const rows = read();
      if (rows.length >= 100) { announce('Сохранено 100 заявок. Скачайте копию и удалите ненужные перед добавлением новой.', true); return; }
      // Intentionally no slot reservation: availability belongs to the future backend.
      rows.push({ id: crypto.randomUUID(), name, phone, date, time, timezone: 'Europe/Moscow', context: dialog.querySelector('.dialog-context').textContent, status: 'local-draft', createdAt: new Date().toISOString() });
      write(rows); form.reset(); updateRange(); render();
      announce('Заявка сохранена на этом устройстве. В клинику она не отправлена. Позвоните, чтобы подтвердить дату и время.');
      dialog.querySelector('.saved-bookings').open = true;
    } catch { announce('Не удалось сохранить заявку. Разрешите хранение данных в браузере или позвоните в клинику. Заявка не отправлена.', true); }
  });
  exportButton.addEventListener('click', () => {
    try {
      const blob = new Blob([JSON.stringify({ version: 1, appointments: read() }, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = 'sm-appointments-' + moscowDate() + '.json'; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      announce('Копия заявок подготовлена для скачивания. Файл содержит имена и телефоны.');
    } catch { announce('Не удалось скачать заявки.', true); }
  });
  document.querySelectorAll('[data-appointment]').forEach(button => button.addEventListener('click', () => { updateRange(); render(); }));
  dialog.addEventListener('close', () => { form.reset(); clearErrors(); status.textContent = ''; });
  window.addEventListener('storage', event => { if (event.key === key || event.key === null) render(); });
  updateRange(); render();
  form.querySelector('[type="submit"]').disabled = false;
})();
