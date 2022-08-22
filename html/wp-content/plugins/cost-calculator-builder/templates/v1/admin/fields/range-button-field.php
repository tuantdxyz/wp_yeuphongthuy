<div class="field-form-wrapper">

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>" v-model.trim="rangeField.label">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>" v-model.trim="rangeField.description">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
			<select v-model="rangeField.desc_option">
				<option v-for="(value, key) in getDescOptions" :value="key">{{value}}</option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Minimum Range Value', 'cost-calculator-builder-pro' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="minValue" @input="errors.minValue=false" min="0" placeholder="<?php esc_attr_e( '- Min Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="rangeField.minValue">
				<span @click="numberCounterAction('minValue')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('minValue', '-')" class="input-number-counter down"></span>
			</div>
			<span class="error-tip" v-if="isObjectHasPath(errors, ['minValue'] ) && errors.minValue" v-html="errors.minValue"></span>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Maximum Range Value', 'cost-calculator-builder-pro' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="maxValue" @input="errors.maxValue=false" min="0" placeholder="<?php esc_attr_e( '- Max Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="rangeField.maxValue">
				<span @click="numberCounterAction('maxValue')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('maxValue', '-')" class="input-number-counter down"></span>
			</div>
			<span class="error-tip" v-if="isObjectHasPath(errors, ['maxValue'] ) && errors.maxValue" v-html="errors.maxValue"></span>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Range Step', 'cost-calculator-builder-pro' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="step" @input="errors.step=false" min="0" placeholder="<?php esc_attr_e( '- Step -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="rangeField.step">
				<span @click="numberCounterAction('step')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('step', '-')" class="input-number-counter down"></span>
			</div>
			<span class="error-tip" v-if="isObjectHasPath(errors, ['step'] ) && errors.step" v-html="errors.step"></span>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Range Default Value', 'cost-calculator-builder' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="default" min="0" placeholder="<?php esc_attr_e( '- Default Value -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="rangeField.default">
				<span @click="numberCounterAction('default')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('default', '-')" class="input-number-counter down"></span>
			</div>
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Currency Symbol', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Sign -', 'cost-calculator-builder' ); ?>" v-model.trim="rangeField.sign">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Range Unit', 'cost-calculator-builder-pro' ); ?></label>
			<div class="input-type-number-wrapper">
				<input name="unit" @input="errors.unit=false" min="0" placeholder="<?php esc_attr_e( '- Unit -', 'cost-calculator-builder-pro' ); ?>" type="number" step="1" v-model="rangeField.unit">
				<span @click="numberCounterAction('unit')" class="input-number-counter up"></span>
				<span @click="numberCounterAction('unit', '-')" class="input-number-counter down"></span>
			</div>
			<span class="error-tip" v-if="isObjectHasPath(errors, ['unit'] ) && errors.unit" v-html="errors.unit"></span>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="rangeField.allowCurrency"/>
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
				<input type="checkbox" v-model="rangeField.allowRound"/>
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
				<input type="checkbox" v-model="rangeField.hidden"/>
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
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="rangeField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="save(rangeField, id, index, event)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
