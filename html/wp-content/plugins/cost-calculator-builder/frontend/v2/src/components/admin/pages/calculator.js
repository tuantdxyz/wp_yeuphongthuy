import calculatorList from '../basic';
import calculatorTab from '../basic/tab';
import demoImport from '../basic/calculator/partials/demo-import';

export default {
	components: {
		'calculators-list': calculatorList,
		'calculators-tab': calculatorTab,
		'ccb-demo-import': demoImport,
	},

	data: () => ({
		calcId: null,
		step: 'list',
		preloader: false
	}),

	mounted() {
		if (this.$checkUri('action') === 'edit' && this.$checkUri('id'))
			this.editCalc({id: this.$checkUri('id'), step: 'create'});
	},

	methods: {
		editCalc({id, step}) {
			const isCreate = step === 'create';
			this.$store.commit('setHideHeader', step === 'demo-import' ? false : isCreate);
			this.calcId = id;
			this.step = step;
		},
	}
};
