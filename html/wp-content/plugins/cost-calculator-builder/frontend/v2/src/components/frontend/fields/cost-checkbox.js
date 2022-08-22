const $ = require('jquery');
import fieldsMixin from "./fieldsMixin";

export default {
	mixins: [fieldsMixin],
	props: {
		field: [Object, String],
		value: {
			default: '',
		},
	},
	data: () => ({
		temp: [],
		radioLabel: '',
		checkboxField: {},
		checkboxValue: [],
	}),

	created() {
		this.checkboxField = this.parseComponentData();
		this.checkboxLabel = 'option_' + this.randomID();
	},

	watch: {
		value(val) {
			if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
				this.temp
					.forEach(element => {
						const chValue = val + '_' + element.id;
						const found = this.checkboxValue.find(e => e.temp === chValue)
						if (chValue === element.value && typeof found === "undefined") {
							jQuery('#' + this.checkboxField.alias).find('input').each((e, i) => i.checked = i.value === chValue);
							this.checkboxValue.push({value: +val, label: element.label, temp: chValue});
						}
					});
			} else {
				this.checkboxValue = val;
			}
			this.change({}, {}, false);
		},
	},

	computed: {
		isHorizontallyView() {
			return this.getObjByPath(this.appearance, 'elements.checkbox_radio.data.is_horizontal_view.value');
		},

		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias) && this.$store.getters.getCalcStore[this.field.alias].hidden === true
				? 'display: none;'
				: '';
		},

		getOptions() {
			let result = [];
			if (this.checkboxField.options) {
				result = Array.from(this.checkboxField.options)
					.map((element, index) => {
						let checkElementType = false;
						if (Array.isArray(this.checkboxValue))
							checkElementType = this.checkboxValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index);

						return {
							id: index,
							label: element.optionText,
							value: `${element.optionValue}_${index}`,
							hint: element.optionHint ?? '',
							isChecked: checkElementType,
						}
					})
			}
			this.temp = Object.assign([], this.temp, result);
			return result;
		},
	},

	methods: {
		change(event, label, def = true) {
			const vm = this;

			if (!Array.isArray(this.checkboxValue)) {
				vm.checkboxValue = [];
			}

			if (def && event.target.checked) {
				vm.checkboxValue.push({value: parseFloat(event.target.value), label, temp: event.target.value});
			} else if (def) {
				if (vm.checkboxValue.length === 1)
					vm.checkboxValue = [];
				else
					vm.checkboxValue = vm.checkboxValue.filter(e => e.temp !== event.target.value);
			}

			this.$emit(vm.checkboxField._event, vm.checkboxValue, vm.checkboxField.alias);
			this.$emit('condition-apply', this.checkboxField.alias)
		}
	}
}
