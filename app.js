(()=>{
'use strict';
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const slides=$$('.slide'),nav=$$('.rail button'),reduce=matchMedia('(prefers-reduced-motion: reduce)');let current=-1;
const T=(k,...a)=>window.SEOUL_I18N?window.SEOUL_I18N.t(k,...a):k;
function animateCount(el){if(!el||el.dataset.running)return;const target=Number(el.dataset.count),dec=Number(el.dataset.decimals||0);if(reduce.matches)return;el.dataset.running='1';const start=performance.now(),duration=900;const format=n=>n.toLocaleString('en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec});function frame(t){const p=Math.min((t-start)/duration,1);el.textContent=format(target*(1-Math.pow(1-p,3)));if(p<1)requestAnimationFrame(frame);else{el.textContent=format(target);delete el.dataset.running;}}requestAnimationFrame(frame);}
function replay(el){el.classList.remove('replay');void el.offsetWidth;el.classList.add('replay');}
const dayCoverVideo=$('#dayCoverVideo');
function syncDayCover(show){dayCoverVideo.autoplay=show;dayCoverVideo.muted=true;dayCoverVideo.defaultMuted=true;dayCoverVideo.volume=0;if(!show){dayCoverVideo.pause();return;}try{dayCoverVideo.currentTime=0;}catch{}dayCoverVideo.play().catch(()=>{});}
function updateDayPlayback(){const paused=dayCoverVideo.paused;$('#dayCoverToggle').textContent=T(paused?'cover.playBtn':'cover.pauseBtn');$('#dayCoverToggle').setAttribute('aria-label',T(paused?'cover.playAria':'cover.pauseAria'));}
dayCoverVideo.addEventListener('play',updateDayPlayback);dayCoverVideo.addEventListener('pause',updateDayPlayback);
$('#dayCoverToggle').addEventListener('click',()=>{if(dayCoverVideo.paused)dayCoverVideo.play().catch(()=>{});else dayCoverVideo.pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)dayCoverVideo.pause();else if(current===0)dayCoverVideo.play().catch(()=>{});});
const closingShortsVideo=$('#closingShortsVideo');
function syncClosingShorts(show){closingShortsVideo.autoplay=show;closingShortsVideo.muted=true;closingShortsVideo.defaultMuted=true;closingShortsVideo.volume=0;if(!show){closingShortsVideo.pause();return;}try{closingShortsVideo.currentTime=0;}catch{}closingShortsVideo.play().catch(()=>{});}
function updateClosingPlayback(){const paused=closingShortsVideo.paused;$('#closingShortsToggle').textContent=T(paused?'cover.playBtn':'cover.pauseBtn');$('#closingShortsToggle').setAttribute('aria-label',T(paused?'closing.playAria':'closing.pauseAria'));}
closingShortsVideo.addEventListener('play',updateClosingPlayback);closingShortsVideo.addEventListener('pause',updateClosingPlayback);
$('#closingShortsToggle').addEventListener('click',()=>{if(closingShortsVideo.paused)closingShortsVideo.play().catch(()=>{});else closingShortsVideo.pause();});
document.addEventListener('visibilitychange',()=>{if(document.hidden)closingShortsVideo.pause();else if(slides[current]?.contains(closingShortsVideo))closingShortsVideo.play().catch(()=>{});});
function go(n,writeHash=true){n=Math.max(0,Math.min(slides.length-1,n));if(n===current)return;current=n;slides.forEach((s,i)=>{s.hidden=i!==n;s.classList.toggle('active',i===n);s.setAttribute('aria-hidden',String(i!==n));});nav.forEach((b,i)=>{if(i===n)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});$('#currentPage').textContent=String(n+1).padStart(2,'0');$('#currentTitle').textContent=slides[n].dataset.title;$('#progress').style.width=`${(n+1)/slides.length*100}%`;$('#prev').disabled=n===0;$('#next').disabled=n===slides.length-1;$('#live').textContent=T('a11y.slideStatus',n+1,slides.length,slides[n].dataset.title);if(writeHash)history.replaceState(null,'',`#${n+1}`);syncDayCover(n===0);syncClosingShorts(slides[n].contains(closingShortsVideo));slides[n].querySelectorAll('[data-count]').forEach(animateCount);slides[n].querySelectorAll('.bar-row').forEach(replay);window.scrollTo({top:0,behavior:'instant'});document.dispatchEvent(new Event('seoul-slide-change'));}

$$('[data-goto]').forEach(b=>b.addEventListener('click',()=>{go(Number(b.dataset.goto));if($('#overviewDialog').open)$('#overviewDialog').close();}));$('#prev').addEventListener('click',()=>go(current-1));$('#next').addEventListener('click',()=>go(current+1));
let focusFrame;function selectChart(b){$$('.bar-row').forEach(x=>x.dataset.chartActive=String(x===b));const value=Number(b.dataset.value),ring=$('.focus-ring');ring.style.setProperty('--accent',getComputedStyle(b).getPropertyValue('--accent'));$('.focus-label').textContent=b.querySelector('.bar-label').textContent+T('chart.focusSuffix');$('#focusTitle').textContent=b.dataset.chartTitle;$('#focusDesc').textContent=b.dataset.chartDesc;cancelAnimationFrame(focusFrame);if(reduce.matches){$('#focusNumber').textContent=value.toFixed(1);}else{const start=performance.now();const step=t=>{const p=Math.min((t-start)/800,1);$('#focusNumber').textContent=(value*(1-Math.pow(1-p,3))).toFixed(1);if(p<1)focusFrame=requestAnimationFrame(step);};focusFrame=requestAnimationFrame(step);}replay(b);}
function activateOnIntent(selector,fn){$$(selector).forEach(b=>{b.addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')fn(b);});b.addEventListener('focus',()=>{fn(b);});b.addEventListener('click',()=>{fn(b);});});}
$('.bar-row').dataset.chartActive='true';activateOnIntent('.bar-row',selectChart);$$('[data-count]').forEach(el=>{el.parentElement.addEventListener('pointerenter',()=>animateCount(el));});
const assetNames=['gyeongbokgung','jongmyo','changdeokgung','hanbok','craft','kpop','gwangjang','myeongdong','dongdaemun','seongsu','hangang','nseoul','seouldal'];
const photoPaths=window.SEOUL_ASSETS||Object.fromEntries(assetNames.map(name=>[name,`assets/ai-${name}.png`]));
let heritage=[],culture=[],tastes=[],night=[],days=[];
const BASE={
 heritage:[{image:'gyeongbokgung'},{image:'jongmyo'},{image:'changdeokgung'}],
 culture:[{image:'hanbok',link:'https://english.visitseoul.net/walking-tour'},{image:'craft',link:'https://www.seoulculturelounge.com/?lang=env'},{image:'kpop',link:'https://www.seoulculturelounge.com/?lang=env'}],
 tastes:[{image:'gwangjang',link:'https://english.visitseoul.net/PalaceArea/Gwangjang-Market/ENP000286'},{image:'myeongdong',link:'https://korean.visitseoul.net/attractions/명동교자/KOP008570'},{image:'dongdaemun',link:'https://english.visitkorea.or.kr/svc/contents/contentsView.do?menuSn=351&vcontsId=62662'},{image:'seongsu',link:'https://english.visitseoul.net/other/Seongsu-dong-Again/ENN031554'}],
 night:[{image:'hangang',link:'https://english.seoul.go.kr/hangang-parks/'},{image:'nseoul',link:'https://english.seoul.go.kr/namsan-seoul-tower/'},{image:'seouldal',link:'https://english.seoul.go.kr/service/amusement/seouldal/'}]
};
const sectionsFor=(kind,i)=>[[T(`${kind}.${i}.s0t`),T(`${kind}.${i}.s0b`)],[T(`${kind}.${i}.s1t`),T(`${kind}.${i}.s1b`)]];
function buildData(){
 heritage=BASE.heritage.map((m,i)=>({image:m.image,name:T(`heritage.${i}.name`),caption:T(`heritage.${i}.caption`)}));
 culture=BASE.culture.map((m,i)=>({image:m.image,link:m.link,category:'HISTORY & CULTURE',title:T(`culture.${i}.title`),summary:T(`culture.${i}.summary`),kicker:T(`culture.${i}.kicker`),lead:T(`culture.${i}.lead`),sections:sectionsFor('culture',i),tip:T(`culture.${i}.tip`)}));
 tastes=BASE.tastes.map((m,i)=>({image:m.image,link:m.link,category:'TASTE THE NEIGHBORHOOD',name:T(`tastes.${i}.name`),title:T(`tastes.${i}.title`),summary:T(`tastes.${i}.summary`),caption:T(`tastes.${i}.caption`),kicker:T(`tastes.${i}.kicker`),lead:T(`tastes.${i}.lead`),sections:sectionsFor('tastes',i),tip:T(`tastes.${i}.tip`)}));
 night=BASE.night.map((m,i)=>({image:m.image,link:m.link,category:'RIVER & NIGHT VIEW',name:T(`night.${i}.name`),title:T(`night.${i}.title`),summary:T(`night.${i}.summary`),tag:T(`night.${i}.tag`),caption:T(`night.${i}.caption`),kicker:T(`night.${i}.kicker`),lead:T(`night.${i}.lead`),sections:sectionsFor('night',i),tip:T(`night.${i}.tip`)}));
 days=[0,1,2].map(i=>({theme:T(`days.${i}.theme`),stops:[[T(`days.${i}.stop0`),T(`days.${i}.stop0d`)],[T(`days.${i}.stop1`),T(`days.${i}.stop1d`)],[T(`days.${i}.stop2`),T(`days.${i}.stop2d`)]],tip:T(`days.${i}.tip`)}));
}
buildData();
function selectGroup(selector,b){$$(selector).forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-pressed',String(on));});}
function setPhoto(id,key,alt){const img=$(id);img.alt=alt;if(img.dataset.asset===key)return;img.dataset.asset=key;img.src=photoPaths[key];img.alt=alt;img.classList.remove('photo-changing');void img.offsetWidth;img.classList.add('photo-changing');}
function applyHeritage(b){const h=heritage[+b.dataset.heritage];selectGroup('.heritage-node',b);setPhoto('#palacePhoto',h.image,T('heritage.alt',h.name));$('#palaceName').textContent=h.name;$('#palaceCaption').textContent=h.caption;}
$$('.heritage-node').forEach(b=>b.addEventListener('click',()=>applyHeritage(b)));


const detailDrawer=$('#detailDrawer');
function openDetail(item,side,trigger){
 detailDrawer.dataset.editContext=item.kicker;
 detailDrawer.classList.toggle('drawer-left',side==='left');detailDrawer.classList.toggle('drawer-right',side!=='left');
 detailDrawer.style.setProperty('--drawer-accent',getComputedStyle(trigger).getPropertyValue('--accent'));
 $('#detailCategory').textContent=item.category;$('#detailKicker').textContent=item.kicker;$('#detailTitle').textContent=item.title;$('#detailLead').textContent=item.lead;
 $('#detailImage').src=photoPaths[item.image];$('#detailImage').alt=T('detail.altPrefix',item.name||item.title);
 const parts=item.sections.map(([title,body])=>{const section=document.createElement('section'),h=document.createElement('h3'),p=document.createElement('p');h.textContent=title;p.textContent=body;section.append(h,p);return section;});
 $('#detailSections').replaceChildren(...parts);$('#detailTip').textContent=item.tip;$('#detailLink').href=item.link;
 detailDrawer.showModal();detailDrawer.scrollTop=0;document.body.classList.add('detail-open');
}
detailDrawer.addEventListener('close',()=>document.body.classList.remove('detail-open'));
function applyCulture(b){selectGroup('.culture-choice',b);const t=culture[+b.dataset.culture];$('#cultureTitle').textContent=t.title;$('#cultureDesc').textContent=t.summary;}
activateOnIntent('.culture-choice',applyCulture);
$$('.culture-choice').forEach(b=>b.addEventListener('click',()=>openDetail(culture[+b.dataset.culture],'right',b)));
function applyTaste(b){const i=+b.dataset.taste,t=tastes[i];selectGroup('.taste-stop',b);$('#tasteIndex').textContent=String(i+1).padStart(2,'0');$('#tasteIndex').style.color=getComputedStyle(b).getPropertyValue('--accent');$('#tasteTitle').textContent=t.title;$('#tasteDesc').textContent=t.summary;setPhoto('#tastePhoto',t.image,T('taste.alt',t.name));$('#tastePhotoCaption').textContent=t.caption;}
activateOnIntent('.taste-stop',applyTaste);
$$('.taste-stop').forEach(b=>b.addEventListener('click',()=>openDetail(tastes[+b.dataset.taste],'right',b)));
function applyNight(b){const t=night[+b.dataset.night];selectGroup('.night-option',b);$('#nightTipTitle').textContent=t.title;$('#nightTip').textContent=t.summary;setPhoto('#nightPhoto',t.image,T('night.alt',t.name));$('#nightPhotoTag').textContent=t.tag;$('#nightPhotoTitle').textContent=t.title;$('#nightPhotoCaption').textContent=t.caption;}
activateOnIntent('.night-option',applyNight);
$$('.night-option').forEach(b=>b.addEventListener('click',()=>openDetail(night[+b.dataset.night],'left',b)));
// Load the next photographs once their slide is used, keeping the opening slide light.
const warmed=new Set();function warmPhotos(items){items.forEach(item=>{if(warmed.has(item.image))return;warmed.add(item.image);const img=new Image();img.src=photoPaths[item.image];});}
$$('.heritage-node,.culture-choice').forEach(b=>b.addEventListener('pointerenter',()=>warmPhotos([...heritage,...culture]),{once:true}));
$$('.taste-stop').forEach(b=>b.addEventListener('pointerenter',()=>warmPhotos(tastes),{once:true}));
$$('.night-option').forEach(b=>b.addEventListener('pointerenter',()=>warmPhotos(night),{once:true}));

let dayIndex=0;function selectDay(b){const i=+b.dataset.day,d=days[i];$$('.day-tab').forEach(x=>{const on=x===b;x.classList.toggle('selected',on);x.setAttribute('aria-selected',on);});const panel=$('#day-panel');panel.setAttribute('aria-labelledby',b.id);panel.style.setProperty('--accent',getComputedStyle(b).getPropertyValue('--accent'));$('#dayNumeral').textContent=String(i+1).padStart(2,'0');$('#dayTheme').textContent=d.theme;d.stops.forEach((s,j)=>{$(`#stop${j+1}`).textContent=s[0];$(`#stop${j+1}Desc`).textContent=s[1];});$('#dayAdjustment').textContent=d.tip;if(dayIndex!==i){panel.classList.remove('changing');void panel.offsetWidth;panel.classList.add('changing');}dayIndex=i;}
activateOnIntent('.day-tab',selectDay);$$('.day-tab').forEach(b=>b.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.stopPropagation();e.preventDefault();const next=(+b.dataset.day+(e.key==='ArrowRight'?1:2))%3;$$('.day-tab')[next].focus();}}));
async function fullscreen(){try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen();}catch{}}$('#fullscreen').addEventListener('click',fullscreen);
document.addEventListener('fullscreenchange',()=>{const label=T(document.fullscreenElement?'fullscreen.exitAria':'fullscreen.aria');[$('#fullscreen')].forEach(b=>{b.setAttribute('aria-label',label);b.title=label;});});
$$('.close-dialog').forEach(b=>b.addEventListener('click',()=>b.closest('dialog').close()));$$('dialog').forEach(d=>d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close();}}));
$('.overview-grid').innerHTML=slides.map((s,i)=>`<button data-overview="${i}"><span>${String(i+1).padStart(2,'0')}</span>${s.dataset.title}</button>`).join('');$$('[data-overview]').forEach(b=>b.addEventListener('click',()=>{go(+b.dataset.overview);$('#overviewDialog').close();}));$('#overviewBtn').addEventListener('click',()=>$('#overviewDialog').showModal());
document.addEventListener('keydown',e=>{if($$('dialog').some(d=>d.open))return;if(e.target.isContentEditable||['INPUT','TEXTAREA','SELECT','VIDEO'].includes(e.target.tagName))return;if(e.key===' '&&e.target.closest('button,a,[role=tab]'))return;if(e.key==='ArrowRight'||e.key==='PageDown'||e.key===' '){e.preventDefault();go(current+1);}else if(e.key==='ArrowLeft'||e.key==='PageUp'){e.preventDefault();go(current-1);}else if(e.key==='Home'){e.preventDefault();go(0);}else if(e.key==='End'){e.preventDefault();go(slides.length-1);}else if(e.key.toLowerCase()==='f')fullscreen();});
let touchStart;$('#slides').addEventListener('touchstart',e=>{if(e.target.closest('.cinema-controls')){touchStart=null;return;}touchStart=[e.changedTouches[0].clientX,e.changedTouches[0].clientY];},{passive:true});$('#slides').addEventListener('touchend',e=>{if(!touchStart)return;const dx=e.changedTouches[0].clientX-touchStart[0],dy=e.changedTouches[0].clientY-touchStart[1];if(Math.abs(dx)>75&&Math.abs(dx)>Math.abs(dy)*1.6)go(current+(dx<0?1:-1));touchStart=null;},{passive:true});

function refreshI18n(){
 buildData();
 const ab=$('.bar-row[data-chart-active="true"]');if(ab)selectChart(ab);
 const hb=$('.heritage-node.selected');if(hb)applyHeritage(hb);
 const cb=$('.culture-choice.selected');if(cb)applyCulture(cb);
 const tb=$('.taste-stop.selected');if(tb)applyTaste(tb);
 const nb=$('.night-option.selected');if(nb)applyNight(nb);
 const db=$('.day-tab.selected');if(db)selectDay(db);
 if(current>=0){$('#currentTitle').textContent=slides[current].dataset.title;$('#live').textContent=T('a11y.slideStatus',current+1,slides.length,slides[current].dataset.title);}
 updateDayPlayback();updateClosingPlayback();
}
document.addEventListener('seoul-i18n',refreshI18n);

window.addEventListener('hashchange',()=>go(Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1)),false));go(Math.max(0,Math.min(slides.length-1,(parseInt(location.hash.slice(1),10)||1)-1)),false);
})();

