// Task 2 A. Change data first; render the page second.
'use strict';
const LIMIT=3;
const tasks=[
{id:'t1',title:'Build semantic structure',tag:'HTML',priority:1,status:'todo',required:true,details:{minutes:20}},
{id:'t2',title:'Label all form fields',tag:'HTML',priority:2,status:'todo',required:true,details:{minutes:20}},
{id:'t3',title:'Create mobile breakpoints',tag:'CSS',priority:1,status:'doing',required:true,details:{minutes:20}},
{id:'t4',title:'Style keyboard focus',tag:'CSS',priority:2,status:'todo',required:true,details:{minutes:20}},
{id:'t5',title:'Practice random numbers',tag:'JS',priority:1,status:'doing',required:true,details:{minutes:20}},
{id:'t6',title:'Explore strict equality',tag:'JS',priority:2,status:'done',required:true,details:{minutes:20}},
{id:'t7',title:'Render cards from data',tag:'JS',priority:1,status:'doing',required:true,details:{minutes:20}},
{id:'t8',title:'Try a new palette',tag:'CSS',priority:3,status:'todo',required:false,details:{minutes:10}},
{id:'t9',title:'Write image alternatives',tag:'HTML',priority:2,status:'done',required:true,details:{minutes:20}},
{id:'t10',title:'Validate cross field rules',tag:'JS',priority:1,status:'todo',required:true,details:{minutes:20}},
{id:'t11',title:'Practice event delegation',tag:'JS',priority:2,status:'todo',required:true,details:{minutes:20}},
{id:'t12',title:'Add hover effects',tag:'CSS',priority:3,status:'todo',required:false,details:{minutes:10}}];
const columns=[{id:'todo',name:'To do'},{id:'doing',name:'In progress'},{id:'done',name:'Done'}];
const container=document.querySelector('#items'), boardMessage=document.querySelector('#board-message');
function node(tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.classList.add(cls);return el;}
function renderBoard(){
 const query=document.querySelector('#search').value.trim().toLowerCase(), tag=document.querySelector('#filter').value;
 const order=document.querySelector('#sort').value==='asc'?1:-1;
 const visible=tasks.filter(t=>t.title.toLowerCase().includes(query)&&(tag==='all'||t.tag===tag)).sort((a,b)=>order*(a.priority-b.priority));
 let completed=0;for(const task of tasks)if(task.status==='done')completed+=1;
 document.querySelector('#progress').value=tasks.length?completed/tasks.length*100:0;
 document.querySelector('#progress-label').textContent=`${completed} of ${tasks.length} tasks complete`;
 container.replaceChildren();
 for(const column of columns){
  const section=node('section','','column');section.append(node('h3',column.name));
  const items=visible.filter(t=>t.status===column.id);
  if(!items.length)section.append(node('p','No matching tasks.','empty'));
  for(const task of items){
   const card=node('article','','card');card.append(node('small',`${task.tag} / PRIORITY ${task.priority}`),node('h4',task.title),node('p',`${task.required?'Core learning task':'Optional exploration'} / ${task.details?.minutes ?? 20} min`));
   for(const target of columns){if(target.id===task.status)continue;const button=node('button',`Move to ${target.name}`);button.type='button';button.dataset.id=task.id;button.dataset.target=target.id;card.append(button);}
   section.append(card);
  }container.append(section);
 }
}
// A single listener survives recreation of every card.
container.addEventListener('click',event=>{
 const button=event.target.closest('button[data-id]');if(!button||!container.contains(button))return;
 const task=tasks.find(t=>t.id===button.dataset.id), target=button.dataset.target;
 if(!task||!columns.some(c=>c.id===target))return;
 let active=0;for(const item of tasks)if(item.status==='doing')active+=1;
 if(target==='doing'&&task.status!=='doing'&&active>=LIMIT){boardMessage.textContent=`Move blocked: In progress already has ${LIMIT} cards. Move one out first.`;return;}
 task.status=target;boardMessage.textContent=`${task.title} moved to ${columns.find(c=>c.id===target).name}.`;renderBoard();
 container.querySelector(`button[data-id="${task.id}"]`)?.focus();
});
document.querySelector('#search').addEventListener('input',renderBoard);
for(const id of ['filter','sort'])document.getElementById(id).addEventListener('change',renderBoard);
renderBoard();
