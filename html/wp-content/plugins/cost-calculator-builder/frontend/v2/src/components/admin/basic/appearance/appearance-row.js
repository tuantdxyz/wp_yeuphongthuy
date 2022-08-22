import Customize from "../../../../utils/customize";
import colorAppearance from './fields/color';
import backgroundAppearance from "./fields/background";
import borderAppearance from "./fields/border";
import borderRadiusAppearance from "./fields/border-radius";
import indentAppearance from "./fields/indent";
import numberAppearance from "./fields/number";
import radioAppearance from "./fields/radio";
import selectAppearance from "./fields/select";
import shadowAppearance from "./fields/shadow";
import switcherAppearance from "./fields/switcher";
import toggleAppearance from "./fields/toggle";
import buttonAppearance from "./fields/buttons";
import preloaderAppearance from './fields/preloader'

export default {
	props: ['type'],

	components: {
		'background-field': backgroundAppearance,
		'border-field': borderAppearance,
		'border-radius-field': borderRadiusAppearance,
		'color-field': colorAppearance,
		'indent-field': indentAppearance,
		'number-field': numberAppearance,
		'radio-field': radioAppearance,
		'select-field': selectAppearance,
		'shadow-field': shadowAppearance,
		'switcher-field': switcherAppearance,
		'toggle-field': toggleAppearance,
		'button-field': buttonAppearance,
		'preloader-field': preloaderAppearance,
	},

	methods: {
		/** get element path name **/
		getElementPathName(pathData) {
			return pathData.join('.');
		},

		stateChanged() {
			this.initEffects();
			this.$emit('updated')
		},

		...Customize
	},

	computed: {
		appearance: {
			get() {
				return this.$store.getters.getAppearance;
			},

			set(value) {
				this.$store.commit('setAppearance', value);
			}
		},

		fields() {
			const type = this.type || 'desktop'
			return this.appearance[type]
		},
	},
	
	template: `
				<div class="container" style="padding: 0; margin: 0;">
					<div class="row ccb-custom-row" style="row-gap: 15px; margin-left: -10px; margin-right: -10px"  v-for="(field, index) in fields" v-if="field.data">
						<span v-if="field.label" class="col-12 ccb-heading-5" >{{ field.label }}</span>
						<div v-for="(data, idx) in field.data" :class="data.col" class="custom-col">
							<span v-if="data.label && idx.indexOf('horizontal_view') === -1" class="ccb-default-description opacity-1 ccb-bold">{{ data.label }}</span>
							<component :is="data.type + '-field'" :name="getElementPathName([type, index, idx, 'data', index])" :element="data" @change="stateChanged"></component>
						</div>
					</div>
				</div>
	
	`
}