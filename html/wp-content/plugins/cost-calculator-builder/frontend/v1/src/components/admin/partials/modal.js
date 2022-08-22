export default {
    template: `
        <div class="ccb-modal-wrapper" :class="modalClass">
            <div class="modal-overlay">
                <div class="modal-window order-modal">
                    <div class="modal-window-content order-modal__content" v-if="order">
                        <div class="order-modal-close" @click="close">
                           <span></span>
                           <span></span>
                        </div>
                        <div class="modal-header preview order-modal__header">
                            <div class="modal-header__title order-modal__title">
                                <h4>{{ order.id }}. {{ order.calc_title }}</h4>
                            </div>
                        </div>
                        <div class="modal-body order-modal__body">
                            <ul class="order-modal-details">
                                <li class="order-modal-details__item" v-for="detail in order.order_details">
                                    <div class="order-modal-details__main">
                                        <div class="order-modal-details__label">{{ detail.title }}</div>
                                        <div class="order-modal-details__value">{{ order.currency }}  {{ detail.value }}</div>
                                    </div>
                                    <div v-if="detail.options">
                                        <ul class="order-modal-details__sublist">
                                            <li v-for="option in detail.options">
                                                <div>
                                                    <div class="order-modal-details__label">{{ option.label }}</div>
                                                    <div class="order-modal-details__value">{{ order.paymentCurrency }}  {{ option.value }}</div>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                            <div class="order-modal-total">
                                <div class="order-modal-total__title">Total</div>
                                <div class="order-modal-total__value">{{ order.paymentCurrency }} {{ order.total }}</div>
                            </div>
                            <div class="order-modal-payment">
                                <div class="order-modal-payment__title">Payment Method</div>
                                <div class="order-modal-payment__value">{{ paymentMethod }}</div>
                            </div>
                            <div class="order-form">
                                <div class="order-form__header">
                                    <h3>{{ order.form_details.form }}</h3>
                                </div>
                                <div class="order-form__list">
                                    <ul>
                                        <li v-for="field in formFields">
                                            <div class="order-form__title">{{ field.name }}</div>
                                            <div class="order-form__value">{{ field.value }}</div>
                                        </li>
                                    </ul>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `,

    data() {
        return {
            show: false,
            order: null,
        }
    },

    created() {
      console.log(this.order);
    },
    methods: {
        open(order) {
            this.order = order;
            this.show = true;
        },

        close() {
            this.show = false;
        }
    },

    computed: {
        modalClass() {
            return {
                open: this.show,
            }
        },

        formFields() {
            const result = this.order.form_details.fields.map(item => {
                return {
                    name: item.name.replace('-', ' '),
                    value: item.value
                }
            })

            return result
        },

        paymentMethod() {
            return this.order.paymentMethod === 'no_payments' ? 'No payment' : this.order.paymentMethod
        },
    }
}

