<?php
/**
 * @file
 * Cost-toggle component's template
 */
?>

<div :style="additionalCss" class="calc-item ccb-field" :class="{required: $store.getters.isUnused(toggleField), [toggleField.additionalStyles]: toggleField.additionalStyles}" :data-id="toggleField.alias">
	<div class="calc-item__title">
		<span> {{ toggleField.label }} </span>
		<span class="ccb-required-mark" v-if="toggleField.required">*</span>
		<span v-if="toggleField.required" class="calc-required-field">
			<div class="ccb-field-required-tooltip">
				<span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(toggleField)}" style="display: none;">{{ $store.getters.getSettings.texts.required_msg }}</span>
			</div>
		</span>
	</div>

	<div class="calc-item__description before">
		<span>{{ toggleField.description }}</span>
	</div>

	<div :class="['calc-toggle-container', 'calc_' + toggleField.alias, toggleView, {'calc-field-disabled': getStep === 'finish'}]">
		<div class="calc-toggle-item" v-for="( element, index ) in getOptions">
			<div class="calc-toggle-label-wrap">
				<span class="calc-toggle-label">{{ element.label }}</span>
			</div>
			<div class="calc-toggle-postfix">
				<span class="ccb-checkbox-hint" v-if="element.hint">
					<i class="ccb-icon-Path-3367"></i>
					<span class="ccb-checkbox-hint__content">{{ element.hint }}</span>
				</span>
			</div>
			<div class="calc-toggle-wrapper">
				<input type="checkbox" :value="element.value" @change="change(event, element.label)"/>
				<label></label>
			</div>
		</div>
	</div>

	<div class="calc-item__description after">
		<span>{{ toggleField.description }}</span>
	</div>
</div>
