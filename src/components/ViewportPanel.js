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
	__experimentalUnitControl as UnitControl
} from '@wordpress/components'

export default function ViewportPanel( prop ) {
	const { attributes, setAttributes, clientId } = prop.props;
	const onChangeValue = prop.onChange;

	const { 
		viewport_ratio,
		viewport_height,
		viewport_fixed
	} = attributes;

	const units = [
		{ value: 'px', label: 'px', default: 500 },
		{ value: '%', label: '%', default: 100 },
		{ value: 'em', label: 'em', default: 5 },
		{ value: 'vh', label: 'vh', default: 100 },
	];
	
    return (
        <>
          <PanelBody 
			title={ __( 'Viewport', 'wp3d-blocks' )}
			initialOpen={false}
			>
                {/* Ratio(select) */}
				<SelectControl
					label={__("Ratio", "wp3d-blocks")}
					value={ viewport_ratio }
					options={ [
						{ label: 'Custom', value: 'custom' },
						{ label: '1/1', value: '1/1' },
						{ label: '4/3', value: '4/3' },
						{ label: '16/9', value: '16/9' },
					] }
					
					onChange={ ( val ) => onChangeValue("viewport_ratio",{ viewport_ratio: val }) }
				/>
				{/* Height(Number Unit) */}
				{viewport_ratio == "custom" && <UnitControl 
					label={__("Height", "wp3d-blocks")}
					isUnitSelectTabbable
					onChange={ ( val ) => onChangeValue("viewport_height",{ viewport_height: val }) } 
					onUnitChange={ e => console.log("new unit "+e) }
					units={ units }
					value={ viewport_height } />}
				{/* fixed(Switcher) */}
				<ToggleControl
					label="Fixed"
					checked={ viewport_fixed }
					onChange={ ( val ) => onChangeValue("viewport_fixed",{ viewport_fixed: val }) }
				/>
				<p>{__("Questa opzione forza questo blocco a restare fisso a tutto schermo sotto a tutto.", "wp3d-blocks")}</p>
            </PanelBody>
        </>
      )

}