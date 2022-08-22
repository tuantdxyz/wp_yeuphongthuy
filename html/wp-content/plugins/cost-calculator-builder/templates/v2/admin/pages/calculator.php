<div class="ccb-tab-sections">
	<calculators-list
		inline-template
		v-if="step === 'list'"
		@edit-calc="editCalc"
	>
		<?php require_once CALC_PATH . '/templates/v2/admin/single-calc/calculator-list.php'; ?>
	</calculators-list>
	<calculators-tab
			inline-template
			:key="calcId"
			:id="calcId"
			v-if="step === 'create'"
			@edit-calc="editCalc"
	>
		<?php require_once CALC_PATH . '/templates/v2/admin/single-calc/tab.php'; ?>
	</calculators-tab>
	<ccb-demo-import
			inline-template
			v-if="step === 'demo-import'"
			@edit-calc="editCalc"
	>
		<?php require_once CALC_PATH . '/templates/v2/admin/components/demo-import.php'; ?>
	</ccb-demo-import>
</div>
