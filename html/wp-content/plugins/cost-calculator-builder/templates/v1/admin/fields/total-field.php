<div class="field-form-wrapper">

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>" v-model.trim="totalField.label">
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_html_e( 'Calculator Formula', 'cost-calculator-builder' ); ?></label>
			<textarea v-model="totalField.costCalcFormula" :ref="'ccb-formula-' + totalField._id"></textarea>
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_html_e( 'Available Operators', 'cost-calculator-builder' ); ?></label>
			<div class="available-list">
				<span class="formula-title" title="Addition (+)" @click="insertAtCursor('+')">+</span>
				<span class="formula-title" title="Subtraction (-)" @click="insertAtCursor('-')">-</span>
				<span class="formula-title" title="Division (/)" @click="insertAtCursor('/')">/</span>
				<span class="formula-title" title="Remainder (%)" @click="insertAtCursor('%')">%</span>
				<span class="formula-title" title="Multiplication (*)" @click="insertAtCursor('*')">*</span>
				<span class="formula-title" title="Open bracket '('" @click="insertAtCursor('(')">(</span>
				<span class="formula-title" title="Close bracket ')'" @click="insertAtCursor(')')">)</span>
				<span class="formula-title" title="Math.round(x) returns the value of x rounded to its nearest integer:" @click="insertAtCursor('Math.round(')">round</span>
				<span class="formula-title" title="Math.pow(x, y) returns the value of x to the power of y:" @click="insertAtCursor('Math.pow(')">pow</span>
				<span class="formula-title" title="Math.sqrt(x) returns the square root of x:" @click="insertAtCursor('Math.sqrt(')">sqrt</span>
				<span class="formula-title" title="Math.abs(x) returns the absolute (positive) value of x:" @click="insertAtCursor('Math.abs(')">abs</span>
				<span class="formula-title" title="Math.ceil(x) returns the value of x rounded up to its nearest integer:" @click="insertAtCursor('Math.ceil(')">ceil</span>
				<span class="formula-title" title="Math.floor(x) returns the value of x rounded down to its nearest integer:" @click="insertAtCursor('Math.floor(')">floor</span>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_html_e( 'Available Fields', 'cost-calculator-builder' ); ?></label>
			<div class="available-list fields">
				<template v-if="available.length">
					<span :title="'This is available field'" class="available-item" v-for="(item, index) in available_fields" v-if="item.alias != 'total'" v-on:click="insertAtCursor(item.type === 'Total' ? '(' + item.alias + ')' : item.alias)">
						{{item.alias}}
					</span>
				</template>

				<template v-else>
					<p><?php esc_html_e( 'No Available fields yet!', 'cost-calculator-builder' ); ?></p>
				</template>

			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="totalField.totalSymbol"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Show Alternative Symbol', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>
	<div class="field-form-row" v-if="totalField.totalSymbol">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Alternative Symbol', 'cost-calculator-builder' ); ?></label>
			<input type="text" placeholder="<?php esc_attr_e( 'Set Alternative Symbol...', 'cost-calculator-builder' ); ?>" v-model="totalField.totalSymbolSign">
		</div>
	</div>

	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="totalField.hidden"/>
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
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="totalField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="$emit( 'save', totalField, id, index)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
			</button>
		</div>
	</div>
</div>
