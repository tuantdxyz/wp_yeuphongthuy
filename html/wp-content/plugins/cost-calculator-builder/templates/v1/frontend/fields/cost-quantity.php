<?php
/**
 * @file
 * Cost-quantity component's template
 */
?>
<div :style="additionalCss" class="calc-item ccb-field ccb-field-quantity" :class="{required: $store.getters.isUnused(quantityField), [quantityField.additionalStyles]: quantityField.additionalStyles}" v-if="Object.keys($store.getters.getCustomStyles).length" :data-id="quantityField.alias">

	<div class="calc-item__title" :style="$store.getters.getCustomStyles['labels']">
		<span> {{ quantityField.label }} </span>
		<span v-if="quantityField.required" class="calc-required-field">
			*
			<div class="ccb-field-required-tooltip">
				<span class="ccb-field-required-tooltip-text" :class="{active: $store.getters.isUnused(quantityField)}" style="display: none;">{{ $store.getters.getSettings.notice.requiredField }}</span>
			</div>
		</span>
	</div>

	<p v-if="quantityField.desc_option == 'before'" class="calc-description" :style="$store.getters.getCustomStyles['descriptions']">{{ quantityField.description }}</p>

	<div class="calc-input-wrapper ccb-field" :class="'calc_' + quantityField.alias">
		<input @focusout="parseField" @keypress="intValueFilter($event)" name="quantityField" type="text" v-model="quantityValue" :placeholder="quantityField.placeholder" class="calc-input number ccb-field vertical" :style="inputStyles">
		<span @click.prevent="increment()" class="ccb-arrow-up ccb-arrow"></span>
		<span @click.prevent="decrement()" class="ccb-arrow-down ccb-arrow"></span>
	</div>

	<p v-if="quantityField.desc_option === undefined || quantityField.desc_option == 'after'" class="calc-description" :style="$store.getters.getCustomStyles['descriptions']">{{ quantityField.description }}</p>
</div>
