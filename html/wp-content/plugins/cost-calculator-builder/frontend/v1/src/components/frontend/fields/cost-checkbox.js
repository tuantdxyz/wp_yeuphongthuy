const $ = require('jquery')
export default {
    props: {
        field: [Object, String],
        value: {
            default: '',
        },
    },
    data: () => ({
        temp: [],
        radioLabel: '',
        checkboxField: {},
        checkboxValue: [],
    }),

    created() {
        this.checkboxField = this.parseComponentData();
        this.checkboxLabel = 'option_' + this.randomID();
        this.applyCss();
    },

    watch: {
        value(val) {
            if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
                this.temp
                    .forEach( element => {
                        const chValue = val + '_' + element.id;
                        const found = this.checkboxValue.find(e => e.temp === chValue)
                        if(chValue === element.value && typeof found === "undefined") {
                            jQuery('#' + this.checkboxField.alias).find('input').each((e, i) => i.checked = i.value === chValue);
                            this.checkboxValue.push({value: +val, label: element.label, temp: chValue});
                        }
                    });
            }else{
                this.checkboxValue = val;
            }
            this.change({}, {}, false);
        },
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.field.alias)
                && this.$store.getters.getCalcStore[this.field.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
        getOptions() {
            let result = [];
            if (this.checkboxField.options) {

                result = Array.from(this.checkboxField.options)
                    .map( (element, index) => {
                        var checkElementType  = false;
                        if ( Array.isArray(this.checkboxValue) ) {
                            checkElementType = this.checkboxValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index );
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
        getStyles() {
          return this.$store.getters.getCustomStyles
        },
    },

    methods: {
        applyCss() {
            const styles = this.getStyles
            const calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
            const id     = `ccb-checkbox-style-${calcId}`;
            let style    = ''

            setTimeout(() => {
                if (styles.hasOwnProperty('checkbox')) {
                    const checkbox = styles['checkbox']
                    const className = `ccb-wrapper-${calcId}`

                    style += `.${className}.calculator-settings .calc-checkbox-item label::before  {background-color: ${checkbox.bg_color} !important; border: 1px solid ${checkbox.b_color} !important; } `
                    style += `.${className}.calculator-settings .calc-checkbox-item input[type="checkbox"]:checked ~ label:before { border: 1px solid  ${checkbox.checkedColor} !important; background: ${checkbox.checkedColor} !important; } `
                    style += `.${className}.calculator-settings .calc-checkbox-item label::after { border-left: 2px solid ${checkbox.checkbox_color} !important; border-bottom: 2px solid ${checkbox.checkbox_color} !important;} `

                    const selector = $('#' + id)
                    if ( selector.length ) selector.remove()
                    $('head').append(`<style type="text/css" id="${id}">${style}</style>`)
                }
            })
        },

        change(event, label, def = true) {
            const vm = this;

            if( !Array.isArray(this.checkboxValue) ){
                vm.checkboxValue = [];
            }

            if (def && event.target.checked) {
                vm.checkboxValue.push({value: parseFloat(event.target.value), label, temp: event.target.value});
            } else if ( def ){
                if(vm.checkboxValue.length === 1)
                    vm.checkboxValue = [];
                else
                    vm.checkboxValue = vm.checkboxValue.filter(e => e.temp !== event.target.value);
            }

            this.$emit(vm.checkboxField._event, vm.checkboxValue, vm.checkboxField.alias);
            this.$emit('condition-apply', this.checkboxField.alias)
        }
    }
}