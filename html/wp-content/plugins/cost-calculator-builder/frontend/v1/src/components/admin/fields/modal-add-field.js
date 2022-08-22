import {
    checkbox, text, toggle, quantity, total, fileUpload, html, dropDown,
    dropDownWithImg, line, datePicker, multiRange, range, radio
} from './index';

import preview from '../partials/preview'
import demoImport from '../partials/demo-import'

export default {
    data: () => ({
        html: '',
        test: 123,
        content: {},
        loader: true,
        access: true,
        builderData: {},
        modal: {
            isOpen: false,
            hide: false,
            data: {},
        },
    }),

    components: {
        'html-field': html,
        'line-field': line,
        'total-field': total,
        'toggle-field': toggle,
        'text-area-field': text,
        'checkbox-field': checkbox,
        'quantity-field': quantity,
        'range-button-field': range,
        'drop-down-field': dropDown,
        'radio-button-field': radio,
        'multi-range-field': multiRange,
        'date-picker-field': datePicker,
        'file-upload-field': fileUpload,
        'drop-down-with-image-field': dropDownWithImg,

        'preview': preview,
        'demo-import': demoImport,
    },

    computed: {
        getType() {
            const type = this.$store.getters.getType;
            const data = this.$store.getters.getFields;
            const modalData = data.find(e => e.type === type);

            this.builderData = this.$store.getters.getFieldData(this.$store.getters.getEditID);

            if ( type && typeof modalData !== "undefined") {
                this.modal.data = modalData;
            }

            return type;
        },

        getIndex() {
            return this.$store.getters.getIndex;
        },

        getEditID() {
            return this.$store.getters.getEditID;
        },

        getOrderId() {
           this.$store.dispatch('setFieldId');
           return this.$store.getters.getFieldId;
        },

         getModalType() {
            const type = this.$store.getters.getModalType;
            if (type !== '')
                this.modal.isOpen = true;
            if ( type === 'preview' )
                this.loader = false
            return type;
        },
    },

    methods: {
        getByAlias(alias) {
            return this.$store.getters.getFieldByAlias(alias)
        },

        addToBuilder(data, id, index) {
            this.closeModal();
            this.$store.commit('addToBuilder', {data, id, index});
            this.$store.commit('checkAvailable');
            this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder)
            this.$store.getters.updateCount(1)
        },

        closeModal() {
            const vm = this;
            vm.modal.isOpen = false;
            vm.modal.hide = true;
            this.$store.commit('setType', '');
            this.$store.commit('setModalType', '');

            this.$store.commit('setIndex', null);
            this.$store.commit('setEditID', null);
            this.$store.commit('setFieldId', null);
            this.$store.commit('checkAvailable');

            setTimeout(() => {
                vm.access = true;
                vm.modal.hide = false;
                this.loader = true
            }, 200)
        },

        async createNew(url, type) {
            this.closeModal();
            this.$store.commit('updateMainLoader', true);

            if (typeof type !== 'undefined')
                await this.$store.dispatch('saveSettings', false, false);

            await this.$store.dispatch('createId');
            url += '&action=edit&id=' + this.$store.getters.getId;
            await window.location.replace(url);
        },
    }
}