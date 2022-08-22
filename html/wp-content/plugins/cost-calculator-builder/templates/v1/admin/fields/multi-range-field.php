<?php if ( ccb_pro_active() ) :
	do_action( 'render-multi-range' ); // phpcs:ignore
	?>
<?php else : ?>
	<div class="field-form-wrapper">
		<?php
		echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/pro-feature' ); //phpcs:ignore
		?>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
				<select>
					<option value="before"><?php esc_html_e( 'Show before field', 'cost-calculator-builder' ); ?></option>
					<option value="after"><?php esc_html_e( 'Show after field', 'cost-calculator-builder' ); ?></option>
				</select>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Minimum Range Value', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Min Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Maximum Range Value', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Max Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Range Step', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Step -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Default Start Value', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Default Left Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Default End Value', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Default Right Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Currency Symbol', 'cost-calculator-builder' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Sign -', 'cost-calculator-builder' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Range Unit', 'cost-calculator-builder-pro' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Unit -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
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
					<?php esc_html_e( 'Currency Symbol On Total Description', 'cost-calculator-builder' ); ?>
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
					<?php esc_html_e( 'Round Value', 'cost-calculator-builder' ); ?>
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
				<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder' ); ?></label>
				<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>"></textarea>
			</div>
		</div>
		<div class="actions">
			<div class="right">
				<button type="button" class="white">
					<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
				</button>
				<button type="button" class="green">
					<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
				</button>
			</div>
		</div>
	</div>
<?php endif; ?>
