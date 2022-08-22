<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Appearance\CCBAppearanceHelper;
use cBuilder\Classes\Appearance\Presets\CCBPresetGenerator;
use cBuilder\Classes\CustomFields\CCBCustomFields;
use cBuilder\Helpers\CCBFieldsHelper;

class CCBCalculators {

	const DESC_POSITION_BEFORE = 'before';
	const DESC_POSITION_AFTER  = 'after';
	const CALCULATOR_POST_TYPE = 'cost-calc';

	public static function getWPCalculatorsData() {
		$calculator_posts = new \WP_Query(
			array(
				'posts_per_page' => -1,
				'post_type'      => self::CALCULATOR_POST_TYPE,
				'post_status'    => array( 'publish' ),
			)
		);

		return $calculator_posts->posts;
	}

	/**
	 * Get Default Data
	 */
	private static function get_default_calculator_data() {
		return array(
			'id'           => '',
			'title'        => '',
			'forms'        => array(),
			'fields'       => array(),
			'builder'      => array(),
			'formula'      => array(),
			'settings'     => array(),
			'products'     => array(),
			'categories'   => array(),
			'conditions'   => array(),
			'success'      => false,
			'appearance'   => array(),
			'desc_options' => array(
				self::DESC_POSITION_BEFORE => __( 'Show before field', 'cost-calculator-builder' ),
				self::DESC_POSITION_AFTER  => __( 'Show after field', 'cost-calculator-builder' ),
			),
			'message'      => __( 'There is no calculator with this id', 'cost-calculator-builder' ),
		);
	}

	public static function edit_calc() {

		check_ajax_referer( 'ccb_edit_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = self::get_default_calculator_data();

		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( 'v1' === $version_control ) {
			if ( isset( $_GET['calc_id'] ) ) {
				$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

				$result['id']          = $calc_id;
				$result['title']       = get_post_meta( $calc_id, 'stm-name', true );
				$result['fields']      = CCBFieldsHelper::fields();
				$result['formula']     = get_post_meta( $calc_id, 'stm-formula', true );
				$result['conditions']  = get_post_meta( $calc_id, 'stm-conditions', true );
				$result['calculators'] = self::get_calculator_list();

				$result['builder'] = ! empty( get_post_meta( $calc_id, 'stm-fields', true ) )
					? get_post_meta( $calc_id, 'stm-fields', true )
					: array();

				$result['custom_styles'] = empty( get_post_meta( $calc_id, 'ccb-custom-styles', true ) )
					? CCBCustomFields::custom_default_styles() : get_post_meta( $calc_id, 'ccb-custom-styles', true );

				$result['custom_fields'] = empty( get_post_meta( $calc_id, 'ccb-custom-fields', true ) )
					? CCBCustomFields::custom_fields() : get_post_meta( $calc_id, 'ccb-custom-fields', true );

				/* pro-features */
				$result['forms']      = ccb_contact_forms();
				$result['products']   = ccb_woo_products();
				$result['categories'] = ccb_woo_categories();

				$settings = get_option( 'stm_ccb_form_settings_' . $calc_id );
				if ( ! empty( $settings ) && isset( $settings[0] ) && isset( $settings[0]['general'] ) ) {
					$settings = $settings[0];
				}
				if ( ! empty( $settings ) ) {
					$result['settings'] = $settings;
				}
				if ( ! is_array( $result['settings'] ) || empty( $result['settings']['general'] ) ) {
					$result['settings'] = CCBSettingsData::settings_data();
				}
				if ( ! empty( $result['settings']['formFields']['body'] ) ) {
					$result['settings']['formFields']['body'] = str_replace( '<br>', PHP_EOL, $result['settings']['formFields']['body'] );
				}
				$result['success'] = true;
				$result['message'] = '';
			}
		} else {
			if ( isset( $_GET['calc_id'] ) ) {
				$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

				$result['id']         = $calc_id;
				$result['title']      = get_post_meta( $calc_id, 'stm-name', true );
				$result['fields']     = CCBFieldsHelper::fields();
				$result['formula']    = get_post_meta( $calc_id, 'stm-formula', true );
				$result['conditions'] = get_post_meta( $calc_id, 'stm-conditions', true );

				$stm_fields        = get_post_meta( $calc_id, 'stm-fields', true );
				$result['builder'] = ! empty( $stm_fields ) ? $stm_fields : array();

				$preset_key = get_post_meta( $calc_id, 'ccb_calc_preset_idx', true );
				$preset_key = empty( $preset_key ) ? 0 : $preset_key;

				$appearance = CCBAppearanceHelper::get_appearance_data( $preset_key );

				if ( ! empty( $appearance ) ) {
					$result['preset_idx'] = $preset_key;
					$result['appearance'] = $appearance['data'];
					$result['presets']    = $appearance['list'];

					if ( count( $appearance['list'] ) <= $preset_key ) {
						$result['preset_idx'] = 0;
						update_post_meta( $calc_id, 'ccb_calc_preset_idx', 0 );
						$appearance_inner = CCBAppearanceHelper::get_appearance_data( $preset_key );

						if ( ! empty( $appearance_inner ) ) {
							$result['appearance'] = $appearance_inner['data'];
						}
					}
				}

				/* pro-features */
				$result['forms']      = ccb_contact_forms();
				$result['products']   = ccb_woo_products();
				$result['categories'] = ccb_woo_categories();

				$settings = get_option( 'stm_ccb_form_settings_' . $calc_id );

				if ( ! empty( $settings ) && isset( $settings[0] ) && isset( $settings[0]['general'] ) ) {
					$settings = $settings[0];
				}

				if ( ! empty( $settings ) ) {
					$result['settings'] = $settings;
				}

				if ( ! is_array( $result['settings'] ) || empty( $result['settings']['general'] ) ) {
					$result['settings'] = CCBSettingsData::settings_data();
				}

				if ( ! empty( $result['settings']['formFields']['body'] ) ) {
					$result['settings']['formFields']['body'] = str_replace( '<br>', PHP_EOL, $result['settings']['formFields']['body'] );
				}

				$result['calculators'] = self::get_calculator_list();
				$result['success']     = true;
				$result['message']     = '';
			}
		}

		// send data
		wp_send_json( $result );
	}

	/**
	 * Duplicate Calculator
	 */
	public static function duplicate_calc() {

		check_ajax_referer( 'ccb_duplicate_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'calculators' => array(),
			'success'     => false,
			'message'     => __( "Couldn't duplicate calculator, please try again!', 'cost-calculator-builder" ),
		);

		$params          = self::get_filter_data( $_GET );
		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( isset( $_GET['calculator_ids'] ) ) {

			$ids = array_map(
				function ( $item ) {
					return (int) sanitize_text_field( $item );
				},
				explode( ',', $_GET['calculator_ids'] )
			);

			$result_ids = array();
			foreach ( $ids as $id ) {
				$new_calculator = array(
					'post_parent' => $id,
					'post_status' => 'publish',
					'post_type'   => 'cost-calc',
				);

				$duplicated_post_id = wp_insert_post( $new_calculator );

				if ( 'v1' === $version_control ) {
					$data = array(
						'id'         => $duplicated_post_id,
						'title'      => self::get_calculator_name_for_duplicate( $id ),
						'formula'    => get_post_meta( $id, 'stm-formula', true ),
						'settings'   => get_option( 'stm_ccb_form_settings_' . $id, true ),
						'builder'    => get_post_meta( $id, 'stm-fields', true ),
						'conditions' => get_post_meta( $id, 'stm-conditions', true ),
						'styles'     => get_post_meta( $id, 'ccb-custom-styles', true ),
						'fields'     => get_post_meta( $id, 'ccb-custom-fields', true ),
					);
				} else {
					$data = array(
						'id'         => $duplicated_post_id,
						'title'      => self::get_calculator_name_for_duplicate( $id ),
						'formula'    => get_post_meta( $id, 'stm-formula', true ),
						'settings'   => get_option( 'stm_ccb_form_settings_' . $id, true ),
						'builder'    => get_post_meta( $id, 'stm-fields', true ),
						'conditions' => get_post_meta( $id, 'stm-conditions', true ),
						'appearance' => get_post_meta( $id, 'ccb-appearance', true ),
						'preset_idx' => get_post_meta( $id, 'ccb_calc_preset_idx', true ),
					);
				}

				if ( ccb_update_calc_values( $data ) ) {
					array_push( $result_ids, $duplicated_post_id );
				}
			}

			$result['success']        = true;
			$result['calculators']    = self::get_calculator_list( $params );
			$result['duplicated_ids'] = $result_ids;
			$result['message']        = __( 'Calculators duplicated successfully', 'cost-calculator-builder' );
		}

		if ( ! empty( $_GET['calc_id'] ) ) {
			$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

			$my_post = array(
				'post_type'   => 'cost-calc',
				'post_status' => 'publish',
				'post_parent' => $calc_id,
			);

			// get id
			$id = wp_insert_post( $my_post );

			$data = array(
				'id'         => $id,
				'title'      => self::get_calculator_name_for_duplicate( $calc_id ),
				'formula'    => get_post_meta( $calc_id, 'stm-formula', true ),
				'settings'   => get_option( 'stm_ccb_form_settings_' . $calc_id, true ),
				'builder'    => get_post_meta( $calc_id, 'stm-fields', true ),
				'conditions' => get_post_meta( $calc_id, 'stm-conditions', true ),
				'preset_idx' => get_post_meta( $calc_id, 'ccb_calc_preset_idx', true ),
			);

			if ( ccb_update_calc_values( $data ) ) {
				$result['success']       = true;
				$result['calculators']   = self::get_calculator_list( $params );
				$result['message']       = __( 'Calculator duplicated successfully', 'cost-calculator-builder' );
				$result['duplicated_id'] = $id;
			}
		}

		wp_send_json( $result );
	}

	/**
	 *  Generate calc id(create cost-calc post) and send
	 */
	public static function create_calc_id() {

		check_ajax_referer( 'ccb_create_id', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		// create cost-calc post and get id
		$id = wp_insert_post(
			array(
				'post_type'   => 'cost-calc',
				'post_status' => 'publish',
			)
		);

		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( 'v1' === $version_control ) {
			$result = array(
				'id'            => $id,
				'success'       => true,
				'forms'         => ccb_contact_forms(),
				'products'      => ccb_woo_products(),
				'categories'    => ccb_woo_categories(),
				'fields'        => CCBFieldsHelper::fields(),
				'custom_fields' => CCBCustomFields::custom_fields(),
				'custom_styles' => CCBCustomFields::custom_default_styles(),
				'desc_options'  => array(
					self::DESC_POSITION_BEFORE => __( 'Show before field', 'cost-calculator-builder' ),
					self::DESC_POSITION_AFTER  => __( 'Show after field', 'cost-calculator-builder' ),
				),
			);
		} else {
			// send data
			$result = array(
				'id'           => $id,
				'success'      => true,
				'forms'        => ccb_contact_forms(),
				'products'     => ccb_woo_products(),
				'categories'   => ccb_woo_categories(),
				'fields'       => CCBFieldsHelper::fields(),
				'desc_options' => array(
					self::DESC_POSITION_BEFORE => __( 'Show before field', 'cost-calculator-builder' ),
					self::DESC_POSITION_AFTER  => __( 'Show after field', 'cost-calculator-builder' ),
				),
			);

			$preset_key = get_post_meta( $id, 'ccb_calc_preset_idx', true );
			$preset_key = empty( $preset_key ) ? 0 : $preset_key;
			$appearance = CCBAppearanceHelper::get_appearance_data( $preset_key );

			if ( ! empty( $appearance ) ) {
				$result['preset_idx'] = $preset_key;
				$result['appearance'] = $appearance['data'];
				$result['presets']    = $appearance['list'];
			}
		}

		wp_send_json( $result );
	}

	/**
	 * Append ( copy int ) to new calendar title
	 * based on duplicated calculator title
	 *
	 * @param mixed
	 * @return mixed|string
	 */
	public static function get_calculator_name_for_duplicate( $calc_id ) {
		$args = array(
			'post_type'      => 'cost-calc',
			'posts_per_page' => -1,
			'post_status'    => 'publish',
			'post_parent'    => $calc_id,
		);

		$exist_duplicates          = get_children( $args, ARRAY_A );
		$count_duplicate_meta      = count( $exist_duplicates );
		$duplicated_from_calc_name = get_post_meta( $calc_id, 'stm-name', true );

		return $duplicated_from_calc_name . ' (copy ' . $count_duplicate_meta . ')';
	}

	/**
	 * Delete calc by id
	 */
	public static function delete_calc() {

		check_ajax_referer( 'ccb_delete_calc', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success'     => false,
			'calculators' => array(),
			'message'     => __( 'Could not delete calculator, please try again!', 'cost-calculator-builder' ),
		);

		$params = self::get_filter_data( $_GET );

		if ( isset( $_GET['calculator_ids'] ) ) {
			$ids = array_map(
				function ( $item ) {
					return (int) sanitize_text_field( $item );
				},
				explode( ',', $_GET['calculator_ids'] )
			);

			foreach ( $ids as $id ) {
				wp_delete_post( $id );
				delete_post_meta( $id, 'cost-calc' );
				ccb_update_woocommerce_calcs( $id, true );
			}

			$result['success']     = true;
			$result['calculators'] = self::get_calculator_list( $params );
			$result['message']     = __( 'Calculators deleted successfully', 'cost-calculator-builder' );
		}

		if ( isset( $_GET['calc_id'] ) ) {

			$calc_id = (int) sanitize_text_field( $_GET['calc_id'] );

			wp_delete_post( $calc_id );
			delete_post_meta( $calc_id, 'cost-calc' );
			ccb_update_woocommerce_calcs( $calc_id, true );

			$result['success']     = true;
			$result['calculators'] = self::get_calculator_list( $params );
			$result['message']     = __( 'Calculator deleted successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Save Custom Styles
	 */
	public static function save_custom() {

		check_ajax_referer( 'ccb_save_custom', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( 'v1' === $version_control ) {
			if ( isset( $_POST['action'] ) && 'calc_save_custom' === $_POST['action'] ) {
				$data    = apply_filters( 'stm_ccb_sanitize_array', $_POST );
				$content = json_decode( str_replace( '\"', '"', $data['content'] ), true );
				$fields  = isset( $content['fields'] ) ? $content['fields'] : CCBCustomFields::custom_fields();
				$styles  = isset( $content['styles'] ) ? $content['styles'] : CCBCustomFields::custom_default_styles();

				update_post_meta( $data['id'], 'ccb-custom-fields', apply_filters( 'stm_ccb_sanitize_array', $fields ) );
				update_post_meta( $data['id'], 'ccb-custom-styles', apply_filters( 'stm_ccb_sanitize_array', $styles ) );

				$result['success'] = true;
				$result['message'] = 'Custom Changes Saved successfully';
			}
		} else {
			if ( isset( $_POST['action'] ) && 'calc_save_custom' === $_POST['action'] && ! empty( $_POST['content'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
				$data       = apply_filters( 'stm_ccb_sanitize_array', $_POST );
				$content    = json_decode( str_replace( '\"', '"', $data['content'] ), true );
				$appearance = array();

				if ( isset( $content['appearance'] ) ) {
					$appearance = $content['appearance'];
				}

				$preset_key = ! isset( $data['selectedIdx'] ) ? 0 : $data['selectedIdx'];
				CCBPresetGenerator::save_custom( $preset_key, $appearance );
				update_post_meta( $data['id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );

				$result['success'] = true;
				$result['message'] = 'Custom Changes Saved successfully';
			}
		}

		wp_send_json( $result );
	}

	/**
	 * Get All existing calculator
	 */
	public static function get_existing() {
		check_ajax_referer( 'ccb_get_existing', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'forms'       => array(),
			'calculators' => array(),
		);

		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );
		$params          = self::get_filter_data( $_GET );
		$calculators     = self::get_calculator_list( 'v1' === $version_control ? array() : $params );

		if ( is_array( $calculators ) ) {
			$result['success']     = true;
			$result['calculators'] = $calculators;

			/* pro-features */
			$result['forms']    = ccb_contact_forms();
			$result['products'] = ccb_woo_products();
		}

		wp_send_json( $result );
	}

	/**
	 * Save all calculator settings via calc id
	 */
	public static function save_settings() {

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( isset( $data['settings']['formFields']['body'] ) ) {
			$content                                = $data['settings']['formFields']['body'];
			$content                                = str_replace( '\\n', '<br>', $content );
			$data['settings']['formFields']['body'] = str_replace( '\\', '', $content );
		}

		if ( ! empty( $data ) && ccb_update_calc_values( $data ) ) {
			$result['success']     = true;
			$result['message']     = 'Calculator updated successfully';
			$result['calculators'] = self::get_calculator_list();
		}

		wp_send_json( $result );
	}

	/**
	 * Get general settings
	 */
	public static function calc_get_general_settings() {
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'data'    => null,
			'message' => 'Something went wrong',
		);

		$data = get_option( 'ccb_general_settings', CCBSettingsData::general_settings_data() );
		if ( ! empty( $data ) ) {
			$result['data']    = $data;
			$result['success'] = true;
			$result['message'] = __( 'General settings data', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Save general settings
	 */
	public static function save_general_settings() {
		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		$request_body = file_get_contents( 'php://input' );
		$request_data = json_decode( $request_body, true );
		$data         = apply_filters( 'stm_ccb_sanitize_array', $request_data );

		if ( ! empty( $data ) && isset( $data['settings'] ) ) {
			update_option( 'ccb_general_settings', $data['settings'] );
			$result['success'] = true;
			$result['message'] = __( 'Settings updated successfully', 'cost-calculator-builder' );
		}

		wp_send_json( $result );
	}

	/**
	 * Return ready array for response
	 * @return array
	 */
	public static function get_calculator_list( $params = array() ) {

		$result         = array();
		$existing       = ccb_calc_get_all_posts( 'cost-calc', $params );
		$existing_count = ccb_calc_get_all_posts( 'cost-calc' );

		if ( is_array( $existing ) ) {
			foreach ( $existing as $key => $value ) {
				$temp = array();

				$temp['id']           = $key;
				$temp['project_name'] = ! empty( $value ) ? $value : 'name is empty';

				$result[] = $temp;
			}
		}

		return array(
			'calculators_count' => count( $existing_count ),
			'existing'          => $result,
		);
	}

	/**
	 * @param $data
	 * @return array
	 */
	private static function get_filter_data( $data ) {
		$sort_by   = ! empty( $data['sortBy'] ) ? sanitize_text_field( $data['sortBy'] ) : 'id';
		$direction = ! empty( $data['direction'] ) ? sanitize_text_field( $data['direction'] ) : 'desc';
		$page      = ! empty( $data['page'] ) ? (int) sanitize_text_field( $data['page'] ) : 1;
		$limit     = ! empty( $data['limit'] ) ? sanitize_text_field( $data['limit'] ) : 5;
		$offset    = 1 === $page ? 0 : ( $page - 1 ) * $limit;

		return array(
			'page'      => $page,
			'limit'     => $limit,
			'offset'    => $offset,
			'sort_by'   => $sort_by,
			'direction' => $direction,
		);
	}

	public static function ccb_delete_preset() {
		check_ajax_referer( 'ccb_delete_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) && isset( $_GET['idx'] ) ) {
			$idx             = sanitize_text_field( $_GET['idx'] );
			$preset_key      = sanitize_text_field( $_GET['selectedIdx'] );
			$presets_from_db = CCBPresetGenerator::get_static_preset_from_db();

			array_splice( $presets_from_db, intval( $idx ), 1 );
			update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets_from_db ) );
			update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', $preset_key );

			$presets = CCBAppearanceHelper::get_appearance_data( $preset_key );
			$result  = array(
				'success' => true,
				'message' => 'Preset deleted',
				'list'    => ! isset( $presets['list'] ) ? array() : $presets['list'],
				'data'    => ! isset( $presets['data'] ) ? array() : $presets['data'],
			);
		}

		wp_send_json( $result );
	}

	public static function ccb_add_preset() {
		check_ajax_referer( 'ccb_add_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) ) {
			$preset_key        = sanitize_text_field( $_GET['selectedIdx'] );
			$presets           = CCBPresetGenerator::default_presets();
			$presets_from_db   = CCBPresetGenerator::get_static_preset_from_db();
			$presets_from_db[] = $presets[0];

			update_option( 'ccb_appearance_presets', apply_filters( 'ccb_appearance_data_update', $presets_from_db ) );
			update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );

			$presets = CCBAppearanceHelper::get_appearance_data( $preset_key );
			$result  = array(
				'success' => true,
				'message' => 'Preset created',
				'list'    => $presets['list'] ?? array(),
				'data'    => $presets['data'] ?? array(),
			);
		}

		wp_send_json( $result );
	}

	public static function ccb_update_preset() {
		check_ajax_referer( 'ccb_update_preset', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['calc_id'] ) && isset( $_GET['selectedIdx'] ) ) {
			$preset_key = sanitize_text_field( $_GET['selectedIdx'] );
			$presets    = CCBAppearanceHelper::get_appearance_data( $preset_key );

			if ( isset( $presets['data'] ) ) {
				$result = array(
					'success' => true,
					'message' => 'Preset changed',
					'data'    => $presets['data'],
					'list'    => $presets['list'],
				);
				update_post_meta( $_GET['calc_id'], 'ccb_calc_preset_idx', sanitize_text_field( $preset_key ) );
			}
		}

		wp_send_json( $result );
	}

	public static function ccb_set_version() {
		check_ajax_referer( 'ccb_set_version', 'nonce' );

		if ( ! current_user_can( 'publish_posts' ) ) {
			wp_send_json_error( __( 'You are not allowed to run this action', 'cost-calculator-builder' ) );
		}

		$result = array(
			'status'  => 'error',
			'success' => false,
			'message' => 'Something went wrong',
		);

		if ( isset( $_GET['version'] ) ) {
			$version = $_GET['version'];
			update_option( 'ccb_version_control', sanitize_text_field( $version ) );

			if ( 'v2' === $version ) {
				CCBUpdatesCallbacks::ccb_from_v1_to_v2();
			} else {
				CCBUpdatesCallbacks::ccb_from_v2_to_v1();
			}

			$result = array(
				'status'  => 'success',
				'success' => true,
				'message' => 'Interface updated',
			);
		}

		wp_send_json( $result );
	}

}
