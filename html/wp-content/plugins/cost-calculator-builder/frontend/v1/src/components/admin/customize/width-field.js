export default {
    props: [ 'element', 'field', 'index'],
    data(){
        return {
            defaults: null,
            dimension: 'px',
        }
    },

    created(){
        let vm = this;
        vm.defaults  = this.field.default;
        vm.dimension = this.field.dimension;
    },

    methods: {
        change: function () {
            let vm = this, val = {};
            val[vm.field.name] = vm.defaults.value + vm.dimension;

            if (vm.element.name === 'input-fields')
                vm.renderQuantity();

            vm.$emit('change',vm.element.name, val, vm.field, vm.index);
        },

        renderQuantity() {
            let vm = this;
            setTimeout( () => {
                const $      = jQuery;
                const calcId = this.$store.getters.getId
                const id     = `ccb-quantity-style-${calcId}`;
                let style    = '';

                if ( !Array.isArray(vm.element.fields) ) {
                    vm.element.fields = Object.values(vm.element.fields);
                }
                var widthSettings = vm.element.fields.filter(styleField => styleField.name == 'width')[0];
                style += `.calculator-settings .calc-input-wrapper {width: ${widthSettings.default.value}${widthSettings.dimension} !important; } `;

                const selector = $('#' + id)
                if (selector.length) $(selector).remove();
                $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
            })
        },
    },

    template: `<ul class="list-group-item">
                        <li class="list-group">
                            <div class="ccb-range-slider">
                                <input type="range" @change="change" :min="defaults.min" v-model="defaults.value" :step="defaults.step" :max="defaults.max" class="ccb-range-slider__range">
                                <span class="ccb-range-slider__value">{{defaults.value}}{{dimension}}</span>
                            </div>
                        </li>
               </ul>
              `,
}