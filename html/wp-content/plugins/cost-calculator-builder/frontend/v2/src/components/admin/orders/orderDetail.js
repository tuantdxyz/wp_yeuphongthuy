export default {
	props: ['selected'],

	methods: {
		clearDetails() {
			this.$emit('clear-details', null);
		},
	},


	computed: {
		getSummaryList() {
			const list = [];
			const withOptions = ['dropDown', 'radio', 'checkbox', 'toggle'];
			if (this.selected && this.selected.order_details.length > 0) {
				this.selected.order_details.forEach(detail => {
					const inOption = withOptions.find(wO => detail.alias.indexOf(wO) !== -1);
					list.push({
						label: detail.title,
						value: detail.value,
						options: inOption ? detail.options : null,
					})
				});
			}
			return list;
		},

		paymentMethod() {
			return this.selected.paymentMethod === 'no_payments' ? 'No payment' : this.renderPaymentMethod;
		},

		renderPaymentMethod() {
			return this.selected.paymentMethod;
		},

		fileFields() {
			return this.selected.order_details.filter(field =>
				field.alias.replace(/\_field_id.*/, '') == 'file_upload');
		},

		formatTotal() {
			let decimalCount = this.selected.num_after_integer ? this.selected.num_after_integer : 2;
			let decimal = this.selected.decimal_separator ? this.selected.decimal_separator : '.';
			let thousands = this.selected.thousands_separator ? this.selected.thousands_separator : ',';

			decimalCount = Math.abs(decimalCount);
			decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

			const negativeSign = this.selected.total < 0 ? "-" : "";
			let total = parseFloat(this.selected.total);

			let i = parseInt(total = Math.abs(Number(total) || 0).toFixed(decimalCount)).toString();
			let j = (i.length > 3) ? i.length % 3 : 0;

			total = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(total - i).toFixed(decimalCount).slice(2) : "");
			return total;
		},

		formFields() {
			const result = this.order.form_details.fields.map(item => {
				return {
					name: item.name.replace('-', ' '),
					value: item.value
				}
			})

			return result
		},
	},

	filters: {
		'to-short': (value) => {
			if (value.length >= 33) {
				return value.substring(0, 30) + '...';
			}
			return value;
		},
	},

	template: `
		<div class="ccb-table-body--content ccb-custom-scrollbar" :class="{'no-content': !selected}">
			<div class="ccb-edit-no-content" v-if="!selected">
				<span class="ccb-edit-no-content--label">Nothing to show</span>
				<span class="ccb-edit-no-content--description">Click an order to see the details and edit them.</span>
			</div>
			<div class="ccb-edit-info" v-else>
				<div class="ccb-edit-header">
					<span class="ccb-edit-title">Order № {{ selected.id }}</span>
					<span class="ccb-edit-close" @click.prevent="clearDetails">
						<i class="ccb-icon-close"></i>
					</span>
				</div>
				
				<div :class="['ccb-edit-summary', summary.options ? 'options' : '']" v-for="(summary, idx) in getSummaryList">
					<div class="ccb-edit-summary-parent">
						<span class="ccb-edit-summary-label">{{ summary.label }}</span>
						<span class="ccb-edit-summary-value">{{ summary.value }}</span>
					</div>
					<div class="ccb-edit-summary-options" v-if="summary.options">
						<span class="ccb-options-row" v-for="(inner, idx) in summary.options" :key="idx">
							<span class="ccb-edit-summary-label">{{ inner.label }}</span>
							<span class="ccb-edit-summary-value">{{ inner.value }}</span>
						</span>
					</div>
				</div>
				<div class="ccb-edit-total">
					<span class="ccb-edit-total-label">Total</span>
					<span class="ccb-edit-total-value">{{ selected.paymentCurrency }} {{ formatTotal }}</span>
				</div>
				<div class="ccb-edit-payment-method">
					<span class="ccb-edit-payment-method-label">
						Payment Method: <span class="ccb-edit-pm-type" v-html="selected.paymentMethodType"></span>
					</span>
				</div>
				<div class="ccb-edit-file-upload" v-if="fileFields.length > 0">
					<template v-for="fileField in fileFields">
						<div class="ccb-edit-file-upload-item" v-if="file.hasOwnProperty('file') && file.file.length > 0" v-for="file in fileField.options">
							<span class="ccb-edit-fl-left">
								<i class="ccb-icon-Path-3494"></i>
								<span class="ccb-edit-fl-left-text-wrapper">
									<span class="ccb-fl-label">{{ fileField.title | to-short }}</span>
									<span class="ccb-fl-name">{{ file.file.split('/').pop() | to-short }}</span>
								</span>
							</span>
							<span class="ccb-edit-fl-right">
								<a :href="file.url" :download="file.file.split('/').pop()" class="ccb-button ccb-href default" style="padding: 10px 20px">Download</button>
							</span>
						</div>
					</template>
				</div>
				<div class="ccb-edit-form">
					<span class="ccb-edit-title">Contact Information</span>
					<span class="ccb-edit-form-fields" v-for="field in selected.form_details.fields">
						<span :class="['ccb-edit-form-label', field.name]">{{ field.name }}:</span>
						<span :class="['ccb-edit-form-value', field.name]">{{ field.value }}</span>
					</span>
				</div>
			</div>
		</div>`
}
