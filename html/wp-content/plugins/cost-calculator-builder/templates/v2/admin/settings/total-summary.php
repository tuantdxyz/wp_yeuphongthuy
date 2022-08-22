<div class="ccb-tab-container">
	<div class="ccb-grid-box">
		<div class="container">
			<div class="row ccb-p-t-15 ccb-p-b-15">
				<div class="col-12">
					<span class="ccb-tab-title"><?php esc_html_e( 'Grand Total', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="col-12">
					<span class="ccb-tab-description"><?php esc_html_e( 'The section is for setting up the Grand Total along with the additional values to be displayed.', 'cost-calculator-builder' ); ?></span>
				</div>
			</div>
			<div class="row">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.descriptions"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-10">
				<div class="col">
					<div class="list-header">
						<div class="ccb-switch">
							<input type="checkbox" v-model="settingsField.general.hide_empty"/>
							<label></label>
						</div>
						<h6 class="ccb-heading-5"><?php esc_html_e( 'Zero Values in Grand Total', 'cost-calculator-builder' ); ?></h6>
					</div>
				</div>
			</div>
			<div class="row ccb-p-t-15">
				<div class="col col-3">
					<div class="ccb-input-wrapper">
						<span class="ccb-input-label"><?php esc_html_e( 'Grand Total Title', 'cost-calculator-builder' ); ?></span>
						<input type="text" v-model.trim="settingsField.general.header_title" placeholder="<?php esc_attr_e( 'Summary', 'cost-calculator-builder' ); ?>">
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
