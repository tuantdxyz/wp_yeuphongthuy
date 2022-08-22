import color from './customize/color-field'
import width from './customize/width-field'
import border from './customize/border-field'
import boxShadow from './customize/box-shadow-field'
import bRadius from './customize/border-radius-field'
import indentation from './customize/indentation-field'
import bgColor from './customize/background-color-field'
import singleColor from './customize/single-color-field'
import textSettings from './customize/text-settings-field'
import effects from './customize/effects-field'
import CBuilderFront from '@components/v1/frontend/cost-calc' // main-component front

import preview from './partials/preview'

export default {
    components: {
        'color-field'            : color,
        'width-field'            : width,
        'border-field'           : border,
        'effects-field'          : effects,
        'box-shadow-field'       : boxShadow,
        'indentation-field'      : indentation,
        'single-color-field'     : singleColor,
        'text-settings-field'    : textSettings,
        'border-radius-field'    : bRadius,
        'background-color-field' : bgColor,

        'calc-builder-front'     : CBuilderFront, // Front main component and Preview
        'preview': preview,
    },

    data: () => ({
        default_fields    : [
            'v-container',
            'h-container',
            'total-summary',
            'total',
            'buttons',
            'input-fields',
            'labels',
            'descriptions',
            'headers'
        ],
        universalStyles   : {
            'buttons': ['submit-button', 'file-upload'],
            'input-fields': ['quantity']
        },
        containers        : ['v-container', 'h-container'],
        container         : 'v-container',
        settings          : {},
        hasAccess         : true,
        $accordion        : null,
        $accordion_header : null,
    }),

    async mounted() {
        this.settings   = this.$store.getters.getSettings;
        this.container  = (this.settings?.general?.boxStyle === 'horizontal') ? 'h-container': 'v-container';

        let timeId = setInterval( () => {
            this.$accordion        = jQuery('.ccb-js-accordion');
            this.$accordion_header = this.$accordion.find('.ccb-js-accordion-header');

            if (jQuery('.ccb-js-accordion-header').length) {
                jQuery(document).ready( () =>  this.render().init({speed: 300, oneOpen: true}))
                clearInterval(timeId)
            }
        }, 100);
    },

    computed: {
        fields() {
            return this.$store.getters.getCustomFields;
        },
        available_fields() {
            const builder           = this.$store.getters.getBuilder;
            let available_fields    = {};

            Object.keys(this.fields).filter( key => {
                if (
                    builder.some( element => element?.alias?.indexOf( key.split(/-(.+)/)[0] ) === 0 ) ||
                    this.default_fields.includes(key)
                ) {
                    available_fields[key] = this.fields[key];
                }
            });

            // Fields without alias
            if ( builder.some( element => element?.type?.indexOf( 'Text Area' ) === 0 ) ) {
                available_fields['text-area'] = this.fields['text-area'];
            }
            if ( builder.some( element => element?.type?.indexOf( 'Line' ) === 0 ) ) {
                available_fields['hr-line'] = this.fields['hr-line'];
            }

            return available_fields;
        },
        styles() {
            return this.$store.getters.getCustomStyles;
        }
    },

    methods: {
        render() {
            let accordion = ( $ => {

                let settings = {
                    speed: 400,
                    oneOpen: false
                };

                return {
                    init:  ($settings) => {
                        this.$accordion_header.on('click', function () {
                            accordion.toggle($(this));
                        });

                        $.extend(settings, $settings);
                    },
                    toggle: function ($this) {

                        const accordion = '.ccb-js-accordion'
                        if (settings.oneOpen && $this[0] != $this.closest(accordion).find('> .ccb-js-accordion-item.ccb-active > .ccb-js-accordion-header')[0]) {
                            $this.closest(accordion)
                                .find('> .ccb-js-accordion-item')
                                .removeClass('ccb-active')
                                .find('.ccb-js-accordion-body')
                                .slideUp()
                        }

                        $this.closest('.ccb-js-accordion-item').toggleClass('ccb-active')
                        $this.next().stop().slideToggle(settings.speed)
                    }
                }
            })(jQuery);

            return accordion;
        },

        storeStyles(name, obj, field, index){
            if(typeof this.fields[name] !== "undefined") {
                this.fields[name].fields[index] = field
            }

            /** set universal style (buttons, input fields) for elements, which exist in calculator **/
            if ( typeof obj === "object" && this.universalStyles.hasOwnProperty(name)
                && this.universalStyles[name].length > 0 && typeof this.styles[name] !== "undefined" ){
                for(let o in obj) {
                    this.$set(this.styles[name], o, obj[o])
                }

                const data = {fields: this.fields, styles: this.styles}
                this.$store.dispatch('updateCustomChanges', data)

            }else if(typeof obj === "object" && typeof this.styles[name] !== "undefined") {

                for(let o in obj)
                    this.$set(this.styles[name], o, obj[o])

                const data = {fields: this.fields, styles: this.styles}
                this.$store.dispatch('updateCustomChanges', data)
            }
        },
    }

}