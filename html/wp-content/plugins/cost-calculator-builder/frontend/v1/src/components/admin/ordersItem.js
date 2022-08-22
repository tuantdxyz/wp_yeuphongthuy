import {deleteOrder, updateOrder} from './api'
import { toast } from '../../utils/toast'

export default {
    template: `
        <div class="orders-list">
            <div class="list-title check">
                <input 
                    @change="selectOrder"  
                    type="checkbox"
                    :checked="selected"
                >
            </div>
            <div class="list-title id">{{ order.id }}</div>
            <div class="list-title email">{{ userEmail }}</div>
            <div class="list-title title">
                <span class="ccb-title">
                    {{ order.calc_title }}
                    <span class="order-deleted" v-if="order.calc_deleted">Deleted</span>
                </span> 
                <i v-if="fileFields.length > 0" class="ccb-clip-icon" ></i>
            </div>
            <div class="list-title payment">{{ paymentMethod }}</div>
            <div class="list-title total">{{ total }}</div>
            <div class="list-title status">
                <select v-model="status">
                    <option 
                        v-for="status in statusList"
                        :key="status.value"
                        :value="status.value"
                        :selected="status.selected"
                    >
                        {{ status.label }}
                    </option>
                </select>
            </div>
            <div class="list-title created_at">{{ order.created_at }}</div>
            <div class="list-title details">
                <button class="order-button" @click="showDetails"><i class="far fa-eye"></i></button>
                <button class="ccb-delete-btn" @click="deleteOrder(order.id)"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
    `,

    props: {
        order: {
            type: Object,
        },

        selected: {
            type: Boolean
        }
    },

    data() {
        return {
            status: {},
            statusList: [
                {
                    value: 'complete',
                    label: 'Complete'
                },
                {
                    value: 'pending',
                    label: 'Pending'
                }
            ]
        }
    },

    methods: {
        async deleteOrder(id){
            const ids = [id];
            if (confirm(this.translations.delete_order_info)) {
                await deleteOrder({ ids });
                toast(this.translations.success_deleted, 'success');

                this.$emit('fetch-data');
            }

        },

        async updateStatus(status) {
            if (confirm('Are you sure change status?')) {
                await updateOrder({
                    ids: this.order.id,
                    status: status
                })

                toast('Status successfuly updated', 'success');
            }
        },

        selectOrder() {
            this.$emit('order-selected', this.order.id);
        },

        showDetails() {
            if ( this.order.paymentMethod === 'woocommerce' && this.order.hasOwnProperty('wc_link')
                && this.order.wc_link.length > 0 ) {
                location.href = this.order.wc_link.replace(/&amp;/g, "&");
            }else{
                this.$root.$emit('showOrderDetail', this.order);
            }

        },
    },

    computed: {
        fileFields() {
            return this.order.order_details.filter( field =>
                field.alias.replace(/\_field_id.*/,'') == 'file_upload' );
        },

        formatTotal(  ) {
            var decimalCount = this.order.num_after_integer ? this.order.num_after_integer : 2;
            var decimal      = this.order.decimal_separator ? this.order.decimal_separator : '.';
            var thousands    = this.order.thousands_separator ? this.order.thousands_separator : ',';

            decimalCount = Math.abs(decimalCount);
            decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

            const negativeSign = this.order.total < 0 ? "-" : "";
            var total = parseFloat(this.order.total);

            let i = parseInt(total = Math.abs(Number(total) || 0).toFixed(decimalCount)).toString();
            let j = (i.length > 3) ? i.length % 3 : 0;

            total = negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(total - i).toFixed(decimalCount).slice(2) : "");
            return total;
        },

        paymentMethod() {
            const methodName = this.order.paymentMethod;
            return methodName !== 'no_payments' && methodName ? methodName : 'No payment';
        },
        total() {
            if (this.order.total) {
                return this.order.paymentCurrency + ' ' + this.formatTotal;
            }

            return 'Unknown error'
        },
        translations () {
            return ajax_window.translations;
        },
        userEmail() {
            return this.order.user_email.length < 16 ? this.order.user_email : this.order.user_email.substr(0,16) + '...';
        }
    },

    created() {
        this.status = this.order.status
        this.$watch('status', this.updateStatus)
    },
}