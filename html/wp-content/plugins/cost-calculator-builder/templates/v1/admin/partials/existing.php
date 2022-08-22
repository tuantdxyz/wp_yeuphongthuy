<div class="existing-header">
	<div class="existing-header__title">
		<i class="fas fa-stream"></i>
		<h4><?php esc_html_e( 'My Calculators', 'cost-calculator-builder' ); ?></h4>
	</div>
	<div class="list-row calc-actions">
		<div class="list-content ccb-flex">
			<button type="button" class="green green-disabled ccb-tooltip">
				<div class="disabled">
					<i class="fas fa-file-import"></i>
					<span><?php esc_html_e( 'Import calculators', 'cost-calculator-builder' ); ?></span>
				</div>
				<span class="ccb-tooltip-text"><?php esc_html_e( 'Import is not available in this version', 'cost-calculator-builder' ); ?></span>
			</button>

			<a class="white white-disabled ccb-tooltip" style="margin-left: 20px;" v-if="$store.getters.getExisting.length">
				<div class="disabled">
					<i class="fas fa-file-export"></i>
					<span><?php esc_html_e( 'Export calculators', 'cost-calculator-builder' ); ?></span>
				</div>
				<span class="ccb-tooltip-text" style="color: #fff !important;"><?php esc_html_e( 'Export is not available in this version', 'cost-calculator-builder' ); ?></span>
			</a>
		</div>
	</div>
</div>
<div class="existing-body">
	<template v-if="$store.getters.getIsExisting">
		<div class="existing-wrapper">
			<div class="existing-list header">
				<div class="list-title id"><?php esc_html_e( 'id', 'cost-calculator-builder' ); ?></div>
				<div class="list-title checkbox">
					<input type="checkbox" name="bulkCalculator" @click="checkAllCalculatorsAction"/></div>
				<div class="list-title title"><?php esc_html_e( 'calculator name', 'cost-calculator-builder' ); ?></div>
				<div class="list-title shortcode"><?php esc_html_e( 'shortcode', 'cost-calculator-builder' ); ?></div>
				<div class="list-title actions"><?php esc_html_e( 'action', 'cost-calculator-builder' ); ?></div>
			</div>
			<div :class="['existing-list', {'animated': duplicated_id == calc.id}]" v-for="(calc, id) in $store.getters.getExisting">
				<div class="list-title id">{{ calc.id }}</div>
				<div class="list-title checkbox">
					<input type="checkbox" name="bulkCalculator" :checked="checkedCalculatorIds.includes(calc.id)" :value="calc.id" @click="checkCalculatorAction(calc.id)"/>
				</div>
				<div class="list-title title" v-html="calc.project_name"></div>
				<div class="list-title shortcode">
					<div class="ccb-tooltip" @click.prevent="copyText(calc.id)" @mouseleave="copy.text = 'Copy'">
						<span>[stm-calc id="{{ calc.id }}"]</span>
						<span class="ccb-tooltip-text">{{ copy.text }}</span>
						<input :type="copy.type" class="calc-short-code" :data-id="calc.id" :value='`[stm-calc id="` + calc.id +`"]`'>
					</div>
				</div>
				<div class="list-title actions">

					<?php $url = esc_url( get_admin_url() . 'admin.php?page=cost_calculator_builder&action=edit&id=' ); ?>

					<div class="ccb-tooltip action" @click="editCalc('<?php echo esc_attr( $url ); ?>' + calc.id)">
						<i class="fas fa-pencil-alt"></i>
						<span class="ccb-tooltip-text"><?php esc_html_e( 'Edit', 'cost-calculator-builder' ); ?></span>
					</div>

					<div class="ccb-tooltip action" @click.prevent="duplicateCalc(calc.id)">
						<i class="fas fa-copy"></i>
						<span class="ccb-tooltip-text"><?php esc_html_e( 'Duplicate', 'cost-calculator-builder' ); ?></span>
					</div>

					<div class="ccb-tooltip action" @click.prevent="deleteCalc(calc.id)">
						<i class="fas fa-trash-alt"></i>
						<span class="ccb-tooltip-text"><?php esc_html_e( 'Delete', 'cost-calculator-builder' ); ?></span>
					</div>

				</div>
			</div>
			<p v-if="!$store.getters.getExisting.length" style="text-align: center; font-size: 17px; margin: 100px auto"><?php esc_html_e( 'No Calculators yet! Please create new or Import Calculators.', 'cost-calculator-builder' ); ?></p>
		</div>
	</template>
</div>

<div class="existing-footer" v-if="$store.getters.getIsExisting">
	<div class="bulk-actions" v-if="$store.getters.getExisting.length > 0">
		<select name="actionType" id="actionType">
			<option value="-1"><?php esc_html_e( 'Bulk actions', 'cost-calculator-builder' ); ?></option>
			<option value="duplicate" class="hide-if-no-js"><?php esc_html_e( 'Duplicate', 'cost-calculator-builder' ); ?></option>
			<option value="delete"><?php esc_html_e( 'Delete', 'cost-calculator-builder' ); ?></option>
		</select>
		<button type="button" class="green" @click.prevent="bulkAction"><?php esc_html_e( 'Apply', 'cost-calculator-builder' ); ?></button>
	</div>
</div>
