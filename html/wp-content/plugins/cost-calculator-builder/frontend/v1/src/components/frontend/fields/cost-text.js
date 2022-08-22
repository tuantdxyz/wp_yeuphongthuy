export default  {
    props: {
        field: [Object, String],
    },

    data: () => ({
        textareaValue: '',
        labelId: '',
        textField: null,
    }),

    created() {
        this.textField = this.parseComponentData();
        this.labelId = 'text_area_'
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.textField.alias)
                && this.$store.getters.getCalcStore[this.textField.alias].hidden === true ) {
                return 'display: none;';
            } else {
                return '';
            }
        },
    },

    methods: {
        onChange() {
            this.$emit('change', this.textareaValue, this.textField.alias)
        }
    },
}