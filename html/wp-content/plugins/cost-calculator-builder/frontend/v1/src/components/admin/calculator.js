import {toast} from "../../utils/toast";

export default {
    props: {},
    mounted() {
        if (this.$refs.title)
            this.$refs.title.focus();
    },

    computed: {

        getFields() {
            return this.$store.getters.getBuilder.map(b => {
                const field = this.$store.getters.getFields.find(f => f.tag === b._tag);
                if (field) {
                    b.icon = field.icon;
                    b.text = field.description;
                }
                return b;
            });
        },

        access() {
            return this.$store.getters.getAccess;
        },

        dragOptions() {
            return {
                animation: 200,
                group: "description",
                disabled: false,
                ghostClass: "ghost"
            };
        },

        getTitle: {
            get() {
                return this.$store.getters.getTitle
            },

            set(newValue) {
                this.$store.commit('setTitle', newValue);
            },
        }
    },

    watch: {
        builder() {
            this.checkAvailable();
        }
    },

    methods: {

        saveTitle() {
            if (this.$store.getters.getDisableInput === false && this.$store.getters.getTitle !== '')
                this.$store.commit('setDisabledInput', true);
        },

        enableInput() {

            this.$refs.title.focus();
            if (this.$store.getters.getDisableInput === true)
                this.$store.commit('setDisabledInput', false);
        },

        removeFromBuilder(id) {
            this.$store.commit('removeFromBuilder', id);
            this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder)
        },
        async dublicateField(field_id) {

            var field = Object.values(this.getFields).filter(field => field._id === field_id);
            if ( field.length > 0 ) {
                /** create element from first found by id **/
                /** ps: cause wrong logic was earlier and there ara maybe fields with same ids **/
                let newField = Object.assign({}, field[0]);

                let maxId = Math.max.apply(null, this.getFields.map(item => parseInt(item._id)));
                let id              = parseInt(maxId) + 1;
                let cleanFieldAlias = newField.alias.replace(/\_\d+/,'');
                let duplicatedCount = this.getFields
                    .filter(function(row) { return row.stm_dublicate_field_id == field_id })
                    .length;

                newField._id                    = id;
                newField.stm_dublicate_field_id = field_id;
                newField.label                  = newField.label + ' (copy ' + (parseInt(duplicatedCount) + 1) + ')';
                newField.alias                  = cleanFieldAlias + '_' + id;

                this.$store.commit('addToBuilder', {data: newField, id: id, index: null });
                this.$store.commit('updateAvailableFields', this.$store.getters.getBuilder);
                this.$store.getters.updateCount(1);
                toast('Field Duplicated', 'success');
            }
        },

        editField(type, id) {
            if (typeof type === 'string')
                type = type.toLowerCase().split(' ').join('-');
            this.$store.commit('setEditID', id);
            this.$store.commit('setType', type);
            this.$store.commit('setModalType', 'add-field');
        },

        allowAccess() {
            if (this.$store.getters.getTitle !== '') {
                this.$store.commit('changeAccess', true);
                this.$store.commit('setDisabledInput', true);
            }
        },

        checkAvailable() {
            this.$store.commit('checkAvailable');
        },

        addField(type) {
            if (typeof type !== 'undefined') {
                this.$store.dispatch('setFieldId');
                this.$store.commit('setType', type);
                this.$store.commit('setModalType', 'add-field');
            }
        },

        log(event) {
            const current = event.added;
            if (current) {
                this.$store.commit('setIndex', current.newIndex);
                this.$store.commit('setType', current.element.type);
                this.$store.commit('setModalType', 'add-field');
            }
        },
    },
};