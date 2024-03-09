import { __ } from '@wordpress/i18n';

import { useState, useEffect, useRef, Fragment } from '@wordpress/element';
import {
	TextControl,
	TextareaControl,
	PanelBody,
	SelectControl,
	PanelRow,
	RangeControl,
	ToggleControl,
	Icon,
	Button,
	ColorPicker,
	__experimentalUnitControl as UnitControl
} from '@wordpress/components'

// My components
import ChooseImage from './ChooseImage.js';

export default function SkyPanel( prop ) {
	const { attributes, setAttributes, clientId } = prop.props;
	const onChangeValue = prop.onChange;
	const isOpen = Boolean(prop.isOpen);
	const isEarth = prop.isEarth || false;
	const { 
		stars,
		light_intensity,
		sky_type,
		sky_transparent,
		sky_color,
		sky_showimage,
		sky_environmentimage,
		sky_image,
		material_metalness,
		material_roughness
	} = attributes;

	const removeMediaSky = () => {
		onChangeValue("sky_image",{
			sky_image: {
				id: 0,
				url: "",
				alt: "",
				title: ""
			}
		});
		if(sky_type == 'image') onChangeValue("sky_type",{ sky_type: 'backgroundcolor' })
		onChangeValue("sky_environmentimage",{ sky_environmentimage: false })
	}
 	const onSelectMediaSky = (media) => {
		onChangeValue("sky_image",{
			sky_image: {
				id: media.id,
				url: media.url,
				alt: media.alt,
				title: media.title
			}
		});
		
	}
	let typeOptions = [
		{ label: __("Color", "wp3d-earth"), value: 'backgroundcolor' },
		{ label: __("Transparent", "wp3d-earth"), value: 'transparent' },
	];
	if(sky_image.url){
		typeOptions.push({ label: __("Image", "wp3d-earth"), value: 'image' })
	}
	if(isEarth){
		typeOptions.push({ label: __("Stars", "wp3d-earth"), value: 'stars' })
	}

	return (
	<>
		<PanelBody 
		title={ __( 'Sky', 'wp3d-earth' )}
		initialOpen={isOpen}
		>
			<SelectControl
				label="Type"
				value={ sky_type }
				options={ typeOptions }
				onChange={ ( val ) => onChangeValue("sky_type",{ sky_type: val }) }
			/>
			<div>
				{sky_type == 'backgroundcolor' &&
					<ColorPicker
					color={sky_color}
					onChange={ ( val ) => onChangeValue("sky_color",{ sky_color: val }) }
					//enableAlpha
					defaultValue="#FFF"
				/>}
				<ChooseImage 
					label={ __( "Texture Image", "wp3d-earth" )}
					value={sky_image}
					onAdd={onSelectMediaSky} 
					onRemove={removeMediaSky}
				/>
				{(sky_image.url) && <ToggleControl
					label={ __( 'Environment', 'wp3d-earth' )}
					checked={ sky_environmentimage }
					onChange={ ( val ) => onChangeValue("sky_environmentimage",{ sky_environmentimage: val }) }
				/>}
				{(sky_image.url && sky_environmentimage && isEarth) && 
					<RangeControl
						label={ __( 'Metalness', 'wp3d-earth' )}
						value={ material_metalness }
						onChange={ ( val ) => onChangeValue("material_metalness",{ material_metalness: val }) }
						min={ 0 }
						max={ 1 }
						allowReset={true}
						resetFallbackValue={ 1 }
						step={ 0.01 }
					/>
				}
				{/* {(sky_image.url && sky_environmentimage && isEarth) && 
					<RangeControl
						label={ __( 'Roughness', 'wp3d-earth' )}
						value={ material_roughness }
						onChange={ ( val ) => onChangeValue("material_roughness",{ material_roughness: val }) }
						min={ 0 }
						max={ 1 }
						allowReset={true}
						resetFallbackValue={ 0 }
						step={ 0.01 }
					/>
				} */}

			</div>
		</PanelBody>
	</>
	)
}