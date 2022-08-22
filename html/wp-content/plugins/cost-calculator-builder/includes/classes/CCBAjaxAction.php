<?php

namespace cBuilder\Classes;

use cBuilder\Classes\Database\Orders;

class CCBAjaxAction {

	/**
	 * @param string $tag The name of the action to which the $function_to_add is hooked.
	 * @param callable $function_to_add The name of the function you wish to be called.
	 * @param boolean $nonpriv Optional. Boolean argument for adding wp_ajax_nopriv_action. Default false.
	 * @param int $priority Optional. Used to specify the order in which the functions
	 *                                  associated with a particular action are executed. Default 10.
	 *                                  Lower numbers correspond with earlier execution,
	 *                                  and functions with the same priority are executed
	 *                                  in the order in which they were added to the action.
	 * @param int $accepted_args Optional. The number of arguments the function accepts. Default 1.
	 * @return true Will always return true.
	 */

	public static function addAction( $tag, $function_to_add, $nonpriv = false, $priority = 10, $accepted_args = 1 ) {
		add_action( 'wp_ajax_' . $tag, $function_to_add, $priority = 10, $accepted_args = 1 );
		if ( $nonpriv ) {
			add_action( 'wp_ajax_nopriv_' . $tag, $function_to_add );
		}
		return true;
	}

	public static function init() {
		self::addAction( 'calc_create_id', array( CCBCalculators::class, 'create_calc_id' ) );
		self::addAction( 'calc_edit_calc', array( CCBCalculators::class, 'edit_calc' ) );
		self::addAction( 'calc_delete_calc', array( CCBCalculators::class, 'delete_calc' ) );
		self::addAction( 'calc_save_custom', array( CCBCalculators::class, 'save_custom' ) );
		self::addAction( 'calc_get_existing', array( CCBCalculators::class, 'get_existing' ) );
		self::addAction( 'calc_save_settings', array( CCBCalculators::class, 'save_settings' ) );
		self::addAction( 'ccb_set_version', array( CCBCalculators::class, 'ccb_set_version' ) );
		self::addAction( 'ccb_update_preset', array( CCBCalculators::class, 'ccb_update_preset' ) );
		self::addAction( 'ccb_add_preset', array( CCBCalculators::class, 'ccb_add_preset' ) );
		self::addAction( 'ccb_delete_preset', array( CCBCalculators::class, 'ccb_delete_preset' ) );
		self::addAction( 'calc_save_general_settings', array( CCBCalculators::class, 'save_general_settings' ) );
		self::addAction( 'calc_get_general_settings', array( CCBCalculators::class, 'calc_get_general_settings' ) );
		self::addAction( 'calc_duplicate_calc', array( CCBCalculators::class, 'duplicate_calc' ) );
		self::addAction( 'calc-run-calc-updates', array( CCBUpdates::class, 'run_calc_updates' ) );

		/** import/export  */
		self::addAction( 'cost-calculator-custom-import-total', array( CCBExportImport::class, 'custom_import_calculators_total' ) );
		self::addAction( 'cost-calculator-demo-calculators-total', array( CCBExportImport::class, 'demo_import_calculators_total' ) );
		self::addAction( 'cost-calculator-import-run', array( CCBExportImport::class, 'import_run' ) );
		self::addAction( 'cost-calculator-custom_export_run', array( CCBExportImport::class, 'export_calculators' ) );

		/** Cost Calculator Orders */
		self::addAction( 'create_cc_order', array( CCBOrderController::class, 'create' ), true );
		self::addAction( 'create_cc_order', array( CCBOrderController::class, 'create' ) );
		self::addAction( 'get_cc_orders', array( CCBOrderController::class, 'orders' ), true );
		self::addAction( 'delete_cc_orders', array( CCBOrderController::class, 'delete' ) );
		self::addAction( 'update_order_status', array( CCBOrderController::class, 'update' ), true );
	}
}
