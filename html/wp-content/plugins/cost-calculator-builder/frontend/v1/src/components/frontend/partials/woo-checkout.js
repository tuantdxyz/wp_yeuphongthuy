import Helpers from "../../../utils/helpers";

export default {
    data: () =>  ({
        loader: false,
        message: false,
    }),

    methods: {
        async applyWoo(post_id) {
            /** IF demo or live site ( demonstration only ) **/
            if ( this.$store.getters.getIsLiveDemoLocation ) {
                var demoModeDiv = this.getDemoModeNotice();
                var purchaseBtn = this.$el.querySelector('.ccb-btn-wrap button');
                purchaseBtn.parentNode.parentNode.after(demoModeDiv);
                return;
            }
            /** END| IF demo or live site ( demonstration only ) **/

            if ( this.$store.getters.hasUnusedFields )
                return
            this.loader = true;
            this.loader = await this.$store.dispatch('applyWoo', post_id);
        },
        ...Helpers,
    },

    computed: {
        getSettings() {
            return this.$store.getters.getSettings
        },

        getWooCheckoutSettings() {
            return this.getSettings.woo_checkout
        }
    },
}