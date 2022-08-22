import { mapGetters } from '@libs/v1/vue/vuex';
import { enableRipple } from '@syncfusion/ej2-base';
enableRipple(true);
import { Slider } from '@syncfusion/ej2-inputs';
const $ = require('jquery')

export default {
    props: {
        id: {
            default: null,
        },
        value: {
            default: 0,
            type: [Number, String]
        },

        field: [Object, String],
    },
    data: () => ({
        rangeValue: 0,
        rangeField: null,
        min: 0,
        max: 100,
        step: 1,
        rangeObj: null,
        $calc: null,
    }),
    watch: {
        value(val) {
            const parsed = +val
            this.rangeValue = parsed
            this.rangeObj.value = parsed
            this.change()
        },
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.rangeField.alias)
                && this.$store.getters.getCalcStore[this.rangeField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },

        getStyles() {
            return this.$store.getters.getCustomStyles
        },

        ...mapGetters(['getSettings']),

        getFormatedValue() {
            return this.rangeField.allowCurrency ?
                this.currencyFormat(this.rangeValue, {currency: true}, {...this.getSettings.currency, currency: ''})
                : this.rangeValue;
        }
    },

    mounted() {
        this.$calc = $(`*[data-calc-id="${this.id}"]`)
        this.renderRange();
        this.change();
    },

    created() {
        this.rangeField = this.parseComponentData();
        if ( this.rangeField.alias ) {
            if ( this.rangeField.hidden !== true) {
                this.rangeValue = this.initValue()
            }

            this.min        = this.rangeField.minValue;
            this.max        = this.rangeField.maxValue
            this.step       = this.rangeField.step;
            this.applyCss();
        }
    },

    methods: {
        initValue() {
            let defaultVal  = this.rangeField.default ? this.rangeField.default : 0
            defaultVal      = +defaultVal < +this.rangeField.minValue ? this.rangeField.minValue : defaultVal
            return defaultVal
        },

        renderRange() {
            const vm = this;
            this.min = +this.min
            this.max = +this.max

            let calcId  = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
            vm.rangeObj = new Slider({
                min: this.min,
                max: this.max,
                value: this.rangeValue,
                step: this.step,
                type: 'MinRange',
                tooltip: {
                    cssClass: 'calc_id_' + calcId,
                    isVisible: true,
                    placement: 'Before'
                },
                change: args => {
                    this.rangeValue = args.value
                    this.change();
                },
            });

            vm.rangeObj.appendTo( `*[data-calc-id="${this.id}"] .range_${vm.rangeField.alias}`)
        },

        change() {
            this.$emit( this.rangeField._event, +this.rangeValue, this.rangeField.alias );
            this.$emit( 'condition-apply', this.rangeField.alias );
        },

        applyCss() {
            let style    = '';
            const calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
            const id     = `ccb-range-slider-style-${calcId}`;
            const styles = this.getStyles;

            if ( !styles.hasOwnProperty('range-button') )
                return;

            const range = styles['range-button'];

            style +=   `.ccb-wrapper-${calcId} .e-control-wrapper.e-slider-container.e-material-slider .e-slider .e-handle.e-handle-first,
                        body div.calc_id_${calcId}.e-slider-tooltip.e-tooltip-wrap.e-popup.e-tooltip-wrap.e-popup.e-material-default.e-material-tooltip-start,
                        .calc_id_${calcId}.e-slider-tooltip.e-tooltip-wrap.e-popup.e-tooltip-wrap.e-popup.e-material-default,
                        .calc_id_${calcId}.e-slider-tooltip.e-tooltip-wrap.e-popup,
                        .e-control-wrapper.e-slider-container .e-slider .e-handle {
                          background: ${range.circleColor} !important; }`;

            style +=   `.calc_id_${calcId}.e-slider-tooltip.e-tooltip-wrap.e-popup:after {
                              border-color: ${range.circleColor} transparent transparent transparent !important; }`;

            style +=   `.ccb-wrapper-${calcId} .e-control-wrapper.e-slider-container .e-slider .e-range {
                             background: ${range.lineColor} !important; }`;

            style +=   `.ccb-wrapper-${calcId} .e-control-wrapper.e-slider-container.e-horizontal .e-slider-track {
                             background: ${range.fColor} !important; }`;

            const selector = $('#' + id)
            if ( selector.length ) { selector.remove(); }

            $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
        }
    },
}