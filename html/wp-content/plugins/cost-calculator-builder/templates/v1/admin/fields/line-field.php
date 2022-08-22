<div class="field-form-wrapper">

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Line Size', 'cost-calculator-builder' ); ?></label>
			<select v-model="lineField.size">
				<option value="" selected><?php esc_html_e( '- Select Size -', 'cost-calculator-builder' ); ?></option>
				<option value="1px"><?php esc_html_e( 'small', 'cost-calculator-builder' ); ?></option>
				<option value="2px"><?php esc_html_e( 'medium', 'cost-calculator-builder' ); ?></option>
				<option value="4px"><?php esc_html_e( 'large', 'cost-calculator-builder' ); ?></option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Line Style', 'cost-calculator-builder' ); ?></label>
			<select v-model="lineField.style">
				<option value="" selected><?php esc_html_e( '- Select Style -', 'cost-calculator-builder' ); ?></option>
				<option value="solid"><?php esc_html_e( 'solid', 'cost-calculator-builder' ); ?></option>
				<option value="dashed"><?php esc_html_e( 'dashed', 'cost-calculator-builder' ); ?></option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Line Length', 'cost-calculator-builder' ); ?></label>
			<select v-model="lineField.len">
				<option value="" selected><?php esc_html_e( '- Select length -', 'cost-calculator-builder' ); ?></option>
				<option value="25%"><?php esc_html_e( 'short', 'cost-calculator-builder' ); ?></option>
				<option value="50%"><?php esc_html_e( 'medium', 'cost-calculator-builder' ); ?></option>
				<option value="100%"><?php esc_html_e( 'long', 'cost-calculator-builder' ); ?></option>
			</select>
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="lineField.hidden"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Default hidden', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder-pro' ); ?></label>
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder-pro' ); ?>" v-model="lineField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="$emit( 'save', lineField, id, index)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
