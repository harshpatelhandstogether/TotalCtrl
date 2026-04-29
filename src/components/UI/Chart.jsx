// import ReactApexChart from "react-apexcharts";

// export default function Chart({ data = [] }) {
//   // data shape: [{ date: "2026-04-23", value: 51024.1 }, ...]

//   const series = [
//     {
//       name: "Wasted Food",
//       data: data.map((d) => ({
//         x: new Date(d.xAxis).getTime(), // timestamp for datetime x-axis
//         y: d.yAxis,
//       })),
//     },
//   ];

//   const options = {
//     chart: {
//       type: "bar",
//       toolbar: { show: false },       // hides the top-right toolbar
//       zoom: { enabled: false },
//     },

//     plotOptions: {
//       bar: {
//         borderRadius: 4,              // rounded top corners
//         borderRadiusApplication: "end",
//         columnWidth: "60%",           // bar width
//       },
//     },

//     colors: ["#23a956"],              // green bars

//     dataLabels: { enabled: false },

//     grid: {
//       borderColor: "#e5e7eb",
//       xaxis: { lines: { show: false } }, // no vertical grid lines
//       yaxis: { lines: { show: true } },
//     },

//     xaxis: {
//       type: "datetime",
//       labels: {
//         style: { colors: "#9ca3af", fontSize: "12px" },
//         datetimeFormatter: {
//           day: "ddd MMM dd",           // "Thu Apr 23"
//         },
//       },
//       axisBorder: { show: false },
//       axisTicks: { show: false },
//     },

//     yaxis: {
//       labels: {
//         style: { colors: "#9ca3af", fontSize: "12px" },
//         formatter: (val) => `${val.toLocaleString("no-NO")} kr`,
//       },
//     },

//     tooltip: {
//       custom: ({ series, seriesIndex, dataPointIndex, w }) => {
//         const value = series[seriesIndex][dataPointIndex];
//         const timestamp = w.globals.seriesX[seriesIndex][dataPointIndex];
//         const date = new Date(timestamp).toLocaleDateString("en-US", {
//           weekday: "short",
//           month: "short",
//           day: "numeric",
//         });

//         return `
//           <div style="
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-radius: 8px;
//             padding: 10px 14px;
//             box-shadow: 0 4px 12px rgba(0,0,0,0.1);
//             font-family: inherit;
//           ">
//             <p style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">
//               ${date}
//             </p>
//             <div style="display: flex; align-items: center; gap: 6px;">
//               <span style="
//                 width: 10px; height: 10px;
//                 border-radius: 50%;
//                 background: #23a956;
//                 display: inline-block;
//               "></span>
//               <span style="font-size: 13px; color: #111827; font-weight: 500;">
//                 ${value.toLocaleString("no-NO")} kr
//               </span>
//             </div>
//           </div>
//         `;
//       },
//     },

//     states: {
//       hover: {
//         filter: { type: "none" },     // no color change on hover
//       },
//     },
//   };

//   return (
//     <div className="w-full mt-6">
//       <ReactApexChart
//         options={options}
//         series={series}
//         type="bar"
//         height={300}
//       />
//     </div>
//   );
// }

import ReactApexChart from "react-apexcharts";

export default function Chart({ apiResponse = {} }) {
  const foodWaste = apiResponse?.foodWaste || {};
  const currency = apiResponse?.currencySymbol || "kr";

  // xAxis: [["Thu", "Apr 23"], ...] → ["Thu\nApr 23", ...]
  const xCategories = (foodWaste.xAxis || []).map(([day, date]) => `${day} ${date}`);

  // yAxis: [51024.1, ...]
  const yValues = foodWaste.yAxis || [];

  const series = [
    {
      name: "Wasted Food",
      data: yValues,  // just the numbers array
    },
  ];

  const options = {
    chart: {
      type: "bar",
      toolbar: { show: false },
      zoom: { enabled: false },
    },

    plotOptions: {
      bar: {
        borderRadius: 4,
        borderRadiusApplication: "end",
        columnWidth: "60%",
      },
    },

    colors: ["#23a956"],
    dataLabels: { enabled: false },

    grid: {
      borderColor: "#e5e7eb",
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },

    // ✅ category instead of datetime (since xAxis is string labels)
    xaxis: {
      type: "category",
      categories: xCategories,   // ["Thu Apr 23", "Fri Apr 24", ...]
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        style: { colors: "#9ca3af", fontSize: "12px" },
        formatter: (val) =>
          `${val.toLocaleString("no-NO", { minimumFractionDigits: 0 })} ${currency}`,
      },
    },

    tooltip: {
      custom: ({ series, seriesIndex, dataPointIndex, w }) => {
        const value = series[seriesIndex][dataPointIndex];
        // ✅ Get label directly from xAxis categories
        const label = w.globals.labels[dataPointIndex];

        return `
          <div style="
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 10px 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-family: inherit;
          ">
            <p style="font-size: 13px; font-weight: 600; color: #374151; margin-bottom: 6px;">
              ${label}
            </p>
            <div style="display: flex; align-items: center; gap: 6px;">
              <span style="
                width: 10px; height: 10px;
                border-radius: 50%;
                background: #23a956;
                display: inline-block;
              "></span>
              <span style="font-size: 13px; color: #111827; font-weight: 500;">
                ${value.toLocaleString("no-NO")} ${currency}
              </span>
            </div>
          </div>
        `;
      },
    },

    states: {
      hover: { filter: { type: "none" } },
    },
  };

  return (
    <div className="w-full mt-6">
      <ReactApexChart
        options={options}
        series={series}
        type="bar"
        height={300}
      />
    </div>
  );
}