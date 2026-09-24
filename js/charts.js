/**
 * Interactive Analytics Charts Engine for TSG Business Suite
 */

let categoryChartInstance = null;
let weeklyChartInstance = null;

function initCharts(state) {
    initCategoryChart(state);
    initWeeklyChart(state);
}

function updateCharts(state) {
    if (categoryChartInstance) {
        const catData = getCategoryRevenueData(state);
        categoryChartInstance.data.labels = catData.labels;
        categoryChartInstance.data.datasets[0].data = catData.values;
        categoryChartInstance.update();
    }

    if (weeklyChartInstance) {
        const weeklyData = getWeeklyTotalsData(state);
        weeklyChartInstance.data.datasets[0].data = weeklyData;
        weeklyChartInstance.update();
    }
}

function getCategoryRevenueData(state) {
    const categoryTotals = {};
    
    state.tsgDaily.forEach(item => {
        const cat = item.category || 'General';
        const subtotal = calculateItemSubtotal(item);
        categoryTotals[cat] = (categoryTotals[cat] || 0) + subtotal;
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    return { labels, values };
}

function getWeeklyTotalsData(state) {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map(w => {
        const days = state.dailyReports[w] || [];
        return days.reduce((acc, d) => acc + (d.pos || 0) + (d.cashout || 0) + (d.eftpos || 0) + (d.vape || 0), 0);
    });
}

function initCategoryChart(state) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;

    const catData = getCategoryRevenueData(state);

    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: catData.labels,
            datasets: [{
                data: catData.values,
                backgroundColor: [
                    '#10b981', // Emerald
                    '#06b6d4', // Cyan
                    '#8b5cf6', // Violet
                    '#f59e0b', // Amber
                    '#ef4444'  // Red
                ],
                borderWidth: 2,
                borderColor: '#0b0f19'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#9ca3af',
                        font: { family: 'Inter', size: 12 }
                    }
                }
            }
        }
    });
}

function initWeeklyChart(state) {
    const ctx = document.getElementById('weeklyChart');
    if (!ctx) return;

    const weeklyData = getWeeklyTotalsData(state);

    weeklyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Total Revenue ($)',
                data: weeklyData,
                backgroundColor: 'rgba(16, 185, 129, 0.6)',
                borderColor: '#10b981',
                borderWidth: 2,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: { color: '#9ca3af' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

window.initCharts = initCharts;
window.updateCharts = updateCharts;
