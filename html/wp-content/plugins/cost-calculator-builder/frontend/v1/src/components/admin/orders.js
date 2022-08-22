import ordersItem from "./ordersItem";
import order from './partials/order-modal';
import loader from "../loader";
import { fetchOrdersList, updateOrder, deleteOrder } from "./api";
import { toast } from '../../utils/toast';
import store from '@store/v1/index';
import Vuex from '@libs/v1/vue/vuex';

export default {
    beforeCreate() {
        this.$store = new Vuex.Store(store);

        /** set language **/
        if ( ajax_window.hasOwnProperty('language') ) {
            this.$store.commit('setLanguage', ajax_window.language);
        }
        /** load translations globally **/
        if ( ajax_window.hasOwnProperty('translations') ) {
            this.$store.commit('setTranslations', ajax_window.translations);
        }
    },
    el: ".calculator-orders",

    components: {
        ordersItem,
        loader,
        order,
    },

    data() {
        return {
            bulkAction: 'none',
            selectAll: false,
            ordersList: null,
            ordersCount: 0,
            calculatorList: null,
            sort: {
                limit: 5,
                calc_id: 'all',
                payment: 'all',
                page: 1,
                sortBy: 'id',
                status: 'all',
                direction: 'desc',
            },
            pagination: {
                currentPage: 1,
                maxPages: 0,
            }
        }
    },

    computed: {
        selectedList() {
            if (this.ordersList) {
                return this.ordersList.filter(order => order.selected).map(order => order.id)
            } else {
                return []
            }
        },

        totalPages() {
            return Math.ceil(this.ordersCount / this.sort.limit);
        },
    },

    methods: {
        nextPage() {
            this.sort.page++;
        },

        prevPage() {
            this.sort.page--;
        },

        saveFilter() {
            localStorage.setItem('ccb_filter', JSON.stringify(this.sort))
        },

        getPage(page) {
            this.sort.page = page;
            this.fetchData();
        },

        resetPage() {
            this.sort.page = 1;
        },

        checkAll() {
            if (this.selectAll) {
                this.ordersList.forEach(order => {
                    this.selectedList.push(order.id)
                    order.selected = true
                })
            } else {
                this.ordersList.forEach(order => {
                    order.selected = false
                })
            }
        },

        async updateMany() {
            const ids = this.selectedList.join(',')

            if (this.bulkAction === 'delete') {
                if (confirm('Are you sure do it?')) {
                    await deleteOrder({ ids })
                    toast('Order successfully deleted', 'success')
                }
            } else {
                await updateOrder({
                    ids,
                    status: this.bulkAction
                })

                toast('Orders successfully updated', 'success')
            }

            this.bulkAction = 'none'
            this.selectAll = false

            this.resetPage()

            await this.fetchData()
        },

        onSelected(id) {
            this.selectedList.push(id)
            this.ordersList = this.ordersList.map(order => {
                if (order.id === id) {
                    order.selected = !order.selected
                }
                return order;
            })
        },

        isActiveSort(sortKey) {
            const isActive = sortKey === this.sort.sortBy
            const isAsc = isActive && this.sort.direction === 'asc'
            const isDesc = isActive && this.sort.direction === 'desc'

            return {
                'sortable-asc':  isAsc,
                'sortable-desc': isDesc,
            }
        },

        setSort(key) {
            this.sort.sortBy = key

            if (this.sort.direction === 'asc') {
                this.sort.direction = 'desc'
            } else {
                this.sort.direction = 'asc'
            }
        },

        async fetchData() {
            const orders = document.querySelector('.calculator-orders');
            if (!orders)
                return null;

            this.ordersList = null;

            const response = await fetchOrdersList({
                page: this.pagination.currentPage,
                ...this.sort,
            })

            this.ordersList     = response.data;
            this.ordersCount    = response.total_count;
            this.calculatorList = response.calc_list;
        }
    },

    async mounted() {
        if (localStorage.getItem('ccb_filter')) {
            this.sort = JSON.parse(localStorage.getItem('ccb_filter'))
        }

        this.$root.$on('showOrderDetail', order => {
            this.$refs['order-modal'].open(order)
        })

        await this.fetchData()
    },

    watch: {
        sort: {
            deep: true,
            handler() {
                this.saveFilter()
                this.fetchData()
            }
        },

        ordersList() {
            this.selectAll = false;

            if (this.selectedList.length === parseInt(this.sort.limit)) {
                this.selectAll = true
            }
        }
    }
}