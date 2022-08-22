<?php
/**
 * Copyright (c) Bytedance, Inc. and its affiliates. All Rights Reserved
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @package TikTok
 */
class Tt4b_Catalog_Class {

	/**
	 * Returns the amount of catalog items are in approved/processing/rejected.
	 *
	 * @param string $access_token The MAPI issued access token
	 * @param string $bc_id        The users business center ID
	 * @param string $catalog_id   The users catalog ID
	 *
	 * @return array(processing, approved, rejected)
	 */
	public static function get_catalog_processing_status(
		$access_token,
		$bc_id,
		$catalog_id
	) {
		// returns a counter of how many items are approved, processing, or rejected
		// from the TikTok catalog/product/get/ endpoint
		$logger = new Logger( wc_get_logger() );
		$mapi   = new Tt4b_Mapi_Class( $logger );

		$url    = 'catalog/overview/';
		$params = [
			'bc_id'      => $bc_id,
			'catalog_id' => $catalog_id,
		];
		$base   = [
			'processing' => 0,
			'approved'   => 0,
			'rejected'   => 0,
		];

		$result = $mapi->mapi_get( $url, $access_token, $params );
		$obj    = json_decode( $result, true );

		if ( ! isset( $obj['data'] ) ) {
			$logger->log( __METHOD__, 'get_catalog_processing_status data not set' );
			return $base;
		}

		if ( 'OK' !== $obj['message'] ) {
			$logger->log( __METHOD__, 'get_catalog_processing_status not OK response' );
			return $base;
		}

		$processing = $obj['data']['processing'];
		$approved   = $obj['data']['approved'];
		$rejected   = $obj['data']['rejected'];

		return [
			'processing' => $processing,
			'approved'   => $approved,
			'rejected'   => $rejected,
		];
	}

	/**
	 * Posts products from woocommerce store to tiktok catalog manager
	 *
	 * @param string $catalog_id   The users catalog ID
	 * @param string $bc_id        The users business center ID
	 * @param string $store_name   The users store name
	 * @param string $access_token The MAPI issued access token
	 *
	 * @return void
	 */
	public function full_catalog_sync( $catalog_id, $bc_id, $store_name, $access_token ) {
		$logger = new Logger( wc_get_logger() );
		$mapi   = new Tt4b_Mapi_Class( $logger );
		if ( '' === $catalog_id ) {
			$logger->log( __METHOD__, 'missing catalog_id for full catalog sync' );
			return;
		}
		if ( '' === $bc_id ) {
			$logger->log( __METHOD__, 'missing bc_id for full catalog sync' );
			return;
		}
		if ( '' === $access_token || false === $access_token ) {
			$logger->log( __METHOD__, 'missing access token for full catalog sync' );
			return;
		}
		// store_name just used for brand, can default it.
		if ( '' === $store_name ) {
			$store_name = 'WOO_COMMERCE';
		}

		// get products from merchant side.
		$page         = 1;
		$args         = [
			'limit' => 1000,
			'page'  => $page,
		];
		$dpa_products = [];
		$products     = wc_get_products( $args );
		if ( 0 === count( $products ) ) {
			$logger->log( __METHOD__, 'no products retrieved from wc_get_products' );
		}
		$num_products = count( $products );
		while ( $num_products > 0 ) {
			$product = array_pop( $products );
			if ( is_null( $product ) ) {
				break;
			}
			$title       = $product->get_name();
			$description = $product->get_short_description();
			if ( '' === $description ) {
				$description = $title;
			}
			$condition = 'NEW';

			$availability = 'IN_STOCK';
			$stock_status = $product->is_in_stock();
			if ( false === $stock_status ) {
				$availability = 'OUT_OF_STOCK';
			}
			$sku_id     = (string) $product->get_id();
			$link       = get_permalink( $product->get_id() );
			$image_id   = $product->get_image_id();
			$image_url  = wp_get_attachment_image_url( $image_id, 'full' );
			$price      = $product->get_price();
			$sale_price = $product->get_sale_price();
			if ( '0' === $sale_price || '' === $sale_price ) {
				$sale_price = $price;
			}

			// if any of the values are empty, the whole request will fail, so skip the product.
			$missing_fields = [];
			if ( '' === $sku_id || false === $sku_id ) {
				$missing_fields[] = 'sku_id';
			}
			if ( '' === $title || false === $title ) {
				$missing_fields[] = 'title';
			}
			if ( '' === $image_url || false === $image_url ) {
				$missing_fields[] = 'image_url';
			}
			if ( '' === $price || false === $price || '0' === $price ) {
				$missing_fields[] = 'price';
			}
			if ( count( $missing_fields ) > 0 ) {
				$debug_message = sprintf(
					'sku_id: %s is missing the following fields for product sync: %s',
					$sku_id,
					join( ',', $missing_fields )
				);
				$logger->log( __METHOD__, $debug_message );
				continue;
			}

			$dpa_product = [
				'sku_id'        => $sku_id,
				'item_group_id' => $sku_id,
				'title'         => $title,
				'availability'  => $availability,
				'description'   => $description,
				'image_link'    => $image_url,
				'brand'         => $store_name,
				'profession'    => [
					'condition' => $condition,
				],
				'price'         => [
					'price'      => $price,
					'sale_price' => $sale_price,
				],
				'landing_url'   => [
					'link' => $link,
				],
			];
			array_push( $dpa_products, $dpa_product );
			if ( 0 === count( $products ) ) {
				$dpa_product_information = [
					'bc_id'        => $bc_id,
					'catalog_id'   => $catalog_id,
					'dpa_products' => $dpa_products,
				];
				$mapi->mapi_post( 'catalog/product/upload/', $access_token, $dpa_product_information );

				// retrieve next batch of products
				$page++;
				if ( 6 == $page ) {
					break;
				}
				$args         = [
					'limit' => 1000,
					'page'  => $page,
				];
				$products     = wc_get_products( $args );
				$num_products = count( $products );
				$dpa_products = [];
			}
		}
	}
}
