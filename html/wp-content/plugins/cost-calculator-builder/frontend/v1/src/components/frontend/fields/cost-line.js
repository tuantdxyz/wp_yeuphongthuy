export default  {
    props: {
        field: [Object, String],
    },

    data: () => ({
        lineField: null,
    }),

    created() {
        this.lineField = this.parseComponentData();
    },

    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.lineField.alias)
                && this.$store.getters.getCalcStore[this.lineField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },

        getLine() {
            let result = {};

            if (typeof this.lineField !== "undefined" && this.lineField.size) {
                result.width             = this.lineField.len;
                result.borderBottomWidth = this.lineField.size;
                result.borderBottomStyle = this.lineField.style;
            }
            const custom = this.$store.getters.getCustomStyles['hr-line'];
            return {...result, ...custom}
        },
    }

}