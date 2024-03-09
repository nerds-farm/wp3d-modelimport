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
	TextareaControl,
	PanelBody,
	PanelRow,
	SelectControl,
	RangeControl,
	ToggleControl,
	ColorPicker,
	Icon,
	Button
} from '@wordpress/components'

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';

import ChooseImage from '../../../../components/ChooseImage.js';

import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import { useInstanceId, useFocusReturn } from "@wordpress/compose";

import e_threed_class_light from '../../../../classes/class.e_threed_light.js';

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
 

export default function Edit( { attributes, setAttributes, clientId } ) {
	const [light3D_element, setLight3D_element] = useState( '' );
	const blockProps = useBlockProps();
	const scopeRef = useRef();
	const instanceId = useInstanceId(Edit);

	const { ide,
			light_type,
			light_color,
			light_intensity,
			light_decay,
			light_penumbra,
			light_angle,
			light_distance,
			lightpoint_fly,
			geometry_light_posx,
			geometry_light_posy,
			geometry_light_posz,
			geometry_light_targetx,
			geometry_light_targety,
			geometry_light_targetz,
			light_map,
			geometry_shadow_focus,
			enable_shadows,
			geometry_shadow_radius,
			geometry_shadow_blurSamples
	} = attributes;

	

	/*const [scene3D_element, setScene3D_element] = useState(() => {
		// getting stored value
		
		const sceneInstance = localStorage.getItem('scene3d_'+sceneId);
		const initialValue = JSON.parse(sceneInstance);
		return initialValue || "";
	});*/

	function getStorageValue(key, defaultValue) {
		// getting stored value
		const saved = localStorage.getItem(key);
		const initial = JSON.parse(saved);
		return initial || defaultValue;
	}
	useEffect(() => {
		setAttributes( { ide: `wp3d-light3d-${ instanceId }` } );
	},[]);
	// useEffect(() => {
	// 	setLight3D_element(jQuery(scopeRef).data('light'));

	// 	console.log(jQuery(scopeRef.current).data('light'));
	// 	console.log(jQuery(scopeRef));
	// },[scopeRef]);
	
	useEffect(() => {
		setLight3D_element( jQuery(scopeRef.current).data('light') );
	},[ide]);
	
	
	
	//const { removeBlock, insertBlock } = useDispatch( 'core/block-editor' );
	//const { pippo } = useDispatch( 'wp3d/modelimport' );



	// --------------------------------------------------------------
	const selectedBlockActive = useSelect(
		( select ) => select( 'core/block-editor' ).getSelectedBlock()
	);
	
	const {
		getSelectedBlock,
		getBlockHierarchyRootClientId,
		getSelectedBlockClientId,
		getBlockAttributes,
	} = useSelect( ( select ) => 
		select( 'core/block-editor' )
	);
	//Get block properties on.
	const selectedBlock = getSelectedBlock();
	const selectedBlockId = getSelectedBlockClientId();
	const rootClientId = getBlockHierarchyRootClientId( clientId );
	const blockAttributes = getBlockAttributes( getSelectedBlockClientId() );

	useEffect( () => {
		  if(clientId == selectedBlockId){
			//console.log(clientId);
			//console.log(jQuery(scopeRef.current).data('light'));
			if(jQuery(scopeRef.current).data('light')){
				jQuery(scopeRef.current).data('light').updateHelperMesh(ide);
				jQuery(scopeRef.current).data('light').on('transformcontrolchange',($objPos)=>{
					const obpos = {posx: $objPos[0], posy: $objPos[1], posz: $objPos[2]}
					
					applyTransform(false, obpos);
				});
			}
		  }else{
			if(jQuery(scopeRef.current).data('light')){
				jQuery(scopeRef.current).data('light').updateHelperMesh();
				jQuery(scopeRef.current).data('light').off('transformcontrolchange');
			}
		  }
	}, [ selectedBlockActive ] );
	// --------------------------------------------------------------


	
	function clickResetTransform(){
		applyTransform(true,{posx:0, posy:0, posz:0})
	}
	function applyTransform($useElementChange = true, $ob ){
		if($ob){
			onChangeValue("geometry_light_posx",{ geometry_light_posx: $ob.posx }, $useElementChange)
			onChangeValue("geometry_light_posy",{ geometry_light_posy: $ob.posy }, $useElementChange)
			onChangeValue("geometry_light_posz",{ geometry_light_posz: $ob.posz }, $useElementChange)
		}
    }

 
	function onChangeValue(prop, val, $useElementChange = true){
		setAttributes( val );

		attributes[prop] = val[prop];

		//console.log(jQuery(scopeRef.current).data('light'));
		if($useElementChange) jQuery(scopeRef.current).data('light').elementChange(ide, prop, attributes);
	}





	const removeMediaLightMap = () => {
		onChangeValue("light_map",{
			light_map: {
				id: 0,
				url: "",
				alt: "",
				title: ""
			}
		});
	}
 	const onSelectMediaLightMap = (media) => {
		onChangeValue("light_map",{
			light_map: {
				id: media.id,
				url: media.url,
				alt: media.alt,
				title: media.title
			}
		});
	}

	return (
		<>
		<div { ...blockProps }>
			<div ref={ scopeRef } id={ ide } className="wp3d-light3d-itemlight" data-settings={ JSON.stringify(attributes) }>
				<span className="wp3d-trace">
					<span className="wp3d-trace-name">
						<span className="dashicon dashicons dashicons-light-wp3d"></span> Lighth&nbsp;
					</span>
					<span className="wp3d-trace-type">{light_type}</span>
					<span className="wp3d-trace-color">{light_color}</span>
					{/* <span><b>&nbsp;X:</b> {geometry_light_posx}</span> 
					<span><b>&nbsp;Y:</b> {geometry_light_posy}</span> 
					<span><b>&nbsp;Z:</b> {geometry_light_posz}</span> */}
				</span>
			</div>
		</div>
		

		<InspectorControls>
			
			<PanelBody 
			title={ __( 'Light', 'wp3d-blocks' )}
			initialOpen={true}
			>
				<SelectControl
					label={ __( 'Light Type', 'wp3d-blocks' )}
					value={ light_type }
					options={ [
						{ label: 'Point', value: 'pointLight' },
						{ label: 'Directional', value: 'directionalLight' },
						{ label: 'Spot', value: 'spotLight' },
					] }
					onChange={ ( val ) => {
						onChangeValue("light_type",{ light_type: val }) 
						}
					}
				/>
				<ColorPicker
					label={ __( 'Light Color', 'wp3d-blocks' )}
					color={light_color}
					onChange={ ( val ) => onChangeValue("light_color",{ light_color: val }) }
					//enableAlpha
					defaultValue="#FFF"
				/>
				<RangeControl
					label={ __( 'Intensity', 'wp3d-blocks' )}
					value={ light_intensity }
					onChange={ ( val ) => onChangeValue("light_intensity",{ light_intensity: val }) }
					min={ 0 }
					max={ 20 }
					step={ 0.01 }
					resetFallbackValue={ 1 }
				/>
				<h3 className="panelbody-heading"><Icon icon="admin-settings" /> {__('Options', 'wp3d-blocks')}</h3>
				
				{(light_type == 'pointLight' || light_type == 'spotLight') && (
					<div>
						<RangeControl
							label={ __( 'Decay', 'wp3d-blocks' )}
							value={ light_decay }
							onChange={ ( val ) => onChangeValue("light_decay",{ light_decay: val }) }
							min={ 1 }
							max={ 2 }
							step={ 0.001 }
							resetFallbackValue={ 1 }
						/>
						<RangeControl
							label={ __( 'Distance', 'wp3d-blocks' )}
							value={ light_distance }
							onChange={ ( val ) => onChangeValue("light_distance",{ light_distance: val }) }
							min={ 0 }
							max={ 100 }
							step={ 1 }
							resetFallbackValue={ 3 }
						/>
					</div>
				)}
				{(light_type == 'spotLight') && (
					<div>
						<RangeControl
							label={ __( 'Penumbra', 'wp3d-blocks' )}
							value={ light_penumbra }
							onChange={ ( val ) => onChangeValue("light_penumbra",{ light_penumbra: val }) }
							min={ 0 }
							max={ 1 }
							step={ 0.001 }
							resetFallbackValue={ 0.5 }
						/>
						<RangeControl
							label={ __( 'Angle', 'wp3d-blocks' )}
							value={ light_angle }
							onChange={ ( val ) => onChangeValue("light_angle",{ light_angle: val }) }
							min={ 1 }
							max={ 36 }
							step={ 0.01 }
							resetFallbackValue={ 3 }
						/>
					</div>
				)}
				{light_type == 'pointLight' && (
					<ToggleControl
						label={ __( 'Flying Point', 'wp3d-blocks' )}
						// help={
						// 	lightpoint_fly
						// 		? 'Show'
						// 		: 'Hide'
						// }
						checked={ lightpoint_fly }
						onChange={ ( val ) => onChangeValue("lightpoint_fly",{ lightpoint_fly: val }) }
					/>
				)}
				<h3 className="panelbody-heading"><Icon icon="move" /> {__('Position', 'wp3d-blocks')}</h3>
				<RangeControl
					label={ __( 'Pos-X', 'wp3d-blocks' )}
					value={ geometry_light_posx }
					onChange={ ( val ) => onChangeValue("geometry_light_posx",{ geometry_light_posx: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ -2 }
				/>
				<RangeControl
					label={ __( 'Pos-Y', 'wp3d-blocks' )}
					value={ geometry_light_posy }
					onChange={ ( val ) => onChangeValue("geometry_light_posy",{ geometry_light_posy: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ 0 }
				/>
				<RangeControl
					label={ __( 'Pos-Z', 'wp3d-blocks' )}
					value={ geometry_light_posz }
					onChange={ ( val ) => onChangeValue("geometry_light_posz",{ geometry_light_posz: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ 0 }
				/>
				{(light_type == 'directionalLight' || light_type == 'spotLight') && (
				<div>
					<h3 className="panelbody-heading"><Icon icon="insert" /> {__('Target', 'wp3d-blocks')}</h3>
					<RangeControl
						label={ __( 'X', 'wp3d-blocks' )}
						value={ geometry_light_targetx }
						onChange={ ( val ) => onChangeValue("geometry_light_targetx",{ geometry_light_targetx: val }) }
						min={ -10 }
						max={ 10 }
						step={ 0.001 }
						resetFallbackValue={ 0 }
					/>
					<RangeControl
						label={ __( 'Y', 'wp3d-blocks' )}
						value={ geometry_light_targety }
						onChange={ ( val ) => onChangeValue("geometry_light_targety",{ geometry_light_targety: val }) }
						min={ -10 }
						max={ 10 }
						step={ 0.001 }
						resetFallbackValue={ 0 }
					/>
					<RangeControl
						label={ __( 'Z', 'wp3d-blocks' )}
						value={ geometry_light_targetz }
						onChange={ ( val ) => onChangeValue("geometry_light_targetz",{ geometry_light_targetz: val }) }
						min={ -10 }
						max={ 10 }
						step={ 0.001 }
						resetFallbackValue={ 0 }
					/>
				</div>)}
				
				{/* <TextControl
					label="Label" 
					value={ hp_text }
					onChange={ ( val ) => setAttributes( { hp_text: val } ) }
				/>
				<TextareaControl
					label="Description"
					help="Enter some text"
					value={ hp_description }
					onChange={ ( val ) => setAttributes( { hp_description: val } ) }
				/>
				<TextControl
					label="Latitude" 
					value={ hp_lat }
					onChange={ ( val ) => setAttributes( { hp_lat: val } ) }
				/>
				<TextControl
					label="Longitude" 
					value={ hp_lng }
					onChange={ ( val ) => setAttributes( { hp_lng: val } ) }
				/> */}

			</PanelBody>
			<PanelBody 
			title={ __( 'Shadows', 'wp3d-blocks' )}
			initialOpen={true}
			>
			<ToggleControl
				label={ __( 'Enable Shadows', 'wp3d-blocks' )}
				// help={
				// 	enable_shadows
				// 		? 'Show'
				// 		: 'Hide'
				// }
				checked={ enable_shadows }
				onChange={ ( val ) => onChangeValue("enable_shadows",{ enable_shadows: val }) }
			/>
			{
				(enable_shadows && <div>
					<RangeControl
						label={ __( 'Radius', 'wp3d-blocks' )}
						value={ geometry_shadow_radius }
						onChange={ ( val ) => onChangeValue("geometry_shadow_radius",{ geometry_shadow_radius: val }) }
						min={ 0 }
						max={ 100 }
						step={ 0.001 }
						resetFallbackValue={ 0 }
					/>
					<RangeControl
						label={ __( 'Blur Samples', 'wp3d-blocks' )}
						value={ geometry_shadow_blurSamples }
						onChange={ ( val ) => onChangeValue("geometry_shadow_blurSamples",{ geometry_shadow_blurSamples: val }) }
						min={ 0 }
						max={ 50 }
						step={ 1 }
						resetFallbackValue={ 0 }
					/>
				</div>)
			}
			</PanelBody>
			{(light_type == 'spotLight') && (
				<PanelBody 
				title={ __( 'Light Map', 'wp3d-blocks' )}
				initialOpen={true}
				>
				<ChooseImage
					label={ __( 'Map Image', 'wp3d-blocks' )}
					chooselabel="Choose an image" 
					value={light_map}
					mimetype={allowedMimetype}
					onAdd={onSelectMediaLightMap} 
					onRemove={removeMediaLightMap}
				/>
				<RangeControl
					label={ __( 'Focus', 'wp3d-blocks' )}
					value={ geometry_shadow_focus }
					onChange={ ( val ) => onChangeValue("geometry_shadow_focus",{ geometry_shadow_focus: val }) }
					min={ 0 }
					max={ 1 }
					step={ 0.001 }
					resetFallbackValue={ 1 }
				/>
				</PanelBody>
				)}
			
		</InspectorControls>
		</>
	);
}
