export default {
    props: {
        field: {
            type: Object,
            default: {},
        },

        id: {
            default: null,
        },

        order: {
            default: 0,
        },

        index: {
            default: null,
        },
    },

    data: () => ({
        radioField: {},
        errors: {}
    }),

    mounted() {
        this.radioField = {...this.resetValue(), ...this.field};
        if (this.radioField._id === null) {
            this.radioField._id = this.order;
            this.radioField.alias = this.radioField.alias + this.radioField._id;
        }
        this.radioField.required = this.radioField.hasOwnProperty('required') ? JSON.parse(this.radioField.required) : false
        if (!this.radioField.default) this.radioField.default = '';
    },

    computed: {
        options() {
            let options = [];
            if (this.radioField && this.radioField.options)
                options = Array.from(this.radioField.options).filter(e => e.optionText);

            if (!this.radioField.default) this.radioField.default = '';

            return options;
        },

        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    methods: {

        addOption: function () {
            this.radioField.options.push({optionText: '', optionValue: '',});
        },

        changeDefault(event, val, index) {
            const vm = this;
            let [, indexValue] = vm.radioField.default.split('_');
            if (indexValue == index) vm.radioField.default = val + '_' + index;
        },

        numberCounterActionForOption( optionIndex, action = '+' ){
            var input = document.querySelector('input[name=option_'+optionIndex+']');

            var step  = 1;
            if ( !this.radioField.options.hasOwnProperty(optionIndex) || input === null ){
                return;
            }

            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = 0;
            if ( this.radioField.options[optionIndex].optionValue.length > 0 ) {
                value = this.radioField.options[optionIndex].optionValue;
            }

            if ( action === '-'){
                value = parseFloat(value) - parseFloat(input.step);
            }else{
                value = parseFloat(value) + parseFloat(input.step);
            }

            if( input.min.length != 0 && value < input.min){
                return;
            }

            if ( parseInt(step) === parseFloat(step) ){
                value = value.toFixed();
            }else{
                value = value.toFixed(2);
            }

            this.removeErrorTip('errorOptionValue' + optionIndex);
            this.radioField.options[optionIndex].optionValue = value;
        },
        removeErrorTip(index) {
            var errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.radioField.default === optionValue + '_' + index)
                this.radioField.default = '';
            this.radioField.options.splice(index, 1)
        },

        resetValue() {
            return {
                label: '',
                _id: null,
                default: '',
                onValue: null,
                description: '',
                required: false,
                _event: 'change',
                allowRound: false,
                additionalCss: '',
                _tag: 'cost-radio',
                additionalStyles: '',
                allowCurrency: false,
                type: 'Radio Button',
                icon: 'fas fa-dot-circle',
                alias: 'radio_field_id_',
                desc_option: 'after',
                options: [
                    {
                        optionText: '',
                        optionValue: '',
                    }
                ],
            };
        },
        save(radioField, id, index, event) {

            this.validate(radioField, id, index, event);

            if (Object.keys(this.errors).length > 0) {
                return;
            }

            this.$emit('save', radioField, id, index)
        },
        validate(radioField, id, index, event) {
            delete this.errors.radio;

            if (radioField.options) {
                Array.from(this.radioField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errors.radio = true;
                        document.getElementById('errorOptionValue' + index).innerHTML = "<span class=\"error-tip\">this is required field</span>";
                    }
                })
            }
        },
    },
}