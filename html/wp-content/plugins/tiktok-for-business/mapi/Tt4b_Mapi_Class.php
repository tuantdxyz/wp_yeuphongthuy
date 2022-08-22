<?php
/**
 * Copyright (c) Bytedance, Inc. and its affiliates. All Rights Reserved
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @package TikTok
 */
class Tt4b_Mapi_Class {

	/**
	 * The TikTok Ads endpoint base url.
	 *
	 * @var string
	 */
	protected $mapi_url;

	/**
	 * The wc_get_logger interface.
	 *
	 * @var WC_Logger_Interface
	 */
	protected $logger;
	/**
	 * Constructor
	 *
	 * @param Logger $logger The wc_get_logger interface.
	 *
	 * @return void
	 */
	public function __construct( Logger $logger ) {
		$this->mapi_url = 'https://business-api.tiktok.com/open_api/v1.2/';
		$this->logger   = $logger;
	}

	/**
	 * Posts to business-api.tiktok.com
	 *
	 * @param string $endpoint     The endpoint for the mapi post
	 * @param string $access_token The MAPI issued access token
	 * @param array  $params       Whichever params to be included with the post
	 *
	 * @return string
	 */
	public function mapi_post( $endpoint, $access_token, $params ) {
		$url  = $this->mapi_url . $endpoint;
		$args = [
			'method'      => 'POST',
			'data_format' => 'body',
			'headers'     => [
				'Access-Token' => $access_token,
				'Content-Type' => 'application/json',
			],
			'body'        => json_encode( $params ),
		];
		$this->logger->log_request( $url, $args );
		$response = wp_remote_post( $url, $args );
		$this->logger->log_response( __METHOD__, $response );
		$body = wp_remote_retrieve_body( $response );
		return $body;
	}

	/**
	 * Get from business-api.tiktok.com
	 *
	 * @param string $endpoint     The endpoint for the mapi post
	 * @param string $access_token The MAPI issued access token
	 * @param array  $params       Whichever params to be included with the post
	 *
	 * @return string
	 */
	public function mapi_get( $endpoint, $access_token, $params ) {
		$url  = $this->mapi_url . $endpoint . '?' . http_build_query( $params );
		$args = [
			'method'  => 'GET',
			'headers' => [
				'Access-Token' => $access_token,
				'Content-Type' => 'application/json',
			],
		];
		$this->logger->log_request( $url, $args );
		$result = wp_remote_get( $url, $args );
		$this->logger->log_response( __METHOD__, $result );
		$body = wp_remote_retrieve_body( $result );
		return $body;
	}

	/**
	 * Get from tbp/business_profile
	 *
	 * @param string $access_token         The MAPI issued access token
	 * @param string $external_business_id The exteneral business_id of the merchant
	 *
	 * @return string
	 */
	public function get_business_profile( $access_token, $external_business_id ) {
		// returns a raw API response from TikTok tbp/business_profile/get/ endpoint

		if ( false === $external_business_id ) {
			$this->logger->log( __METHOD__, 'external_business_id not found, exiting' );
			return '';
		}

		$url    = 'tbp/business_profile/get/';
		$params = [
			'business_platform'    => 'WOO_COMMERCE',
			'external_business_id' => $external_business_id,
			'full_data'            => 1,
		];
		$result = $this->mapi_get( $url, $access_token, $params );
		return $result;
	}

	/**
	 * Update from tbp/business_profile
	 *
	 * @param string  $access_token         The MAPI issued access token
	 * @param string  $external_business_id The external business_id of the merchant
	 * @param integer $total_gmv The merchant's total gmv
	 * @param integer $total_orders The merchant's total orders
	 * @param integer $total_orders The merchant's tenure in days
	 * @param string  $current_tiktok_for_woocommerce_version The current tiktok-for-woocommerce version
	 *
	 * @return void
	 */
	public function update_business_profile( $access_token, $external_business_id, $total_gmv, $total_orders, $days_since_first_order, $current_tiktok_for_woocommerce_version ) {
		// updates the business_profile. Used for updating a merchants eligibility criteria.
		if ( false === $external_business_id ) {
			$this->logger->log( __METHOD__, 'external_business_id not found, exiting' );
		}

		$url             = 'tbp/business_profile/store/update/';
		$net_gmv         = [
			[
				'interval' => 'LIFETIME',
				'max'      => $total_gmv,
				'min'      => $total_gmv,
				'unit'     => 'CURRENCY',
			],
		];
		$net_order_count = [
			[
				'interval' => 'LIFETIME',
				'max'      => $total_orders,
				'min'      => $total_orders,
				'unit'     => 'COUNT',
			],
		];
		$tenure          = [
			'min'  => $days_since_first_order,
			'max'  => $days_since_first_order,
			'unit' => 'DAYS',
		];
		$params          = [
			'business_platform'    => 'WOO_COMMERCE',
			'external_business_id' => $external_business_id,
			'net_gmv'              => $net_gmv,
			'net_order_count'      => $net_order_count,
			'tenure'               => $tenure,
			'extra_data'           => $current_tiktok_for_woocommerce_version,
		];

		$this->mapi_post( $url, $access_token, $params );
	}

	/**
	 * Returns a raw API response from TikTok
	 * marketing_api/api/developer/app/create_auto_approve/
	 *
	 * @param string $smb_id       The merchants external_business_id
	 * @param string $smb_name     The MAPI issued access token
	 * @param string $redirect_uri The redirect_url (the store url)
	 *
	 * @return string|bool
	 */
	public function create_open_source_app( $smb_id, $smb_name, $redirect_uri ) {
		$url               = 'https://ads.tiktok.com/marketing_api/api/developer/app/create_auto_approve/';
		$open_source_token = '244e1de7-8dad-4656-a859-8dc09eea299d';
		$tries             = 0;
		$params            = [
			'business_platform' => 'PROD',
			'smb_id'            => $smb_id,
			'smb_name'          => $smb_name,
			'redirect_url'      => $redirect_uri,
		];
		$args              = [
			'method'      => 'POST',
			'data_format' => 'body',
			'headers'     => [
				'Access-Token' => $open_source_token,
				'Content-Type' => 'application/json',
				'Referer'      => 'https://ads.tiktok.com',
			],
			'body'        => json_encode( $params ),
		];
		$this->logger->log_request( $url, $args );
		while ( $tries <= 3 ) {
			$response = wp_remote_post( $url, $args );
			$tries ++;
			if ( 200 !== wp_remote_retrieve_response_code( $response ) ) {
				$this->logger->log_response( __METHOD__, $response );
			} else {
				$this->logger->log_response( __METHOD__, $response );
				return wp_remote_retrieve_body( $response );
			}
		}
		return false;
	}

	/**
	 * Returns a raw API response from TikTok oauth2/access_token_v2/ endpoint
	 *
	 * @param string $app_id    The MAPI app_id
	 * @param string $secret    The MAPI secret
	 * @param string $auth_code The auth_code
	 *
	 * @return string
	 */
	public function get_access_token( $app_id, $secret, $auth_code ) {
		$endpoint = 'oauth2/access_token/';
		$url      = $this->mapi_url . $endpoint;
		$params   = [
			'app_id'    => $app_id,
			'secret'    => $secret,
			'auth_code' => $auth_code,
		];
		$args     = [
			'method'      => 'POST',
			'data_format' => 'body',
			'headers'     => [ 'Content-Type' => 'application/json' ],
			'body'        => json_encode( $params ),
		];
		$this->logger->log_request( $url, $args );
		$response = wp_remote_post( $url, $args );
		$this->logger->log_response( __METHOD__, $response );
		$body = wp_remote_retrieve_body( $response );
		return $body;
	}

	/**
	 * Returns trust signal information
	 *
	 * @return array(total_gmv, total_orders, tenure)
	 */
	public function retrieve_eligibility_information() {
		// pull eligibility metrics.
		$order_page   = 1;
		$orders       = wc_get_orders(
			[
				'post_status' => 'wc-completed',
				'limit'       => 1000,
				'page'        => $order_page,
			]
		);
		$num_orders   = count( $orders );
		$total_gmv    = 0;
		$total_orders = 0;

		foreach ( $orders as $order ) {
			if ( is_null( $order ) ) {
				break;
			}
			$order_total = $order->get_total();
			if ( $order_total > 0 ) {
				$total_gmv += $order_total;
				$total_orders++;
			}
		}
		// while ( $num_orders > 0 ) {
		// $order = array_pop( $orders );
		// if ( is_null( $order ) ) {
		// break;
		// }
		// $this->logger->log( __METHOD__, "order retrieved: $order" );
		// $order_total = $order->get_total();
		// if ( $order_total > 0 ) {
		// $total_gmv += $order_total;
		// $total_orders++;
		// }
		// paginate through API when pulling orders
		// if ( 0 === count( $orders ) ) {
		// $order_page++;
		// $orders     = wc_get_orders(
		// [
		// 'post_status' => 'wc-completed',
		// 'limit'       => 500,
		// 'page'        => $order_page,
		// ]
		// );
		// $num_orders = count( $orders );
		// }
		// }

		$days_since_first_order = 0;
		$oldest_orders          = ( new WC_Order_Query(
			[
				'limit'   => 1,
				'orderby' => 'date',
				'order'   => 'ASC',
			]
		) )->get_orders();
		if ( count( $oldest_orders ) > 0 ) {
			$oldest_order_timestamp = $oldest_orders[0]->get_date_created()->getTimestamp();
			$days_since_first_order = (int) ( ( time() - $oldest_order_timestamp ) / DAY_IN_SECONDS );
		}

		return [
			'total_gmv'    => $total_gmv,
			'total_orders' => $total_orders,
			'tenure'       => $days_since_first_order,
		];
	}
}
