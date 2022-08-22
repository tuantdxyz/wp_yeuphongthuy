import Helpers from "../../../utils/helpers";
import fieldsMixin from "../fields/fieldsMixin";
export default {
    mixins: [fieldsMixin],
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
        btnStyles() {
            const appearance    = this.$store.getters.getAppearance;
            const btnAppearance = this.getElementAppearanceStyleByPath( appearance, 'elements.primary_button.data');

            let result = {};

            result['padding'] = [0, btnAppearance['field_side_indents']].join('px ') ;

            Object.keys(btnAppearance).forEach((key) => {
                if ( key === 'background' ){
                    result = {...result, ...btnAppearance[key]};
                }else if( key === 'shadow' ) {
                    result['box-shadow'] = btnAppearance[key];
                } else {
                    result[key] = btnAppearance[key];
                }
            });

            return result;
        },

        getSettings() {
            return this.$store.getters.getSettings
        },

        getWooCheckoutSettings() {
            return this.getSettings.woo_checkout
        }
    },
}