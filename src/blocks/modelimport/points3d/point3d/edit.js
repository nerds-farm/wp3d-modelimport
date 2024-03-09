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
	RangeControl,
	ToggleControl,
	Icon,
	Button
} from '@wordpress/components'

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';


import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import { useInstanceId, useFocusReturn } from "@wordpress/compose";


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
	const blockProps = useBlockProps();
	const scopeRef = useRef();
	const instanceId = useInstanceId(Edit);

	const [ importModel3D_element, setImportmodel3D_element ] = useState( '' );

	const { _id,
		hp_n,
		trigger_id,
		hp_text,
		hp_description,
		hp_color,
		hp_shape,
		hp_x,
		hp_y,
		hp_z,
		camera_fov,
		camera_zoom,
		camera_posx,
		camera_posy,
		camera_posz
	} = attributes;

	function onChangeValue(prop, val, $useElementChange = true){
		setAttributes( val );

		attributes[prop] = val[prop];

		//console.log(jQuery(scopeRef.current).data('points'));
		//if($useElementChange) jQuery(scopeRef.current).data('points').elementChange(ide, prop, attributes);
	}

	function clickResetPos(){
		applyPosCamera(true,{ fov:40, zoom:1, camx:0, camy:0, camz:20 });
    }
	function applyPosCamera($useElementChange = true, $ob ){
		if($ob){
			onChangeValue("camera_fov",{ camera_fov: $ob.fov }, $useElementChange)
			onChangeValue("camera_zoom",{ camera_zoom: $ob.zoom }, $useElementChange)
			onChangeValue("camera_posx",{ camera_posx: $ob.camx }, $useElementChange)
			onChangeValue("camera_posy",{ camera_posy: $ob.camy }, $useElementChange)
			onChangeValue("camera_posz",{ camera_posz: $ob.camz }, $useElementChange)
		}
    }
	

	useEffect(() => {
		// console.log(rootBlock);
		// console.log(innerBlocksProps);
		// console.log('block-'+rootClientId);

		if(_id != `wp3d-point-${ instanceId }`)
		setAttributes( { _id: `wp3d-point-${ instanceId }` } );
		
		let count = String(jQuery(scopeRef.current).parent().index()+1);
		if( count != hp_n )
		setAttributes( { hp_n: count } );

		setTimeout(()=>{
			//console.log(jQuery(scopeRef.current).data('scene'))
			setImportmodel3D_element( jQuery(scopeRef.current).data('scene') );
		},500)
		
	},[]);
	useEffect(() => {
		
	},[_id]);

	return (
		<>
		
		<div { ...blockProps }>
			<div ref={ scopeRef } id={ _id } className="wp3d-point3d-itempoint" data-settings={ JSON.stringify(attributes) }>
			<span className="wp3d-trace">
					<span className="wp3d-trace-name">
						<span className="dashicon dashicons dashicons-point-wp3d"></span> {__( 'Point', 'wp3d-earth' )}({ hp_n })&nbsp;
					</span>
					<span className="wp3d-trace-label">{hp_text}</span>
			</span>
			<span className="info-point"></span>
				<canvas className="circlenumber" id={ `number-${ _id }` } width="64" height="64"></canvas>
			</div>
		</div>
		

		<InspectorControls>
			
			<PanelBody 
			title={ __( 'Point', 'wp3d-blocks' )}
			initialOpen={true}
			>
				<TextControl
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
				<h3 className="panelbody-heading"><Icon icon="move" /> {__('Position', 'wp3d-blocks')}</h3>
				<RangeControl
					label={ __( 'Pos-X', 'wp3d-blocks' )}
					value={ hp_x }
					onChange={ ( val ) => onChangeValue("hp_x",{ hp_x: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ -2 }
				/>
				<RangeControl
					label={ __( 'Pos-Y', 'wp3d-blocks' )}
					value={ hp_y }
					onChange={ ( val ) => onChangeValue("hp_y",{ hp_y: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ 0 }
				/>
				<RangeControl
					label={ __( 'Pos-Z', 'wp3d-blocks' )}
					value={ hp_z }
					onChange={ ( val ) => onChangeValue("hp_z",{ hp_z: val }) }
					min={ -10 }
					max={ 10 }
					step={ 0.001 }
					resetFallbackValue={ 0 }
				/>
				
			</PanelBody>
			<PanelBody 
			title={ __( 'Camera', 'wp3d-blocks' )}
			initialOpen={false}
			>
				<RangeControl
					label="Fov"
					value={ camera_fov }
					onChange={ ( val ) => onChangeValue("camera_fov",{ camera_fov: val }) }
					min={ 10 }
					max={ 180 }
					
					resetFallbackValue={40}
				/>
				<RangeControl
					label="Zoom"
					value={ camera_zoom }
					onChange={ ( val ) => onChangeValue("camera_zoom",{ camera_zoom: val }) }
					min={ 0.1 }
					max={ 3 }
					step={ 0.001 }
					resetFallbackValue={1}
				/>
				<h3><Icon icon="video-alt2" /> {__('Camera Position', 'wp3d-blocks')}</h3>
				<RangeControl
					label="X"
					value={ camera_posx }
					onChange={ ( val ) => onChangeValue("camera_posx",{ camera_posx: val }) }
					min={ -3000 }
					max={ 3000 }
					step={ 0.1 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Y"
					value={ camera_posy }
					onChange={ ( val ) => onChangeValue("camera_posy",{ camera_posy: val }) }
					min={ -3000 }
					max={ 3000 }
					step={ 0.1 }
					allowReset={true}
					resetFallbackValue={0}
				/>
				<RangeControl
					label="Z"
					value={ camera_posz }
					onChange={ ( val ) => onChangeValue("camera_posz",{ camera_posz: val }) }
					min={ -3000 }
					max={ 3000 }
					step={ 0.1 }
					allowReset={true}
					resetFallbackValue={300}
				/>
				<Button variant="primary" onClick={ clickResetPos }>Reset position</Button>
			</PanelBody>
		</InspectorControls>
		</>
	);
}
