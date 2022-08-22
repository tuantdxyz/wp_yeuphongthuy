<?php
/**
 * Update calculator
 * @param array|mixed $data
 * @return boolean
 */
function ccb_update_calc_new_values( $data ) {
	if ( isset( $data['id'] ) ) {
		$title = ! empty( $data['title'] ) ? sanitize_text_field( $data['title'] ) : __( 'empty name', 'cost-calculator-builder' );
		wp_update_post(
			array(
				'ID'         => $data['id'],
				'post_title' => $title,
			)
		);

		update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $data['id'] ), apply_filters( 'stm_ccb_sanitize_array', $data['settings'] ) );
		update_post_meta( $data['id'], 'stm-name', $title );
		update_post_meta( $data['id'], 'stm-formula', ! empty( $data['formula'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['formula'] ) : array() );
		update_post_meta( $data['id'], 'stm-fields', ! empty( $data['builder'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['builder'] ) : array() );
		update_post_meta( $data['id'], 'stm-conditions', ! empty( $data['conditions'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['conditions'] ) : array() );

		if ( isset( $data['preset_idx'] ) ) {
			update_post_meta( $data['id'], 'ccb_calc_preset_idx', apply_filters( 'stm_ccb_sanitize_value', $data['preset_idx'] ) );
		}

		$woo_products_enabled = isset( $data['settings']['woo_products']['enable'] ) && filter_var( $data['settings']['woo_products']['enable'], FILTER_VALIDATE_BOOLEAN );
		ccb_update_woocommerce_calcs( $data['id'], ! $woo_products_enabled );
		return true;
	}

	return false;
}

/**
 * Update calculator
 * @param array|mixed $data
 * @return boolean
 */
function ccb_update_calc_old_values( $data ) {
	if ( isset( $data['id'] ) ) {
		$title = ! empty( $data['title'] ) ? sanitize_text_field( $data['title'] ) : __( 'empty name', 'cost-calculator-builder' );

		wp_update_post(
			array(
				'ID'         => $data['id'],
				'post_title' => $title,
			)
		);
		update_option( 'stm_ccb_form_settings_' . sanitize_text_field( $data['id'] ), apply_filters( 'stm_ccb_sanitize_array', $data['settings'] ) );

		update_post_meta( $data['id'], 'stm-name', $title );
		update_post_meta( $data['id'], 'stm-formula', ! empty( $data['formula'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['formula'] ) : array() );
		update_post_meta( $data['id'], 'stm-fields', ! empty( $data['builder'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['builder'] ) : array() );
		update_post_meta( $data['id'], 'stm-conditions', ! empty( $data['conditions'] ) ? apply_filters( 'stm_ccb_sanitize_array', $data['conditions'] ) : array() );

		$woo_products_enabled = isset( $data['settings']['woo_products']['enable'] ) && filter_var( $data['settings']['woo_products']['enable'], FILTER_VALIDATE_BOOLEAN );
		ccb_update_woocommerce_calcs( $data['id'], ! $woo_products_enabled );

		return true;
	}

	return false;
}

function ccb_update_calc_values( $data ) {
	$version_control = get_option( 'ccb_version_control' );
	if ( 'v1' === $version_control ) {
		return ccb_update_calc_old_values( $data );
	} else {
		return ccb_update_calc_new_values( $data );
	}
}

/**
 * @param $calc_id
 * @param boolean $delete
 */
function ccb_update_woocommerce_calcs( $calc_id, $delete = false ) {
	$woocommerce_calcs = get_option( 'stm_ccb_woocommerce_calcs', array() );
	if ( $delete ) {
		$key = array_search( $calc_id, $woocommerce_calcs, true );
		if ( false !== $key ) {
			unset( $woocommerce_calcs[ $key ] );
		}
	} elseif ( ! in_array( $calc_id, $woocommerce_calcs, true ) ) {
		$woocommerce_calcs[] = $calc_id;
	}

	update_option( 'stm_ccb_woocommerce_calcs', apply_filters( 'stm_ccb_sanitize_array', $woocommerce_calcs ) );
}

/**
 *  Get All Calculators
 * @param $post_type string
 * @return mixed|array
 */
function ccb_calc_get_all_posts( $post_type, $params = array() ) {
	$args = array(
		'offset'         => isset( $params['offset'] ) ? (int) $params['offset'] : 1,
		'posts_per_page' => isset( $params['limit'] ) ? (int) $params['limit'] : -1,
		'post_type'      => $post_type,
		'post_status'    => array( 'publish' ),
		'orderby'        => isset( $params['sort_by'] ) ? sanitize_text_field( $params['sort_by'] ) : 'id',
		'order'          => isset( $params['direction'] ) ? sanitize_text_field( $params['direction'] ) : 'desc',
	);

	$resources = new WP_Query( $args );

	$resources_json = array();

	if ( $resources->have_posts() ) {
		while ( $resources->have_posts() ) {
			$resources->the_post();
			$id                    = get_the_ID();
			$resources_json[ $id ] = get_the_title();
		}
	}

	return $resources_json;
}


/**
 * Parse settings by $calc_id
 * @param $settings
 * @return array
 */

function ccb_parse_settings( $settings ) {
	$currency = isset( $settings['currency']['currency'] ) ? sanitize_text_field( $settings['currency']['currency'] ) : '$';

	return array(
		'currency'            => $currency,
		'num_after_integer'   => isset( $settings['currency']['num_after_integer'] ) ? (int) $settings['currency']['num_after_integer'] : 2,
		'decimal_separator'   => isset( $settings['currency']['decimal_separator'] ) ? sanitize_text_field( $settings['currency']['decimal_separator'] ) : '.',
		'thousands_separator' => isset( $settings['currency']['thousands_separator'] ) ? sanitize_text_field( $settings['currency']['thousands_separator'] ) : ',',
		'currency_position'   => isset( $settings['currency']['currencyPosition'] ) ? sanitize_text_field( $settings['currency']['currencyPosition'] ) : 'left_with_space',
	);
}

/**
 * WooCommerce Products
 * @return array
 */
function ccb_woo_products() {
	return get_posts(
		array(
			'post_type'      => 'product',
			'posts_per_page' => -1,
		)
	);
}

/**
 * WooCommerce Categories
 * @return array
 */
function ccb_woo_categories() {
	return get_terms(
		array(
			'taxonomy'   => 'product_cat',
			'hide_empty' => false,
		)
	);
}

/**
 * Contact Form 7 Forms
 * @return array
 */
function ccb_contact_forms() {
	$contact_forms = get_posts(
		array(
			'post_type'      => 'wpcf7_contact_form',
			'posts_per_page' => -1,
		)
	);

	$forms = array();
	if ( count( $contact_forms ) ) {
		foreach ( $contact_forms as $contact_form ) {
			$forms[] = array(
				'id'    => $contact_form->ID,
				'title' => $contact_form->post_title,
			);
		}
	}

	return $forms;
}

/**
 * Check active Add-on
 * @return bool
 */
function ccb_pro_active() {
	return ( defined( 'CCB_PRO_VERSION' ) );
}

function ccb_all_calculators() {
	$lists = array( esc_html__( 'select', 'cost-calculator-builder' ) => 'Select' );
	$args  = array(
		'post_type'      => 'cost-calc',
		'posts_per_page' => -1,
		'post_status'    => 'publish',
	);

	$data = new \WP_Query( $args );
	$data = $data->posts;

	if ( count( $data ) > 0 ) {
		foreach ( $data as $value ) {
			$lists[ $value->ID ] = $value->post_title;
		}
	}

	return $lists;
}

/**
 * Write to log
 * @param $log
 * @return void
 */
function ccb_write_log( $log ) {
	if ( true === WP_DEBUG ) {
		if ( is_array( $log ) || is_object( $log ) ) {
			error_log( print_r( $log, true ) ); // phpcs:ignore
		} else {
			error_log( $log ); // phpcs:ignore
		}
	}
}

/**
 * Return Support Ticket URL
 * @return string
 */
function ccb_get_ticket_url() {
	$type = ccb_pro_active() ? 'support' : 'pre-sale';

	return "https://support.stylemixthemes.com/tickets/new/{$type}?item_id=29";
}

/** Base helper functions */


/**
 * @param string $json_string
 */
function is_json_string( $json_string ) {
	json_decode( $json_string );
	return ( json_last_error() === JSON_ERROR_NONE );
}


/**
 * sanitize_text_field without < replacement
 * @param string $json_string
 */
function sanitize_without_tag_clean( $json_string ) {
	$result = str_replace( '<', '{less}', $json_string );
	$result = sanitize_text_field( $result );
	return str_replace( '{less}', '<', $result );
}
