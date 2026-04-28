const translations = {
    fr: {
        // Sidebar
        "nav-analysis": "Analyse GHG",
        "nav-tools": "Outils",
        "nav-overview": "Vue d'ensemble",
        "nav-scope1": "Scope 1",
        "nav-scope2": "Scope 2",
        "nav-scope3": "Scope 3",
        "nav-calculator": "Calculateur",
        "nav-simulation": "IA Simulation",
        "system-active": "Système actif",

        // Top Nav
        "search-placeholder": "Scope, bâtiment, année...",
        "logout": "Déconnexion",
        "settings": "Paramètres",
        "notifications": "Notifications",

        // Overview
        "hero-title": "BILAN<br><span>CARBONE ENSIT</span>",
        "hero-desc": "eco² est l'outil de suivi et d'analyse de l'empreinte carbone de l'École Nationale Supérieure d'Ingénieurs de Tunis, couvrant les émissions directes et indirectes conformément au Protocole GHG International.",
        "btn-simulate": "Simuler des Réductions",
        "btn-export": "Exporter le Rapport",
        "kpi-total-emissions": "Émissions Totales",
        "kpi-per-student": "Par Étudiant",
        "kpi-per-lab": "Par Laboratoire",
        "kpi-intensity": "Intensité / m²",
        "chart-evolution-title": "Évolution Mensuelle des Émissions",
        "chart-evolution-desc": "eco² · Bilan carbone global de l'ENSIT",
        "toggle-monthly": "Mensuel",
        "toggle-weekly": "Hebdo",
        "scope-summary-title": "Synthèse des Scopes (GHG Protocol)",
        "scope-summary-desc": "Vue comparative des sources d'émissions directes et indirectes",
        "distribution-title": "Répartition par Scope",
        "distribution-desc": "Distribution GHG",
        "buildings-title": "Bâtiments de l'ENSIT",
        "buildings-desc": "Classement par volume d'émissions (tCO₂e / an)",
        "alerts-title": "Alertes & Anomalies",
        "alerts-desc": "Détecteur automatique IA",

        // Scopes
        "scope1-title": "Scope 1 — Émissions Directes",
        "scope1-desc": "Ce périmètre couvre l'ensemble des émissions directes provenant de sources détenues ou contrôlées par l'établissement. Il inclut : la combustion de combustibles sur site (chauffage, équipements), l'utilisation de carburants pour les véhicules de l'établissement, et les émissions fugitives de fluides frigorigènes des systèmes de climatisation.",
        "scope1-tag": "Émissions Directes",
        "scope2-title": "Scope 2 — Émissions Indirectes Liées à l'Énergie",
        "scope2-desc": "Ce scope regroupe les émissions indirectes de GES associées à la consommation d'énergie importée par le complexe universitaire. Elle couvre l'électricité pour l'éclairage, les équipements informatiques, les systèmes de climatisation et toute autre consommation électrique du campus.",
        "scope2-tag": "Énergie Importée",
        "scope3-title": "Scope 3 — Autres Émissions Indirectes (Périmètre Restreint)",
        "scope3-desc": "Ce scope couvre les autres émissions indirectes hors Scope 1 et 2. Le périmètre est volontairement restreint au Transport Domicile-Campus : déplacements des étudiants, enseignants et personnel administratif, via différents modes de transport.",
        "scope3-tag": "Transport Domicile-Campus",

        // Calculator
        "calc-title": "Saisie & Calcul d'Impact",
        "calc-desc": "Importez vos factures (PDF/Excel) ou saisissez manuellement vos données de consommation pour calculer votre empreinte carbone.",
        "calc-result-title": "Résultat du Calcul",
        "btn-recalculate": "Recalculer",
        "btn-reset": "Réinitialiser",

        // Login / Register
        "login-title": "Connexion",
        "register-title": "Inscription",
        "email-label": "Adresse Email",
        "password-label": "Mot de Passe",
        "btn-login": "Se connecter",
        "btn-register": "S'inscrire",

        // Detailed Scopes & Labels
        "scope-summary-boiler": "Chaudières Gaz",
        "scope-summary-vehicles": "Véhicules",
        "scope-summary-fugitive": "Fugitives",
        "scope-summary-steg": "Électricité STEG",
        "scope-summary-heating": "Chauffage Urbain",
        "scope-summary-ev": "Véhicules Élec",
        "scope-summary-mobility": "Mobilité Étud.",
        "scope-summary-waste": "Déchets",
        "scope-summary-water": "Eau",

        "scope-sources-title": "Détail des Sources",
        "scope-sources-desc": "Décomposition par type de source",
        "scope-gas-title": "Consommation Gaz & Fioul",
        "scope-gas-desc": "Évolution mensuelle du chauffage central",
        "scope-fleet-title": "Parc Automobile",
        "scope-fleet-desc": "Consommation carburant par type (L)",
        "scope-gen-title": "Groupe Électrogène",
        "scope-gen-desc": "Heures de fonctionnement et fioul",
        "scope-elec-title": "Consommation Électrique",
        "scope-elec-desc": "Répartition mensuelle (MWh)",
        "scope-bldg-title": "Consommation par Bâtiment",
        "scope-bldg-desc": "Répartition électrique (MWh / an)",
        "scope-peak-title": "Pics de Puissance",
        "scope-peak-desc": "Appel de puissance maximal (kVA)",
        "scope-usage-title": "Usage de l'Énergie",
        "scope-usage-desc": "Éclairage vs Équipements vs CVC",
        "scope-perf-title": "Performance Énergétique",
        "scope-perf-desc": "Ratios d'efficacité par service",
        "scope-pv-title": "Solution PV Proposée",
        "scope-pv-desc": "Dimensionnement pour l'autoconsommation",
        "scope-transp-title": "Modes de Transport",
        "scope-transp-desc": "Mobilité Campus (Scope 3)",
        "scope-waste-title": "Gestion des Déchets",
        "scope-waste-desc": "Répartition par filière (t)",
        "scope-mobility-profile": "Mobilité par Profil",
        "scope-mobility-desc": "Personnel vs Étudiants (tCO2e)",
        "scope-water-title": "Consommation d'Eau",
        "scope-water-desc": "Évolution mensuelle (m³)",
        "scope-purchases-title": "Achats & Services",
        "scope-purchases-desc": "Impact des fournitures pédagogiques",

        "campus-users": "Usagers du campus",
        "active-students": "Étudiants actifs",
        "staff-teachers": "Pers. & Enseignants",
        "bloc-a": "Bloc A (Admin & Cafétéria)",
        "bloc-b": "Bloc B (Labs & Enseignement)",

        "calc-gas-label": "Gaz Naturel (m³)",
        "calc-fuel-label": "Carburant Flotte (L)",
        "calc-refrig-label": "Fluides Frigorigènes (kg)",
        "calc-elec-label": "Électricité STEG (kWh)",
        "calc-waste-label": "Déchets (kg)",
        "calc-water-label": "Eau Potable (m³)",
        "calc-travel-label": "Voyages / Missions (km)"
    },
    en: {
        // Sidebar
        "nav-analysis": "GHG Analysis",
        "nav-tools": "Tools",
        "nav-overview": "Overview",
        "nav-scope1": "Scope 1",
        "nav-scope2": "Scope 2",
        "nav-scope3": "Scope 3",
        "nav-calculator": "Calculator",
        "nav-simulation": "AI Simulation",
        "system-active": "System active",

        // Top Nav
        "search-placeholder": "Scope, building, year...",
        "logout": "Logout",
        "settings": "Settings",
        "notifications": "Notifications",

        // Overview
        "hero-title": "ENSIT<br><span>CARBON FOOTPRINT</span>",
        "hero-desc": "eco² is the tool for monitoring and analyzing the carbon footprint of the National Engineering School of Tunis, covering direct and indirect emissions in accordance with the International GHG Protocol.",
        "btn-simulate": "Simulate Reductions",
        "btn-export": "Export Report",
        "kpi-total-emissions": "Total Emissions",
        "kpi-per-student": "Per Student",
        "kpi-per-lab": "Per Laboratory",
        "kpi-intensity": "Intensity / m²",
        "chart-evolution-title": "Monthly Emissions Evolution",
        "chart-evolution-desc": "eco² · Comprehensive Carbon Assessment of ENSIT",
        "toggle-monthly": "Monthly",
        "toggle-weekly": "Weekly",
        "toggle-prediction": "AI Prediction",
        "scope-summary-title": "Scope Synthesis (GHG Protocol)",
        "scope-summary-desc": "Comparative view of direct and indirect emission sources",
        "distribution-title": "Distribution by Scope",
        "distribution-desc": "GHG Distribution",
        "buildings-title": "ENSIT Buildings",
        "buildings-desc": "Ranking by emission volume (tCO2e / year)",
        "alerts-title": "Alerts & Anomalies",
        "alerts-desc": "AI Automatic Detector",

        // Scopes
        "scope1-title": "Scope 1 — Direct Emissions",
        "scope1-desc": "This perimeter covers all direct emissions from sources owned or controlled by the institution. It includes: on-site fuel combustion (heating, equipment), fuel use for institutional vehicles, and fugitive emissions from refrigerant fluids in air conditioning systems.",
        "scope1-tag": "Direct Emissions",
        "scope2-title": "Scope 2 — Indirect Energy-Related Emissions",
        "scope2-desc": "This scope covers indirect GHG emissions associated with imported energy consumption by the university campus. It includes electricity for lighting, IT equipment, HVAC systems, and all other campus electrical consumption.",
        "scope2-tag": "Imported Energy",
        "scope3-title": "Scope 3 — Other Indirect Emissions (Restricted Perimeter)",
        "scope3-desc": "This scope covers other indirect emissions beyond Scope 1 and 2. The perimeter is deliberately restricted to Home-to-Campus Transport: commuting by students, teachers, and administrative staff via various transport modes.",
        "scope3-tag": "Home-to-Campus Transport",

        // Detailed Scopes & Labels
        "scope-summary-boiler": "Gas Boilers",
        "scope-summary-vehicles": "Vehicles",
        "scope-summary-fugitive": "Fugitives",
        "scope-summary-steg": "STEG Electricity",
        "scope-summary-heating": "District Heating",
        "scope-summary-ev": "Electric Vehicles",
        "scope-summary-mobility": "Student Mobility",
        "scope-summary-waste": "Waste",
        "scope-summary-water": "Water",

        "scope-sources-title": "Sources Detail",
        "scope-sources-desc": "Breakdown by source type",
        "scope-gas-title": "Gas & Fuel Consumption",
        "scope-gas-desc": "Monthly central heating evolution",
        "scope-fleet-title": "Vehicle Fleet",
        "scope-fleet-desc": "Fuel consumption by type (L)",
        "scope-gen-title": "Power Generator",
        "scope-gen-desc": "Operating hours and fuel",
        "scope-elec-title": "Electricity Consumption",
        "scope-elec-desc": "Monthly breakdown (MWh)",
        "scope-bldg-title": "Consumption by Building",
        "scope-bldg-desc": "Electrical breakdown (MWh / year)",
        "scope-peak-title": "Power Peaks",
        "scope-peak-desc": "Maximum power demand (kVA)",
        "scope-usage-title": "Energy Usage",
        "scope-usage-desc": "Lighting vs Equipment vs HVAC",
        "scope-perf-title": "Energy Performance",
        "scope-perf-desc": "Efficiency ratios by service",
        "scope-pv-title": "Proposed PV Solution",
        "scope-pv-desc": "System sizing for self-consumption",
        "scope-transp-title": "Transport Modes",
        "scope-transp-desc": "Campus Mobility (Scope 3)",
        "scope-waste-title": "Waste Management",
        "scope-waste-desc": "Breakdown by processing stream (t)",
        "scope-mobility-profile": "Mobility by Profile",
        "scope-mobility-desc": "Staff vs Students (tCO2e)",
        "scope-water-title": "Water Consumption",
        "scope-water-desc": "Monthly consumption evolution (m³)",
        "scope-purchases-title": "Purchases & Services",
        "scope-purchases-desc": "Carbon impact of teaching supplies",

        "campus-users": "Campus users",
        "active-students": "Active students",
        "staff-teachers": "Staff & Teachers",
        "bloc-a": "Block A (Admin & Cafeteria)",
        "bloc-b": "Block B (Labs & Teaching)",

        "calc-gas-label": "Natural Gas (m³)",
        "calc-fuel-label": "Fleet Fuel (L)",
        "calc-refrig-label": "Refrigerant Fluids (kg)",
        "calc-elec-label": "STEG Electricity (kWh)",
        "calc-waste-label": "Waste (kg)",
        "calc-water-label": "Drinking Water (m³)",
        "calc-travel-label": "Travel / Missions (km)",

        // Calculator
        "calc-title": "Entry & Impact Calculation",
        "calc-desc": "Import your invoices (PDF/Excel) or manually enter your consumption data to calculate your carbon footprint.",
        "calc-result-title": "Calculation Result",
        "btn-recalculate": "Recalculate",
        "btn-reset": "Reset",

        // Login / Register
        "login-title": "Login",
        "register-title": "Register",
        "email-label": "Email Address",
        "password-label": "Password",
        "btn-login": "Sign In",
        "btn-register": "Sign Up"
    }
};

class I18n {
    constructor() {
        this.lang = localStorage.getItem('app-lang') || 'fr';
        this.applyLanguage();
    }

    setLanguage(lang) {
        this.lang = lang;
        localStorage.setItem('app-lang', lang);
        this.applyLanguage();
        // Dispatch event for other scripts (like charts) to react
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    applyLanguage() {
        document.documentElement.lang = this.lang;
        const elements = document.querySelectorAll('[data-i18n]');
        elements.forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = translations[this.lang][key];
            if (translation) {
                if (el.tagName === 'INPUT' && el.getAttribute('placeholder')) {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });

        // Update switcher buttons
        const switchers = document.querySelectorAll('.lang-switcher span');
        switchers.forEach(s => {
            s.textContent = this.lang.toUpperCase();
        });
    }

    getTranslation(key) {
        return translations[this.lang][key] || key;
    }
}

const i18n = new I18n();

function toggleLanguage() {
    const newLang = i18n.lang === 'fr' ? 'en' : 'fr';
    i18n.setLanguage(newLang);
}
