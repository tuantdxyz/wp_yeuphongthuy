<?php
/**
 * Copyright (c) Bytedance, Inc. and its affiliates. All Rights Reserved
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @package TikTok
 */
require_once 'Tt4b_Menu_Class.php';
add_action( 'admin_menu', [ 'tt4b_menu_class', 'tt4b_admin_menu' ] );
add_action( 'admin_head', [ 'tt4b_menu_class', 'tt4b_store_access_token' ] );
add_action( 'save_post', 'tt4b_product_sync', 10, 3 );

/**
 * Updates on product change
 *
 * @param string $post_id The product_id.
 * @param string $post    The post.
 * @param string $update  The update.
 *
 * @return void
 */
function tt4b_product_sync( $post_id, $post, $update ) {
	if ( 'product' !== $post->post_type ) {
		return;
	}
	$product = wc_get_product( $post_id );
	if ( is_null( $product ) ) {
		return;
	}
	$logger = new Logger( wc_get_logger() );

	$access_token = get_option( 'tt4b_access_token' );
	$catalog_id   = get_option( 'tt4b_catalog_id' );
	$bc_id        = get_option( 'tt4b_bc_id' );
	$shop_name    = get_bloginfo( 'name' );
	if ( false === $access_token ) {
		$logger->log( __METHOD__, 'missing access token for tt4b_product_sync' );
		return;
	}
	if ( '' === $catalog_id ) {
		$logger->log( __METHOD__, 'missing catalog_id for tt4b_product_sync' );
		return;
	}
	if ( '' === $bc_id ) {
		$logger->log( __METHOD__, 'missing bc_id for tt4b_product_sync' );
		return;
	}
	// shop_name just used for brand, can default it.
	if ( '' === $shop_name ) {
		$shop_name = 'WOO_COMMERCE';
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
	if ( '' === $sku_id ) {
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
		return;
	}

	$dpa_product = [
		'sku_id'        => $sku_id,
		'item_group_id' => $sku_id,
		'title'         => $title,
		'availability'  => $availability,
		'description'   => $description,
		'image_link'    => $image_url,
		'brand'         => $shop_name,
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

	// post to catalog manager.
	$mapi                    = new Tt4b_Mapi_Class( $logger );
	$dpa_products            = [ $dpa_product ];
	$dpa_product_information = [
		'bc_id'        => $bc_id,
		'catalog_id'   => $catalog_id,
		'dpa_products' => $dpa_products,
	];
	$mapi->mapi_post( 'catalog/product/upload/', $access_token, $dpa_product_information );
}
