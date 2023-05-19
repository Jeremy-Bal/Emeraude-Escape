import * as THREE from "three";

export default class CollisionChecker{
    constructor(_options){
        this.event = _options.event;
        this.parameter = _options.parameter;
        this.player = _options.player;
        this.spawner = _options.spawner;

        //set a new raycast it will be used for each popCorn
        this.raycaster = new THREE.Raycaster();
        this.raycaster.far = 0.1
    }

    checkCollision(){
        //if game has popcorn
        if(this.spawner.objectLists.length)
        {
            //I check all actual popCorn 
            for(let list in this.spawner.objectLists){
                for(let item in this.spawner.objectLists[list]){
                    //check if the popcorn is on the ground with sleep atribute
                    if(!this.spawner.objectLists[list][item].sleep)
                    {
                        //if the popcorn isn't slepping, add raycast to all others
                        this.raycaster.set(this.spawner.objectLists[list][item].position, new THREE.Vector3(0, -1, 0))
                        const intersect = this.raycaster.intersectObject(this.player.playerCollider)
            
                        //if popcorn intercect with player.playerCollider
                        if(intersect.length){
                            //update score
                            this.addPoint(this.spawner.objectLists[list][item])
                            setTimeout(()=>{
                                //and destroy it with a little timeout, so they can fall in bucket
                                this.parameter.destroy(this.spawner.objectLists[list][item])
                            }, 100)
                        }
                    }
                }
            }
        }

    }

    addPoint(item){
        if(item.name == 'good'){
            this.parameter.score += 1;
        } else if (item.name == 'bad'){
            if(this.parameter.score > 0){
                this.parameter.score -= 1;
            }
            this.parameter.multiplier = 1;
        } else {
            this.parameter.score += 5 * this.parameter.multiplier;
            this.parameter.multiplier += 1
        }

        //udate score html
        const el = document.querySelector('.score span')
        el.innerHTML = this.parameter.score

        this.event.updateScoreIndicator();
    }



    update(){
        this.checkCollision();
    }
}