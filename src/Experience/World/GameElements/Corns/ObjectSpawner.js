import Starter from "../Starter";
import Corn from "./Corn";
import Time from "../../../Utils/Time";

export default class ObjectSpawner {
    constructor(_options){
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.player = _options.player.player;

        this.corn = new Corn({
            scene: this.scene,
            resources: this.resources, 
            parameter: this.parameter,
            cornCount: this.objectLists
        });

        this.objectLists = [];
        this.objectLists.push(this.corn.goodItems, this.corn.badItems, this.corn.bonusItems)
        
        this.event.on('StopTimer', () => {
            this.destroyCorns();
        })
        
        //I used elapsed time and currentTime to subtract and get a timer
        this.time = new Time()
        this.currentElapsedTime = 0

        //With this variable I know if the game is on
        this.onCurrentGame = true

        //Set this variable for game duration
        this.gameDuration = 15000
        this.setNewGame()
    }

    setNewGame(){
        //Set timer in second with 0 on min value 
        const timeInSecond = Math.max((this.gameDuration - (this.time.elapsedTime - this.currentElapsedTime)) / 1000, 0)

        //update html
        const el = document.querySelector('.time span')
        el.innerHTML = timeInSecond.toFixed(1)

        //update color at the end of the timer
        if(timeInSecond < 5){
            el.style.color = 'red'
        }else{
            el.style.color = '#f8b662'
        }

        //when a new game is created (this.onCurrentGame === false), I set a new timer (timeout) with 'gameDuration' variable
        if(!this.onCurrentGame){
            //new game created
            this.onCurrentGame = true
            setTimeout(()=>{
                //I get the final score and the hight score to compare them
                const newScore = this.parameter.score
                const el = document.querySelector('.best span')
                const actualScore = parseInt(el.innerHTML)

                //If the newest score is higher
                if(newScore > actualScore){
                    el.innerHTML = newScore
                }

                //reset game
                this.event.reset()
                this.destroyCorns()
                this.onCurrentGame = false
                
            }, this.gameDuration)
        }
    }

    destroyCorns(){
        for(let list in this.objectLists){
            this.objectLists[list].forEach(element => {
                this.parameter.destroy(element)
            });
        }
    }

    spawnItem(deltaT){
        const randomN = Math.random();
        const randomSignX = (Math.random() - 0.5) * 4.3;
        
        const posX = randomSignX;

        if(randomN < .0025 * deltaT){
            this.corn.setItem(posX)
        }
    }

    moveItems(deltaT){
        for(let list in this.objectLists){
            for(let item in this.objectLists[list]){
                if(this.objectLists[list][item].position.y > -4.5){
                    this.objectLists[list][item].position.y -= this.objectLists[list][item].userData.speed * deltaT
                    this.objectLists[list][item].rotation.z += this.objectLists[list][item].userData.speed * deltaT
                    this.objectLists[list][item].sleep = false
                }else{
                    this.objectLists[list][item].sleep = true
                }


                if(this.objectLists[list][item].position.x < -3 || this.objectLists[list][item].position.x > 3){
                    this.parameter.destroy(this.objectLists[list][item]);
                    this.objectLists[list].splice(item, 1)
                }
            }
        }
    }

    updateStarter(){
        this.parameter.timer -= 1;
        if(this.parameter.timer == 250){
            this.starter = new Starter({
                scene: this.scene,
                resources: this.resources, 
                parameter: this.parameter
            }, 1)
            this.parameter.sounds.play('sound_Starter_Number')
        } else if(this.parameter.timer == 200){
            this.starter.updateCountdown(2)
            this.parameter.sounds.play('sound_Starter_Number')
        } else if(this.parameter.timer == 150){
            this.starter.updateCountdown(3)
            this.parameter.sounds.play('sound_Starter_Number')
        } else if(this.parameter.timer == 100){
            this.starter.updateCountdown(4)
            this.parameter.sounds.play('sound_Starter_Go')
        } else if(this.parameter.timer == 50){
            this.starter.deleteCountdown();
            this.event.startTimer();

        } else if(this.parameter.timer == 0){ 
            this.parameter.counterOn = false;
            this.parameter.canSpawn = true;

            //when timer is out, set a new game
            this.onCurrentGame = false
            this.currentElapsedTime = this.time.elapsedTime 
        }
    }

    update(deltaT){
        if(this.parameter.canSpawn){
            this.spawnItem(deltaT);
            this.moveItems(deltaT);
            this.setNewGame()
        }
        
        if(this.parameter.counterOn){
            this.updateStarter();
        }
    }
}