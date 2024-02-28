import {
    Object3D,
    //MathUtils,
    PointLight,
    SpotLight,
    DirectionalLight,
    
    //SphereGeometry,
    MeshBasicMaterial,
    //Mesh,
    
    TextureLoader,
    Vector3,
    PointLightHelper,
    DirectionalLightHelper,
    SpotLightHelper,
    CameraHelper,
    Color
} from 'three';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

class E_threed_class_light {
    constructor(threed, $props, $isEditor = true, $cbfn = null ) {
        
        //console.log('L');

        this.threed = threed;
        //
        this.$id = $props.ide;
        this.settings = $props;
        //
        // LIGHTs
        this.light = null;
        this.luce = {}; //luce è l'oggetto che viene consegnato all'istanza di scena

        this.lightTarget = new Object3D();

        //TEXTURE MAP
        this.lightMap;

        //TRANSFORM CONTROL
        this.editor;
        this.isEdited
        this.transformControl;

        this.isEditor = $isEditor; // <------- vedi valori constructor
        this._triggers = {};
        this.cbfn = $cbfn;

        //--------
        this.add_light();
    }
    //memorizzo i valori dei controls
    updateData3d_light($id, $settings){
        this.lightType = this.settings.light_type || 'pointlight';
        
        
        // light color
        this.lightColor = this.settings.light_color || 0xffffff;
        // light_intensity
        this.lightIntensity = this.settings.light_intensity !== undefined ?  this.settings.light_intensity : 1;
        // light_distance
        this.lightDistance = this.settings.light_distance !== undefined ?  this.settings.light_distance : 1;
        // light_angle
        this.lightAngle = this.settings.light_angle !== undefined ?  this.settings.light_angle : 1;
        // light_penumbra
        this.lightPenumbra = this.settings.light_penumbra !== undefined ?  this.settings.light_penumbra : 0.5;
        // light_decay
        this.lightDecay = this.settings.ight_decay !== undefined ?  this.settings.ight_decay : 1;

        // pos X
        this.lightPosX = this.settings.geometry_light_posx !== undefined ? this.settings.geometry_light_posx :-3;
        // pos Y
        this.lightPosY = this.settings.geometry_light_posy !== undefined ? this.settings.geometry_light_posy : 3;
        // pos Z
        this.lightPosZ = this.settings.geometry_light_posz !== undefined ? this.settings.geometry_light_posz : 2;

        // target X
        this.lightTargetX = this.settings.geometry_light_targetx !== undefined ? this.settings.geometry_light_targetx : 0;
        // target Y
        this.lightTargetY = this.settings.geometry_light_targety !== undefined ? this.settings.geometry_light_targety : 0;
        // target Z
        this.lightTargetZ = this.settings.geometry_light_targetz !== undefined ? this.settings.geometry_light_targetz : 0;
        
        this.lightTarget.position.set(this.lightTargetX,this.lightTargetY,this.lightTargetZ);
        
        //PROJECTION MAP
        this.lightMapPath = this.settings.light_map ? this.settings.light_map.url : '';

        // SHADOWS
        this.isShadows = Boolean(this.settings.enable_shadows);
        this.shadowRadius = this.settings.geometry_shadow_radius !== undefined ? this.settings.geometry_shadow_radius : 4;
        this.shadowBlurSamples = this.settings.geometry_shadow_blurSamples !== undefined ? this.settings.geometry_shadow_blurSamples : 8;
        this.shadowFocus = this.settings.geometry_shadow_focus !== undefined ? this.settings.geometry_shadow_focus : 5;
        
        //FLY
        this.flyLightsPoints = Boolean(this.settings.lightpoint_fly);

        // HELPERS
        this.frontendHelpers = Boolean(this.settings.frontend_helpers);
        this.lightHelper = null;
        this.shadowCameraHelper = null;
      
    }
    //costuisco l'elemento
    add_light($id, $settings){
        // this.$id = $id;
        // this.settings = $settings;

        this.updateData3d_light(this.$id, this.settings);

        this.luce.type = 'light';
        
        this.luce.settings = {
            type: this.lightType,
            
            target: this.lightTarget,
            
            intensity: this.lightIntensity,
            color: this.lightColor,
            
            posx: this.lightPosX,
            posy: this.lightPosY,
            posz: this.lightPosZ,
            targetx: this.lightTargetX,
            targety: this.lightTargetY,
            targetz: this.lightTargetZ,

            angle: this.lightAngle,
            penumbra: this.lightPenumbra,
            decay: this.lightDecay,
            distance: this.lightDistance
        };

        this.luce.shadow ={
            // SHADOWS
            enable: this.isShadows,
            radius: this.shadowRadius,
            blurSamples: this.shadowBlurSamples,
            focus: this.shadowFocus
        }
        
        //----------------------------
        this.lightConstructor();
        this.luce.light = this.light;
        //----------------------------

        this.writeWidgetPanel(this.$id);
        //this.addTransformControl();
        //---------
        this.threed.on('render3d', () => {
            //HELPERS
            this.updateRenderHelpers();
            
            //FLY LIGHT 
            if(this.flyLightsPoints && this.light){
                //MathUtils.randFloat ( 0.3, 0.7 )
                const time2 = Date.now() * 0.005;
                this.light.position.x = Math.sin( time2 * 0.3 ) * 1.5;
                this.light.position.y = Math.cos( time2 * 0.3 ) * 1.5;
                this.light.position.z = Math.cos( time2 * 0.3 ) * 1.5;
            }
           
        });
    }
    //rimuovo l'elemento
    delete_light(){
        // clean
        this.clean3DLight(); 

    }
    // -----------------------------------------------
    //creo le luci
    lightConstructor(){
       
        switch(this.lightType){
            case 'pointLight':
                this.light = new PointLight( this.lightColor, this.lightIntensity, this.lightDistance );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );

                //voglio rendere visibile il punto di luce per individuarne la posizione..
                //const spherelight = new SphereGeometry( 0.05, 16, 8 );
                //this.light.add( new Mesh( spherelight, new MeshBasicMaterial( { color: this.lightColor } ) ) );
    
                //SHADOW
                this.updateShadowsLight();
                
                
            break;
            case 'directionalLight':
                this.light = new DirectionalLight( this.lightColor );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                this.light.intensity = this.lightIntensity;
                
                

                //TARGET
                this.light.target = this.lightTarget;
                this.threed.scene.add( this.lightTarget );
                this.updateTarget();

                //SHADOWS
                this.updateShadowsLight();
                
                
            break;
            case 'spotLight':

                /*
                this.light = new SpotLight( this.lightColor, this.lightIntensity );
                this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );

                this.light.angle = Math.PI / this.lightAngle;
                this.light.penumbra = this.lightPenumbra;
                
                
                this.light.intensity = this.lightIntensity;
                */

                this.light = new SpotLight( this.lightColor, this.lightIntensity );
                this.light.angle = Math.PI / this.lightAngle;
                this.light.penumbra = this.lightPenumbra;
                this.light.distance = this.lightDistance;
                this.light.decay = this.lightDecay;
                this.light.shadow.focus = this.shadowFocus;
                
                this.addlightMap();

				this.light.position.set( this.lightPosX, this.lightPosY, this.lightPosZ );
                
				

                //TARGET
                this.light.target = this.lightTarget;
                this.threed.scene.add( this.lightTarget );
                this.updateTarget();

                //SHADOWS
                this.updateShadowsLight();

                 
            break;
        }
        //HELPER
        //sono subito visibili
        /*if(this.threed.frontendHelpers || this.isEditor){
            
            this.updateHelperMesh(this.$id);
            
        }*/
        
        if(this.isShadows){
            this.threed.updateShadowsRenderer(this.shadowType);
        }
        //console.log(this.lightType)
        this.threed.scene.add( this.light );

        setTimeout(()=>{
            
            //@p ho completato tutti i passaggi e restituisco l'instanza per eleborarla
            if(this.cbfn){
            this.cbfn(this);
            //this.triggerHandler('mixeranimation',this.animationsLength); // promemora!
            }
        },100);
    }
    addlightMap(){
        if(this.lightMapPath){
                    
            this.lightMap = new TextureLoader().load( this.lightMapPath, ( texture ) => {
                // texture.needsUpdate = true;
                // texture.anisotropy = this.threed.renderer.capabilities.getMaxAnisotropy();
                
                this.light.map = texture;
            },
            // onProgress callback currently not supported
            undefined,
            // onError callback
            ( err ) => {
                console.error( 'An error happened LightMap.' );
            });
        }
    }
    //aggiorno le proprietà (vediamo se serve...)
    update_params_light(){

    }
    //------------ SHADOWS ----------------
    updateShadowsLight(){
        //SHADOW /**/
    
            this.light.castShadow = this.isShadows;
            
            // this.light.shadow.camera.near = 0.1;
            // this.light.shadow.camera.far = 1000;

            // this.light.shadow.camera.right = 17;
            // this.light.shadow.camera.left = - 17;
            // this.light.shadow.camera.top	= 17;
            // this.light.shadow.camera.bottom = - 17;

            this.light.shadow.mapSize.width = 1024;
			this.light.shadow.mapSize.height = 1024;

            // this.light.shadow.mapSize.width = 512;
            // this.light.shadow.mapSize.height = 512;
            this.light.shadow.bias = 0.001;

            this.light.shadow.radius = this.shadowRadius;
            this.light.shadow.focus = this.shadowFocus;
            this.light.shadow.blurSamples = this.shadowBlurSamples;
           
    };
    

    //------------ UPDATE ----------------
    //
    // ripulisco
    clean3DLight(){
        if(this.light){
            
            this.cleanHelperMesh();
            this.cleanTransformControl();

            this.threed.scene.remove(this.light);
            this.light.dispose();
            //
            this.light = null;
        }
    }

    // aggiorno le luci..
    rigenerateLight($update = true){
        this.clean3DLight();
        this.add_lght();
        
        
        if($update) this.updateHelperMesh(this.$id);

        //console.log(this.threed.scene)
        
    }
    // aggiorno le caratteristiche del target-luce (spot e directional)
    updateTarget(){

        this.lightTarget.position.set(this.lightTargetX,this.lightTargetY,this.lightTargetZ);
        if(this.light) this.light.lookAt(new Vector3(this.lightTargetX,this.lightTargetY,this.lightTargetZ));

    }

    updateParamsShadows(){
        this.updateShadowsLight();

       
        this.threed.clean3DRenderer();
        this.threed.generateRenderer();
        //
        this.threed.updateShadowsRenderer(this.shadowType);
    }




    //gli HELPERS e la TRASFORMAZIONE sulla MESH
    updateRenderHelpers(){
        if(this.lightHelper){
            this.lightHelper.update();
        }
        if(this.shadowCameraHelper){
            this.shadowCameraHelper.update();
        }
    }
    updateHelperMesh(myid){
        this.cleanHelperMesh();
        this.cleanTransformControl();
        //console.log(myid +' '+ this.$id)
        if(myid == this.$id){
            this.addHelperMesh();
            this.addTransformControl();
        }

        this.threed.render();
           
       
    }
    addHelperMesh(){
        
        if(this.light){
            switch(this.lightType){
                case 'pointLight':
                    this.lightHelper = new PointLightHelper( this.light, 0.1 );
                break;
                case 'directionalLight':
                    this.lightHelper = new DirectionalLightHelper( this.light, 1 );
                break;
                case 'spotLight':
                    this.lightHelper = new SpotLightHelper( this.light );

                    if(this.isShadows || this.lightMapPath){
                        this.shadowCameraHelper = new CameraHelper( this.light.shadow.camera );
                        this.threed.scene.add( this.shadowCameraHelper );
                    }
                    
				
                break;
            } 
            if(this.lightHelper){
                this.threed.lightHelper = this.lightHelper;
                this.threed.scene.add( this.lightHelper );
            }
            //console.log(this.threed.scene);
        }

    }
    cleanHelperMesh(){
        if(this.lightHelper){
            this.threed.scene.remove( this.lightHelper );
            this.lightHelper.dispose();
            //this.lightHelper = null;
        }
        if(this.shadowCameraHelper){
            this.threed.scene.remove( this.shadowCameraHelper );
            this.shadowCameraHelper.dispose();
        }
        
    }


    //----------------------- transformControl ------------------------
    addTransformControl(){
        this.transformControl = new TransformControls( this.threed.camera, this.threed.renderer.domElement );
        //this.transformControl.addEventListener( 'change', this.threed.render );

        this.transformControl.addEventListener( 'dragging-changed', ( event ) => {

            this.threed.controls.enabled = ! event.value;
            //console.log([this.light.position.x,this.light.position.y,this.light.position.z]);
            

            // ----------------------------------
            //this.setValLightPosition([this.light.position.x,this.light.position.y,this.light.position.z]);
            //RENDER trigger
            this.triggerHandler('transformcontrolchange',[Number(this.light.position.x.toFixed(3)), Number(this.light.position.y.toFixed(3)), Number(this.light.position.z.toFixed(3))]);
        } );

        this.transformControl.attach( this.light );
        this.threed.scene.add( this.transformControl );

        this.transformControl.setMode( 'translate' );
    }
    cleanTransformControl(){
        if(this.transformControl){
            this.threed.scene.remove( this.transformControl );
            this.transformControl.detach();
            this.transformControl.dispose();
        }
    }

    setIsEdited($edited){
        this.isEdited = $edited;
    }
    setEditorEl($editorEl){
        this.editor = $editorEl;
    }
    getCid(){
        return jQuery('.elementor-element-'+this.$id+'.elementor-widget-e-3d-light').attr('data-model-cid');
    }
    getObjPos(){
        let posx = Number(this.light.position.x.toFixed(3)), 
            posy = Number(this.light.position.y.toFixed(3)), 
            posz = Number(this.light.position.z.toFixed(3)),
            rotx = Number(this.light.rotation.x.toFixed(3)),
            roty = Number(this.light.rotation.y.toFixed(3)),
            rotz = Number(this.light.rotation.z.toFixed(3)),
            scale = Number(this.light.scale.x.toFixed(3));
            
        return { posx:posx, posy:posy, posz:posz, rotx:rotx, roty:roty, rotz:rotz, scale: scale };
    }
    /*
    setValLightPosition($val){
        
        if(this.editor){
            //elementorFrontend.config.elements.data[this.getCid()].attributes['geometry_light_posx']['size'] = $val[0];
            this.settings.geometry_light_posx = $val[0];
            this.lightPosX = $val[0];
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posx .elementor-slider' )[0].noUiSlider.set($val[0]);
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posx .elementor-slider-input' ).find('input').val($val[0]);
            
            //elementorFrontend.config.elements.data[this.getCid()].attributes['geometry_light_posy']['size'] = $val[1];
            this.settings.geometry_light_posy = $val[1];
            this.lightPosY = $val[1];
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posy .elementor-slider' )[0].noUiSlider.set($val[1]);
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posy .elementor-slider-input' ).find('input').val($val[1]);
            
            //elementorFrontend.config.elements.data[this.getCid()].attributes['geometry_light_posz']['size'] = $val[2];
            this.settings.geometry_light_posz = $val[2];
            this.lightPosZ = $val[2];
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posz .elementor-slider' )[0].noUiSlider.set($val[2]);
            if(this.isEdited) this.editor.$el.find( '.elementor-control-geometry_light_posz .elementor-slider-input' ).find('input').val($val[2]);
            
            //console.log(this.editor.$el)
            
            //attivo il salva verde ...
            let elementorPanel = this.editor.$el.closest('#elementor-panel');
            if (elementorPanel.find('#elementor-panel-saver-button-publish').hasClass('elementor-disabled')) {
                elementorPanel.find('#elementor-panel-saver-button-publish, #elementor-panel-saver-button-save-options, #elementor-panel-saver-menu-save-draft').removeClass('elementor-saver-disabled').removeClass('elementor-disabled').prop('disabled', false).removeProp('disabled');
            }
        }
    }
    */
    // -----------------------------------------------------------


    // widget panel
    writeWidgetPanel($id){
        if(this.isEditor && this.light){
            
            var lightdata = this.light.position;
            //console.log($id+' '+lightdata.x+' '+jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-boxx .wp3d-widget-value').length)
            
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-color .wp3d-widget-value').html(this.lightColor);
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-label, .elementor-element-'+this.$id+'.elementor-widget-e-3d-light .e3d-type').html( this.lightType );

            // object
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-boxx .wp3d-widget-value').html(lightdata.x.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-boxy .wp3d-widget-value').html(lightdata.y.toFixed(2));
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-boxz .wp3d-widget-value').html(lightdata.z.toFixed(2));
        }
        
    }

    //---------------------------------------------- EVENTS
    on(event,callback) {
		if(!this._triggers[event])
			this._triggers[event] = [];
		this._triggers[event].push( callback );
	}
    off(event,callback) {
		if(this._triggers[event])
        delete this._triggers[event];
	}
	triggerHandler(event,params) {
		if( this._triggers[event] ) {
			for( const i in this._triggers[event] )
				this._triggers[event][i](params);
		}
	}

    // CHANGES
    elementChange($id, propertyName, settings, isMultiple) {
        this.settings = settings;
        //
        // LIGHT --------------------------------------
        if ('light_type' === propertyName) {
            this.lightType = settings['light_type'] || 'pointlight';
            if(this.lightType == ''){
                this.clean3DLight();
            }else{
                this.rigenerateLight();
            }
            jQuery('.elementor-element-'+$id+'.elementor-widget-e-3d-light .wp3d-widget-label').text( this.lightType );
            this.writeWidgetPanel($id);
        }
        // light color
        if ('light_color' === propertyName) {
            this.lightColor = settings['light_color'] || 0xff8888;
            this.light.color = new Color(this.lightColor);
            if(this.lightHelper){
                this.lightHelper.color = new Color(this.lightColor);
                this.lightHelper.update();
            }
            this.writeWidgetPanel($id);

            this.threed.render();
        }
        // light intensity
        if ('light_intensity' === propertyName) {
            this.lightIntensity = settings.light_intensity !== undefined ?  settings.light_intensity : 1;
            this.light.intensity = this.lightIntensity;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }


        // light_angle
        if ('light_angle' === propertyName) {
            this.lightAngle = settings.light_angle !== undefined ?  settings.light_angle : 1;
            this.light.angle = Math.PI / this.lightAngle;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }
        // light_penumbra
        if ('light_penumbra' === propertyName) {
            this.lightPenumbra = settings.light_penumbra !== undefined ?  settings.light_penumbra : 0.5;
            this.light.penumbra = this.lightPenumbra;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }
        // light_decay
        if ('light_decay' === propertyName) {
            this.lightDecay = settings.light_decay !== undefined ?  settings.light_decay : 1;
            this.light.decay = this.lightDecay;

            // aggiorno 3Dclass scene ////////
            //this.threed.luci[$id].light.intensity = this.light.intensity;

            this.threed.render();
        }

        // PROJECTION MAP ------------------------------------------
        if ('light_map' === propertyName) {
            this.lightMapPath = settings.light_map !== undefined ? settings.light_map.url : '';
            
            this.rigenerateLight();
            this.threed.render();
        }

        // POSITION ------------------------------------------
        // pos X
        if ('geometry_light_posx' === propertyName) {
            this.lightPosX = settings.geometry_light_posx !== undefined ? settings.geometry_light_posx :-3;
            this.light.position.x = this.lightPosX;
            
            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }
        // pos Y
        if ('geometry_light_posy' === propertyName) {
            this.lightPosY = settings.geometry_light_posy !== undefined ? settings.geometry_light_posy : 3;
            this.light.position.y = this.lightPosY;
            
            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }
        // pos Z
        if ('geometry_light_posz' === propertyName) {
            this.lightPosZ = settings.geometry_light_posz !== undefined ? settings.geometry_light_posz : 2;
            this.light.position.z = this.lightPosZ;

            this.updateTarget();
            this.writeWidgetPanel($id);

            this.threed.render();
        }


        // TARGET ------------------------------------------
        // target X
        if ('geometry_light_targetx' === propertyName) {
            this.lightTargetX = settings.geometry_light_targetx !== undefined ? settings.geometry_light_targetx :-3;
            
            this.updateTarget();
            
            this.threed.render();
        }
        // target Y
        if ('geometry_light_targety' === propertyName) {
            this.lightTargetY = settings.geometry_light_targety !== undefined ? settings.geometry_light_targety : 3;
            
            this.updateTarget();

            this.threed.render();
        }
        // target Z
        if ('geometry_light_targetz' === propertyName) {
            this.lightTargetZ = settings.geometry_light_targetz !== undefined ? settings.geometry_light_targetz : 2;

            this.updateTarget();

            this.threed.render();
        }


        if ('light_distance' === propertyName) {
            this.lightDistance = settings.light_distance !== undefined ? settings.light_distance : 0;
            this.light.distance = this.lightDistance;

            this.threed.render();
        }    
        if ('lightpoint_fly' === propertyName) {
            this.flyLightsPoints = Boolean(settings.lightpoint_fly);
            
            this.rigenerateLight();
            this.threed.render(); 
        }
        
        
        

        
        // SHADOW --------------------------------------
        if ('enable_shadows' === propertyName) {
            this.isShadows = Boolean(settings.enable_shadows);
            if(this.light){
                this.light.castShadow = this.isShadows;
                this.light.receiveShadow = this.isShadows;
            }

            this.rigenerateLight();
            this.threed.render();

            //this.updateParamsShadows();

            /*
            this.updateData3d();
            
            if(this.renderer) this.renderer.shadowMap.enabled = this.isShadows;
            
            if(this.primitive_mesh) this.primitive_mesh.castShadow = this.isShadows;
            if(this.primitive_mesh) this.primitive_mesh.receiveShadow = this.isShadows;
            if(this.lights[ 0 ]) this.lights[ 0 ].castShadow = this.isShadows;
            if(this.ambientMesh) this.ambientMesh.receiveShadow = this.isShadows;
            if(this.primitive_mesh) this.primitive_mesh.traverse( ( child ) => {
                if ( child.isMesh ){
                    if(this.isShadows){
                                                        
                        child.castShadow = this.isShadows;
                        child.receiveShadow = this.isShadows;
                        //alert('shadow ambient')
                        //
                    }
                }
            } );
            */
            
            
        }
        
        
        
        if ('geometry_shadow_radius' === propertyName) {
            this.shadowRadius = settings.geometry_shadow_radius !== undefined ? settings.geometry_shadow_radius : 4;
            this.light.shadow.radius = this.shadowRadius;

            //this.updateParamsShadows();

            this.threed.render();
        }
        if ('geometry_shadow_blurSamples' === propertyName) {
            this.shadowBlurSamples = settings.geometry_shadow_blurSamples !== undefined ? settings.geometry_shadow_blurSamples : 8;
            this.light.shadow.blurSamples = this.shadowBlurSamples;

            //this.updateParamsShadows();

            this.threed.render();
        }
        if ('geometry_shadow_focus' === propertyName) {
            this.shadowFocus = settings.geometry_shadow_focus !== undefined ? settings.geometry_shadow_focus : 1;
            this.light.shadow.focus = this.shadowFocus;

            //this.updateParamsShadows();

            this.threed.render();
        }
    }
}
export default E_threed_class_light;