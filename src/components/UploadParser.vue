<template>
    <div class="section">
        <input type="file" @change="handleFile" accept=".csv" />
        
        <table class="table is-striped is-fullwidth mt-4" v-if="parsedData.length">
            <thead>
                <tr>
                    <th v-for="(header, index) in headers" :key="index">{{ header }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(row, rowIndex) in parsedData" :key="rowIndex">
                    <td v-for="(header, colIndex) in headers" :key="colIndex">{{ row[header] }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            parsedData: [],
            headers: []
        }
    },
    methods: {
        handleFile(event) {
            console.log('start')
            const file = event.target.files[0]
            if (!file) return
            
            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target.result
                this.parseSOData(text)
            }
            
            reader.readAsText(file, 'iso-8859-11') // Use Thai encoding
    },
    parseSOData(content) {
        const lines = content.split(/\r?\n/)
        console.log("Total lines:", lines.length)

        const soLines = lines.filter((line) =>
            line.replace(/^"|"$/g, '').trim().startsWith("SO")
        )
        console.log("SO lines:", soLines.length)
        console.log("First few SO lines:", soLines.slice(0, 3))

        const regex = /SO(\d+)\s+(\d{2}\/\d{2}\/\d{2})\s+(.*?)\s{2,}(\w{2}\s?\d{3})\s+(\d{2}\/\d{2}\/\d{2})\s+(\d+)?\s+(\d+)?\s+(\d+)?\s+([\d,.]+)\s+([\d,.]+)\s+([\d,.]+)\s+(\w)?\s+(.+)/
        const parsed = []
        
        for (const line of soLines) {

            const cleanLine = line.replace(/^"|"$/g, '').trim()
            const match = regex.exec(cleanLine)

            if (match) {
                const [
                    _,
                    so,
                    date,
                    customer,
                    salesman,
                    delivery,
                    credit,
                    v,
                    discount,
                    amount,
                    vat,
                    total,
                    status,
                    ref,
                ] = match

                parsed.push({
                    'เลขที่ (SO)': so,
                    'วันที่': date,
                    'ชื่อลูกค้า': customer,
                    'พนักงานขาย': salesman,
                    'วันที่ส่ง': delivery,
                    'เครดิต': credit,
                    'V': v,
                    'ส่วนลด': discount,
                    'มูลค่าสินค้า': amount,
                    'VAT': vat,
                    'รวมทั้งสิ้น': total,
                    'ส่งหมด': status,
                    'อ้างอิง': ref,
                })
            } else {
                console.warn("❌ No match:", line)
            }
        }

        console.log("Parsed entries:", parsed.length)
        this.parsedData = parsed
        this.headers = parsed.length ? Object.keys(parsed[0]) : []
    }
  }
}
</script>

<style scoped>
input[type="file"] {
    margin-top: 1rem;
}
</style>