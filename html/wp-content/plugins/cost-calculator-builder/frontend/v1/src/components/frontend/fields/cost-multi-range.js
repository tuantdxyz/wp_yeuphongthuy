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
        min: 0,
        step: 1,
        max: 100,
        leftVal: 0,
        rightVal: 0,
        rangeSlider: {},
        multiRange: null,
        multiRangeValue: 0,
    }),

    created() {
        this.multiRange = this.parseComponentData();
        if (this.multiRange.alias ) {
            this.min  = this.multiRange.minValue;
            this.max  = this.multiRange.maxValue
            this.step = this.multiRange.step;

            if ( this.multiRange.hidden !== true) {
                this.leftVal  = this.initValue(this.multiRange.default_left, this.min) ;
                this.rightVal = this.initValue(this.multiRange.default_right, this.max, true) ;
            }
            this.applyCss();
        }
    },

    mounted() {
        this.renderRange();
        this.change();
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
        calcStore() {
            return this.$store.getters.getCalcStore;
        },
        getStyles() {
            return this.$store.getters.getCustomStyles
        },
    },
    watch: {
        value(val) {

            if ( val.hasOwnProperty('start') && val.hasOwnProperty('end')
                && ( val.start != this.leftVal || val.end != this.rightVal ) ) {

                this.leftVal  = this.initValue(val.start, this.min);
                this.rightVal = this.initValue(val.end, this.max, true);
                this.rangeSlider.value = [this.leftVal, this.rightVal];
                this.change();
            }
            if ( val == 0){
                this.leftVal  = 0;
                this.rightVal = 0;
                this.rangeSlider.value = [this.leftVal, this.rightVal];
                this.change();
            }
        },
    },
    methods: {
        initValue(value, secondVal, isMax) {
            let defaultVal = value ? value : 0
            if (isMax)
                return defaultVal > secondVal ? secondVal : defaultVal

            return defaultVal < secondVal ? secondVal : defaultVal
        },

        renderRange() {
            const vm = this;
            this.rangeSlider = new Slider({
                min: +this.min, max: +this.max,
                value: [this.leftVal, this.rightVal],
                step: +this.step,
                type: 'Range',
                tooltip: {
                    isVisible: true,
                    showOn: 'Focus',
                    placement: 'Before'
                },
                change: args => {
                    const [left, right] = args.value;
                    vm.leftVal = left;
                    vm.rightVal = right;
                    this.change();
                }
            });
            this.rangeSlider.appendTo( `*[data-calc-id="${this.id}"] .range_${vm.multiRange.alias}`);
        },

        change() {
            var value = {
                'value':parseInt(this.rightVal) - parseInt(this.leftVal),
                'start': this.leftVal,
                'end': this.rightVal,
            };

            this.$emit(this.multiRange._event, value, this.multiRange.alias);
            this.$emit('condition-apply', this.multiRange.alias)
        },

        applyCss() {
            const styles = this.getStyles
            const calcId = this.$store.getters.getSettings.calc_id || this.$store.getters.getId
            const id     = `ccb-multi-slider-style-${calcId}`
            let style     = ''

            if (!styles.hasOwnProperty('range-button'))
                return

            const range     = styles['range-button']

            style +=   `.e-control-wrapper.e-slider-container.e-material-slider .e-slider .e-handle.e-handle-first,
                        .e-slider-tooltip.e-tooltip-wrap.e-popup,
                        .e-control-wrapper.e-slider-container .e-slider .e-handle {
                          background: ${range.circleColor} !important;}`;

            style +=   `.e-slider-tooltip.e-tooltip-wrap.e-popup:after {
                              border-color: ${range.circleColor} transparent transparent transparent !important;}`;

            style +=   `.e-control-wrapper.e-slider-container .e-slider .e-range {
                             background: ${range.lineColor} !important; }`;

            style +=   `.e-control-wrapper.e-slider-container.e-horizontal .e-slider-track {
                             background: ${range.fColor} !important; }`;

            const selector = $('#' + id)
            if ( selector.length ) selector.remove()
            $('head').append(`<style type="text/css" id="${id}">${style}</style>`)
        }
    }
}