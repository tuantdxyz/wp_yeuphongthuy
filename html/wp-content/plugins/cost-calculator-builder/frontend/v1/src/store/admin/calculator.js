export default {
    state: {
        access: false,
        allowStripe: false,
        builder: [],
        count: 0,
        liveDemolocations: [
            'https://stylemixthemes.com',
        ],
        currentLocation: '',
        custom_styles: {},
        custom_fields: {},
        dateFormat: '',
        disableInput: false,
        existing: [],
        fields: [],
        formula: [],
        getFieldId: 0,
        getEditID: null,
        id: null,
        index: null,
        language: '',
        loader: true,
        title: '',
        translations: {},
        type: '',
    },

    actions: {
        setFieldId({commit, getters}) {
            commit('setFieldId', getters.generateId)
        },

        updateStripeAction({commit}, val) {
            commit('updateStripeCommit', val)
        },

        async edit_calc({commit, state, getters}, {id}) {
            const request = new Promise((resolve) => {
                const data = { calc_id: id, action: 'calc_edit_calc', nonce: window.ccb_nonces.ccb_edit_calc }
                this._vm.$getRequest(window.ajaxurl, data, response => {
                    resolve(response);
                })
            })

            await request.then(response => {
                if (response.success) {
                    commit('setResponseData', response);
                    commit('updateSettings', response.settings);
                    commit('changeAccess', true);
                    commit('setDisabledInput', true);

                    // pro-features
                    commit('updateAll', state);
                    commit('setConditions', state.conditions)

                    commit('setResponseData', response.calculators);
                }
            })
        },

        async createId({commit, getters}) {
            if (!getters.getCreateNew) {
                commit('setCreateNew', true);
                const data = await fetch(`${ajaxurl}?action=calc_create_id&nonce=${window.ccb_nonces.ccb_create_id}`);
                const response = await data.json();
                commit('setResponseData', response);
                await commit('setCreateNew', false);
                commit('updateAll', response);
            }
        },

        async fetchExisting({commit}) {
            const data = await fetch(`${ajaxurl}?action=calc_get_existing&nonce=${window.ccb_nonces.ccb_get_existing}`);
            const response = await data.json();
            commit('setResponseData', response.calculators);
        },

        async duplicateCalc({commit}, id) {
            const data = await fetch(`${ajaxurl}?action=calc_duplicate_calc&calc_id=${id}&nonce=${window.ccb_nonces.ccb_duplicate_calc}`);
            const response = await data.json();
            commit('setResponseData', response);

            return response?.duplicated_id;
        },

        async duplicateBulkCalculator({commit}, ids) {
            const data = await fetch(`${ajaxurl}?action=calc_duplicate_calc&calculator_ids=${ids}&nonce=${window.ccb_nonces.ccb_duplicate_calc}`);
            const response = await data.json();
            commit('setResponseData', response);
            return response;
        },

        async deleteCalc({commit}, id) {
            const data = await fetch(`${ajaxurl}?action=calc_delete_calc&calc_id=${id}&nonce=${window.ccb_nonces.ccb_delete_calc}`);
            const response = await data.json();
            commit('setResponseData', response);
        },

        async deleteBulkCalculator({commit}, ids) {
            const data = await fetch(`${ajaxurl}?action=calc_delete_calc&calculator_ids=${ids}&nonce=${window.ccb_nonces.ccb_delete_calc}`);
            const response = await data.json();
            commit('setResponseData', response);
            return response;
        },

        async saveCalc({commit, getters}) {
            const data = await fetch(ajaxurl + `?action=save_calc`);
            const response = await data.json();
            if (response.success) {
                return true;
            }
        },

        async updateCustomChanges({commit}, data) {
            commit('updateCustomStyles', data.styles);
            commit('updateCustomFields', data.fields);
        },

        async updateStyles({commit,getters}) {
            commit('updateMainLoader', true);
            const data = {
                id: getters.getId,
                action: 'calc_save_custom',
                nonce: window.ccb_nonces.ccb_save_custom,
                content: JSON.stringify({fields: getters.getCustomFields, styles: getters.getCustomStyles})
            }

            this._vm.$postRequest(window.ajaxurl, data, response => {
                if ( response && response.success ) {
                    if (response && response.success) {
                        commit('updateMainLoader', false);
                    }
                }
            })
        }
    },

    mutations: {
        changeAccess(state, val) {
            state.access = val;
        },

        setCurrentLocation(state, currentHostName ) {
            state.currentLocation = currentHostName;
        },

        setType(state, type) {
            state.type = type;
        },

        setId(state, id) {
            state.id = id;
        },

        setEditID(state, getEditID) {
            state.getEditID = getEditID;
        },

        setFields(state, fields) {
            state.fields = fields;
        },

        setTitle(state, title) {
            state.title = title;
        },

        setIndex(state, index) {
            state.index = index;
        },

        setBuilder(state, builder) {
            state.builder = builder;
        },

        updateMainLoader(state, value) {
            state.loader = value;
        },

        setExisting(state, existing) {
            state.existing = existing;
        },

        updateCustomStyles(state, custom_styles) {
            state.custom_styles = custom_styles;
        },

        updateCustomFields(state, custom_fields) {
            state.custom_fields = custom_fields;
        },

        updateStripeCommit(state, val) {
            state.allowStripe = val;
        },

        addBuilder(state, value, index) {
            if (typeof index !== "undefined")
                state.builder[index] = value
            else
                state.builder.push(value)
        },

        setFieldId(state, id) {
            state.getFieldId = id;
        },

        setDisabledInput(state, val) {
            state.disableInput = val;
        },

        setResponseData(state, response) {
            for (let [key, value] of Object.entries(response)) {
                if ( key === "builder" )
                    value = this._vm.$validateData(response.builder, 'builder')

                if (typeof value !== "undefined")
                    state[key] = value;
            }
        },

        checkAvailable(state) {
            if (typeof state.builder !== "undefined")
                state.builder.forEach((value, index) => {
                    if (typeof value === "undefined" || !value.hasOwnProperty('_id')) {
                        state.builder.splice(index, 1);
                    }
                });
        },

        addToBuilder(state, fieldData) {
            if (fieldData.id === null) {
                if (fieldData.index || fieldData.index === 0) {

                    const len = state.builder.length + 1;
                    fieldData.index = (parseInt(fieldData.index) > state.builder.length)
                        ? state.builder.length
                        : fieldData.index;

                    let current = state.builder[fieldData.index];

                    for (let i = fieldData.index; i < len; i++) {
                        let next = state.builder[i + 1];
                        state.builder[i + 1] = current;
                        current = next;
                    }

                    state.builder.splice(fieldData.index, 1, fieldData.data);
                } else {
                    state.builder.push(fieldData.data);
                }
            } else {
                state.builder.splice(fieldData.id, 1, fieldData.data);
            }
        },

        removeFromBuilder(state, id) {
            state.builder = state.builder.filter(field => field && field._id !== id);
        },

        setDateFormat( state, dateFormat ) {
            state.dateFormat = dateFormat;
        },

        setLanguage( state, language ) {
            state.language = language;
        },

        setTranslations( state, translations ) {
            state.translations = translations;
        },
    },

    getters: {
        getCurrentLocation: state => state.currentLocation,

        getId: state => state.id,

        getType: state => state.type,

        getIndex: state => state.index,

        getLanguage: state => state.language,

        getTranslations: state => state.translations,

        getDateFormat: state => state.dateFormat,

        getCount: state => state.count,

        getTitle: state => state.title,

        getAccess: state => state.access,

        getEditID: state => state.getEditID,

        getMainLoader: state => state.loader,

        getExisting: state => state.existing,

        getFields: state => state.fields || [],

        getAllowStripe: state => state.allowStripe,

        getBuilder: state => state.builder || [],

        getFieldId: state => state.getFieldId || 0,

        getDisableInput: state => state.disableInput,

        getCustomStyles: state => state.custom_styles,

        getCustomFields: state => state.custom_fields,

        updateCount: state => value => state.count += value,

        getFieldData: state => id => state.builder.find((e, i) => i === id) || {},

        getFieldByAlias: state => alias => state.builder.find(e => e.alias === alias) || {},

        getIsLiveDemoLocation(state){
            return state.liveDemolocations.includes(state.currentLocation);
        },
        generateId(state) {
            let id = 0;
            let hasAccess = true;

            const ids = [];
            state.builder.forEach(e => ids.push(parseInt(e._id)));

            for (let i = 0; i < ids.length; i++)
                if (!ids.includes(i) && hasAccess) {
                    hasAccess = false;
                    id = i;
                }

            if (hasAccess) id = state.builder.length;
            return id;
        },

        getFormulas: function (state) {
            let _formula = '';
            const data = [];
            state.builder.forEach(function (element) {
                if (element.type === 'Total') {
                    data.push({
                        id: element._id,
                        alias: element.alias,
                        label: element.label,
                        hidden: ( element.hasOwnProperty('hidden') ) ? element.hidden : null,
                        formula: element.costCalcFormula,
                        additionalStyles: element.additionalStyles,
                        totalSymbol: element.totalSymbol,
                        totalSymbolSign: element.totalSymbolSign
                    });
                }
            });


            if (!data.length) {
                state.builder.forEach((element) => {
                    if (element.alias && element.alias.indexOf('text_field') === -1)
                        _formula += element.alias + ' + ';
                });

                let last = _formula.lastIndexOf(" ") - 1;
                _formula = _formula.substring(0, last);
                data.push({label: 'Total', formula: _formula, symbol: ''});
            }

            state.formula = data;
            return data;
        },
    }
}