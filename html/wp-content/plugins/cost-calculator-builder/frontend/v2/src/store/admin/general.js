import fetchRequest from "@plugins/v2/fetchRequest"
import {toast} from "../../utils/toast";

export default {
	state: {
		dataLoaded: false,
		generalSettings: {
			currency: {
				use_in_all: false,
				currency: '$',
				num_after_integer: 2,
				decimal_separator: '.',
				thousands_separator: ',',
				currencyPosition: 'left_with_space',
			},
			form_fields: {
				use_in_all: false,
				emailSubject: '',
				adminEmailAddress: '',
				submitBtnText: 'Submit',
			},
			recaptcha: {
				use_in_all: false,
				enable: false,
				type: 'v2',
				v2: {
					siteKey: '',
					secretKey: '',
				},
				v3: {
					siteKey: '',
					secretKey: '',
				},
				options: {
					v2: 'Google reCAPTCHA v2',
					v3: 'Google reCAPTCHA v3',
				}
			},
			stripe: {
				use_in_all: false,
				secretKey: '',
				publishKey: '',
				currency: 'usd',
			},
			paypal: {
				use_in_all: false,
				paypal_email: '',
				currency_code: 'GBP',
				paypal_mode: 'sandbox',
			},
		}
	},

	actions: {
		async saveGeneralSettings({getters}) {
			const data = {
				settings: getters.getGeneralSettings,
				nonce: window.ccb_nonces.ccb_save_settings,
			};

			fetchRequest(`${window.ajaxurl}?action=calc_save_general_settings`, 'POST', data)
				.then(response => response.json())
				.then(response => {
					if ( response && response.success ) {
						toast('Settings saved successfully', 'success');
					} else {
						toast('Something went wrong', 'error');
					}
				})
		},

		async getGeneralSettings({commit}) {
			await fetchRequest(`${window.ajaxurl}?action=calc_get_general_settings`)
				.then(response => response.json())
				.then(response => {
					if (response && response.success) {
						commit('updateDataLoaded', true);
						if ( response.data.currency )
							commit('updateGeneralSettings', response.data);
					}
				});
		}
	},

	mutations: {
		updateGeneralSettings(state, settings) {
			state.generalSettings = this._vm.$validateData(this._vm.$deepMerge(state.generalSettings, settings))
		},

		updateDataLoaded(state, value) {
			state.dataLoaded = value;
		}
	},
	getters: {
		getGeneralSettings: state => state.generalSettings,
		getDataLoaded: state => state.dataLoaded,
	}
};