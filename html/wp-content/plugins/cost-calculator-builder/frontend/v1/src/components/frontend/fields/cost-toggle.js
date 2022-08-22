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
        toggleField: {},
        toggleValue: [],
    }),

    created() {
        this.toggleField = this.parseComponentData();
        this.toggleLabel = 'toggle_' + this.randomID();
        this.applyCss();
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.toggleField.alias)
                && this.$store.getters.getCalcStore[this.toggleField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
        getStyles() {
            return this.$store.getters.getCustomStyles
        },
        getOptions() {
            let result = [];
            if (this.toggleField.options) {

                result = Array.from(this.toggleField.options).map((element, index) => {
                    var checkElementType  = false;
                    if ( Array.isArray(this.toggleValue) ) {
                        checkElementType = this.toggleValue.some(checkedEl => checkedEl.temp == element.optionValue + '_' + index );
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
    },

    watch: {
        value(val) {
            if (typeof val === 'string' && val.toString().indexOf('_') === -1) {
                this.temp.forEach(element => {

                    const chValue = val + '_' + element.id;
                    const found = this.toggleValue.find(e => e.temp === chValue)

                    if (chValue === element.value && typeof found === "undefined") {
                        $('#' + this.toggleField.alias).find('input').each((e, i) => {
                            i.checked = i.value === chValue
                        });
                        this.toggleValue.push({value: +val, label: element.label, temp: chValue});
                    }
                });
            }else{
                this.toggleValue = val;
            }
            this.change({}, {}, false);
        }
    },

    methods: {
        change(event, label, def = true) {
            const vm = this;

            if( !Array.isArray(this.toggleValue) ){
                vm.toggleValue = [];
            }

            if ( def && event.target.checked ) {
                vm.toggleValue.push({value: parseFloat(event.target.value), temp: event.target.value, label});
            } else if ( def ) {
                if (vm.toggleValue.length === 1)
                    vm.toggleValue = [];
                else
                    vm.toggleValue = vm.toggleValue.filter(e => e.temp !== event.target.value);
            }
            this.$emit(vm.toggleField._event, vm.toggleValue, vm.toggleField.alias);
            this.$emit('condition-apply', this.toggleField.alias)
        },

        toggle( selector, label ) {
            const element = document.querySelector('#' + selector );
            if ( element ) {
                element.checked = !element.checked;

                this.change({ target: element }, label );
            }
        },

        applyCss() {
            let style    = '';
            const calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
            const id     = `ccb-toggle-style-${calcId}`;
            const styles = this.getStyles;

            if (!styles.hasOwnProperty('toggle'))
                return;

            const toggle = styles['toggle'];
            const className = `ccb-wrapper-${calcId}`

            style += `.${className}.calculator-settings .calc-toggle label:after { background-color: ${toggle.circleColor} !important; } `;
            style += `.${className}.calculator-settings .calc-toggle label  { background: ${toggle.bg_color} !important; } `;
            style += `.${className}.calculator-settings .calc-toggle input:checked + label   { background: ${toggle.checkedColor} !important; } `;

            const selector = $('#' + id)
            if (selector.length) selector.remove();
            $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
        }
    },
}