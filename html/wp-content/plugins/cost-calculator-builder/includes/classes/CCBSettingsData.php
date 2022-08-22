<?php

namespace cBuilder\Classes;

class CCBSettingsData {
	public static function get_tab_pages() {
		return array( 'calculator', 'conditions', 'settings', 'customize' );
	}

	public static function settings_data() {
		return array(
			'general'        => array(
				'header_title' => 'Summary',
				'descriptions' => true,
				'hide_empty'   => true,
				'boxStyle'     => 'vertical',
			),
			'currency'       => array(
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'texts'          => array(
				'title'        => 'Your service request has been completed!',
				'description'  => 'We have sent your request information to your email.',
				'issued_on'    => 'Issued on',
				'reset_btn'    => 'Create new calculation',
				'invoice_btn'  => 'Get invoice',
				'required_msg' => 'This field is required',
			),
			'formFields'     => array(
				'fields'            => array(),
				'emailSubject'      => '',
				'contactFormId'     => '',
				'accessEmail'       => false,
				'adminEmailAddress' => '',
				'submitBtnText'     => 'Submit',
				'allowContactForm'  => false,
				'body'              => 'Dear sir/madam\n' .
					'We would be very grateful to you if you could provide us the quotation of the following=>\n' .
					'\nTotal Summary\n' .
					'[ccb-subtotal]\n' .
					'Total: [ccb-total-0]\n' .
					'Looking forward to hearing back from you.\n' .
					'Thanks in advance',
				'payment'           => false,
				'paymentMethod'     => '',
			),
			'paypal'         => array(
				'enable'        => false,
				'description'   => '[ccb-total-0]',
				'paypal_email'  => '',
				'currency_code' => '',
				'paypal_mode'   => 'sandbox',
				'formulas'      => array(),
			),
			'woo_products'   => array(
				'enable'        => false,
				'category_id'   => '',
				'hook_to_show'  => 'woocommerce_after_single_product_summary',
				'hide_woo_cart' => false,
				'meta_links'    => array(),
			),
			'woo_checkout'   => array(
				'enable'      => false,
				'product_id'  => '',
				'redirect_to' => 'cart',
				'description' => '[ccb-total-0]',
				'formulas'    => array(),
			),
			'stripe'         => array(
				'enable'      => false,
				'secretKey'   => '',
				'publishKey'  => '',
				'currency'    => 'usd',
				'description' => '[ccb-total-0]',
				'formulas'    => array(),
			),
			'recaptcha_type' => array(
				'v2' => 'Google reCAPTCHA v2',
				'v3' => 'Google reCAPTCHA v3',
			),
			'recaptcha_v3'   => array(
				'siteKey'   => '',
				'secretKey' => '',
			),
			'recaptcha'      => array(
				'enable'  => false,
				'type'    => 'v2',
				'options' => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
				'v2'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v3'      => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
			),
			'notice'         => array(
				'requiredField' => 'This field is required',
			),
			'icon'           => 'fas fa-cogs',
			'type'           => 'Cost Calculator Settings',
		);
	}

	public static function general_settings_data() {
		return array(
			'currency'    => array(
				'use_in_all'          => false,
				'currency'            => '$',
				'num_after_integer'   => 2,
				'decimal_separator'   => '.',
				'thousands_separator' => ',',
				'currencyPosition'    => 'left_with_space',
			),
			'form_fields' => array(
				'use_in_all'        => false,
				'emailSubject'      => '',
				'adminEmailAddress' => '',
				'submitBtnText'     => 'Submit',
			),
			'recaptcha'   => array(
				'use_in_all' => false,
				'enable'     => false,
				'type'       => 'v2',
				'v3'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'v2'         => array(
					'siteKey'   => '',
					'secretKey' => '',
				),
				'options'    => array(
					'v2' => 'Google reCAPTCHA v2',
					'v3' => 'Google reCAPTCHA v3',
				),
			),
			'stripe'      => array(
				'use_in_all' => false,
				'secretKey'  => '',
				'publishKey' => '',
				'currency'   => 'USD',
			),
			'paypal'      => array(
				'use_in_all'    => false,
				'paypal_email'  => '',
				'currency_code' => '',
				'paypal_mode'   => 'sandbox',
			),
		);
	}

	public static function get_settings_pages() {
		$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );

		if ( 'v1' === $version_control ) {
			return self::get_old_settings_pages();
		}

		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Grand Total', 'cost-calculator-builder' ),
				'slug'  => 'total-summary',
				'icon'  => 'ccb-icon-Union-28',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Notifications', 'cost-calculator-builder' ),
				'slug'  => 'texts',
				'icon'  => 'ccb-icon-Path-3601',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Send Form', 'cost-calculator-builder' ),
				'slug'  => 'send-form',
				'icon'  => 'ccb-icon-XMLID_426',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Woo Products', 'cost-calculator-builder' ),
				'slug'  => 'woo-products',
				'icon'  => 'ccb-icon-Union-17',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Woo Checkout', 'cost-calculator-builder' ),
				'slug'  => 'woo-checkout',
				'icon'  => 'ccb-icon-Path-3498',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Stripe', 'cost-calculator-builder' ),
				'slug'  => 'stripe',
				'icon'  => 'ccb-icon-Path-3499',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'PayPal', 'cost-calculator-builder' ),
				'slug'  => 'paypal',
				'icon'  => 'ccb-icon-Path-3500',
			),
		);
	}

	public static function get_general_settings_pages() {
		return array(
			array(
				'type'  => 'basic',
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'ccb-icon-Union-23',
			),

			array(
				'type'  => 'basic',
				'title' => __( 'Email', 'cost-calculator-builder' ),
				'slug'  => 'email',
				'icon'  => 'ccb-icon-XMLID_426',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Captcha', 'cost-calculator-builder' ),
				'slug'  => 'captcha',
				'icon'  => 'ccb-icon-Path-3468',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'Stripe', 'cost-calculator-builder' ),
				'slug'  => 'stripe',
				'icon'  => 'ccb-icon-Path-3499',
			),

			array(
				'type'  => 'pro',
				'title' => __( 'PayPal', 'cost-calculator-builder' ),
				'slug'  => 'paypal',
				'icon'  => 'ccb-icon-Path-3500',
			),
		);
	}

	public static function get_tab_data() {
		return array(
			'calculators' => array(
				'icon'      => 'ccb-icon-Path-3516',
				'label'     => __( 'Calculator fields', 'cost-calculator-builder' ),
				'component' => 'ccb-calculator-tab',
			),
			'conditions'  => array(
				'icon'      => 'ccb-icon-path3745',
				'label'     => __( 'Conditions', 'cost-calculator-builder' ),
				'component' => '',
			),
			'settings'    => array(
				'icon'      => 'ccb-icon-Union-28',
				'label'     => __( 'Settings', 'cost-calculator-builder' ),
				'component' => '',
			),
			'appearances' => array(
				'icon'      => 'ccb-icon-Union-20',
				'label'     => __( 'Appearance', 'cost-calculator-builder' ),
				'component' => '',
			),
		);
	}

	public static function stm_calc_created_set_option( $post_id, $post, $update ) {
		if ( ! $update ) {
			return;
		}

		$created = get_option( 'stm_calc_created', false );
		if ( ! $created ) {
			$data = array(
				'show_time'   => time(),
				'step'        => 0,
				'prev_action' => '',
			);
			set_transient( 'stm_cost-calculator-builder_single_notice_setting', $data );
			update_option( 'stm_calc_created', true );
		}
	}

	public static function stm_admin_notice_rate_calc( $data ) {
		if ( is_array( $data ) ) {
			$data['title']   = 'Well done!';
			$data['content'] = 'You have built your first calculator up. Now please help us by rating <strong>Cost Calculator 5 Stars!</strong>';
		}

		return $data;
	}

	private static function get_old_settings_pages() {
		return array(
			array(
				'title' => __( 'General', 'cost-calculator-builder' ),
				'slug'  => 'general',
				'icon'  => 'fas fa-cog',
			),

			array(
				'title' => __( 'Currency', 'cost-calculator-builder' ),
				'slug'  => 'currency',
				'icon'  => 'fas fa-coins',
			),

			array(
				'title' => __( 'Send Form', 'cost-calculator-builder' ),
				'slug'  => 'form',
				'icon'  => 'fas fa-envelope',
				'file'  => 'send-form',
			),

			array(
				'title' => __( 'Woo Products', 'cost-calculator-builder' ),
				'slug'  => 'woo_products',
				'icon'  => 'fas fa-archive',
				'file'  => 'woo-products',
			),

			array(
				'title' => __( 'Woo Checkout', 'cost-calculator-builder' ),
				'slug'  => 'woo_checkout',
				'icon'  => 'fas fa-shopping-cart',
				'file'  => 'woo-checkout',
			),

			array(
				'title' => __( 'Stripe', 'cost-calculator-builder' ),
				'slug'  => 'stripe',
				'icon'  => 'fab fa-stripe-s',
				'file'  => 'stripe',
			),

			array(
				'title' => __( 'PayPal', 'cost-calculator-builder' ),
				'slug'  => 'paypal',
				'icon'  => 'fab fa-paypal',
				'file'  => 'paypal',
			),

			array(
				'title' => __( 'Default Form', 'cost-calculator-builder' ),
				'slug'  => 'default_form',
				'icon'  => 'fas fa-envelope-open-text',
				'file'  => 'default-form',
			),

			array(
				'title' => __( 'reCAPTCHA', 'cost-calculator-builder' ),
				'slug'  => 'recaptcha',
				'icon'  => 'fas fa-robot',
				'file'  => 'recaptcha',
			),

			array(
				'title' => __( 'Notice', 'cost-calculator-builder' ),
				'slug'  => 'notice',
				'icon'  => 'fas fa-exclamation-circle',
				'file'  => 'notice',
			),
		);
	}
}
