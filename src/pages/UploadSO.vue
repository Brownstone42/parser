<template>
    <section class="section p-0 pt-2">
        <div class="container p-0">
            <h1 class="title mb-0 pb-4">Upload SO Report</h1>
            <UploadSO />
        </div>
    </section>
</template>

<script>
import UploadSO from "@/components/UploadSO.vue"

export default { 
    components: { 
        UploadSO 
    } 
}
</script>