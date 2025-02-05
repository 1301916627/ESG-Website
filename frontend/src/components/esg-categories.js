import React, { useState, useEffect } from 'react';
import './ESGDetails.css';

const ESGDetails = () => {
  // 为每个类别创建独立的状态
  const [environmentalMetrics, setEnvironmentalMetrics] = useState([]);
  const [socialMetrics, setSocialMetrics] = useState([]);
  const [governanceMetrics, setGovernanceMetrics] = useState([]);
  const [activeTab, setActiveTab] = useState('environmental');
  const [loading, setLoading] = useState(true);

  // 获取特定类别的 metric names
  const fetchMetricsByPillar = async (pillar, setterFunction) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/query_data?perm_id=4295888473&pillar=${pillar}&limit=1000`
      );
      const result = await response.json();
      
      // 提取并去重 metric names
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

  // 在组件加载时获取所有类别的数据
  useEffect(() => {
    const fetchAllMetrics = async () => {
      setLoading(true);
      try {
        // 并行获取三类数据
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

  // 根据当前选中的标签返回对应的指标列表
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

  // 获取当前类别的指标数量
  const getCurrentMetricsCount = () => {
    return getCurrentMetrics().length;
  };

  return (
    <div>
      <header className="header">
        {/* 标题区域 */}
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
      
      {/* 主内容区域 */}
      <div className="main-content">
        <h1 className="page-title">ESG Data</h1>

        <div className="card">
          {/* 公司信息区域 */}
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

      {/* 标签切换按钮 */}
      <div className="tabs">
        {['environmental', 'social', 'governance'].map((tab) => (
          <button
            key={tab}
            className={`tab-button ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
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

        {/* 侧边栏指标列表 */}
        <div className="sidebar">
          <h3 className="content-title">
            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Metrics
            <span className="metric-count">({getCurrentMetricsCount()} metrics)</span>
          </h3>

          {loading ? (
            <div className="loading">Loading metrics...</div>
          ) : (
            <ul className="content-list">
              {getCurrentMetrics().map((metric, index) => (
                <li key={index} className="metric-item">
                  {metric}
                </li>
              ))}
            </ul>
          )}
        </div>

        

      </div>
    </div>
  </div>
  );
};

export default ESGDetails;
