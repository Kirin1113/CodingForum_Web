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
                        <SelectFortynine @updateSerial="updateSerial"/>
                        <soft-button color="dark" full-width variant="gradient" class="mt-2 mb-2"
                            @click="downloadpdf($global_url + 'proxy/get_uva_code_pdf/' + serial)">下載題目PDF</soft-button>
                        <PDFViewer :source="$global_url + 'proxy/get_uva_code_pdf/' + serial"
                            style="height: 80vh;" ref="pdfviewer" @rendered="rendered" :controls="pdfcontrols" />
                    </div>
                </div>
            </div>
            <div class="col-md-8 col-12">
                <div class="card">
                    <div class="card-body p-3">
                        <div class="tab-container mb-3">
                            <soft-button color="dark" @click="selectTestCase('')" :disabled="currentTest === ''">測資</soft-button>
                            <soft-button color="dark" @click="selectTestCase('A')" :disabled="currentTest === 'A'">測資A</soft-button>
                            <soft-button color="dark" @click="selectTestCase('B')" :disabled="currentTest === 'B'">測資B</soft-button>
                        </div>
                        <div class="input-output">
                            <label for="input">Input:</label>
                            <textarea :value="currentInput" class="form-control" rows="5" readonly></textarea>
                        </div>
                        <div class="input-output mt-3">
                            <label for="output">Output:</label>
                            <textarea :value="currentOutput" class="form-control" rows="5" readonly></textarea>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body p-3">
                        <soft-button color="info" full-width variant="gradient" class="mt-2 mb-2"
                            @click="showcode = !showcode">code</soft-button>
                        <div class="mb-3" v-if="showcode">
                            <Codemirror v-if="cpe.code !== null" v-model:value="cpe.code" :options="cmOptions" border ref="cmRef" height="600" width="100%"
                                @change="onChange" @input="onInput" @ready="onReady" :key="selete_loading">
                            </Codemirror>
                            <Codemirror v-else :options="cmOptions" border ref="cmRef" height="600" width="100%"></Codemirror>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import JDoodleEmbed from '@/components/JDoodleEmbed.vue';
import SelectFortynine from "@/components/SelectFortynine.vue";
import PDFViewer from 'pdf-viewer-vue';
import SoftButton from "../components/SoftButton.vue";
import download from 'downloadjs'
import { ElMessage } from "element-plus";

export default {
    name: 'CpeFortynine',
    components: {
        JDoodleEmbed,
        SelectFortynine,
        PDFViewer,
        SoftButton
    },
    data() {
        return {
            serial: '',
            cpe: [],
            pdfcontrols: [
                'print',
                'rotate',
                'zoom',
                'switchPage',
            ],
            selete_loading: 0,
            cmOptions: {
                mode: 'text/x-csrc', // Language mode
                theme: 'lucario', // Theme
                indentWithTabs: true,
                smartIndent: true,
                lineNumbers: true,
                lineWrapping: true,
                matchBrackets: true,
                autofocus: true,
                readOnly: true,
            },
            showcode: false,
            currentTest: '',
        };
    },
    computed: {
        currentInput() {
            if (this.currentTest === 'A') {
                return this.cpe.data_a_input;
            } else if (this.currentTest === 'B') {
                return this.cpe.data_b_input;
            }
            return this.cpe.data_input;  // 如果沒有選擇特定測資，顯示全局測資
        },
        currentOutput() {
            if (this.currentTest === 'A') {
                return this.cpe.data_a_output;
            } else if (this.currentTest === 'B') {
                return this.cpe.data_b_output;
            }
            return this.cpe.data_output;  // 如果沒有選擇特定測資，顯示全局測資
        },
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
        rendered() {
            this.$nextTick(() => {
                this.$nextTick(() => {
                console.log("12222")
                console.log(this.$refs.pdfviewer)
                this.$refs.pdfviewer.handleToggleFullpage()
                });
            });
        },
        updateSerial(serial, cpe) {
            this.serial = serial;
            this.cpe = cpe;
        },
        selectTestCase(test) {
            this.currentTest = test;
        },
    },
    mounted() {
        this.selectTestCase('');  // 預設顯示測資
    },
}
</script>