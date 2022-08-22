import settings from './settings'
import condition from './condition'
import calculator from './calculator'
import modalAddField from './fields/modal-add-field'
import customize from './customize'
import demoImport from './partials/demo-import'
import {toast} from '../../utils/toast'

const CBuilder = {
    data: () => ({
        active_tab: 'calculator',
        calc_list: false,
        checkedCalculatorIds: [],
        content: '',
        copy: {
            text: 'Copy',
            type: 'hidden',
        },
        disabled: true,
        duplicated_id: null,
        hasAccess: false,
        id: null,
        isCheckedAll: false,
        load: true,
        type: 'existing',
    }),

    components: {
        'settings-page': settings,
        'conditions-page': condition,
        'calculator-page': calculator,
        'customize-page': customize,
        'modal-add-field': modalAddField,
        'demo-import': demoImport,
    },

    computed: {
        errors() {
            return this.$store.getters.getErrors;
        },

        loader: {
            get() {
                return this.$store.getters.getMainLoader;
            },

            set(value) {
                this.$store.commit('updateMainLoader', value);
            }
        },

        view() {
            return this.active_tab;
        },
    },

    async mounted() {
        /** save translations to store **/
        this.$store.commit('setTranslations', ajax_window.translations);

        /** set language **/
        if ( ajax_window.hasOwnProperty('language') ) {
            this.$store.commit('setLanguage', ajax_window.language);
        }

        /** Show calculator list if no action var **/
        if (this.$checkUri('action') === '') {

            this.calc_list = true;
            await this.$store.dispatch('fetchExisting');

        } else if ( this.$checkUri('action') === 'edit' && this.$checkUri('id') !== '' && this.$checkUri('id') ) {

            await this.$store.dispatch( 'edit_calc', { id: this.$checkUri('id') } );
            this.disabled = false;

        }

        this.fields = this.$store.getters.getFields;
        this.toggleLoader();
    },

    methods: {
        removeCondition( conditionModelIndex, additionalConditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionModelIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            if ( conditionModel[0].conditions.length == 1 ){
                return this.removeRow(conditionModelIndex);
            }

            conditionModel[0].conditions = conditionModel[0].conditions.filter((e, i) => i !== additionalConditionIndex);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionModelIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        addRowForOrAndCondition( conditionIndex ){
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            var emptyAdditionalCondition = {
                key: 0, // used for to store option key ( if select type )
                value: '',
                condition: '',
                logicalOperator: '&&',
                sort: conditionModel[0].conditions.length,
            };
            conditionModel[0].conditions.push(emptyAdditionalCondition);
            conditionModel[0].conditions.sort(function(a,b) {
                return a.sort - b.sort;
            });

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /**
         * Replace all AND to OR
         * if not checkbox or toggle
         * and have 'is_selected' condition
         **/
        checkCorrectForAdditionalAnd( conditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            var fieldName = conditionModel[0].optionFrom.replace(/\_field_id.*/,'');
            if ( !['checkbox', 'toggle'].includes(fieldName) ) {
                var isSelectedConditions = conditionModel[0].conditions.filter( c => ( c.condition === '==' ) );
                if ( isSelectedConditions.length > 0 ) {
                    conditionModel[0].conditions.forEach( (item) => item.logicalOperator = '||' );
                    let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
                    allConditionModels.push(conditionModel[0]);
                    this.$store.commit('updateConditionModel', allConditionModels);
                }
            }

        },

        checkIsCanAddMultipleConditionInRow( fieldIdFrom, condition ) {
            var fieldName = fieldIdFrom.replace(/\_field_id.*/,'');
            if ( !['checkbox', 'toggle'].includes(fieldName) &&  condition == '==') {
                return false;
            }
            return true;
        },

        copyIPN() {
            const ipn = document.querySelector('.paypal-ipn__input');
            ipn.setAttribute('type', 'text');
            ipn.select();
            document.execCommand("copy");
            ipn.setAttribute('type', 'hidden');
            this.copy.text = 'Copied'
        },

        copyText(id) {
            const copyText = document.querySelector(`.calc-short-code[data-id='${id}']`)
            if ( copyText ) {
                copyText.setAttribute('type', 'text');
                copyText.select();
                copyText.setSelectionRange(0, 99999);
                document.execCommand("copy");
                copyText.setAttribute('type', 'hidden');
                this.copy.text = 'Copied';
            }
        },

        openExisting() {
            this.$store.commit('setModalType', 'existing')
        },

        openPreview() {
            this.$store.commit('setModalType', 'preview')
        },

        editCalc(url) {
            if ( typeof url !== "undefined")
                window.location.replace(url);
        },

        toggleLoader() {
            setTimeout(() => {
                this.loader = false;
            }, 100);
        },

        saveCondition(conditionData) {
            this.$store.commit('setConditions', conditionData);
        },

        addModel() {
            this.$store.commit('addConditionData');
        },

        addWooMetaLink() {
            this.$store.commit('addWooMetaLink');
        },

        removeWooMetaLink(index) {
            let links = this.$store.getters.getWooMetaLinks.filter((e, i) => i !== index);
            this.$store.commit('updateWooMetaLinks', links);
        },

        close() {
            if (typeof this.$refs['calc-modal'] !== "undefined") {
                this.$refs['calc-modal'].closeModal();
            }
        },

        saveLink() {
            this.$store.dispatch('updateLink');
            this.close();
            toast('Condition Link Saved', 'success');
        },

        removeRow(index) {
            let models = this.$store.getters.getConditionModel.filter((e, i) => i !== index);
            this.$store.commit('updateConditionModel', models);
        },

        removeLink(id) {
            this.$store.dispatch('removeLink', id);
            if (typeof this.$refs['conditions'] !== "undefined") {
                this.$refs['conditions'].refreshAvailable();
                this.$store.commit('updateConditionData', {});
                this.$store.commit('updateConditionModel', []);
            }
            this.close();
        },

        checkAllCalculatorsAction(){
            var calculators = this.$store.getters.getExisting;
            var calculatorsIds =  calculators.map(function(value,index) {
                return value['id'];
            })

            if ( this.isCheckedAll ){
                this.checkedCalculatorIds = [];
            }else{
                this.checkedCalculatorIds = calculatorsIds;
            }

            this.isCheckedAll = !this.isCheckedAll;
        },

        checkCalculatorAction( id ) {
            var exist = this.checkedCalculatorIds.indexOf(id);

            if ( exist >= 0 ){
                this.checkedCalculatorIds.splice(exist, 1);
            }else{
                this.checkedCalculatorIds.push(id);
            }
        },

        cleanCheckedCalculator () {
            this.checkedCalculatorIds = [];
            var calcCheckbox = document.getElementsByName('bulkCalculator');
            for( var i = 0; i < calcCheckbox.length; i++ ){
                calcCheckbox[i].checked = false;
                calcCheckbox[i].removeAttribute("checked");
            }

            document.getElementById('actionType').value = -1;
            this.isCheckedAll = false;
        },

        /** clean conditionModel.setVal
         *  used if action changed
         */
        cleanSetVal( conditionIndex ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            conditionModel[0].setVal = '';

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        cleanDateRangeSetVal( conditionIndex, rangeKey ) {
            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            var rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[rangeKey] = '';

            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        setDate( event, conditionIndex ) {
            var dateObject = this.moment(event.target.value, "YYYY-MM-DD");

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }
            conditionModel[0].setVal = dateObject.format('DD/MM/YYYY');

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);

        },

        setMultiRange( event, conditionIndex ) {
            var errors = Object.assign({}, this.errors);
            errors.multi_range_error = null;
            this.$store.commit('setErrors', errors);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            var rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[event.target.name] = parseInt(event.target.value);

            //VALIDATE START AND END VALUES
            if ( rangeValue['end'] && rangeValue['start'] && rangeValue['end'] <= rangeValue['start'] ) {
                errors.multi_range_error   = this.$store.getters.getTranslations.high_end_multi_range;
                this.$store.commit('setErrors', errors);
                return;
            }
            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push( conditionModel[0] );
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        setRangeDate( event, conditionIndex ) {
            var errors = Object.assign({}, this.errors);
            errors.range_date_error = null;
            this.$store.commit('setErrors', errors);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            var dateObject = this.moment(event.target.value, "YYYY-MM-DD");
            var rangeValue = conditionModel[0].setVal.length > 0 ? JSON.parse(conditionModel[0].setVal): {'start': '', 'end': ''};
            rangeValue[event.target.name] = dateObject.format('DD/MM/YYYY');

            if ( rangeValue['end'] && rangeValue['start'] ) {

                var endDateObject   = this.moment(rangeValue['end'], 'DD/MM/YYYY');
                var startDateObject = this.moment(rangeValue['start'], 'DD/MM/YYYY');

                //VALIDATE START AND END DATES
                if ( startDateObject.isAfter(endDateObject, 'day') ){
                    errors.range_date_error   = this.$store.getters.getTranslations.high_end_date_error;
                    this.$store.commit('setErrors', errors);
                    return;
                }
            }

            conditionModel[0].setVal = JSON.stringify(rangeValue);

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);
            allConditionModels.push( conditionModel[0] );
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /** MULTI SELECT **/
        multiselectShow( event ) {
            if ( event.target.parentNode.classList.contains('visible') ) {
                event.target.parentNode.classList.remove('visible');
                document.removeEventListener('click', this.closeMultiSelect);
            }else{
                event.target.parentNode.classList.add('visible');
                document.addEventListener('click', this.closeMultiSelect);
            }
        },

        multiselectChoose( event, optionIndex, conditionIndex ) {
            var input = event.target.querySelector('.index_' + optionIndex);

            let conditionModel = this.$store.getters.getConditionModel.filter((e, i) => i == conditionIndex);
            if ( conditionModel.length <= 0 ){
                return;
            }

            var newValue = conditionModel[0].setVal.length > 0 ? conditionModel[0].setVal.split (",").map( Number ) : [];
            if ( input.checked ) {
                input.checked = false;
                newValue = newValue.filter(function(f) { return f !== optionIndex });
            }else{
                input.checked = "checked";
                newValue.push(optionIndex);
            }

            newValue = Array.from(new Set(newValue));
            conditionModel[0].setVal = newValue.join(',');

            let allConditionModels = this.$store.getters.getConditionModel.filter((e, i) => i !== conditionIndex);

            allConditionModels.push(conditionModel[0]);
            this.$store.commit('updateConditionModel', allConditionModels);
        },

        /** event listener to close multiselect **/
        closeMultiSelect() {
            window.addEventListener('click', (e) => {
                if ( e.target.closest('.multiselect') !== null ) {
                    return;
                }
                document.querySelectorAll(".multiselect").forEach( obj => obj.classList.remove("visible"));
                document.removeEventListener('click', this.closeMultiSelect);
            })
        },
        /** MULTI SELECT | END **/

        async duplicateCalc(id) {
            this.duplicated_id = await this.$store.dispatch('duplicateCalc', id);
            toast('Calculator Duplicated', 'success');
            setTimeout(() => {
                this.duplicated_id = null;
            }, 1000);
        },

        async deleteCalc(id) {
            if ( confirm('Are you sure to delete this Calculator?') ) {
                await this.$store.dispatch('deleteCalc', id);
                toast('Calculator Deleted', 'success');
            }
        },

        async saveSettings() {
            this.loader = true;
            const isEdit = (this.$checkUri('action') === 'edit');
            await this.$store.dispatch('saveSettings', isEdit);
            await this.$store.dispatch('updateStyles');

            setTimeout(() => {
                this.loader = false;
                toast('Changes Saved', 'success');
            }, 1000);
        },

        async cancel() {
            if (this.$checkUri('action') !== 'edit')
                await this.$store.dispatch('deleteCalc', this.$store.getters.getId);
            location.reload();
        },

        async createId(createId = false) {

            if (this.$checkUri('action') === 'edit' || this.$store.getters.getId) {
                this.$store.commit('setModalType', 'create-new');
                return;
            }

            this.loader = true;
            await this.$store.dispatch('createId');

            if (this.$store.getters.getId) {
                this.calc_list = false;
                this.disabled = false;
                this.id = this.$store.getters.getId;
            }

            this.toggleLoader();
        },

        async bulkAction() {
            var actionType = document.getElementById('actionType');
            var msg        = 'Are you sure to ' + actionType.value + ' choosen Calculators?';//todo

            if ( this.checkedCalculatorIds.length <= 0 ) {
                toast('No calculators were selected ', 'error');
                return;
            }
            if ( actionType.value == -1 ) {
                toast('Select bulk action ', 'error');
                return;
            }

            if ( confirm( msg ) ) {
                let response;

                if ( actionType.value == 'delete' ) {
                    response = await this.$store.dispatch('deleteBulkCalculator', this.checkedCalculatorIds);
                }

                if ( actionType.value == 'duplicate' ) {
                    response = await this.$store.dispatch('duplicateBulkCalculator', this.checkedCalculatorIds);
                }

                toast (response.message, (response.success) ? 'success' : 'error' );
                this.cleanCheckedCalculator();
            }
        }
    }
};

export default CBuilder;