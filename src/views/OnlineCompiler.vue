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
                        <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                            @click="downloadpdf($global_url + 'proxy/get_uva_pdf/' + serial)">下載題目PDF</soft-button>
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
import PDFViewer from 'pdf-viewer-vue';
import SoftButton from "../components/SoftButton.vue";
import download from 'downloadjs'

export default {
    name: 'OnlineCompiler',
    components: {
        JDoodleEmbed,
        SelectUva,
        PDFViewer,
        SoftButton
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
        downloadpdf(url) {
            ElMessage({
                message: "請稍等，正在準備下載",
                type: "success",
                duration: 3000,
            });
            download(url);
        },
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