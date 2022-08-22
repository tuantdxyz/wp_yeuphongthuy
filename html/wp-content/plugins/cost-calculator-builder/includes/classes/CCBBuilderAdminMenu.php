<?php

namespace cBuilder\Classes;

class CCBBuilderAdminMenu {

	public function __construct() {
		add_action( 'admin_menu', array( $this, 'settings_menu' ), 20 );
	}

	public static function init() {
		return new CCBBuilderAdminMenu();
	}

	public function settings_menu() {
		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		add_menu_page(
			'Cost Calculator',
			'Cost Calculator',
			'manage_options',
			'cost_calculator_builder',
			array( $this, 'render_page' ),
			'dashicons-welcome-widgets-menus',
			110
		);

		if ( 'v2' === $version_control ) {
			add_submenu_page(
				'cost_calculator_builder',
				esc_html__( 'Settings', 'cost-calculator-builder' ),
				esc_html__( 'Settings', 'cost-calculator-builder' ),
				'manage_options',
				'cost_calculator_builder&tab=settings',
				array( $this, 'render_page' )
			);
		}

		$disable_version_switch = get_option( 'ccb_disable_version_switch' );
		if ( version_compare( CALC_VERSION, '3.0.0', '>=' ) && empty( $disable_version_switch ) ) {
			add_submenu_page(
				'cost_calculator_builder',
				esc_html__( 'Versions Switch', 'cost-calculator-builder' ),
				esc_html__( 'Versions Switch', 'cost-calculator-builder' ),
				'manage_options',
				'cost_calculator_version_switch',
				array( $this, 'calc_version_switch' )
			);
		}

		if ( defined( 'CCB_PRO_VERSION' ) && ( version_compare( CCB_PRO_VERSION, '3.0.0', '>=' ) || 'v1' === $version_control ) ) {
			add_submenu_page(
				'cost_calculator_builder',
				esc_html__( 'Orders', 'cost-calculator-builder' ),
				esc_html__( 'Orders', 'cost-calculator-builder' ),
				'manage_options',
				'cost_calculator_orders',
				array( $this, 'calc_orders_page' )
			);
		}

		if ( ! defined( 'CCB_PRO_VERSION' ) ) {
			add_submenu_page(
				'cost_calculator_builder',
				esc_html__( 'Upgrade', 'cost-calculator-builder' ),
				'<span style="color: #adff2f;"><span style="font-size: 16px;text-align: left;" class="dashicons dashicons-star-filled stm_go_pro_menu"></span>' . esc_html__( 'Upgrade', 'cost-calculator-builder' ) . '</span>',
				'manage_options',
				'cost_calculator_gopro',
				array( $this, 'calc_gopro_page' )
			);
		}
	}

	public function render_page() {
		echo CCBTemplate::load( 'admin/index' ); //phpcs:ignore
	}

	public function calc_orders_page() {
		echo CCBTemplate::load( 'admin/pages/orders' ); //phpcs:ignore
	}

	public function calc_version_switch() {
		echo CCBTemplate::load( 'admin/pages/version-switch' ); //phpcs:ignore
	}

	public function calc_gopro_page() {
		echo CCBTemplate::load( 'admin/pages/go-pro' ); //phpcs:ignore
	}
}
