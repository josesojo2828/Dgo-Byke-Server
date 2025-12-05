/**
 * 🎨 Configuración de estilos base para los gráficos
 */
const BASE_COLORS = [
    'rgba(255, 99, 132, 0.7)',  // Rojo
    'rgba(54, 162, 235, 0.7)',  // Azul
    'rgba(255, 206, 86, 0.7)',  // Amarillo
    'rgba(75, 192, 192, 0.7)',  // Verde
    'rgba(153, 102, 255, 0.7)', // Púrpura
    'rgba(255, 159, 64, 0.7)'   // Naranja
];
const BORDER_COLORS = BASE_COLORS.map(c => c.replace('0.7', '1')); // Color sólido para el borde

/**
 * 📊 Renderiza un Gráfico de Pastel (Pie Chart) o Dona (Doughnut Chart)
 * para la distribución de Usuarios por Permiso.
 * * @param {Array<object>} data Array de objetos { permitName: string, count: number }
 * @param {string} canvasId ID del elemento <canvas> (default: 'usersByPermitChart')
 */
function renderPieChart(render, canvasId) {
    const ctx = document.getElementById(render.id);
    if (!ctx || !render || render.data.length === 0) return;

    const labels = render.data.map(item => item['label']);
    const counts = render.data.map(item => item['value']);

    // Crear el gráfico
    new Chart(ctx, {
        type: render.type || 'doughnut', // O 'pie' si prefieres
        data: {
            labels: labels,
            datasets: [{
                label: render.title,
                data: counts,
                backgroundColor: BASE_COLORS.slice(0, counts.length),
                borderColor: BORDER_COLORS.slice(0, counts.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                title: {
                    display: true,
                    text: render.title
                }
            }
        }
    });
}

/**
 * 📈 Renderiza un Gráfico de Barras (Bar Chart).
 * (Útil para mostrar el conteo o el saldo por tipo).
 * * @param {Array<string>} labels Etiquetas para el eje X.
 * @param {Array<number>} values Valores para las barras.
 * @param {string} title Título del gráfico.
 * @param {string} canvasId ID del elemento <canvas>.
 */
function renderBarChart(labels, values, title, canvasId) {
    const ctx = document.getElementById(canvasId);
    if (!ctx || !values || values.length === 0) return;

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: title,
                data: values,
                backgroundColor: BASE_COLORS[1], // Azul fijo
                borderColor: BORDER_COLORS[1],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: title
                }
            }
        }
    });
}
