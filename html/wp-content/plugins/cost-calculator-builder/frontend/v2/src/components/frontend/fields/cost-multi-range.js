const $ = require('jquery')
import fieldsMixin from "./fieldsMixin";
import {enableRipple} from '@syncfusion/ej2-base';
import {Slider} from '@syncfusion/ej2-inputs';

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
		min: 0,
		step: 1,
		max: 100,
		leftVal: 0,
		rightVal: 0,
		rangeSlider: {},
		multiRange: null,
		multiRangeValue: 0,
	}),

	created() {
		this.multiRange = this.parseComponentData();
		if (this.multiRange.alias) {
			this.min = this.multiRange.minValue;
			this.max = this.multiRange.maxValue
			this.step = this.multiRange.step;

			if (this.multiRange.hidden !== true) {
				this.leftVal = this.initValue(this.multiRange.default_left, this.min);
				this.rightVal = this.initValue(this.multiRange.default_right, this.max, true);
			}
		}
	},

	mounted() {
		this.renderRange();
		this.change();
	},

	computed: {
		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
                ? 'display: none;'
                : '';
		},
	},

	watch: {
		value(val) {
			if (val.hasOwnProperty('start') && val.hasOwnProperty('end') && (val.start != this.leftVal || val.end != this.rightVal)) {
				this.leftVal = this.initValue(val.start, this.min);
				this.rightVal = this.initValue(val.end, this.max, true);
				this.rangeSlider.value = [this.leftVal, this.rightVal];
				this.change();
			}
			if (+val === 0) {
				this.leftVal = 0;
				this.rightVal = 0;
				this.rangeSlider.value = [this.leftVal, this.rightVal];
				this.change();
			}
		},
	},
	methods: {
		initValue(value, secondVal, isMax) {
			let defaultVal = value ? value : 0
			if (isMax)
				return defaultVal > secondVal ? secondVal : defaultVal
			return defaultVal < secondVal ? secondVal : defaultVal
		},

		renderRange() {
			const vm = this;
			let calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
			this.rangeSlider = new Slider({
				min: +this.min, max: +this.max,
				value: [this.leftVal, this.rightVal],
				step: +this.step,
				type: 'Range',
				tooltip: {
					cssClass: 'calc_id_' + calcId,
					isVisible: true,
					showOn: 'Focus',
					placement: 'Before'
				},
				change: args => {
					const [left, right] = args.value;
					vm.leftVal = left;
					vm.rightVal = right;
					this.change();
				}
			});

			const isModal = $('.modal-body')
			if ( isModal.length > 0 ) {
				this.rangeSlider.appendTo(`.modal-body *[data-calc-id="${this.id}"] .range_${vm.multiRange.alias}`);
			} else {
				this.rangeSlider.appendTo(`*[data-calc-id="${this.id}"] .range_${vm.multiRange.alias}`);
			}
		},

		change() {
			const value = {
				'value': parseInt(this.rightVal) - parseInt(this.leftVal),
				'start': this.leftVal,
				'end': this.rightVal,
			};

			this.$emit(this.multiRange._event, value, this.multiRange.alias);
			this.$emit('condition-apply', this.multiRange.alias)
		},
	}
}
