<?php if ( ccb_pro_active() ) : ?>
	<?php do_action( 'render-date-picker' ); // phpcs:ignore ?>
<?php else : ?>
	<div class="field-form-wrapper">
		<?php
		echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/pro-feature' ); // phpcs:ignore
		?>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Name', 'cost-calculator-builder-pro' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder-pro' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description', 'cost-calculator-builder-pro' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder-pro' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder-pro' ); ?></label>
				<select>
					<option value="before"><?php esc_html_e( 'Show before field', 'cost-calculator-builder' ); ?></option>
					<option value="after"><?php esc_html_e( 'Show after field', 'cost-calculator-builder' ); ?></option>
				</select>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Placeholder', 'cost-calculator-builder-pro' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Placeholder -', 'cost-calculator-builder-pro' ); ?>">
			</div>
		</div>

		<div class="field-form-row">
			<div class="form-group large inline">
				<div class="ccb-switch">
					<input type="checkbox"/>
					<label></label>
				</div>
				<div class="ccb-switch-label">
					<?php esc_html_e( 'Required', 'cost-calculator-builder' ); ?>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large inline">
				<div class="ccb-switch">
					<input type="checkbox"/>
					<label></label>
				</div>
				<div class="ccb-switch-label">
					<?php esc_html_e( 'Toggle Datepicking restrictions', 'cost-calculator-builder' ); ?>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large inline">
				<div class="ccb-switch">
					<input type="checkbox"/>
					<label></label>
				</div>
				<div class="ccb-switch-label">
					<?php esc_html_e( 'Default hidden', 'cost-calculator-builder' ); ?>
				</div>
			</div>
		</div>

		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Calendar Option', 'cost-calculator-builder-pro' ); ?></label>
				<select>
					<option><?php esc_html_e( 'With range', 'cost-calculator-builder-pro' ); ?></option>
					<option><?php esc_html_e( 'No range', 'cost-calculator-builder-pro' ); ?></option>
				</select>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder-pro' ); ?></label>
				<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder-pro' ); ?>"></textarea>
			</div>
		</div>
		<div class="actions">
			<div class="right">
				<button type="button" class="white">
					<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder-pro' ); ?></span>
				</button>
				<button type="button" class="green">
					<span><?php esc_html_e( 'Save', 'cost-calculator-builder-pro' ); ?></span>
				</button>
			</div>
		</div>
	</div>
<?php endif; ?>
