export default {
    actions: {
        async applyWoo({getters, commit}, post_id ) {

            const getSettings = getters.getSettings;
            const { hide_empty } = getSettings?.general;
            const action = 'calc_woo_redirect';
            const nonce = window.ccb_nonces.ccb_woo_checkout;

            /** null for if field alias is false value **/
            const inCalculable = ['total', 'html', 'line', null];
            let descriptions = getters.getSubtotal
                ? getters.getSubtotal.filter(item => {
                    const prefix = item.alias ? item.alias.split('_').shift() : null;
                    return item.alias && !inCalculable.includes(prefix);
                }): [];

            /** Remove empty fields from subtotal **/
            if ( ! hide_empty )
                descriptions = descriptions.filter(d => d.value);

            let wooData = {
                descriptions,
                woo_info: getSettings.woo_checkout,
                item_name: getSettings.title,
                calcTotals: getters.getFormula,
                calcId: getSettings.calc_id,
                orderId: getters.getOrderId,
            };

            if ( getSettings.woo_products.enable && getSettings.woo_checkout.product_id === 'current_product' ) {
                wooData.woo_info.product_id = post_id;
            }

            const formData = new FormData();
            formData.append('action', action);
            formData.append('data', JSON.stringify(wooData));
            formData.append('nonce', nonce);

            /** get files **/
            let files = [];
            var data  = Object.values(getters.getSubtotal).filter(field => ['file_upload'].includes(field.alias.replace(/\_field_id.*/,'')));
            data.forEach(item => {
                files.push( { 'alias': item.alias, 'files': item.options.value });
            });

            if ( files.length > 0 ) {
                files    = [...files];
                files.forEach(fileItem => {
                    for (const file of fileItem.files ) {
                        formData.append([fileItem.alias, file.name].join('_ccb_'), file);
                    }
                });
            }
            /** get files | End **/

            const response = await fetch(ajax_window.ajax_url, {
                method: 'POST',
                body: formData,
            })

            const resJson = await response.json();
            if ( resJson.success ) {
                location.href = resJson.page;
            }

            return true;
        }
    },

    getters: {

    },
}