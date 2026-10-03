export const bookingDialog = `<dialog class="dialog booking-dialog" id="appointment-dialog" aria-labelledby="dialog-title"><div class="dialog-inner">
<button class="dialog-close" aria-label="Закрыть окно">×</button>
<div class="dialog-context">Первый шаг к здоровой улыбке</div>
<h2 id="dialog-title">Удобное время<br>для вашей улыбки</h2>
<p class="booking-notice">Пока это предварительная заявка на вашем устройстве. Она не отправляется в клинику и не бронирует время. Для подтверждения позвоните: <a href="tel:+78312708220">+7 (831) 270-82-20</a>.</p>
<form id="booking-form">
<div class="booking-fields">
<label>Ваше имя<input name="name" autocomplete="given-name" required minlength="2" maxlength="80" placeholder="Как к вам обращаться"></label>
<label>Телефон<input name="phone" type="tel" autocomplete="tel" inputmode="tel" required maxlength="24" placeholder="+7 (___) ___-__-__" aria-describedby="phone-hint"><small id="phone-hint">От 10 до 15 цифр, можно с кодом страны.</small></label>
<label>Желаемая дата<input name="date" type="date" required aria-describedby="calendar-hint"></label>
<label>Желаемое время<input name="time" type="time" required step="60"><small>По московскому времени.</small></label>
</div>
<p class="small-note" id="calendar-hint">Календарь на 90 дней вперёд. Это пожелание ко времени приёма, а не расписание свободных мест. Занятость пока не проверяется.</p>
<label class="booking-consent"><input name="consent" type="checkbox" required><span>Сохранить имя, телефон и выбранное время в этом браузере. Данные доступны тому, кто пользуется этим устройством. <a class="text-link" href="/privacy/">Подробнее</a></span></label>
<button class="button" type="submit" disabled>Сохранить предварительную заявку</button>
<p class="booking-status" data-booking-status role="status" aria-live="polite"></p>
</form>
<details class="saved-bookings"><summary>Заявки на этом устройстве <span data-booking-count></span></summary>
<p class="small-note">Сохраняются после закрытия страницы. На другом устройстве они не появятся. Очистка данных браузера удалит заявки; при необходимости скачайте копию.</p>
<div data-booking-list></div><button type="button" class="button outline small" data-booking-export>Скачать заявки (JSON)</button>
</details>
<noscript><p>Для сохранения заявки включите JavaScript или позвоните в клинику.</p></noscript>
</div></dialog>`;
