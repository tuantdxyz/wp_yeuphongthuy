// Admin store
import settings from './admin/settings'
import general from './admin/general'
import condition from './admin/condition'
import calculator from './admin/calculator'
import fetchRequest from "@plugins/v2/fetchRequest"

// Frontend store
import payments from './frontend/payments'
import wooCheckout from "./frontend/woo-checkout";
import calcForm from "./frontend/calc-form";
import orders from "./frontend/orders";

const getUnusedElements = elements => {

	/** Validation rules for required fields
	 *  quantity must be higher than 0
	 *  checkbox, toggle must have at least one selected element even if its value is 0
	 *  dropDown, radio a value must be selected even if its value is 0
	 *  datePicker must be choosen
	 * **/

	return elements.filter(element => (
		(element.alias.indexOf('quantity') !== -1 && element.value <= 0)
		|| ( ( element.alias.indexOf('file_upload') !== -1 && !element.checked ) )
		|| ((element.alias.indexOf('checkbox') !== -1 || element.alias.indexOf('toggle') !== -1) && element.options.length <= 0)
		|| ((element.alias.indexOf('dropDown') !== -1 || element.alias.indexOf('radio') !== -1) && (!element.options[0].temp || element.options[0].temp.length === 0))
		|| (element.alias.indexOf('datePicker') !== -1 && element.value <= 0)
		|| element.value < 0)
	);
}

const notExist = (elements, element) => {
	return (elements.filter(e => e.alias === element.alias)).length === 0
}

export default {
	state: {
		paymentType: '',
		issuedOn: '',
		notices: {},
		errorImg: null,
		successImg: null,
		$current: null,
		activeConditions: [],
		calcStore: [],
		conditionBlocked: [],
		createNew: false,
		createUrl: '',
		errors: {},
		formula: [],
		isExisting: true,
		modalType: '',
		open: false,
		openModal: false,
		subtotal: [],
		unusedFields: [],
		defaultImg: null,
		modalHide: false,
	},

	getters: {
		getOpen: s => s.open,
        getFormula: s => s.formula,
        getNotices: s => s.notices,
        getIssuedOn: s => s.issuedOn,
		getCurrent: s => s.$current,
		getErrorImg: s => s.errorImg,
		getSubtotal: s => s.subtotal,
		getCreateUrl: s => s.createUrl,
		getOpenModal: s => s.openModal,
		getModalType: s => s.modalType,
		getCreateNew: s => s.createNew,
		getModalHide: s => s.modalHide,
		getDefaultImg: s => s.defaultImg,
		getSuccessImg: s => s.successImg,
		getIsExisting: s => s.isExisting,
		getPaymentType: s => s.paymentType,
		getUnusedFields: s => s.unusedFields,
		conditionBlocked: s => s.conditionBlocked,
		activeConditions: s => s.activeConditions,

		getCalcStore: state => {
			return state.calcStore;
		},
		getErrors: s => s.errors,
		isUnused: state => item => {
			const fields = state.unusedFields.filter(field => field.alias === item.alias)
			return fields.length > 0
		},

		hasUnusedFields: state => {
			const requiredFields = Object
				.values(state.calcStore)
				.filter(field => field.required)
				.filter(field => notExist(state.conditionBlocked, field))

			state.unusedFields = getUnusedElements(requiredFields);
			return state.unusedFields.length && state.unusedFields.length > 0
		},

		filterUnused: state => element => {
			state.unusedFields = state.unusedFields.filter(e => element && element.alias && e.alias !== element.alias)
		},
	},

	mutations: {
		setCreateNew(state, val) {
			state.createNew = val;
		},

        setNotices(state, notices) {
		    state.notices = notices || {};
        },

        setPaymentType(state, pType) {
		    state.paymentType = pType || null;
        },

		setIssuedOn(state, issuedOn) {
		    state.issuedOn = issuedOn || '';
        },

		setModalHide(state, val) {
			state.modalHide = val;
		},

		removeActiveCondition(state, condition) {
			let index = state.activeConditions.findIndex(c => (c.optionFrom == condition.optionFrom
				&& c.optionTo == condition.optionTo
				&& c.sort == condition.sort
				&& c.action == condition.action));

			if (index >= 0) {
				state.activeConditions = [
					...state.activeConditions.slice(0, index),
					...state.activeConditions.slice(index + 1)
				]
			}
		},

		addActiveCondition(state, condition) {
			if (state.activeConditions.filter(c =>
				(c.optionFrom == condition.optionFrom && c.optionTo == condition.optionTo && c.sort == condition.sort
					&& c.action === condition.action)).length == 0) {
				state.activeConditions.push(condition);
			}
		},

		removeFromConditionBlocked(state, element) {
			state.conditionBlocked = state.conditionBlocked.filter(field => field.alias !== element.alias)
		},

		addConditionBlocked(state, element) {
			if (notExist(state.conditionBlocked, element)) {
				state.conditionBlocked.push(element)
			}
		},

		setUnusedFields(state, unusedFields) {
			state.unusedFields = unusedFields;
		},

		setCalcStore(state, calcStore) {
			state.calcStore = calcStore;
		},

		setErrors(state, errors) {
			state.errors = errors;
		},

		setOpenModal(state, val) {
			state.openModal = val
		},

		setModalType(state, type) {
			if (type !== '')
				state.openModal = true
			state.modalType = type;
		},

		setCreateUrl(state, url) {
			state.createUrl = url;
		},

		updateSubtotal(state, subtotal) {
			state.subtotal = subtotal;
		},

		updateFormula(state, formula) {
			state.formula = formula;
		},

		updateOpen(state, val) {
			state.open = val;
		},

		updateCurrent(state, val) {
			state.$current = val;
		},

		updateIsExisting(state, val) {
			state.isExisting = val;
		},

		setDefaultImg(state, value) {
			state.defaultImg = value;
		},

		setErrorImg(state, value) {
			state.errorImg = value;
		},

		setSuccessImg(state, value) {
			state.successImg = value;
		}
	},

	actions: {
		async saveSettings({getters, commit}) {
			const data = {
				id: getters.getId,
				title: getters.getTitle,
				formula: getters.getFormulas,
				conditions: getters.getConditions,
				settings: this._vm.$validateData(getters.getSettings),
				builder: this._vm.$validateData(getters.getBuilder, 'builder'),
				nonce: window.ccb_nonces.ccb_save_settings,
				appearance: getters.getAppearance,
			}

			fetchRequest(`${window.ajaxurl}?action=calc_save_settings`, 'POST', data)
				.then(response => response.json())
				.then(response => {
					if ( response.success )
						commit('setResponseData', response.calculators);
				})
		},

		updateOpenAction({commit}, val) {
			commit('updateOpen', val);
		},

		updateCurrentAction({commit}, val) {
			commit('updateCurrent', val);
		}
	},

	modules: {
		/** admin **/
		settings,
		condition,
		calculator,
		general,

		/** front **/
		payments,
		wooCheckout,
		calcForm,
		orders
	},
};
