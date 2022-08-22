import costProFeatures from './partials/pro-features'
import calcNotice from './partials/calc-notice';
import WooLinks from '../../utils/woo-links'
import Condition from '../../utils/condition'
import Customize from '../../utils/customize'
import Helpers from '../../utils/helpers'
import ToolTip from '../../utils/toolTip'

String.prototype.replaceAll = function (search, replace) {
	return this.split(search).join(replace)
};

export default {
	props: {
		id: null,
		template: {
			default: '',
		},
		content: {
			default: {}
		},
		custom: 0,
	},

	data() {
		return {
			accordionHeight: '100%',
			notice: {},
			fields: {},
			formula: '',
			settings: {},
			calc_data: [],
			customs: {},
			calcStore: {},
			conditions: {},
			formulaConst: [],
			demoBoxStyle: false,
			preview_loader: false,

			$calc: null,
			tempVal: {},
			valuesStore: {},
		}
	},

	components: {
		'cost-pro-features': costProFeatures,
		'calc-notices': calcNotice,
	},

	computed: {
		showDemoBoxStyle() {
			let demoSiteUrl = 'https://stylemixthemes.com/cost-calculator/'

			return location.href.indexOf(demoSiteUrl) !== -1;
		},
		getStep: {
			get() {
				return this.$store.getters.getStep;
			},

			set(value) {
				this.$store.commit('updateStep', value)
			}
		},

		noticeData: {
			get() {
				return this.$store.getters.getNotices;
			},

			set(noticeData) {
				const {getters} = this.$store;
				if (noticeData)
					noticeData.image = noticeData.type === 'error' ? getters.getErrorImg : getters.getSuccessImg;
				this.$store.commit('setNotices', noticeData);
			}
		},

		appearance() {
			return this.$store.getters.getAppearance;
		},

		boxStyle() {
			return this.demoBoxStyle ? this.demoBoxStyle : this.getSettings.general?.boxStyle || 'vertical'
		},

		getSettings() {
			return this.$store.getters.getSettings
		},

		getHideCalc: {
			get() {
				return this.$store.getters.getHideCalc
			},

			set(val) {
				this.$store.commit('updateHideCalc', val)
			}
		},

		loader: {
			get() {
				return this.$store.getters.getMainLoader
			},

			set(val) {
				this.$store.commit('updateMainLoader', val)
			}
		},

		currencySettings() {
			return this.getSettings.currency
		},

		getTotalSummaryFields() {
			const calcStore = Object.assign({}, this.calcStore);
			const {hide_empty} = this.getSettings?.general

			let fields = Object.values(calcStore)
				.filter(field => !['html', 'line', 'text'].includes(field.alias.replace(/\_field_id.*/, '')));

			/** remove zero value fields **/
			if (!hide_empty) {
				fields = fields.filter(field => field.value !== 0);
			}
			return fields;
		},
	},

	mounted() {
		/** set language **/
		if (this.content.hasOwnProperty('language')) {
			this.$store.commit('setLanguage', this.content.language);
		}

		/** set date format **/
		if (this.content.hasOwnProperty('dateFormat')) {
			this.$store.commit('setDateFormat', this.content.dateFormat);
		}

		/** set translations **/
		if (this.content.hasOwnProperty('translations')) {
			this.$store.commit('setTranslations', this.content.translations);
		}

		/** set default image for drop-down-with-image **/
		if (this.content.hasOwnProperty('default_img')) {
			this.$store.commit('setDefaultImg', this.content.default_img);
		}

		/** set default image for drop-down-with-image **/
		if (this.content.hasOwnProperty('error_img')) {
			this.$store.commit('setErrorImg', this.content.error_img);
		}

		/** set default image for drop-down-with-image **/
		if (this.content.hasOwnProperty('success_img')) {
			this.$store.commit('setSuccessImg', this.content.success_img);
		}

		this.init();
		this.initEffects();
		this.initListeners();
		this.initLinks();
	},

	methods: {
		changeBoxStyle(key) {
			this.demoBoxStyle = key;
		},
		resetCalc() {
			this.getStep = '';
			this.apply()
			this.triggerCondition()
		},

		initTotalSummaryAccordion(firstLoad = false) {
			if (this.$refs.calcAccordionToggle) {
				setTimeout(() => this.accordionHeight = this.$refs.calcAccordion.scrollHeight + 'px', 0);
				if (firstLoad)
					this.$refs.calcAccordionToggle.addEventListener('click', () => this.accordionHeight = this.accordionHeight === '0px' ? this.$refs.calcAccordion.scrollHeight + 'px' : '0px');
			}
		},

		init() {
			const custom = !!(parseInt(this.custom));
			this.initTotalSummaryAccordion(true);

			if (this.$refs.calc && !custom) {
				this.calc_data = window['calc_data_' + this.$refs.calc.dataset.calcId]
			} else {
				this.calc_data = this.content
			}

			this.$store.commit('updateCalcId', this.id);

			if (typeof this.calc_data !== "undefined" && this.calc_data && this.calc_data.hasOwnProperty('fields')) {
				if (this.calc_data.hasOwnProperty('appearance') && this.calc_data.appearance) {
					this.$store.commit('setAppearance', this.calc_data.appearance);
				}

				if (this.calc_data.hasOwnProperty('formula') && this.calc_data.formula) {
					this.formulaConst = this.calc_data.formula;
				}

				if (this.calc_data.conditions) {
					this.conditions = this.calc_data.conditions;
				}

				if (this.calc_data.settings) {
					this.settings = this.calc_data.settings
					this.$store.commit('updateSettings', this.settings)
				}

				this.initCalcField();
				this.apply();
			}

			if (this.$refs.calc) {
				this.$store.dispatch('updateCurrentAction', this.$refs.calc)
			}
		},

		initCalcField() {
			if (Array.isArray(this.calc_data.fields)) {
				this.calc_data.fields
					.filter(field => field.alias)
					.forEach(field => {
						const data = {
							id: field._id,
							unit: field.unit,
							label: field.label,
							alias: field.alias,
							round: field.allowRound,
							currency: field.allowCurrency,
							hidden: (field.hasOwnProperty('hidden') && field.hidden === true) ? true : null,
							required: field.required == 'true',
							value: field.default ? field.default : 0,
						};

						if (field.default) {
							data.default = field.default;
						}

						/** If field needs re-render from outside we add new option values like <disabled, hasNextTick, nextTickCount> **/
						if (field.hasNextTick) {
							/** for disable/enable from outside **/
							data.disabled = field.disabled;
							/** for update value from outside **/
							data.hasNextTick = field.hasNextTick;
							data.nextTickCount = field.nextTickCount;
						}

						if (field.type === 'Total') {
							data.value = field.costCalcFormula
							data.additionalStyles = field.additionalStyles
							data.totalSymbol = field.totalSymbol
							data.totalSymbolSign = field.totalSymbolSign
						}

						this.fields[field.alias] = data;
					})
			}
		},

		/**
		 * Fields with hidden option enabled
		 * add to condition blocked to calculate
		 * correct total value
		 */
		addToBlockedHiddenFields() {
			Object.values(this.calcStore).forEach(calc => {
				if (this.fields[calc.alias].hidden === true) {
					this.fields[calc.alias].value = 0;
					this.$store.commit('addConditionBlocked', calc);
				}
			});
		},

		apply() {
			this.initializeStore();
			this.initializeFormula();
			this.readyAvailable();
			this.clearFormula();
			this.calculate();

			this.addToBlockedHiddenFields();

			this.$store.commit('updateFormula', this.formula);
			this.$store.commit('updateSubtotal', Object.values(this.calcStore));
			this.$store.dispatch('updateOpenAction', false);

			/** nullify payment and form values **/
			this.$store.commit('setShowMessage', false);
			this.$store.commit('setShowPayments', false);
			this.$store.dispatch('updateMethodAction', '');

			setTimeout(() => {
				this.loader = false
				window.ccbLoaded = true
			}, 1000)
		},

		/** common change for all fields **/
		change(value, alias, label, index) {
			this.fields[alias]['checked'] = true;
			this.initTotalSummaryAccordion();
			/** just for datepicker condition **/
			if (typeof this.fields[alias] !== "undefined" && alias.indexOf('date') !== -1) {

				this.fields[alias].value = value.value;
				this.fields[alias].viewValue = value.viewValue;

			} else if (typeof this.fields[alias] !== "undefined" && alias.indexOf('file_upload') !== -1) {

				this.fields[alias].value = value.price;
				this.fields[alias].files = value.files;

			} else if (typeof this.fields[alias] !== "undefined") {
				/** other fields condition **/

				this.fields[alias].value = value;

				if (typeof index !== "undefined")
					this.valuesStore[alias] = index;

				if (typeof label !== "undefined")
					this.fields[alias].extraLabel = label;
			}

			this.apply();
		},

		/** set date picker field value **/
		setStoreDatePicker(element) {
			/** return if date not choosen **/
			if (!element || element == 0 || typeof element == 'undefined') {
				return;
			}

			var vm = this;
			var extra = element.extraLabel ? `(${element.extraLabel})` : undefined;
			var viewValue = (element.viewValue && element.value != 0) ? element.viewValue : '';
			var value = element.value ? element.value : 0;

			if (viewValue.length > 0) {
				this.$store.getters.filterUnused(element);
			}

			vm.$set(vm.calcStore, element.alias, {
				extra,
				alias: element.alias,
				label: element.label,
				required: element.required,
				checked: element.checked,
				hidden: element.hidden,
				options: [{value: value, label: viewValue}],
				value: value,
				converted: viewValue
			});
		},

		/** set toggle and checkbox field values **/
		setStoreMultipleControlFields(element) {
			/** return if no data **/
			const vm = this;
			let sum = 0;
			let extra = '';
			let options = [];

			if (!element || element == 0 || typeof element.value == "undefined") {
				return;
			}

			if (element.value.hasOwnProperty('length')) {
				element.value.forEach(i => {
					let val = element.round ? Math.round(i.value) : i.value;
					val = element.unit ? this.validateUnit(val * element.unit) : val;
					i.value = val;
					i.converted = this.currencyFormat(val, element, this.currencySettings);
				});

				options = element.value;
				sum = element.value.reduce((a, b) => a + parseFloat(b.value), 0);

				var toFixedValue = 2; // default to fixed value is 2

				/** get max count of ints after comma for toFixedValue if no round**/
				if (!element.round) {

					element.value.forEach(i => {
						var fixedValue = (Math.floor(parseFloat(i.value).valueOf()) === parseFloat(i.value).valueOf()) ? 0 : parseFloat(i.value).toString().split(".")[1].length || 0;
						if (fixedValue > toFixedValue) {
							toFixedValue = fixedValue;
						}
					});
				}

				sum = Number.isInteger(+sum) ? +sum : (+sum).toFixed(toFixedValue);
				extra = `(${element.value.map(e => e.label).join(', ')})`;
				this.filterUnused(extra, element);
			}

			vm.$set(vm.calcStore, element.alias, {
				extra,
				value: sum,
				options: options,
				label: element.label,
				checked: element.checked,
				alias: element.alias,
				required: element.required,
				hidden: element.hidden,
				converted: this.currencyFormat(sum, element, this.currencySettings),
			});
		},

		setStoreMultiRangeField(element) {
			/** return if no data **/
			const vm = this;
			var extra = element.extraLabel ? `(${element.extraLabel})` : undefined;

			var elementValue = 0;
			if (element.value.hasOwnProperty('value')) {
				elementValue = element.value['value'];
			}

			let value;
			value     = element.unit ? this.validateUnit(elementValue * element.unit) : elementValue;
			value = element.round ? Math.round(value) : value;

			var options = [{
				value: value,
				label: element.value.value + ' (' + element.value.start + ' - ' + element.value.end + ') '
			}];

			this.filterUnused(extra, element);

			vm.$set(vm.calcStore, element.alias, {
				extra,
				value: value,
				unit: +element.unit ? +element.unit : 0,
				slideValue: element.value,
				alias: element.alias,
				label: element.label,
				options: options,
				required: element.required,
				checked: element.checked,
				hidden: element.hidden,
				converted: this.currencyFormat(value, element, this.currencySettings),
			});
		},

		setStoreNumberTypeFields(element) {
			/** return if no data **/
			const vm = this;
			var extra = element.extraLabel ? `(${element.extraLabel})` : undefined;
			var value = element.value ? element.value : 0;


			const slideValue = JSON.parse(JSON.stringify(value));
			const unit = +element.unit ? +element.unit : 0;

			value = element.unit ? this.validateUnit(value * element.unit) : value;
			value = element.round ? Math.round(value) : parseFloat(value);

			var options = [];
			if (element.unit > 1) {
				options = [{value: value, label: element.value}];
			}

			this.filterUnused(extra, element);
			vm.$set(vm.calcStore, element.alias, {
				extra,
				value,
				unit,
				slideValue,
				alias: element.alias,
				label: element.label,
				checked: element.value ? element.checked : false,
				required: element.required,
				options: options,
				hidden: element.hidden,
				converted: this.currencyFormat(value, element, this.currencySettings),
			});
		},

		setStoreFloatTypeFields(element) {
			const vm = this;
			var extra = element.extraLabel ? `(${element.extraLabel})` : undefined;
			var unit = +element.unit ? +element.unit : 0;
			var value = element.value ? element.value : 0;
			value = element.unit ? this.validateUnit(value * element.unit) : value;
			value = element.round ? Math.round(value) : parseFloat(value);

			this.filterUnused(extra, element);
			vm.$set(vm.calcStore, element.alias, {
				extra,
				value,
				unit,
				alias: element.alias,
				label: element.label,
				checked: element.value ? element.checked : false,
				required: element.required,
				options: [{value: value, label: element.value}],
				hidden: element.hidden,
				converted: this.currencyFormat(value, element, this.currencySettings),
			});
		},

		/** set radio and drop down field values **/
		setStoreSingleControlFields(element) {
			const vm = this;
			var extra = element.extraLabel ? `(${element.extraLabel})` : undefined;
			var value = element.value ? element.value.toString() : '';

			let fieldValue = parseFloat(value.split('_')[0]);

			fieldValue = isNaN(+fieldValue) ? 0 : +fieldValue;
			fieldValue = element.round ? Math.round(+fieldValue) : +fieldValue;
			fieldValue = element.unit ? this.validateUnit(fieldValue * element.unit) : +fieldValue;

			if (fieldValue > 0) {
				this.$store.getters.filterUnused(element);
			}

			/** if value exist remove from list of unvalid required fields **/
			if (value || value.length > 0) {
				this.filterUnused(value, element);
			}

			var checked = false;
			var optionLabel = element.label;

			if (element.value && element.value.length > 0) {
				var fieldToData = vm.calc_data.fields.filter(function (item) {
					return item.alias === element.alias
				})[0];
				var valueIndex = element.value.split('_');

				if (this.isObjectHasPath(fieldToData, ['options', valueIndex[1], 'optionText'])) {
					optionLabel = fieldToData.options[valueIndex[1]].optionText;
					checked = true;
				}
			}

			vm.$set(vm.calcStore, element.alias, {
				extra,
				value: fieldValue,
				alias: element.alias,
				label: element.label,
				checked: checked,
				required: element.required,
				hidden: element.hidden,
				options: [{value: fieldValue, temp: value, converted: fieldValue, label: optionLabel}],
				converted: this.currencyFormat(fieldValue, element, this.currencySettings),
			});
		},

		setStoreFileField(element) {
			const vm = this;
			var checked = false;
			var extra = element.extraLabel ? `(${element.extraLabel})` : element.label;
			var value = parseFloat(element.value);

			var options = {value: [], label: ''};
			if (element.hasOwnProperty('files') && element.files.length > 0) {
				options.value = element['files'];
				options.label = 'file names is here';
				checked = true;
			}

			this.filterUnused(extra, element);
			vm.$set(vm.calcStore, element.alias, {
				extra,
				value: value,
				unit: 0,
				alias: element.alias,
				label: element.label,
				options: options,
				required: element.required,
				checked: checked,
				hidden: element.hidden,
				converted: this.currencyFormat(value, element, this.currencySettings),
			});
		},

		initializeStore() {
			const vm = this;
			const fields = Object.values(vm.fields);
			if (fields.length) {
				fields.forEach(element => {

					var fieldName = element.alias.replace(/\_field_id.*/, '');
					if (fieldName == 'datePicker') {
						/** Set datepicker field value **/
						this.setStoreDatePicker(element);

					} else if (['file_upload'].includes(fieldName)) {
						/** Set checkbox | toggle field value **/
						this.setStoreFileField(element);

					} else if (['toggle', 'checkbox'].includes(fieldName)) {
						/** Set checkbox | toggle field value **/
						this.setStoreMultipleControlFields(element);

					} else if (['radio', 'dropDown', 'dropDown_with_img'].includes(fieldName)) {//dropDown add later
						/** Set drop down | radio field value **/
						this.setStoreSingleControlFields(element);

					} else if (fieldName == 'multi_range') {
						/** Set multi range field value **/
						this.setStoreMultiRangeField(element);

					} else if (['range'].includes(fieldName)) {
						/** Set number  fields value **/
						this.setStoreNumberTypeFields(element);

					} else if (['quantity'].includes(fieldName)) {
						/** Set float  fields value **/
						this.setStoreFloatTypeFields(element);

					} else if (fieldName == 'total') {
						/** Set custom total value **/
						element.value = element.round ? Math.round(element.value) : element.value;

						vm.$set(vm.calcStore, element.alias, {
							value: element.value,
							label: element.label,
							alias: element.alias,
							required: element.required,
							hidden: element.hidden,
							converted: this.currencyFormat(element.value, element, this.currencySettings),
						});

					} else {
						/** set other elements  **/
						const extra = element.extraLabel ? `(${element.extraLabel})` : undefined;
						this.filterUnused(extra, element)
						vm.$set(vm.calcStore, element.alias, {
							extra: extra,
							alias: element.alias,
							label: element.label,
							hidden: element.hidden,
							required: element.required,
							converted: fieldName === 'text' ? element.value : '',
							value: fieldName === 'text' ? element.value : 0,
						});
					}
				});
			}
			this.$store.commit('setCalcStore', vm.calcStore);
		},

		readyAvailable() {
			if (this.formula && this.formula.length) {
				this.formula = Object.assign([], this.parseFormula(this.formula, Object.values(this.calcStore)));
			}
		},

		initializeFormula() {
			this.formula = JSON.parse(JSON.stringify(this.formulaConst));
			this.formula.forEach(item => {
				item.formula = item.formula.replace(/\r?\n|\r/g, " ").trim();
				this.formula.forEach(itemInner => {
					if (item.formula.indexOf(itemInner.alias) !== -1 && itemInner.alias.indexOf('total') === -1) {
						let replacer = new RegExp('\\b' + itemInner.alias + '\\b', 'g')
						item.formula = item.formula.replace(replacer, itemInner.formula);
					}
				});
			});
		},

		parseFormula(formula, fields) {
			formula
				.forEach(item => {
					fields
						.forEach(field => {
							if (field.alias.indexOf('total') === -1) {
								/** replace field id to its value **/
								let replacer = new RegExp('\\b' + field.alias + '\\b', 'g')
								item.formula = item.formula.replace(replacer, field.value);
							}
						})
				});
			return formula;
		},

		clone(data) {
			return JSON.parse(JSON.stringify(data))
		},

		clearFormula() {
			const totals = {};
			const totalWithTotals = [];

			this.formula.map(element => {
				/** if have correct formula data ( no total field in formula ) **/
				if (element.formula.includes('total_field_id_') === false) {
					/** get all totals without totals inside **/
					totals[element.alias] = {value: element.formula};
				} else {
					/** get all totals with total fields inside **/
					totalWithTotals.push(element.alias);
				}
			});

			/** set correct data for totals formula which have total fields inside **/
			totalWithTotals.forEach(totalElementAliasWithTotalInside => {
				var totalElementWithTotalInside = this.formula.find(formulaItem => formulaItem.alias === totalElementAliasWithTotalInside);
				let newFormula = totalElementWithTotalInside.formula;

				/** replace totals which have just fields data inside **/
				Object.keys(totals).forEach(totalAliasWithFullFormula => {
					newFormula = newFormula.split(
						totalAliasWithFullFormula).join(eval(totals[totalAliasWithFullFormula].value));
				})

				/** replace totals which have fields and total data inside **/
				if (newFormula.includes('total_field_id_')) {
					var totalElementAliases = newFormula.match(/(\btotal_field_id_\S+\b)/ig);
					totalElementAliases.forEach(totalToReplaceAlias => {
						var totalToReplace = this.formula.find(formulaItem => formulaItem.alias === totalToReplaceAlias);
						newFormula = newFormula.split(totalToReplaceAlias).join(totalToReplace.formula);
					})
				}
				totalElementWithTotalInside.formula = newFormula;
			});
		},

		calculate() {
			this.formula
				.forEach(element => {
					let summary = eval(element.formula);
					element.total = (summary !== summary || !isFinite(summary)) ? 0 : summary;

					const {totalSymbol, totalSymbolSign} = element

					if (totalSymbol && typeof totalSymbolSign !== 'undefined') {
						element.converted = this.currencyFormat(element.total, {currency: true}, {
							...this.currencySettings,
							currency: totalSymbolSign
						})
					} else {
						element.converted = this.currencyFormat(element.total, {currency: true}, this.currencySettings);
					}

				});
		},

		/** get additional classes for total fiels **/
		getCustomTotalCls(fieldAlias) {
			var cls = ''
			if (this.fields.hasOwnProperty(fieldAlias)) {
				cls = this.fields[fieldAlias].additionalStyles;
			}
			return cls;
		},

		...ToolTip,
		...Helpers,
		...Condition,
		...Customize,
		...WooLinks,
	},

	filters: {
		'dots': (value, price, style) => {
			const strLen = (value + price).length;
			const count = style === 'vertical' ? 16 : 80;
			const labelLen = style === 'vertical' ? 26 : 50;
			const len = labelLen - strLen < 0 ? 0 : labelLen - strLen;

			return strLen > labelLen ? '.'.repeat(count) : '.'.repeat(parseInt(count + len));
		},

		to_short(value, container, len = 40) {
			value = value || '';
			if (container === 'vertical' && value.length >= len) {
				return value.substring(0, len) + '...';
			}
			return value;
		}
	},
}
