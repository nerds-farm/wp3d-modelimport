import memoize from 'memize';
import times from 'lodash/times';
/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * WordPress components that create the necessary UI elements for the block
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-components/
 */
import { 
	TextControl,
	PanelBody,
	SelectControl,
	PanelRow,
	RangeControl,
	ToggleControl,
	ColorPicker,
	ColorIndicator,
	Icon,
	Button,
	FormTokenField,
	__experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
	NavigableMenu,
	TabbableContainer,
	__experimentalNumberControl as NumberControl
} from '@wordpress/components';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { useDispatch, useSelect } from '@wordpress/data'; //??????
import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import { useInstanceId, useFocusReturn } from "@wordpress/compose";

// My components
import ChooseModel3d from '../../components/ChooseModel3d.js';
import ChooseImage from '../../components/ChooseImage.js';

import ViewportPanel from '../../components/ViewportPanel.js';
import SkyPanel from '../../components/SkyPanel.js';

// Classes
import e_threed_class_modelimport from '../../classes/class.e_threed_modelimport.js';
import E_threed_class_light from '../../classes/class.e_threed_light.js';



//images
import previewImage from '../../../assets/img/modelimport_cover.jpg'

import Appender from '../../components/Appender.js';
/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Properties passed to the function.
 * @param {Object}   props.attributes    Available block attributes.
 * @param {Function} props.setAttributes Function that updates individual attributes.
 *
 * @return {WPElement} Element to render.
 */
 

export default function Edit( props ) {
	const [ importModel3D_element, setImportmodel3D_element ] = useState( '' )
	
	const [ light3D_element, setLight3D_element ] = useState( null );
	const [ points3D_element, setPoints3D_element ] = useState( null );
	const [ selectedHelpers, setSelectedHelpers ] = useState( [] );

	const [ oldIde, setOldIde ] = useState( [] );
	const [ newIde, setNewIde ] = useState( [] );

	const blockProps = useBlockProps();

	const instanceId = useInstanceId(Edit);

	const scopeRef = useRef();
	const canvasRef = useRef();
	const itemsRef = useRef();
	
	const { attributes, setAttributes, clientId } = props;

	const { ide,
		preview,
		align,
		mediaId,
		countLight,
		light_intensity,
		spot_intensity,
		leftspot_intensity,
		rightspot_intensity,
		helpers,
		helper_center,
		helper_floor,
		helper_spotlight,
		helper_leftlight,
		helper_rightlight,
		enable_navigator,
		buttons_navigator,
		nav_left,
		nav_right,
		nav_top,
		nav_bottom,
		nav_front,
		nav_back,
		nav_default,
		sky_transparent,
		sky_color,
		sky_showimage,
		sky_environmentimage,
		material_metalness,
		material_roughness,
		sky_image,
		import_mode,
		import_folder_path,
		import_file_name,
		import_format_type,
		import_file,
		import_scalemodel,
		import_animationMixer,
		index_animationMixer,
		useDamping,
		dampingFactor,
		useZoom,
		autorotate,
		autorotateSpeed,
		objshadows_receiveShadow,
		objshadows_castShadow,
		enableContactshadow,
		cs_color,
		cs_blurx,
		cs_blury,
		cs_darkness,
		cs_sensibility,
		cs_opacity,
		renderer_outputEncoding,
		renderer_toneMapping,
		renderer_toneMapping_exposure,
		camera_fov,
		camera_zoom,
		camera_posx,
		camera_posy,
		camera_posz,
		camera_targetx,
		camera_targety,
		camera_targetz,
		enableTransform,
		geometry_mesh_posx,
		geometry_mesh_posy,
		geometry_mesh_posz,
		geometry_mesh_rotx,
		geometry_mesh_roty,
		geometry_mesh_rotz,
		geometry_mesh_scale,
		viewport_ratio,
		viewport_height,
		viewport_fixed
	} = attributes;
	
	const [ checked, setChecked ] = useState( import_mode );
	const [ allowedMimetype, setAllowedMimetype ] = useState( filterNameType() );
	const [ animations, setAnimations ] = useState( 0 );

	function pippo(){
		// TEST
		//alert('pippo');
	}
	function onChangeValue(prop, val, $useElementChange = true){
		setAttributes( val );

		attributes[prop] = val[prop];
		if($useElementChange && importModel3D_element) importModel3D_element.elementChange(ide, prop, attributes);
	}
	
	useEffect(() => {
		if( ide != `wp3d-importmodel3d-${ instanceId }` ) //DEBUGG
		setAttributes( { ide: `wp3d-importmodel3d-${ instanceId }` } );

		setImportmodel3D_element(new e_threed_class_modelimport( scopeRef.current, attributes, true, cbfn ));
		//console.log('the model')
	},[]);

	// window.dataStorage = {
	// 	_storage: new WeakMap(),
	// 	put: function (element, key, obj) {
	// 		if (!this._storage.has(element)) {
	// 			this._storage.set(element, new Map());
	// 		}
	// 		this._storage.get(element).set(key, obj);
	// 	},
	// 	get: function (element, key) {
	// 		return this._storage.get(element).get(key);
	// 	},
	// 	has: function (element, key) {
	// 		return this._storage.has(element) && this._storage.get(element).has(key);
	// 	},
	// 	remove: function (element, key) {
	// 		var ret = this._storage.get(element).delete(key);
	// 		if (!this._storage.get(element).size === 0) {
	// 			this._storage.delete(element);
	// 		}
	// 		return ret;
	// 	}
	// }

	function cbfn($this){
		
		$this.on('down',()=>{
			
		});
		$this.on('up',()=>{
			const posCam = $this.getCamPos()
			const posObj = $this.getObjPos()
			//console.log(posCam);
			if(!$this.isMoved)
			applyPosCamera(false, posCam);

			applyTransform(false, posObj);			
			
			
		});
		$this.on('changeControls',()=>{
			
		});
		$this.on('endControls',()=>{
			const posCam = $this.getCamPos()
			
			//console.log('endControls', $ob);
			if(!$this.isMoved)
			applyPosCamera(false, posCam);
			
		});
		$this.on('mixeranimation',($al)=>{
			//console.log('animations',$al);
			setAnimations($al)
		});
		$this.on('TCchange',($al)=>{
			//console.log('animations',$al);
			//setAnimations($al)
		});
		$this.on('transformcontrolchange',($al)=>{
			const posObj = $this.getObjPos()
			//console.log(posObj)
			applyTransform(false, posObj);
		});
		$this.on('tofloor',($al)=>{
			const posObj = $this.getObjPos()
			//console.log(posObj)
			applyTransform(true, posObj);
		});
		
		
		jQuery(scopeRef.current).data('sceneInstance',$this);
		

	};

	useEffect(() => {
		
		
	},[ide]);

	useEffect(() => {
		if(importModel3D_element)
		{
			importModel3D_element.onWindowResize();
		}
	},[align]);

	useEffect(() => {
		pippo();
		
	},[countLight]);




	//La lista completa: https://developer.wordpress.org/block-editor/reference-guides/data/data-core-block-editor/
	//getSelectedBlockClientId()
	//getSelectedBlock()
	//getBlockOrder()
	//getBlocks( props.clientId )
	//const state = select( 'onboard' ).getState();
	//getFeatures()
	//getSettings()
	
	const selectedBlockActive = useSelect(
	( select ) => select( 'core/block-editor' ).getSelectedBlock()
	);
	

	//const { insertBlock } = useDispatch( 'core/block-editor' );

	const {
		getSelectedBlock,
		getState,
		getBlocksByClientId,
		getFeatures,
		isBlockSelected,
		
		getBlockHierarchyRootClientId,
		getSelectedBlockClientId,
		getBlockAttributes,
		isSelected,
	} = useSelect( ( select ) => 
		select( 'core/block-editor' )
	);
	//Get block properties on.
	const selectedBlock = getSelectedBlock();
	const selectedBlockId = getSelectedBlockClientId();
	const rootClientId = getBlockHierarchyRootClientId( clientId );
	const selectedRootClientId = getBlockHierarchyRootClientId( getSelectedBlockClientId() );
	const blockAttributes = getBlockAttributes( getSelectedBlockClientId() );
	
	//const blockAttributesIde = getState(getSelectedBlockClientId());
	const isSelectedB = isSelected || rootClientId === selectedRootClientId;

	//@p APPUNTI...
	//const getFeaturesBlock = getFeatures();
	// const {
	// 	isEditing
	// } = useSelect( ( select ) => {
	// 	const {
	// 		getSelectedBlockClientId,
	// 		getBlocks,
	// 	} = select( 'core/block-editor' );
	// 		const selectedBlock = getSelectedBlockClientId();
	// 		//getBlocks( props.clientId )
	// 	return isEditing;
	// });
	useEffect( () => {
		/*
		//console.log( Boolean(selectedBlock),isBlockSelected, blockAttributes );
		if(blockAttributes){
			console.log('ide',blockAttributes.ide)
		}
		if(selectedBlock){
			console.log('selectedBlock',selectedBlock);
		}
		if(rootClientId){
			console.log('PARENT-rootClientId',rootClientId);
		}
		if(selectedRootClientId){
			console.log('PARENT-selectedRootClientId',selectedRootClientId)
		}
		if(selectedBlockId){
			console.log('IO-selectedBlockId',selectedBlockId)
		}
		console.log('..clientId',clientId)
		console.log('isSelectedB',isSelectedB)

		if (isBlockSelected(clientId)) {
			console.log('A')
		} else {
			console.log('B')
		}*/
		//return console.log( Boolean(selectedBlock),selectedBlock );
		if(clientId == selectedBlockId){
			//console.log('MODEL',clientId);
		}
	}, [ selectedBlockActive ] );

	function cbfnl($this){
		
	}
	

	useEffect(() => {
		
	});

	//questo callback viene usato quando aggiungo un nuovo [appender]
	const appendBlock = () => {
		//....
	}
	 
	
	// --------
	const removeMediaModel = () => {
		onChangeValue("import_file",{
			import_file: {
				id: 0,
				url: "",
				alt: "",
				title: ""
			}
		});
	}
 	const onSelectMediaModel = (media) => {
		onChangeValue("import_file",{
			import_file: {
				id: media.id,
				url: media.url,
				alt: media.alt,
				title: media.title
			}
		});
	}
	

	function filterNameType(){
		let mmtyp = 'model/gltf-binary';
		switch(import_format_type){
			case 'glb':
				mmtyp = 'model/gltf-binary';
			break
			case 'gltf':
				mmtyp = 'model/gltf-json';
			break
			case 'dae':
				mmtyp = 'model/dae';
			break
			case 'fbx':
				mmtyp = 'model/fbx';
			break
			case 'obj':
				mmtyp = 'text/plain';
			break
		}

		return mmtyp;
	}
	function toFloor(){
		if(importModel3D_element) importModel3D_element.toFloor();
		//applyPosCamera(true,{ fov:40, zoom:1, camx:0, camy:0, camz:4 });
    }
	function showObject(){
		if(importModel3D_element) importModel3D_element.showObject();
		
	}
	function clickResetPos(){
		applyPosCamera(true,{ fov:40, zoom:1, camx:0, camy:0, camz:4 });
    }
	function clickResetTrgt(){
		applyTrgtCamera(true,{ trgtx:0, trgty:0, trgtz:0 });
    }
	function applyPosCamera($useElementChange = true, $ob ){
		
		if($ob){ 
			onChangeValue("camera_fov",{ camera_fov: $ob.fov }, $useElementChange)
			onChangeValue("camera_zoom",{ camera_zoom: $ob.zoom }, $useElementChange)
			onChangeValue("camera_posx",{ camera_posx: $ob.camx }, $useElementChange)
			onChangeValue("camera_posy",{ camera_posy: $ob.camy }, $useElementChange)
			onChangeValue("camera_posz",{ camera_posz: $ob.camz }, $useElementChange)
			onChangeValue("camera_targetx",{ camera_targetx: $ob.trgtx }, $useElementChange)
			onChangeValue("camera_targety",{ camera_targety: $ob.trgty }, $useElementChange)
			onChangeValue("camera_targetz",{ camera_targetz: $ob.trgtz }, $useElementChange)
		}
    }
	function applyTrgtCamera($useElementChange = true, $ob ){
		if($ob){
			onChangeValue("camera_targetx",{ camera_targetx: $ob.trgtx }, $useElementChange)
			onChangeValue("camera_targety",{ camera_targety: $ob.trgty }, $useElementChange)
			onChangeValue("camera_targetz",{ camera_targetz: $ob.trgtz }, $useElementChange)
		}
    }
	function clickResetTransform(){
		applyTransform(true,{posx:0, posy:0, posz:0, rotx:0, roty:0, rotz:0, scale:1})
	}
	function applyTransform($useElementChange = true, $ob ){
		if($ob){
			onChangeValue("geometry_mesh_posx",{ geometry_mesh_posx: $ob.posx }, $useElementChange)
			onChangeValue("geometry_mesh_posy",{ geometry_mesh_posy: $ob.posy }, $useElementChange)
			onChangeValue("geometry_mesh_posz",{ geometry_mesh_posz: $ob.posz }, $useElementChange)
			onChangeValue("geometry_mesh_rotx",{ geometry_mesh_rotx: $ob.rotx }, $useElementChange)
			onChangeValue("geometry_mesh_roty",{ geometry_mesh_roty: $ob.roty }, $useElementChange)
			onChangeValue("geometry_mesh_rotz",{ geometry_mesh_rotz: $ob.rotz }, $useElementChange)
			onChangeValue("geometry_mesh_scale",{ geometry_mesh_scale: $ob.scale }, $useElementChange)
		}
    }

	
	const ALLOWED_BLOCKS = []

	const h = viewport_ratio == "custom" ? {height: viewport_height} : {};
	
	if ( preview ) {
		return(
			<Fragment>
				<img width="100%" height="auto" src={previewImage} />
			</Fragment>
		);
	}
	
	return (
		<>
		<div { ...blockProps }>
		
		<div ref={ scopeRef } id={ `wp3d-importmodel3d-${ instanceId }` } className={`wp3d-instance-element align${align}`}>
			<div className="wp3d-container wp3d-importmodel-container" style={h} >
				<canvas ref={ canvasRef } id={ `wp3d-canvas-${ instanceId }` } className="wp3d-canvas threed-canvas"></canvas>
				<div className="wp3d-loading-message"></div>
				<div className="wp3d-tools-object3d">
					<span className="wp3d-tools-object3d-pos active">&nbsp;</span>
					<span className="wp3d-tools-object3d-rot">&nbsp;</span>
					<span className="wp3d-tools-object3d-scale">&nbsp;</span>
				</div>
				<div className="wp3d-navigator">
					
				</div>
			</div>
		</div>
		
		

			{/* { (import_mode == "media_file" || import_mode == "external_url") && ( 
			<div className="wp3d-trace">
				<span>
					<span className="wp3d-trace-name">
						<span className="dashicon dashicons dashicons-modelimport-wp3d"></span> Model Import </span>
					</span>
					<span><b> {import_mode} </b>&nbsp;
				</span>

				{ import_mode == "media_file" ? (
					import_file.url && (<span>{import_file.url}</span>)
				) : (
					import_folder_path && (<span>{ import_folder_path }/{ import_file_name }.{ import_format_type }</span>)
				)}
				

			</div>
			)} */}
			<div className="wp3d-blocks-list">
				<InnerBlocks
					className="wp3d-innerblock"
					ref={ itemsRef } 
					//orientation='horizontal'
					__experimentalCaptureToolbars={ true }
					//template={onChangeLights(light3D_element)}
					//template={ getCount( countLight ) }
					templateInsertUpdatesSelection={true} 
					allowedBlocks={ ALLOWED_BLOCKS } 
					renderAppender={ () => (
						<Appender label="Add" onAppend={ appendBlock } selectedBlockId={selectedBlockId} rootClientId={ clientId } ide={ide} itemRef={itemsRef} />
					) }
				/>
			</div>
		</div>

		<InspectorControls>
		<PanelBody 
				title={ __( 'Import File 3D', 'wp3d-blocks' )}
				initialOpen={true}
				>
				<ToggleGroupControl 
					id="import-mode-radiogroup"
					label={ __( 'import mode', 'wp3d-blocks' )} //aria-label - not label really
					value={import_mode}
					onChange={ (val) => {
							setChecked(val);
							onChangeValue("import_mode",{import_mode: val}) 
						}
					} 
					isBlock>
					<ToggleGroupControlOption value="media_file" label={ __( 'Media File', 'wp3d-blocks' )} />
					<ToggleGroupControlOption value="external_url" label={ __( 'External URL', 'wp3d-blocks' )} />
        		</ToggleGroupControl>

				
				<div className="components-panel-col">
					<SelectControl
						label={ __( 'Format Type', 'wp3d-blocks' )}
						value={ import_format_type }
						help={__('IMPORTANT: Select the format of the model you are importing.', 'wp3d-blocks')}
						options={ [
							{ label: 'GLTF (gltf-json)', value: 'gltf' },
							{ label: 'GLB (gltf-binary)', value: 'glb' },
							{ label: 'DAE (Collada)', value: 'dae' },
							{ label: 'FBX', value: 'fbx' },
							{ label: 'STL', value: 'stl' },
							{ label: 'USDZ', value: 'usdz' },
							{ label: 'OBJ', value: 'obj' },
						] }
						onChange={ ( val ) => {
							onChangeValue("import_format_type",{ import_format_type: val }) 
							val == "glb" && setAllowedMimetype('model/gltf-binary')
							val == "gltf" && setAllowedMimetype('model/gltf-json')
							val == "dae" && setAllowedMimetype('model/dae')
							val == "fbx" && setAllowedMimetype('model/fbx')
							val == "stl" && setAllowedMimetype('application/octet-stream')
							val == "obj" && setAllowedMimetype('text/plain')
							val == "zip" && setAllowedMimetype('application/zip')
							}
						}
					/>
				</div>
				{ import_mode == "media_file" && 
					<div>
						<ChooseModel3d 
							label={ __( 'Upload Model File', 'wp3d-blocks' )}
							chooselabel={ __( 'Choose an 3D', 'wp3d-blocks' )}
							value={import_file}
							//mimetype={allowedMimetype}
							onAdd={onSelectMediaModel} 
							onRemove={removeMediaModel}
						/>
					</div>

				}

				{ import_mode == "external_url" && <div>
					<TextControl
						label={__('Folder URL', 'wp3d-blocks')}
						value={ import_folder_path }
						help={__('Set the absolute URl to folder. (ex: https://mysite.ext/threed/models/obj/)','wp3d-blocks')}
						onChange={ ( val ) => onChangeValue("import_folder_path",{ import_folder_path: val }) }
					/>
					<TextControl
						label={__('File Name', 'wp3d-blocks')}
						value={ import_file_name }
						help={__('The file name. (without extension)', 'wp3d-blocks')}
						onChange={ ( val ) => onChangeValue("import_file_name",{ import_file_name: val }) }
					/>
				</div>
				}
				
				
				
				<h3 className="panelbody-heading"><Icon icon="admin-settings" /> {__('Options', 'wp3d-blocks')}</h3>
				{animations > 0 && <div>
					<ToggleControl
						label={__('Animation Mixer', 'wp3d-blocks')}
						checked={ import_animationMixer }
						onChange={ ( val ) => onChangeValue("import_animationMixer",{ import_animationMixer: val }) }
					/>
				
					{ import_animationMixer && animations > 2 &&
						<NumberControl
							label={"Index Animation ("+(animations-1)+")"}
							onChange={ ( val ) => onChangeValue("index_animationMixer",{ index_animationMixer: val }) }
							isDragEnabled
							min={ 0 }
							max={ animations-2 }
							value={ index_animationMixer }
						/>
					}
					</div>
				}
				<ToggleControl
					label={ __( 'AutoScale', 'wp3d-blocks' )}
					checked={ import_scalemodel }
					onChange={ ( val ) => onChangeValue("import_scalemodel",{ import_scalemodel: val }) }
				/>
				<Button variant="primary" onClick={ toFloor }>{__('To Floor', 'wp3d-blocks')}</Button>

							
			</PanelBody>
			<PanelBody 
				title={ __( 'Render', 'wp3d-blocks' )}
				initialOpen={false}
				>
				{/* <SelectControl
					label={ __( 'Output Encoding', 'wp3d-blocks' )}
					value={ renderer_outputEncoding }
					options={ [
						{ label: 'NoColorSpace', value: 'NoColorSpace' },
						{ label: 'LinearEncoding', value: 'LinearEncoding' },
						{ label: 'sRGBEncoding', value: 'sRGBEncoding' },
					] }
					onChange={ ( val ) => {
						onChangeValue("renderer_outputEncoding",{ renderer_outputEncoding: val }) 
						}
					}
				/> */}
				<SelectControl
					label={ __( 'Tone Mapping', 'wp3d-blocks' )}
					value={ renderer_toneMapping }
					options={ [
						{ label: 'NoToneMapping', value: 'NoToneMapping' },
						{ label: 'LinearToneMapping', value: 'LinearToneMapping' },
						{ label: 'ReinhardToneMapping', value: 'ReinhardToneMapping' },
						{ label: 'CineonToneMapping', value: 'CineonToneMapping' },
						{ label: 'ACESFilmicToneMapping', value: 'ACESFilmicToneMapping' },
					] }
					onChange={ ( val ) => {
						onChangeValue("renderer_toneMapping",{ renderer_toneMapping: val }) 
						}
					}
				/>
				{renderer_toneMapping != 'NoToneMapping' && 
					<RangeControl
						label={ __( 'Exposure', 'wp3d-blocks' )}
						value={ renderer_toneMapping_exposure }
						onChange={ ( val ) => onChangeValue("renderer_toneMapping_exposure",{ renderer_toneMapping_exposure: val }) }
						min={ 0.01 }
						max={ 10 }
						step={ 0.01 }
					/>
				}
			</PanelBody>
			
			<SkyPanel props={props} onChange={onChangeValue} />
			
			<PanelBody 
			title={ __( 'Light', 'wp3d-blocks' )}
			initialOpen={false}
			>
				<RangeControl
					label={ __( 'Ambient Light Intensity', 'wp3d-blocks' )}
					value={ light_intensity }
					onChange={ ( val ) => onChangeValue("light_intensity",{ light_intensity: val }) }
					min={ 0.01 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={ 1 }
				/>
				<RangeControl
					label={ __( 'Spot Light Intensity', 'wp3d-blocks' )}
					value={ spot_intensity }
					onChange={ ( val ) => onChangeValue("spot_intensity",{ spot_intensity: val }) }
					min={ 0.01 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={ 1 }
				/>
				<RangeControl
					label={ __( 'Left Light Intensity', 'wp3d-blocks' )}
					value={ leftspot_intensity }
					onChange={ ( val ) => onChangeValue("leftspot_intensity",{ leftspot_intensity: val }) }
					min={ 0 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={ 0 }
				/>
				<RangeControl
					label={ __( 'Right Light Intensity', 'wp3d-blocks' )}
					value={ rightspot_intensity }
					onChange={ ( val ) => onChangeValue("rightspot_intensity",{ rightspot_intensity: val }) }
					min={ 0 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={ 0 }
				/>
			</PanelBody>
			
			<PanelBody 
				title={ __( 'Contact Shadow', 'wp3d-blocks' )}
				initialOpen={false}
				>
					{/* "color":"#000000", "blurx":0.5, "blury":0.5, "sensibility":0.5, "darkness":1,"opacity":1 */}
					<ToggleControl
						label={ __( 'Enable Contact Shadow', 'wp3d-blocks' )}
						checked={ enableContactshadow }
						onChange={ ( val ) => onChangeValue("enableContactshadow",{ enableContactshadow: val }) }
					/>
					{enableContactshadow && <><RangeControl
						label={ __( 'Blur X', 'wp3d-blocks' )}
						value={ cs_blurx }
						onChange={ ( val ) => onChangeValue("contactshadow-blurx",{ cs_blurx: val }) }
						min={ 0 }
						max={ 2 }
						step={ 0.01 }
						allowReset={true}
						resetFallbackValue={ 0.5 }
					/>
					<RangeControl
						label={ __( 'Blur Y', 'wp3d-blocks' )}
						value={ cs_blury }
						onChange={ ( val ) => onChangeValue("contactshadow-blury",{ cs_blury: val }) }
						min={ 0 }
						max={ 2 }
						step={ 0.01 }
						allowReset={true}
						resetFallbackValue={ 0.5 }
					/>
					<RangeControl
						label={ __( 'Sensibility', 'wp3d-blocks' )}
						value={ cs_sensibility }
						onChange={ ( val ) => onChangeValue("contactshadow-sensibility",{ cs_sensibility: val }) }
						min={ 0 }
						max={ 2 }
						step={ 0.01 }
						allowReset={true}
						resetFallbackValue={ 0.5 }
					/>
					<RangeControl
						label={ __( 'Darkness', 'wp3d-blocks' )}
						value={ cs_darkness}
						onChange={ ( val ) => onChangeValue("contactshadow-darkness",{ cs_darkness: val }) }
						min={ 0 }
						max={ 2 }
						step={ 0.01 }
						allowReset={true}
						resetFallbackValue={ 1 }
					/>
					<RangeControl
						label={ __( 'Opacity', 'wp3d-blocks' )}
						value={ cs_opacity }
						onChange={ ( val ) => onChangeValue("contactshadow-opacity",{ cs_opacity: val }) }
						min={ 0 }
						max={ 1 }
						step={ 0.01 }
						allowReset={true}
						resetFallbackValue={ 1 }
					/>
					<ColorPicker
						label={ __( 'Color', 'wp3d-blocks' )}
						color={cs_color}
						onChange={ ( val ) => onChangeValue("contactshadow-color",{ cs_color: val }) }
						//enableAlpha
						defaultValue="#000000"
					/>
					</>}
			</PanelBody>
			<PanelBody 
				title={ __( 'Shadows', 'wp3d-blocks' )}
				initialOpen={false}
				>
				<ToggleControl
					label={ __( 'CastShadow', 'wp3d-blocks' )}
					checked={ objshadows_castShadow }
					onChange={ ( val ) => onChangeValue("objshadows_castShadow",{ objshadows_castShadow: val }) }
				/>
				<ToggleControl
					label={ __( 'ReceiveShadow', 'wp3d-blocks' )}
					checked={ objshadows_receiveShadow }
					onChange={ ( val ) => onChangeValue("objshadows_receiveShadow",{ objshadows_receiveShadow: val }) }
				/>
			</PanelBody>
			<PanelBody 
				title={ __( 'Interactivity', 'wp3d-blocks' )}
				initialOpen={false}
				>
				{/* <h3><Icon icon="move" /> {__('Interactivity', 'wp3d-blocks')}</h3> */}
				<ToggleControl
					label={ __( 'Damping', 'wp3d-blocks' )}
					checked={ useDamping }
					onChange={ ( val ) => onChangeValue("useDamping",{ useDamping: val }) }
				/>
				{ useDamping && (
						<RangeControl
						label={ __( 'Damping Factor', 'wp3d-blocks' )}
						value={ dampingFactor }
						onChange={ ( val ) => onChangeValue("dampingFactor",{ dampingFactor: val }) }
						min={ 0.01 }
						max={ 0.1 }
						step={ 0.01 }
						resetFallbackValue={ 0.01 }
						/>
					)
				}
				<ToggleControl
					label={ __( 'Zoom on Wheel', 'wp3d-blocks' )}
					checked={ useZoom }
					onChange={ ( val ) => onChangeValue("useZoom",{ useZoom: val }) }
				/>
				<ToggleControl
					label={ __( 'Autorotate', 'wp3d-blocks' )}
					checked={ autorotate }
					onChange={ ( val ) => onChangeValue("autorotate",{ autorotate: val }) }
				/>
				{ autorotate && (
						<RangeControl
						label="Speed"
						value={ autorotateSpeed }
						onChange={ ( val ) => onChangeValue("autorotateSpeed",{ autorotateSpeed: val }) }
						min={ 0.1 }
						max={ 20 }
						step={ 0.1 }
						resetFallbackValue={1}
						/>
					)
				}
			</PanelBody>
			<PanelBody 
			title={ __( 'Camera', 'wp3d-blocks' )}
			initialOpen={false}
			>
				<RangeControl
					label={ __( 'Fov', 'wp3d-blocks' )}
					value={ camera_fov }
					onChange={ ( val ) => onChangeValue("camera_fov",{ camera_fov: val }) }
					min={ 10 }
					max={ 180 }
					allowReset={true}
					resetFallbackValue={40}
				/>
				<RangeControl
					label="Zoom"
					value={ camera_zoom }
					onChange={ ( val ) => onChangeValue("camera_zoom",{ camera_zoom: val }) }
					min={ 0.1 }
					max={ 3 }
					step={ 0.001 }
					allowReset={true}
					resetFallbackValue={1}
				/>
				<div className="components-panel-col">
				<h3><Icon icon="video-alt2" /> {__('Camera Position', 'wp3d-blocks')}</h3>
				<RangeControl
					label="X"
					value={ camera_posx }
					onChange={ ( val ) => onChangeValue("camera_posx",{ camera_posx: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Y"
					value={ camera_posy }
					onChange={ ( val ) => onChangeValue("camera_posy",{ camera_posy: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Z"
					value={ camera_posz }
					onChange={ ( val ) => onChangeValue("camera_posz",{ camera_posz: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={4}
				/>
				<Button variant="primary" onClick={ clickResetPos }>{__('Reset position', 'wp3d-blocks')}</Button>
				<Button variant="primary" onClick={ showObject }>{__('Show Object', 'wp3d-blocks')}</Button>
				</div>
				<div className="components-panel-col">
				<h3><Icon icon="plus" /> {__('Camera Target', 'wp3d-blocks')}</h3>
				<RangeControl
					label="X"
					value={ camera_targetx }
					onChange={ ( val ) => onChangeValue("camera_targetx",{ camera_targetx: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Y"
					value={ camera_targety }
					onChange={ ( val ) => onChangeValue("camera_targety",{ camera_targety: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Z"
					value={ camera_targetz }
					onChange={ ( val ) => onChangeValue("camera_targetz",{ camera_targetz: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<Button variant="primary" onClick={ clickResetTrgt }>{__('Reset position', 'wp3d-blocks')}</Button>
				</div>
			</PanelBody>	
			<PanelBody 
			title={ __( 'Transform', 'wp3d-blocks' )}
			initialOpen={false}
			>
				<ToggleControl
					label={ __( 'Enable Transform', 'wp3d-blocks' ) }
					checked={ enableTransform }
					onChange={ ( val ) => onChangeValue("enableTransform",{ enableTransform: val }) }
				/>
				
				{enableTransform && 
				<div>
					
					<RangeControl
					label="X"
					value={ geometry_mesh_posx }
					onChange={ ( val ) => onChangeValue("geometry_mesh_posx",{ geometry_mesh_posx: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Y"
					value={ geometry_mesh_posy }
					onChange={ ( val ) => onChangeValue("geometry_mesh_posy",{ geometry_mesh_posy: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Z"
					value={ geometry_mesh_posz }
					onChange={ ( val ) => onChangeValue("geometry_mesh_posz",{ geometry_mesh_posz: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>

				<h3><Icon icon="plus" /> {__('Rotation', 'wp3d-blocks')}</h3>
				<RangeControl
					label="X"
					value={ geometry_mesh_rotx }
					onChange={ ( val ) => onChangeValue("geometry_mesh_rotx",{ geometry_mesh_rotx: val }) }
					min={ -180 }
					max={ 180 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Y"
					value={ geometry_mesh_roty }
					onChange={ ( val ) => onChangeValue("geometry_mesh_roty",{ geometry_mesh_roty: val }) }
					min={ -180 }
					max={ 180 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Z"
					value={ geometry_mesh_rotz }
					onChange={ ( val ) => onChangeValue("geometry_mesh_rotz",{ geometry_mesh_rotz: val }) }
					min={ -180 }
					max={ 180 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				
				<RangeControl
					label={__( 'Scale', 'wp3d-blocks' )}
					value={ geometry_mesh_scale }
					onChange={ ( val ) => onChangeValue("geometry_mesh_scale",{ geometry_mesh_scale: val }) }
					min={ 0.01 }
					max={ 10 }
					step={ 0.01 }
					allowReset={true}
					resetFallbackValue={1}
				/>

				<Button variant="primary" onClick={ clickResetTransform }>{__( 'Reset Rotation', 'wp3d-blocks' )}</Button>
					
				</div>}
				
			</PanelBody>
			<PanelBody 
			title={ __( 'Navigator', 'wp3d-blocks' )}
			initialOpen={false}
			>
				<ToggleControl
					label={ __( 'Left', 'wp3d-blocks' )}
					checked={ nav_left }
					onChange={ ( val ) => onChangeValue("nav_left",{ nav_left: val }) }
				/>
				<ToggleControl
					label={ __( 'Right', 'wp3d-blocks' )}
					checked={ nav_right }
					onChange={ ( val ) => onChangeValue("nav_right",{ nav_right: val }) }
				/>
				<ToggleControl
					label={ __( 'Top', 'wp3d-blocks' )}
					checked={ nav_top }
					onChange={ ( val ) => onChangeValue("nav_top",{ nav_top: val }) }
				/>
				<ToggleControl
					label={ __( 'Bottom', 'wp3d-blocks' )}
					checked={ nav_bottom }
					onChange={ ( val ) => onChangeValue("nav_bottom",{ nav_bottom: val }) }
				/>
				<ToggleControl
					label={ __( 'Front', 'wp3d-blocks' )}
					checked={ nav_front }
					onChange={ ( val ) => onChangeValue("nav_front",{ nav_front: val }) }
				/>
				<ToggleControl
					label={ __( 'Back', 'wp3d-blocks' )}
					checked={ nav_back }
					onChange={ ( val ) => onChangeValue("nav_back",{ nav_back: val }) }
				/>
				<ToggleControl
					label={ __( 'Default', 'wp3d-blocks' )}
					checked={ nav_default }
					onChange={ ( val ) => onChangeValue("nav_default",{ nav_default: val }) }
				/>
			</PanelBody>
			<ViewportPanel props={props} onChange={onChangeValue} />
			
			<PanelBody 
				title={ __( 'Helpers', 'wp3d-blocks' )}
				initialOpen={false}
				>
				<p>{ __( 'These options are only visible in the editor', 'wp3d-blocks' )}</p>
				<ToggleControl
					label={ __( 'Center', 'wp3d-blocks' )}
					checked={ helper_center }
					onChange={ ( val ) => onChangeValue("helper_center",{ helper_center: val }) }
				/>
				<ToggleControl
					label={ __( 'Floor', 'wp3d-blocks' )}
					checked={ helper_floor }
					onChange={ ( val ) => onChangeValue("helper_floor",{ helper_floor: val }) }
				/>
				<ToggleControl
					label={ __( 'Light', 'wp3d-blocks' )}
					checked={ helper_spotlight }
					onChange={ ( val ) => onChangeValue("helper_spotlight",{ helper_spotlight: val }) }
				/>
				{/* <ToggleControl
					label={ __( 'Left Light', 'wp3d-blocks' )}
					checked={ helper_leftlight }
					onChange={ ( val ) => onChangeValue("helper_leftlight",{ helper_leftlight: val }) }
				/>
				<ToggleControl
					label={ __( 'Right Light', 'wp3d-blocks' )}
					checked={ helper_rightlight }
					onChange={ ( val ) => onChangeValue("helper_rightlight",{ helper_rightlight: val }) }
				/> */}
			</PanelBody>
			{/* <PanelBody 
				title={ __( 'Helpers', 'wp3d-blocks' )}
				initialOpen={false}
				>
					<h5>{__( 'Select helpers', 'wp3d-blocks' )}</h5>
					<ul>
						<li>{__( 'Floor', 'wp3d-blocks' )}</li>
						<li>{__( 'Center', 'wp3d-blocks' )}</li>
						<li>{__( 'Spot Light', 'wp3d-blocks' )}</li>
						<li>{__( 'Left Light', 'wp3d-blocks' )}</li>
						<li>{__( 'Right Light', 'wp3d-blocks' )}</li>
					</ul>
					<FormTokenField

						value={ selectedHelpers }
						suggestions={ helpers }
						onChange={ ( tokens ) => {
							setSelectedHelpers( tokens )
							onChangeValue("helpers",{ helpers: tokens })
						} }
					/>
					
					<p>{ __( 'These options are only visible in the editor', 'wp3d-blocks' )}</p>
					
				</PanelBody> */}
		</InspectorControls>
		</>
	);
}
