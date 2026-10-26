// Task 3 B. Validation is separate from rendering and submission.
'use strict';
const BUDGET=20, MIN_SKILL=1, MAX_SKILL=10, CLASS_MIN=5;
const takenNames=['admin','hero','rasuli'];
const classSkills={mage:'magic',warrior:'strength',rogue:'agility'};
const skills=['strength','magic','agility','wisdom'], fields=['name','class','color',...skills];
const form=document.querySelector('#form'), touched=new Set();let submitted=false;
form.noValidate=true;
function readCharacter(){const data={};for(const field of fields)data[field]=skills.includes(field)?Number(form.elements[field].value):form.elements[field].value.trim();return data;}
function sum(data){let total=0;for(const skill of skills)total+=data[skill];return total;}
function validate(data){
 const errors={};
 for(const field of fields){const input=form.elements[field];input.setCustomValidity('');if(!input.checkValidity())errors[field]=skills.includes(field)?'Enter a whole number from 1 to 10.':field==='name'?'Use 3–20 characters: start with a letter; letters, digits and spaces only.':'Choose an available option.';}
 if(takenNames.includes(data.name.toLowerCase()))errors.name='This name is already taken.';
 if(!Object.hasOwn(classSkills,data.class))errors.class='Choose an available class.';
 if(!['violet','teal','amber'].includes(data.color))errors.color='Choose an available color.';
 for(const skill of skills)if(!Number.isInteger(data[skill])||data[skill]<MIN_SKILL||data[skill]>MAX_SKILL)errors[skill]='Enter a whole number from 1 to 10.';
 const required=classSkills[data.class];if(required&&data[required]<CLASS_MIN)errors[required]=`${data.class} requires ${required} of at least ${CLASS_MIN}.`;
 if(sum(data)!==BUDGET&&!errors.wisdom)errors.wisdom=`All four skills must total exactly ${BUDGET}. Adjust your allocation.`;
 for(const field of fields)form.elements[field].setCustomValidity(errors[field]||'');return errors;
}
function characterCard(data,final=false){
 const card=document.createElement('article');card.classList.add('character');if(['violet','teal','amber'].includes(data.color))card.classList.add(data.color);
 const title=document.createElement('h3');title.textContent=data.name||'Your next hero';card.append(title);
 const info=document.createElement('p');info.textContent=`${final?'Created':'Draft'} / ${data.class}`;card.append(info);
 for(const skill of skills){const line=document.createElement('p');line.textContent=`${skill}: ${Number.isFinite(data[skill])?data[skill]:'—'}`;card.append(line);}return card;
}
function updateForm(){
 const data=readCharacter(), errors=validate(data);document.querySelector('#preview').replaceChildren(characterCard(data));
 document.querySelector('#points').textContent=`Points left: ${BUDGET-sum(data)} / ${BUDGET}`;
 for(const field of fields){const show=touched.has(field)||submitted;document.getElementById(`${field}-error`).textContent=show?errors[field]||'':'';if(show)form.elements[field].setAttribute('aria-invalid',String(Boolean(errors[field])));else form.elements[field].removeAttribute('aria-invalid');}
 document.querySelector('#summary').textContent=submitted&&Object.keys(errors).length?`${Object.keys(errors).length} fields need attention. Correct them below.`:'';return errors;
}
for(const field of fields){const input=form.elements[field];input.addEventListener('blur',()=>{touched.add(field);updateForm();});input.addEventListener('input',updateForm);input.addEventListener('change',updateForm);}
form.addEventListener('submit',event=>{
 event.preventDefault();submitted=true;const errors=updateForm(), first=fields.find(field=>errors[field]);if(first){form.elements[first].focus();return;}
 const data=readCharacter(), heading=document.createElement('h3');heading.textContent='Character created successfully';heading.classList.add('success');
 document.querySelector('#result').replaceChildren(heading,characterCard(data,true));takenNames.push(data.name.toLowerCase());form.reset();touched.clear();submitted=false;updateForm();
});updateForm();
