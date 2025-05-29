<template>
    <section class="section">
        <div class="container">
            <h1 class="title">Upload Thai Sales Report</h1>
            <UploadParser />
        </div>
    </section>
</template>

<script>
import UploadParser from "@/components/UploadParser.vue"

export default { 
    components: { 
        UploadParser 
    } 
}
</script>