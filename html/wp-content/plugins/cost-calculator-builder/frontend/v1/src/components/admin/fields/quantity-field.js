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
        errors: { unit: false },
        quantityField: {},
    }),

    computed: {
        getDescOptions() {
            return this.$store.getters.getDescOptions
        },
        translations () {
            return this.$store.getters.getTranslations;
        },
    },

    mounted() {
        this.quantityField = { ...this.resetValue(), ...this.field };
        if (this.quantityField._id === null) {
            this.quantityField._id = this.order;
            this.quantityField.alias = this.quantityField.alias + this.quantityField._id;
        }
        this.quantityField.required  = this.quantityField.hasOwnProperty('required') ? JSON.parse(this.quantityField.required) : false
    },

    methods: {
        numberCounterAction( modelKey, action = '+' ){

            var input = document.querySelector('input[name='+modelKey+']');
            var step  = 1;
            if ( !this.quantityField.hasOwnProperty(modelKey) || input === null ){
                return;
            }
            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = this.quantityField[modelKey];
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

            this.quantityField[modelKey] = value;
        },

        save(quantityField, id, index, event) {

            if (!this.quantityField.unit) {
                this.errors.unit = this.translations.required_field;
                return;
            }

            this.$emit('save', quantityField, id, index)
        },
        resetValue() {
            return {
                unit: 1,
                label: '',
                _id:  null,
                default: '',
                description: '',
                placeholder: '',
                required: false,
                _event: 'keyup',
                type: 'Quantity',
                allowRound: false,
                additionalCss: '',
                additionalStyles: '',
                allowCurrency: false,
                enabled_currency_settings: false,
                _tag: 'cost-quantity',
                icon: 'fas fa-hand-peace',
                alias: 'quantity_field_id_',
                desc_option: 'after',
                step: 1,
            };
        },
    },
}