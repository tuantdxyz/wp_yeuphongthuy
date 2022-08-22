import Vue from '@libs/v1/vue/vue.min'
import mixin from '@mixins/v1/index' // mixin/
import CBOrders from '@components/v1/admin/orders' // orders component
import CBuilder from '@components/v1/admin/main' // main-component admin
import CBuilderFront from '@components/v1/frontend/cost-calc' // main-component front
import loader from '@components/v1/loader' // pre-loader

const _ = require('lodash');
const $ = require('jquery')

/****************** Plugins ******************/
import uriPlugin from '@plugins/v1/checkUri' // uri plugin
import getRequest from '@plugins/v1/getRequest' // getRequest plugin
import postRequest from '@plugins/v1/postRequest' // postRequest plugin
import validateData from '@plugins/v1/validateData' // Validate data plugin
import deepMerge from '@plugins/v1/deepMerge' // Merge data plugin
import currencyData from '@plugins/v1/currencyData' // currency data plugin
/****************** Plugins end ******************/

/****************** Fields start ******************/
import draggable from '@libs/v1/vue/draggable'
import Vuex from '@libs/v1/vue/vuex'
import store from '@store/v1/index' // vuex
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
                this.$store = createStore(_.cloneDeep(store));

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
