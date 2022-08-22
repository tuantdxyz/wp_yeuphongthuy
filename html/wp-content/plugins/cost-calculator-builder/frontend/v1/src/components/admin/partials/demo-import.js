export default {
    data: () => ({
        nonces: window.ccb_nonces,
        demoImport: {
            // Custom demo import
            image: {
                file: null
            },
            files: null,
            file: null,
            custom: false,
            noFile: 'No file chosen',

            // Default demo import
            load:false,
            progress_load:false,
            progress:0,
            step_progress: null,
            step:[],
            info: {
                "calculators": 0,
            },
            info_progress: [],
            finish: false,
            progress_data: ""
        },
    }),

    mounted() {
        this.getTotalCalculatorData();
    },

    methods: {
        async runCustomImport(){
            const vm = this;
            let demo = vm.demoImport;

            if ( demo.files ){
                const formData = new FormData();
                formData.append('action', 'cost-calculator-custom-import-total');
                formData.append('type', 'single');
                formData.append('file', demo.files);
                formData.append('nonce', this.nonces.ccb_custom_import);

               demo.image.message = '';
               await fetch( ajax_window.ajax_url ,{
                   method: 'POST',
                   body: formData
               })
                   .then(response => response.json())
                   .then(response => {
                    if ( response.success ) {
                        demo.files = null;
                        demo.noFile = 'No file chosen';
                        demo.image.file = '';
                        demo.info = response.message;

                        for(let index in demo.info)
                            demo.info_progress[index] = 0;

                        demo.custom = true;
                        vm.runImport();
                    }
                });
            }
        },

        /** get total demo calculators **/
        async getTotalCalculatorData() {
            const vm           = this;
            vm.demoImport.load = true;

            await fetch( ajax_window.ajax_url , {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'},
                body: `action=cost-calculator-demo-calculators-total&nonce=${this.nonces.ccb_demo_import_apply}`,
            })
                .then(response => response.json())
                .then(response => {
                    vm.demoImport.load = false;
                    vm.demoImport.info = response;

                    for( let index in vm.demoImport.info ){
                        vm.demoImport.info_progress[index] = 0;
                    }
                });
        },

        async progressImport(){
            let vm = this;
            let demo = vm.demoImport;
            let params = {
                action: 'cost-calculator-import-run',
                step: demo.step_progress,
                key: demo.info_progress[demo.step_progress],
                nonce: this.nonces.ccb_demo_import_run
            };

            if (demo.custom)
                params['is_custom_import'] = true;
            this.$postRequest(ajax_window.ajax_url, params, response => {
                demo.progress_data += ( typeof response.data !== 'undefined' ) ? response.data : 'Empty Data';
                demo.progress_data += " \n";
                let textarea = document.querySelector('#progress_data_textarea');
                textarea.scrollTop = textarea.scrollHeight;

                if (demo.info[demo.step_progress] > demo.info_progress[demo.step_progress]) {
                    demo.info_progress[demo.step_progress] = response.key;
                    demo.progress = Math.ceil( (response.key / demo.info[demo.step_progress]) * 100 );
                }

                if (demo.info[demo.step_progress] === demo.info_progress[demo.step_progress]) {
                    demo.step_progress = vm.nextKey(demo.info, demo.step_progress);
                    demo.progress = 0;
                    this.$store.commit('updateIsExisting', true);
                    this.$store.commit('setExisting', response?.existing);
                }

                if (demo.step_progress != null && response.success){
                    vm.progressImport();
                }

                if (demo.step_progress == null) {
                    demo.finish = true;
                    demo.progress_load = false;
                    const updates = {action: 'calc-run-calc-updates', access: true, nonce: this.nonces.ccb_run_calc_updates}
                    this.$postRequest(ajax_window.ajax_url, updates, response => () => {})
                }
            })
        },

        applyImporter: function() {
            let vm = this;
            let demo = vm.demoImport;
            demo.file = document.querySelector('#ccb-file');
            demo.file.click();
        },

        loadImage: function () {
            let vm = this;
            let demo = vm.demoImport;

            if (demo.file.value)
                demo.noFile = demo.file.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
            else
                demo.noFile = 'No file chosen';

            let fileToUpload = vm.$refs['image-file'].files[0];

            if (fileToUpload) {
                demo.files = fileToUpload;
            }
        },

        nextKey: function(db, key) {
            let keys = Object.keys(db), i = keys.indexOf(key); i++;
            if (typeof keys[i] != "undefined")
                return keys[i];
            return null;
        },

        runImport(){
            const vm = this;
            vm.demoImport.progress_load = true;
            vm.demoImport.step = Object.keys(vm.demoImport.info);
            vm.demoImport.step_progress = vm.demoImport.step[0];

            vm.progressImport();
        },
    }
}