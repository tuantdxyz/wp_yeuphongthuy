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
        dropField: {},
        errors: {}
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        }
    },

    mounted() {
        this.dropField = {...this.resetValue(), ...this.field};
        if (this.dropField._id === null) {
            this.dropField._id       = this.order;
            this.dropField.alias     = this.dropField.alias + this.dropField._id;
        }

        this.dropField.required  = this.dropField.hasOwnProperty('required') ? JSON.parse(this.dropField.required) : false
        if (!this.dropField.default)  this.dropField.default = '';
    },

    methods: {
        numberCounterActionForOption( optionIndex, action = '+' ){
            var input = document.querySelector('input[name=option_'+optionIndex+']');

            var step  = 1;
            if ( !this.dropField.options.hasOwnProperty(optionIndex) || input === null ){
                return;
            }

            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = 0;
            if ( this.dropField.options[optionIndex].optionValue.length > 0 ) {
                value = this.dropField.options[optionIndex].optionValue;
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
            this.dropField.options[optionIndex].optionValue = value;
        },

        resetValue() {
            return {
                label: '',
                _id: null,
                default: '',
                description: '',
                required: false,
                _event: 'change',
                type: 'Drop Down',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                allowCurrency: false,
                _tag: 'cost-drop-down',
                icon: 'fas fa-chevron-down',
                alias: 'dropDown_field_id_',
                desc_option: 'after',
                options: [
                    {
                        optionText: '',
                        optionValue: '',
                    },
                ],
            };
        },

        save(dropField, id, index, event) {

            this.validate(dropField, id, index, event);

            if (Object.keys(this.errors).length > 0) {
                return;
            }

            this.$emit('save', dropField, id, index)
        },

        validate(dropField, id, index, event) {
            delete this.errors.dropField;

            if (dropField.options) {
                Array.from(this.dropField.options).map((element, index) => {
                    document.getElementById('errorOptionValue' + index).innerHTML = "";
                    if (element.optionValue.length === 0) {
                        this.errors.dropField = true;
                        document.getElementById('errorOptionValue' + index).innerHTML = "<span class=\"error-tip\">this is required field</span>";
                    }
                })
            }
        },

        changeDefault(event, val, index) {
            const vm = this;
            let [,indexValue] = vm.dropField.default.split('_');
            if(indexValue == index) vm.dropField.default = val + '_' + index;
        },

        removeErrorTip(index) {
            var errorClass = document.getElementById(index)
            while(errorClass.firstChild) errorClass.removeChild(errorClass.firstChild)
        },

        removeOption(index, optionValue) {
            if (this.dropField.default === optionValue + '_' + index)
                this.dropField.default = '';
            this.dropField.options.splice(index, 1)
        },

        addOption: function () {
            this.dropField.options.push({optionText: '', optionValue: '',});
        },
    },
}