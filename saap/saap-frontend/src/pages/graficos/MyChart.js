import React from 'react';
import ReactApexChart from 'react-apexcharts';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { PrinterOutlined } from '@ant-design/icons';

const MyChart = ({ options, series, type }) => {
  const chartRef = React.useRef(null);

  const handleExportPDF = () => {
    if (chartRef.current) {
      const chartContainer = chartRef.current;
      html2canvas(chartContainer, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
        pdf.save('chart.pdf');
      });
    }
  };

  return (
    <div className="dark-background">
      <div className="button-container">
        <button onClick={handleExportPDF}><PrinterOutlined style={{color: 'green'}}/>Exportar PDF</button>
      </div>
      <div className="chart-container" ref={chartRef}>
        <ReactApexChart options={options} series={series} type={type} />
      </div>
    </div>
  );
};

export default MyChart;
