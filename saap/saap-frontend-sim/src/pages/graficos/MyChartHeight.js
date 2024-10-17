import { PrinterOutlined } from '@ant-design/icons';
import React from 'react';
import ReactApexChart from 'react-apexcharts';

const MyChartHeight = ({ options, series, type, height }) => {

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
      <ReactApexChart options={options} series={series} type={type} height={height}/>
    </div>
  );
};

export default MyChartHeight;
