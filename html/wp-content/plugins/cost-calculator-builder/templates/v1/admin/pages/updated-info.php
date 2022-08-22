<div class="ccb-upgrade-pro">
	<script>
		window.addEventListener('click', e => {
			const classList = ['ccb-upgrade-pro--video-box-button', 'fa fa-play']
			if ( classList.includes(e.target.className) ) {
				document.querySelector('.ccb-update-video').setAttribute('src', 'https://www.youtube.com/watch?v=KGEEX69NLAc?rel=0&autoplay=1')
				document.querySelector('.ccb-upgrade-pro--video-box').classList.add('active')
			}
		})
	</script>
	<div class="ccb-upgrade-pro--container" style="max-width: 600px">
		<div class="ccb-upgrade-pro--logo">
			<img src="<?php echo esc_attr( CALC_URL . '/frontend/v2/dist/img/calc.png' ); ?>" alt="logo">
		</div>
		<div class="ccb-upgrade-pro--title-box">
			<span><?php esc_html_e( 'Cost Calculator updated!', 'cost-calculator-builder' ); ?></span>
		</div>
		<div class="ccb-upgrade-pro--description-box">
			<span><?php esc_html_e( 'We did our best to delight you. Check out the new features and feel the difference.', 'cost-calculator-builder' ); ?></span>
		</div>
		<div class="ccb-upgrade-pro--video-box">
			<div class="ccb-upgrade-pro--video-box-preview">
				<img src="<?php echo esc_url( CALC_URL . '/images/preview.png' ); ?>" alt="Cost Calculator Builder">
				<span class="ccb-upgrade-pro--video-box-button" >
					<i class="fa fa-play"></i>
				</span>
			</div>
			<div class="ccb-upgrade-pro--video-box-iframe">
				<iframe width="100%" height="100%" class="ccb-update-video" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
			</div>
		</div>
		<div class="ccb-upgrade-pro--feature-box">
			<span>
				<img src="<?php echo esc_url( CALC_URL . '/frontend/v2/dist/img/success.png' ); ?>" alt="success">
				<span><?php esc_html_e( 'All-new frontend UI kit', 'cost-calculator-builder' ); ?></span>
			</span>
			<span>
				<img src="<?php echo esc_url( CALC_URL . '/frontend/v2/dist/img/success.png' ); ?>" alt="success">
				<span><?php esc_html_e( 'Remastered calculator builder', 'cost-calculator-builder' ); ?></span>
			</span>
			<span>
				<img src="<?php echo esc_url( CALC_URL . '/frontend/v2/dist/img/success.png' ); ?>" alt="success">
				<span><?php esc_html_e( 'Easy-to-use appearance editor', 'cost-calculator-builder' ); ?></span>
			</span>
		</div>
		<div class="ccb-upgrade-pro--action-box">
			<a class="ccb-button ccb-href default" href="https://stylemixthemes.com/wp/something-big-is-coming-meet-all-new-cost-calculator/" target="_blank"><?php esc_html_e( 'Learn more', 'cost-calculator-builder' ); ?></a>
			<a class="ccb-button ccb-href success next-btn" href="<?php echo esc_url( admin_url( 'admin.php?page=cost_calculator_version_switch&update_info=1' ) ); ?>"><?php esc_html_e( 'Next', 'cost-calculator-builder' ); ?></a>
		</div>
	</div>
</div>
