<template>
    <div class="container-fluid mt-4">
        <div class="row">
            <div class="col-lg-8 mb-4 mb-xxl-0">
                <div class="card">
                    <div class="card-body">
                        <JDoodleEmbed />
                    </div>
                </div>
            </div>
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body p-3">
                        <SelectUva @updateSerial="updateSerial"/>
                        <PDFViewer :source="$global_url + 'proxy/get_uva_pdf/' + serial"
                            style="height: 80vh;" ref="pdfviewer" @rendered="rendered" :controls="pdfcontrols" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JDoodleEmbed from '@/components/JDoodleEmbed.vue';
import SelectUva from "@/components/SelectUva.vue";
import PDFViewer from 'pdf-viewer-vue'

export default {
    name: 'OnlineCompiler',
    components: {
        JDoodleEmbed,
        SelectUva,
        PDFViewer,
    },
    data() {
        return {
            select_uva: null,
            serial: '',
            pdfcontrols: [
                'print',
                'rotate',
                'zoom',
                'switchPage',
            ]
        };
    },
    methods: {
        updateSerial(serial) {
            this.serial = serial;
        },
        rendered() {
            this.$nextTick(() => {
                this.$nextTick(() => {
                console.log("12222")
                console.log(this.$refs.pdfviewer)
                this.$refs.pdfviewer.handleToggleFullpage()
                });
            });
        },
    },
}
</script>