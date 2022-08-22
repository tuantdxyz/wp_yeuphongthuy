<?php
$pro_active = ccb_pro_active() ? '' : 'active';
?>
<div class="field-form-wrapper">
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder-pro' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder-pro' ); ?>" v-model.trim="quantityField.label">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description', 'cost-calculator-builder-pro' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder-pro' ); ?>" v-model.trim="quantityField.description">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
			<select v-model="quantityField.desc_option">
				<option v-for="(value, key) in getDescOptions" :value="key">{{value}}</option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Step', 'cost-calculator-builder-pro' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="step" min="0" placeholder="<?php esc_attr_e( '- Step -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="quantityField.step">
				<span @click="numberCounterAction('step')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('step', '-')" class="input-number-counter down"></span>
			</div>
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Placeholder', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Placeholder -', 'cost-calculator-builder' ); ?>" v-model.trim="quantityField.placeholder">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Default Value', 'cost-calculator-builder' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="default" min="0" placeholder="<?php esc_attr_e( '- Default Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="quantityField.default">
				<span @click="numberCounterAction('default')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('default', '-')" class="input-number-counter down"></span>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Quantity Unit', 'cost-calculator-builder' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="unit" @input="errors.unit=false" min="0" placeholder="<?php esc_attr_e( '- Unit -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="quantityField.unit">
				<span @click="numberCounterAction('unit')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('unit', '-')" class="input-number-counter down"></span>
			</div>
			<span class="error-tip" v-if="isObjectHasPath(errors, ['unit'] ) && errors.unit" v-html="errors.unit"></span>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="quantityField.allowCurrency"/>
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
				<input type="checkbox" v-model="quantityField.enabled_currency_settings"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Enable currency settings', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="quantityField.allowRound"/>
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
				<input type="checkbox" v-model="quantityField.required"/>
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
				<input type="checkbox" v-model="quantityField.hidden"/>
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
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="quantityField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="save(quantityField, id, index, event)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
