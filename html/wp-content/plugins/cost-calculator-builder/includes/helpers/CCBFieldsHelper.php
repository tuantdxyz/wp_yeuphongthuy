<?php

namespace cBuilder\Helpers;

use cBuilder\Classes\CCBProTemplate;
use cBuilder\Classes\CCBTemplate;

/**
 * Cost Calculator Fields Helper
 */
class CCBFieldsHelper {
	private static $file_field_formats = array( 'png', 'jpg/jpeg', 'gif', 'webp', 'svg', 'pdf', 'doc/docx', 'ppt/pptx', 'pps/ppsx', 'odt', 'xls/xlsx', 'psd', 'key', 'mp3', 'm4a', 'ogg', 'wav', 'mp4', 'mov', 'avi', 'mpg', 'ogv', '3gp', '3g2', 'ai', 'cdr', 'rar', 'zip' );

	/**
	 * Field templates
	 * @return array
	 */
	public static function get_fields_templates() {
		$templates = array(
			'line'         => CCBTemplate::load( 'frontend/fields/cost-line' ),
			'html'         => CCBTemplate::load( 'frontend/fields/cost-html' ),
			'toggle'       => CCBTemplate::load( 'frontend/fields/cost-toggle' ),
			'text-area'    => CCBTemplate::load( 'frontend/fields/cost-text' ),
			'checkbox'     => CCBTemplate::load( 'frontend/fields/cost-checkbox' ),
			'quantity'     => CCBTemplate::load( 'frontend/fields/cost-quantity' ),
			'radio-button' => CCBTemplate::load( 'frontend/fields/cost-radio' ),
			'range-button' => CCBTemplate::load( 'frontend/fields/cost-range' ),
			'drop-down'    => CCBTemplate::load( 'frontend/fields/cost-drop-down' ),
		);

		if ( ccb_pro_active() ) {
			$templates['date-picker']          = CCBProTemplate::load( 'frontend/fields/cost-date-picker' );
			$templates['multi-range']          = CCBProTemplate::load( 'frontend/fields/cost-multi-range' );
			$templates['file-upload']          = CCBProTemplate::load( 'frontend/fields/cost-file-upload' );
			$templates['drop-down-with-image'] = CCBProTemplate::load( 'frontend/fields/cost-drop-down-with-image' );
		}

		return $templates;
	}

	/**
	 * Get all possible fields
	 * @return array
	 */
	public static function fields() {
		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( 'v1' === $version_control ) {
			return self::get_old_fields();
		}

		return array(
			array(
				'name'        => __( 'Quantity', 'cost-calculator-builder' ),
				'alias'       => 'quantity',
				'type'        => 'quantity',
				'tag'         => 'cost-quantity',
				'icon'        => 'ccb-icon-Subtraction-6',
				'description' => __( 'Quantity Field', 'cost-calculator-builder' ),
				'sort_type'   => 'string',
			),
			array(
				'name'        => __( 'Text', 'cost-calculator-builder' ),
				'alias'       => 'text-area',
				'type'        => 'text-area',
				'tag'         => 'cost-text',
				'icon'        => 'ccb-icon-Subtraction-7',
				'description' => __( 'Text fields', 'cost-calculator-builder' ),
				'sort_type'   => 'string',
			),
			array(
				'name'        => __( 'Range', 'cost-calculator-builder' ),
				'alias'       => 'range',
				'type'        => 'range-button',
				'tag'         => 'cost-range',
				'icon'        => 'ccb-icon-Union-5',
				'description' => __( 'Range slider', 'cost-calculator-builder' ),
				'sort_type'   => 'slider',
			),
			array(
				'name'        => __( 'Multi Range', 'cost-calculator-builder' ),
				'alias'       => 'multi-range',
				'type'        => 'multi-range',
				'tag'         => 'cost-multi-range',
				'icon'        => 'ccb-icon-Union-6',
				'description' => __( 'Multi range field', 'cost-calculator-builder' ),
				'sort_type'   => 'slider',
			),
			array(
				'name'        => __( 'Radio', 'cost-calculator-builder' ),
				'alias'       => 'radio',
				'type'        => 'radio-button',
				'tag'         => 'cost-radio',
				'icon'        => 'ccb-icon-Path-3511',
				'description' => __( 'Radio fields', 'cost-calculator-builder' ),
				'sort_type'   => 'option',
			),
			array(
				'name'        => __( 'Checkbox', 'cost-calculator-builder' ),
				'alias'       => 'checkbox',
				'type'        => 'checkbox',
				'tag'         => 'cost-checkbox',
				'icon'        => 'ccb-icon-Path-3512',
				'description' => __( 'Checkbox fields', 'cost-calculator-builder' ),
				'sort_type'   => 'option',
			),
			array(
				'name'        => __( 'Dropdown', 'cost-calculator-builder' ),
				'alias'       => 'drop-down',
				'type'        => 'drop-down',
				'tag'         => 'cost-drop-down',
				'icon'        => 'ccb-icon-Path-3514',
				'description' => __( 'Dropdown fields', 'cost-calculator-builder' ),
				'sort_type'   => 'option',
			),
			array(
				'name'        => __( 'Date', 'cost-calculator-builder' ),
				'alias'       => 'datepicker',
				'type'        => 'date-picker',
				'tag'         => 'date-picker',
				'icon'        => 'ccb-icon-Path-3513',
				'description' => __( 'Date select', 'cost-calculator-builder' ),
				'sort_type'   => 'date',
			),
			array(
				'name'        => __( 'Toggle Button', 'cost-calculator-builder' ),
				'alias'       => 'toggle',
				'type'        => 'toggle',
				'tag'         => 'cost-toggle',
				'icon'        => 'ccb-icon-Path-3515',
				'description' => __( 'Toggle fields', 'cost-calculator-builder' ),
				'sort_type'   => 'option',
			),
			array(
				'name'        => __( 'File', 'cost-calculator-builder' ),
				'alias'       => 'file-upload',
				'type'        => 'file-upload',
				'tag'         => 'cost-file-upload',
				'icon'        => 'ccb-icon-Path-2572',
				'description' => __( 'File upload', 'cost-calculator-builder' ),
				'formats'     => self::get_file_field_format_based_on_permission(),
				'sort_type'   => 'media',
			),
			array(
				'name'        => __( 'Formula', 'cost-calculator-builder' ),
				'alias'       => 'total',
				'type'        => 'total',
				'tag'         => 'cost-total',
				'icon'        => 'ccb-icon-Path-3516',
				'description' => __( 'Total fields', 'cost-calculator-builder' ),
				'sort_type'   => 'misc',
			),
			array(
				'name'        => __( 'Image Dropdown', 'cost-calculator-builder' ),
				'alias'       => 'drop-down-with-image',
				'type'        => 'drop-down-with-image',
				'tag'         => 'cost-drop-down-with-image',
				'icon'        => 'ccb-icon-Union-30',
				'description' => __( 'Image dropdown', 'cost-calculator-builder' ),
				'sort_type'   => 'media',
			),
			array(
				'name'        => __( 'Html', 'cost-calculator-builder' ),
				'alias'       => 'html',
				'type'        => 'html',
				'tag'         => 'cost-html',
				'icon'        => 'ccb-icon-Path-3517',
				'description' => __( 'Html elements', 'cost-calculator-builder' ),
				'sort_type'   => 'misc',
			),
			array(
				'name'        => __( 'Line', 'cost-calculator-builder' ),
				'alias'       => 'line',
				'type'        => 'line',
				'tag'         => 'cost-line',
				'icon'        => 'ccb-icon-Path-3518',
				'description' => __( 'Divider', 'cost-calculator-builder' ),
				'sort_type'   => 'misc',
			),
		);
	}

	private static function get_old_fields() {
		return array(
			array(
				'name'        => __( 'Checkbox', 'cost-calculator-builder' ),
				'alias'       => 'checkbox',
				'type'        => 'checkbox',
				'icon'        => 'fas fa-check-square',
				'description' => 'checkbox fields',
				'tag'         => 'cost-checkbox',
			),
			array(
				'name'        => __( 'Radio', 'cost-calculator-builder' ),
				'alias'       => 'radio',
				'type'        => 'radio-button',
				'icon'        => 'fas fa-dot-circle',
				'description' => 'radio fields',
				'tag'         => 'cost-radio',
			),
			array(
				'name'        => __( 'Date Picker', 'cost-calculator-builder' ),
				'alias'       => 'datepicker',
				'type'        => 'date-picker',
				'icon'        => 'fas fa-calendar-alt',
				'description' => 'date picker fields',
				'tag'         => 'date-picker',
			),
			array(
				'name'        => __( 'Range Button', 'cost-calculator-builder' ),
				'alias'       => 'range',
				'type'        => 'range-button',
				'icon'        => 'fas fa-exchange-alt',
				'description' => 'range slider',
				'tag'         => 'cost-range',
			),
			array(
				'name'        => __( 'Drop Down', 'cost-calculator-builder' ),
				'alias'       => 'drop-down',
				'type'        => 'drop-down',
				'icon'        => 'fas fa-chevron-down',
				'description' => 'drop-down fields',
				'tag'         => 'cost-drop-down',
			),
			array(
				'name'        => __( 'Text', 'cost-calculator-builder' ),
				'alias'       => 'text-area',
				'type'        => 'text-area',
				'icon'        => 'fas fa-font',
				'description' => 'text fields',
				'tag'         => 'cost-text',
			),
			array(
				'name'        => __( 'Html', 'cost-calculator-builder' ),
				'alias'       => 'html',
				'type'        => 'html',
				'icon'        => 'fas fa-code',
				'description' => 'html elements',
				'tag'         => 'cost-html',
			),
			array(
				'name'        => __( 'Total', 'cost-calculator-builder' ),
				'alias'       => 'total',
				'type'        => 'total',
				'icon'        => 'fas fa-calculator',
				'description' => 'total fields',
				'tag'         => 'cost-total',
			),
			array(
				'name'        => __( 'Line', 'cost-calculator-builder' ),
				'alias'       => 'line',
				'type'        => 'line',
				'icon'        => 'fas fa-ruler-horizontal',
				'description' => 'horizontal ruler',
				'tag'         => 'cost-line',
			),
			array(
				'name'        => __( 'Quantity', 'cost-calculator-builder' ),
				'alias'       => 'quantity',
				'type'        => 'quantity',
				'icon'        => 'fas fa-hand-peace',
				'description' => 'quantity fields',
				'tag'         => 'cost-quantity',
			),
			array(
				'name'        => __( 'Multi Range', 'cost-calculator-builder' ),
				'alias'       => 'multi-range',
				'type'        => 'multi-range',
				'icon'        => 'fas fa-exchange-alt',
				'description' => 'multi-range field',
				'tag'         => 'cost-multi-range',
			),
			array(
				'name'        => __( 'Toggle Button', 'cost-calculator-builder' ),
				'alias'       => 'toggle',
				'type'        => 'toggle',
				'icon'        => 'fas fa-toggle-on',
				'description' => 'toggle fields',
				'tag'         => 'cost-toggle',
			),
			array(
				'name'        => __( 'File Upload', 'cost-calculator-builder' ),
				'alias'       => 'file-upload',
				'type'        => 'file-upload',
				'icon'        => 'fas fa-cloud-upload-alt',
				'description' => 'file upload field',
				'formats'     => self::get_file_field_format_based_on_permission(),
				'tag'         => 'cost-file-upload',
			),
			array(
				'name'        => __( 'Drop Down With Image', 'cost-calculator-builder' ),
				'alias'       => 'drop-down-with-image',
				'type'        => 'drop-down-with-image',
				'icon'        => 'far fa-image',
				'description' => 'drop-down with image field',
				'tag'         => 'cost-drop-down-with-image',
			),
		);
	}

	private static function get_file_field_format_based_on_permission() {
		/** check is allowed all */
		if ( defined( 'ALLOW_UNFILTERED_UPLOADS' ) && ALLOW_UNFILTERED_UPLOADS !== false ) {
			return self::$file_field_formats;
		}

		/** check with wp allowed mime types */
		$allowed_file_mime_types = get_allowed_mime_types();
		$allowed_file_types      = array_keys( $allowed_file_mime_types );

		$allowed_types = array();
		foreach ( $allowed_file_types as $type ) {
			$allowed_types = array_merge( $allowed_types, explode( '|', $type ) );
		}

		foreach ( self::$file_field_formats as $field_format ) {
			$allowed = true;
			foreach ( explode( '/', $field_format ) as $sub_type ) {
				if ( ! in_array( $sub_type, $allowed_types, true ) ) {
					$allowed = false;
				}
			}

			$key = array_search( $field_format, self::$file_field_formats, true );
			if ( ! $allowed && false !== $key ) {
				unset( self::$file_field_formats[ $key ] );
			}
		}
		return self::$file_field_formats;
	}
}
