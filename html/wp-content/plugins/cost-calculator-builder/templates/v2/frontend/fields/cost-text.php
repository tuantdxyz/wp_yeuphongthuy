<?php
/**
 * @file
 * Cost-text component's template
 */
?>

<div :style="additionalCss" class="calc-item" :class="textField.additionalStyles" :data-id="textField.alias">
	<div class="calc-item__title">
		<span>{{ textField.label }}</span>
	</div>

	<div class="calc-item__description before">
		<span>{{ textField.description }}</span>
	</div>

	<textarea v-model="textareaValue" @change="onChange" :id="labelId" :placeholder="textField.placeholder" :class="['calc-textarea ccb-appearance-field', {'calc-field-disabled': getStep === 'finish'}]"></textarea>

	<div class="calc-item__description after">
		<span>{{ textField.description }}</span>
	</div>
</div>
