import React, { useState, useEffect } from 'react';
import './ESGDetails.css';
import styles from './ESGDetails.css';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { useNavigate,useParams } from 'react-router-dom';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ESGDetails = () => {
  const { perm_id } = useParams();
  const [environmentalMetrics, setEnvironmentalMetrics] = useState([]);
  const [socialMetrics, setSocialMetrics] = useState([]);
  const [governanceMetrics, setGovernanceMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState('environmental');
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2019');
  const [metricData, setMetricData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [companyInfo, setCompanyInfo] = useState({
    company_name: '',
    headquarter_country: '',
    industry: ''
  });

  
  const years = ['2019', '2020', '2021', '2022', '2023'];

  const navigate = useNavigate();

  const handleESGScoreClick = () => {
    navigate(`/esgscore/${perm_id}`);
  };

  const handleESGGraphClick = () => {
    navigate(`/esggraph/${perm_id}`);
  }

  const handleFrameworkClick = () => {
    navigate('/frameworks');
  }

  const handleSearchClick = () => {
    navigate('/search');
  }

  const handleCompareClick = () => {
    navigate('/compare');
  }




// 获取公司基本信息
useEffect(() => {
  const fetchCompanyInfo = async () => {
    try {
      // 获取公司第一条数据来提取基本信息
      const response = await fetch(`http://127.0.0.1:5000/api/query_data?perm_id=${perm_id}&limit=1`);
      const result = await response.json();
      
      if (result.data && result.data.length > 0) {
        const companyData = result.data[0];
        setCompanyInfo({
          company_name: companyData.company_name || '',
          headquarter_country: companyData.headquarter_country || '',
          industry: companyData.industry || ''
        });
      }
    } catch (error) {
      console.error('Error fetching company info:', error);
    }
  };
  if (perm_id) {
  fetchCompanyInfo();
  }
}, [perm_id]);

  // 获取指标名称列表
  const fetchMetricsByPillar = async (pillar, setterFunction) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/query_data?perm_id=${perm_id}&pillar=${pillar}&limit=1000`
      );
      const result = await response.json();
      
      const uniqueMetrics = [...new Set(result.data.map(item => item.metric_name))].filter(
        metric => metric && 
        metric !== '_id' && 
        metric !== 'company_id' && 
        !metric.toLowerCase().includes('timestamp')
      );
      
      setterFunction(uniqueMetrics);
      
      // 如果是当前激活的标签页，同时更新详细数据
      if ((pillar === 'E' && activeTab === 'environmental') ||
          (pillar === 'S' && activeTab === 'social') ||
          (pillar === 'G' && activeTab === 'governance')) {
        setMetricData(result.data);
      }
    } catch (error) {
      console.error(`Error fetching ${pillar} metrics:`, error);
    }
  };


  // 初始加载所有指标
  useEffect(() => {
    const fetchAllMetrics = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchMetricsByPillar('E', setEnvironmentalMetrics),
          fetchMetricsByPillar('S', setSocialMetrics),
          fetchMetricsByPillar('G', setGovernanceMetrics)

        ]);
      } catch (error) {
        console.error('Error fetching metrics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllMetrics();
  }, []);

  // 获取指标详细数据
  const fetchMetricData = async () => {
    setLoading(true);
    try {
      const pillar = activeTab === 'environmental' ? 'E' : 
                     activeTab === 'social' ? 'S' : 'G';
      
      const params = new URLSearchParams({
        perm_id: '4295888473',
        pillar: pillar,
        metric_year: selectedYear,
        page: currentPage.toString(),
        limit: '10'
      });

      const year = `${selectedYear}`;


      const response = await fetch( `http://127.0.0.1:5000/api/query_data?perm_id=${perm_id}&pillar=${pillar}&year=${year}&limit=1000`);
      const result = await response.json();
      
      if (result.data) {
        setMetricData(result.data);
        setTotalPages(Math.ceil(result.pagination.total_items / 10));
      }
    } catch (error) {
      console.error('Error fetching metric data:', error);
    } finally {
      setLoading(false);
    }
  };

  // 当标签页、年份或页码改变时获取新数据
  useEffect(() => {
    fetchMetricData();
  }, [activeTab, selectedYear, currentPage]);

  const getCurrentMetrics = () => {
    switch (activeTab) {
      case 'environmental':
        return environmentalMetrics;
      case 'social':
        return socialMetrics;
      case 'governance':
        return governanceMetrics;
      default:
        return [];
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const fetchAllYearsData = async (pillar) => {
    try {
      // 直接使用传入的 pillar 参数，而不是从 activeTab 获取
      const allDataPromises = years.map(year => 
        fetch(`http://127.0.0.1:5000/api/query_data?perm_id=${perm_id}&pillar=${pillar}&year=${year}&limit=1000`)
          .then(res => res.json())
      );
  
      const allData = await Promise.all(allDataPromises);
      return allData.map((yearData, index) => ({
        year: years[index],
        data: yearData.data || []
      }));
    } catch (error) {
      console.error(`Error fetching ${pillar} data:`, error);
      return [];
    }
  };

  // 生成PDF的函数
  const generatePDF = async () => {
    try {
      setLoading(true);
      // 分别获取 E、S、G 三个维度的数据
      const [envData, socData, govData] = await Promise.all([
        fetchAllYearsData('E'),  // Environmental data
        fetchAllYearsData('S'),  // Social data
        fetchAllYearsData('G')   // Governance data
      ]);

      // 创建文档定义
      const docDefinition = {
        content: [
          // 封面
          {
            text: 'ESG Report',
            style: 'header',
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },
          {
            text: new Date().toLocaleDateString(),
            alignment: 'center',
            margin: [0, 0, 0, 20]
          },

          // 公司信息部分
          {
            text: 'Company Information',
            style: 'subheader',
            margin: [0, 20, 0, 10]
          },
          {
            table: {
              widths: ['*', '*'],
              body: [
                ['Company Name:', companyInfo.company_name],
                ['Headquarter Country:', companyInfo.headquarter_country],
                ['Industry:', companyInfo.industry]
              ]
            },
            margin: [0, 0, 0, 20]
          },

          // ESG 数据部分
          {
            text: 'Environmental Metrics',
            style: 'subheader',
            margin: [0, 20, 0, 10],
            pageBreak: 'before'
          },
          ...generateMetricsTable(envData),

          {
            text: 'Social Metrics',
            style: 'subheader',
            margin: [0, 20, 0, 10],
            pageBreak: 'before'
          },
          ...generateMetricsTable(socData),

          {
            text: 'Governance Metrics',
            style: 'subheader',
            margin: [0, 20, 0, 10],
            pageBreak: 'before'
          },
          ...generateMetricsTable(govData),
        ],
        styles: {
          header: {
            fontSize: 24,
            bold: true
          },
          subheader: {
            fontSize: 18,
            bold: true,
            margin: [0, 10, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 12,
            color: 'black'
          }
        },
        defaultStyle: {
          fontSize: 10
        }
      };

      // 生成PDF
      pdfMake.createPdf(docDefinition).download(`ESG_Report_${companyInfo.company_name}_${new Date().toISOString().split('T')[0]}.pdf`);

    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF report');
    }finally {
      setLoading(false);
    }
  };

  // 生成指标数据表格的辅助函数
  const generateMetricsTable = (yearsData) => {
    const tables = [];
    
    yearsData.forEach(({ year, data }) => {
      if (data && data.length > 0) {
        tables.push({
          text: `Year ${year}`,
          style: 'subheader',
          margin: [0, 10, 0, 5]
        });

        tables.push({
          table: {
            headerRows: 1,
            widths: ['auto', '*', 'auto', 'auto', 'auto'],
            body: [
              // 表头
              [
                { text: 'Metric Name', style: 'tableHeader' },
                { text: 'Description', style: 'tableHeader' },
                { text: 'Value', style: 'tableHeader' },
                { text: 'Unit', style: 'tableHeader' },
                { text: 'Provider', style: 'tableHeader' }
              ],
              // 数据行
              ...data.map(metric => [
                metric.metric_name,
                metric.metric_description,
                metric.metric_value,
                metric.metric_unit,
                metric.provider_name
              ])
            ]
          },
          margin: [0, 0, 0, 20]
        });
      }
    });

    return tables;
  };

  // 修改原有的下载按钮点击事件
  const handleDownload = async () => {
    try {
      setLoading(true);
      await generatePDF();
    } catch (error) {
      console.error('Error during download:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="logo">ecoM</span>
            <nav>
              <ul className="nav-menu">
                <li><a href="#" onClick={handleSearchClick} className={styles.navLink}>SEARCH</a></li>
                <li><a href="#" onClick={handleCompareClick} className={styles.navLink}>COMPARE</a></li>
                <li><a href="#" onClick={handleFrameworkClick} className={styles.navLink}>FRAMEWORK</a></li>
              </ul>
            </nav>
          </div>
          <button className="logout-button">Logout</button>
        </div>
      </header>
      
      <div className="main-content">
        <h1 className="page-title">ESG Data</h1>

        <div className="card">
          <div className="card-header">
            <h2 className="company-name">{companyInfo.company_name }</h2>
            <div>
              <button 
                className="action-button download-button"
                onClick={handleDownload}
                disabled={loading}
              >
                {loading ? 'Generating Report...' : 'Download Report'}
              </button>
              <button className="action-button view-scores-button" onClick={handleESGScoreClick} style={{ marginRight: '0.5rem' }}>View ESG Score</button>
              <button className="action-button view-scores-button" onClick={handleESGGraphClick} style={{ backgroundColor: '#3b82f6' }}>View ESG Graph</button>
            </div>
          </div>
          
          <div className="company-info">
            <span>Headquarter Country: {companyInfo.headquarter_country }</span> | 
            <span>Industry: {companyInfo.industry }</span>
          </div>

          <div className="content-wrapper">
            <div className="sidebar">
              <div className="tabs">
                {['environmental', 'social', 'governance'].map((tab) => (
                  <button
                    key={tab}
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => {
                      setActiveTab(tab);
                      setCurrentPage(1);
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    <span className="metric-count">
                      ({tab === 'environmental' 
                        ? environmentalMetrics.length 
                        : tab === 'social' 
                          ? socialMetrics.length 
                          : governanceMetrics.length})
                    </span>
                  </button>
                ))}
              </div>

              <h3 className="content-title">
                {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Metrics
                <span className="metric-count">({getCurrentMetrics().length} metrics)</span>
              </h3>

              {loading ? (
                <div className="loading">Loading metrics...</div>
              ) : (
                <ul className="content-list">
                  {getCurrentMetrics().map((metric, index) => (
                    <li 
                      key={index}
                      className="metric-item"
                    >
                      {metric}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="content-panel">
              <div className="panel-header">
                {/*<h3>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({metricData.length} results)</h3>*/}
                {<h3>Year</h3>}
                <div className="year-filters">
                  {years.map(year => (
                    <button
                      key={year}
                      className={`year-button ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => {
                        setSelectedYear(year);
                        setCurrentPage(1);
                      }}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-content">
                {loading ? (
                  <div className="loading">Loading data...</div>
                ) : (
                  <table className="metrics-table">
                    <thead>
                      <tr>
                        <th>Metric Name</th>
                        <th>Description</th>
                        <th>Value</th>
                        <th>Unit</th>
                        <th>Provider</th>
                        <th>Reported Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {metricData.map((metric, index) => (
                        <tr key={index}>
                          <td>{metric.metric_name}</td>
                          <td>{metric.metric_description}</td>
                          <td>{metric.metric_value}</td>
                          <td>{metric.metric_unit}</td>
                          <td>{metric.provider_name}</td>
                          <td>{new Date(metric.reported_date).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              <div className="pagination">
                <button 
                  className="pagination-button" 
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
                <button 
                  className="pagination-button"
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGDetails;
