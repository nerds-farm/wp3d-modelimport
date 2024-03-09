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
	SelectControl,
	PanelRow,
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
import { InnerBlocks, useBlockProps, InspectorControls } from '@wordpress/block-editor';

import { useDispatch, useSelect } from '@wordpress/data'; //??????
import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import { useInstanceId, useFocusReturn } from "@wordpress/compose";

import Appender from '../../../components/Appender.js';

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
	const blockProps = useBlockProps();
	const scopeRef = useRef();
	const itemsRef = useRef();
	const instanceId = useInstanceId(Edit);
		
	const { attributes, setAttributes, clientId } = props;

	const { _id,
		triggers,
		hps_color,
		hps_shape,
		
	} = attributes; 
	
	function onChangeValue(prop, val, $useElementChange = true){
		setAttributes( val );

		attributes[prop] = val[prop];

		//console.log(jQuery(scopeRef.current).data('lights'));
		//if($useElementChange) jQuery(scopeRef.current).data('lights').elementChange(ide, prop, attributes);
	}

	useEffect(() => {
		setAttributes( { _id: `wp3d-lights-${ instanceId }` } );
	},[]);
	
	// -----------------------------------------------------------
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
	// -----------------------------------------------------------


	//questo callback viene usato quando aggiungo un nuovo [appender]
	const appendBlock = () => {
		//....
	}

	return (
		<>
		<div { ...blockProps }>
			<div ref={ scopeRef } id={ _id } className="wp3d-lights3d-itemlights" data-settings={ JSON.stringify(attributes) }>
				<span className="wp3d-trace">
					<span className="wp3d-trace-name">
						<span className="dashicon dashicons dashicons-light-wp3d"></span> 3D LIGHTS
					</span> 
				</span>

				<div className="wp3d-lights-list">
					<InnerBlocks
						className="wp3d-innerblock"
						templateLock={false}
						ref={itemsRef}
						allowedBlocks={ ["wp3d/model-light3d"] } 
						renderAppender={ () => (
							<Appender label="Add Light" onAppend={ appendBlock } selectedBlockId={selectedBlockId} rootClientId={ clientId } ide={_id} itemRef={itemsRef} />
						) }
					/>
				</div>
			</div>
		</div>
		

		<InspectorControls>
			
			<PanelBody 
			title={ __( 'Lights', 'wp3d-blocks' )}
			initialOpen={true}
			>
				<div className="wp3d-lights-list wp3d-lights-list-panel">
					<InnerBlocks
					className="wp3d-innerblock"
					templateLock={false}
					allowedBlocks={ ["wp3d/model-light3d"] } 
					renderAppender={ () => (
						<Appender label="Add Light" onAppend={ appendBlock } selectedBlockId={selectedBlockId} rootClientId={ clientId } ide={_id} itemRef={itemsRef} />
					) }
					/>
				</div>

			</PanelBody>
		</InspectorControls>
		</>
	);
}
