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
        checkboxField: {},
        errors: {}
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    mounted() {
        this.checkboxField = {...this.resetValue(), ...this.field};
        if (this.checkboxField._id === null) {
            this.checkboxField._id = this.order;
            this.checkboxField.alias = this.checkboxField.alias + this.checkboxField._id;
        }
        this.checkboxField.required  = this.checkboxField.hasOwnProperty('required') ? JSON.parse(this.checkboxField.required) : false
    },

    methods: {
        addOption: function () {
            this.checkboxField.options.push({optionText: '', optionValue: '', optionHint: ''});
        },

        numberCounterActionForOption( optionIndex, action = '+' ){
            var input = document.querySelector('input[name=option_'+optionIndex+']');

            var step  = 1;
            if ( !this.checkboxField.options.hasOwnProperty(optionIndex) || input === null ){
                return;
            }

            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = 0;
            if ( this.checkboxField.options[optionIndex].optionValue.length > 0 ) {
                value = this.checkboxField.options[optionIndex].optionValue;
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
            this.checkboxField.options[optionIndex].optionValue = value;
        },

        removeErrorTip(index) {
            var errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.checkboxField.default === optionValue + '_' + index)
                this.checkboxField.default = '';
            this.checkboxField.options.splice(index, 1)
        },

        resetValue() {
            return {
                _id: null,
                label: '',
                description: '',
                required: false,
                _event: 'change',
                type: 'Checkbox',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                allowCurrency: false,
                _tag: 'cost-checkbox',
                icon: 'fas fa-check-square',
                alias: 'checkbox_field_id_',
                desc_option: 'after',
                options: [
                    {
                        optionText: '',
                        optionValue: '',
                        optionHint: '',
                    }
                ],
            };
        },

        save(checkboxField, id, index, event) {

            this.validate(checkboxField, id, index, event);

            if (Object.keys(this.errors).length > 0) {
                return;
            }

            this.$emit('save', checkboxField, id, index)
        },

        validate(checkboxField, id, index, event) {
            delete this.errors.checkbox;

            if (checkboxField.options) {
                Array.from(this.checkboxField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errors.checkbox = true;
                        document.getElementById('errorOptionValue' + index).innerHTML = "<span class=\"error-tip\">this is required field</span>";
                    }
                })
            }
        },
    },
}