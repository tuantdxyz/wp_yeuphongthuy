import parser from '@plugins/v1/parser'
import formPayment from "./form-payment";
import Helpers from "../../../utils/helpers";
const $ = require('jquery')

export default {
	components: {
		'form-payments': formPayment,
	},
	data: () => ({
		nonces: window.ccb_nonces,
		initOnce: true,
		close: false,
		allowSend: true,
		$current: null,
		stripe: false,
		redirectData: {},
		sendFields: [
			{name: 'name', required: true, value: ''},
			{name: 'email', required: true, value: ''},
			{name: 'phone', required: true, value: ''},
			{name: 'message', required: false, value: ''},
		],
		errorCaptcha: false,
		errorMessage: false,
		errorContactForm: false,
		successMessage: false,
		requires: [
			{required: false},
			{required: false},
			{required: false},
			{required: false},
		],
	}),

	created() {
		this.cleanFormData();
	},

	mounted() {
		setTimeout(() => {
			this.$current = this.$store.getters.getCurrent;
			this.initCaptcha();
		}, 500);
	},

	computed: {

		orderId: {
			get() {
				return this.$store.getters.getOrderId
			},

			set(id) {
				this.$store.commit('setOrderId', id)
			}
		},

		getHideCalc: {
			get() {
				return this.$store.getters.getHideCalc;
			},

			set(val) {
				this.$store.commit('updateHideCalc', val);
			}
		},

		loader: {
			get() {
				return this.$store.getters.getLoader;
			},
			set(val) {
				this.$store.commit('setLoader', val);
			}
		},

		showPayments: {
			get() {
				return this.$store.getters.getShowPayments;
			},
			set(val) {
				this.$store.commit('setShowPayments', val);
			}
		},

		getSettings() {
			return this.$store.getters.getSettings;
		},

		getStripeSettings() {
			return this.getSettings
				? this.getSettings.stripe
				: {}
		},

		formData() {
			return this.getSettings.formFields;
		},

		open: {
			get() {
				return this.$store.getters.getOpen
			},

			set(val) {
				this.$store.dispatch('updateOpenAction', val);
			}
		}
	},

	methods: {
		parseSubtotal( fields, type ) {
			const exceptions = ['total', 'text', 'html', 'line'];

			if (type === 'text') {
				let subtotal = '';

				Array.from(fields)
					.forEach( element => {

						var fieldName = element.alias.replace(/\_field_id.*/,'');

						if ( !exceptions.includes( fieldName ) && element.hidden !== true ) {

							if (element.slideValue !== undefined && element.unit !== undefined &&
								element.unit > 0 && element.unit !== 1) {
								subtotal += `${element.label} ( ${element.slideValue} x ${element.unit} )`;
							} else {
								subtotal += `${element.label}`;
							}

							if (element.extra) subtotal +=  ` ${element.extra}`;
							subtotal += ` ${element.converted}` + '\n';
						}
					});

				return subtotal
			} else if (type === 'array') {

				let result = [];

				fields.forEach(item => {
					var fieldName = item.alias.replace(/\_field_id.*/,'');

					if ( !exceptions.includes( fieldName ) && item.hidden !== true ) {

						if ( item.checked ) {
							let res = {
								alias: item.alias,
								title: item.label,
								value: item.value
							}

							if ( item.hasOwnProperty('options') && item.options.length > 0 ) {
								res.options = item.options.map(option => {
									return {
										label: option.label,
										value: option.value
									}
								})
							}

							result.push(res)
						}
					}
				})

				return result
			}
		},
		getOrderFiles( data ){
			let files = [];
			var data  = Object.values(data).filter(field => ['file_upload'].includes(field.alias.replace(/\_field_id.*/,'')));
			data.forEach(item => {
				files.push( { 'alias': item.alias, 'files': item.options.value });
			});

			return files;
		},

		showDemoNotice( buttonObj ){
			var demoModeDiv = this.getDemoModeNotice();
			buttonObj.parentNode.parentNode.after(demoModeDiv)
		},

		async sendData(event) {
			/** IF demo or live site ( demonstration only ) **/
			if ( this.$store.getters.getIsLiveDemoLocation ) {
				var demoModeDiv = this.getDemoModeNotice();
				event.target.parentNode.parentNode.after(demoModeDiv);
				return;
			}
			/** END| IF demo or live site ( demonstration only ) **/

			const vm            = this;
			const captcha       = this.getSettings.recaptcha
			let access          = true;
			let ccb_recaptcha   = ''
			let captcha_access  = true

			if ( typeof grecaptcha !== 'undefined' && captcha.enable ) {
				if (captcha.type === 'v2') {
					Array.prototype.forEach.call(document.querySelectorAll('.g-rec'), element => {
						const id        = element.getAttribute('id')
						const widgetId  = parseInt(element.getAttribute('data-widget_id'))
						if ( id === this.getSettings['calc_id'] )
							ccb_recaptcha = grecaptcha.getResponse(widgetId);

						grecaptcha.reset($(this).data('widget_id'));
					})

					if (!ccb_recaptcha) {
						this.errorCaptcha   = true;
						this.successMessage = false;
						return;
					}
				} else if (captcha.type === 'v3') {
					captcha_access = false
					grecaptcha.ready(() => {
						grecaptcha.execute(captcha.v3.siteKey, {action: 'submit'}).then(token => {
							captcha.token = token
							captcha_access = true
						});
					});
				}
			}

			vm.sendFields.forEach((element, index) => {
				if (element.required && !(element.value.length > 0)) {
					vm.requires[index].required = true;
					access = false;
				} else
					vm.requires[index].required = false;
			});

			if ( access ) {

				let interval = setInterval(() => {
					if (captcha_access) {
						vm.loader = true;
						let data = {
							mainInfo: '',
							action: 'calc_contact_form',
							sendFields: vm.sendFields,
							clientEmail: vm.sendFields[1].value,
							subject:   this.formData.emailSubject,
							calcTotals: this.$store.getters.getFormula,
							userEmail: this.formData.adminEmailAddress,
							descriptions: this.$store.getters.getSubtotal,
							calcId: this.$store.getters.getCalcId,
							files: this.getOrderFiles(this.$store.getters.getSubtotal),
							nonce: this.nonces.ccb_contact_form,
						};

						if ( captcha.enable && captcha.type === 'v3' ) {
							data.captchaSend = true
							data.captcha = captcha
						}

						const orderDetails = {
							id: this.$store.getters.getCalcId,
							calcName: this.$store.getters.getSettings.title,
							total: this.$store.getters.getFormula[0].total,
							calcTotals: this.$store.getters.getFormula,
							currency: this.$store.getters.getSettings.currency.currency,
							orderDetails: this.parseSubtotal(this.$store.getters.getSubtotal, 'array'),
							formDetails: {
								form: 'Default Contact Form',
								fields: vm.sendFields
							},
							paymentMethod: 'no_payments', // by default - no_payments
							files: this.getOrderFiles(this.$store.getters.getSubtotal),
						}

						/** if payment enabled and just one payment enabled, overwrite payment method **/
						if ( this.$store.getters.getSettings.formFields.payment && this.formData.paymentMethods.length == 1) {
							orderDetails.paymentMethod = this.formData.paymentMethods[0];
						}

						const response = this.$store.dispatch('sendForm', data);
						response.then(result => {
							if (result.success) {

								this.$store.dispatch('addOrder', orderDetails).then((response) => {
									this.orderId = response.data.order_id;

									setTimeout(() => {
										vm.errorCaptcha = false;
										vm.errorMessage = false;
										vm.errorContactForm = false;
										vm.successMessage = true;
										vm.resetFields();


										/** if payment enabled and just one payment enabled, overwrite payment method **/
										if ( this.$store.getters.getSettings.formFields.payment && this.formData.paymentMethods.length > 0) {

											if ( this.formData.paymentMethods.length == 1 && this.formData.paymentMethods[0] !== 'stripe'){

												this.renderPaymentAfterSubmit(this.formData.paymentMethods[0]);

											} else if ( this.formData.paymentMethods.length > 1 || (this.formData.paymentMethods.length == 1 && this.formData.paymentMethods[0] === 'stripe') ) {

												this.showPayments = true;
												vm.loader         = false;
											}
										} else {
											vm.loader = false;
										}
									}, 500)
								})
							} else {
								setTimeout(() => {
									vm.errorCaptcha = true
									vm.errorContactForm = true
									vm.errorMessage = false
									vm.successMessage = false
									vm.loader = false
								}, 500)
							}
						})
						clearInterval(interval)
					}
				})
			} else {
				vm.errorMessage   = true;
				vm.errorCaptcha   = false;
				vm.successMessage = false;
				vm.errorContactForm = false
			}
		},

		cleanFormData(){
			this.successMessage = false;
			this.errorMessage   = false;
			this.$store.dispatch('updateOpenAction', false);
		},

		createOrder(event) {

			this.loader        = true;
			const orderDetails = {
				id: this.$store.getters.getCalcId,
				calcName: this.$store.getters.getSettings.title,
				total: this.$store.getters.getFormula[0].total,
				currency: this.$store.getters.getSettings.currency.currency,
				orderDetails: this.parseSubtotal(this.$store.getters.getSubtotal, 'array'),
				formDetails: {
					form: 'Contact Form 7',
					fields: event.detail.inputs
				},
				files: this.getOrderFiles(this.$store.getters.getSubtotal),
			}

			orderDetails.paymentMethod = 'no_payments';
			/** if payment enabled and just one payment enabled, overwrite payment method **/
			if ( this.$store.getters.getSettings.formFields.payment && this.formData.paymentMethods.length == 1) {
				orderDetails.paymentMethod = this.formData.paymentMethods[0];
			}

			this.$store.dispatch('addOrder', orderDetails).then(response => {
				this.$store.commit('setOrderId', response.data.order_id);

				/** if payment enabled and just one payment enabled, overwrite payment method **/
				if ( this.$store.getters.getSettings.formFields.payment && this.formData.paymentMethods.length > 0) {

					if ( this.formData.paymentMethods.length == 1 && this.formData.paymentMethods[0] !== 'stripe'){

						this.renderPaymentAfterSubmit(this.formData.paymentMethods[0], true);

					} else if ( this.formData.paymentMethods.length > 1 || (this.formData.paymentMethods.length == 1 && this.formData.paymentMethods[0] === 'stripe') ) {

						this.showPayments = true;
						this.loader       = false;
						this.hideContactForm();
					}
				}
			});
		},

		/**
		 * If send form is - contact form
		 * hide form data except message
		 * ps: bad pracitce
		 */
		hideContactForm() {
			if ( this.$el.getElementsByClassName('ccb-contact-form7').length <= 0 ){
				return;
			}
			if( this.$el.getElementsByClassName('ccb-contact-form7')[0].getElementsByTagName('form').length <= 0 ) {
				return;
			}

			let form     = this.$el.getElementsByClassName('ccb-contact-form7')[0].getElementsByTagName('form')[0];
			let formRows = [...form.getElementsByTagName('p')];
			formRows.forEach( (cfRow) => {
				if ( cfRow.style.display != "none" ){
					cfRow.classList.add("ccb-hidden");
					cfRow.style.display = "none";
				}
			} );
		},

		/**
		 * show form data
		 * ps: bad pracitce
		 */
		showContactForm() {
			if ( this.$el.getElementsByClassName('ccb-contact-form7').length <= 0 ) {
				return;
			}
			if( this.$el.getElementsByClassName('ccb-contact-form7')[0].getElementsByTagName('form').length <= 0 ) {
				return;
			}

			let form     = this.$el.getElementsByClassName('ccb-contact-form7')[0].getElementsByTagName('form')[0];
			let formRows = [...form.getElementsByTagName('p')];
			formRows.forEach( (cfRow) => {
				if ( cfRow.classList.contains('ccb-hidden') ){
					cfRow.classList.remove("ccb-hidden");
					cfRow.style.display = "block";
				}
			} );

			/** clean message **/
			if( form.getElementsByClassName('wpcf7-response-output').length > 0 ) {
				form.getElementsByClassName('wpcf7-response-output')[0].innerHtml = '';
				form.getElementsByClassName('wpcf7-response-output')[0].innerText = '';
			}
		},

		toggleOpen() {
			if ( this.$store.getters.hasUnusedFields ) { return;}

			this.cleanFormData();
			this.showContactForm();
			this.loader = false;

			document.removeEventListener( 'wpcf7mailsent', event => {
				if ( this.allowSend ) {
					this.createOrder(event);
					this.allowSend = false;
				}
			}, false);

			this.open      = true;
			this.allowSend = true;

			const texts = this.$current.querySelectorAll('.calc-item textarea');
			const textAreasText = typeof texts !== "undefined"
				? Array.from(texts).map(el => el && el.value + '\n').join('')
				: '';

			if ( this.formData.contactFormId ) {
				let subtotal = this.parseSubtotal(this.$store.getters.getSubtotal, 'text');
				let text = this.formData.body;

				if (text.indexOf('[ccb-subtotal]') !== -1) {
					let regex = '[ccb-subtotal]';
					text = text.replaceAll(regex, subtotal);
				}

				Array.from(this.$store.getters.getFormula)
					.forEach( ( element, index ) => {
						if (text.indexOf('[ccb-total-' + index + ']') !== -1) {
							let regex = '[ccb-total-' + index + ']';
							text = text.replaceAll(regex, element.converted);
						}
					});


				const $form = this.$current.querySelector('.wpcf7-form');
				let $textarea = $form.querySelector('textarea');

				if (textAreasText) text += '\n' + textAreasText;
				if ($textarea) $textarea.value = parser(text);
				if (typeof wpcf7 !== "undefined" && this.initOnce) {
					this.initOnce = false;
					if ( typeof wpcf7?.init === 'function' ) {
						const forms = document.querySelectorAll( '.wpcf7 > form' );
						forms.forEach( form => wpcf7.init( form ) );
					} else {
						$( 'div.wpcf7 > form' ).each( function() {
							let $form = $( this );
							wpcf7.initForm( $form );
							if ( wpcf7.cached ) {
								wpcf7.refill( $form );
							}
						});
					}
				}
			} else {
				this.sendFields[3].value += '\n' + textAreasText.trim();
			}

			/** IF demo or live site ( demonstration only ) **/
			if ( this.$store.getters.getIsLiveDemoLocation && document.querySelector('.wpcf7-submit') !== null ) {
				var submitFormBtn = document.querySelector('.wpcf7-submit');
				submitFormBtn.type = 'button';
				submitFormBtn.onclick = () => { this.showDemoNotice(submitFormBtn);};
				return;
			}
			/** END| IF demo or live site ( demonstration only ) **/

			setTimeout(() => {
				document.addEventListener( 'wpcf7mailsent', event => {
					if ( this.allowSend ) {
						this.createOrder(event);
						this.allowSend = false;
					}
				}, false);
			}, 2000);
		},

		resetFields() {
			let vm = this;
			vm.sendFields.forEach(function (element) {
				element.value = '';
			});
		},

		initCaptcha() {
			const captcha = this.getSettings.recaptcha || {}
			if ( captcha.enable && captcha.v2 && captcha.v3 ) {
				const selected_captcha = captcha[captcha.type]
				this.renderCaptchaFunc(selected_captcha, captcha.type);
				this.renderCaptchaScript(selected_captcha, captcha.type);
			}
		},

		renderCaptchaFunc(captcha, type) {
			const g_res = this.$current.querySelectorAll('.g-rec')
			if (type === 'v2') {
				window.ccbCaptchaFnc = () => {
					g_res
						.forEach( element => {
							let ccb_id = grecaptcha.render(element, {'sitekey': captcha.siteKey});
							element.setAttribute('data-widget_id', ccb_id);
						});
				}
			}
		},

		renderCaptchaScript(captcha, type) {
			const src_store = {
				'v2': 'https://www.google.com/recaptcha/api.js?onload=ccbCaptchaFnc&render=explicit',
				'v3': `https://www.google.com/recaptcha/api.js?render=${captcha.siteKey}`,
			}
			const script = document.createElement('script');
			script.src = src_store[type]
			script.setAttribute('defer', '');
			script.setAttribute('async', '');
			const firstScriptTag = document.querySelectorAll('script')[0];
			firstScriptTag.parentNode.insertBefore(script, firstScriptTag);
		},

		renderPaymentAfterSubmit(type, isCForm7 = false) {
			const vm = this;

			switch (type) {
				case 'woo_checkout': {
					vm.$store.dispatch('applyWoo');

					if (!isCForm7) {
						setTimeout(() => {
							this.cleanFormData();
						}, 2000);
					}
					break;
				}
				case 'paypal': {
					const data = {
						calc_id:this.getSettings.calc_id,
						action: 'ccb_paypal_payment',
						method: type,
						paypal_info: this.getSettings.paypal,
						invoice: this.orderId,
						order_id: this.orderId,
						calcTotals: this.$store.getters.getFormula,
						descriptions: this.$store.getters.getSubtotal,
						thousands_separator: this.getSettings.currency.thousands_separator,
						nonce: this.nonces.ccb_paypal,
					};

					this.$store.commit('updateMethodCommit', 'paypal');
					this.$store.dispatch('fetchPayment', data);

					if (!isCForm7) {
						setTimeout(() => {
							this.cleanFormData();
						}, 2000);
					}

					break;
				}
				case 'stripe': {
					if (isCForm7) {
						this.$store.dispatch('updateStripeAction', true);
					}

					vm.loader   = false;
					this.stripe = true;

					setTimeout(() => {
						vm.successMessage = false;
					}, 2000);

					break;
				}

				default: break;
			}
		},

		...Helpers,
	}
}
