<?php
$ccb_pages = \cBuilder\Classes\CCBSettingsData::get_settings_pages();
if ( empty( $ccb_pages ) ) {
	return;
}
?>
<div class="ccb-page-content settings">
	<div class="settings-wrapper">
		<div class="ccb-settings-sidebar">
			<?php foreach ( $ccb_pages as $ccb_page ) : ?>
				<div class="ccb-sidebar-item" :class="{active: active_content === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'}" @click.prevent="active_content = '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
					<i class="<?php echo esc_attr( $ccb_page['icon'] ); ?>"></i>
					<p class=""><?php echo esc_html( $ccb_page['title'] ); ?></p>
					<i class="fas fa-chevron-right after"></i>
				</div>
			<?php endforeach; ?>
		</div>

		<div class="ccb-sidebar-content">
			<div class="ccb-sidebar-content-list" v-if="active_content === 'general'">
				<div class="list-row">

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Calculator Box Style', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.general.boxStyle">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Calculator Box Style -', 'cost-calculator-builder' ); ?></option>
							<option value="vertical"><?php esc_html_e( 'Vertical', 'cost-calculator-builder' ); ?></option>
							<option value="horizontal"><?php esc_html_e( 'Horizontal', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>

					<div class="list-subtitle"><?php esc_attr_e( 'Total Summary Settings', 'cost-calculator-builder' ); ?></div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Total Summary Appearance', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.general.descriptions">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Total Summary Appearance Option -', 'cost-calculator-builder' ); ?></option>
							<option value="show"><?php esc_html_e( 'show', 'cost-calculator-builder' ); ?></option>
							<option value="hide"><?php esc_html_e( 'hide', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Total Summary Title', 'cost-calculator-builder' ); ?></label>
						</div>
						<input type="text" v-model.trim="settingsField.general.header_title" placeholder="<?php esc_attr_e( '- Total Summary Header Title -', 'cost-calculator-builder' ); ?>">
					</div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Zero Values in Total Summary', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.general.hide_empty">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Zero Values in Total Summary option -', 'cost-calculator-builder' ); ?></option>
							<option value="show"><?php esc_html_e( 'show', 'cost-calculator-builder' ); ?></option>
							<option value="hide"><?php esc_html_e( 'hide', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>
				</div>
			</div>

			<div class="ccb-sidebar-content-list" v-if="active_content === 'currency'">
				<div class="list-row">
					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Currency Symbol', 'cost-calculator-builder' ); ?></label>
						</div>
						<input v-model="settingsField.currency.currency" type="text" placeholder="<?php esc_attr_e( '- Type Currency Symbol -', 'cost-calculator-builder' ); ?>">
					</div>
					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Currency Position', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.currency.currencyPosition">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Currency Position -', 'cost-calculator-builder' ); ?></option>
							<option value="left"><?php esc_html_e( 'Left', 'cost-calculator-builder' ); ?></option>
							<option value="right"><?php esc_html_e( 'Right', 'cost-calculator-builder' ); ?></option>
							<option value="left_with_space"><?php esc_html_e( 'Left with space', 'cost-calculator-builder' ); ?></option>
							<option value="right_with_space"><?php esc_html_e( 'Right with space', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Thousands Separator', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.currency.thousands_separator">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Decimal Separator -', 'cost-calculator-builder' ); ?></option>
							<option value=","><?php esc_html_e( ' Comma ', 'cost-calculator-builder' ); ?></option>
							<option value="."><?php esc_html_e( ' Dot ', 'cost-calculator-builder' ); ?></option>
							<option value="'"><?php esc_html_e( ' Apostrophe ', 'cost-calculator-builder' ); ?></option>
							<option value=" "><?php esc_html_e( ' Space ', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Decimal Separator', 'cost-calculator-builder' ); ?></label>
						</div>
						<select v-model="settingsField.currency.decimal_separator">
							<option value="" selected
									disabled><?php esc_html_e( '- Select Decimal Separator -', 'cost-calculator-builder' ); ?></option>
							<option value=","><?php esc_html_e( ' Comma ', 'cost-calculator-builder' ); ?></option>
							<option value="."><?php esc_html_e( ' Dot ', 'cost-calculator-builder' ); ?></option>
						</select>
					</div>

					<div class="list-content">
						<div class="list-content-label">
							<label><?php esc_attr_e( 'Number of Decimals', 'cost-calculator-builder' ); ?></label>
						</div>
						<input min="0" max="8" type="number" v-model="settingsField.currency.num_after_integer" placeholder="<?php esc_attr_e( '- Type Number of Decimals -', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>

			<?php foreach ( $ccb_pages as $ccb_page ) : ?>
				<?php if ( ! empty( $ccb_page['file'] ) ) : ?>
					<div class="ccb-sidebar-content-list" v-if="active_content === '<?php echo esc_attr( $ccb_page['slug'] ); ?>'">
						<?php
						echo \cBuilder\Classes\CCBTemplate::load( 'admin/settings/' . $ccb_page['file'] ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
						?>
					</div>
				<?php endif; ?>
			<?php endforeach; ?>
		</div>
	</div>
</div>
