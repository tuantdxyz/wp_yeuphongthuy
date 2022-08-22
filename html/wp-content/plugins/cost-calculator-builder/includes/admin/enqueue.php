<?php

use cBuilder\Classes\CCBTranslations;
use cBuilder\Helpers\CCBConditionsHelper;
use cBuilder\Helpers\CCBFieldsHelper;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

function cBuilder_admin_enqueue() {
	$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );
	if ( 'v1' === $version_control ) {
		calc_enqueue_old_calc_scripts();
	} else {
		calc_enqueue_new_calc_scripts();
	}
}

function calc_enqueue_old_calc_scripts() {
	if ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder' ) ) { //phpcs:ignore

		$pro_updated = defined( 'CCB_PRO_VERSION' ) && version_compare( CCB_PRO_VERSION, '3.0.0', '>=' );
		$info_page   = empty( get_option( 'ccb_update_info' ) );

		if ( ( ! $pro_updated || $info_page ) && ! ( defined( 'CCB_PRO_VERSION' ) && version_compare( CCB_PRO_VERSION, '3.0.0', '<' ) ) ) {
			wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
			wp_enqueue_style( 'ccb-v2-admin-app-css', CALC_URL . '/frontend/v2/dist/css/admin.css', array(), CALC_VERSION );
		}

		/** Loading wp media libraries **/
		wp_enqueue_media();
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/v1/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-awesome-css', CALC_URL . '/frontend/v1/dist/css/all.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/v1/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v1/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/v1/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/v1/dist/css/material-styles.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-conflux-css', CALC_URL . '/frontend/v1/dist/conflux.css', array(), CALC_VERSION );

		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/v1/dist/bundle.js', array(), CALC_VERSION ); //phpcs:ignore
		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/v1/dist/feedback.js', array(), CALC_VERSION ); //phpcs:ignore
		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'          => admin_url( 'admin-ajax.php' ),
				'condition_actions' => CCBConditionsHelper::getActions(),
				'condition_states'  => CCBConditionsHelper::getConditionStates(),
				'dateFormat'        => get_option( 'date_format' ),
				'language'          => substr( get_bloginfo( 'language' ), 0, 2 ),
				'plugin_url'        => CALC_URL,
				'templates'         => CCBFieldsHelper::get_fields_templates(),
				'translations'      => array_merge( CCBTranslations::get_frontend_translations(), CCBTranslations::get_backend_translations() ),
			)
		);
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_gopro' ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-admin-gopro-css', CALC_URL . '/frontend/v1/dist/css/gopro.css', array(), CALC_VERSION );
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_orders' ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/v1/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-awesome-css', CALC_URL . '/frontend/v1/dist/css/all.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v1/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/v1/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/v1/dist/css/material-styles.css', array(), CALC_VERSION );
		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/v1/dist/bundle.js', array(), CALC_VERSION ); //phpcs:ignore
		wp_enqueue_style( 'ccb-conflux-css', CALC_URL . '/frontend/v1/dist/conflux.css', array(), CALC_VERSION );

		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'     => admin_url( 'admin-ajax.php' ),
				'plugin_url'   => CALC_URL,
				'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
				'translations' => CCBTranslations::get_backend_translations(),
			)
		);
	} elseif ( ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-affiliation' ) ) || ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-account' ) ) || ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-contact' ) ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-conflux-css', CALC_URL . '/frontend/v1/dist/conflux.css', array(), CALC_VERSION );
	} elseif ( isset( $_GET['page'] ) && 'cost_calculator_version_switch' === $_GET['page'] ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v2/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-awesome-css', CALC_URL . '/frontend/v1/dist/css/all.min.css', array(), CALC_VERSION );
		wp_enqueue_script( 'cbb-version-switch', CALC_URL . '/frontend/v2/dist/version-switch.js', array(), CALC_VERSION, true );
	}
}

function calc_enqueue_new_calc_scripts() {
	wp_enqueue_style( 'ccb-icons-list', CALC_URL . '/frontend/v2/dist/css/icon/style.css', array(), CALC_VERSION );
	if ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder' ) ) { //phpcs:ignore

		/** Loading wp media libraries **/
		wp_enqueue_media();
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = _.noConflict();' );

		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/v2/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/v2/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v2/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/v2/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/v2/dist/css/material-styles.css', array(), CALC_VERSION );

		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/v2/dist/bundle.js', array( 'ccb-lodash-js' ), CALC_VERSION, true );
		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/v2/dist/feedback.js', array(), CALC_VERSION, true );
		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'          => admin_url( 'admin-ajax.php' ),
				'condition_actions' => CCBConditionsHelper::getActions(),
				'condition_states'  => CCBConditionsHelper::getConditionStates(),
				'dateFormat'        => get_option( 'date_format' ),
				'language'          => substr( get_bloginfo( 'language' ), 0, 2 ),
				'plugin_url'        => CALC_URL,
				'templates'         => CCBFieldsHelper::get_fields_templates(),
				'translations'      => array_merge( CCBTranslations::get_frontend_translations(), CCBTranslations::get_backend_translations() ),
			)
		);
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_gopro' ) ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-gopro-css', CALC_URL . '/frontend/v2/dist/css/gopro.css', array(), CALC_VERSION );
	} elseif ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_orders' ) ) { //phpcs:ignore
		wp_enqueue_script( 'ccb-lodash-js', 'https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js', array(), CALC_VERSION, true );
		wp_add_inline_script( 'ccb-lodash-js', 'window.ccb_lodash = _.noConflict();' );
		wp_enqueue_script( 'cbb-feedback', CALC_URL . '/frontend/v2/dist/feedback.js', array(), CALC_VERSION, true );
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-bootstrap-css', CALC_URL . '/frontend/v2/dist/css/bootstrap.min.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-front-app-css', CALC_URL . '/frontend/v2/dist/css/style.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v2/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-css', CALC_URL . '/frontend/v2/dist/css/material.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-material-style-css', CALC_URL . '/frontend/v2/dist/css/material-styles.css', array(), CALC_VERSION );
		wp_enqueue_script( 'cbb-bundle-js', CALC_URL . '/frontend/v2/dist/bundle.js', array( 'ccb-lodash-js' ), CALC_VERSION, true );

		wp_localize_script(
			'cbb-bundle-js',
			'ajax_window',
			array(
				'ajax_url'     => admin_url( 'admin-ajax.php' ),
				'plugin_url'   => CALC_URL,
				'language'     => substr( get_bloginfo( 'language' ), 0, 2 ),
				'translations' => CCBTranslations::get_backend_translations(),
			)
		);
	} elseif ( ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-affiliation' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-account' ) ) // phpcs:ignore
		|| ( isset( $_GET['page'] ) && ( $_GET['page'] === 'cost_calculator_builder-contact' ) ) // phpcs:ignore
	) {
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
	} elseif ( isset( $_GET['page'] ) && 'cost_calculator_version_switch' === $_GET['page'] ) { //phpcs:ignore
		wp_enqueue_style( 'ccb-calc-font', CALC_URL . '/frontend/v2/dist/css/font/font.css', array(), CALC_VERSION );
		wp_enqueue_style( 'ccb-admin-app-css', CALC_URL . '/frontend/v2/dist/css/admin.css', array(), CALC_VERSION );
		wp_enqueue_script( 'cbb-version-switch', CALC_URL . '/frontend/v2/dist/version-switch.js', array(), CALC_VERSION, true );
	}
}

add_action( 'admin_enqueue_scripts', 'cBuilder_admin_enqueue', 1 );
