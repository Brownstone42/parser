<template>
    <div class="page-wrapper">
        <div class="field is-grouped mb-4">
            <div class="control">
                <div class="file has-name">
                    <label class="file-label">
                        <input class="file-input" type="file" accept=".csv" @change="handleFile" ref="fileInput" />
                        <span class="file-cta">
                            <span class="file-icon">
                                <i class="fas fa-upload"></i>
                            </span>
                            <span class="file-label">Choose a file…</span>
                        </span>
                        <span class="file-name" v-if="fileName">{{ fileName }}</span>
                    </label>
                </div>
            </div>

            <div>
                <button class="button is-link" @click="addToDB" :disabled="!parsedData.length">
                    Add to DB
                </button>
            </div>
        </div>

        <div class="table-container">
            <table class="table is-striped is-fullwidth mt-4" v-if="parsedData.length">
                <tbody>
                    <template v-for="(row, index) in parsedData" :key="index">
                    <!-- 🔁 SO Header Label Row -->
                        <tr class="so-label-row">
                            <th>SO Number</th>
                            <th>Date</th>
                            <th>Customer</th>
                            <th>Delivery Date</th>
                        </tr>

                        <!-- 🔁 SO Info Row -->
                        <tr class="so-info-row">
                            <td>{{ row.number }}</td>
                            <td>{{ row.date }}</td>
                            <td>{{ row.name }}</td>
                            <td>{{ row.deliveryDate }}</td>
                        </tr>

                        <!-- 🧾 Detail Header -->
                        <tr class="item-label-row">
                            <th>No</th>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Qty</th>
                            <th>Unit</th>
                            <th>Price</th>
                            <th>Amount</th>
                        </tr>

                        <!-- 🧾 Detail Rows -->
                        <tr v-for="(d, i) in row.details" :key="`${index}-${i}`" class="item-row">
                            <td>{{ d.no }}</td>
                            <td>{{ d.code }}</td>
                            <td>{{ d.description }}</td>
                            <td>{{ d.qty }}</td>
                            <td>{{ d.unit }}</td>
                            <td>{{ d.price }}</td>
                            <td>{{ d.amount }}</td>
                        </tr>

                        <!-- Spacer Row Between SOs -->
                        <tr class="spacer-row"><td colspan="6"></td></tr>
                    </template>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            parsedData: [],
            fileName: ''
        }
    },
    methods: {
        addToDB() {
            console.log('Adding to DB...', this.parsedData)
        },
        clearFileInput() {
            this.$refs.fileInput.value = ''
            this.fileName = ''
            this.parsedData = []
        },
        handleFile(event) {
            const file = event.target.files[0]
            if (!file) return

            this.fileName = file.name

            const reader = new FileReader()
            reader.onload = (e) => {
                const text = e.target.result
                const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean)

                let foundSO = false
                let foundIV = false

                for (const line of lines) {
                    const clean = line.replace(/^"|"$/g, '').trim()
                    if (clean.startsWith('SO')) {
                        foundSO = true
                        break
                    }
                    if (clean.startsWith('IV')) {
                        foundIV = true
                        break
                    }
                }

                if (foundIV) {
                    alert('Error: Please upload this file in the IV menu.')
                    this.clearFileInput()
                    return
                }

                if (!foundSO) {
                    alert('Error: Wrong file format.')
                    this.clearFileInput()
                    return
                }

                this.fileName = file.name
                this.parsedData = this.parseSOWithDetails(lines)
            }
            reader.readAsText(file, 'iso-8859-11')
        },
        parseSOWithDetails(lines) {
            const result = []
            const dateRegex = /^\d{2}\/\d{2}\/\d{2}$/
            const detailLineRegex = /^\d+\s+[A-Z0-9\-]+/

            let currentSO = null

            for (let rawLine of lines) {
                const line = rawLine.replace(/^"|"$/g, '').trim()

                // Header row
                if (line.startsWith("SO")) {
                    const parts = line.split(/\s+/)
                    const number = parts[0]
                    const dateIndex = parts.findIndex(p => dateRegex.test(p))
                    const date = parts[dateIndex]

                    let deliveryDateIndex = -1

                    for (let i = dateIndex + 1; i < parts.length; i++) {
                        if (dateRegex.test(parts[i])) {
                            deliveryDateIndex = i
                            break
                        }
                    }

                    if (deliveryDateIndex === -1) continue

                    const name = parts.slice(dateIndex + 1, deliveryDateIndex).join(' ')
                    const deliveryDate = parts[deliveryDateIndex]

                    currentSO = { number, date, name, deliveryDate, details: [] }
                    result.push(currentSO)
                    continue
                }

                // Detail line
                if (currentSO && detailLineRegex.test(line)) {
                    const parts = line.split(/\s+/)

                    // ✅ Handle extra column at the end (like 18/06/68)
                    const isDate = (val) => /^\d{2}\/\d{2}\/\d{2}$/.test(val)
                    const hasExtraDate = isDate(parts[parts.length - 1])
                    const offset = hasExtraDate ? 1 : 0

                    const no     = parts[0]
                    const code   = parts[1]
                    
                    const rawQty = parts[parts.length - (3 + offset)]
                    const match = rawQty.match(/^(\d+)(\D*)$/)
                    const qty = match ? match[1] : rawQty
                    const unit = match ? match[2] : ''

                    const price  = parts[parts.length - (2 + offset)]
                    const amount = parts[parts.length - (1 + offset)]

                    const description = parts.slice(2, parts.length - (3 + offset)).join(' ')

                    currentSO.details.push({ no, code, description, qty, unit, price, amount })
                }
            }

            return result
        }
    }
}
</script>

<style scoped>
.page-wrapper {
    display: flex;
    flex-direction: column;
    height: calc(100vh - 140px);
}
.table-container {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
}
.so-label-row th {
    background-color: #f0f0f0;
    font-weight: bold;
    border-top: 2px solid #ccc;
}

.so-info-row td {
    background-color: #fafafa;
    font-weight: 500;
}

.item-label-row th {
    background-color: #e8f4ff;
    font-weight: bold;
}

.item-row td {
    background-color: #fff;
}

.spacer-row td {
    height: 20px;
    background-color: transparent;
    border: none;
}
</style>