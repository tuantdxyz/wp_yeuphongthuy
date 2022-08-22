const $ = require('jquery')
export default {
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
        this.applyCss();
    },

    watch: {
        value(val) {
            // if ( val === this.radioValue ){ return; }

            if(val && val.toString().indexOf('_') === -1) {
                Array.from(this.radioField.options).forEach((element, index) => {
                    if( element.optionValue ===  val) {
                        this.radioValue = val + '_' + index;
                    }
                })
            }else{
                this.radioValue = val;
            }
        },
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.radioField.alias)
                && this.$store.getters.getCalcStore[this.radioField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
        getStyles() {
            return this.$store.getters.getCustomStyles
        },

        radioValue: {
            get() {
                return this.value;
            },

            set(value) {
                if ( value === 0 ){
                    this.$emit(this.radioField._event, 0, this.radioField.alias, '');
                    this.$emit('condition-apply', this.radioField.alias);
                }

                if( !value ) { return;}

                let [, index] = value.split('_');
                let option    = null;

                this.getOptions
                    .forEach(( element, key ) => {
                        if(!option && element.value === value && index == key){
                            option = JSON.parse(JSON.stringify(element));
                        }
                    });

                const val   = option ? value : '';
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

    methods: {
        applyCss() {
            let style = '';
            const id = 'ccb-radio-style';
            const styles = this.getStyles;

            if (!styles.hasOwnProperty('radio-button'))
                return;

            const radio = styles['radio-button'];

            style += `body .calculator-settings .calc-radio-item input[type="radio"] { border: 1px solid ${radio.radioBorder}; } `; //""radioBorder""
            style += `.calculator-settings .calc-radio-item input[type="radio"] { background-color: ${radio.radioBackground} !important; } `; //"radioBackground"
            style += `.calculator-settings .calc-radio-item input[type='radio']:checked:before { background: ${radio.radioBackground} !important; } `; //"radioBackground"
            style += `.calculator-settings .calc-radio-item input[type='radio']:checked { background: ${radio.radioChecked} !important; } `; // "radioChecked"
            style += `.calculator-settings .calc-radio-item input[type='radio']:checked { border: 0 !important;  } `;

            const selector = $('#' + id)
            if (selector.length) selector.remove();
            $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
        }
    },
}