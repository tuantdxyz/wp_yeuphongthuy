export default {
    template: `
        <div class="calc-thumbnail-container">
            <span v-if="!thumbnail_url" class="thumbnail-btn" @click.prevent="openMedia">{{select_text}}</span>
            <div v-if="thumbnail_url" class="calc-thumbnail-field-media">
                <img :src="thumbnail_url">
                <span class="calc-thumbnail-delete">
                    <span class="close" @click.prevent="clear">
                        <span class="close-icon"></span>
                    </span>
                </span>
            </div>
            <span :id="'errorImage_' + id" class="invalid-format-fields"></span>
		</div>
    `,
    data: () => ({
        thumbnail_url: ''
    }),

    mounted() {
        if ( this.url !== "undefined" )
            this.thumbnail_url = this.url;
    },

    methods: {
        openMedia() {
            if ( typeof wp !== 'undefined' && wp.media && wp.media.editor ) {
                wp.media.editor.open();
                wp.media.editor.send.attachment = (props, attachment) => {
                    if (['image/png', 'image/jpg', 'image/jpeg'].includes(attachment.mime))
                        this.thumbnail_url = attachment.url;
                    this.update();
                };
            }
        },

        clear() {
            this.thumbnail_url = '';
            this.$emit('set', null, this.index, true);
        },

        update() {
            this.$emit('set', this.thumbnail_url, this.index);
        },
    },

    props: ['url', 'index', 'id', 'select_text']
};