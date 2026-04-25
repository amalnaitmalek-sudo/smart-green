document.addEventListener('DOMContentLoaded', () => {

    // ── Color palette (Apex style) ────────────────────────
    const C = {
        blue:       '#1a6dff',
        blue2:      '#4d90ff',
        teal:       '#00d68f',
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

    const tabMeta = {
        overview:   { title: 'Vue d\'Ensemble',            desc: 'eco² — Bilan carbone global de l\'ENSIT · Exercice 2026' },
        scope1:     { title: 'Scope 1 — Émissions Directes', desc: 'Sources contrôlées par l\'ENSIT : chaudières, véhicules, fluides frigorigènes' },
        scope2:     { title: 'Scope 2 — Énergie Achetée',    desc: 'Électricité achetée à la STEG — principal poste d\'émission de l\'ENSIT' },
        scope3:     { title: 'Scope 3 — Émissions Amont & Aval', desc: 'Déplacements domicile-campus, achats, déchets et chaîne de valeur' },
        simulation: { title: 'Simulation de Décarbonation', desc: 'eco² — Modélisation prédictive des leviers de réduction ENSIT' },
        reports:    { title: 'Rapports Carbone eco²',        desc: 'Rapports officiels conformes au Protocole GHG International' },
    };

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
        });
    });

    // ── 2. Overview: Emissions Line Chart ─────────────────
    const emissionsCtx = document.getElementById('emissionsChart');
    if (emissionsCtx) {
        new Chart(emissionsCtx.getContext('2d'), {
            type: 'bar',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [
                    {
                        label: 'Émissions tCO₂e',
                        data: [128, 140, 122, 155, 142, 160, 148, 135, 119, 138, 145, 130],
                        backgroundColor: grad(emissionsCtx.getContext('2d'), C.blue, '50', '20'),
                        borderColor: C.blue,
                        borderWidth: 1.5,
                        borderRadius: 6,
                    },
                    {
                        label: 'Objectif',
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
    const distributionCtx = document.getElementById('distributionChart');
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
                labels: ['Chaudières\nGaz', 'Groupe\nÉlectrogène', 'Flotte\nVéhicules', 'Fluides\nFrigorigènes', 'Autres'],
                datasets: [{
                    label: 'Émissions Scope 1 (tCO₂e)',
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
                    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
                    datasets: [{
                        label: 'Gaz Naturel (m³)',
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
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun', 'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'],
                datasets: [{
                    label: 'Électricité (MWh)',
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
                    labels: ['A (Admin)', 'B (Labs)', 'C (Cours)', 'D (Ate)'],
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
                    labels: ['Voiture Solo', 'Covoiturage', 'Transport Public', 'Vélo/Marche', 'Moto'],
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
                    labels: ['Recyclé', 'Composté', 'Incinéré', 'Décharge'],
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
                    labels: ['Papier', 'Informatique', 'Mobilier', 'Chimie'],
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

        const ctx = document.getElementById('scope3Chart');
        if (!ctx) return;
        new Chart(ctx.getContext('2d'), {
            type: 'bar',
            indexAxis: 'y',
            data: {
                labels: ['Déplacements\nPersonnel', 'Déplacements\nÉtudiants', 'Achats\nBiens/Services', 'Gestion\nDéchets', 'Voyages\nPro', 'Autres'],
                datasets: [{
                    label: 'Émissions Scope 3 (tCO₂e)',
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
                        label: 'Avec mesures',
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

});
