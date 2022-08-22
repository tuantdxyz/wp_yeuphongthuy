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
        errors: {
            unit: false,
            step: false,
            maxValue: false,
            minValue: false
        },
        multiRangeField: {},
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
        this.multiRangeField = {...this.resetValue(), ...this.field};
        if (this.multiRangeField._id === null) {
            this.multiRangeField._id = this.order;
            this.multiRangeField.alias = this.multiRangeField.alias + this.multiRangeField._id;
        }
    },

    methods: {

        numberCounterAction( modelKey, action = '+' ){

            var input = document.querySelector('input[name='+modelKey+']');
            var step  = 1;
            if ( !this.multiRangeField.hasOwnProperty(modelKey) || input === null ){
                return;
            }
            if( input.step.length !== 0 ){
                step = input.step;
            }

            var value = this.multiRangeField[modelKey];
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

            this.multiRangeField[modelKey] = value;
        },

        save(multiRangeField, id, index, event) {

            if (this.multiRangeField.minValue === '') {
                this.errors.minValue = this.translations.required_field;
            }

            if (this.multiRangeField.maxValue === '') {
                this.errors.maxValue = this.translations.required_field;
            }

            if (this.multiRangeField.step === '') {
                this.errors.step = this.translations.required_field;
            }

            if (this.multiRangeField.unit === '') {
                this.errors.unit = this.translations.required_field;
            }

            if (Object.keys(this.errors).length > 0) {
                return;
            }
            this.$emit('save', multiRangeField, id, index)
        },

        resetValue: function () {
            return {
                step: 1,
                unit: 1,
                label: '',
                _id: null,
                minValue: 0,
                maxValue: 100,
                description: '',
                _event: 'change',
                default_left: 0,
                default_right: 50,
                additionalCss: '',
                allowRound: false,
                type: 'Multi Range',
                additionalStyles: '',
                allowCurrency: false,
                _tag: 'cost-multi-range',
                icon: 'fas fa-exchange-alt',
                alias: 'multi_range_field_id_',
                desc_option: 'after',
            }
        }
    },
}