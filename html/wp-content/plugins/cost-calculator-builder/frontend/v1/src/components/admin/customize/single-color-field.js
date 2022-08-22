import color from "./color-field";

export default {
    props: [ 'element', 'field', 'index'],
    components: {
        'color-field': color,
    },

    data(){
        return {
            id: this.randomID(),
            store: {},
        }
    },

    methods: {
        change: function () {
            let vm = this;
            vm.store[vm.field.name] = vm.field.value;
            vm.field.default = vm.field.value;

            if (vm.element.name === 'range-button')
                vm.renderRange();
            else if (vm.element.name === 'radio-button')
                vm.renderRadio();
            else if (vm.element.name === 'checkbox')
                vm.renderCheckboxes();
            else if (vm.element.name === 'toggle')
                vm.renderToggle();

            vm.$emit('change',vm.element.name, vm.store, vm.field, vm.index);
        },


        renderCheckboxes() {
            let vm = this;
            setTimeout( () => {
                const $      = jQuery;
                const calcId = this.$store.getters.getId
                const id     = `ccb-checkbox-style-${calcId}`;
                let style    = ''

                style += `.calculator-settings .calc-checkbox-item label::before  {background-color: ${vm.element.fields[2].value} !important; border: 1px solid ${vm.element.fields[1].value} !important; } `; //1 => "b_Color"; 3 => "bg_color"
                style += `.calculator-settings .calc-checkbox-item input[type="checkbox"]:checked ~ label:before { border: 1px solid  ${vm.element.fields[3].value} !important; background: ${vm.element.fields[3].value} !important; } `; //"checkbox_color"
                style += `.calculator-settings .calc-checkbox-item label::after { border-left: 2px solid ${vm.element.fields[4].value} !important; border-bottom: 2px solid ${vm.element.fields[4].value} !important;} `; // "checkedColor"

                const selector = $('#' + id)
                if (selector.length) $(selector).remove();
                $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
            })
        },

        renderRadio() {
            const vm = this;
            const $ = jQuery
            setTimeout(() => {
                let style = ''
                const id = 'ccb-radio-style'
                const hashedId = '#' + id

                style += `.calculator-settings .calc-radio-item input[type="radio"] { border: 1px solid ${vm.element.fields[1].value} !important; } `;
                style += `.calculator-settings .calc-radio-item input[type="radio"] { background-color: ${vm.element.fields[2].value} !important; } `;
                style += `.calculator-settings .calc-radio-item input[type='radio']:checked:before { background: ${vm.element.fields[2].value} !important; } `;
                style += `.calculator-settings .calc-radio-item input[type='radio']:checked { background: ${vm.element.fields[3].value} !important; } `;
                style += `.calculator-settings .calc-radio-item input[type='radio']:checked { border: 0 !important;  } `;

                if (hashedId.length) $(hashedId).remove();
                $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
            })
        },

        renderRange: function () {
            let vm = this;

            this.$nextTick(function () {
                const $      = jQuery;
                const calcId = this.$store.getters.getId
                const id     = `ccb-range-slider-style-${calcId}`;
                let style    = '';

                style += `.e-control-wrapper.e-slider-container.e-material-slider .e-slider .e-handle.e-handle-first,
                           body div.e-slider-tooltip.e-tooltip-wrap.e-popup.e-tooltip-wrap.e-popup.e-material-default.e-material-tooltip-start,
                           body div.e-slider-tooltip.e-tooltip-wrap.e-popup.e-tooltip-wrap.e-popup.e-material-default,
                          .e-slider-tooltip.e-tooltip-wrap.e-popup,
                          .e-control-wrapper.e-slider-container .e-slider .e-handle {
                           background: ${ vm.element.fields[2].value } !important;  }`;

                style +=   `.e-slider-tooltip.e-tooltip-wrap.e-popup:after {
                              border-color: ${ vm.element.fields[2].value } transparent transparent transparent !important;}`;

                style +=   `.e-control-wrapper.e-slider-container .e-slider .e-range {
                             background: ${ vm.element.fields[1].value } !important; }`;

                style +=   `.e-control-wrapper.e-slider-container.e-horizontal .e-slider-track {
                             background: ${ vm.element.fields[0].value } !important;}`;

                const selector = $('#' + id)
                if ( selector.length ) selector.remove()
                $('head').append(`<style type="text/css" id="${id}">${style}</style>`)
            })
        },

        renderToggle: function () {
            let vm = this;

            this.$nextTick(function () {
                const $      = jQuery;
                const calcId = this.$store.getters.getId
                const id     = `ccb-toggle-style-${calcId}`;
                let style    = '';

                style += `.calculator-settings .calc-toggle label:after { background-color: ${vm.element.fields[1].value} !important; } `;
                style += `.calculator-settings .calc-toggle label  { background: ${vm.element.fields[2].value} !important; } `;
                style += `.calculator-settings .calc-toggle input:checked + label   { background: ${vm.element.fields[3].value} !important; } `;

                const selector = $('#' + id)
                if (selector.length) selector.remove();
                $('head').append(`<style type="text/css" id="${id}">${style}</style>`);
            })
        },

    },

    template: `
                <ul class="list-group" id="generator-option">
                    <li class="list-group-item">
                        <div class="option_name">
                            <div class="ccb-color-picker m-b-15">
                                <color-field @changed="change" :field="field" :id="randomID()"></color-field>
                            </div>
                        </div>
                    </li>
                </ul>
    `,
}