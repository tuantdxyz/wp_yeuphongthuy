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
		toggleField: {},
		toggleValue: [],
	}),

	created() {
		this.toggleField = this.parseComponentData();
		this.toggleLabel = 'toggle_' + this.randomID();
	},

	computed: {
		isHorizontallyView() {
			return this.getObjByPath(this.appearance, 'elements.toggle.data.is_horizontal_view.value');
		},

		additionalCss() {
		    return this.$store.getters.getCalcStore.hasOwnProperty(this.toggleField.alias) && this.$store.getters.getCalcStore[this.toggleField.alias].hidden === true
                ? 'display: none;'
                : '';
		},

		getOptions() {
			let result = [];
			if (this.toggleField.options) {

				result = Array.from(this.toggleField.options).map((element, index) => {
					let checkElementType = false;
					if (Array.isArray(this.toggleValue)) {
						checkElementType = this.toggleValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index);
					}

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

	watch: {
		value(val) {
			if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
				this.temp.forEach(element => {

					const chValue = val + '_' + element.id;
					const found = this.toggleValue.find(e => e.temp === chValue)

					if (chValue === element.value && typeof found === "undefined") {
						$('#' + this.toggleField.alias).find('input').each((e, i) => {
							i.checked = i.value === chValue
						});
						this.toggleValue.push({value: +val, label: element.label, temp: chValue});
					}
				});
			} else {
				this.toggleValue = val;
			}
			this.change({}, {}, false);
		}
	},

	methods: {
		change(event, label, def = true) {
			const vm = this;

			if (!Array.isArray(this.toggleValue)) {
				vm.toggleValue = [];
			}

			if (def && event.target.checked) {
				vm.toggleValue.push({value: parseFloat(event.target.value), temp: event.target.value, label});
			} else if (def) {
				if (vm.toggleValue.length === 1)
					vm.toggleValue = [];
				else
					vm.toggleValue = vm.toggleValue.filter(e => e.temp !== event.target.value);
			}
			this.$emit(vm.toggleField._event, vm.toggleValue, vm.toggleField.alias);
			this.$emit('condition-apply', this.toggleField.alias)
		},

		toggle(selector, label) {
			const element = document.querySelector('#' + selector);
			if (element) {
				element.checked = !element.checked;

				this.change({target: element}, label);
			}
		},
	},
}
