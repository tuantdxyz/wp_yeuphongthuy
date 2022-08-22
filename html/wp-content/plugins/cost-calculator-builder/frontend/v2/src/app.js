import Vue from '@libs/v2/vue/vue.min'
import mixin from '@mixins/v2/index' // mixin/
import CBuilder from '@components/v2/admin/index' // main-component admin
import CBOrders from '@components/v2/admin/pages/orders' // orders component
import CBuilderFront from '@components/v2/frontend/cost-calc' // main-component front
import loader from '@components/v2/loader' // pre-loader
import loaderWrapper from "@components/v2/frontend/partials/loaderWrapper";
import vSelect from 'vue-select'

const {cloneDeep} = ccb_lodash;
const $ = require('jquery')

/****************** Plugins ******************/
import uriPlugin from '@plugins/v2/checkUri' // uri plugin
import getRequest from '@plugins/v2/getRequest' // getRequest plugin
import postRequest from '@plugins/v2/postRequest' // postRequest plugin
import validateData from '@plugins/v2/validateData' // Validate data plugin
import deepMerge from '@plugins/v2/deepMerge' // Merge data plugin
import currencyData from '@plugins/v2/currencyData' // currency data plugin
/****************** Plugins end ******************/
import 'vue-select/dist/vue-select.css';

/****************** Fields start ******************/
import draggable from '@libs/v2/vue/draggable'
import Vuex from '@libs/v2/vue/vuex'
import store from '@store/v2/index' // vuex
import frontend_fields from './components/frontend/fields'
import moment from 'moment-timezone'

// register helper function globally
Vue.use(uriPlugin)
Vue.use(getRequest)
Vue.use(postRequest)
Vue.use(validateData)
Vue.use(currencyData)
Vue.use(deepMerge)

/**
 * Init Moment
 */
// moment.tz.setDefault('GMT'); need to remove
Vue.prototype.moment = moment;
Vue.filter('moment', function (date, format) {
    return moment(date).format(format);
});

Vue.use(Vuex)

$(document).ready(() => {
    Vue.mixin(mixin) // register global mixin for all fields components
    Vue.component('draggable', draggable)
    Vue.component('loader', loader)
    Vue.component('loader-wrapper', loaderWrapper)
    Vue.component('ccb-v-select', vSelect)

    if (ajax_window.templates) {
        frontend_fields.forEach(field => {
            field.content.template = ajax_window.templates[field.template_name]
            Vue.component(field.component_name, field.content) // register field component globally
        })
    }

    new Vue(CBOrders)

    $('.calculator-settings').each(function () {
        new Vue({
            el: $(this)[0],
            beforeCreate() {
                this.$store = createStore(cloneDeep(store));

                this.$store.commit('setCurrentLocation', window.location.origin);

                /** set language **/
                if (ajax_window.hasOwnProperty('language')) {
                    this.$store.commit('setLanguage', ajax_window.language);
                }

                /** set date format **/
                if (ajax_window.hasOwnProperty('dateFormat')) {
                    this.$store.commit('setDateFormat', ajax_window.dateFormat);
                }

                /** load translations globally **/
                if (ajax_window.hasOwnProperty('translations')) {
                    this.$store.commit('setTranslations', ajax_window.translations);
                }

                /** use wordpress language **/
                this.moment.updateLocale(ajax_window.language, {
                    week: {
                        dow: 1
                    }
                });
            },
            components: {
                'calc-builder': CBuilder, // Main component for admin Builder
                'calc-builder-front': CBuilderFront, // Front main component and Preview
            },
            data: {
                active_content: 'general',
            },
        })
    })
});

function createStore(store) {
    return new Vuex.Store(store);
}
