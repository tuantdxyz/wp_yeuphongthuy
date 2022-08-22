export default {
    template: `
        <div class="ccb-option-inner image-val">
            <div class="ccb-image-select" v-if="thumbnail_url">
                <div class="ccb-image-value">
                    <img :src="thumbnail_url" alt="thumbnail_url"/>
                </div>
                <div class="ccb-image-value-delete" @click.prevent="clear">
                    <i class="ccb-icon-close"></i>
                </div>
            </div>
            <button class="ccb-button success" v-if="!thumbnail_url" @click.prevent="openMedia">{{ select_text }}</button>
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