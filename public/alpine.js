function waterQualityApp() {
    return {
        data: {
            
            samples: [],
            newSample: {
                aluminium: null,
                ammonia: null,
                arsenic: null,
                barium: null,
                cadmium: null,
                chloramine: null,
                chromium: null,
                copper: null,
                fluoride: null,
                bacteria: null,
                viruses: null,
                lead: null,
                nitrates: null,
                nitrites: null,
                mercury: null,
                perchlorate: null,
                radium: null,
                selenium: null,
                silver: null,
                uranium: null
            },
            chartData: null,
            highestLowest: null, // To store highest and lowest contaminants
            contaminants: [], // To store safe and unsafe contaminants
            selectedSample: null, // To store selected sample for editing
            isEditing: false // To track if currently editingz

        },
        showHistory: false, // To control the visibility of the history popup
        chart: null,
        lineChart: null,
        isModalOpen: false,
        alertVisible: false,
        alertMessage: '',
        socket: null,

        init() {
            this.showHistory = false;
            this.fetchData();
            this.setupSocket();
        },
        initSocket() {
            this.socket = io(); // Connect to the server via Socket.io

            this.socket.on('alert', (message) => {
                // Show the alert when receiving the alert event
                this.alertMessage = message;
                this.alertVisible = true;

                // Hide the alert after 5 seconds
                setTimeout(() => {
                    this.alertVisible = false;
                }, 15000);
            });
        },
        async fetchData() {
            const response = await fetch('/api/samples');
            const samples = await response.json();
            this.data.samples = samples;
            this.updateChartData();
            this.calculateHighestLowest();
            this.prepareContaminantsData();
            this.renderLineChart();
        },
       
        async downloadCSV() {
            try {
                const response = await fetch('/api/samples');
                const data = await response.json();
                const csv = this.convertToCSV(data);
                this.downloadFile(csv, 'water_quality_samples.csv');
            } catch (error) {
                console.error('Error downloading CSV:', error);
            }
        },
        convertToCSV(data) {
            if (data.length === 0) return '';

            const headers = Object.keys(data[0]);
            const rows = data.map(sample => headers.map(header => sample[header]));

            const csvContent = [
                headers.join(','), // Header row
                ...rows.map(row => row.join(',')) // Data rows
            ].join('\n');

            return csvContent;
        },
        downloadFile(content, filename) {
            const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            if (link.download !== undefined) { // Feature detection
                const url = URL.createObjectURL(blob);
                link.setAttribute('href', url);
                link.setAttribute('download', filename);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        },

        openModal() {
            this.isModalOpen = true;
            this.newSample = {
                aluminium: null,
                ammonia: null,
                arsenic: null,
                barium: null,
                cadmium: null,
                chloramine: null,
                chromium: null,
                copper: null,
                fluoride: null,
                bacteria: null,
                viruses: null,
                lead: null,
                nitrates: null,
                nitrites: null,
                mercury: null,
                perchlorate: null,
                radium: null,
                selenium: null,
                silver: null,
                uranium: null,
            };
        },


        closeModal() {
            this.isModalOpen = false;
        },
        updateChartData() {
            const latestSample = this.data.samples[this.data.samples.length - 1];
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id' && key !== 'is_safe');

            const chartData = contaminantKeys.map(key => ({
                name: key,
                value: latestSample[key]
            }));

            this.data.chartData = {
                labels: chartData.map(data => data.name),
                datasets: [{
                    label: 'Contaminants',
                    data: chartData.map(data => data.value),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            };

            this.renderChart();
        },

        calculateHighestLowest() {
            const latestSample = this.data.samples[this.data.samples.length - 1];
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id' && key !== 'is_safe');

            let highest = contaminantKeys[0];
            let lowest = contaminantKeys[0];

            contaminantKeys.forEach(key => {
                if (latestSample[key] > latestSample[highest]) {
                    highest = key;
                }
                if (latestSample[key] < latestSample[lowest]) {
                    lowest = key;
                }
            });

            this.data.highestLowest = {
                highest: { name: highest, value: latestSample[highest] },
                lowest: { name: lowest, value: latestSample[lowest] }
            };
        },

        prepareContaminantsData() {
            const latestSample = this.data.samples[this.data.samples.length - 1];
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id' && key !== 'is_safe');

            this.data.contaminants = contaminantKeys.map(key => ({
                name: key.charAt(0).toUpperCase() + key.slice(1),
                value: latestSample[key],
                isSafe: latestSample[key] <= this.getSafetyThreshold(key) // Assuming you have a method to get safety thresholds
            }));
        },

        getSafetyThreshold(contaminant) {
            // Define your safety thresholds here
            const safetyThresholds = {
                aluminium: 0.2,
                ammonia: 0.5,
                arsenic: 0.01,
                barium: 0.1,
                cadmium: 0.005,
                chloramine: 0.4,
                chromium: 0.05,
                copper: 1.3,
                fluoride: 4.0,
                bacteria: 0,
                viruses: 0,
                lead: 0.015,
                nitrates: 10,
                nitrites: 1,
                mercury: 0.002,
                perchlorate: 0.015,
                radium: 0.05,
                selenium: 0.05,
                silver: 0.1,
                uranium: 0.03
            };
            return safetyThresholds[contaminant] || Infinity; // Default to a high threshold if not defined
        },

        renderChart() {
            const ctx = document.getElementById('waterChart').getContext('2d');
            if (this.chart) {
                this.chart.destroy();
            }
            this.chart = new Chart(ctx, {
                type: 'pie',
                data: this.data.chartData,
                options: {
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    let label = context.label || '';
                                    if (label) {
                                        label += ': ';
                                    }
                                    label += context.raw + '%'; // Assuming percentage
                                    return label;
                                }
                            }
                        },
                        legend: {
                            position: 'top',
                        },
                    }
                }
            });
        },

        renderLineChart() {
            const latestSample = this.data.samples[this.data.samples.length - 1];
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id' && key !== 'is_safe');
            const values = contaminantKeys.map(key => latestSample[key]);

            const ctx = document.getElementById('lineChart').getContext('2d');
            if (this.lineChart) {
                this.lineChart.destroy();
            }

            this.lineChart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: contaminantKeys,
                    datasets: [{
                        label: 'Contaminant Values',
                        data: values,
                        borderColor: values.map(value => this.isSafe(value) ? 'green' : 'red'),
                        fill: false,
                        tension: 0.1,
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true,
                            suggestedMin: Math.min(...values),
                            suggestedMax: Math.max(...values)
                        }
                    },
                    responsive: true,
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ': ' + context.raw;
                                }
                            }
                        },
                        legend: {
                            display: false,
                        }
                    }
                }
            });
        },

        isSafe(value) {
            // Use the safety thresholds to determine if the value is safe
            const threshold = this.getSafetyThreshold(); // You may need to pass the contaminant name to this method
            return value <= threshold;
        },

        toggleHistory() {
            this.data.showHistory = !this.data.showHistory;
        },

        editSample(sample) {
            this.data.selectedSample = { ...sample }; // Clone the selected sample for editing
            this.data.isEditing = true; // Set editing state
        },

        async updateSample() {
            const response = await fetch(`/api/samples/${this.data.selectedSample.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.data.selectedSample)
            });
            if (response.ok) {
                this.fetchData(); // Refresh data after updating
                this.data.isEditing = false; // Exit editing mode
                this.data.selectedSample = null; // Clear selected sample
            }
        },


        async deleteSample(id) {
            const response = await fetch(`/api/samples/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.fetchData(); // Refresh data after deletion
            }
        },
        async submitSample() {
            try {
                const response = await fetch('/api/samples', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(this.newSample),
                });

                if (response.ok) {
                    const newSample = await response.json();
                    this.data.samples.push(newSample);

                } else {
                    console.error('Error adding sample:', response.statusText);
                }
            } catch (error) {
                console.error('Error adding sample:', error);
            }
        },

        isSafe(sample) {
            const contaminantKeys = Object.keys(sample).filter(key => key !== 'id' && key !== 'is_safe');
            return contaminantKeys.every(key => sample[key] <= this.getSafetyThreshold(key));
        },

        cancelEdit() {
            this.data.isEditing = false; // Exit editing mode
            this.data.selectedSample = null; // Clear selected sample
        }
    };
}
