<?php

namespace cBuilder\Classes;

use cBuilder\Helpers\CCBFieldsHelper;

class CCBFrontController {
	public static function init() {
		add_action(
			'wp_enqueue_scripts',
			function () {
				wp_enqueue_script( 'jquery' );
			}
		);
		add_shortcode( 'stm-calc', array( self::class, 'render_calculator' ) );
	}

	/**
	 * todo all template params must be here in controller
	 */
	public static function render_calculator( $attr ) {
		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( defined( 'CCB_PRO_VERSION' ) && ! version_compare( CCB_PRO_VERSION, '3.0.0', '>=' ) && 'v2' === $version_control ) {
			if ( is_admin() ) {
				return '<p style="text-align: center">' . __( 'Please, update pro', 'cost-calculator-builder' ) . '</p>';
			} else {
				return '<p style="text-align: center">' . __( 'No selected calculator', 'cost-calculator-builder' ) . '</p>';
			}
		}

		if ( 'v1' === $version_control ) {
			wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/v1/dist/css/style.css', array(), CALC_VERSION );
			wp_enqueue_style( 'cc-builder-awesome-css', CALC_URL . '/frontend/v1/dist/css/all.min.css', array(), CALC_VERSION );
			wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/v1/dist/css/material.css', array(), CALC_VERSION );
			wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/v1/dist/css/material-styles.css', array(), CALC_VERSION );
		} else {
			wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/v2/dist/css/icon/style.css', array(), CALC_VERSION );
			wp_enqueue_style( 'calc-builder-app', CALC_URL . '/frontend/v2/dist/css/style.css', array(), CALC_VERSION );
			wp_enqueue_style( 'ccb-material', CALC_URL . '/frontend/v2/dist/css/material.css', array(), CALC_VERSION );
			wp_enqueue_style( 'ccb-material-style', CALC_URL . '/frontend/v2/dist/css/material-styles.css', array(), CALC_VERSION );
			wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
			wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = window.ccb_lodash ? window.ccb_lodash : _.noConflict();' );
		}

		$params   = shortcode_atts( array( 'id' => null ), $attr );
		$language = substr( get_bloginfo( 'language' ), 0, 2 );

		if ( ! is_admin() || ! empty( $_GET['page'] ) && 'cost_calculator_builder' === $_GET['action'] ) {  // phpcs:ignore WordPress.Security.NonceVerification
			if ( 'v1' === $version_control ) {
				wp_enqueue_script( 'calc-builder-main-js', CALC_URL . '/frontend/v1/dist/bundle.js', array(), CALC_VERSION, true );
			} else {
				wp_enqueue_script( 'calc-builder-main-js', CALC_URL . '/frontend/v2/dist/bundle.js', array( 'ccb-lodash-js' ), CALC_VERSION, true );
			}

			wp_localize_script(
				'calc-builder-main-js',
				'ajax_window',
				array(
					'ajax_url'  => admin_url( 'admin-ajax.php' ),
					'language'  => $language,
					'templates' => CCBFieldsHelper::get_fields_templates(),
				)
			);
		}

		if ( isset( $params['id'] ) && get_post( $params['id'] ) ) {
			$calc_id = $params['id'];
			return \cBuilder\Classes\CCBTemplate::load(
				'/frontend/render',
				array(
					'calc_id'      => $calc_id,
					'language'     => $language,
					'translations' => CCBTranslations::get_frontend_translations(),
				)
			);
		}
		return '<p style="text-align: center">' . __( 'No selected calculator', 'cost-calculator-builder' ) . '</p>';
	}
}
