const menuButton=document.querySelector('.menu-toggle');
const menu=document.querySelector('.desktop-nav');
menuButton?.addEventListener('click',()=>{const open=menuButton.getAttribute('aria-expanded')!=='true';menuButton.setAttribute('aria-expanded',String(open));menuButton.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню');menu.classList.toggle('is-open',open)});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&menu?.classList.contains('is-open')){menu.classList.remove('is-open');menuButton.setAttribute('aria-expanded','false');menuButton.setAttribute('aria-label','Открыть меню');menuButton.focus()}});
const reader=document.querySelector('[data-reader]');
function setReader(on){document.documentElement.classList.toggle('reader-mode',on);reader?.setAttribute('aria-pressed',String(on));if(reader)reader.textContent=on?'Обычная версия':'Увеличить текст'}
try{setReader(localStorage.getItem('sm-reader')==='true')}catch{}
reader?.addEventListener('click',()=>{const on=!document.documentElement.classList.contains('reader-mode');setReader(on);try{localStorage.setItem('sm-reader',String(on))}catch{}});
const dialog=document.querySelector('#appointment-dialog');
document.querySelectorAll('[data-appointment]').forEach(button=>button.addEventListener('click',()=>{dialog.querySelector('.dialog-context').textContent=button.dataset.appointment||'Первый шаг к здоровой улыбке';dialog.showModal();document.body.classList.add('modal-open')}));
dialog?.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog?.addEventListener('close',()=>document.body.classList.remove('modal-open'));
dialog?.addEventListener('click',event=>{if(event.target===dialog){const b=dialog.getBoundingClientRect();if(event.clientX<b.left||event.clientX>b.right||event.clientY<b.top||event.clientY>b.bottom)dialog.close()}});
if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('is-visible');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.reveal').forEach(el=>{el.classList.add('is-observed');observer.observe(el)})}
const serviceSearch=document.querySelector('[data-service-search]');
let activeCategory='all';
function filterServices(){const query=serviceSearch?.value.trim().toLocaleLowerCase('ru')||'';let count=0;document.querySelectorAll('[data-service-card]').forEach(card=>{const visible=(activeCategory==='all'||card.dataset.category===activeCategory)&&card.textContent.toLocaleLowerCase('ru').includes(query);card.hidden=!visible;if(visible)count++});const empty=document.querySelector('[data-empty]');if(empty)empty.hidden=count>0;const status=document.querySelector('[data-search-status]');if(status)status.textContent='Направлений: '+count}
serviceSearch?.addEventListener('input',filterServices);
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{activeCategory=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterServices()}));
document.querySelector('[data-reset-search]')?.addEventListener('click',()=>{serviceSearch.value='';activeCategory='all';document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));filterServices();serviceSearch.focus()});
const checklist=document.querySelector('[data-checklist]');
if(checklist){const inputs=[...checklist.querySelectorAll('input[type=checkbox]')];const update=()=>{const n=inputs.filter(i=>i.checked).length;checklist.querySelector('.progress-fill').style.width=(n/inputs.length*100)+'%';checklist.querySelector('.check-status').textContent=n===inputs.length?'Всё готово. До встречи на приёме!':`Готово ${n} из ${inputs.length}`};inputs.forEach(i=>i.addEventListener('change',update));checklist.querySelector('[data-reset-checks]').addEventListener('click',()=>{inputs.forEach(i=>i.checked=false);update()});checklist.querySelector('[data-print]').addEventListener('click',()=>window.print());update()}
