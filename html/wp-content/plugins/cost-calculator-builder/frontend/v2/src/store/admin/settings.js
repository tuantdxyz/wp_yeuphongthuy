export default {
    state: {
        forms: [],
        products: [],
        categories: [],
        desc_options: {},
        woo_meta_links: [],
        woo_meta_fields: ['price'],
        woo_actions: {
            'set_value': 'Set value',
            'set_value_disable': 'Set value and disable'
        },
        settings: {
            general: {
                header_title: 'Summary',
                descriptions: true,
                hide_empty: true,
                boxStyle: 'vertical',
            },
            currency: {
                currency: '$',
                num_after_integer: 2,
                decimal_separator: '.',
                thousands_separator: ',',
                currencyPosition: 'left_with_space',
            },
            texts: {
                title: 'Your service request has been completed!',
                description: 'We have sent your request information to your email.',
                issued_on: 'Issued on',
                reset_btn: 'Create new calculation',
                invoice_btn: 'Get invoice',
                required_msg: 'This field is required',
            },
            formFields: {
                fields: [],
                emailSubject: '',
                contactFormId: '',
                accessEmail: false,
                adminEmailAddress: '',
                submitBtnText: 'Submit',
                allowContactForm: false,
                body:   'Dear sir/madam\n' +
                    'We would be very grateful to you if you could provide us the quotation of the following:\n' +
                    '\nTotal Summary\n' +
                    '[ccb-subtotal]\n' +
                    'Total: [ccb-total-0]\n' +
                    'Looking forward to hearing back from you.\n' +
                    'Thanks in advance',
                payment: false,
                paymentMethod: '',
                paymentMethods: [],
            },

            paypal: {
                enable: false,
                description: '[ccb-total-0]',
                paypal_email: '',
                currency_code: '',
                paypal_mode: 'sandbox',
                formulas: [],
            },

            woo_products: {
                enable: false,
                category_id: '',
                hook_to_show: 'woocommerce_after_single_product_summary',
                hide_woo_cart: false,
                meta_links: [],
            },

            woo_checkout: {
                enable: false,
                product_id: '',
                redirect_to: 'cart',
                description: '[ccb-total-0]',
                formulas: [],
            },

            stripe: {
                enable: false,
                secretKey: '',
                publishKey: '',
                currency: 'usd',
                description: '[ccb-total-0]',
                formulas: [],
            },
            recaptcha: {
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

            notice: {
                requiredField: 'This field is required',
            },
            title: 'Untitled',
            icon: 'fas fa-cogs',
            type: 'Cost Calculator Settings',
        }
    },
    mutations: {
        setDescOptions(state, options) {
            state.desc_options = options || {};
        },
        updateAll(state, response) {
            state.desc_options = response.desc_options;
            state.forms = response.forms;
            state.products = response.products;
            state.categories = response.categories;
            state.woo_meta_links = typeof response.settings?.woo_products?.meta_links !== 'undefined' ?
                response.settings.woo_products.meta_links :
                [];

            if (response.settings && response.settings.general)
                state.settings = this._vm.$validateData(this._vm.$deepMerge(state.settings, response.settings));

        },

        updateSettings(state, settings) {
            if ( settings?.hasOwnProperty('general') )
                state.settings = this._vm.$validateData(this._vm.$deepMerge(state.settings, settings))
        },

        updateCalcId(state, id) {
            state.settings.calc_id = id
        },

        addWooMetaLink(state) {
            const defaultLink = {
                woo_meta: '',
                action: '',
                calc_field: '',
            };
            state.woo_meta_links.push(defaultLink);
            state.settings.woo_products.meta_links = [...state.woo_meta_links];
        },

        updateWooMetaLinks(state, links) {
            state.woo_meta_links = links;
            state.settings.woo_products.meta_links = [...state.woo_meta_links];
        },
    },
    getters: {
        getForms: state => state.forms,
        getSettings: state => state.settings,
        getProducts: state => state.products,
        getCategories: state => state.categories,
        getCalcId: state => state.settings.calc_id,
        getDescOptions: state => state.desc_options,
        getWooMetaLinks: state => state.woo_meta_links,
        getWooMetaFields: state => state.woo_meta_fields,
        getWooActions: state => state.woo_actions
    },
};
