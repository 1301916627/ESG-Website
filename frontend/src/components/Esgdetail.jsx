import React, { useState, useEffect } from 'react';
import './ESGDetails.css';

const ESGDetails = () => {
  const [environmentalMetrics, setEnvironmentalMetrics] = useState([]);
  const [socialMetrics, setSocialMetrics] = useState([]);
  const [governanceMetrics, setGovernanceMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState('environmental');
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState('2023');
  const [metricData, setMetricData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Years for the filter
  const years = ['2019', '2020', '2021', '2022', '2023'];

  // Fetch metric names for each pillar
  const fetchMetricsByPillar = async (pillar, setterFunction) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/query_data?perm_id=4295888473&pillar=${pillar}&limit=1000`
      );
      const result = await response.json();
      
      const uniqueMetrics = [...new Set(result.data.map(item => item.metric_name))].filter(
        metric => metric && 
        metric !== '_id' && 
        metric !== 'company_id' && 
        !metric.toLowerCase().includes('timestamp')
      );
      
      setterFunction(uniqueMetrics);
    } catch (error) {
      console.error(`Error fetching ${pillar} metrics:`, error);
    }
  };

  /*[组件挂载]
        ↓
  [setLoading(true)]
        ↓
  [并行发起三个请求]
     │
  ┌──┼──┐
  ↓  ↓  ↓
  E  S  G 指标请求
  │  │  │
  └──┼──┘
     ↓
  [更新各自的状态]
        ↓
  [setLoading(false)]*/ 
  useEffect(() => {
    // 定义异步函数用于获取所有指标数据
    const fetchAllMetrics = async () => {
      setLoading(true);
      try {
        // Promise.all 允许并行执行多个异步操作，并在所有操作完成后返回结果数组
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

    
  // 定义一个函数，根据当前选中的标签返回对应类别的指标列表
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

  const getCurrentMetricsCount = () => {
    return getCurrentMetrics().length;
  };

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span className="logo">ecoM</span>
            <nav>
              <ul className="nav-menu">
                <li>SEARCH</li>
                <li>COMPARISON TOOL</li>
                <li>FRAMEWORKS</li>
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
            <h2 className="company-name">Sasol Ltd</h2>
            <div>
              <button className="action-button download-button">Download Report</button>
              <button className="action-button view-scores-button">View ESG Scores</button>
            </div>
          </div>
          
          <div className="company-info">
            <span>Headquarter Country: South Africa</span> | <span>Industry: Metals & Mining</span>
          </div>

          <div className="content-wrapper">
            {/* Left sidebar */}
            <div className="sidebar">
              <div className="tabs">
                {/* 遍历数组生成三个标签按钮 */}
                {['environmental', 'social', 'governance'].map((tab) => (
                  <button
                    key={tab}    // 为每个按钮生成唯一的key
                    className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {/* 标签文本：首字母大写 */}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}

                    {/* 条件判断返回对应类别的指标数量 */}
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
                <span className="metric-count">({getCurrentMetricsCount()} metrics)</span>
              </h3>

              {/* 条件渲染：根据loading状态显示不同内容 */}
              {loading ? (
                // 1. 如果正在加载，显示加载提示
                <div className="loading">Loading metrics...</div>
              ) : (
                // 2. 如果加载完成，显示指标列表
                <ul className="content-list">
                {/* 渲染当前类别的指标列表 */}
                  {getCurrentMetrics().map((metric, index) => (
                    <li 
                      key={index}                 // React列表项的唯一标识
                      className="metric-item"     // 显示指标名称
                    >
                      {metric}
                    </li>
                  ))}
                </ul>
              )}

            </div>

            {/* Right content panel */}
            <div className="content-panel">
              <div className="panel-header">
                <h3>Environmental (0 results)</h3>
                <div className="year-filters">
                  {years.map(year => (
                    <button
                      key={year}
                      className={`year-button ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
              </div>

              <div className="panel-content">
                <table className="metrics-table">
                  <thead>
                    <tr>
                      <th>Metric Name</th>
                      <th>Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                    {getCurrentMetrics().slice(0, 10).map((metric, index) => (
                      <tr key={index}>
                        <td>{metric}</td>
                        <td>No data</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <button 
                  className="pagination-button" 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {Math.max(1, totalPages)}</span>
                <button 
                  className="pagination-button"
                  disabled={currentPage === totalPages}
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
