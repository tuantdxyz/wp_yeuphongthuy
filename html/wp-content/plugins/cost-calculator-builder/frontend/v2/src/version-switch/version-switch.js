const $ = require('jquery')
import {toast} from "../utils/toast";
import loader from "../components/loader";

export default {
	props: ['count', 'version'],

	components: {
		loader,
	},

	data: () => ({
		version_interface: 'v2',
		listIdx: null,
		preloader: false,
		videoSrc: 'https://www.youtube.com/watch?v=KGEEX69NLAc',
		showVideo: false
	}),

	mounted() {
		this.customize()
		this.version_interface = this.version || 'v2';
	},

	methods: {
		playVideo() {
			this.videoSrc = this.videoSrc + '?rel=0&autoplay=1'
			
			setTimeout(() => {
				this.showVideo = true
			}, 900)
		},
		
		async setVersion(url) {
			if (this.version_interface === this.version) {
				toast('Already used', 'success')
				return
			}

			this.preloader = true
			const data = await fetch(`${window.ajaxurl}?` + new URLSearchParams({
				action: 'ccb_set_version',
				nonce: window.ccb_nonces.ccb_set_version,
				version: this.version_interface,
			}));

			const response = await data.json();
			if (response) {
				toast(response.message, response.status);
			}

			this.version = this.version_interface;
			setTimeout(() => {
				this.preloader = false
				if (response && response.success && url)
					window.location.href = url
			}, 300)
		},

		openContent(idx) {
			this.listIdx = idx

			if (this.$refs[`accordion-content-${idx}`]) {
				const content = this.$refs[`accordion-content-${idx}`]
				const maxHeight = content.style.maxHeight;
				content.style.maxHeight = !maxHeight ? `${content.scrollHeight}px` : null;
				content.style.marginTop = !maxHeight ? '10px' : 0
			}
		},

		customize() {
			let style = ''
			for (let i = 0; i < this.count; i++)
				style += `
					.ccb-version-switch-container .ccb-version-switch-sidebar .ccb-version-switch-faq-container .ccb-version-switch-faq-list .ccb-version-switch-faq-list-item:nth-of-type(${i + 1}) {
						animation-delay: ${(i + 2) * 0.25}s;
					}
				`

			const selector = $('#calc_version_switch_custom')
			if (selector.length)
				$(selector).remove();
			$('head').append(`<style id="calc_version_switch_custom">${style}</style>`);
		}
	},
}
