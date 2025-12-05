document.addEventListener('DOMContentLoaded', () => {
    // --- Selectores (están bien) ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
    const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
    const htmlElement = document.documentElement;

    // --- applyTheme function (está bien, PERO quita la llamada a Lucide si no lo usas) ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            htmlElement.classList.add('dark');
            themeToggleLightIcon?.classList.remove('hidden'); // Show sun
            themeToggleDarkIcon?.classList.add('hidden');    // Hide moon
            localStorage.setItem('theme', 'dark');
        } else {
            htmlElement.classList.remove('dark');
            themeToggleDarkIcon?.classList.remove('hidden');  // Show moon
            themeToggleLightIcon?.classList.add('hidden');   // Hide sun
            localStorage.setItem('theme', 'light');
        }
        // QUITA ESTO SI NO USAS LUCIDE:
        // if (window.lucide) {
        //     window.lucide.createIcons();
        // }
    };

    // --- LÓGICA DE INICIO CORREGIDA ---
    // 1. Determina el tema inicial PRIMERO
    let initialTheme = 'light'; // Default
    const storedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (storedTheme) {
        initialTheme = storedTheme;
    } else if (prefersDark) {
        initialTheme = 'dark';
    }

    // 2. Aplica el tema determinado UNA SOLA VEZ al cargar
    applyTheme(initialTheme);
    // --- FIN LÓGICA DE INICIO CORREGIDA ---


    // --- Click Listener (está bien) ---
    themeToggleBtn?.addEventListener('click', () => {
        console.log("CLICK"); // <-- Tu log está bien para depurar
        const isDarkMode = htmlElement.classList.contains('dark');
        applyTheme(isDarkMode ? 'light' : 'dark');
    });

    // --- (Optional) Listener de sistema (está bien) ---
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        // ...
    });


    // --- Language Switcher Code (Debe estar aquí si lo necesitas) ---
    const langSwitchers = document.querySelectorAll('.lang-switcher');
    langSwitchers.forEach(switcher => {
        switcher.addEventListener('click', (event) => {
            // ... tu lógica de cambio de idioma ...
        });
    });
    // --- FIN Language Switcher ---

}); // End DOMContentLoaded


// function domDate() {
//     const date = new Date();
//     const day = date.getDate();
//     const month = date.getMonth() + 1;
//     const year = date.getFullYear();
//     const hours = date.getHours();
//     const minutes = date.getMinutes();
//     const seconds = date.getSeconds();

//     document.getElementById('date-here').innerHTML = `${day}/${month}/${year}`;
// }
// domDate();


// Main Chart (Line Chart)
// const mainCtx = document.getElementById('mainChart').getContext('2d');
// const mainChart = new Chart(mainCtx, {
//     type: 'line',
//     data: {
//         labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
//         datasets: [{
//             label: 'Revenue',
//             data: [12500, 18000, 22000, 25000, 28500, 31000, 36000, 42000, 48500, 40200, 38500, 48245],
//             backgroundColor: 'rgba(79, 70, 229, 0.1)',
//             borderColor: '#4f46e5',
//             borderWidth: 2,
//             tension: 0.3,
//             fill: true,
//             pointBackgroundColor: '#4f46e5',
//             pointRadius: 4,
//             pointHoverRadius: 6,
//         }]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 backgroundColor: '#4f46e5',
//                 padding: 12,
//                 displayColors: false,
//                 callbacks: {
//                     label: function (context) {
//                         return '$' + context.parsed.y.toLocaleString();
//                     }
//                 }
//             }
//         },
//         scales: {
//             y: {
//                 beginAtZero: true,
//                 grid: {
//                     drawBorder: false,
//                 },
//                 ticks: {
//                     callback: function (value) {
//                         return '$' + value.toLocaleString();
//                     }
//                 }
//             },
//             x: {
//                 grid: {
//                     display: false
//                 }
//             }
//         }
//     }
// });

// // Pie Chart (Doughnut)
// const pieCtx = document.getElementById('pieChart').getContext('2d');
// const pieChart = new Chart(pieCtx, {
//     type: 'doughnut',
//     data: {
//         labels: ['Direct', 'Organic Search', 'Social', 'Email', 'Referral'],
//         datasets: [{
//             data: [35, 30, 15, 12, 8],
//             backgroundColor: [
//                 '#4f46e5',
//                 '#10b981',
//                 '#3b82f6',
//                 '#f59e0b',
//                 '#ef4444'
//             ],
//             borderWidth: 0,
//             borderRadius: 4,
//         }]
//     },
//     options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         cutout: '70%',
//         plugins: {
//             legend: {
//                 position: 'right',
//                 labels: {
//                     usePointStyle: true,
//                     pointStyle: 'circle',
//                     padding: 16
//                 }
//             },
//             tooltip: {
//                 callbacks: {
//                     label: function (context) {
//                         return context.label + ': ' + context.raw + '%';
//                     }
//                 }
//             }
//         }
//     }
// });

// // Animation for dashboard cards
// const dashboardCards = document.querySelectorAll('.dashboard-card');
// dashboardCards.forEach((card, index) => {
//     card.style.animationDelay = `${index * 0.1}s`;
// });

// document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-US', {
//     year: 'numeric', month: 'long', day: 'numeric'
// });

// // Sidebar toggle for mobile
// document.getElementById('open-sidebar').addEventListener('click', function () {
//     document.getElementById('sidebar').classList.remove('-translate-x-full');
// });

// document.getElementById('close-sidebar').addEventListener('click', function () {
//     document.getElementById('sidebar').classList.add('-translate-x-full');
// });
