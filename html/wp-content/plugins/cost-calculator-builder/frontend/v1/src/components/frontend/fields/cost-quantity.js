export default  {
    props: {
        value: {
            default: 0,
            type: [Number, String]
        },
        field: [Object, String],
    },

    data: () => ({
        clearValue: 0,
        quantityField: null,
        quantityValue: 0,
        step: 1,
    }),

    watch: {
        /** set value from store **/
        calcStore: {
            handler: function( calcStore ) {
                if ( calcStore.hasOwnProperty( this.quantityField.alias ) && parseFloat(this.calcStore[this.quantityField.alias].value) != this.clearValue ) {
                    var value  = this.quantityField.unit ? (parseFloat(calcStore[this.quantityField.alias].value)/this.quantityField.unit) : parseFloat(calcStore[this.quantityField.alias].value);
                    if ( this.clearValue != value ){
                        this.quantityValue = this.parseQuantityValue(value);
                    }
                    return;
                }
            },
            deep: true
        },

        quantityValue( value ) {
            if ( value === '' || value.length <= 0 || value < 0 ){
                value           = 0;
                this.clearValue = 0;
            }

            /** rm not digits,dot,comma from quantityValue **/
            var regWithoutCurrencySettings = new RegExp('^[0-9 ]*(.|,)?[0-9 ]*$');
            if ( !this.currencySettingsEnabled && !regWithoutCurrencySettings.test(value.toString()) ) {
                /** leave only numbers **/
                this.quantityValue = value.replace(/[^\d-]/g, '');
                return;
            }

            var regWithCurrencySettings = new RegExp('^[+-]?(?:\\d+|\\d{1,3}(?:(,|s|\'|.)\\d{3})*)(?:(\\.|,)\\d*)?$');
            if ( this.currencySettingsEnabled && !regWithCurrencySettings.test(value.toString()) ){
                this.quantityValue = value.replace(/[^\d-]/g, '');
                return;
            }

            if ( this.numAfterInteger > 0 ){
                /** clear from decimal part firstly **/
                var intValue  = value.split(this.decimalSeparator);
                var decimals  = '';
                if ( intValue.length > 1 ) {
                    decimals  = intValue.slice(-1);
                    intValue.pop();
                }
                var intValue    = intValue.join('').split(this.thousandsSeparator);

                this.clearValue = parseFloat(intValue.join('') + '.' + decimals[0]);
            }else{
                var intValue    = value.split(this.thousandsSeparator);
                this.clearValue = parseFloat(intValue.join(''));
            }

            this.change();
            return;
        }
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.quantityField.alias)
                && this.$store.getters.getCalcStore[this.quantityField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
        calcStore() {
            return this.$store.getters.getCalcStore;
        },
        currencySettingsEnabled() {
            return (this.quantityField.hasOwnProperty('enabled_currency_settings') && this.quantityField.enabled_currency_settings);
        },
        decimalSeparator() {
            var decimal_separator = ','; // by default use comma
            if ( Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'decimal_separator'])) {
                decimal_separator = this.settings.currency.decimal_separator;
            }
            return decimal_separator;
        },
        getStyles() {
            return this.$store.getters.getCustomStyles
        },
        inputStyles() {
            if ( this.$store.getters.getCustomStyles.hasOwnProperty('input-fields') ) {
                var styles = Object.assign({}, this.$store.getters.getCustomStyles['input-fields']);
                delete styles.width;
                return styles;
            }
            return '';
        },
        settings() {
            return this.$store.getters.getSettings;
        },
        thousandsSeparator() {
            var separator = ','; // by default use comma
            if ( Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'thousands_separator'])) {
                separator = this.settings.currency.thousands_separator;
            }
            return separator;
        },
        numAfterInteger(){
            if ( Object.keys(this.settings.currency).length && this.isObjectHasPath(this.settings, ['currency', 'num_after_integer'])) {
                return this.settings.currency.num_after_integer || 0;
            }
            return 0;
        }
    },

    created() {
        this.clearValue    = this.value;
        this.quantityField = this.parseComponentData();
        this.quantityValue = this.parseQuantityValue(this.value);

        this.change();

        if ( this.quantityField.hasOwnProperty('step') ) {
            this.step = this.quantityField.step;
        }

        this.applyCss();
    },

    methods: {
        intValueFilter($event) {
            let keyCode = ($event.keyCode ? $event.keyCode : $event.which);
                if ((keyCode < 48 || keyCode > 57) && keyCode !== 46) { // 46 is dot
                    $event.preventDefault();
                }
        },
        applyCss() {
            const $      = jQuery;
            const styles = this.getStyles;
            const calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId;
            const id     = `ccb-quantity-style-${calcId}`;
            let style    = '';

            setTimeout(() => {
                if (styles.hasOwnProperty('input-fields')) {
                    const quantity = styles['input-fields']
                    const className = `ccb-wrapper-${calcId}`

                    style += `.${className}.calculator-settings .calc-input-wrapper {width: ${quantity.width} !important; } `;

                    const selector = $('#' + id)
                    if ( selector.length ) selector.remove()
                    $('head').append(`<style type="text/css" id="${id}">${style}</style>`)
                }
            })
        },

        change() {
            this.$emit(this.quantityField._event, this.clearValue, this.quantityField.alias);
            this.$emit('condition-apply', this.quantityField.alias);
        },

        decrement( event ) {
            if ( this.clearValue !== 0 ) {
                this.clearValue    = parseFloat(this.clearValue) - parseFloat(this.step);
                this.quantityValue = this.parseQuantityValue(this.clearValue);
            }

        },

        increment( event ) {
            this.clearValue    = parseFloat(this.clearValue) + parseFloat(this.step);
            this.quantityValue = this.parseQuantityValue(this.clearValue);
        },

        parseField(){
            this.quantityValue = this.parseQuantityValue(this.clearValue);
        },

        parseQuantityValue( value ) {
            value = value.toString().replace(',', '.');

            if ( !this.currencySettingsEnabled ) {
                value = parseFloat(value).toFixed(0);
                return value;
            }

            if ( isNaN(value) || value.length == 0 ){
                value = 0;
            }

            if ( this.numAfterInteger > 0 ){
                /** set num_after_integer **/
                value = parseFloat(value).toFixed(parseInt(this.numAfterInteger));

                /** set decimal separator **/
                value = value.toString().replace(/\.|,/, this.decimalSeparator);

                /** set thousand separator **/
                var intValue = value.split(this.decimalSeparator);

                value = intValue[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);

                value += this.decimalSeparator + intValue[1];
            }else{
                value = value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
            }


            return value;
        },
    }
}
