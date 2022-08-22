import $ from "jquery";
const _ = require('lodash');

export default {
    props: {
        field: [Object, String],
        disabled: {
            type: Boolean,
            default: false
        },
        currencyFormat: {
            type: Function,
            default: () => {},
        },
        value: {
            default: '',
        },
    },

    data: () => ({
        dropDownField: {},
        current: null,
        openList: false,
    }),

    created() {
        this.initStyles();
        this.initCssEffects();
        this.dropDownField = this.parseComponentData();
        this.selectValue = this.value;
        const option = this.getOptions.find(o => o.value === this.value)
        this.selectOption(option, false);
    },

    mounted() {
        this.initListeners();
    },

    watch: {
        value(val) {
            if (val && val.toString().indexOf('_') === -1) {
                Array
                    .from(this.dropDownField.options)
                    .forEach((element, index) => element.optionValue === val ? this.selectValue = val + '_' + index : null);
            } else if ( val.length === 0 ) {
                this.selectValue = '0';
            } else {
                this.selectValue = val;
            }
        }
    },

    methods: {
        initListeners() {
            window.removeEventListener('click', this.listenerHandler);
            window.addEventListener('click', this.listenerHandler)
        },

        listenerHandler(e) {
            const $target = e.target;
            const $prevent = e.path.find(p => p._prevClass === 'calc-drop-down-with-image-current');
            const accessOpen = (!$target.matches('.calc-drop-down-with-image-current') && !$prevent);
            if ((($target.matches('.calc-drop-down-with-image-current') && $target.dataset.alias !== this.dropDownField.alias) || accessOpen)
                && !($prevent && $prevent.dataset.alias === this.dropDownField.alias)) {
                this.openList = false;
            }
        },

        initStyles() {
            this.styles = _.cloneDeep(this.testStyles);
            this.styles.padding = this.styles.padding
                .split?.(' ')
                .filter(p => p)
                .map((p, idx) => !(idx % 2) ? `${(parseInt(p) - 1.5)}px` : p)
                .join(' ');
        },

        selectOption(element, toggle = true) {
            this.openList = toggle ? !this.openList : this.openList;
            if ( element ) {
                const {src, label, value} = element;
                this.current = {src, label, value};
                this.selectValue = value;
            } else {
                this.current = null;
                this.selectValue = 0;
            }
        },

        initCssEffects() {
            const calcId    = this.$store.getters.getSettings.calc_id || this.$store.getters.getId;
            const id        = `ccb-drop-down-with-img-style-${calcId}`;
            const selector  = $('#' + id);
            const styles    = `.calc-drop-down-with-image-list-items li:hover {background-color: ${this.styles?.['color']}1a;}`;
            if ( selector.length ) selector.remove();
            $('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
        }
    },

    computed: {
        styles() {
            const styles = _.cloneDeep(this.$store.getters.getCustomStyles['drop-down']);
            styles.padding = styles.padding
                .split?.(' ')
                .filter(p => p)
                .map((p, idx) => !(idx % 2) ? `${(parseInt(p) - 3)}px` : p)
                .join(' ');
            return styles;
        },

        currencySettings() {
            return this.$store.getters.getSettings?.currency
        },

        getDefaultImg() {
            return this.$store.getters.getDefaultImg
        },

        getCurrent: {
            get() {
                return this.current;
            },

            set(src, label, value) {
                this.current = {src, label, value};
            }
        },

        getOptionStyles() {
            return {
                fontWeight: this.styles?.['font-weight'],
                color: this.styles?.['color'],
                fontSize: this.styles?.['font-size'],
                borderBottomStyle: this.styles?.['border-style'],
                borderBottomColor: this.styles?.['border-color'],
                borderBottomWidth: this.styles?.['border-width'].split(' ').pop(),
            };
        },

        gerArrowsStyles() {
            /** Uncomment code if need to pass text color to arrows **/
            return {
                // borderLeftColor: this.styles?.['color'],
                // borderTopColor: this.styles?.['color'],
            };
        },

        getListStyles() {
            return {
                background: this.styles?.['color'],
                backgroundColor: this.styles?.['background-color'],
                backgroundImage: this.styles?.['background-image'],
                backgroundSize: this.styles?.['background-size'],
            };
        },

        getStyles() {
            return this.styles;
        },

        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.dropDownField.alias)
                && this.$store.getters.getCalcStore[this.dropDownField.alias].hidden === true ) {
                return 'display: none;';
            } else {
                return '';
            }
        },

        getOptions() {
            let result = [];
            if (this.dropDownField.options)
                result = Array
                    .from(this.dropDownField.options)
                    .map((element, index) => ({
                        label: element.optionText,
                        src: element.src || this.getDefaultImg,
                        value: `${element.optionValue}_${index}`,
                        converted: this.currencyFormat(this.dropDownField.allowRound ? Math.round(element.optionValue) : element.optionValue, {currency: true}, this.currencySettings),
                    }));

            return result;
        },

        selectValue: {
            get() {
                return this.value;
            },

            set(value) {
                if ( value === 0 ) {
                    this.$emit(this.dropDownField._event, 0, this.dropDownField.alias, '');
                    this.$emit('condition-apply', this.dropDownField.alias);
                }

                if ( !value )
                    return;

                let [, index] = value.split('_');
                let option = null;
                this.getOptions
                    .forEach(( element, key ) => {
                        if (!option && element.value == value && index == key)
                            option = JSON.parse(JSON.stringify(element));
                    });

                setTimeout(() => {
                    this.$emit(this.dropDownField._event, value, this.dropDownField.alias, option ? option.label : '');
                    this.$emit('condition-apply', this.dropDownField.alias)
                });
            }
        },
    },
}