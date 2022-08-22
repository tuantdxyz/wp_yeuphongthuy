<div class="field-form-wrapper">
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'HTML5 Code', 'cost-calculator-builder-pro' ); ?></label>
			<textarea v-model="htmlField.htmlContent" placeholder="<?php esc_attr_e( 'Enter your HTML5 Code', 'cost-calculator-builder-pro' ); ?>"></textarea>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large inline">
			<div class="ccb-switch">
				<input type="checkbox" v-model="htmlField.hidden"/>
				<label></label>
			</div>
			<div class="ccb-switch-label">
				<?php esc_html_e( 'Default hidden', 'cost-calculator-builder' ); ?>
			</div>
		</div>
	</div>
	<div class="field-form-row">
		<div class="form-group large">
			<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder-pro' ); ?></label>
			<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder-pro' ); ?>" v-model="htmlField.additionalStyles"></textarea>
		</div>
	</div>
	<div class="actions">
		<div class="right">
			<button type="button" class="white" @click="$emit( 'cancel' )">
				<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder-pro' ); ?></span>
			</button>
			<button type="button" class="green" @click.prevent="$emit( 'save', htmlField, id, index)">
				<span><?php esc_html_e( 'Save', 'cost-calculator-builder-pro' ); ?></span>
			</button>
		</div>
	</div>
</div>
