import * as THREE from "three"

export default class Controller {
    constructor(){
        this.mouse = new THREE.Vector2();

        //suport mobile
        document.addEventListener('touchstart', (e)=>{
            this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }, false)
        document.addEventListener('touchmove', (e)=>{
            this.mouse.x = (e.touches[0].clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.touches[0].clientY / window.innerHeight) * 2 + 1;
        }, false)

        //suport desktop
        document.addEventListener('mousemove', (e)=>{
            this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
            this.mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
        }, false)

        //return mouse or touch coordinate in vec2
        return this.mouse
    }
}