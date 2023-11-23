/* eslint-disable no-dupe-keys */
// Material Dashboard 2 React base styles
import colors from "assets/theme/base/colors";

const { gradients, dark } = colors;

const configs = (labels, datasets) => {
  const backgroundColors = [];

  if (datasets.backgroundColors) {
    datasets.backgroundColors.forEach((color) =>
      gradients[color]
        ? backgroundColors.push(gradients[color].state)
        : backgroundColors.push(dark.main)
    );
  } else {
    backgroundColors.push(dark.main);
  }

  return {
    data: {
      labels,
      datasets: [
        {
          label: datasets.label,
          weight: 9,
          cutout: 0,
          tension: 0.9,
          pointRadius: 2,
          borderWidth: 2,
          backgroundColor: backgroundColors,
          fill: false,
          data: datasets.data,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
            const datapoints = ctx.chart.data.datasets[0].data
            const total = datapoints.reduce((total, datapoint) => total + datapoint, 0)
            const percentage = value / total * 100
            return percentage.toFixed(0) + "%";
          },
          color: '#ffffff'
        },
      },
      interaction: {
        intersect: false,
        mode: "index",
      },
    },
  };
}

export default configs;
