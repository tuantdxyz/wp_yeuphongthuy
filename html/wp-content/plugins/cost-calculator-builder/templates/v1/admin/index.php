<?php
$calc_id         = isset( $_GET['id'] ) ? (int) sanitize_text_field( $_GET['id'] ) : 0;
$pro_updated     = defined( 'CCB_PRO_VERSION' ) && version_compare( CCB_PRO_VERSION, '3.0.0', '>=' );
$info_page       = empty( get_option( 'ccb_update_info' ) ) && empty( get_option( 'ccb_disable_version_switch' ) );
$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );
?>
<div class="ccb-settings-wrapper calculator-settings ccb-wrapper-<?php echo esc_attr( $calc_id ); ?>">
	<?php if ( ! $pro_updated && defined( 'CCB_PRO_VERSION' ) && ! version_compare( CCB_PRO_VERSION, '3.0.0', '>=' ) && 'v2' === $version_control ) : ?>
		<?php require_once CALC_PATH . '/templates/v1/admin/pages/update-pro.php'; ?>
	<?php elseif ( $info_page ) : ?>
		<?php require_once CALC_PATH . '/templates/v1/admin/pages/updated-info.php'; ?>
	<?php else : ?>
		<calc-builder inline-template>
			<div class="ccb-settings-container">
				<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/header' ); // phpcs:ignore ?>
				<div class="ccb-settings-content">

					<div v-if="!calc_list" :class="['ccb-tabs-wrapper', { show: !calc_list }]" style="display: none">
						<div class="ccb-page" :class="{active: active_tab === 'calculator'}" @click="active_tab = 'calculator'">
							<i class="fas fa-calculator"></i>
							<span> <?php esc_html_e( 'Calculator', 'cost-calculator-builder' ); ?></span>
						</div>

						<div class="ccb-page" :class="{disabled: disabled, active: active_tab === 'conditions'}" @click="active_tab = 'conditions'">
							<i class="fas fa-cube"></i>
							<span> <?php esc_html_e( 'Conditions', 'cost-calculator-builder' ); ?></span>
						</div>

						<div class="ccb-page" :class="{disabled: disabled, active: active_tab === 'settings'}" @click="active_tab = 'settings'">
							<i class="fas fa-cog"></i>
							<span><?php esc_html_e( 'Settings', 'cost-calculator-builder' ); ?></span>
						</div>

						<div class="ccb-page" :class="{disabled: disabled, active: active_tab === 'customize'}" @click="active_tab = 'customize'">
							<i class="fas fa-paint-brush"></i>
							<span><?php esc_html_e( 'Customize', 'cost-calculator-builder' ); ?></span>
						</div>
					</div>

					<div class="ccb-settings-section">
						<loader v-if="loader"></loader>

						<template v-else-if="calc_list">
							<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/existing' ); // phpcs:ignore ?>
						</template>

						<template v-else>
							<?php $tabs = \cBuilder\Classes\CCBSettingsData::get_tab_pages(); ?>
							<?php foreach ( $tabs as $tab ) : ?>
								<?php if ( 'calculator' === $tab ) : ?>
									<keep-alive>
								<?php endif; ?>
								<component
										inline-template
										ref="<?php echo esc_attr( $tab ); ?>"
										@save="saveCondition"
										is="<?php echo esc_attr( $tab ); ?>-page"
										v-if="'<?php echo esc_attr( $tab ); ?>' === active_tab"
								>
									<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/' . $tab, array( 'calc_id' => $calc_id ) ); // phpcs:ignore ?>
								</component>
								<?php if ( 'calculator' === $tab ) : ?>
									</keep-alive>
								<?php endif; ?>
							<?php endforeach; ?>
						</template>

					</div>
				</div>
				<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/modal/modal' ); //phpcs:ignore ?>
				<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/footer' ); //phpcs:ignore ?>
			</div>
		</calc-builder>
	<?php endif; ?>
</div>
