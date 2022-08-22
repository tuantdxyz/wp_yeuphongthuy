<?php
$pro_active = ccb_pro_active() ? '' : 'active';
?>
<div class="field-form-wrapper">

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>" v-model.trim="radioField.label">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>" v-model.trim="radioField.description">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
			<select v-model="radioField.desc_option">
				<option v-for="(value, key) in getDescOptions" :value="key">{{value}}</option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Default Value', 'cost-calculator-builder' ); ?></label>
			<select v-model="radioField.default">
				<option value="" selected><?php esc_html_e( '- Select A Default Value -', 'cost-calculator-builder' ); ?></option>
				<option v-for="(value, index) in options" :key="index" :value="value.optionValue + '_' + index">{{value.optionText}}</option>
			</select>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="radioField.allowCurrency"/>
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
				<input type="checkbox" v-model="radioField.allowRound"/>
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
				<input type="checkbox" v-model="radioField.required"/>
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
				<input type="checkbox" v-model="radioField.hidden"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Default hidden', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="radioField.horizontally_view"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Horizontal View', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>

	<div class="field-form-row options">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Radio Options', 'cost-calculator-builder' ); ?></label>
		</div>
		<div class="form-group large inline add-options" v-for="(option, index) in radioField.options">
			<div class="options dd-options">
				<input type="text" placeholder="<?php esc_attr_e( 'Option Label ...', 'cost-calculator-builder' ); ?>" v-model="option.optionText">
			</div>
			<div class="options dd-options">
				<div class="input-type-number-wrapper">
					<input :name="'option_' + index" @keyup="removeErrorTip('errorOptionValue' + index)" min="0" placeholder="<?php esc_attr_e( 'Option Value ...', 'cost-calculator-builder' ); ?>" type="number" step="1" v-model="option.optionValue" required>
					<span @click="numberCounterActionForOption(index)" class="input-number-counter up"></span>
					<span @click="numberCounterActionForOption(index, '-')" class="input-number-counter down"></span>
				</div>
				<span :id="'errorOptionValue' + index"></span>
			</div>
			<div class="delete-option" @click.prevent="removeOption(index, option.optionValue)">
				<span>
					<i class="fas fa-trash-alt"></i>
				</span>
			</div>
		</div>
		<div class="form-group small">
			<button type="button" class="green" @click="addOption">
				<i class="fas fa-plus"></i>
				<span><?php esc_html_e( 'Add Row', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder' ); ?></label>
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="radioField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="save(radioField, id, index, event)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
