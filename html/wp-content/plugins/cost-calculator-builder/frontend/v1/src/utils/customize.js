const Customize = {}
const $		    = require('jquery')

Customize.initEffects = function () {
	const customFields = this.customs || this.$store.getters.getCustomFields;

	const submitBtn 	= customFields['buttons'] || false
	const inputField 	= customFields['input-fields'] || false
	const textArea 		= customFields['text-area'] || false

	if ( submitBtn ) {
		if ( !Array.isArray(submitBtn.fields) ) {
			submitBtn.fields = Object.values(submitBtn.fields);
		}

		const hoverEffects  = submitBtn.fields.filter(customField => customField.name == 'submit-hover-effects');

		if ( hoverEffects.length > 0 ) {
			const data = hoverEffects[0].data;
			if (data) {
				const [bgColor, borderColor, fontColor] = data
				setTimeout( () => {
					const calcId = this.$store.getters.getSettings.calc_id
					const id     = `ccb-submit-btn-effects-${calcId}`;

					let styles 	 = `.ccb-wrapper-${calcId} .calc-form-wrapper .ccb-btn-wrap button:hover,
							.ccb-wrapper-${calcId} .payment-methods .ccb-btn-wrap button:hover,
							.ccb-wrapper-${calcId} .calc-fields .calc-file-upload .calc-buttons button:hover,
							.ccb-wrapper-${calcId} .calc-fields .calc-file-upload .url-file-upload button:hover{ 
							background-color: ${bgColor.value} !important; 
							border-color: ${borderColor.value} 	!important;
							color: ${fontColor.value} 	!important; }
						 `;

					const selector = $('#' + id)
					if (selector.length) $(selector).remove();
					$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);

				}, 500)
			}
		}
	}

	if ( inputField ) {
		if ( !Array.isArray(inputField.fields) ) {
			inputField.fields = Object.values(inputField.fields);
		}

		let inputFieldEffects = inputField.fields.find(p => p.name === 'input-active-effects');

		if (typeof inputFieldEffects !== 'undefined' && inputFieldEffects.data) {
			const [bgColor, borderColor, fontColor] = inputFieldEffects.data;
			setTimeout(() => {
				const calcId = this.$store.getters.getSettings.calc_id
				const id = `ccb-quantity-effects-${calcId}`;

				let styles = `.ccb-wrapper-${calcId} .calc-fields .ccb-field-quantity input:focus,
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
				const selector = $('#' + id)
				if (selector.length) $(selector).remove();
				$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
			}, 500)
		}
	}

	if ( textArea ) {
		let textAreaEffects = textArea.fields.find(p => p.name === 'text-area-active-effects')
		if (typeof textAreaEffects !== 'undefined' && textAreaEffects.data) {
			const [bgColor, borderColor, fontColor] = textAreaEffects.data
			setTimeout(() => {
				const calcId = this.$store.getters.getSettings.calc_id
				const id = `ccb-text-area-effects-${calcId}`;

				let styles = `.ccb-wrapper-${calcId} .calc-fields .calc-item textarea:focus,
								.ccb-wrapper-${calcId} .calc-fields .calc-item textarea:focus{ 
								background-color: ${bgColor.value} !important; 
								border-color: ${borderColor.value} 	!important;
								color: ${fontColor.value} 	!important;
								transition: 0.3s;}
							 `

				const selector = $('#' + id)
				if (selector.length) $(selector).remove();
				$('head').append(`<style type="text/css" id="${id}">${styles}</style>`);
			}, 500)
		}
	}
}

export default Customize