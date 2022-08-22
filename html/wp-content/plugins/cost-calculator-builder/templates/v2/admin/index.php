<?php
$is_settings = isset( $_GET['tab'] ) && sanitize_text_field( $_GET['tab'] ) === 'settings'; // phpcs:ignore WordPress.Security.NonceVerification
$pro_updated = defined( 'CCB_PRO_VERSION' ) && version_compare( CCB_PRO_VERSION, '3.0.0', '>=' );
$info_page   = empty( get_option( 'ccb_update_info' ) ) && empty( get_option( 'ccb_disable_version_switch' ) );

?>

<div class="ccb-settings-wrapper calculator-settings">
	<?php if ( ! $pro_updated && defined( 'CCB_PRO_VERSION' ) ) : ?>
		<?php require_once CALC_PATH . '/templates/v2/admin/pages/update-pro.php'; ?>
	<?php elseif ( $info_page ) : ?>
		<?php require_once CALC_PATH . '/templates/v2/admin/pages/updated-info.php'; ?>
	<?php else : ?>
		<calc-builder inline-template>
			<div class="ccb-main-container">
				<template v-if="!$store.getters.getHideHeader">
					<?php require_once CALC_PATH . '/templates/v2/admin/components/header.php'; ?>
				</template>
				<div class="ccb-tab-content">
					<div class="ccb-tab-sections ccb-loader-section" v-if="loader">
						<loader></loader>
					</div>
					<template v-else>
						<?php if ( $is_settings ) : ?>
							<general-settings inline-template>
								<?php require_once CALC_PATH . '/templates/v2/admin/pages/settings.php'; ?>
							</general-settings>
						<?php else : ?>
							<calculators-page inline-template>
								<?php require_once CALC_PATH . '/templates/v2/admin/pages/calculator.php'; ?>
							</calculators-page>
						<?php endif; ?>
					</template>
				</div>
			</div>
		</calc-builder>
	<?php endif; ?>
</div>
