import calculator from './calculator';
import condition from './condition';
import settings from './settings';
import customize from './appearance';
import loader from '../../loader';
import copyText from '../utility/copyText';
import {toast} from "../../../utils/toast";
import {removeParams} from "../utility/addParams";

export default {
	props: ['id'],
	components: {
		loader,
		'ccb-settings-tab': settings,
		'ccb-conditions-tab': condition,
		'ccb-appearances-tab': customize,
		'ccb-calculators-tab': calculator,
	},

	data: () => ({
		newCalc: null,
		preloader: true,
		currentTabInner: 'calculators',
		editable: false,
		shortCode: {
			className: '',
			text: 'Copy'
		},
	}),

	async mounted() {
		this.initListeners();
		const response = await this.$store.dispatch( 'edit_calc', { id: this.id });
		if (response.success === false)
			this.newCalc = true;
		this.editTitle();
		setTimeout(() => {
			this.preloader = false;
			window.ccb_refs = this.$refs
		}, 300);
	},

	methods: {
		initListeners() {
			window.addEventListener('click', e => {
				const classList = ['ccb-title', 'ccb-title-approve ccb-icon-Path-3484']
				if ( !classList.includes(e.target.className) ) {
					this.editable = false
				}
			})
		},

		resetCopy() {
			this.shortCode = {
				className: '',
				text: 'Copy'
			};
		},

		previewMode() {
			this.$store.commit('setModalType', 'preview');
			this.$store.commit('setOpenModal', true);
		},

		copyShortCode(id) {
			copyText(id);
			this.shortCode.className = 'copied';
			this.shortCode.text = 'Copied!';
		},

		back() {
			if (!confirm('Are you sure to leave this page?'))
				return;

			removeParams('id');
			removeParams('action');
			this.$emit('edit-calc', {id: null, step: 'list'});
		},

		setTab(tab) {
			this.currentTab = tab;
		},

		editTitle() {
			this.editable = false;
			if ( this.title === '' )
				this.title = 'Untitled';
		},

		async saveSettings() {
			this.$store.commit('setErrorIdx', []);
			const builders = this.$store.getters.getBuilder;
			const errorIdx = [];
			builders.forEach((b, idx) => {
				if (b._id === undefined)
					errorIdx.push(idx);
			});

			if ( errorIdx.length > 0 ) {
				this.$store.commit('setErrorIdx', errorIdx);
				toast('Some fields are required', 'error');
				return;
			}

			this.preloader = true;
			const isEdit = (this.$checkUri('action') === 'edit');
			await this.$store.dispatch('saveSettings', isEdit);
			await this.$store.dispatch('updateStyles');

			setTimeout(() => {
				this.preloader = false;
				toast('Changes Saved', 'success');
			}, 1000);
		},
	},

	computed: {
		currentTab: {
			get() {
				return this.currentTabInner
			},

			set(value) {
				if (['appearances', 'settings'].includes(value)) {
					this.$store.commit('setFieldsKey', this.$store.getters.getFieldsKey + 1)
				}
				this.currentTabInner = value
			}
		},

		getActiveTab() {
			return `ccb-${this.currentTab}-tab`;
		},

		title: {
			get() {
				return this.$store.getters.getTitle;
			},

			set(value) {
				this.$store.commit('setTitle', value);
			},
		}
	},

	filters: {
		'to-short': (value) => {
			if (value.length >= 23) {
				return value.substring(0, 20) + '...'
			}
			return value
		},
	},
}