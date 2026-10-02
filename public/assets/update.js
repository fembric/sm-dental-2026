// Source-backed price search: completely local, with no network requests.
const priceSearch=document.querySelector('[data-price-search]');
if(priceSearch){let group='all';const rows=[...document.querySelectorAll('[data-price-row]')];const filter=()=>{const term=priceSearch.value.toLocaleLowerCase('ru').trim();let visible=0;for(const row of rows){row.hidden=!((group==='all'||row.dataset.group===group)&&row.textContent.toLocaleLowerCase('ru').includes(term));if(!row.hidden)visible++}document.querySelector('[data-price-status]').textContent=`Позиций: ${visible}`;document.querySelector('[data-price-empty]').hidden=visible>0};priceSearch.addEventListener('input',filter);document.querySelectorAll('[data-price-filter]').forEach(button=>button.addEventListener('click',()=>{group=button.dataset.priceFilter;document.querySelectorAll('[data-price-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filter()}));document.querySelector('[data-price-reset]').addEventListener('click',()=>{group='all';priceSearch.value='';document.querySelectorAll('[data-price-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.priceFilter==='all')));filter();priceSearch.focus()})}

// Natural document scroll drives an exploded anatomical diagram. No wheel trap.
const anatomy=document.querySelector('[data-anatomy-scroll]');
if(anatomy){
 const motion=matchMedia('(prefers-reduced-motion: reduce)');
 const sticky=anatomy.querySelector('.anatomy-sticky');
 const panels=[...anatomy.querySelectorAll('[data-panel]')];
 const buttons=[...anatomy.querySelectorAll('[data-tooth-step]')];
 const staticButton=anatomy.querySelector('[data-anatomy-static]');
 const offsets={enamel:[-180,-50],dentin:[185,0],pulp:[0,55],cementum:[-200,60]};
 const stages={enamel:[.07,.28],dentin:[.27,.48],pulp:[.47,.68],cementum:[.67,.88]};
 let frame=0,manualStatic=false,lastIndex=-1;
 const clamp=n=>Math.min(1,Math.max(0,n));
 const ease=n=>n*n*(3-2*n);
 const render=(progress,staticMode)=>{for(const [key,[start,end]]of Object.entries(stages)){const local=ease(clamp((progress-start)/(end-start)));const [x,y]=offsets[key];anatomy.querySelector(`[data-layer="${key}"]`).setAttribute('transform',`translate(${(local*x).toFixed(2)} ${(local*y).toFixed(2)})`);anatomy.querySelector(`[data-label="${key}"]`).style.opacity=clamp((local-.65)/.35)}const index=staticMode?5:Math.min(5,Math.floor(progress*5+.2));if(index!==lastIndex){panels.forEach((panel,i)=>{panel.hidden=i!==index;panel.classList.toggle('is-active',i===index)});buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));lastIndex=index}anatomy.querySelector('.tooth-intact-labels').style.opacity=1-clamp(progress/.12);anatomy.querySelector('[data-anatomy-percent]').textContent=Math.round(progress*100)+'%';anatomy.querySelector('.anatomy-progress span').style.width=progress*100+'%';anatomy.dataset.progress=progress.toFixed(3)};
 const isStatic=()=>manualStatic||motion.matches;
 const available=()=>Math.max(1,anatomy.offsetHeight-sticky.offsetHeight);
 const topOffset=()=>parseFloat(getComputedStyle(sticky).top)||0;
 const update=()=>{frame=0;const fixed=isStatic();const progress=fixed?1:clamp((topOffset()-anatomy.getBoundingClientRect().top)/available());render(progress,fixed)};
 const schedule=()=>{if(!frame)frame=requestAnimationFrame(update)};
 const setMode=()=>{anatomy.classList.toggle('is-static',isStatic());staticButton.setAttribute('aria-pressed',String(isStatic()));staticButton.textContent=isStatic()?(motion.matches?'Движение отключено в настройках устройства':'Включить анимацию'):'Показать без анимации';staticButton.disabled=motion.matches;lastIndex=-1;schedule()};
 buttons.forEach(button=>button.addEventListener('click',()=>{const step=Number(button.dataset.toothStep);const desired=step===0?0:step===5?1:(step*.2+.025);const target=scrollY+anatomy.getBoundingClientRect().top-topOffset()+available()*desired;window.scrollTo({top:target,behavior:motion.matches?'instant':'smooth'})}));
 staticButton.addEventListener('click',()=>{const wasTop=anatomy.getBoundingClientRect().top;manualStatic=!manualStatic;setMode();if(wasTop<0)anatomy.scrollIntoView({behavior:'instant',block:'start'})});
 motion.addEventListener('change',setMode);window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});setMode();
}
