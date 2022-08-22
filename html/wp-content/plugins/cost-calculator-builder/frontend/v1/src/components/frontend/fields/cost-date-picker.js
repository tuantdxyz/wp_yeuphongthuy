import customDateCalendarField from "@components/v1/frontend/fields/cost-custom-date-calendar"

export default  {
    props: {
        field: [Object, String],
    },
    components: {
        customDateCalendarField,
    },
    data: () => ({
        dateField: {},
    }),

    created() {
        this.dateField       = this.parseComponentData();
        this.dateField.range = parseInt(this.dateField.range)
    },
    computed: {
        additionalCss() {
            if ( this.$store.getters.getCalcStore.hasOwnProperty(this.dateField.alias)
                && this.$store.getters.getCalcStore[this.dateField.alias].hidden === true ) {
                return 'display: none;';
            }else{
                return '';
            }
        },
        translations () {
            return this.$store.getters.getTranslations;
        },
    },
    methods: {
       /** set datePicker field data **/
       setDatetimeField( dateValue ) {
           if (typeof dateValue !== "undefined") {

               this.$emit(this.dateField._event, dateValue, this.dateField.alias, this.dateField.label);
               this.$emit('condition-apply', this.dateField.alias);
           }
       },
   }
}