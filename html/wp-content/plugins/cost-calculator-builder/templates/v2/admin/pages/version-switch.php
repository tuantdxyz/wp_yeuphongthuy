<?php
$accordions = array(
	array(
		'title'   => __( 'Will my calculators still run?', 'cost-calculator-builder' ),
		'content' => __( 'Sure, all calculators that were made using the previous version will be completely transferred to the new interface and continue to work as they did before', 'cost-calculator-builder' ),
	),
	array(
		'title'   => __( 'Will my current settings be kept?', 'cost-calculator-builder' ),
		'content' => __( 'Yes, all calculator preferences—settings, conditions, and customization options—will be transferred to the new plugin interface.', 'cost-calculator-builder' ),
	),
	array(
		'title'   => __( 'Will the switching affect my site?', 'cost-calculator-builder' ),
		'content' => __( 'The transfer will be carried out immediately and won’t affect the operation of your site in any way.', 'cost-calculator-builder' ),
	),
	array(
		'title'   => __( 'Can I roll back to the Previous Interface?', 'cost-calculator-builder' ),
		'content' => __( 'You can also roll back from the new interface to the previous one without losing any data or settings.', 'cost-calculator-builder' ),
	),
	array(
		'title'   => __( 'What is the expected lifespan of the previous version?', 'cost-calculator-builder' ),
		'content' => __( 'The previous version will be supported until September 2022. Switching between versions will be available until September 2022.', 'cost-calculator-builder' ),
	),
	array(
		'title'   => __( 'What\'s new in the update?', 'cost-calculator-builder' ),
		'content' => __( 'Drastic UI modifications, navigation optimizations, presets bundle, and much more! To see the update details follow the link', 'cost-calculator-builder' ),
		'link'    => 'https://stylemixthemes.com/wp/something-big-is-coming-meet-all-new-cost-calculator/',
	),
);

update_option( 'ccb_update_info', 1 );
$version_control = empty( get_option( 'ccb_version_control' ) ) ? 'v2' : get_option( 'ccb_version_control' );
$url             = get_admin_url() . 'admin.php?page=cost_calculator_builder';
?>

<div id="ccb-version-switch">
	<ccb-version-switch inline-template count="<?php echo esc_attr( count( $accordions ) ); ?>" version="<?php echo esc_attr( $version_control ); ?>">
		<div class="ccb-version-switch-container">
			<div class="ccb-version-switch-content">
				<loader v-if="preloader"></loader>
				<div class="ccb-version-switch-inner-content" v-else>
					<div class="ccb-version-switch-logo-wrap">
						<img src="<?php echo esc_attr( CALC_URL . '/frontend/v2/dist/img/calc.png' ); ?>" alt="">
					</div>
					<div class="ccb-version-switch-typography">
						<span class="ccb-version-switch-title"><?php esc_html_e( 'Select version of Cost Calculator', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-version-switch-description"><span class="ccb-version-switch-bold"><?php esc_html_e( 'Attention', 'cost-calculator-builder' ); ?>:</span><?php esc_html_e( ' Some settings might not be applied when you shift versions. The v3.0 will continue to support the previous one through September 2022.', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-version-switch-actions">
						<div class="ccb-version-switch-controllers">
							<div class="ccb-version-switch-controller" :class="{'ccb-v-s-active': 'v2' === version_interface}">
								<div class="ccb-radio-wrapper">
									<label>
										<input type="radio" v-model="version_interface" name="version_control" value="v2" checked>
										<span class="ccb-heading-5" style="display: inline-block; margin-left: 3px !important;"><?php esc_html_e( 'Cost Calculator 3.0', 'cost-calculator-builder' ); ?></span>
									</label>
								</div>
								<div class="ccb-v-s-beta">
									<span>beta</span>
								</div>
							</div>
							<div class="ccb-version-switch-controller" :class="{'ccb-v-s-active': 'v1' === version_interface}">
								<div class="ccb-radio-wrapper">
									<label>
										<input type="radio" v-model="version_interface" name="version_control" value="v1" checked>
										<span class="ccb-heading-5" style="display: inline-block; margin-left: 3px !important;"><?php esc_html_e( 'Cost Calculator 2.0', 'cost-calculator-builder' ); ?></span>
									</label>
								</div>
							</div>
						</div>
						<div class="ccb-version-switch-btn-action">
							<button class="ccb-button success" @click.prevent="setVersion('<?php echo esc_url( $url ); ?>')"><?php esc_html_e( 'Switch to ', 'cost-calculator-builder' ); ?>{{ version_interface !== 'v1' ? 'v3.0' : 'v2.0' }}</button>
						</div>
					</div>
				</div>
			</div>
			<div class="ccb-version-switch-sidebar">
				<div class="ccb-version-switch-sidebar-banners">
					<div class="ccb-version-switch-header">
						<div class="ccb-version-switch-header-banner">
							<img src="<?php echo esc_attr( CALC_URL . '/frontend/v2/dist/img/version-switch.png' ); ?>" alt="">
						</div>
						<div class="ccb-version-switch-header-content">
							<div class="ccb-version-switch-header-content-typography">
								<span class="ccb-version-switch-header-content-typography-title">Cost Calculator 3.0</span>
								<span class="ccb-version-switch-header-content-typography-description"><?php esc_html_e( 'Experience the change', 'cost-calculator-builder' ); ?></span>
							</div>
							<a href="https://stylemixthemes.com/wp/something-big-is-coming-meet-all-new-cost-calculator/" target="_blank" class="ccb-version-switch-header-content-arrow">
								<i class="ccb-icon-Path-3481"></i>
							</a>
						</div>
					</div>
					<div class="ccb-version-switch-video" :class="{ active: showVideo }">
						<div class="ccb-version-switch-video-preview">
							<img src="<?php echo esc_url( CALC_URL . '/images/preview.png' ); ?>" alt="Cost Calculator Builder">
							<span class="ccb-version-switch-video-button" @click="playVideo"><i class="ccb-icon-Path-3488"></i></span>
						</div>
						<div class="ccb-version-switch-video-iframe">
							<iframe width="100%" height="100%" :src="videoSrc" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
						</div>
					</div>
				</div>
				<div class="ccb-version-switch-faq">
					<div class="ccb-version-switch-faq-title-box">
						<span class="ccb-version-switch-faq-title"><?php esc_html_e( 'FAQ', 'cost-calculator-builder' ); ?></span>
					</div>
					<div class="ccb-version-switch-faq-container">
						<ul class="ccb-version-switch-faq-list">
							<?php foreach ( $accordions as $idx => $accordion ) : ?>
								<li class="ccb-version-switch-faq-list-item" :class="{'ccb-v-s-list-selected': '<?php echo esc_attr( $idx ); ?>' === listIdx}">
									<input type="checkbox" id="ccb-idx-<?php echo esc_attr( $idx ); ?>">
									<label for="ccb-idx-<?php echo esc_attr( $idx ); ?>" @click="openContent('<?php echo esc_attr( $idx ); ?>')">
										<span class="ccb-v-s-icon">
											<i class="ccb-icon-Path-3481"></i>
										</span>
										<span class="ccb-version-switch-faq-list-item-label"><?php echo esc_html( $accordion['title'] ); ?></span>
									</label>
									<p class="ccb-version-switch-faq-list-item-content" :ref="'accordion-content-<?php echo esc_attr( $idx ); ?>'">
										<?php echo esc_html( $accordion['content'] ); ?>
										<?php if ( isset( $accordion['link'] ) ) : ?>
											<a href="<?php echo esc_url( $accordion['link'] ); ?>"><?php echo esc_html( $accordion['link'] ); ?></a>
										<?php endif; ?>
									</p>
								</li>
							<?php endforeach; ?>
						</ul>
					</div>
				</div>
			</div>
		</div>
	</ccb-version-switch>
</div>
