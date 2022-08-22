<?php
/**
 * @file
 * Cost-quantity component's template
 */
?>
<div :style="additionalCss" class="calc-item" :class="rangeField.additionalStyles" :data-id="rangeField.alias" >
	<div class="calc-range" :class="['calc_' + rangeField.alias, {'calc-field-disabled': getStep === 'finish'}]">
		<div class="calc-item__title ccb-range-field">
			<span> {{ rangeField.label }} </span>
			<span> {{ getFormatedValue }} {{ rangeField.sign ? rangeField.sign : '' }}</span>
		</div>

		<div class="calc-item__description before">
			<span>{{ rangeField.description }}</span>
		</div>

		<div :class="['range_' + rangeField.alias]"></div>

		<div class="calc-item__description after">
			<span>{{ rangeField.description }}</span>
		</div>
	</div>
</div>
