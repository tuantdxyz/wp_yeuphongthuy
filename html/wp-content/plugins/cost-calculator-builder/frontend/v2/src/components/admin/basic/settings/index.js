import {
	currency, totalSummary, paypal, sendForm,
	wooProducts, stripe, wooCheckout
} from "./partials";
import preview from '../calculator/partials/preview';
import ccbModalWindow from "../../utility/modal";

export default {
	props: {
		settings: {},
	},

	components: {
		preview,
		'ccb-settings-stripe': stripe,
		'ccb-settings-paypal': paypal,
		'ccb-settings-currency': currency,
		'ccb-settings-send-form': sendForm,
		'ccb-settings-woo-checkout': wooCheckout,
		'ccb-settings-woo-products': wooProducts,
		'ccb-settings-total-summary': totalSummary,
		'ccb-settings-texts': totalSummary,
		'ccb-modal-window': ccbModalWindow,
	},

	data: () => ({
		id: null,
		tab: 'total-summary',
	}),

	async mounted() {
		await this.$store.dispatch('getGeneralSettings');
	},

	created() {
		this.id = this.$store.getters.getId;
	},

	computed: {
		getComponent() {
			return `ccb-settings-${this.tab}`
		}
	},
}
