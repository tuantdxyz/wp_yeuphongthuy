<?php

namespace cBuilder\Classes\Appearance;

/**
 * Class CCBAppearanceTypeGenerator
 * @package cBuilder\Classes\Appearance
 */
class CCBAppearanceTypeGenerator {
	protected $store;

	public function __construct() {
		$this->store = new CCBAppearanceDataStore();
	}

	public function get_common_field_data( $label, $name, $value, $col, $type ): array {
		return array(
			'label' => $label,
			'name'  => $name,
			'value' => $value,
			'col'   => $col,
			'type'  => $type,
		);
	}

	public function get_number_type_field( $label, $name, $min, $max, $step, $value, $dimension, $col, $additional = array() ): array {
		$field               = $this->get_common_field_data( $label, $name, $value, $col, 'number' );
		$field['additional'] = $additional;
		$field['data']       = array(
			'min'       => $min,
			'max'       => $max,
			'step'      => $step,
			'dimension' => $dimension,
		);
		return $field;
	}

	/**
	 * @param $label
	 * @param $name
	 * @param $value
	 * @param $col
	 * @return array
	 */
	public function get_preloader_field( $label, $name, $value, $col ): array {
		return $this->get_common_field_data( $label, $name, $value, $col, 'preloader' );
	}

	public function get_toggle_field( $label, $name, $value, $col ): array {
		return $this->get_common_field_data( $label, $name, $value, $col, 'toggle' );
	}

	public function get_background_field( $label, $name, $value, $default_color, $col ): array {
		$field         = $this->get_common_field_data( $label, $name, $value, $col, 'color' );
		$field['data'] = array(
			'value'   => $default_color,
			'default' => $default_color,
			'alias'   => 'backgroundColor',
		);
		return $field;
	}

	public function get_border_field( $label, $name, $type, $width, $radius, $col ): array {
		$default_value = array(
			'type'   => $type,
			'width'  => $width,
			'radius' => $radius,
		);
		$field         = $this->get_common_field_data( $label, $name, $default_value, $col, 'border' );

		$field['data'] = array(
			'border_type'   => $this->get_select_field( '', 'border_type', $type, $this->store->get_border_style_options(), 'col-6' ),
			'border_width'  => $this->get_number_type_field( '', 'border_width', 0, 100, 1, $width, 'px', 'col-6', array( 'prefix' => __( 'px', 'cost-calculator-builder' ) ) ),
			'border_radius' => $this->get_number_type_field( '', 'border_radius', 0, 100, 1, $radius, 'px', 'col-6', array( 'prefix' => __( 'Radius', 'cost-calculator-builder' ) ) ),
		);
		return $field;
	}

	public function get_indent_field( $label, $name, $value, $col ): array {
		$field         = $this->get_common_field_data( $label, $name, $value, $col, 'indent' );
		$field['data'] = array(
			'top'    => array(
				'value' => isset( $value[0] ) ? $value[0] . 'px' : '0',
				'label' => __( 'Top', 'cost-calculator-builder' ),
				'name'  => 'top',
				'icon'  => 'arrow-top',
			),
			'right'  => array(
				'value' => isset( $value[1] ) ? $value[1] . 'px' : '0',
				'label' => __( 'Right', 'cost-calculator-builder' ),
				'name'  => 'right',
				'icon'  => 'arrow-right',
			),
			'bottom' => array(
				'value' => isset( $value[2] ) ? $value[2] . 'px' : '0',
				'label' => __( 'Bottom', 'cost-calculator-builder' ),
				'name'  => 'bottom',
				'icon'  => 'arrow-bottom',
			),
			'left'   => array(
				'value' => isset( $value[3] ) ? $value[3] . 'px' : '0',
				'label' => __( 'Left', 'cost-calculator-builder' ),
				'name'  => 'left',
				'icon'  => 'arrow-left',
			),
		);
		return $field;
	}

	public function get_shadow_field( $label, $name, $color, $blur, $x_pos, $y_pos, $col ): array {
		$default_value = array(
			'color' => $color,
			'blur'  => $blur,
			'x'     => $x_pos,
			'y'     => $y_pos,
		);

		$field         = $this->get_common_field_data( $label, $name, $default_value, $col, 'shadow' );
		$field['data'] = array(
			'color' => $this->get_color_field( '', 'color', $color, 'col-12' ),
			'blur'  => $this->get_number_type_field( '', 'border_width', 0, 100, 1, $blur, 'px', 'col-6', array( 'prefix' => __( 'Blur', 'cost-calculator-builder' ) ) ),
			'x'     => $this->get_number_type_field( '', 'border_radius', 0, 100, 1, $x_pos, 'px', 'col-6', array( 'prefix' => __( 'X', 'cost-calculator-builder' ) ) ),
			'y'     => $this->get_number_type_field( '', 'border_radius', 0, 100, 1, $y_pos, 'px', 'col-6', array( 'prefix' => __( 'Y', 'cost-calculator-builder' ) ) ),
		);
		return $field;
	}

	public function get_select_field( $label, $name, $value, $options, $col ): array {
		$field         = $this->get_common_field_data( $label, $name, $value, $col, 'select' );
		$field['col']  = $col;
		$field['data'] = array( 'options' => $options );
		return $field;
	}

	public function get_color_field( $label, $name, $value, $col ): array {
		$field            = $this->get_common_field_data( $label, $name, $value, $col, 'color' );
		$field['default'] = $value;
		return $field;
	}

	public static function convert_rgb_to_hex( $rgb_color ) {
		$regex = '/rgba?\(\s?([0-9]{1,3}),\s?([0-9]{1,3}),\s?([0-9]{1,3})/i';
		preg_match( $regex, $rgb_color, $matches );

		$red   = (int) $matches[1];
		$green = (int) $matches[2];
		$blue  = (int) $matches[3];

		return '#' . dechex( $red ) . dechex( $green ) . dechex( $blue );
	}
}
