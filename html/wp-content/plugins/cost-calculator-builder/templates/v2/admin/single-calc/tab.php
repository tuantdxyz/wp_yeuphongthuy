<?php
$calc_tabs = \cBuilder\Classes\CCBSettingsData::get_tab_data();
?>

<div class="ccb-tab-sections" :class="{'ccb-loader-inner-section': preloader}">
	<div class="ccb-calculator-tab" v-if="preloader">
		<loader></loader>
	</div>
	<div class="ccb-calculator-tab" v-show="!preloader">
		<div class="ccb-tab-sections-header" style="position: relative">
			<div style="width: 100%; display: flex; justify-content: space-between">
				<div class="ccb-header-left">
					<span class="ccb-back-container">
						<span class="ccb-back-wrap" @click="back">
							<i class="ccb-icon-Path-3398"></i>
						</span>
						<span class="ccb-back-to-text" @click="back">
							<span><?php esc_html_e( 'Back to calculators', 'cost-calculator-builder' ); ?></span>
						</span>
					</span>
					<span class="ccb-calc-title" v-if="!editable">
						<span class="ccb-title" @click="editable = true">{{ title | to-short }}</span>
						<i class="ccb-title-edit ccb-icon-Path-3483" @click="editable = true"></i>
					</span>
					<span class="ccb-calc-title" v-else>
						<input type="text" class="ccb-title" v-model="title" @blur="editTitle">
						<i class="ccb-title-approve ccb-icon-Path-3484" @click="editable = false"></i>
					</span>
				</div>
				<div class="ccb-header-right">
					<button class="ccb-button default" @click="previewMode"><?php esc_html_e( 'Preview', 'cost-calculator-builder' ); ?></button>
					<button class="ccb-button success" @click="saveSettings"><?php esc_html_e( 'Save', 'cost-calculator-builder' ); ?></button>
				</div>
			</div>
			<div class="ccb-header-center">
				<div class="ccb-header-short-code" v-if="!newCalc">
					<span class="ccb-header-short-code-title"><?php esc_html_e( 'Shortcode:', 'cost-calculator-builder' ); ?> </span>
					<span class="ccb-short-code-copy">
						<span class="code">[stm-calc id="{{ $store.getters.getId }}"]</span>
						<span class="ccb-copy-icon ccb-icon-Path-3400 ccb-tooltip"  @click.prevent="copyShortCode($store.getters.getId)" @mouseleave="resetCopy">
							<span class="ccb-tooltip-text ccb-header-tooltip" :class="{[shortCode.className]: true}">{{ shortCode.text }}</span>
							<input type="hidden" class="calc-short-code" :data-id="$store.getters.getId" :value='`[stm-calc id="` + $store.getters.getId +`"]`'>
						</span>
					</span>
				</div>
			</div>
		</div>
		<div class="ccb-calculator-tab-header">
			<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
				<span class="ccb-calculator-tab-header-label" :class="{active: '<?php echo esc_attr( $c_file ); ?>' === currentTab}" @click="setTab('<?php echo esc_attr( $c_file ); ?>')">
					<i class="<?php echo esc_attr( $c_tab['icon'] ); ?>"></i>
					<span class="ccb-heading-5"><?php echo esc_html( $c_tab['label'] ); ?></span>
				</span>
			<?php endforeach; ?>
		</div>
		<div class="ccb-calculator-tab-content">
			<?php foreach ( $calc_tabs as $c_file => $c_tab ) : ?>
				<div class="ccb-calculator-tab-page">
					<keep-alive>
						<component
								inline-template
								ref="<?php echo esc_attr( $c_file ); ?>"
								:is="getActiveTab"
								v-if="'<?php echo esc_attr( $c_file ); ?>' === currentTab"
						>
							<?php require_once CALC_PATH . '/templates/v2/admin/single-calc/' . $c_file . '.php'; ?>
						</component>
					</keep-alive>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</div>
