<div class="field-form-wrapper">

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>" v-model.trim="textField.label">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Placeholder', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Placeholder -', 'cost-calculator-builder' ); ?>" v-model="textField.placeholder">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>" v-model="textField.description">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
			<select v-model="textField.desc_option">
				<option v-for="(value, key) in getDescOptions" :value="key">{{value}}</option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="textField.hidden"/>
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
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="textField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="$emit( 'save', textField, id, index)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
