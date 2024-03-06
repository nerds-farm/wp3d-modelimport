import {
    Color,
    MathUtils,
    Spherical
} from 'three'

import { gsap } from "gsap";

export class MoveTo {
    constructor($this, $props) {
        // console.log('props',$props);
        // console.log('this',$this);

        this.scene = $this.scene;
        this.renderer = $this.renderer;
        this.object3d = $this.theModel;
        this.camera = $this.camera;
        this.isMoved = false;

        this.controls = $this.controls;
        this.target = this.controls.target;
        
        this.settings = $props;

        this.defaultData = this.getCamPos();
        this.objRot = this.getCamPos();

        this.tweenease = "expo.inOut";
        this.tweenduration = 1;
        
        this.tlMoveTo = gsap.timeline({
            id: 'moveto',
            //smoothChildTiming: true,
            paused:true,
            onStart: () => {
                
            }
        });

        $this.on('endControls', () => {
            this.defaultData = this.getCamPos();
        })
        $this.on('startControls', () => {
            //this.tlMoveTo.paused(true).pause();
        })
        
    }
    init(){
        
    }
    add(){

    }
    remove(){
        
    }
    update(){
        this.remove();
        this.add();
        
    }
    render(){
        
    }

    // METHODS
    left(){
        const obPos = {"fov":40,"zoom":1,"camx":-3.9999999999999303,"camy":2.4496881626739146e-16,"camz":0.07180108265331789,"trgtx":0,"trgty":0,"trgtz":0,"phi":1.5707963267948966,"theta":-1.5528479836910987,"radius":4};
        this.setCamPos(obPos);
    }
    right(){
        const obPos = {"fov":40,"zoom":1,"camx":4,"camy":2.4496876860514383,"camz":-0.07175769922806836,"trgtx":0,"trgty":0,"trgtz":0,"phi":1.5707963267948966,"theta":1.5887338275338139,"radius":4};
        this.setCamPos(obPos);
    }
    top(){
        const obPos = {"fov":40,"zoom":1,"camx":1.4273025548816803e-12,"camy":3.9999999999975895,"camz":0.000003999999999998669,"trgtx":0,"trgty":0,"trgtz":0,"phi":9.999334257726859e-7,"theta":3.5682563872052366e-7,"radius":4}
        this.setCamPos(obPos);
    }
    bottom(){
        const obPos = {"fov":40,"zoom":1,"camx":0.000518424369809532,"camy":-3.99854975235048,"camz":-0.1077014819468725,"trgtx":0,"trgty":0,"trgtz":0,"phi":3.11466371662581,"theta":3.136779160251386,"radius":4}
        this.setCamPos(obPos);
    }
    back(){
        const obPos = {"fov":40,"zoom":1,"camx":4.898192536839533,"camy":2.4490962684197664,"camz":-4,"trgtx":0,"trgty":0,"trgtz":0,"phi":1.5707963267948966,"theta":3.141592653589793,"radius":4}
        this.setCamPos(obPos);
    }
    front(){
        const obPos = {"fov":40,"zoom":1,"camx":0,"camy":2.4492935982947064,"camz":4,"trgtx":0,"trgty":0,"trgtz":0,"phi":1.5707963267948966,"theta":0,"radius":4}
        this.setCamPos(obPos);
    }
    default(){
        this.setCamPos(this.defaultData);
    }
    //MoveTo
    setCamPos(obPos){
        this.tlMoveTo.set(this.objRot, this.getCamPos());
        this.tlMoveTo.to(this.objRot, { duration: this.tweenduration, 
            phi: obPos.phi,
            theta: obPos.theta,
            radius: obPos.radius,
            fov: obPos.fov,
            zoom: obPos.zoom,
            onUpdateParams: [this.objRot],
            onUpdate: (self) => {
                //console.log(self.phi,self.theta,self.radius);
                let p = this.calcPosFromSpherical(self.phi,self.theta,self.radius);
                this.camera.position.set(p[0],p[1],p[2]);
                this.camera.fov = self.fov;
                this.camera.zoom = self.zoom;
                //console.log(p[0],p[1],p[2])
            },
            onComplete: () => {
                this.isMoved = false;
            },
            onStart: () => {
                this.isMoved = true;
            },
            ease: this.tweenease
        });
        this.tlMoveTo.play();
        /*this.tlMoveTo.to(this.target, { duration: this.tweenduration, 
            x: 0,
            y: 0,
            z: 0,
            onUpdateParams: [this.target],
            onUpdate: (self) => {
                
                    this.camera.lookAt( self.x, self.y,self.z );
                    this.camera.updateProjectionMatrix();
                    this.controls.update();
           
                
            },
            ease: this.tweenease
        },0);*/
    }
    //MoveTo Static ....
    setCamPos1($id, $val, $animate = false){
        //console.log($val)
        if($val){
            if($animate){
                //console.log($val)
                gsap.to(this.camera, { duration: this.tweenduration, 
                    fov: $val['fov'],
                    zoom: $val['zoom'],
                    ease: this.tweenease
                },0);
                gsap.to(this.camera.position, { duration: this.tweenduration, 
                    x: $val['camx'],
                    y: $val['camy'],
                    z: $val['camz'],
                    ease: this.tweenease
                },0);
                gsap.to(this.target, { duration: this.tweenduration, 
                    x: $val['trgtx'],
                    y: $val['trgty'],
                    z: $val['trgtz'],
                    ease: this.tweenease
                },0);
            }else{
                this.camera.fov = $val['fov'];
                this.camera.zoom = $val['zoom'];
                this.camera.position.set($val['camx'],$val['camy'],$val['camz']);
                this.target.x = $val['trgtx'];
                this.target.y = $val['trgty'];
                this.target.z = $val['trgtz'];
            }
        }
    }
    getCamPos(){
        //alert(Number(this.camera.position.x.toFixed(3)))
        let spherical = new Spherical().setFromCartesianCoords(Number(this.camera.position.x),Number(this.camera.position.y),Number(this.camera.position.z));
        //console.log(this.camera.position.x,this.camera.position.y,this.camera.position.z)
        //console.log(new Spherical().setFromCartesianCoords(Number(this.camera.position.x),Number(this.camera.position.y),Number(this.camera.position.z)))
        let camFov = Number(this.camera.fov),
            camZoom = Number(this.camera.zoom),
            camx = Number(this.camera.position.x), 
            camy = Number(this.camera.position.y), 
            camz = Number(this.camera.position.z),
            trgtx = Number(this.target.x), 
            trgty = Number(this.target.y), 
            trgtz = Number(this.target.z),
            phi = spherical.phi,
            theta = spherical.theta,
            radius = spherical.radius;
            
        return { fov:camFov, zoom:camZoom, camx:camx, camy:camy, camz:camz, trgtx:trgtx, trgty:trgty, trgtz:trgtz, phi:phi, theta:theta, radius:radius };
    }

    // UTILITY
    getSphetical(sx,sy,sz){
        // 
        let spherical = new Spherical().setFromCartesianCoords(sx,sy,sz);
        let cartesian = this.calcPosFromSpherical( spherical.phi, spherical.theta, spherical.radius);
        
        //console.log('CartesianCoords',sx,sy,sz)
        //console.log('spherical',spherical,cartesian);

        return cartesian;
    }

    // posit -> sphera [phi,theta,radius]
    getSpheticalFromCartesian(sx,sy,sz){
        // 
        let spherical = new Spherical().setFromCartesianCoords(sx,sy,sz);
        let cartesian = this.calcPosFromSpherical( spherical.phi, spherical.theta, spherical.radius);
        
        //console.log('CartesianCoords',sx,sy,sz)
        //console.log('spherical',spherical,cartesian);
        let phi = spherical.phi;
        let theta = spherical.theta;
        let radius = spherical.radius;

        return [phi,theta,radius];
    }
    // sphera -> posit [x,y,z]
    calcPosFromSpherical(phi,theta,radius){
  
        let x = (radius * Math.sin(phi)*Math.sin(theta));
        let y = (radius * Math.cos(phi));
        let z = (radius * Math.sin(phi)*Math.cos(theta));
      
        return [x,y,z];
    
    }
    
    update(){
        this.defaultData = this.getCamPos();
    }
    change(propertyName, settings){
        this.settings = settings;
        
    }
}
export default MoveTo;