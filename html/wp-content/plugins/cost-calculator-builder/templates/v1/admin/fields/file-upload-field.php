<?php if ( ccb_pro_active() ) :
	do_action( 'render-file-upload' ); // phpcs:ignore
	?>
<?php else : ?>
	<div class="field-form-wrapper file-upload">
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
			<div class="form-group medium">
				<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
				<select>
					<option value="before"><?php esc_html_e( 'Show before field', 'cost-calculator-builder' ); ?></option>
					<option value="after"><?php esc_html_e( 'Show after field', 'cost-calculator-builder' ); ?></option>
				</select>
			</div>
			<div class="form-group medium">
				<label><?php esc_attr_e( 'Maximum file size MB', 'cost-calculator-builder' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Maximum file size KB -', 'cost-calculator-builder' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label>
					<?php esc_attr_e( 'Supported file formats', 'cost-calculator-builder' ); ?>
				</label>
				<div class="multiselect">
					<span class="anchor">
						<?php esc_html_e( 'Select File formats', 'cost-calculator-builder' ); ?>
					</span>
				</div>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group medium">
				<label><?php esc_attr_e( 'Maximum attached files', 'cost-calculator-builder' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- Maximum attached files -', 'cost-calculator-builder' ); ?>" type="number" step="1">
					<span class="input-number-counter up"></span>
					<span class="input-number-counter down"></span>
				</div>
			</div>
			<div class="form-group medium">
				<label><?php esc_attr_e( 'File upload price$ (optional)', 'cost-calculator-builder' ); ?></label>
				<div class="input-type-number-wrapper">
					<input min="0" placeholder="<?php esc_attr_e( '- File upload price -', 'cost-calculator-builder' ); ?>" type="number" step="0.1">
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
