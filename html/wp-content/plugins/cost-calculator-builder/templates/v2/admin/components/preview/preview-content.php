<?php
$default_img = CALC_URL . '/frontend/v2/dist/img/default.png';

?>

<calc-builder-front :key="getFieldsKey" :custom="1" :content="{...preview_data, default_img: '<?php echo esc_attr( $default_img ); ?>'}" inline-template :id="getId">
	<div :class="'ccb-wrapper-' + getId">
		<div ref="calc" :class="['calc-container', {[boxStyle]: preview !== 'mobile'}]" :data-calc-id="getId">
			<loader v-if="loader"></loader>
			<template>
				<div class="calc-fields calc-list" :class="{loaded: !loader, 'payment' :  getHideCalc}" v-if="!loader">
					<div class="calc-list-inner">
						<div class="calc-item-title">
							<h2> {{ getTitle }} </h2>
						</div>
						<div v-if="calc_data" class="calc-fields-container">
							<template v-for="field in calc_data.fields">
								<template v-if="field && field.alias && field.type !== 'Total'">
									<component
											text-days="<?php esc_attr_e( 'days', 'cost-calculator-builder' ); ?>"
											v-if="fields[field.alias]"
											:is="field._tag"
											:id="calc_data.id"
											:field="field"
											v-model="fields[field.alias].value"
											v-on:[field._event]="change"
											v-on:condition-apply="renderCondition"
									>
									</component>
								</template>
								<template v-else-if="field && !field.alias && field.type !== 'Total'">
									<component
											:id="calc_data.id"
											style="boxStyle"
											:is="field._tag"
											:field="field"
									>
									</component>
								</template>
							</template>
						</div>
					</div>
				</div>
				<div class="calc-subtotal calc-list" :class="{loaded: !loader}">
					<div class="calc-list-inner">
						<div class="calc-item-title calc-accordion">
							<h2>{{ getHeaderTitle }}</h2>
							<template v-if="">

							</template>
							<span class="calc-accordion-btn" ref="calcAccordionToggle" :style="{display: settings.general && settings.general.descriptions ? 'flex': 'none'}">
								<i class="ccb-icon-Path-3485" :style="{transform: accordionHeight === '0px' ? 'rotate(0)' : 'rotate(180deg)'}"></i>
							</span>
						</div>
						<div class="calc-subtotal-list">
							<div class="calc-subtotal-list-accordion" ref="calcAccordion" :style="{maxHeight: accordionHeight}">
								<template v-for="field in getTotalSummaryFields" v-if="field.alias.indexOf('total') === -1 && settings && settings.general.descriptions">
									<div :class="[field.alias, 'sub-list-item']" :style="{display: field.hidden ? 'none' : 'flex'}">
										<span class="sub-item-title"> {{ field.label }} </span>
										<span class="sub-item-space"></span>
										<span class="sub-item-value"> {{ field.converted }} </span>
									</div>
									<div :class="[field.alias, 'sub-list-item inner']" v-if="field.options && field.options.length && ['checkbox', 'toggle'].includes(field.alias.replace(/\_field_id.*/,''))">
										<div class="sub-inner" v-for="option in field.options" :style="{display: field.hidden ? 'none' : 'flex'}">
											<span class="sub-item-title"> {{ option.label }} </span>
											<span class="sub-item-space"></span>
											<span class="sub-item-value"> {{ option.converted }} </span>
										</div>
									</div>
								</template>
							</div>
						</div>
						<div class="calc-subtotal-list" style="margin-top: 20px; padding-top: 10px;">
							<div :style="[ item.hidden ? { display: 'none' } : 'flex' ]" :class="['sub-list-item total', getCustomTotalCls(item.alias)]" v-for="item in formula" :id="item.alias">
								<span class="sub-item-title"> {{ item.label }} </span>
								<span class="sub-item-value"> {{ item.converted }} </span>
							</div>
						</div>
						<div class="calc-subtotal-list">
							<?php if ( ccb_pro_active() ) : ?>
								<cost-pro-features inline-template :settings="content.settings">
									<?php echo \cBuilder\Classes\CCBProTemplate::load( 'frontend/pro-features', array( 'settings' => array(), 'general_settings' => array() ) ); // phpcs:ignore ?>
								</cost-pro-features>
							<?php endif; ?>
						</div>
					</div>
				</div>
			</template>
		</div>
	</div>
</calc-builder-front>
