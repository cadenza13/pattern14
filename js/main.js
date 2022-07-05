'use strict';

(() =>{
  class Dice{
    constructor(){
      this.images = [
        'img/dice01.png',
        'img/dice02.png',
        'img/dice03.png',
        'img/dice04.png',
        'img/dice05.png',
        'img/dice06.png',
      ];

      for(let i = 0; i < this.images.length; i++){
        const preloadImage = document.createElement('img');
        preloadImage.src = this.images[i];
      }

      this.image = document.getElementById('dice');
      this.btn = document.getElementById('dice-btn');

      this.number = 0;
      this.switch = false;
      this.stop = false;

      this.btn.addEventListener('click', () =>{
        if(this.stop){
          return;
        }
    
        if(this.switch){
          this.stop = true;
          this.btn.textContent = 'サイコロを振る';
          this.btn.classList.add('pressed');
        } else {
          this.diceRoll();
          this.btn.textContent = 'サイコロを止める';
          this.switch = true;
        }
      });
    }

    diceRoll(){
      if(this.stop){
        if(event.battleSwitch){
          setTimeout(() =>{
            battle.match(this.number);
          }, 500);

          this.switch = false;
          return;
        }

        map.move();
        setTimeout(() =>{
          chara.move();
        }, 500);
  
        this.switch = false;
        return;
      }
  
      setTimeout(() =>{
        this.number = Math.floor(Math.random() * this.images.length);
        this.image.src = this.images[this.number];
        this.diceRoll();
      }, 100);
    }

    encounter(){
      this.image.classList.toggle('battle');
    }

    format(){
      if(chara.lifePoint === 0){
        return;
      }

      this.stop = false;
      this.btn.classList.remove('pressed');
    }
  }

  class Chara{
    constructor(){
      this.images = [
        'img/chara01-a.png',
        'img/chara01-b.png',
        'img/chara01-a.png',
        'img/chara01-c.png',
        'img/chara01-d.png',
        'img/chara01-e.png',
      ];

      for(let i = 0; i < this.images.length; i++){
        const preloadImage = document.createElement('img');
        preloadImage.src = this.images[i];
      }

      this.image = document.getElementById('chara');
      this.lifeDisplay = document.getElementById('life-point');
      this.imageNumber = 0;
      this.moveNumber = 0;
      this.lifePoint = 5;

      this.lifeDisplay.textContent = `LP : ${this.lifePoint}`;
    }

    move(){
      if(event.clearSwitch){
        return;
      }
  
      if((dice.number + 1) * 4 === this.moveNumber){
        this.moveNumber = 0;
  
        setTimeout(() =>{
          event.execution();
        }, 500);
        return;
      }
  
      setTimeout(() =>{
        if(this.imageNumber === 3){
          this.imageNumber = 0;
        } else {
          this.imageNumber++;
        }
        this.image.src = this.images[this.imageNumber];
        this.moveNumber++;
        this.move();
      }, 125);
    }

    facialChange(n){
      this.image.src = this.images[n];
    }

    update(n){
      this.lifePoint += n;
      if(this.lifePoint > 5){
        this.lifePoint = 5;
      }
      this.lifeDisplay.textContent = `LP : ${this.lifePoint}`;

      if(this.lifePoint === 0){
        setTimeout(() =>{
          this.image.classList.add('down');
          event.gameOver();
        }, 500);
      }
    }
  }

  class Map{
    constructor(length){
      this.gameMap = document.getElementById('map');
      this.lengthDisplay = document.getElementById('map-length');
      this.moveNumber = 0;
      this.currentMove = 0;
      this.mapLength = length + 1;
      this.leftOver = length + 1;

      for(let i = 0; i < this.mapLength - 1; i++){
        const li = document.createElement('li');
        const p = document.createElement('p');
        const eventNumber = Math.floor(Math.random() * event.events.length);
    
        li.appendChild(p);
        this.gameMap.appendChild(li);
    
        p.textContent = event.events[eventNumber].text;
        event.mapEvents.push(event.events[eventNumber].id);
      }

      this.lengthDisplay.textContent = `残り${this.leftOver}マス`;
      this.goalCreate();
    }

    move(){
      setTimeout(() =>{
        if(this.currentMove === event.mapEvents.length){
          setTimeout(() =>{
            event.gameClear();
          }, 500);

          event.clearSwitchChange();
          return;
        }
  
        if(dice.number + 1 === this.moveNumber){
          this.moveNumber = 0;
          return;
        }
  
        this.gameMap.style.transform += 'translateX(-110px)';
        this.moveNumber++;
        this.currentMove++;
        this.update();
        this.move();
      }, 500);
    }

    eventMove(n){
      this.gameMap.style.transform += `translateX(${-110 * n}px)`;
      this.currentMove += n;
      this.update();
    }

    eventBack(n){
      this.gameMap.style.transform += `translateX(${110 * n}px)`;
      this.currentMove -= n;
      this.update();
    }

    goalCreate(){
      const li = document.createElement('li');
      const p = document.createElement('p');

      li.appendChild(p);
      this.gameMap.appendChild(li);

      p.textContent = 'ゴール';
    }

    update(){
      this.leftOver = this.mapLength - this.currentMove;
      this.lengthDisplay.textContent = `残り${this.leftOver}マス`;
    }
  }

  class Event{
    constructor(container){
      this.events = [
        {text: '1マス進む', id: 1},
        {text: '2マス進む', id: 2},
        {text: '1マス戻る', id: 3},
        {text: '2マス戻る', id: 4},
        {text: 'トラップ', id: 5},
        {text: '回復', id: 6},
        {text: 'バトル', id: 7},
        {text: 'バトル', id: 8},
        {text: 'バトル', id: 9},
      ];

      this.text = document.getElementById('event-text');
      this.container = container;
      this.clearDisplay = document.querySelector('.result');
      this.mapEvents = [0];
      this.battleSwitch = false;
      this.clearSwitch = false;
    }

    execution(){
      switch(this.mapEvents[map.currentMove]){
        case 1:
          map.eventMove(1);
          this.text.innerText = '移動マスに止まった!\n1マス進む!';
          chara.facialChange(4);
          break;
        case 2:
          if(map.currentMove + 2 > this.mapEvents.length){
            map.eventMove(1);
          } else {
            map.eventMove(2);
          }
          this.text.innerText = '移動マスに止まった!\n2マス進む!';
          chara.facialChange(4);
          break;
        case 3:
          map.eventBack(1);
          this.text.innerText = '移動マスに止まった!\n1マス戻る!';
          chara.facialChange(5);
          break;
        case 4:
          if(map.currentMove === 1){
            map.eventBack(1);
          } else {
            map.eventBack(2);
          }
          this.text.innerText = '移動マスに止まった!\n2マス戻る!';
          chara.facialChange(5);
          break;
        case 5:
          chara.update(-1);
          this.text.innerText = 'トラップマスだ!\nLPが1減った!';
          chara.facialChange(5);
          break;
        case 6:
          chara.update(1);
          this.text.innerText = '回復マスだ!\nLPが1増えた!';
          chara.facialChange(4);
          break;
        case 7:
          this.encounter();
          setTimeout(() =>{
            this.text.innerText = 'メダマン\n3以上の目が出れば勝利!';
            battle.encounter(0, 1);
          }, 1000);
          break;
        case 8:
          this.encounter();
          setTimeout(() =>{
            this.text.innerText = 'つぎはぎウサギ\n4以上の目が出れば勝利!';
            battle.encounter(1, 2);
          }, 1000);
          break;
        case 9:
          this.encounter();
          setTimeout(() =>{
            this.text.innerText = 'オルトロス\n6以上の目が出れば勝利!';
            battle.encounter(2, 4);
          }, 1000);
          break;
      }
  
      if(map.currentMove === this.mapEvents.length){
        setTimeout(() =>{
          this.gameClear();
        }, 500);

        this.clearSwitchChange();
        return;
      }

      if(!this.battleSwitch){
        setTimeout(() =>{
          dice.format();
        }, 500);
      }
    }

    encounter(){
      this.text.innerText = '敵があらわれた!';
      this.battleSwitch = true;
    }

    liveComment(result){
      switch(result){
        case 'winner':
          this.text.innerText = '攻撃に成功した!\nさぁ、先へ進もう!';
          break;
        case 'lost':
          this.text.innerText = '攻撃に失敗した!\n反撃で1のダメージ!';
          break;
      }
    }

    gameClear(){
      this.text.innerText = 'ゴールしました!\nおめでとうございます!';
      chara.facialChange(4);
      this.clearDisplay.classList.remove('hidden');

      setTimeout(() =>{
        this.clearDisplay.classList.add('show');
        this.container.classList.add('thin');
      }, 1500);
    }

    gameOver(){
      this.text.innerText = 'ユーレイ君は力尽きた…。';
      setTimeout(() =>{
        window.location = 'index.html';
      }, 2000);
    }

    clearSwitchChange(){
      this.clearSwitch = true;
    }

    battleSwitchChange(){
      this.battleSwitch = false;
    }
  }

  class Battle{
    constructor(){
      this.images = [
        'img/monster01.png',
        'img/monster02.png',
        'img/monster03.png',
      ];

      for(let i = 0; i < this.images.length; i++){
        const preloadImage = document.createElement('img');
        preloadImage.src = this.images[i];
      }

      this.monster = document.getElementById('monster');
      this.level = 0;
    }

    encounter(n, level){
      this.monster.src = this.images[n];
      this.level = level;

      this.monster.classList.remove('hidden');
      dice.encounter();
      dice.format();
    }

    match(n){
      if(n > this.level){
        event.liveComment('winner');
        this.monster.classList.add('down');
        chara.facialChange(4);

        setTimeout(() =>{
          this.monster.classList.add('hidden');
          this.monster.classList.remove('down');

          dice.encounter();
          event.battleSwitchChange();
          dice.format();
        }, 1500);
      } else {
        event.liveComment('lost');
        chara.update(-1);
        chara.facialChange(5);

        setTimeout(() =>{
          dice.format();
        }, 500);
      }
    }
  }

  const title = document.querySelector('.title');
  const container = document.querySelector('.container');
  const startBtn = document.getElementById('start-btn');
  const titleBtn = document.getElementById('title-btn');

  startBtn.addEventListener('click', () =>{
    title.classList.add('hidden');
    container.classList.remove('hidden');
  });

  titleBtn.addEventListener('click', e =>{
    if(event.clearSwitch){
      e.preventDefault();
    }
  });

  const dice = new Dice();
  const chara = new Chara();
  const event = new Event(container);
  const map = new Map(9);
  const battle = new Battle();
})();