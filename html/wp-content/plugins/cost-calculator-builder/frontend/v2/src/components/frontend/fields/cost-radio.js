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
		radioField: {},
		radioLabel: '',
	}),

	created() {
		this.radioField = this.parseComponentData();
		this.radioLabel = this.randomID();
		this.radioValue = this.value;
	},

	watch: {
		value(val) {
			if (val && val.toString().indexOf('_') === -1) {
				Array.from(this.radioField.options).forEach((element, index) => {
					if (element.optionValue === val) {
						this.radioValue = val + '_' + index;
					}
				})
			} else {
				this.radioValue = val;
			}
		},
	},

	computed: {
		isHorizontallyView() {
			return this.getObjByPath(this.appearance, 'elements.checkbox_radio.data.is_horizontal_view.value');
		},

		additionalCss() {
			return this.$store.getters.getCalcStore.hasOwnProperty(this.radioField.alias) && this.$store.getters.getCalcStore[this.radioField.alias].hidden === true
				? 'display: none;'
				: '';
		},

		radioValue: {
			get() {
				return this.value;
			},

			set(value) {
				if (value === 0) {
					this.$emit(this.radioField._event, 0, this.radioField.alias, '');
					this.$emit('condition-apply', this.radioField.alias);
				}

				if (!value) {
					return;
				}

				let [, index] = value.split('_');
				let option = null;

				this.getOptions
					.forEach((element, key) => {
						if (!option && element.value === value && index == key) {
							option = JSON.parse(JSON.stringify(element));
						}
					});

				const val = option ? value : '';
				const label = option ? option.label : '';

				this.$emit(this.radioField._event, val, this.radioField.alias, label);
				this.$emit('condition-apply', this.radioField.alias);
			}
		},

		getOptions() {
			let result = [];
			if (this.radioField.options) {
				result = Array.from(this.radioField.options).map((element, index) => {
					return {
						label: element.optionText,
						value: `${element.optionValue}_${index}`,
					}
				})
			}

			return result;
		},
	},
}
