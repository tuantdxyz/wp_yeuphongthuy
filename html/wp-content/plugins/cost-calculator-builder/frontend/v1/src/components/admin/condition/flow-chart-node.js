export default {
    props: {
        id: {
            type: Number,
            default: 1000,
            validator(val) {
                return typeof val === 'number'
            }
        },
        node: {
            type: Object,
            required:true
        },
        nodeOptions: {
            type: Object,
            default() {
                return {
                    centerX: 1024,
                    scale: 1,
                    centerY: 140,
                }
            }
        },
        x: {
            type: Number,
            default: 0,
            validator(val) {
                return typeof val === 'number'
            }
        },
        y: {
            type: Number,
            default: 0,
            validator(val) {
                return typeof val === 'number'
            }
        },
    },

    data() {
        return {
            responsive: {
                1920: 1150,
                1600: 837,
                1440: 717,
                1220: 505,
            },
            show: {
                delete: false,
            }
        }
    },
    computed: {
        nodeStyle() {
            this.$emit('update');
            // todo check is width correct (if created on other screen size )
            return {
                top: this.node.y + 'px',
                left: this.node.x + 'px',
            }
        }
    },
    methods: {
        handleMousedown( e ) {
            if( e ) {
                const target = e.target || e.srcElement;
                if (target.className.indexOf('no-draggable') === -1 && target.className.indexOf('node-input') < 0 && target.className.indexOf('node-output') < 0) {
                    this.$emit('nodeSelected', e);
                }
            }
            e.preventDefault();
        },
        startLinkMouseDown(e) {
            this.$emit('linkingStart', this.node.id,  e.target );
            e.preventDefault();
        },
        stopLinkMouseUp(e) {
            this.$emit('linkingStop', this.node.id );
            e.preventDefault();
        },
    },
    filters: {
        'to-short': (value) => {
            if(value.length >= 33) {
                return value.substring(0, 30) + '...';
            }
            return value;
        },
    },
    template: `
       <div class="ccb-c-rectangle" :style="nodeStyle" @mouseup="stopLinkMouseUp" @mousedown="handleMousedown" v-bind:class="{selected: nodeOptions.selected === id}">
            
            <i class="node-output-point top left" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point top center" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point top right" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            
            <div class="ccb-c-rectangle-item">
                <i class="node-output-point left side" v-if="node.calculable" @mousedown="startLinkMouseDown" ></i>
                <span :class="node.icon"></span>
                <span class="title">
                    {{node.label | to-short}}                            
                </span>
                <i class="node-output-point right side" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            </div>
            <i class="far fa-times-circle node-delete ccb-node-btn ccb-delete"></i> 
            
            <i class="node-output-point bottom left" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point bottom center" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
            <i class="node-output-point bottom right" v-if="node.calculable" @mousedown="startLinkMouseDown"></i>
        </div>
    `
}