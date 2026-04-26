document.addEventListener('DOMContentLoaded', () => {

    // ── Color palette (Apex style) ────────────────────────
    const C = {
        blue:       '#1a6dff',
        blue2:      '#4d90ff',
        teal:       '#32CD32',
        purple:     '#7B5CF0',
        orange:     '#ff7a45',
        text:       'rgba(255, 255, 255, 0.55)',
        grid:       'rgba(255, 255, 255, 0.05)',
        tooltip_bg: 'rgba(10, 16, 51, 0.95)',
    };

    // Apply global Chart.js defaults
    Chart.defaults.color = C.text;
    Chart.defaults.font.family = "'Inter', sans-serif";
    Chart.defaults.plugins.tooltip.backgroundColor = C.tooltip_bg;
    Chart.defaults.plugins.tooltip.borderColor = C.blue;
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.cornerRadius = 10;
    Chart.defaults.plugins.legend.labels.usePointStyle = true;
    Chart.defaults.plugins.legend.labels.padding = 20;

    // Gradient helper
    function grad(ctx, color, alpha1 = '55', alpha2 = '00') {
        const g = ctx.createLinearGradient(0, 0, 0, 350);
        g.addColorStop(0, color + alpha1);
        g.addColorStop(1, color + alpha2);
        return g;
    }

    // ── 1. Tab Navigation ─────────────────────────────────
    const navItems    = document.querySelectorAll('.nav-menu li[data-tab]');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle   = document.getElementById('pageTitle');
    const pageDesc    = document.getElementById('pageDesc');

    const getTabMeta = () => ({
        overview:   { title: i18n.getTranslation('nav-overview'),   desc: i18n.getTranslation('chart-evolution-desc') },
        scope1:     { title: i18n.getTranslation('scope1-title'),    desc: i18n.getTranslation('scope1-desc').substring(0, 80) + '...' },
        scope2:     { title: i18n.getTranslation('scope2-title'),    desc: i18n.getTranslation('scope2-desc').substring(0, 80) + '...' },
        scope3:     { title: i18n.getTranslation('scope3-title'),    desc: i18n.getTranslation('scope3-desc').substring(0, 80) + '...' },
        calculator: { title: i18n.getTranslation('nav-calculator'), desc: i18n.getTranslation('calc-desc').substring(0, 80) + '...' },
        simulation: { title: i18n.getTranslation('nav-simulation'), desc: i18n.getTranslation('hero-desc').substring(0, 80) + '...' },
    });

    let tabMeta = getTabMeta();

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const tab = item.getAttribute('data-tab');
            if (!tab) return;

            // Active nav item
            navItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            // Switch tab
            tabContents.forEach(tc => {
                tc.classList.toggle('active', tc.id === `tab-${tab}`);
            });

            // Update page title
            if (tabMeta[tab] && pageTitle) {
                pageTitle.textContent = tabMeta[tab].title;
                pageDesc.textContent  = tabMeta[tab].desc;
            }

            // Lazy-init scope charts on first switch
            if (tab === 'scope1') initScope1();
            if (tab === 'scope2') initScope2();
            if (tab === 'scope3') initScope3();
            if (tab === 'calculator') initCalculator();
        });
    });

    // ── 2. Overview: Emissions Line Chart ─────────────────
    const emissionsCtx = document.getElementById('mainEvolutionChart');
    if (emissionsCtx) {
        new Chart(emissionsCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [
                    {
                        label: 'Emissions tCO₂e',
                        data: [128, 140, 122, 155, 142, 160, 148, 135, 119, 138, 145, 130],
                        backgroundColor: grad(emissionsCtx.getContext('2d'), C.blue, '50', '20'),
                        borderColor: C.blue,
                        borderWidth: 1.5,
                        borderRadius: 6,
                    },
                    {
                        label: 'Target',
                        data: [130, 128, 126, 124, 122, 120, 118, 116, 114, 112, 110, 108],
                        type: 'line',
                        borderColor: C.teal,
                        borderWidth: 2,
                        borderDash: [5, 5],
                        pointRadius: 0,
                        fill: false,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, position: 'top' } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: C.text } },
                    y: {
                        grid: { color: C.grid },
                        ticks: { color: C.text },
                        min: 0,
                    }
                }
            }
        });
    }

    // ── 3. Overview: Scope Distribution Doughnut ──────────
    const distributionCtx = document.getElementById('overviewScopeChart');
    if (distributionCtx) {
        new Chart(distributionCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Scope 1 (22%)', 'Scope 2 (41%)', 'Scope 3 (37%)'],
                datasets: [{
                    data: [312, 582, 526],
                    backgroundColor: [C.blue, C.teal, C.purple],
                    borderWidth: 0,
                    borderRadius: 8,
                    hoverOffset: 12,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: { legend: { position: 'bottom' } }
            }
        });
    }

    // ── 4. Scope 1 Chart ──────────────────────────────────
    let scope1Init = false;
    function initScope1() {
        if (scope1Init) return;
        scope1Init = true;
        const ctx = document.getElementById('scope1Chart');
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Gas\nBoilers', 'Emergency\nGenerator', 'Vehicle\nFleet', 'Refrigerant\nFluids', 'Others'],
                datasets: [{
                    label: 'Scope 1 Emissions (tCO₂e)',
                    data: [142, 58, 68, 28, 16],
                    backgroundColor: [C.orange + 'cc', C.orange + '99', C.orange + '77', C.orange + '55', C.orange + '33'],
                    borderColor: C.orange,
                    borderWidth: 1,
                    borderRadius: 8,
                    borderSkipped: false,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: C.text } },
                    y: { grid: { color: C.grid }, ticks: { color: C.text } }
                }
            }
        });

        // Scope 1 Gas Chart
        const gasCtx = document.getElementById('scope1GasChart');
        if (gasCtx) {
            new Chart(gasCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'Natural Gas (m³)',
                        data: [2100, 1950, 1600, 1100, 450, 200],
                        borderColor: C.orange,
                        backgroundColor: grad(gasCtx.getContext('2d'), C.orange, '30', '00'),
                        fill: true,
                        tension: 0.4,
                        borderWidth: 2
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { grid: { display: false }, ticks: { color: C.text } },
                        y: { grid: { color: C.grid }, ticks: { color: C.text } }
                    }
                }
            });
        }

        // Fleet Chart
        const fleetCtx = document.getElementById('fleetChart');
        if (fleetCtx) {
            new Chart(fleetCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Admin (Diesel)', 'Utility (Diesel)', 'Bus (Fuel)', 'Service (Gasoline)'],
                    datasets: [{
                        data: [450, 890, 1200, 320],
                        backgroundColor: [C.orange, C.orange + 'cc', C.orange + '99', C.orange + '66'],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Generator Chart
        const genCtx = document.getElementById('generatorChart');
        if (genCtx) {
            new Chart(genCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Admin A', 'Block B', 'Labs C', 'Cafeteria', 'Workshop'],
                    datasets: [{
                        label: 'Liters',
                        data: [2, 1, 4, 0, 8, 3],
                        backgroundColor: C.orange + '88',
                        borderRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }
    }

    // ── 5. Scope 2 Chart ──────────────────────────────────
    let scope2Init = false;
    function initScope2() {
        if (scope2Init) return;
        scope2Init = true;
        const ctx = document.getElementById('scope2Chart');
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                datasets: [{
                    label: 'Gas Usage (m³)',
                    data: [410, 435, 390, 460, 420, 510, 495, 450, 380, 420, 440, 395],
                    borderColor: C.blue,
                    backgroundColor: grad(ctx.getContext('2d'), C.blue, '40', '05'),
                    fill: true,
                    tension: 0.45,
                    borderWidth: 2.5,
                    pointBackgroundColor: C.blue,
                    pointBorderColor: '#04071A',
                    pointBorderWidth: 2,
                    pointRadius: 4,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: C.text } },
                    y: { grid: { color: C.grid }, ticks: { color: C.text } }
                }
            }
        });

        // Scope 2 Building Breakdown
        const bCtx = document.getElementById('scope2BuildingChart');
        if (bCtx) {
            new Chart(bCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['A (Admin)', 'B (Labs)', 'C (Classrooms)', 'D (Workshop)'],
                    datasets: [{
                        data: [120, 240, 110, 85],
                        backgroundColor: [C.blue, C.teal, C.purple, C.orange],
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Power Peak Chart
        const peakCtx = document.getElementById('powerPeakChart');
        if (peakCtx) {
            new Chart(peakCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'kVA',
                        data: [320, 310, 340, 380, 420, 450],
                        borderColor: C.teal,
                        backgroundColor: grad(peakCtx.getContext('2d'), C.teal, '20', '00'),
                        fill: true,
                        tension: 0.3
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Lighting vs Equipment
        const lightCtx = document.getElementById('lightingEquipmentChart');
        if (lightCtx) {
            new Chart(lightCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Lighting', 'Equipment', 'HVAC', 'Other'],
                    datasets: [{
                        label: 'Breakdown (%)',
                        data: [25, 45, 20, 10],
                        backgroundColor: [C.blue, C.teal, C.purple, C.orange],
                        borderWidth: 0,
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '65%',
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }
    }

    // ── 6. Scope 3 Chart ──────────────────────────────────
    let scope3Init = false;
    function initScope3() {
        if (scope3Init) return;
        scope3Init = true;

        // Transport Modes Chart
        const transportCtx = document.getElementById('transportChart');
        if (transportCtx) {
            new Chart(transportCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: ['Solo Car', 'Carpooling', 'Public Transport', 'Bike/Walk', 'Motorcycle'],
                    datasets: [{
                        data: [45, 15, 25, 10, 5],
                        backgroundColor: [C.purple, C.blue, C.teal, C.blue2, C.orange],
                        borderWidth: 0,
                        borderRadius: 4,
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { 
                        legend: { position: 'right' },
                        title: { display: false }
                    },
                    cutout: '60%'
                }
            });
        }

        // Waste Breakdown
        const wCtx = document.getElementById('wasteBreakdownChart');
        if (wCtx) {
            new Chart(wCtx.getContext('2d'), {
                type: 'pie',
                data: {
                    labels: ['Recycled', 'Composted', 'Incinerated', 'Landfill'],
                    datasets: [{
                        data: [62, 12, 18, 8],
                        backgroundColor: [C.teal, C.blue, C.purple, C.orange],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { position: 'bottom' } }
                }
            });
        }

        // Purchases Chart
        const pCtx = document.getElementById('purchasesChart');
        if (pCtx) {
            new Chart(pCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Paper', 'IT', 'Furniture', 'Chemicals'],
                    datasets: [{
                        data: [24, 48, 12, 36],
                        backgroundColor: C.purple,
                        borderRadius: 6
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Staff vs Student Commuting
        const scCtx = document.getElementById('staffCommutingChart');
        if (scCtx) {
            new Chart(scCtx.getContext('2d'), {
                type: 'bar',
                data: {
                labels: ['Students', 'Teachers', 'Admin Staff'],
                datasets: [{
                    label: 'tCO₂e',
                    data: [142, 45, 12],
                        backgroundColor: [C.purple, C.blue, C.teal],
                        borderRadius: 5
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // Water Consumption
        const waterCtx = document.getElementById('waterConsumptionChart');
        if (waterCtx) {
            new Chart(waterCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                    datasets: [{
                        label: 'm³',
                        data: [450, 420, 480, 510, 550, 620],
                        borderColor: C.blue2,
                        backgroundColor: grad(waterCtx.getContext('2d'), C.blue2, '20', '00'),
                        fill: true,
                        tension: 0.4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } }
                }
            });
        }

        const ctx = document.getElementById('scope3Chart');
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            indexAxis: 'y',
            data: {
                labels: ['Staff\nCommuting', 'Student\nCommuting', 'Purchases\nGoods/Services', 'Waste\nManagement', 'Business\nTravel', 'Others'],
                datasets: [{
                    label: 'Scope 3 Emissions (tCO₂e)',
                    data: [198, 142, 86, 52, 30, 18],
                    backgroundColor: [
                        C.purple + 'cc', C.purple + 'aa', C.purple + '88',
                        C.purple + '66', C.purple + '44', C.purple + '22'
                    ],
                    borderColor: C.purple,
                    borderWidth: 1,
                    borderRadius: 6,
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: {
                    x: { grid: { color: C.grid }, ticks: { color: C.text } },
                    y: { grid: { display: false }, ticks: { color: C.text } }
                }
            }
        });
    }

    // ── 7. Simulation ─────────────────────────────────────
    const solarSlider = document.getElementById('solar-slider');
    const hvacSlider  = document.getElementById('hvac-slider');
    const wasteSlider = document.getElementById('waste-slider');
    const reductionEl = document.getElementById('reduction-total');
    const solarRedEl  = document.getElementById('solar-reduction');
    const hvacRedEl   = document.getElementById('hvac-reduction');
    const wasteRedEl  = document.getElementById('waste-reduction');

    function calcSimulation() {
        const solar = parseInt(solarSlider.value);
        const hvac  = parseInt(hvacSlider.value);
        const waste = parseInt(wasteSlider.value);

        document.getElementById('solar-val').textContent = `${solar.toLocaleString()} m²`;
        document.getElementById('hvac-val').textContent  = `${hvac} %`;
        document.getElementById('waste-val').textContent = `${waste} %`;

        const sRed = solar * 0.11;
        const hRed = hvac * 8.2;
        const wRed = Math.max(0, (waste - 62) * 1.8);
        const total = sRed + hRed + wRed;

        if (solarRedEl) solarRedEl.textContent = `— ${sRed.toFixed(1)} t`;
        if (hvacRedEl)  hvacRedEl.textContent  = `— ${hRed.toFixed(1)} t`;
        if (wasteRedEl) wasteRedEl.textContent = `— ${wRed.toFixed(1)} t`;

        if (reductionEl) {
            reductionEl.innerHTML = `- ${total.toFixed(1)} <small>tCO₂e/an</small>`;
        }
    }

    if (solarSlider) {
        [solarSlider, hvacSlider, wasteSlider].forEach(s => {
            s.addEventListener('input', calcSimulation);
        });
    }

    // ── 8. Projection Chart ───────────────────────────────
    const projCtx = document.getElementById('projectionChart');
    if (projCtx) {
        new Chart(projCtx.getContext('2d'), {
            type: 'line',
            data: {
                labels: ['2026', '2027', '2028', '2029', '2030'],
                datasets: [
                    {
                        label: 'Baseline',
                        data: [1420, 1440, 1460, 1480, 1500],
                        borderColor: C.orange,
                        borderWidth: 1.5,
                        borderDash: [4, 4],
                        tension: 0.3,
                        fill: false,
                        pointRadius: 3,
                    },
                    {
                        label: 'With measures',
                        data: [1420, 1320, 1220, 1100, 980],
                        borderColor: C.teal,
                        backgroundColor: grad(projCtx.getContext('2d'), C.teal, '35', '00'),
                        fill: true,
                        tension: 0.45,
                        borderWidth: 2.5,
                        pointBackgroundColor: C.teal,
                        pointBorderColor: '#04071A',
                        pointBorderWidth: 2,
                        pointRadius: 4,
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: { legend: { display: true, position: 'top' } },
                scales: {
                    x: { grid: { display: false }, ticks: { color: C.text } },
                    y: { grid: { color: C.grid }, ticks: { color: C.text }, min: 800 }
                }
            }
        });
    }

    // ── 9. Carbon Calculator Logic ────────────────────────
    let calculatorInit = false;
    function initCalculator() {
        if (calculatorInit) return;
        calculatorInit = true;

        const inputs = [
            'calc-gas', 'calc-fuel', 'calc-refrig', 
            'calc-elec', 'calc-travel', 'calc-waste', 'calc-water'
        ];

        const factors = {
            gas:    0.00204, // tCO2e / m3
            fuel:   0.00268, // tCO2e / L
            refrig: 2.088,   // tCO2e / kg (moyenne R410A)
            elec:   0.0005,  // tCO2e / kWh
            travel: 0.00018, // tCO2e / km
            waste:  0.45,    // tCO2e / t
            water:  0.0003,  // tCO2e / m3
        };

        const updateCalc = () => {
            const v = (id) => parseFloat(document.getElementById(id).value) || 0;

            const s1 = (v('calc-gas') * factors.gas) + (v('calc-fuel') * factors.fuel) + (v('calc-refrig') * factors.refrig);
            const s2 = (v('calc-elec') * factors.elec);
            const s3 = (v('calc-travel') * factors.travel) + (v('calc-waste') * factors.waste) + (v('calc-water') * factors.water);
            const total = s1 + s2 + s3;

            document.getElementById('calc-s1-val').textContent = s1.toFixed(2) + ' t';
            document.getElementById('calc-s2-val').textContent = s2.toFixed(2) + ' t';
            document.getElementById('calc-s3-val').textContent = s3.toFixed(2) + ' t';
            document.getElementById('calc-total-val').textContent = total.toFixed(2);
        };

        inputs.forEach(id => {
            document.getElementById(id).addEventListener('input', updateCalc);
        });

        document.getElementById('btn-calculate-now').addEventListener('click', updateCalc);
        document.getElementById('btn-reset-calc').addEventListener('click', () => {
            inputs.forEach(id => document.getElementById(id).value = 0);
            updateCalc();
        });

        // Export Simulation (Removed as requested, but keeping PDF for general print if needed)
        document.querySelectorAll('.export-pdf-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                window.print();
            });
        });

        // Import Simulation (PDF/Excel)
        const pdfInput = document.getElementById('file-import-pdf');
        const excelInput = document.getElementById('file-import-excel');

        const simulateImport = (filename) => {
            alert('Analyzing document: ' + filename + '...');
            setTimeout(() => {
                // Simulate extracting data from an invoice
                document.getElementById('calc-elec').value = (Math.random() * 10000 + 5000).toFixed(0);
                document.getElementById('calc-gas').value = (Math.random() * 2000 + 500).toFixed(0);
                updateCalc();
                alert('Data successfully extracted from the document!');
            }, 2000);
        };

        if (pdfInput) pdfInput.addEventListener('change', (e) => {
            if (e.target.files[0]) simulateImport(e.target.files[0].name);
        });
        if (excelInput) excelInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (evt) => {
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, { type: 'binary' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

                alert('File "' + file.name + '" read successfully! Analyzing data...');

                // Logique de recherche simple dans le tableur
                data.forEach(row => {
                    row.forEach(cell => {
                        if (typeof cell === 'string') {
                            const val = cell.toLowerCase();
                            // Example: if a cell contains "Electricity" or "steg" and the next cell is a number
                            if (val.includes('elec') || val.includes('élec') || val.includes('steg')) {
                                const consumption = row.find(c => typeof c === 'number');
                                if (consumption) document.getElementById('calc-elec').value = consumption;
                            }
                            if (val.includes('gas') || val.includes('gaz')) {
                                const consumption = row.find(c => typeof c === 'number');
                                if (consumption) document.getElementById('calc-gas').value = consumption;
                            }
                            if (val.includes('fuel') || val.includes('carburant') || val.includes('essence')) {
                                const consumption = row.find(c => typeof c === 'number');
                                if (consumption) document.getElementById('calc-fuel').value = consumption;
                            }
                        }
                    });
                });

                updateCalc();
                alert('Data updated from Excel file.');
            };
            reader.readAsBinaryString(file);
        });

        // Manual Invoice Entry
        const btnAddInvoice = document.getElementById('btn-add-invoice');
        if (btnAddInvoice) {
            btnAddInvoice.addEventListener('click', () => {
                const type = document.getElementById('invoice-type').value;
                const usage = parseFloat(document.getElementById('invoice-usage').value) || 0;
                
                if (usage === 0) {
                    alert('Please enter a valid consumption value.');
                    return;
                }

                // Add to corresponding field
                if (type === 'elec') document.getElementById('calc-elec').value = parseFloat(document.getElementById('calc-elec').value) + usage;
                if (type === 'gas') document.getElementById('calc-gas').value = parseFloat(document.getElementById('calc-gas').value) + usage;
                if (type === 'fuel') document.getElementById('calc-fuel').value = parseFloat(document.getElementById('calc-fuel').value) + usage;
                if (type === 'water') document.getElementById('calc-water').value = parseFloat(document.getElementById('calc-water').value) + usage;

                updateCalc();
                alert('Invoice added to global calculation!');
                
                // Clear fields
                document.getElementById('invoice-amount').value = '';
                document.getElementById('invoice-usage').value = '';
            });
        }
    }

    // ── 10. Language Change Listener ──────────────────────
    window.addEventListener('languageChanged', () => {
        tabMeta = getTabMeta();
        const activeTab = document.querySelector('.nav-menu li.active').getAttribute('data-tab');
        if (activeTab && pageTitle) {
            pageTitle.textContent = tabMeta[activeTab].title;
            pageDesc.textContent  = tabMeta[activeTab].desc;
        }
        // Update charts with new labels if necessary
        // For simplicity, we can reload or just update labels. 
        // Most charts use hardcoded labels in this demo, but we could make them dynamic.
    });

});
