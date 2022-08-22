import CBuilderFront from '@components/v1/frontend/cost-calc' // main-component front
export default {
    components: {  // init components
        'calc-builder-front': CBuilderFront, // Front main component and Preview
    },

    computed: {
        preview_data() {
            return {
                id          : this.getId,
                title       : this.getTitle,
                fields      : this.$validateData(this.getFields, 'builder'),
                styles      : this.getStyles,
                formula     : this.getFormula,
                settings    : this.$validateData(this.getSettings),
                currency    : this.$currencyData(this.getSettings),
                conditions  : this.$store.getters.getConditions,

                box_style   : this.box_style,
                container   : this.containerStyle,
                header_title: this.getContainerStyle
            }
        },

        getStyles() {
            return this.$store.getters.getCustomStyles
        },

        getContainerStyle() {
            return this.box_style === 'horizontal' ? 'h-container' : 'v-container'
        },

        getFields() {
            return this.$store.getters.getBuilder
        },

        getId() {
            return this.$store.getters.getId
        },

        getTitle() {
            return this.$store.getters.getTitle
        },

        getHeaderTitle() {
            return this.getSettings.general.header_title
        },

        getFormula() {
            return this.$store.getters.getFormulas
        },

        getSettings() {
            return this.$store.getters.getSettings
        },

        box_style() {
            return this.getSettings.general.boxStyle
        },

        getData() {

        },
    },

}