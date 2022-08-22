<?php
// TODO mv all logic to controller

if ( ! isset( $calc_id ) ) {
	return;
}

/** if language not set, use en as default */
if ( ! isset( $language ) ) {
	$language = 'en';
}
if ( ! isset( $translations ) ) {
	$translations = array();
}

$container_style = 'v-container';
$settings        = get_option( 'stm_ccb_form_settings_' . $calc_id );

if ( ! empty( $settings ) && isset( $settings[0] ) && isset( $settings[0]['general'] ) ) {
	$settings = $settings[0];
}

if ( empty( $settings['general'] ) ) {
	$settings = \cBuilder\Classes\CCBSettingsData::settings_data();
}

$box_style           = $settings['general']['boxStyle'] ?? 'vertical';
$settings['calc_id'] = $calc_id;
$settings['title']   = get_post_meta( $calc_id, 'stm-name', true );

if ( ! empty( $settings['formFields']['body'] ) ) {
	$settings['formFields']['body'] = str_replace( '<br>', PHP_EOL, $settings['formFields']['body'] );
}

$styles        = get_post_meta( $calc_id, 'ccb-custom-styles', true );
$custom_fields = get_post_meta( $calc_id, 'ccb-custom-fields', true );
$fields        = get_post_meta( $calc_id, 'stm-fields', true );


array_walk(
	$fields,
	function ( &$field_value, $k ) {
		if ( array_key_exists( 'required', $field_value ) ) {
			$field_value['required'] = $field_value['required'] ? 'true' : 'false';
		}
	}
);

$data = array(
	'id'           => $calc_id,
	'settings'     => $settings,
	'currency'     => ccb_parse_settings( $settings ),
	'fields'       => $fields,
	'formula'      => get_post_meta( $calc_id, 'stm-formula', true ),
	'conditions'   => apply_filters( 'calc-render-conditions', array(), $calc_id ), // phpcs:ignore
	'styles'       => ! empty( $styles ) ? $styles : \cBuilder\Classes\CustomFields\CCBCustomFields::custom_default_styles(),
	'customs'      => ! empty( $custom_fields ) ? $custom_fields : \cBuilder\Classes\CustomFields\CCBCustomFields::custom_fields(),
	'language'     => $language,
	'dateFormat'   => get_option( 'date_format' ),
	'default_img'  => CALC_URL . '/frontend/v1/dist/img/default.png',
	'translations' => $translations,
);

if ( isset( $is_customize ) ) {
	$box_style = 'horizontal';
}

$custom_defined = false;
if ( isset( $is_preview ) ) {
	$custom_defined = true;
}

if ( 'horizontal' === $box_style ) {
	$container_style = 'h-container';
}

if ( ! empty( $settings['stripe']['enable'] ) ) {
	wp_enqueue_script( 'calc-stripe', 'https://js.stripe.com/v3/', array(), CALC_VERSION, false );
}

wp_localize_script( 'calc-builder-main-js', 'calc_data_' . $calc_id, $data );
$get_date_format = get_option( 'date_format' );
?>
<?php if ( ! isset( $is_preview ) ) : ?>
<div class="calculator-settings ccb-wrapper-<?php echo esc_attr( $calc_id ); ?>">
	<?php endif; ?>
	<calc-builder-front custom="<?php echo esc_attr( $custom_defined ); ?>" :content="<?php echo esc_attr( wp_json_encode( $data, 0, JSON_UNESCAPED_UNICODE ) ); ?>" inline-template :id="<?php echo esc_attr( $calc_id ); ?>">
		<div ref="calc" class="calc-container" data-calc-id="<?php echo esc_attr( $calc_id ); ?>" :class="'<?php echo esc_attr( $box_style ); ?>'">
			<loader v-if="loader"></loader>
			<template>
				<div class="calc-fields calc-list" :style="$store.getters.getCustomStyles['<?php echo esc_attr( $container_style ); ?>']" :class="{loaded: !loader, 'payment' :  getHideCalc}" >
					<div class="calc-item-title">
						<h4 :style="$store.getters.getCustomStyles['headers']"><?php echo esc_attr( $settings['title'] ); ?></h4>
					</div>
					<template v-if="calc_data" v-for="field in calc_data.fields">
						<template v-if="field && field.alias && field.type !== 'Total'">
							<component
									format="<?php esc_attr( $get_date_format ); ?>"
									text-days="<?php esc_attr_e( 'days', 'cost-calculator-builder' ); ?>"
									v-if="fields[field.alias]"
									:is="field._tag"
									:id="calc_data.id"
									style="<?php echo esc_attr( $box_style ); ?>"
									:field="field"
									:converter="currencyFormat"
									:disabled="fields[field.alias].disabled"
									v-model="fields[field.alias].value"
									v-on:change="change"
									v-on:[field._event]="change"
									v-on:condition-apply="renderCondition"
									:key="!field.hasNextTick ? field.alias : field.alias + '_' + fields[field.alias].nextTickCount"
							>
							</component>
						</template>
						<template v-else-if="field && !field.alias && field.type !== 'Total'">
							<component
									:id="calc_data.id"
									style="<?php echo esc_attr( $box_style ); ?>"
									:is="field._tag"
									:field="field"
							>
							</component>
						</template>
					</template>
				</div>
				<div class="calc-subtotal calc-list " :class="{loaded: !loader}" :style="$store.getters.getCustomStyles['<?php echo esc_attr( $container_style ); ?>']">
					<div class="calc-item title">
						<h4 :style="$store.getters.getCustomStyles['headers']"><?php echo isset( $settings['general']['header_title'] ) ? esc_html( $settings['general']['header_title'] ) : ''; ?></h4>
					</div>
					<div class="calc-subtotal-list">
						<template v-for="field in getTotalSummaryFields" v-if="field.alias.indexOf('total') === -1 && settings && settings.general.descriptions === 'show'">
							<div :class="[field.alias, 'sub-list-item']" :style="{...$store.getters.getCustomStyles['total-summary'], display: field.hidden ? 'none' : 'flex'}">
								<span class="sub-item-title"> {{ field.label }} </span>
								<span class="sub-item-value"> {{ field.converted }} </span>
							</div>
							<div :class="[field.alias, 'sub-list-item inner']" :style="$store.getters.getCustomStyles['total-summary']" v-if="field.options && field.options.length && ['checkbox', 'toggle'].includes(field.alias.replace(/\_field_id.*/,''))">
								<div class="sub-inner" v-for="option in field.options">
									<span class="sub-item-title"> {{ option.label }} </span>
									<span class="sub-item-value"> {{ option.converted }} </span>
								</div>
							</div>
						</template>
						<div :style="[ item.hidden ? { display: 'none' } : 'flex' ]" :class="['sub-list-item total', getCustomTotalCls(item.alias)]" v-for="item in formula" :id="item.alias">
							<span class="sub-item-title" :style="$store.getters.getCustomStyles['total']"> {{ item.label }} </span>
							<span class="sub-item-value" :style="$store.getters.getCustomStyles['total']"> {{ item.converted }} </span>
						</div>
						<?php if ( ccb_pro_active() ) : ?>
							<cost-pro-features inline-template :settings="content.settings">
								<?php echo \cBuilder\Classes\CCBProTemplate::load( 'frontend/pro-features', array( 'settings' => $settings ) ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</cost-pro-features>
						<?php endif; ?>
					</div>
				</div>
			</template>
		</div>
	</calc-builder-front>
	<?php if ( ! isset( $is_preview ) ) : ?>
</div>
<?php endif; ?>
