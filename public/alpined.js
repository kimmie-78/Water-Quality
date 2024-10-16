function waterQualityApp() {
    return {
        isModalOpen: false,
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
            uranium: null,
        },
        submittedSamples: [], 
        contaminants: [
            { name: 'aluminium', threshold: 0.2 },
            { name: 'ammonia', threshold: 0.5 },
            { name: 'arsenic', threshold: 0.01 },
            { name: 'barium', threshold: 2.0 },
            { name: 'cadmium', threshold: 0.005 },
            { name: 'chloramine', threshold: 4.0 },
            { name: 'chromium', threshold: 0.1 },
            { name: 'copper', threshold: 1.3 },
            { name: 'fluoride', threshold: 4.0 },
            { name: 'bacteria', threshold: 1.0 },
            { name: 'viruses', threshold: 0.01 },
            { name: 'lead', threshold: 0.015 },
            { name: 'nitrates', threshold: 10.0 },
            { name: 'nitrites', threshold: 1.0 },
            { name: 'mercury', threshold: 0.002 },
            { name: 'perchlorate', threshold: 0.005 },
            { name: 'radium', threshold: 0.03 },
            { name: 'selenium', threshold: 0.05 },
            { name: 'silver', threshold: 0.1 },
            { name: 'uranium', threshold: 0.03 },
        ],
        chartData: {},
      
        chart: null,
        lineChart: null,
        samples: [],
        thresholds: {
            aluminium: 0.2,
            ammonia: 0.5,
            arsenic: 0.01,
            barium: 2.0,
            cadmium: 0.005,
            chloramine: 4.0,
            chromium: 0.1,
            copper: 1.3,
            fluoride: 4.0,
            bacteria: 1.0,
            viruses: 0.01,
            lead: 0.015,
            nitrates: 10.0,
            nitrites: 1.0,
            mercury: 0.002,
            perchlorate: 0.006,
            radium: 5.0,
            selenium: 0.05,
            silver: 0.1,
            uranium: 0.03
        },
       
        async init() {
            this.showHistory = false;

            try {
                const response = await fetch('/api/dashboard/samples');
                const samples = await response.json();
                if (samples.length > 0) {
                    this.samples = samples;
                    this.updateChartData();
                    this.updateLineChartData();
                    console.log("Data fetched and chart updated.");
                }
            } catch (error) {
                console.error('Error fetching water samples:', error);
            }
            // Store threshold values
            this.contaminants.forEach(contaminant => {
                this.thresholds[contaminant.name] = contaminant.threshold;
            });

            console.log('Thresholds:', this.thresholds);

            // Initialize the charts after fetching data
            //     await this.fetchSamples();
            //     this.updateChartData();
            //     this.updateLineChartData();
        },
        openModal() {
            this.isModalOpen = true;
        },
        closeModal() {
            this.isModalOpen = false;
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
        submitSample() {
            // Validate and submit the new sample to the API
            const newSample = { ...this.newSample };

            // Post the new sample to the API
            fetch('/api/dashboard/samples', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newSample),
            })
                .then(response => response.json())
                .then(data => {
                    this.submittedSamples.push(data);
                    this.newSample = {};
                    this.closeModal();
                    this.updateChartData();
                })
                .catch(error => console.error('Error submitting sample:', error));
        },
        getSampleValue(contaminantName) {
            // Check the last submitted sample first, and fallback to the fetched sample if none are submitted
            let lastSample = this.submittedSamples[this.submittedSamples.length - 1] || this.samples[this.samples.length - 1];

            return lastSample ? lastSample[contaminantName] : 'No data';
        },
        getClass(contaminant) {
            const value = this.getSampleValue(contaminant.name);
            return value > contaminant.threshold ? 'alert' : 'safe';
        },
        async downloadCSV() {
            try {
                const response = await fetch('/api/dashboard/samples');
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
        toggleHistory() {
            this.showHistory = !this.showHistory;
        },
        async deleteSample(id) {
            const response = await fetch(`/api/dashboard/samples/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                this.fetchData();
            }
        },
        editSample() {
            const sampleToEdit = this.data.samples.find(sample => sample.id === this.selectedSample);
            if (sampleToEdit) {
                this.newSample = { ...sampleToEdit };
                this.isEditing = true;
                this.isModalOpen = true;
            }
        },

        async updateSample() {
            const response = await fetch(`/api/dashboard/samples/${this.newSample.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.newSample),
            });

            if (response.ok) {
                const updatedSample = await response.json();
                const index = this.data.samples.findIndex(sample => sample.id === updatedSample.id);
                this.data.samples[index] = updatedSample;
                this.isEditing = false;
                this.closeModal();
                this.fetchData();
            } else {
                console.error('Error updating sample:', response.statusText);
            }
        },
        updateChartData() {
            const latestSample = this.samples[this.samples.length - 1];
            console.log('Latest Sample:', latestSample); // Check the latest sample data
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id');

            const chartData = contaminantKeys.map(key => ({
                name: key,
                value: latestSample[key]
            }));

            this.chartData = {
                labels: chartData.map(data => data.name),
                datasets: [{
                    label: 'Contaminants',
                    data: chartData.map(data => data.value),
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
                }]
            };

            this.renderChart();
        },
        updateLineChartData() {
            const latestSample = this.samples[this.samples.length - 1];
            console.log('Latest Sample for Line Chart:', latestSample); // Log for debugging
            const contaminantKeys = Object.keys(latestSample).filter(key => key !== 'id');

            const lineChartData = {
                labels: contaminantKeys,
                datasets: [
                    {
                        label: 'Sample Values',
                        data: contaminantKeys.map(key => latestSample[key]),
                        borderColor: '#FF6384',
                        fill: false,
                        tension: 0.1
                    },
                    {
                        label: 'Threshold Values',
                        data: contaminantKeys.map(key => this.thresholds[key]), // Ensure this matches the correct contaminant names
                        borderColor: '#36A2EB',
                        fill: false,
                        tension: 0.1,
                        borderDash: [5, 5] // Dotted line for thresholds
                    }
                ]
            };

            console.log('Line Chart Data:', lineChartData); // Log the line chart data for debugging

            this.renderLineChart(lineChartData);
        },

        renderChart() {
            const ctx = document.getElementById('waterChart');
            if (ctx) {
                const canvasContext = ctx.getContext('2d');
                if (this.chart) {
                    this.chart.destroy(); // Destroy previous chart if it exists
                }

                console.log("Rendering chart with data:", this.chartData);

                this.chart = new Chart(canvasContext, {
                    type: 'pie',
                    data: this.chartData,
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
                                        label += context.raw + ' units'; // Display units
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
            } else {
                console.error("Canvas element 'waterChart' not found.");
            }
        },
        renderLineChart(data) {
            const ctx = document.getElementById('lineChart').getContext('2d');
            if (this.lineChart) {
                this.lineChart.destroy();
            }
            this.lineChart = new Chart(ctx, {
                type: 'line',
                data: data,
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: false, // Change this if your data can be below zero
                            min: 0 // Set a minimum value for the y-axis if necessary
                        },
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                label: function (context) {
                                    return context.dataset.label + ': ' + context.raw;
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
        async fetchSamples() {
            // Fetch the most recent sample data from the API
            try {
                const response = await fetch('/api/dashboard/samples');
                const samples = await response.json();
                if (samples.length > 0) {
                    this.samples = samples; // Get the most recent sample
                }
            } catch (error) {
                console.error('Error fetching water samples:', error);
            }
        },
    };
}