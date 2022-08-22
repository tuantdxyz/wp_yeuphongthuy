import color from "./color-field";

export default {
	props: [ 'element', 'field', 'index'],
	components: { 'color-field': color },
	data(){
		return {
			id: this.randomID(),
			store: {},
		}
	},

	created() {
		this.renderEffects();
	},

	methods: {
		change() {
			this.renderEffects();
		},

		renderEffects() {
			if (this.element.name === 'buttons') {
				this.renderBtnEffects();
			} else if (this.element.name === 'input-fields') {
				this.renderInputFieldsEffects();
			} else if (this.element.name === 'text-area') {
				this.renderTextAreaEffects();
			}
		},

		renderBtnEffects() {
			const [bgColor, borderColor, fontColor] = this.field.data

			setTimeout( () => {
				const $      = jQuery;
				const calcId = this.$store.getters.getSettings.calc_id
				const id     = `ccb-submit-btn-effects-${calcId}`;
				let styles 	 = ''

				if (this.field.effect === 'hover') {
					styles = `.calc-form-wrapper .ccb-btn-wrap button:hover,
								.payment-methods .ccb-btn-wrap button:hover,
								.ccb-wrapper-${calcId} .calc-fields .calc-file-upload .calc-buttons button:hover,
								.ccb-wrapper-${calcId} .calc-fields .calc-file-upload .url-file-upload button:hover{ 
								background-color: ${bgColor.value} !important; 
								border-color: ${borderColor.value} 	!important;
								color: ${fontColor.value} 	!important; }
							 `
				}

				const selector = $('#' + id)
				if (selector.length) $(selector).remove();
				$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
			})

		},

		renderInputFieldsEffects() {
			const [bgColor, borderColor, fontColor] = this.field.data
			setTimeout( () => {
				const $      = jQuery;
				const calcId = this.$store.getters.getSettings.calc_id
				const id     = `ccb-quantity-effects-${calcId}`;
				let styles 	 = ''

				if (this.field.effect === 'active') {
					styles = `.ccb-wrapper-${calcId} .calc-fields .ccb-field-quantity input:focus, 
						.ccb-wrapper-${calcId} .calc-fields .ccb-field-quantity input:active,
						.ccb-wrapper-${calcId} .calc-fields .ccb-field-quantity input:hover,
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:focus, 
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:active,
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:hover{ 
								background-color: ${bgColor.value} !important; 
								border-color: ${borderColor.value} 	!important;
								color: ${fontColor.value} 	!important;
								transition: 0.3s;}
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:hover::-webkit-input-placeholder { 
						/* Chrome/Opera/Safari */
  							color: ${fontColor.value} 	!important;}
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:hover::-moz-placeholder { 
						/* Firefox 19+ */
						  color: ${fontColor.value} 	!important;}
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:hover:-ms-input-placeholder,
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:focus:-ms-input-placeholder{ 
						/* IE 10+ */
						  color: ${fontColor.value} 	!important;}
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:hover:-moz-placeholder,
						.ccb-wrapper-${calcId} .calc-fields .calc-item .calc-file-upload input:focus:-moz-placeholder{ 
						/* Firefox 18- */
						  color: ${fontColor.value} 	!important;}
					`
				}

				const selector = $('#' + id)
				if (selector.length) $(selector).remove();
				$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
			})
		},

		renderTextAreaEffects() {
			const [bgColor, borderColor, fontColor] = this.field.data
			setTimeout( () => {
				const $      = jQuery;
				const calcId = this.$store.getters.getSettings.calc_id
				const id     = `ccb-text-area-effects-${calcId}`;
				let styles 	 = ''

				if (this.field.effect === 'active') {
					styles = `.ccb-wrapper-${calcId} .calc-fields .calc-item textarea:focus,
						.ccb-wrapper-${calcId} .calc-fields .calc-item textarea:active{ 
								background-color: ${bgColor.value} !important; 
								border-color: ${borderColor.value} 	!important;
								color: ${fontColor.value} 	!important;
								transition: 0.3s;}
							 `
				}

				const selector = $('#' + id)
				if (selector.length) $(selector).remove();
				$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
			})
		}
	},

	template: `
                <ul class="list-group" id="generator-option">
                    <li class="list-group-item">
                        <div class="option_name">
                            <div class="ccb-color-picker m-b-15">
								<template v-for=" (effect, key) in field.data">
									<color-field @changed="change" :field="effect" :key="key" :id="randomID()"></color-field>
								</template>
                            </div>
                        </div>
                    </li>
                </ul>
    `,
}