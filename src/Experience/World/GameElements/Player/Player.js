import * as THREE from 'three';
import Controller from './Controller';

export default class Player {
    constructor(_options) {
        this.event = _options.event;
        this.scene = _options.scene;
        this.resources = _options.resources;
        this.parameter = _options.parameter;
        this.camera = _options.camera;

        this.setPlayer();
        this.setInvisibleWall()
        
        //I set a new raycast to move the player
        this.raycasterForMovePlayer = new THREE.Raycaster();
        //get coordinates
        this.controller = new Controller()
    }

    setPlayer(){
        this.setMesh();
    }

    setMesh(){
        this.playerGeometry = new THREE.PlaneGeometry(2.5,2);

        this.player = new THREE.Mesh(this.playerGeometry,  new THREE.MeshBasicMaterial({transparent: true, visible: false}));
        this.player.position.set(0,-3.8,0)

        this.setAssets(this.playerGeometry);

        this.setCollider()

        this.scene.add(this.player)
    }

    setAssets(geometry){
        this.bucketBackground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.resources.items.player_background, transparent: true}));
        this.bucketBackground.position.x = -.35
        this.bucketBackground.renderOrder = 1;
        
        this.bucketForeground = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({map: this.resources.items.player_foreground, transparent: true}));
        this.bucketForeground.position.x = -.35
        this.bucketForeground.renderOrder = 3;

        this.player.add(this.bucketBackground, this.bucketForeground)
    }

    setCollider(){
        // Create a invisible box colliders for the player
        this.playerCollider = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1.6, 1),
            new THREE.MeshBasicMaterial({color: 'red', visible: false})
        )
        this.playerCollider.rotation.y = Math.PI * 0.25

        this.playerCollider.position.y = 0
        this.playerCollider.position.z = -0.5

        this.scene.add(this.playerCollider)
    }

    setInvisibleWall()
    {
        // I created a wall behind the scene for receive raycast --> (raycasterForMovePlayer)
        this.wallTarget = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 10),
            new THREE.MeshBasicMaterial({visible: false})
        )
        //make it vertical !
        this.wallTarget.rotation.x = Math.PI * 0.5
    }
    
    updatePlayer(){
        if(this.playerCollider && this.controller)
        {
            //cast a ray from camera to the wall with our Controller value(vec2)
            this.raycasterForMovePlayer.setFromCamera(this.controller, this.camera.instance);
            const intersects = this.raycasterForMovePlayer.intersectObjects([this.wallTarget]);
            
            //if mouse or a touch hit the insvisble wall, I update player position and the collider 
            if(intersects.length){
                const { point } = intersects[0];
                const finalDestination = point.setY(-3.8)
    
                //I used lerp function for smoothhhh
                this.player.position.lerp(finalDestination, 0.3);
                this.playerCollider.position.lerp(finalDestination, 0.3);
            }
        }
    }

    update(){
        this.updatePlayer();
    }

}