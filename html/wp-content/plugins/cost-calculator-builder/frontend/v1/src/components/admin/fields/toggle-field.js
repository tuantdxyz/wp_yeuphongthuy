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
        toggleField: {},
        errors: {},
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    mounted() {
        this.toggleField = { ...this.resetValue(), ...this.field };
        if (this.toggleField._id === null) {
            this.toggleField._id = this.order;
            this.toggleField.alias = this.toggleField.alias + this.toggleField._id;
        }
        this.toggleField.required  = this.toggleField.hasOwnProperty('required') ? JSON.parse(this.toggleField.required) : false
    },

    methods: {
        addOption: function () {
            this.toggleField.options.push({optionText: '', optionValue: '', optionHint: ''});
        },

        numberCounterActionForOption( optionIndex, action = '+' ){
            var input = document.querySelector('input[name=option_'+optionIndex+']');

            var step  = 1;
            if ( !this.toggleField.options.hasOwnProperty(optionIndex) || input === null ){
                return;
            }

            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = 0;
            if ( this.toggleField.options[optionIndex].optionValue.length > 0 ) {
                value = this.toggleField.options[optionIndex].optionValue;
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
            this.toggleField.options[optionIndex].optionValue = value;
        },

        removeErrorTip(index) {
            var errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.toggleField.default === optionValue + '_' + index)
                this.toggleField.default = '';
            this.toggleField.options.splice(index, 1)
        },

        resetValue() {
            return {
                _id: null,
                label: '',
                type: 'Toggle',
                description: '',
                required: false,
                _event: 'change',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                allowCurrency: false,
                _tag: 'cost-toggle',
                icon: 'fas fa-toggle-on',
                alias: 'toggle_field_id_',
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

        save(toggleField, id, index, event) {

            this.validate(toggleField, id, index, event);

            if (Object.keys(this.errors).length > 0) {
                return;
            }

            this.$emit('save', toggleField, id, index)
        },

        validate(toggleField, id, index, event) {
            delete this.errors.toggle;

            if (toggleField.options) {
                Array.from(this.toggleField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errors.toggle = true;
                        document.getElementById('errorOptionValue' + index).innerHTML = "<span class=\"error-tip\">this is required field</span>";
                    }
                })
            }
        },
    },
}