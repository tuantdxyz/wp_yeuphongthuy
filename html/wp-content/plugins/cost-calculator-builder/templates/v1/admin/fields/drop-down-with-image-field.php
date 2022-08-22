<?php if ( ccb_pro_active() ) :
	do_action( 'render-drop-down-with-img' ); // phpcs:ignore
	?>
<?php else : ?>
	<div class="field-form-wrapper drop-down-with-image">
		<?php
		echo \cBuilder\Classes\CCBTemplate::load( '/admin/partials/pro-feature' ); //phpcs:ignore
		?>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Name', 'cost-calculator-builder' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Label -', 'cost-calculator-builder' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description', 'cost-calculator-builder' ); ?></label>
				<input type="text" placeholder="<?php esc_attr_e( '- Field Description -', 'cost-calculator-builder' ); ?>">
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Description position', 'cost-calculator-builder' ); ?></label>
				<select>
					<option value="before" selected><?php esc_html_e( 'Show before field', 'cost-calculator-builder' ); ?></option>
					<option value="after"><?php esc_html_e( 'Show after field', 'cost-calculator-builder' ); ?></option>
				</select>
			</div>
		</div>
		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Default Value', 'cost-calculator-builder' ); ?></label>
				<select>
					<option value="" selected><?php esc_html_e( '- Select A Default Value -', 'cost-calculator-builder' ); ?></option>
				</select>
			</div>
		</div>

		<div class="field-form-row">
			<div class="form-group large inline">
				<div class="ccb-switch">
					<input type="checkbox"/>
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
					<input type="checkbox"/>
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
					<input type="checkbox"/>
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
					<input type="checkbox"/>
					<label></label>
				</div>
				<div class="ccb-switch-label">
					<?php esc_html_e( 'Default hidden', 'cost-calculator-builder' ); ?>
				</div>
			</div>
		</div>

		<div class="field-form-row options">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Drop Down With Image Options', 'cost-calculator-builder' ); ?></label>
			</div>
			<div class="form-group large inline add-options with-img" v-for="(option, index) in dropField.options">
				<div class="options dd-options">
					<input type="text" placeholder="<?php esc_attr_e( 'Option Label ...', 'cost-calculator-builder' ); ?>" v-model="option.optionText">
				</div>
				<div class="options dd-options">
					<div class="input-type-number-wrapper">
						<input @keyup="removeErrorTip('errorOptionValue' + index)" min="0" placeholder="<?php esc_attr_e( 'Option Value ...', 'cost-calculator-builder' ); ?>" type="number" step="1" v-model="option.optionValue" required>
						<span onclick="this.parentNode.querySelector('input[type=number]').stepUp();" class="input-number-counter up"></span>
						<span onclick="this.parentNode.querySelector('input[type=number]').stepDown()" class="input-number-counter down"></span>
					</div>
					<span :id="'errorOptionValue' + index"></span>
				</div>

				<img-selector :key="option.id" @set="setThumbnail" :index="index" :url="option.src"></img-selector>

				<div class="delete-option">
					<span>
						<i class="fas fa-trash-alt"></i>
					</span>
				</div>
			</div>
			<div class="form-group small">
				<button type="button" class="green">
					<i class="fas fa-plus"></i>
					<span><?php esc_html_e( 'Add Row', 'cost-calculator-builder' ); ?></span>
				</button>
			</div>
		</div>

		<div class="field-form-row">
			<div class="form-group large">
				<label><?php esc_attr_e( 'Additional classes', 'cost-calculator-builder' ); ?></label>
				<textarea placeholder="<?php esc_attr_e( 'Enter your classes', 'cost-calculator-builder' ); ?>" v-model="dropField.additionalStyles"></textarea>
			</div>
		</div>
		<div class="actions">
			<div class="right">
				<button type="button" class="white" @click="$emit( 'cancel' )">
					<span><?php esc_html_e( 'Cancel', 'cost-calculator-builder' ); ?></span>
				</button>
				<button type="button" class="green">
					<span><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></span>
				</button>
			</div>
		</div>
	</div>
<?php endif; ?>
