import Vue from '@libs/v2/vue/vue.min'
import versionSwitch from './version-switch'

new Vue({
	el: '#ccb-version-switch',
	components: {
		'ccb-version-switch': versionSwitch,
	},
});
