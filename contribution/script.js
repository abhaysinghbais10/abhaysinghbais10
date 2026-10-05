const calendar=document.getElementById('calendar');
const totalEl=document.getElementById('total'), activeEl=document.getElementById('active'), streakEl=document.getElementById('streak'), statusEl=document.getElementById('status');
const cols=52, rows=7; let cells=[]; let snake=[]; let head=0; let timer=null; let running=true; let interval=95;

function seeded(n){const x=Math.sin(n*12.9898)*43758.5453;return x-Math.floor(x)}
function build(boost=1){
  calendar.innerHTML=''; cells=[]; let total=0,active=0,best=0,current=0;
  for(let c=0;c<cols;c++) for(let r=0;r<rows;r++){
    const wave=(Math.sin(c*.39+r*.9)+1)/2; const noise=seeded(c*17+r*31); let level=0;
    const chance=(.20+wave*.55)*boost;
    if(noise<chance){ level=1+(noise>0.72?3:noise>0.48?2:1); active++; total+=level; current++; best=Math.max(best,current) } else current=0;
    const el=document.createElement('span'); el.className='cell'+(level?' l'+Math.min(level,4):''); el.dataset.index=c*rows+r; el.title=level?`${level} visual contribution${level>1?'s':''}`:'No activity'; calendar.appendChild(el); cells.push(el);
  }
  totalEl.textContent=total.toLocaleString(); activeEl.textContent=active.toLocaleString(); streakEl.textContent=best;
  snake=Array.from({length:Math.min(28,cells.length)},(_,i)=>i*3%cells.length); head=0;
}
function tick(){if(!running)return; cells.forEach(x=>x.classList.remove('snake')); head=(head+1)%cells.length; const body=[]; for(let i=0;i<snake.length;i++) body.push((head-i*3+cells.length*3)%cells.length); body.forEach(i=>cells[i]?.classList.add('snake')); statusEl.textContent=`Snake is moving through day ${Math.floor(head/7)+1} of 364…`;}
function restart(){clearInterval(timer);timer=setInterval(tick,interval);}
document.getElementById('toggle').onclick=e=>{running=!running;e.target.textContent=running?'Pause snake':'Resume snake';if(running)restart()};
document.getElementById('boost').onclick=()=>{build(1.28);tick()};
document.getElementById('speed').oninput=e=>{interval=Number(e.target.value);restart()};
document.getElementById('legend').innerHTML='<i></i><i></i><i></i><i></i><i></i>';
build();tick();restart();
