<?php
$modal_types = array(
	'preview' => array(
		'type' => 'preview',
		'path' => CALC_PATH . '/templates/v2/admin/single-calc/modals/modal-preview.php',
	),
);

?>
<div class="ccb-create-calc">
	<div class="ccb-create-calc-sidebar ccb-custom-scrollbar">
		<div class="ccb-sidebar-header">
			<span class="ccb-heading-4 ccb-bold"><?php esc_html_e( 'Elements', 'cost-calculator-builder' ); ?></span>
		</div>
		<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/single-calc/partials/sidebar-items' ); // phpcs:ignore ?>
	</div>
	<div class="ccb-create-calc-content">
		<div class="ccb-create-calc-content-fields">
			<div class="ccb-fields-container">
				<div class="ccb-fields-header">
					<span class="ccb-heading-4 ccb-bold"><?php esc_html_e( 'Calculator', 'cost-calculator-builder' ); ?></span>
					<span class="ccb-default-description ccb-light"><?php esc_html_e( 'Drag here elements to create calculator', 'cost-calculator-builder' ); ?></span>
				</div>
				<div class="ccb-fields-wrapper ccb-custom-scrollbar" :class="{'ccb-disable-scroll': $store.getters.getBuilder.length === 0}">
					<draggable
							@change="log"
							group="fields"
							:list="$store.getters.getBuilder"
							v-model="getFields"
							class="ccb-fields-item-row"
							draggable=".ccb-fields-item"
							:key="draggableKey"
							v-bind="dragOptions"
					>
						<div class="ccb-fields-item" v-for="(field, key) in getFields" :key="key" @click.stop="e => editField(e, field.type, key)" :class="{'ccb-field-selected': editId !== null && +editId === key && !getErrorIdx.includes(key), 'ccb-idx-error': getErrorIdx.includes(key)}">
							<div class="ccb-fields-item-left">
								<span>
									<span class="ccb-field-item-icon-box">
										<i :class="field.icon"></i>
									</span>
								</span>
								<span class="ccb-field-item-title-box">
									<span class="ccb-default-title ccb-bold">{{ field.label | to-short }}</span>
									<span class="ccb-default-description ccb-light">{{ field.text }}</span>
								</span>
							</div>
							<div class="ccb-fields-item-center">
								<span class="ccb-default-title ccb-light-2" v-if="field.alias">[{{ field.alias }}]</span>
							</div>
							<div class="ccb-fields-item-right">
								<span class="ccb-duplicate ccb-default-title ccb-light-2" @click.prevent="duplicateField(field._id, !field.alias || field._id === null || field._id === undefined || duplicateNotAllowed)" v-if="!(!field.alias || field._id === null || field._id === undefined || duplicateNotAllowed)">
									<i class="ccb-icon-Path-3505"></i>
									<?php esc_html_e( 'Duplicate', 'cost-calculator-builder' ); ?>
								</span>
								<span class="ccb-idx-error-info ccb-default-title ccb-light-2" v-if="getErrorIdx.includes(key)">
									<?php esc_html_e( 'Empty field', 'cost-calculator-builder' ); ?>
								</span>
								<i class="ccb-icon-Path-3503" @click.prevent="removeFromBuilder(key)"></i>
							</div>
						</div>
						<div class="ccb-fields-item ccb-place" :class="{'ccb-place-show': $store.getters.getBuilder.length === 0}">
							<span><?php esc_html_e( 'Place element here', 'cost-calculator-builder' ); ?></span>
						</div>
					</draggable>
				</div>
			</div>
		</div>
		<div class="ccb-create-calc-content-edit-field ccb-custom-scrollbar" :class="{'has-content': getType}">
			<template v-if="getType">
				<?php
				$fields = \cBuilder\Helpers\CCBFieldsHelper::fields();
				?>
				<?php foreach ( $fields as $key => $field ) : ?>
					<component
							inline-template
							:key="updateEditKey"
							:field="fieldData"
							@save="addOrSaveField"
							:id="editId"
							:index="getIndex"
							:order="getOrderId"
							@cancel="closeOrCancelField"
							:available="$store.getters.getBuilder"
							is="<?php echo esc_attr( $field['type'] ); ?>-field"
							v-if="getType === '<?php echo esc_attr( $field['type'] ); ?>'"
					>
						<?php echo \cBuilder\Classes\CCBTemplate::load( '/admin/single-calc/fields/' . $field['type'] . '-field' ); // phpcs:ignore ?>
					</component>
				<?php endforeach; ?>
			</template>
			<template v-else>
				<div class="ccb-edit-field-no-selected">
					<div class="ccn-edit-no-selected-box">
						<span class="ccb-heading-3 ccb-bold"><?php esc_html_e( 'Click to See More', 'cost-calculator-builder' ); ?></span>
						<span class="ccb-default-title ccb-light-2" style="line-height: 1"><?php esc_html_e( 'Choose an element to configure the settings ', 'cost-calculator-builder' ); ?></span>
					</div>
				</div>
			</template>
		</div>
	</div>
	<ccb-modal-window>
		<template v-slot:content>
			<?php foreach ( $modal_types as $m_type ) : ?>
				<template v-if="$store.getters.getModalType === '<?php echo esc_attr( $m_type['type'] ); ?>'">
					<?php require_once $m_type['path']; ?>
				</template>
			<?php endforeach; ?>
		</template>
	</ccb-modal-window>
</div>
