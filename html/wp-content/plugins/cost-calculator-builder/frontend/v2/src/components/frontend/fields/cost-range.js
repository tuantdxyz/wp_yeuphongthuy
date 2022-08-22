const $ = require('jquery');
import {mapGetters} from '@libs/v2/vue/vuex';
import {Slider} from '@syncfusion/ej2-inputs';
import {enableRipple} from '@syncfusion/ej2-base';
import fieldsMixin from "./fieldsMixin";

enableRipple(true);

export default {
	mixins: [fieldsMixin],
	props: {
		id: {
			default: null,
		},
		value: {
			default: 0,
			type: [Number, String]
		},

		field: [Object, String],
	},

	data: () => ({
		rangeValue: 0,
		rangeField: null,
		min: 0,
		max: 100,
		step: 1,
		rangeObj: null,
		$calc: null,
	}),

	watch: {
		value(val) {
			const parsed = +val
			this.rangeValue = parsed
			this.rangeObj.value = parsed
			this.change()
		},
	},

	computed: {
		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.rangeField.alias) && this.$store.getters.getCalcStore[this.rangeField.alias].hidden === true
				? 'display: none;'
				: '';
		},

		...mapGetters(['getSettings']),

		getFormatedValue() {
			return this.rangeField.allowCurrency ?
				this.currencyFormat(this.rangeValue, {currency: true}, {...this.getSettings.currency, currency: ''})
				: this.rangeValue;
		}
	},

	mounted() {
		this.$calc = $(`*[data-calc-id="${this.id}"]`);
		this.renderRange();
		this.change();
	},

	created() {
		this.rangeField = this.parseComponentData();
		if (this.rangeField.alias) {
			if (this.rangeField.hidden !== true)
				this.rangeValue = this.initValue();

			this.min = this.rangeField.minValue;
			this.max = this.rangeField.maxValue;
			this.step = this.rangeField.step;
		}
	},

	methods: {
		initValue() {
			let defaultVal = this.rangeField.default ? this.rangeField.default : 0;
			defaultVal = +defaultVal < +this.rangeField.minValue ? this.rangeField.minValue : defaultVal;
			return defaultVal;
		},

		renderRange() {
			const vm = this;
			this.min = +this.min
			this.max = +this.max

			let calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId;
			vm.rangeObj = new Slider({
				min: this.min,
				max: this.max,
				value: this.rangeValue,
				step: this.step,
				type: 'MinRange',
				tooltip: {
					cssClass: 'calc_id_' + calcId,
					isVisible: true,
					placement: 'Before'
				},
				change: args => {
					this.rangeValue = args.value
					this.change();
				},
			});

			const isModal = $('.ccb-main-container .modal-body')
			if ( isModal.length > 0 ) {
				vm.rangeObj.appendTo(`.ccb-main-container .modal-body *[data-calc-id="${this.id}"] .range_${vm.rangeField.alias}`)
			} else {
				vm.rangeObj.appendTo(`*[data-calc-id="${this.id}"] .range_${vm.rangeField.alias}`)
			}
		},

		change() {
			this.$emit(this.rangeField._event, +this.rangeValue, this.rangeField.alias);
			this.$emit('condition-apply', this.rangeField.alias);
		},
	},
}