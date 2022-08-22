export default {
    created() {

    },

    methods: {
        closeModal() {
            this.hide = true;
            this.$store.commit('setOpenModal', false);
            setTimeout(() => {
                this.hide = false;
                this.$store.commit('setModalType', '');
            }, 200)
        }
    },

    computed: {
        modal() {
            return {
                isOpen: this.$store.getters.getOpenModal,
            };
        },

        getModalType() {
            return this.$store.getters.getModalType;
        },

        hide: {
            get() {
                return this.$store.getters.getModalHide;
            },

            set(value) {
                this.$store.commit('setModalHide', value)
            }
        }
    },

    template: `
        <div class="ccb-modal-wrapper" :class="{open: modal.isOpen, hide: $store.getters.getModalHide}">
            <div class="modal-overlay">
                <div class="modal-window" :class="getModalType">
                    <div class="modal-window-content">
                        <span @click="closeModal" class="close">
                            <span class="close-icon"></span>
                        </span>
                        <slot name="content"></slot>
                    </div>
                </div>
            </div>
        </div>
    `,
}

