<?php
$modal_types = array(
	'preview'   => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/v2/admin/single-calc/modals/modal-preview.php',
	),
	'condition' => array(
		'type' => 'condition',
		'path' => CALC_PATH . '/templates/v2/admin/single-calc/modals/condition.php',
	),
);
?>

<div class="ccb-create-calc ccb-condition-container">
	<?php if ( ! defined( 'CCB_PRO' ) ) : ?>
		<div class="ccb-pro-feature-wrapper">
			<span class="ccb-pro-feature-wrapper--icon-box">
				<i  class="ccb-icon-Union-33"></i>
			</span>
			<span class="ccb-pro-feature-wrapper--label ccb-heading-3 ccb-bold"><?php esc_html_e( 'This feature is a part of Pro version', 'cost-calculator-builder' ); ?></span>
			<a href="https://stylemixthemes.com/cost-calculator-plugin/?utm_source=wpadmin&utm_medium=promo_calc&utm_campaign=2020" target="_blank" class="ccb-button ccb-href success"><?php esc_html_e( 'Upgrade Now', 'cost-calculator-builder' ); ?></a>
		</div>
	<?php else : ?>
		<?php do_action( 'render-condition' ); //phpcs:ignore ?>
	<?php endif; ?>
	<ccb-modal-window>
		<template v-slot:content>
			<?php foreach ( $modal_types as $m_type ) : ?>
				<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
					<?php require $m_type['path']; ?>
				</template>
			<?php endforeach; ?>
		</template>
	</ccb-modal-window>
</div>
