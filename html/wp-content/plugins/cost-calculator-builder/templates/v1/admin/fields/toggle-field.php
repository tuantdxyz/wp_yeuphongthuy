<?php
$pro_active = ccb_pro_active() ? '' : 'active';
?>
<div class="field-form-wrapper">
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>" v-model.trim="toggleField.label">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>" v-model.trim="toggleField.description">
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
			<select v-model="toggleField.desc_option">
				<option v-for="(value, key) in getDescOptions" :value="key">{{value}}</option>
			</select>
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="toggleField.allowCurrency"/>
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
				<input type="checkbox" v-model="toggleField.allowRound"/>
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
				<input type="checkbox" v-model="toggleField.required"/>
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
				<input type="checkbox" v-model="toggleField.hidden"/>
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
				<input type="checkbox" v-model="toggleField.horizontally_view"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Horizontal View', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>


	<div class="field-form-row options">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Toggle Options', 'cost-calculator-builder' ); ?></label>
		</div>
		<div class="form-group large inline add-options" v-for="(option, index) in toggleField.options">
			<div class="options">
				<input type="text" placeholder="<?php esc_attr_e( 'Option Label ...', 'cost-calculator-builder' ); ?>" v-model="option.optionText">
			</div>
			<div class="options">
				<div class="input-type-number-wrapper">
					<input :name="'option_' + index" @keyup="removeErrorTip('errorOptionValue' + index)" min="0" placeholder="<?php esc_attr_e( 'Option Value ...', 'cost-calculator-builder' ); ?>" type="number" step="1" v-model="option.optionValue" required>
					<span @click="numberCounterActionForOption(index)" class="input-number-counter up"></span>
					<span @click="numberCounterActionForOption(index, '-')" class="input-number-counter down"></span>
				</div>
				<span :id="'errorOptionValue' + index"></span>
			</div>
			<div class="options">
				<textarea v-model="option.optionHint" placeholder="<?php esc_attr_e( 'Option Hint ...', 'cost-calculator-builder' ); ?>"></textarea>
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
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="toggleField.additionalStyles"></textarea>
		</div>
	</div>

	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="save(toggleField, id, index, event)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
