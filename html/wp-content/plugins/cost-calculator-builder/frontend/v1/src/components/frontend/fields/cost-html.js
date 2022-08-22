export default  {
    props: {
        field: [Object, String],
    },

    data: () => ({
        htmlContent: '',
        htmlField: null,
    }),

    created() {
        this.htmlField = this.parseComponentData();
        this.htmlContent = this.htmlField.htmlContent;
    },
    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.htmlField.alias)
                && this.$store.getters.getCalcStore[this.htmlField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
    }
}