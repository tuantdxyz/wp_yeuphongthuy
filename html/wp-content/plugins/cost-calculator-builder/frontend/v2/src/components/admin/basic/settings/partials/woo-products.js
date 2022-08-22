import settingsMixin from './settingsMixin';

export default {
	mixins: [settingsMixin],
	methods: {
		addWooMetaLink() {
			this.$store.commit('addWooMetaLink');
		},

		removeWooMetaLink(index) {
			let links = this.$store.getters.getWooMetaLinks.filter((e, i) => i !== index);
			this.$store.commit('updateWooMetaLinks', links);
		},
	}
}