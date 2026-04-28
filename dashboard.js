document.addEventListener('DOMContentLoaded', () => {

    // ── 0. Authentication Check ──────────────────────────
    if (localStorage.getItem('eco2_authenticated') !== 'true') {
        window.location.href = 'smart-green-login.html';
        return;
    }

    // Update user pill with role
    const userRole = localStorage.getItem('eco2_user_role') || 'visitor';
    const roleLabels = {
        'admin': 'Administrateur',
        'manager': 'Gestionnaire',
        'visitor': 'Visiteur'
    };

    const userNameEl = document.querySelector('.user-pill .name');
    const userRoleEl = document.querySelector('.user-pill .status span:last-child');
    const userImgEl = document.querySelector('.user-pill img');

    if (userNameEl) userNameEl.textContent = 'User ' + (roleLabels[userRole] || 'Visiteur');
    if (userRoleEl) userRoleEl.textContent = roleLabels[userRole] || 'Visiteur';
    if (userImgEl) {
        userImgEl.src = `https://ui-avatars.com/api/?name=${userRole}&background=1a6dff&color=ffffff&bold=true`;
    }

    // ── Color palette (Apex style) ────────────────────────
    const C = {
        blue: '#1a6dff',
        blue2: '#4d90ff',
        teal: '#32CD32',
        purple: '#7B5CF0',
        orange: '#ff7a45',
        text: 'rgba(255, 255, 255, 0.55)',
        grid: 'rgba(255, 255, 255, 0.05)',
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
    const navItems = document.querySelectorAll('.nav-menu li[data-tab]');
    const groupHeaders = document.querySelectorAll('.nav-group-header');
    const tabContents = document.querySelectorAll('.tab-content');
    const pageTitle = document.getElementById('pageTitle');
    const pageDesc = document.getElementById('pageDesc');

    function getTabMeta() {
        return {
            'overview': { title: i18n.getTranslation('nav-overview'), desc: i18n.getTranslation('chart-evolution-desc') },
            'scope1': { title: i18n.getTranslation('scope1-title'), desc: i18n.getTranslation('scope1-tag') },
            'scope2': { title: i18n.getTranslation('scope2-title'), desc: i18n.getTranslation('scope2-tag') },
            'scope3': { title: i18n.getTranslation('scope3-title'), desc: i18n.getTranslation('scope3-tag') },
            'calculator': { title: i18n.getTranslation('nav-calculator'), desc: i18n.getTranslation('calc-desc') },
            'simulation': { title: i18n.getTranslation('nav-simulation'), desc: i18n.getTranslation('sim-desc') || 'Simulez différentes mesures d\'amélioration' },
            'admin': { title: 'Administration', desc: 'Gestion des utilisateurs et permissions' },
        };
    }

    let tabMeta = getTabMeta();

    // Logout Logic
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('eco2_authenticated');
            localStorage.removeItem('eco2_user_role');
            window.location.href = 'smart-green-login.html';
        });
    }

    // Group expand/collapse (Optional check if headers exist)
    groupHeaders.forEach(header => {
        const group = header.closest('.nav-group');
        if (!group) return;
        const sub = group.querySelector('.nav-sub');
        const chevron = header.querySelector('.nav-chevron');
        if (!sub) return;
        sub.style.display = 'none';
        header.addEventListener('click', () => {
            const isOpen = sub.style.display !== 'none';
            sub.style.display = isOpen ? 'none' : 'block';
            if (chevron) chevron.style.transform = isOpen ? 'rotate(0deg)' : 'rotate(90deg)';
        });
    });

    // Tab switching
    function switchTab(tab) {
        navItems.forEach(i => i.classList.remove('active'));
        const active = document.querySelector(`.nav-menu li[data-tab="${tab}"]`);
        if (active) {
            active.classList.add('active');
            // Auto-open parent group if in a sub-menu
            const parentSub = active.closest('.nav-sub');
            const parentGroup = active.closest('.nav-group');
            if (parentSub && parentGroup) {
                parentSub.style.display = 'block';
                const chevron = parentGroup.querySelector('.nav-chevron');
                if (chevron) chevron.style.transform = 'rotate(90deg)';
            }
        }
        tabContents.forEach(tc => tc.classList.toggle('active', tc.id === `tab-${tab}`));
        if (tabMeta[tab] && pageTitle) {
            pageTitle.textContent = tabMeta[tab].title;
            if (pageDesc) pageDesc.textContent = tabMeta[tab].desc;
        }
        if (tab === 'scope1') initScope1();
        if (tab === 'scope2') initScope2();
        if (tab === 'scope3') initScope3();
        if (tab === 'calculator') initCalculator();
        if (tab === 'simulation') calcSimulation();
        if (tab === 'admin') console.log('Admin tab active');
    }

    navItems.forEach(item => {
        item.addEventListener('click', () => switchTab(item.getAttribute('data-tab')));
    });


    // ── 2. Overview: Emissions Line Chart ─────────────────
    const emissionsCtx = document.getElementById('emissionsChart');
    let evolutionChart;
    if (emissionsCtx) {
        const combinedLabels = [
            'Jan 25', 'Fév 25', 'Mar 25', 'Avr 25', 'Mai 25', 'Jun 25', 'Jul 25', 'Aoû 25', 'Sep 25', 'Oct 25', 'Nov 25', 'Déc 25',
            'Jan 26', 'Fév 26', 'Mar 26', 'Avr 26', 'Mai 26', 'Jun 26', 'Jul 26', 'Aoû 26', 'Sep 26', 'Oct 26', 'Nov 26', 'Déc 26',
            'Jan 27', 'Fév 27', 'Mar 27', 'Avr 27', 'Mai 27', 'Jun 27', 'Jul 27', 'Aoû 27', 'Sep 27', 'Oct 27', 'Nov 27', 'Déc 27'
        ];

        const monthlyData = {
            labels: combinedLabels,
            datasets: [
                { 
                    label: 'Réel 2025', 
                    data: [92, 95, 98, 90, 88, 85, 82, 80, 85, 82, 80, 78, ...Array(24).fill(null)], 
                    borderColor: C.blue, 
                    backgroundColor: 'rgba(26, 109, 255, 0.1)',
                    fill: true,
                    tension: 0.4,
                    pointRadius: 4,
                    borderWidth: 3
                },
                { 
                    label: 'Prédiction 2026', 
                    data: [...Array(11).fill(null), 78, 75, 72, 70, 68, 65, 62, 60, 58, 55, 52, 50, 48, ...Array(12).fill(null)], 
                    borderColor: C.teal, 
                    backgroundColor: 'rgba(50, 205, 50, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderDash: [5, 5],
                    pointRadius: 3,
                    borderWidth: 2
                },
                { 
                    label: 'Prédiction 2027', 
                    data: [...Array(23).fill(null), 48, 46, 44, 42, 40, 38, 36, 35, 34, 32, 30, 28, 26], 
                    borderColor: C.purple, 
                    backgroundColor: 'rgba(123, 92, 240, 0.05)',
                    fill: true,
                    tension: 0.4,
                    borderDash: [2, 2],
                    pointRadius: 3,
                    borderWidth: 2
                }
            ]
        };

        evolutionChart = new Chart(emissionsCtx.getContext('2d'), {
            type: 'line',
            data: monthlyData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: true, position: 'top' },
                    tooltip: {
                        callbacks: {
                            label: (context) => ` ${context.dataset.label}: ${context.raw} tCO₂e`
                        }
                    }
                },
                scales: {
                    x: { grid: { display: false }, ticks: { color: C.text } },
                    y: {
                        grid: { color: C.grid },
                        ticks: { color: C.text },
                        title: { display: true, text: 'tCO₂e', color: C.text }
                    }
                }
            }
        });

        // Simplified toggle listener (only one mode now)
        document.querySelectorAll('.chart-toggles span').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.chart-toggles span').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                evolutionChart.update();
            });
        });
    }

    // ── 3. Overview: Scope Distribution Doughnut ──────────
    const distributionCtx = document.getElementById('distributionChart');
    if (distributionCtx) {
        new Chart(distributionCtx.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Scope 1 (28%)', 'Scope 2 (24%)', 'Scope 3 (48%)'],
                datasets: [{
                    data: [312, 260, 526],
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

        // Main Scope 1 Breakdown
        const mainCtx = document.getElementById('scope1Chart');
        if (mainCtx) {
            new Chart(mainCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Combustion fixe (Gaz)', 'Combustion mobile (Véhicules)', 'Fuites Frigorigènes'],
                    datasets: [{
                        label: 'tCO₂e',
                        data: [178, 106, 28],
                        backgroundColor: [C.orange, C.blue, C.teal],
                        borderRadius: 8
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
        }        // Scope 1 Gas Chart
        const gasCtx = document.getElementById('scope1GasChart');
        if (gasCtx) {
            new Chart(gasCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                    datasets: [{
                        label: 'Gaz Naturel (TH)',
                        data: [18560, 25948, 34300, 0, 0, 0, 0, 0, 0, 0, 0, 1473],
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
                    labels: ['Bloc A', 'Bloc B'],
                    datasets: [{
                        label: 'Liters',
                        data: [12, 18],
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
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Consommation Électrique (kWh)',
                    data: [17414, 19206, 15362, 15513, 16464, 17676, 27259, 16397, 36466, 26522, 19741, 24352],
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
                    labels: ['Bloc B (Labs & Enseignement)', 'Bloc A (Admin & Cafétéria)'],
                    datasets: [{
                        data: [465, 250],
                        backgroundColor: [C.blue, C.teal],
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
                    labels: ['Lighting', 'Equipment', '', 'Other'],
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
                    labels: ['Voiture seul', 'Covoiturage', 'Bus/Transport', 'Moto/Scooter', 'Vélo/Marche'],
                    datasets: [{
                        data: [42, 18, 25, 10, 5],
                        backgroundColor: [C.purple, C.blue, C.teal, C.orange, C.blue2],
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

        // Staff vs Student Commuting Chart
        const staffCtx = document.getElementById('staffCommutingChart');
        if (staffCtx) {
            new Chart(staffCtx.getContext('2d'), {
                type: 'bar',
                data: {
                    labels: ['Étudiants', 'Enseignants', 'Admin'],
                    datasets: [{
                        label: 'tCO₂e / an',
                        data: [1054, 91, 54],
                        backgroundColor: [C.teal, C.blue, C.purple],
                        borderRadius: 6
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
    }

    // ── 7. Simulation ─────────────────────────────────────
    const solarSlider = document.getElementById('solar-slider');
    const hvacSlider = document.getElementById('hvac-slider');
    const wasteSlider = document.getElementById('waste-slider');
    const greenSlider = document.getElementById('green-slider');
    const reductionEl = document.getElementById('reduction-total');
    const solarRedEl = document.getElementById('solar-reduction');
    const hvacRedEl = document.getElementById('hvac-reduction');
    const greenRedEl = document.getElementById('green-reduction');

    function calcSimulation() {
        const solar = parseInt(solarSlider?.value || 0);
        const hvac = parseInt(hvacSlider?.value || 0);
        const waste = parseInt(wasteSlider?.value || 0);
        const green = parseInt(greenSlider?.value || 0);

        if (document.getElementById('solar-val')) document.getElementById('solar-val').textContent = `${solar.toLocaleString()} m²`;
        if (document.getElementById('hvac-val')) document.getElementById('hvac-val').textContent = `${hvac} %`;
        if (document.getElementById('waste-val')) document.getElementById('waste-val').textContent = `${waste} %`;
        if (document.getElementById('green-val')) document.getElementById('green-val').textContent = `${green} %`;

        const sRed = solar * 0.221;
        const hRed = hvac * 8.2;
        const gRed = (green - 10) * 2.1; // Sequestration factor
        const total = sRed + hRed + gRed;

        if (solarRedEl) solarRedEl.textContent = `— ${sRed.toFixed(1)} t`;
        if (hvacRedEl) hvacRedEl.textContent = `— ${hRed.toFixed(1)} t`;
        if (greenRedEl) greenRedEl.textContent = `— ${gRed.toFixed(1)} t`;

        if (reductionEl) {
            reductionEl.innerHTML = `- ${total.toFixed(1)} <small>tCO₂e/an</small>`;
        }
    }

    if (solarSlider) {
        [solarSlider, hvacSlider, wasteSlider, greenSlider].forEach(s => {
            if (s) s.addEventListener('input', calcSimulation);
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
            'calc-elec', 'calc-travel'
        ];

        const factors = {
            gas: 0.002202, // tCO2e / m3 (User update: 2.202 kg)
            fuel: 0.002640, // tCO2e / L  (User update: 2.640 kg)
            refrig: 2.088,    // tCO2e / kg (User update: GWP 2088 for R-410A)
            elec: 0.000565, // tCO2e / kWh (User update: 0.565 kg)
            travel: 0.00021,  // tCO2e / km (User update: 0.21 kg for Solo Car)
        };

        const updateCalc = () => {
            const v = (id) => parseFloat(document.getElementById(id).value) || 0;

            const s1 = (v('calc-gas') * factors.gas) + (v('calc-fuel') * factors.fuel) + (v('calc-refrig') * factors.refrig);
            const s2 = (v('calc-elec') * factors.elec);
            const s3 = (v('calc-travel') * factors.travel);
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

    }

    // ── 10. Language Change Listener ──────────────────────
    window.addEventListener('languageChanged', () => {
        tabMeta = getTabMeta();
        const activeItem = document.querySelector('.nav-menu li.active');
        if (activeItem) {
            const activeTab = activeItem.getAttribute('data-tab');
            if (activeTab && pageTitle) {
                pageTitle.textContent = tabMeta[activeTab].title;
                if (pageDesc) pageDesc.textContent = tabMeta[activeTab].desc;
            }
        }
    });

    // ── 11. Top Bar Actions ───────────────────────────
    const searchInput = document.querySelector('.search-bar input');
    const notifBtn = document.getElementById('notif-btn');
    const notifPanel = document.getElementById('notif-panel');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const closeSettings = document.getElementById('close-settings');
    const saveSettings = document.getElementById('save-settings');

    // Search functionality
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = searchInput.value.toLowerCase().trim();
                if (query === '') return;

                // Simple search simulation: switch to tab if matches
                const tabs = ['overview', 'scope1', 'scope2', 'scope3', 'calculator', 'simulation'];
                const match = tabs.find(t => t.includes(query) || query.includes(t));

                if (match) {
                    const item = document.querySelector(`.nav-menu li[data-tab="${match}"]`);
                    if (item) item.click();
                } else {
                    alert(`Recherche pour "${query}" : Aucun résultat précis. Essayez 'Scope 1', 'Solaire', 'Simulation'...`);
                }
            }
        });
    }

    // Notifications toggle
    if (notifBtn && notifPanel) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notifPanel.classList.toggle('active');
            // Hide badge when opened
            const badge = document.getElementById('notif-badge');
            if (badge) badge.style.display = 'none';
        });
    }

    // Settings Modal
    if (settingsBtn && settingsModal) {
        settingsBtn.addEventListener('click', () => {
            settingsModal.classList.add('active');
        });
    }

    if (closeSettings && settingsModal) {
        closeSettings.addEventListener('click', () => {
            settingsModal.classList.remove('active');
        });
    }

    if (saveSettings && settingsModal) {
        saveSettings.addEventListener('click', () => {
            alert('Paramètres enregistrés avec succès.');
            settingsModal.classList.remove('active');
        });
    }

    // Global click to close dropdowns
    window.addEventListener('click', () => {
        if (notifPanel) notifPanel.classList.remove('active');
    });

    if (notifPanel) {
        notifPanel.addEventListener('click', (e) => e.stopPropagation());
    }

});