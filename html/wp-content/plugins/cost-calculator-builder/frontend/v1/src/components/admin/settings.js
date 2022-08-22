export default {
	props: {
		settings: {},
	},
	data: () => ({
		id: null,
		payments: [
			{disabled: true, slug: 'paypal', name: 'PayPal', requiredSettingFields: ['paypal_email']},
			{disabled: true, slug: 'stripe', name: 'Stripe', requiredSettingFields: ['secretKey', 'publishKey']},
			{disabled: true, slug: 'woo_checkout', name: 'Woo Checkout', requiredSettingFields: ['product_id']},
		],
		currencies: [
			{alias: 'Euro', value: 'EUR'},
			{alias: 'Thai baht', value: 'THB'},
			{alias: 'Swiss franc', value: 'CHF'},
			{alias: 'Czech koruna', value: 'CZK'},
			{alias: 'Danish krone', value: 'DKK'},
			{alias: 'Indian rupee', value: 'INR'},
			{alias: 'Mexican peso', value: 'MXN'},
			{alias: 'Polish złoty', value: 'PLN'},
			{alias: 'Russian ruble', value: 'RUB'},
			{alias: 'Swedish krona', value: 'SEK'},
			{alias: 'Brazilian real', value: 'BRL'},
			{alias: 'Japanese yen 1', value: 'JPY'},
			{alias: 'Pound sterling', value: 'GBP'},
			{alias: 'Canadian dollar', value: 'CAD'},
			{alias: 'Norwegian krone', value: 'NOK'},
			{alias: 'Philippine peso', value: 'PHP'},
			{alias: 'Hong Kong dollar', value: 'HKD'},
			{alias: 'Singapore dollar', value: 'SGD'},
			{alias: 'Australian dollar', value: 'AUD'},
			{alias: 'Hungarian forint 1', value: 'HUF'},
			{alias: 'Israeli new shekel', value: 'ILS'},
			{alias: 'New Zealand dollar', value: 'NZD'},
			{alias: 'Malaysian ringgit 2', value: 'MYR'},
			{alias: 'New Taiwan dollar 1', value: 'TWD'},
			{alias: 'United States dollar', value: 'USD'},
		],
		modes: [
			{alias: 'Live', value: 'live'},
			{alias: 'Sandbox', value: 'sandbox'}
		],
	}),

	created() {
		this.id = this.$store.getters.getId;
		this.checkPaymentStatus();
	},

	computed: {
		settingsField: {
			get() {
				return this.$store.getters.getSettings;
			},

			set(value) {
				this.$store.commit('updateSettings', value);
			}
		},
	},

	methods: {
		checkPaymentStatus: function () {
			let vm = this;

			vm.payments.forEach((paymentType, paymentIndex) => {
				if (vm.settingsField[paymentType.slug].enable) {
					paymentType.requiredSettingFields.forEach(requiredField => {
						if (vm.settingsField[paymentType.slug].hasOwnProperty(requiredField)
							&& vm.settingsField[paymentType.slug][requiredField] !== "") {
							vm.payments[paymentIndex].disabled = false;
						}
					})
				}
			});
		},

		getPaymentNameBySlug(paymentSlug) {
			var payment = this.payments.filter(p => (p.slug === paymentSlug));
			if (payment.length > 0) {
				return payment[0].name;
			}
		},

		multiselectChooseSendFormPayments(payment) {

			var settingsField = Object.assign({}, this.settingsField);

			if (payment.disabled) {
				return;
			}

			if (!settingsField.formFields.hasOwnProperty('paymentMethods')) {
				settingsField.formFields.paymentMethods = [];
			}

			var paymentIndex = settingsField.formFields.paymentMethods.indexOf(payment.slug);
			/** disable **/
			if (paymentIndex !== -1) {
				settingsField.formFields.paymentMethods.splice(paymentIndex, 1);
			} else {
				/** enable **/
				settingsField.formFields.paymentMethods.push(payment.slug);
			}

			this.settingsField = settingsField;
		},

		removePaymentFromFormList(paymentSlug) {
			var settingsField = Object.assign({}, this.settingsField);
			var paymentIndex = settingsField.formFields.paymentMethods.indexOf(paymentSlug);

			if (paymentIndex !== -1) {
				settingsField.formFields.paymentMethods.splice(paymentIndex, 1);
			}

			this.settingsField = settingsField;
		}
	},

	updated() {
		let vm = this;
		vm.settingsField.formFields.allowContactForm = parseInt( vm.settingsField.formFields.contactFormId ) || false;
		vm.checkPaymentStatus();
	},
	watch: {
		'settingsField.currency.num_after_integer': function ( newValue, oldValue ) {
			if ( newValue < 0 || newValue > 8 ) {
				this.settingsField.currency.num_after_integer = oldValue;
			}
		}
	},

}