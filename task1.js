// Task 1 A. All numeric game settings are defined here.
'use strict';
const MIN=1, MAX=100, START_LIVES=3, ZERO=0, STEP=1;
let current, lives, streak, best=ZERO;
const message=document.querySelector('#game-message');
function randomScore(){return Math.floor(Math.random()*(MAX-MIN+STEP))+MIN;}
function renderGame(){
 document.querySelector('#score').textContent=current;
 document.querySelector('#stats').textContent=`Lives: ${lives} / Streak: ${streak} / Best: ${best}`;
 document.querySelector('#higher').disabled=lives===ZERO;
 document.querySelector('#lower').disabled=lives===ZERO;
}
function playGuess(direction){
 if(lives===ZERO || (direction!=='higher' && direction!=='lower')){message.textContent=lives===ZERO?'Game over. Restart to play.':'Choose Higher or Lower.';return;}
 const next=randomScore(), previous=current;
 const correct=next===current || (direction==='higher' && next>current) || (direction==='lower' && next<current);
 if(correct){streak+=STEP;best=Math.max(best,streak);}else{lives-=STEP;streak=ZERO;}
 current=next;
 message.classList.toggle('success',correct);message.classList.toggle('loss',!correct);
 if(lives===ZERO) message.textContent=`${previous} → ${next}. Game over. Best streak: ${best}.`;
 else if(next===previous) message.textContent=`${previous} → ${next}. Equal scores count as correct!`;
 else message.textContent=`${previous} → ${next}. ${correct?'Correct guess!':'One life lost.'}`;
 renderGame();
}
function restartGame(){current=randomScore();lives=START_LIVES;streak=ZERO;message.textContent=`${START_LIVES} lives. Trust your instinct.`;message.classList.remove('success','loss');renderGame();}
for(const direction of ['higher','lower'])document.getElementById(direction).addEventListener('click',()=>playGuess(direction));
document.querySelector('#restart').addEventListener('click',restartGame);
restartGame();

document.querySelector('#game > p').textContent = `Guess the next score from ${MIN} to ${MAX}. Equal scores count as correct.`;
