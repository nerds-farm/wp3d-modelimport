import {
    Raycaster,
    Box3,
    Vector2,
    Vector3,
    Group,
    MathUtils,
    PerspectiveCamera,
    OrthographicCamera,
    Scene,
    WebGLRenderTarget,
    AmbientLight,
    HemisphereLight,
    DirectionalLight,
    PointLight,
    PointLightHelper,
    MeshBasicMaterial,
    TextureLoader,
    MeshPhongMaterial,
    MeshDepthMaterial,
    ShaderMaterial,
    Mesh,
    PlaneGeometry,
    Color,
    WebGLRenderer,
    LoadingManager,
    AnimationMixer,
    Plane,
    BoxHelper,
    Clock,

    PMREMGenerator,
    EquirectangularReflectionMapping,

    BasicShadowMap,
    PCFSoftShadowMap,
    VSMShadowMap,
    
    //LinearEncoding,
    LinearSRGBColorSpace,
    //sRGBEncoding,
    SRGBColorSpace,
    NoColorSpace,

    NoToneMapping,
    LinearToneMapping,
    ReinhardToneMapping,
    CineonToneMapping,
    ACESFilmicToneMapping
} from 'three';

import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { USDZLoader } from 'three/examples/jsm/loaders/USDZLoader.js';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';

//SHADERS for contactshadow
import { HorizontalBlurShader } from 'three/examples/jsm/shaders/HorizontalBlurShader.js';
import { VerticalBlurShader } from 'three/examples/jsm/shaders/VerticalBlurShader.js';

class e_threed_class_modelimport {
    constructor($props, $isEditor = true, $cbfn = null) {
        //alert('model')
        // GUTEMBERG...
        ////////////////////////////////////////////////
        //scope è il contenitore delle cose
        this.id_scope = $props.ide;
        //this.scope = document.getElementById($props.ide);
        this.scope = jQuery('#'+$props.ide);
        
        this.targetScope = document.getElementById($props.ide);
        //console.log('ide ', $props.ide, this.targetScope);
        if(!this.targetScope) return;

        //CANVAS (.wp3d-canvas)
        //this.canvas = this.scope[0].querySelector( '.wp3d-canvas' );
        this.canvas = this.scope.find( '.wp3d-canvas' )[0];

        //const scopeAttr = this.canvas.getAttribute('id');
        
        //CONTAINER (.wp3d-container)
        // containere è la versione jquiey del container .. da valutare se rimuovere JQ da tutto!!!!
        this.containere = this.scope.find('.wp3d-container'); //e.$threedcontainer;
        //this.container = this.scope.querySelector( '.wp3d-container' ); // versione js
        this.container = this.containere[0];
        //console.log(this.container)
        // -----------------------------------------------------------------
        
        //alert(this.id_scope)
        
        
        this.elementSettings = {};
        //        
        this.threejsPath = (typeof wp3d_modelimport_path !== "undefined" && wp3d_modelimport_path) ? wp3d_modelimport_path : wp3dpath;
        //
        
        this.isEditor = $isEditor;
        this._triggers = {};
        this.cbfn = $cbfn;
        
        //VIEWPORT
        this.canvasW, this.canvasH;
        this.windowHalfX, this.windowHalfY
        
        //
        this.camera;
        this.scene; 
        this.renderer;
        this.raf = null;

        //controls
        this.controls;
        //TransformControl
        this.transformControl = null;
        this.targetTransformControl = null;

        //LIGHT
        this.pointLight;
        this.glowLight;
        
        //SKY
        this.sky_texture = null;
       
        // Oggetti
        this.model = null; //il modello
        //il gruppo che contiene l'import del modello
        this.themodel = new Group();
        
        this.repeaterMarkers = []

        //LOADINGMANAGER & NPROGRESS
        this.loadingManager = new LoadingManager();
        this.nprogress = NProgress();
        this.loadingmessage;

        //RENDER ANIMATION
        this.clock = new Clock();
        
        //CONTACT SHADOW **
        //this.contactShadow = null;
        this.isContactShadow = false;

        this.shadowGroup; 
        this.renderTarget;
        this.renderTargetBlur;
         
        this.shadowCamera;
        this.depthMaterial;
         
        this.horizontalBlurMaterial;
        this.verticalBlurMaterial;
        this.plane;
        this.blurPlane;
        this.fillPlane;
        
        //ground position
        this.groundY = 0;
        this.default_ambientPosY = this.groundY;
        this.ambientPosY = -1;
        //AMBIENT
        this.ambobj_w = 5;
        this.ambobj_h = 5;
        this.ambobj_d = 5;
        
        // ------------
        this.add_modelimport(this.id_scope, $props);


    }
    // ------------ DATA -------------
    // getRepeater($scope){
    //     const rep = [];
    //     //the repeater -----------------------------------------------------------------------------------
    //     const pointsList = $scope.querySelector('.wp3d-earth-pointslist');
    //     const list_earth_hotpoints = pointsList.querySelectorAll('.wp3d-earth3d-itempoint');
        
    //     list_earth_hotpoints.forEach((el)=>{
    //         //alert(el.getAttribute('data-settings'))
    //         rep.push(JSON.parse(el.getAttribute('data-settings')))
    //     })
    //     // -----------------------------------------------------------------------------------------------
    //     return rep;
    // }
    //memorizzo i valori dei controls
    updateData3d_modelimport(){
        this.updateData3d_viewport();

        this.nprogress.configure({ parent: '#'+this.id_scope });
        this.loadingmessage = jQuery('#'+this.id_scope).find('.wp3d-loading-message');

        //RENDERER
        this.outputEncoding = this.elementSettings.renderer_outputEncoding || 'sRGBEncoding';
        this.toneMapping = this.elementSettings.renderer_toneMapping || 'NoToneMapping';
        this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure || 0.68;

        

        //GLOW-LIGHT
        this.glowLight;
        this.glowlightHelper;

        // SHADOWS
        this.isShadows = true; //Boolean(this.elementSettings.enable_shadows);
        this.shadowType = this.elementSettings.shadow_type || 'PCFSoftShadowMap';
        //il modello proietta le ombre
        this.objCastShadow = Boolean(this.elementSettings.objshadows_castShadow);
        // il modello riceve le ombre
        this.objReceiveShadow = Boolean(this.elementSettings.objshadows_receiveShadow);


        //CAMERA
        this.cameraFov = this.elementSettings.camera_fov  ? this.elementSettings.camera_fov : 40;
        this.cameraZoom = this.elementSettings.camera_zoom  ? this.elementSettings.camera_zoom : 1;

        // pos X
        this.cameraPosX = this.elementSettings.camera_posx ? this.elementSettings.camera_posx : 0;
        // pos Y
        this.cameraPosY = this.elementSettings.camera_posy ? this.elementSettings.camera_posy : 0;
        // pos Z
        this.cameraPosZ = this.elementSettings.camera_posz ? this.elementSettings.camera_posz : 20;

        // target X
        this.cameraTargetX = this.elementSettings.camera_targetx ? this.elementSettings.camera_targetx : 0;
        // target Y
        this.cameraTargetY = this.elementSettings.camera_targety ? this.elementSettings.camera_targety : 0;
        // target Z
        this.cameraTargetZ = this.elementSettings.camera_targetz ? this.elementSettings.camera_targetz : 0;

        //TRANSFORM
        this.enableTransform = Boolean(this.elementSettings.enableTransform);
        // pos X
        this.geometryMeshPosX = this.elementSettings.geometry_mesh_posx ? this.elementSettings.geometry_mesh_posx : 0;
        // pos Y
        this.geometryMeshPosY = this.elementSettings.geometry_mesh_posy ? this.elementSettings.geometry_mesh_posy : 0;
        // pos Z
        this.geometryMeshPosZ = this.elementSettings.geometry_mesh_posz ? this.elementSettings.geometry_mesh_posz : 0;
        // rot X
        this.geometryMeshRotX = this.elementSettings.geometry_mesh_rotx ? this.elementSettings.geometry_mesh_rotx : 0;
        // rot Y
        this.geometryMeshRotY = this.elementSettings.geometry_mesh_roty ? this.elementSettings.geometry_mesh_roty : 0;
        // rot Z
        this.geometryMeshRotZ = this.elementSettings.geometry_mesh_rotz ? this.elementSettings.geometry_mesh_rotz : 0;
        // scale
        this.geometryMeshScale = this.elementSettings.geometry_mesh_scale ? this.elementSettings.geometry_mesh_scale : 1;


        //il modo di importazione: 1-media_file 2-external_url
        this.importMode =  this.elementSettings.import_mode || 'media_file';
        //il formato (valutare se deprecarlo a favore di automatico.. ma non so ora!)
        this.importFormatType = this.elementSettings.import_format_type || '';

        //TOOLS OBJECT TRANSFORM
        this.toolsObject = this.scope.find('.wp3d-tools-object3d');

        

        //LIGHT
        this.ambientLight = null;
        this.ambientlightColor = 0xFFFFFF; //this.elementSettings.ambientlight_color || 0xFFFFFF;
        this.ambientlightIntensity = this.elementSettings.light_intensity || 1;
        this.spotlightIntensity = this.elementSettings.spot_intensity || 1;
        this.cameraLight = null;

        //SKY
        this.skyType = this.elementSettings.sky_type; // stars, transparent, backgroundcolor, image
        this.ambientSkyTransparent = Boolean(this.elementSettings.sky_transparent);
        this.ambientSkyColor = this.elementSettings.sky_color;
        this.ambientSkyPath = this.elementSettings.sky_image.url;

        //VIEWPORT
        this.ratio = 1;
        this.viewportH = 500; //this.elementSettings.viewport_height; //non usato per perché restituisce ('500px') come stringa
        this.viewportIsExtend = Boolean(this.elementSettings.viewport_fixed);
        this.viewportRatio = this.elementSettings.viewport_ratio;

        //SCALE MODEL
        this.isScaledModel = Boolean(this.elementSettings.import_scalemodel);

        //IMPORT - ojb/mtl
        this.useMTL = true; //Boolean(this.elementSettings.import_mtl);

        // animations MIXER
        this.mixer;
        this.importAnimationMixer = Boolean(this.elementSettings.import_animationMixer);
        this.indexAnimationMixer = this.elementSettings.index_animationMixer || 0;
        this.animationsLength = 0;


        //this.repeaterMarkers = this.getRepeater(this.targetScope) || [];

        //HELPERS
        this.frontendHelpers = false;


        //CONTACT SHAWOW
        this.isContactShadow = Boolean(this.elementSettings.enableContactshadow);
        if(this.isContactShadow) this.initContactShadow()
        
    }
    genPath(cb = null){
        //questa è il percorso completo al file di Modello
        this.modelPath = '';

        switch(this.importMode){
            case 'media_file':
                this.modelPath = this.elementSettings.import_file.url;
                // se è uno zip devo scompattarlo per trovare il file 3d diretto
                if(this.modelPath.includes('.zip')){
                   
                    this.modelPath = this.fromZip((path)=>{
                    if(cb) cb(path); 

                    return
                    });
                    
                }else{
                    if(cb) cb(this.modelPath); 
                }
                
                
            break;
            case 'external_url':
                this.importFolderPath = this.elementSettings.import_folder_path || '';
                this.importFileName = this.elementSettings.import_file_name || '';

                this.modelPath = this.importFolderPath+this.importFileName+'.'+this.importFormatType;

                if(cb) cb(this.modelPath); 
            break;
        }
    }
    fromZip(cb = null){
        // effettuo quindi una chiamata ajax a un file php passando import_file.ID (o url) e importFormatType
        //console.log("?action=wp3d&url=" + this.modelPath + "&type=" + this.importFormatType);
        //#fra
        const xhttp = new XMLHttpRequest();
        xhttp.onload = function(t) {
          this.modelPath = this.responseText;
          //console.log('fromZip', this.modelPath)
          if(cb) cb(this.modelPath);
          
        }
        xhttp.open("GET", "?action=wp3d&url=" + this.modelPath + "&type=" + this.importFormatType);
        xhttp.send();
    }
    
    // ------------ ADD/REMOVE -------------
    //costuisco l'elemento all'inizio di tutto
    add_modelimport($id, $settings){
        
        this.$id = $id;
        this.elementSettings = $settings
        
        this.updateData3d_modelimport();
        
        // ----------------------
        // !!!!!!!!!!!!!!!!!!!!!!!
        this.contextConstructor();
        // Da valutare se va bene
        this.genPath((path)=>{
                if(!path) return
            
                //console.log('...la mia path è',path)
                this.modelPath = path;
                
                

                /////////////////
                this.addModel();
                /////////////////
                
                
                
            
        }); //produco this.modelPath;
        
        
    }
    //rimuovo l'elemento
    delete_modelimport($id){
       
    }
    
    // ------------ VIEWPORT -------------
    updateData3d_viewport(){
        //alert('updateData3d_viewport '+this.containere.height())
        this.viewportIsExtend = Boolean(this.elementSettings.viewport_fixed);
        
        //this.viewportIsExtend = true;
        if(this.viewportIsExtend && !this.isEditor){
            this.canvasW = window.innerWidth; 
            this.canvasH = window.innerHeight;
        }else{
            // le dimensioni del viewport
            switch(this.viewportRatio){
                case 'custom':
                    this.viewportH = this.containere.height() || 500;
                break;
                case '1/1':
                    this.viewportH = this.containere.width() * 1;
                break;
                case '4/3':
                    this.viewportH = this.containere.width() * (3/4);
                break;
                case '16/9':
                    this.viewportH = this.containere.width() * (9/16);
                break;
            }

            //vvv
            this.canvasW = this.containere.width(); 
            this.canvasH = this.viewportH; //legge l'altezza applicata dallo style di viewport_height

           
        }
        //console.log(this.canvasW + ' ' + this.canvasH);
        this.ratio = this.canvasW / this.canvasH; 
        this.windowHalfX = this.canvasW / 2;
        this.windowHalfY = this.canvasH / 2;
        //
    }
    
    // ------------ GENERATE -------------
    //creo il contesto 3D (INIT)
    contextConstructor(){
        
        
        // Camera *************************
       
        this.camera = new PerspectiveCamera( this.cameraFov, this.ratio, 0.1, 1000 );
        this.camera.position.set( this.cameraPosX, this.cameraPosY, this.cameraPosZ );

        this.camera.zoom = this.cameraZoom;
        this.camera.fov = this.cameraFov;
        //alert(this.cameraPosX+' '+this.cameraPosY+' '+this.cameraPosZ)
        //alert(this.cameraFov+' '+this.cameraPosZ)
        
        
        // Scene
        this.scene = new Scene();
        
        
        //SKY ****************************
        if(this.ambientSkyPath){
            this.generateSkyImage();
        }
        this.updateBackground()


        //RENDERER ***********************
        this.generateRenderer();

        //ORBIT CONTROL ***********************
        this.controls = new OrbitControls( this.camera, this.renderer.domElement );
        this.controls.enableZoom = this.elementSettings.useZoom;
        //this.controls.keyPanSpeed = 10; //default:70
        this.controls.minDistance = 0;
        this.controls.maxDistance = 10;

        this.controls.enableDamping = this.elementSettings.useDamping;
        this.controls.dampingFactor = this.elementSettings.dampingFactor;
        this.controls.autoRotate = this.elementSettings.autorotate;
        this.controls.autoRotateSpeed = this.elementSettings.autorotateSpeed;
        
        
        if(this.controls){
            this.controls.target = new Vector3(Number(this.cameraTargetX), Number(this.cameraTargetY), Number(this.cameraTargetZ));
            this.controls.update();
        }else{
            this.camera.lookAt( Number(this.cameraTargetX), Number(this.cameraTargetY), Number(this.cameraTargetZ) );
        }

        
        
       

        // THE MODEL //////////////////////////////////////////
        //aggiungo SUBITO alla scena il gruppo che raccoglie il modello importato
        this.scene.add(this.themodel);


        //applico le TRASFORMAZIONI iniziali al "themodel" 
        if(this.enableTransform){
            this.applyTransform();
        }
        if(this.isEditor){
            this.createTransformControl();
            this.activeTools();
        }

        //abilito il CONTACT SHADOW
        if(this.isContactShadow)
        this.addContactShadow();


       

        

        //////////////////////////////////////////
        //@p callback che legge le caratteristiche
        //
        this.canvas.addEventListener('pointerdown',()=>{
            this.pointIn = true;
            this.triggerHandler('down');
        })
        this.canvas.addEventListener('pointerup',()=>{
            this.pointIn = false;
            this.triggerHandler('up');

        })
        //
        if(this.controls){
            this.controls.addEventListener( 'change', () => {
                if(this.pointIn) this.triggerHandler('changeControls');
            } );
            this.controls.addEventListener( 'start', () => {
                this.triggerHandler('startControls');
            } );
            this.controls.addEventListener( 'end', () => {
                this.triggerHandler('endControls');
            } );
        }
        

        // EVENTS -----------------------------
        window.addEventListener( 'resize', ()=>{
                this.onWindowResize();
            } );
            this.onWindowResize();
       
        
    }


    addLight(){
        // const ambientLight = new AmbientLight( 0x000000 );
        // this.scene.add( ambientLight );

        // const light1 = new DirectionalLight( 0xffffff, 3 );
        // light1.position.set( 100, 200, 0 );
        // this.scene.add( light1 );

        // const light2 = new DirectionalLight( 0xffffff, 3 );
        // light2.position.set( 100, 200, 100 );
        // this.scene.add( light2 );

        // const light3 = new DirectionalLight( 0xffffff, 3 );
        // light3.position.set( - 100, - 200, - 100 );
        // this.scene.add( light3 );

        // -------------
        // if(this.elementSettings.sky_environmentimage){
        //     this.ambientlightIntensity = 3;
        // }else{
        //     this.ambientlightIntensity = this.elementSettings.light_intensity || 1;
        // }
        this.ambientlightIntensity = this.elementSettings.light_intensity || 1;
        this.spotlightIntensity = this.elementSettings.spot_intensity || 1;
        //console.log('al'+this.ambientLight)
        if(!this.ambientLight){
            //alert('al')
            
            //this.ambientLight = new AmbientLight( this.ambientlightColor, this.ambientlightIntensity );
            this.ambientLight = new HemisphereLight( 0xFFFFFF, 0x000000, this.ambientlightIntensity );
            this.ambientLight.name = 'al';
            this.scene.add( this.ambientLight );
        }
       
        //if(!this.elementSettings.sky_environmentimage){
            //alert(this.elementSettings.sky_environmentimage+' add cameraLight')
            if(!this.cameraLight){
                this.cameraLight = new DirectionalLight( 0xffffff, this.spotlightIntensity );
                this.cameraLight.castShadow = true;
                this.cameraLight.name = 'cl';
                this.cameraLight.position.set(100,0,100)
                this.camera.add( this.cameraLight );
                this.scene.add( this.camera );
            }
            
        //}
        //console.log(this.scene)
    }
    removeLight(){
       
        if(this.cameraLight){
            //alert('remove cameraLight')
            //let cl = this.scene.getObjectByName('cl')
            this.camera.remove( this.cameraLight );

            this.cameraLight.dispose();
            this.cameraLight = null;
            
            //this.scene.remove( this.camera );
        }
        if(this.ambientLight){
            //let al = this.scene.getObjectByName('al')
            this.scene.remove( this.ambientLight );
            
            this.ambientLight.dispose();
            this.ambientLight = null;
        }
    }
    updateLight(){
        
        this.removeLight();
        this.addLight();
        //console.log(this.scene)
    }

    // GLOW-LIGHT
    addGlowLight(){
        this.glowLight = new PointLight( 0xffffff, 3 );
        this.glowLight.position.set(1, 1, 1);
        this.scene.add( this.glowlightHelper );

        if(this.isEditor){
            this.glowlightHelper = new PointLightHelper( this.glowLight, 0.1 );
            this.scene.add( this.glowLight );
        }
    }
    removeGlowlight(){
        this.scene.add( this.glowLight );
        this.scene.add( this.glowlightHelper );
    }


    // ------------ CONTACT SHADOW -------------
    initContactShadow(){
        this.cs_settings = {
            shadow: {
                blurx: this.elementSettings.cs_blurx || 0.5,
                blury: this.elementSettings.cs_blury || 0.5,
                darkness: this.elementSettings.cs_darkness || 1,
                opacity: this.elementSettings.cs_opacity || 1,
                sensibility: this.elementSettings.cs_sensibility || 0.5,
                color: this.elementSettings.cs_color || "#000000",//
            },
            plane: {
                // color: new Color(this.elementSettings.cs_plane_color),
                // opacity: Boolean(this.elementSettings.cs_plane_enable) ? 1 : 0,
            }
        };
        this.plane = null
    }
    addContactShadow(){
        //alert('generateContatShadow')
        
        // the container, if you need to move the plane just move this
        // --- SHADOWGROUP ---
        this.shadowGroup = new Group();
        this.shadowGroup.name = 'shadowGroup';
        
        this.shadowGroup.position.y =  (this.ambientPosY+this.default_ambientPosY)+0.015; 
        this.shadowGroup.renderOrder = 3;
        
        this.scene.add( this.shadowGroup );

        // --- RENDERTARGET ---
        // la destinazione di rendering che mostrerà le ombre nella trama del piano
        this.renderTarget = new WebGLRenderTarget( 1024, 1024 );
        this.renderTarget.texture.generateMipmaps = false;

        // la destinazione di rendering che utilizzeremo per sfocare la prima destinazione di rendering
        this.renderTargetBlur = new WebGLRenderTarget( 512, 512 );
        this.renderTargetBlur.texture.generateMipmaps = false;

        // --- PLANE ---
        // crea un piano e posizionalo a faccia in su
        const planeGeometry = new PlaneGeometry( this.ambobj_w, this.ambobj_h ).rotateX( Math.PI / 2 );
        const planeMaterial = new MeshBasicMaterial( {
            map: this.renderTarget.texture,
            opacity: this.cs_settings.shadow.opacity,
            transparent: true,
            depthWrite: false,
            //color: new Color('#FF0000')
        } );
        this.plane = new Mesh( planeGeometry, planeMaterial );


        // assicurati che venga renderizzato dopo fillPlane
        this.plane.renderOrder = 1;
        this.plane.name = 'shadowPlane';
        this.shadowGroup.add( this.plane ); // <--- ADD (plane)

        // the y from the texture is flipped!
        this.plane.scale.y = - 1;

        // --- BLUR-PLANE ---
        // il piano su cui sfocare la texture
        this.blurPlane = new Mesh( planeGeometry );
        this.blurPlane.visible = false;
        this.shadowGroup.add( this.blurPlane ); // <--- ADD (blur)

        /*
        // --- FILL-PLANE ---
        // the plane with the color of the ground
        const fillPlaneMaterial = new MeshBasicMaterial( {
            color: this.cs_settings.plane.color,
            opacity: this.cs_settings.plane.opacity,
            transparent: true,
            depthWrite: false,
        } );

        this.fillPlane = new Mesh( planeGeometry, fillPlaneMaterial );
        this.fillPlane.rotateX( Math.PI );
        this.shadowGroup.add( this.fillPlane ); // <--- ADD (fill)
        */
        
        // la fotocamera da cui eseguire il rendering del materiale di profondità
        this.shadowCamera = new OrthographicCamera( - this.ambobj_w / 2, this.ambobj_w / 2, this.ambobj_h / 2, - this.ambobj_h / 2, 0, this.cs_settings.shadow.sensibility );
        this.shadowCamera.rotation.x = Math.PI / 2; // get the camera to look up
        this.shadowGroup.add( this.shadowCamera );

        // come MeshDepthMaterial, ma va dal nero al trasparente
        this.depthMaterial = new MeshDepthMaterial();
        this.depthMaterial.userData.darkness = { value: this.cs_settings.shadow.darkness };
        this.depthMaterial.userData.colorness = { value: new Color(this.elementSettings.cs_color) };

        this.depthMaterial.onBeforeCompile = ( shader ) => {
            
            shader.uniforms.darkness = this.depthMaterial.userData.darkness;
            shader.uniforms.colorness = this.depthMaterial.userData.colorness; //vec3( 0.0, 1.0, 0.0 )
            shader.fragmentShader = /* glsl */`
                uniform float darkness;
                uniform vec3 colorness;
                ${shader.fragmentShader.replace(
                    'gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );',
                    'gl_FragColor = vec4( colorness, ( 1.0 - fragCoordZ ) * darkness );'
                )}
            `;

        };
        
        this.depthMaterial.depthTest = false;
        this.depthMaterial.depthWrite = false;
        
        this.horizontalBlurMaterial = new ShaderMaterial( HorizontalBlurShader );
        this.horizontalBlurMaterial.depthTest = false;

        this.verticalBlurMaterial = new ShaderMaterial( VerticalBlurShader );
        this.verticalBlurMaterial.depthTest = false;
        
    }
    removeContactShadow(){
        this.scene.remove( this.shadowGroup );

        if(this.plane){
            this.plane.geometry.dispose();
            this.plane.material.dispose();
        }
        if(this.fillPlane){
            this.fillPlane.geometry.dispose();
            this.fillPlane.material.dispose();
        }
        if(this.renderTarget)
        this.renderTarget.dispose();
        
        if(this.renderTargetBlur)
        this.renderTargetBlur.dispose();

        if(this.blurPlane) this.blurPlane.material.dispose();
        if(this.depthMaterial) this.depthMaterial = null;
        if(this.horizontalBlurMateria) this.horizontalBlurMaterial = null;
        if(this.verticalBlurMaterial) this.verticalBlurMaterial = null;
        if(this.shadowGroup) this.shadowGroup = null;
    }
    updateContactShadow(){
        this.removeContactShadow();
        this.addContactShadow();
    }
    renderContactShadow(){
        if(!this.shadowGroup || !this.shadowCamera) return;

        // remove the background
        const initialBackground = this.scene.background;
        this.scene.background = null;

        // force the depthMaterial to everything
        //this.visibilityHelpers(false); //sparo via gli helper 
        this.scene.overrideMaterial = this.depthMaterial;

        // set renderer clear alpha
        const initialClearAlpha = this.renderer.getClearAlpha();
        this.renderer.setClearAlpha( 0 );

        // render to the render target to get the depths
        this.renderer.setRenderTarget( this.renderTarget );
        this.renderer.render( this.scene, this.shadowCamera );
        
        //MMMMMMMM
        this.renderTarget.texture.colorSpace = this.colorSpace;
        // and reset the override material
        this.scene.overrideMaterial = null;
        //this.visibilityHelpers(true);  //sparo su gli helper

        //
        this.blurShadow( this.cs_settings.shadow.blurx, this.cs_settings.shadow.blury );

        // un secondo passaggio per ridurre gli artefatti
        // (0,4 è la quantità minima di sfocatura in modo che gli artefatti scompaiano)
        this.blurShadow( this.cs_settings.shadow.blurx * 0.4, this.cs_settings.shadow.blury * 0.4 );

        // reset and render the normal scene
        this.renderer.setRenderTarget( null );
        this.renderer.setClearAlpha( initialClearAlpha );
        this.scene.background = initialBackground;
        
    }
    blurShadow( amountx,  amounty) {

        this.blurPlane.visible = true;

        // blur horizontally and draw in the renderTargetBlur
        this.blurPlane.material = this.horizontalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTarget.texture;
        this.horizontalBlurMaterial.uniforms.h.value = amountx * 1 / 256;
        
        this.renderer.setRenderTarget( this.renderTargetBlur );
        this.renderer.render( this.blurPlane, this.shadowCamera );
       
        // blur vertically and draw in the main renderTarget
        this.blurPlane.material = this.verticalBlurMaterial;
        this.blurPlane.material.uniforms.tDiffuse.value = this.renderTargetBlur.texture;
        this.verticalBlurMaterial.uniforms.v.value = amounty * 1 / 256;

        this.renderer.setRenderTarget( this.renderTarget );
        this.renderer.render( this.blurPlane, this.shadowCamera );

        this.blurPlane.visible = false;

    }





    // RENDERER ************
    generateRenderer(){
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: true,
            //premultipliedAlpha: false
        });
        this.renderer.setPixelRatio( this.ratio );
        this.renderer.setSize( this.canvasW, this.canvasH );
        
        if(this.ambientSkyTransparent) this.renderer.setClearColor( 0x000000, 0 ); // the default

        this.updateShadowsRenderer(this.shadowType);

        // !!!!!!!!!!!!!!!!!!
        // Nuovo
        this.renderer.setAnimationLoop( this.animation_render );
    }
    clean3DRenderer(){
        if(this.renderer) {
            this.renderer.dispose();
            this.renderer = null;
        }
    }
    
    // MODEL ************
    addModel($fromUpdate = false){
        
       
        //alert(this.importFormatType)
        //lancio l'importazione del modello in base al formato definito
        
        this.import_model(this.importFormatType, (ob) => {
            if(!ob) return;

            //alert('the model '+this.id_scope+' is imported')
            
            //console.log('modelScene',this.scene);
            //Lights
            this.addLight()
                
            //GLOW-LIGHT
            //addGlowLight();
            
            //
            //alert(this.enableTransform)
            if(this.enableTransform){
                this.changeTransformControl(ob);
                this.showTools();
            }
            //console.log('The Model:',ob);
            
            

            //
            setTimeout(()=>{
                if(this.nprogress) this.nprogress.done();
                //this.nprogress.remove();

                //@p ho completato tutti i passaggi e restituisco l'instanza per eleborarla
                //@p se la costruzione avvian dopo lupdate il cbfn non ha effetto
                if(this.cbfn && !$fromUpdate){
                    
                    //Render
                    this.updateToneMapping();
                    this.renderer.toneMappingExposure = this.toneMappingExposure;
                    this.updateOutputEncoding();
                    
                    
                    this.triggerHandler('mixeranimation',this.animationsLength);
                }
            },100);
            

            this.loadingmessage.empty().hide();

            this.triggerHandler('modelloaded',ob);

            if(this.cbfn) this.cbfn(this);
        });
        
    }
    removeModel(){
        if(this.model) this.themodel.remove( this.model );


        this.model = null;
    }
    updateModel(){
        this.removeModel();
        this.addModel(true);
    }
    
    // ---------------------------------------------------

    
    onStart = ( item, loaded, total ) => {
        //console.log('Start file: ' +item, loaded, total);
        
        if(this.nprogress) this.nprogress.start();
    };
    onProgress = ( item, loaded, total ) => {
        //console.log(item, loaded, total);
        //console.log('Loaded:', Math.round(loaded / total * 100, 2) + '%')
        //console.log( 'Loading file: ' + item + '.\nLoaded ' + loaded + ' of ' + total + ' files.' );
        console.log( 'Loading file: ', item );

        const percentComplete = Math.round(loaded / total, 2);

        
        
        //this.nprogress.set(percentComplete);

        if ( item.lengthComputable ) {
            
            
            //console.log( 'model ' + Math.round( percentComplete, 2 ) + '% downloaded' );
            /*
            let loading     = jQuery('.elementor-element-'+this.$id+'.elementor-widget-e-3d-object'); 
            
            let thebar      = loading.find('.e-threed-loading .e-threed-loading-progress'),
                theloading  = loading.find('.e-threed-loading'),
                thenumber   = loading.find('.e-threed-loading-number span')
            
            // LOADING..
            theloading.show();
            thenumber.text(percentComplete)
            console.log(percentComplete);
            
            
            /*gsap.to(thebar,{width: Math.round( percentComplete, 2 )+'%', onComplete: () => { 

                if(percentComplete == 100){
                    //theloading.hide();
                }

            }, });
            */
            
        }
    }

    onError = (a) => {
        //alert('file not found');
        console.log('file not found: ' + a)
        if(this.nprogress) this.nprogress.done();
        this.loadingmessage.show().html('<b>file not found</b> '+ a);
        
        //alert(this.threed.id_scope_container+' file not found '+ a)
    }

    import_model($importType, $cb = null){
        
        // load
        if(this.modelPath)
        switch($importType){
            case 'obj':
                this.importModelOBJ($cb);
                break;
            case 'dae':
                this.importModelDAE($cb);
                break;
            case 'gltf':
            case 'glb':   
                this.importModelGLTF($cb);
                break;
            case 'fbx':
                this.importModelFBX($cb);
                break;
            case 'stl':
                this.importModelSTL($cb);
                break;
            case 'usdz':
                alert('USDZ is to do');
                break;
        }
        
    }



    //OBJ ---------------------------------------------
    importModelOBJ($cb = null){
        let _this = this;

        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = function(){
            //
            if(_this.model){
                
                _this.model.traverse( function ( child ) {
                    if ( child.isMesh ){
                        
                        if(_this.isShadows){
                                                            
                            child.castShadow = _this.objCastShadow;
                            child.receiveShadow = _this.objReceiveShadow;
                            //alert('shadow ambient')
                            //
                        }
                    }
                } );
            }
            
            
        };
        
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        // model
        function startload(){ 
            const loader = new OBJLoader( _this.loadingManager )
                .setPath( _this.importFolderPath )
                .load( _this.importFileName+'.'+_this.importFormatType, function ( obj ) {
                    //this.model è il modello importato +++
                    _this.model = obj;

                    _this.themodel.name = 'themodel';
                    
                    if(_this.isScaledModel){
                         _this.scaleModel(obj,2);
                         _this.centerModel(obj,2);
                    }
                   
                    _this.themodel.add(obj);
                    
                    if($cb) $cb(_this.themodel);
                    //
                    _this.render();
            } );
        }
       
        //MTL ....
        function startloadmtl(){ 
            new MTLLoader()
            .setPath( _this.importFolderPath )
            .load( _this.importFileName+'.mtl', function ( materials ) {

                materials.preload();

                new OBJLoader( _this.loadingManager )
                    .setMaterials( materials )
                    .setPath( _this.importFolderPath )
                    .load( _this.importFileName+'.'+_this.importFormatType, function ( obj ) {

                        //this.model è il modello importato +++
                        _this.model = obj;

                        _this.themodel.name = 'themodel';
                        
                        if(_this.isScaledModel){
                            _this.scaleModel(obj,2);
                            _this.centerModel(obj,2);
                        }

                        _this.themodel.add(obj);

                        if($cb) $cb(_this.themodel); //<---- callback
                        //
                        _this.render();

                    } );
            } );
        }
        
        if(_this.useMTL){
            startloadmtl();
        }else{
            startload();
        }
    }



    /////////////////////////////////////////////////////////



    //GLTF e GLB ---------------------------------------------
    importModelGLTF($cb = null){
        let _this = this;
        

        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = function (item, loaded, total) {
            
            if(_this.model){
                
                

                _this.model.traverse( function ( child ) {
                    
                    if ( child.isMesh ){
                        
                        if(_this.isShadows){
                            child.castShadow = _this.objCastShadow;
                            child.receiveShadow = _this.objReceiveShadow;   
                        }
                    }
                });
                if($cb) $cb(_this.themodel); //<---- callback
                _this.render();
            }

            

        };
        
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        function startload(){
            /*
            //alert(_this.importFolderPath+_this.importFileName+'.'+_this.importFormatType)
            const loader = new GLTFLoader(_this.loadingManager).setPath( _this.importFolderPath );

            
            
            loader.load( _this.importFileName+'.'+_this.importFormatType, function ( gltf ) {
            */
            const loader = new GLTFLoader(_this.loadingManager);
            
            // Optional: Provide a DRACOLoader instance to decode compressed mesh data
            const dracoLoader = new DRACOLoader();
            let drlo = dracoLoader.setDecoderPath( _this.threejsPath+'assets/lib/threejs/jsm/libs/draco/' );
            if(drlo) loader.setDRACOLoader( dracoLoader );

            //#fra
            //console.log('Il file del modello importato è',_this.modelPath)
            loader.load( _this.modelPath, function ( gltf ) { 
                // gltf.animations; // Array<AnimationClip>
                // gltf.scene; // Group
                // gltf.scenes; // Array<Group>
                // gltf.cameras; // Array<Camera>
                // gltf.asset; // Object

                //console.log(gltf.scene);
                gltf.scene.name = 'imported'+_this.$id;
                
                //https://sbcode.net/threejs/gltf-animation/

                // -----ANIM-----
                _this.animationsLength = gltf.animations.length;
                //alert('mixer animations: '+gltf.animations.length+' '+_this.importAnimationMixer)
                if(_this.importAnimationMixer && _this.animationsLength){
                    // model.animations.forEach((clip) => {mixer.clipAction(clip).play(); });
                    _this.mixer = new AnimationMixer( gltf.scene );
                    if(_this.mixer){
                        const action = _this.mixer.clipAction( gltf.animations[ _this.indexAnimationMixer ] );
                        action.play();
                    }
                    
                }
                
                //this.model è il modello importato +++
                _this.model = gltf.scene;

                _this.themodel.name = 'themodel';

                if(_this.isScaledModel){
                    // _this.scaleInScene(_this.themodel);
                    
                    // alert(_this.model.children[0].name+' '+_this.model.children[0].scale.x)
                    // _this.model.children[0].scale.set(1,1,1)
                    // _this.model.scale.set(1,1,1);
                    
                    _this.scaleModel(_this.model,2);
                    _this.centerModel(_this.model,2);

                    //_this.scale_and_center(_this.model)
                    
                }
                _this.themodel.add(_this.model);
                
                //if($cb) $cb(_this.themodel); //<---- callback
                //TESTS....
                //console.log(gltf)
            });
        }
        startload();
    }
    

    //FBX ---------------------------------------------
    importModelFBX($cb = null){
        let _this = this;


        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = function (item, loaded, total) {
            if(_this.model){

                if(_this.isScaledModel){
                    _this.scaleModel(_this.model,2);
                    _this.centerModel(_this.model,2);
                }

                _this.model.traverse( function ( child ) {

                    if ( child.isSkinnedMesh ) {
                        if(child.geometry){
                            
                        }
                    }
                    
                    if ( child.isMesh ){
                        if(_this.isShadows){
                            child.castShadow = _this.objCastShadow;
                            child.receiveShadow = _this.objReceiveShadow;
                        }
                    }
                });
            }            

            

        };
        
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        /*
        const loader = new FBXLoader(this.loadingManager)
        .setPath( _this.importFolderPath )
        .load( _this.importFileName+'.'+_this.importFormatType, function ( object ) {
        */
        const loader = new FBXLoader(this.loadingManager).load( _this.modelPath, function ( object ) { 
        
            //alert('mixer animations fbx: '+object.animations.length)
            // -----ANIM-----
            _this.animationsLength = object.animations.length;
            if(_this.importAnimationMixer && _this.animationsLength){
                _this.mixer = new AnimationMixer( object );
                const action = _this.mixer.clipAction( 
                    object.animations[ _this.indexAnimationMixer ] 
                    );
                action.play();
            }
            
            //this.model è il modello importato +++
            _this.model = object;

            _this.themodel.name = 'themodel';

            _this.themodel.add(object);

            if($cb) $cb(_this.themodel); //<---- callback

        } );
    }

    //DAE ---------------------------------------------
    importModelDAE($cb = null){
        let _this = this;
        // loading manager
        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = function () {
            if(_this.model){
                if(_this.isScaledModel){
                    _this.scaleModel(_this.model,2);
                    _this.centerModel(_this.model,2);
                }

                _this.model.traverse( function ( child ) {
                    if ( child.isSkinnedMesh ) {
                        //console.log('isSkinnedMes');
                        child.frustumCulled = false; //....... se l'elemento è renderizzato anche fuori dalla camera

                    }
                    if ( child.isMesh ){

                        if(_this.isShadows){                          
                            child.castShadow = _this.objCastShadow;
                            child.receiveShadow = _this.objReceiveShadow;
                        }
                    }
                } );
            }
            

        };
        
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;
        
        // collada
        /*
        const loader = new ColladaLoader( this.loadingManager );
        loader
            .setPath( _this.importFolderPath )
            .load( _this.importFileName+'.'+_this.importFormatType, function ( collada ) {
        */
        const loader = new ColladaLoader(this.loadingManager).load( _this.modelPath, function ( collada ) { 
            //this.model è il modello importato +++
            _this.model = collada.scene;

            _this.themodel.name = 'themodel';

            _this.themodel.add(collada.scene);

            //console.log('collada',collada)
            
            // -----ANIM-----
            _this.animationsLength = collada.animations.length;
            if(_this.importAnimationMixer && _this.animationsLength){
                const animations = collada.animations;
                
                _this.mixer = new AnimationMixer( _this.model );
                _this.mixer.clipAction( animations[ _this.indexAnimationMixer ] ).play();
            }

            if($cb) $cb(_this.themodel); //<---- callback
        } );
    }
    importModelSTL($cb = null){
        let _this = this;

        this.loadingManager = new LoadingManager();
        this.loadingManager.onStart = this.onStart;
        this.loadingManager.onLoad = function(){
            if(_this.model){
                if(_this.isScaledModel){
                    _this.scaleModel(_this.model,2);
                    _this.centerModel(_this.model,2);
                }

                _this.model.traverse( function ( child ) {
                    if ( child.isSkinnedMesh ) {
                        //console.log('isSkinnedMes');
                        child.frustumCulled = false; //....... se l'elemento è renderizzato anche fuori dalla camera

                    }
                    if ( child.isMesh ){

                        if(_this.isShadows){                          
                            child.castShadow = _this.objCastShadow;
                            child.receiveShadow = _this.objReceiveShadow;
                        }
                    }
                } );
            }
            
        };
        this.loadingManager.onProgress = this.onProgress;
        this.loadingManager.onError = this.onError;

        function startload(){
            const loader = new STLLoader(_this.loadingManager).load( _this.modelPath, function ( geometry ) {
                //console.log('geomeryySTL',geometry);
                const material = new MeshPhongMaterial( { color: 0x999999, specular: 0x111111, shininess: 10 } );
                const mesh = new Mesh( geometry, material );

                _this.model = mesh;

                _this.themodel.name = 'themodel';

                _this.themodel.add(mesh);

                _this.primitive_mesh = _this.themodel;

                if($cb) $cb(_this.themodel); //<---- callback
            });
        }
        startload();
        
    }

    // SHADOW ---------------------
    updateShadowsRenderer($shadowType){
        this.renderer.shadowMap.enabled = this.isShadows;
        if(this.isShadows){
                       
            
            switch($shadowType){
                case 'BasicShadowMap':
                    this.renderer.shadowMap.type = BasicShadowMap;
                break;
                case 'PCFSoftShadowMap':
                    this.renderer.shadowMap.type = PCFSoftShadowMap; 
                break;
                case 'VSMShadowMap':
                    this.renderer.shadowMap.type = VSMShadowMap;

                break;
            }
        }else{
            this.renderer.shadowMap.type = PCFShadowMap; // default
        }
    }
    //da capire se serve!!!
    updateShadowsMesh(){
        //alert(this.isShadows)
        //SHADOW /**/
        //if(this.isShadows){
            if(this.model) this.model.castShadow = this.settings.objCastShadow; //this.objCastShadow
            if(this.model) this.model.receiveShadow = this.settings.objReceiveShadow; //this.objReceiveShadow
        //}
    }
    updateParamsShadows($id){
        
        this.updateShadowsRenderer(this.shadowType);

        //this.updateShadowsMesh($id);        
        //this.updateShadowsAmbient();
        
        this.clean3DRenderer();
        this.generateRenderer();
              
        
    }

    updateBackground(){
        //alert('updateBackground '+this.skyType)
        switch(this.skyType){
                case 'stars':
                    
                    this.scene.background = new TextureLoader().load( this.starsPath );
                break;
                case 'transparent':
                    this.scene.background = null;
                    //this.clean3DskyImage();
        
                    this.renderer.setClearColor( new Color(this.ambientSkyColor), 0 ); // the default
                break;
                case 'backgroundcolor':
                    this.scene.background = new Color(this.ambientSkyColor);
                break;
                case 'image':
                    this.scene.background = this.sky_texture;
                break;

            }

      

    }
    // SKY IMAGE --------------------- 
    generateSkyImage(){
        
        this.ambientSkyPath = this.elementSettings.sky_image ? this.elementSettings.sky_image.url : '';
        if(this.ambientSkyPath != ''){
            const textureLoader = new TextureLoader();
            //
            // let hderiSkyMap = this.threejsPath+'assets/img/hdri/skybox_512px.hdr';
            // this.ambientSkyPath = hderiSkyMap;
            //
            
            this.sky_texture = textureLoader.load( this.ambientSkyPath, (texture) => {
                //texture.anisotropy = 16;
                let skyEnvMap;
                //A
                texture.mapping = EquirectangularReflectionMapping; 
                //
                if(this.ispmremGenerator){
                    skyEnvMap = this.pmremGenerator.fromEquirectangular(texture).texture;
                }else{
                    skyEnvMap = texture;
                }
                

                if(this.elementSettings.sky_environmentimage) this.scene.environment = skyEnvMap; //texture;
            });
        }else{
            this.scene.environment = null;
            this.sky_texture = null;
        }
    }
    clean3DskyImage(){
        if(this.sky_texture){
            this.sky_texture.dispose();
            this.sky_texture = null;
            this.ambientSkyPath = '';
        }
    }







    onWindowResize() {
        setTimeout(()=>{
            this.updateData3d_viewport();
        
            this.renderer.setPixelRatio( this.ratio );
            this.renderer.setSize( this.canvasW, this.canvasH );

            this.camera.aspect = this.ratio;
            this.camera.updateProjectionMatrix();

            //if(this.modal) this.modal.innerHeight(this.canvasH);

            this.render();
        },100);
        
    }

    // RENDERING ---------------------------------
    // animate() {
    //     this.raf = requestAnimationFrame( ()=>{
    //         this.animate();
    //     } );

    //     this.render();
    // }
    animation_render = (timestamp, frame) => {
        // FONDAMENTALE
        this.render();
        //this.camera.updateProjectionMatrix();
    }
    render() {

        //ANIMATIONS ColladaDAE
        const delta = this.clock.getDelta();
            
        if (this.mixer !== undefined && this.importAnimationMixer ) {
            this.mixer.update( delta );
        }

        if(this.controls) this.controls.update();
        
        //CONTACT SHADOW
        if(this.isContactShadow){
            this.renderContactShadow();
        }

        if(this.renderer) this.renderer.render( this.scene, this.camera );
        

    }


    //------------ LAT/LNG UTILITY -----------------
    calcPosFromLatLonRad(lat,lon,radius){
  
        var phi   = (90-lat)*(Math.PI/180);
        var theta = (lon-180)*(Math.PI/180);
    
        let x = -(radius * Math.sin(phi)*Math.cos(theta));
        let z = (radius * Math.sin(phi)*Math.sin(theta));
        let y = (radius * Math.cos(phi));
      
        return [x,y,z];
    
    }
    //------------ UTILITY ----------------
    scaleInScene(model){
        const box = new Box3().setFromObject(model);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());
    
        this.controls.reset();
    
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);
    
        this.controls.maxDistance = size * 10;
        this.controls.minDistance = size;
    
        this.camera.near = size / 100;
        this.camera.far = size * 100;
        this.camera.updateProjectionMatrix();
        this.camera.position.copy(center);
        this.camera.lookAt(center);
    }
    scale_and_center(object){
        object.updateMatrixWorld();
        const box = new Box3().setFromObject(object);
        const size = box.getSize(new Vector3()).length();
        const center = box.getCenter(new Vector3());
    
        this.controls.reset();
    
        object.position.x += (object.position.x - center.x);
        object.position.y += (object.position.y - center.y);
        object.position.z += (object.position.z - center.z);
    }
    scaleModel(obj,dim){
        // obj.updateMatrix();

        // obj.geometry.applyMatrix( obj.matrix );

        // obj.position.set( 0, 0, 0 );
        // obj.rotation.set( 0, 0, 0 );
        // obj.scale.set( 1, 1, 1 );
        // obj.updateMatrix();

        var bbox = new Box3().setFromObject(obj);
        //
        var size = bbox.getSize(new Vector3());
       
        //Rescale the object to normalized space
        var maxAxis = Math.max(size.x, size.y, size.z);
        obj.scale.multiplyScalar(dim / maxAxis);
        //alert(maxAxis)
    }
    centerModel(obj,dim){ 
        
        var bbox = new Box3().setFromObject(obj);
        //
        var cent = bbox.getCenter(new Vector3());
        
        //Center the object to normalized space
        bbox.setFromObject(obj);
        bbox.getCenter(cent);
        obj.position.copy(cent).multiplyScalar((dim/2)*-1);
        
    }
    percentage(partialValue, totalValue) {
        return (1 * partialValue) / totalValue;
    } 
    
    // ------------ apply/removeTRANSFORM -------------
    applyTransform(){
        this.themodel.position.set( this.elementSettings.geometry_mesh_posx, this.elementSettings.geometry_mesh_posy, this.elementSettings.geometry_mesh_posz );
        this.themodel.rotation.set( this.elementSettings.geometry_mesh_rotx, this.elementSettings.geometry_mesh_roty, this.elementSettings.geometry_mesh_rotz );
        this.themodel.scale.set( this.elementSettings.geometry_mesh_scale, this.elementSettings.geometry_mesh_scale, this.elementSettings.geometry_mesh_scale );
    }
    removeTransform(){
        this.themodel.position.set( 0, 0, 0 );
        this.themodel.rotation.set( 0, 0, 0 );
        this.themodel.scale.set( 1, 1, 1 );
    }
    // ------------ TRANSFORM-CONTROL -------------
    createTransformControl(){
        //alert('this.transformControl '+this.transformControl)
        if(!this.scene.getObjectByName('TC')){
            this.transformControl = new TransformControls( this.camera, this.renderer.domElement );
            //this.points.hotpointsList[this.activeHpIndex].transformControl = this.transformControl;
            
            this.transformControl.addEventListener( 'change', (event) => {
                this.renderer.render(this.scene, this.camera)
                this.triggerHandler('TCchange');

                if(this.transformControl.mode == 'scale'){
                    let scaleVal = this.themodel.scale.x;
                    switch(this.transformControl.axis){
                        case 'X':
                            scaleVal = this.themodel.scale.x;
                        break;
                        case 'Y':
                            scaleVal = this.themodel.scale.y;
                        break;
                        case 'Z':
                            scaleVal = this.themodel.scale.z;
                        break;
                    }
                    this.themodel.scale.set(scaleVal,scaleVal,scaleVal);
                } 
                
            } );

            //this.transformControl.addEventListener('change', () => this.renderer.render(this.scene, this.camera));

            this.transformControl.addEventListener( 'dragging-changed', ( event ) => {
                if(this.controls) this.controls.enabled = ! event.value;
                //console.log(event)
                // ----------------------------------
                //RENDER trigger
                this.triggerHandler('transformcontrolchange');
                
            } );
            
            this.transformControl.name  = "TC";
            this.transformControl.setMode( 'translate' );
            
            this.scene.add( this.transformControl );
        }
    }
    changeTransformControl(target){
        if(this.transformControl)
        if(target){
            this.targetTransformControl = target;
            this.transformControl.attach(target);
        }else{
            this.transformControl.detach();
            this.targetTransformControl = null;
        }
    }
    // TOOLS OBJECT TRANSFORM --------------------------------------
    showTools(){
        this.toolsObject.addClass('active');
    }
    hideTools(){
        this.toolsObject.removeClass('active');
    }
    activeTools(){
        let activation = (target) => {
            this.toolsObject.find('span').removeClass('active');
            jQuery(target).addClass('active');
        }
        this.toolsObject.on('click','.wp3d-tools-object3d-pos',(e)=>{
            this.transformControl.setMode( 'translate' );
            activation(e.currentTarget);
        });
        this.toolsObject.on('click','.wp3d-tools-object3d-rot',(e)=>{
            this.transformControl.setMode( 'rotate' );
            activation(e.currentTarget);
        });
        this.toolsObject.on('click','.wp3d-tools-object3d-scale',(e)=>{
            this.transformControl.setMode( 'scale' );
            activation(e.currentTarget);
        });
    }

    // RENDER --------------------------------------
    updateToneMapping(){
        if(this.toneMapping){   
            switch(this.toneMapping){
                case 'NoToneMapping':
                    this.renderer.toneMapping = NoToneMapping;
                break;
                case 'LinearToneMapping':
                    this.renderer.toneMapping = LinearToneMapping;
                break;
                case 'ReinhardToneMapping':
                    this.renderer.toneMapping = ReinhardToneMapping;
                break;
                case 'CineonToneMapping':
                    this.renderer.toneMapping = CineonToneMapping;
                break;
                case 'ACESFilmicToneMapping':
                    this.renderer.toneMapping = ACESFilmicToneMapping;
                break;
            }
        }
    }
    updateOutputEncoding(){
        if(this.outputEncoding){   
            switch(this.outputEncoding){
                case 'NoColorSpace':
                    this.colorSpace = SRGBColorSpace; //NoColorSpace;
                    this.renderer.outputColorSpace = this.colorSpace;
                break
                case 'LinearEncoding':
                    this.colorSpace = LinearSRGBColorSpace;
                    this.renderer.outputColorSpace = this.colorSpace;
                break;
                case 'sRGBEncoding':
                    this.colorSpace = SRGBColorSpace;
                    this.renderer.outputColorSpace = this.colorSpace;
                break;
                // case 'BasicDepthPacking':
                //     this.renderer.depthPacking = BasicDepthPacking;
                // break;
                // case 'RGBADepthPacking':
                //     this.renderer.depthPacking = RGBADepthPacking;
                // break;
            }
            // alert(this.outputEncoding);
            // console.log('this.colorSpace',this.colorSpace)
        }
    }



    //------------ METHODS ----------------
    getCamPos(){
        let camFov = Number(this.camera.fov.toFixed(3)),
            camZoom = Number(this.camera.zoom.toFixed(3)),
            camx = Number(this.camera.position.x.toFixed(3)), 
            camy = Number(this.camera.position.y.toFixed(3)), 
            camz = Number(this.camera.position.z.toFixed(3)),
            trgtx = Number(this.controls.target.x.toFixed(3)), 
            trgty = Number(this.controls.target.y.toFixed(3)), 
            trgtz = Number(this.controls.target.z.toFixed(3));
            
        return { fov:camFov, zoom:camZoom, camx:camx, camy:camy, camz:camz, trgtx:trgtx, trgty:trgty, trgtz:trgtz };
    }
    getObjPos(){
        let posx = Number(this.themodel.position.x.toFixed(3)), 
            posy = Number(this.themodel.position.y.toFixed(3)), 
            posz = Number(this.themodel.position.z.toFixed(3)),
            rotx = Number(this.themodel.rotation.x.toFixed(3)),
            roty = Number(this.themodel.rotation.y.toFixed(3)),
            rotz = Number(this.themodel.rotation.z.toFixed(3)),
            scale = Number(this.themodel.scale.x.toFixed(3));
            
        return { posx:posx, posy:posy, posz:posz, rotx:rotx, roty:roty, rotz:rotz, scale: scale };
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
    elementChange($id, propertyName, settings) {
        
        this.elementSettings = settings;
        
               

        // IMPORT-FILE -------------------------------------- 
        if ('import_mode' === propertyName) {
            this.importMode =  this.elementSettings.import_mode || 'media_file';
            this.genPath((path)=>{
                this.modelPath = path;
                this.updateModel();
            }); //produco this.modelPath;
            
        }
        if ('import_file' === propertyName) {
            this.modelPath = this.elementSettings.import_file.url;
            this.genPath((path)=>{
                this.modelPath = path;
                this.updateModel();
            }); //produco this.modelPath;
           
        }
        if ('import_folder_path' === propertyName) {
            this.importFolderPath = this.elementSettings.import_folder_path || '';
            this.updateModel();
        }
        if ('import_file_name' === propertyName) {
            this.importFileName = this.elementSettings.import_file_name || '';
            this.updateModel();
        }
        if ('import_format_type' === propertyName) {
            this.importFormatType = this.elementSettings.import_format_type || '';
            this.genPath((path)=>{
                this.modelPath = path;
                this.updateModel();
            }); //produco this.modelPath;
        }

        // OPTIONS -------------------------------------- 
        if ('import_scalemodel' === propertyName) {
            this.isScaledModel = Boolean(this.elementSettings.import_scalemodel);
            this.updateModel();
        }
        if ('import_animationMixer' === propertyName) {
            this.importAnimationMixer = Boolean(this.elementSettings.import_animationMixer);
            this.updateModel();
        }
        if ('index_animationMixer' === propertyName) {
            this.indexAnimationMixer = this.elementSettings.index_animationMixer || 0;
            this.updateModel();
        }


        // RENDER --------------------------------------
        if ('renderer_toneMapping' === propertyName) {
            this.toneMapping = this.elementSettings.renderer_toneMapping || 'NoToneMapping';
            this.updateToneMapping();
            this.render();
        }
        if ('renderer_outputEncoding' === propertyName) {
            
            this.outputEncoding = this.elementSettings.renderer_outputEncoding || 'sRGBEncoding';
            this.updateOutputEncoding();
            this.render();
        }
        if ('renderer_toneMapping_exposure' === propertyName) {
            this.toneMappingExposure = this.elementSettings.renderer_toneMapping_exposure || 0.68;
            this.renderer.toneMappingExposure = this.toneMappingExposure;
            this.render();
        }

        // SKY --------------------------------------
        if ('sky_type' === propertyName) {
            this.skyType = this.elementSettings.sky_type;
            //stars
            //transparent
            //backgroundcolor
            //image
            this.updateBackground();
        }
        
        if ('sky_color' === propertyName) {
            this.ambientSkyColor = this.elementSettings.sky_color;

            this.scene.background = new Color(this.ambientSkyColor);
            this.render();
        }
        
        if ('sky_image' === propertyName) {
            this.ambientSkyPath = this.elementSettings.sky_image ? this.elementSettings.sky_image.url : '';

            this.clean3DskyImage();
            this.generateSkyImage();
            
            if(this.ambientSkyPath){
                this.scene.background = this.sky_texture;
            }else{
                this.scene.background = new Color(this.ambientSkyColor);
            }
            this.render();
        }
        
        if ('sky_environmentimage' === propertyName) {
            //EEE
            if(this.elementSettings.sky_environmentimage){
                this.scene.environment = this.sky_texture;
            }else{
                this.scene.environment = null;
            }

            this.updateLight();
            
            
        }

        if ('material_metalness' === propertyName) {
            
        }
        if ('material_roughness' === propertyName) {
            
        }
        // LIGHT --------------------------------------
        if ('light_intensity' === propertyName) {
            this.ambientlightIntensity = this.elementSettings.light_intensity || 1;
            
            this.ambientLight.intensity = this.ambientlightIntensity;
            
            this.render();
        }
        if ('spot_intensity' === propertyName) {
            this.spotlightIntensity = this.elementSettings.spot_intensity || 1;
            
            this.cameraLight.intensity = this.spotlightIntensity;
            
            this.render();
        }
        // SHADOWS --------------------------------------
        if ('objshadows_castShadow' === propertyName) {
            this.objCastShadow = Boolean(this.elementSettings.objshadows_castShadow);
            this.updateModel();
        }
        if ('objshadows_receiveShadow' === propertyName) {
            this.objReceiveShadow = Boolean(this.elementSettings.objshadows_receiveShadow);
            this.updateModel();
        }
        //AMBIENT CONTACT SHADOW      
        if ('enableContactshadow' === propertyName) {
                    
            this.isContactShadow = this.isContactShadow = Boolean(this.elementSettings.enableContactshadow);
            
            this.initContactShadow()
            this.updateContactShadow();
            
            
            this.render();
        }
        
        if ('contactshadow-blurx' === propertyName) {
            this.cs_settings.shadow.blurx = this.elementSettings.cs_blurx;
            
            //this.updateContactShadow();
            
            this.render();

        }
        if ('contactshadow-blury' === propertyName) {
            this.cs_settings.shadow.blury = this.elementSettings.cs_blury;
            
            //this.updateContactShadow();
            
            this.render();
        }
        if ('contactshadow-color' === propertyName) {
            this.cs_settings.shadow.color = new Color(this.elementSettings.cs_color) || '#000000';
            this.depthMaterial.userData.colorness.value = this.cs_settings.shadow.color;
            
            //this.updateContactShadow();
            
            this.render();
        }
        if ('contactshadow-darkness' === propertyName) {
            this.cs_settings.shadow.darkness = this.elementSettings.cs_darkness;
            this.depthMaterial.userData.darkness.value = this.cs_settings.shadow.darkness;
            
            this.render();
        }
        if ('contactshadow-sensibility' === propertyName) {
            this.cs_settings.shadow.sensibility = this.elementSettings.cs_sensibility;
            this.shadowCamera.far = this.cs_settings.shadow.sensibility;
            this.updateContactShadow();
            this.render();
        }
        if ('contactshadow-opacity' === propertyName) {
            this.cs_settings.shadow.opacity = this.elementSettings.cs_opacity;
            this.plane.material.opacity = this.cs_settings.shadow.opacity;
            
            this.render();
        }
        // INTERACTIVIRY -------------------------------------- 
        if ('useDamping' === propertyName) {
            this.controls.enableDamping = this.elementSettings.useDamping;
        }
        if ('dampingFactor' === propertyName) {
            this.controls.dampingFactor = this.elementSettings.dampingFactor;
        }
        if ('useZoom' === propertyName) {
            this.controls.enableZoom = this.elementSettings.useZoom;
        }
        if ('autorotate' === propertyName) {
            this.controls.autoRotate = this.elementSettings.autorotate;
        }
        if ('autorotateSpeed' === propertyName) {
            this.controls.autoRotateSpeed = this.elementSettings.autorotateSpeed;
        }
        

        // CAMERA -------------------------------------- 
        if ('camera_fov' === propertyName) {
            this.cameraFov = this.elementSettings.camera_fov ? this.elementSettings.camera_fov : 40;
            this.camera.fov = this.cameraFov;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_zoom' === propertyName) {
            this.cameraZoom = this.elementSettings.camera_zoom ? this.elementSettings.camera_zoom : 1;
            this.camera.zoom = this.cameraZoom;

            this.camera.updateProjectionMatrix();
            this.render();
        }

        // CAMERA position: x-y-z
        if ('camera_posx' === propertyName) {
            this.cameraPosX = this.elementSettings.camera_posx ? this.elementSettings.camera_posx : 0;
            this.camera.position.x = this.cameraPosX;
            
            
            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posy' === propertyName) {
            this.cameraPosY = this.elementSettings.camera_posy ? this.elementSettings.camera_posy : 0;
            this.camera.position.y = this.cameraPosY;

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_posz' === propertyName) {
            this.cameraPosZ = this.elementSettings.camera_posz ? this.elementSettings.camera_posz : 20;
            this.camera.position.z = this.cameraPosZ;

            this.camera.updateProjectionMatrix();
            this.render();
        }

        // TARGET x-y-z
        if ('camera_targetx' === propertyName) {
            this.cameraTargetX = this.elementSettings.camera_targetx ? this.elementSettings.camera_targetx : 0;
            

            this.controls.target.x = this.cameraTargetX;
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);
            
            // this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targety' === propertyName) {
            this.cameraTargetY = this.elementSettings.camera_targety ? this.elementSettings.camera_targety : 0;
            
            this.controls.target.y = this.cameraTargetY;
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);

            //this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
        }
        if ('camera_targetz' === propertyName) {
            this.cameraTargetZ = this.elementSettings.camera_targetz ? this.elementSettings.camera_targetz : 0;
            
            this.controls.target.z = this.cameraTargetZ;
            this.camera.lookAt(this.cameraTargetX, this.cameraTargetY, this.cameraTargetZ);

            //this.updateCamTarget();

            this.camera.updateProjectionMatrix();
            this.render();
            
        }


        // TRANSFORM --------------------------------------
        if ('enableTransform' === propertyName) {
            this.enableTransform = this.elementSettings.enableTransform;
            if(this.enableTransform){
                this.changeTransformControl(this.themodel);
                this.showTools();
                this.applyTransform();
            }else{
                this.changeTransformControl();
                this.hideTools();
                this.removeTransform();
            }

        }
        if ('geometry_mesh_posx' === propertyName) {
            this.geometryMeshPosX = this.elementSettings.geometry_mesh_posx ? this.elementSettings.geometry_mesh_posx : 0;
            this.themodel.position.x = this.geometryMeshPosX;
            //this.writeWidgetPanel();
            this.render();
            
        }
        if ('geometry_mesh_posy' === propertyName) {
            this.geometryMeshPosY = this.elementSettings.geometry_mesh_posy ? this.elementSettings.geometry_mesh_posy : 0;
            this.themodel.position.y = this.geometryMeshPosY;
            //this.writeWidgetPanel();
            this.render();
        }
        if ('geometry_mesh_posz' === propertyName) {
            this.geometryMeshPosZ = this.elementSettings.geometry_mesh_posz ? this.elementSettings.geometry_mesh_posz : 0;
            this.themodel.position.z = this.geometryMeshPosZ;
            //this.writeWidgetPanel();
            this.render();
        }
        if ('geometry_mesh_rotx' === propertyName) {
            this.geometryMeshRotX = this.elementSettings.geometry_mesh_rotx ? this.elementSettings.geometry_mesh_rotx : 0;
            this.themodel.rotation.x = MathUtils.degToRad (this.geometryMeshRotX);
            //this.writeWidgetPanel();
            this.render();
        }
        if ('geometry_mesh_roty' === propertyName) {
            this.geometryMeshRotY = this.elementSettings.geometry_mesh_roty ? this.elementSettings.geometry_mesh_roty : 0;
            this.themodel.rotation.y = MathUtils.degToRad (this.geometryMeshRotY);
            //this.writeWidgetPanel();
            this.render();
        }
        if ('geometry_mesh_rotz' === propertyName) {
            this.geometryMeshRotZ = this.elementSettings.geometry_mesh_rotz ? this.elementSettings.geometry_mesh_rotz : 0;
            this.themodel.rotation.z = MathUtils.degToRad (this.geometryMeshRotZ);
            //this.writeWidgetPanel();
            this.render();
        }
        if ('geometry_mesh_scale' === propertyName) {
            this.geometryMeshScale = this.elementSettings.geometry_mesh_scale ? this.elementSettings.geometry_mesh_scale : 1;
            this.themodel.scale.set(this.geometryMeshScale,this.geometryMeshScale,this.geometryMeshScale);
            //this.writeWidgetPanel();
            this.render();
        }



        // VIEWPORT -------------------------------------- 
        if ('viewport_ratio' === propertyName) {
            this.viewportRatio = this.elementSettings.viewport_ratio;
            this.onWindowResize();
        }
        if ('viewport_height' === propertyName) {
            //alert('viewport_height '+this.elementSettings.viewport_height)
            this.onWindowResize();
            
        }
        if ('viewport_fixed' === propertyName) {
            this.viewportIsExtend = Boolean(this.elementSettings.viewport_fixed);

        }


    }
}
export default e_threed_class_modelimport;