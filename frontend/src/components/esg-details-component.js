import React, { useState, useEffect } from 'react';
import './ESGDetails.css';
import { useParams } from "react-router-dom";

const ESGDetails = () => {
  // 定义组件的状态管理
  const [selectedYear, setSelectedYear] = useState('2023');        // 年份选择状态
  const [activeTab, setActiveTab] = useState('environmental');     // 标签页状态
  
  
  const [dataFields, setDataFields] = useState([]);                // 数据字段状态
  const [esgData, setEsgData] = useState([]);                      // ESG 数据状态, 存储和显示可用的 ESG 指标名称
  const [pagination, setPagination] = useState({                   // 管理数据分页显示
    current_page: 1,
    total_pages: 1,
    total_items: 0
  });
  const [loading, setLoading] = useState(true);                     // 管理数据加载状态
  const { companyId } = useParams();

  // Fetch available data fields  在组件挂载时获取和过滤数据字段
  /*[组件挂载]
        ↓
    [发起 API 请求]
        ↓
    [获取原始数据]
        ↓
    [数据过滤处理]
      │
      ├─ 排除 '_id'
      ├─ 排除 'company_id'
      └─ 排除含 'timestamp' 的字段
        ↓
    [更新 dataFields 状态]*/ 
  useEffect(() => {
    const fetchDataFields = async () => {
      try {
        const response = await fetch('http://127.0.0.1:5000/api/query_data?perm_id=4295888473');
        const fields = await response.json();
        // 过滤掉不需要显示的字段
        setDataFields(fields.filter(field => 
          field !== '_id' && 
          field !== 'company_id' && 
          !field.toLowerCase().includes('timestamp')
        ));
      } catch (error) {
        console.error('Error fetching data fields:', error);
      }
    };
    fetchDataFields();
  }, []);

// Fetch ESG data
// Fetch available data fields
// 用于获取环境(Environmental)指标数据的 useEffect Hook
useEffect(() => {
  const fetchDataFields = async () => {
    try {
      // 获取所有数据
      const response = await fetch('http://127.0.0.1:5000/api/query_data?perm_id=4295888473&pillar=E&limit=1000');
      const result = await response.json();
      
      // 从返回的数据中提取所有不重复的 metric_name
      const uniqueMetricNames = [...new Set(result.data.map(item => item.metric_name))];
      
      // 过滤掉不需要的字段
      setDataFields(uniqueMetricNames.filter(field => 
        field && // 确保字段存在
        field !== '_id' && 
        field !== 'company_id' && 
        !field.toLowerCase().includes('timestamp')
      ));
    } catch (error) {
      console.error('Error fetching data fields:', error);
    }
  };
  fetchDataFields();
}, []);

// Fetch ESG data
useEffect(() => {
  const fetchESGData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.current_page.toString(),
        limit: '1000',
        perm_id: '4295888473'  // 添加 perm_id
      });
      
      // 参数条件
      if (activeTab === 'environmental') {
        params.append('pillar', 'E');
      } else if (activeTab === 'social') {
        params.append('pillar', 'S');
      } else if (activeTab === 'governance') {
        params.append('pillar', 'G');
      }
      
      // 如果需要根据年份筛选，可以添加年份条件
      if (selectedYear) {
        params.append('metric_year', selectedYear);
      }
      
      const response = await fetch(`http://localhost:5000/api/query_data?${params}`);
      const result = await response.json();
      
      if (result.data) {
        setEsgData(result.data);                // 更新 ESG 数据状态
        setPagination(result.pagination);       // 更新分页状态
      }
    } catch (error) {
      console.error('Error fetching ESG data:', error);
    } finally {
      setLoading(false);
    }
  };
  fetchESGData();
}, [selectedYear, activeTab, pagination.current_page]);   // 触发时机：当以下任一状态变化时重新获取数据

  const years = ['2019', '2020', '2021', '2022', '2023'];

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

      <main className="main-content">
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

          {/* ESG标签切换 */}
          <div>
            {['environmental', 'social', 'governance'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          
          {/* 内容区域(标签页) */}
          {(activeTab === 'environmental' || activeTab === 'social' || activeTab === 'governance') && (
            <div className="content-wrapper">
              <div className="sidebar">
                <h3 className="content-title">Metric Name</h3>
                <ul className="content-list">
                  {dataFields.map((field, index) => (
                    <li key={index}>{field}</li>
                  ))}
                </ul>
              </div>

              <div className="main-panel">
                <h3 className="content-title">
                  {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} ({esgData.length} results)
                </h3>

                <div>
                  {years.map((year) => (
                    <button
                      key={year}
                      className={`tab-button ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>

                {loading ? (
                  <div className="loading">Loading...</div>
                ) : (
                  esgData.map((item, index) => (
                    <div key={index} className="data-panel">
                      <div className="data-header">
                        <h4 className="data-title">{item.metric_name || 'Environmental Metric'}</h4>
                        <span className="data-provider">Provider: {item.provider || 'Clarity AI'}</span>
                      </div>
                      <p className="data-description">{item.description || 'No description available'}</p>
                      <div className="data-value">
                        <div>
                          <span className="value">{item.value || 'N/A'}</span>
                          <span className="unit">{item.unit || 'USD'}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span className="disclosure">{item.disclosure_type || 'E'}</span>
                          {!item.value && <span className="na-value">N/A</span>}
                        </div>
                      </div>
                      <button className="expand-button">Expand To See Graphical View</button>
                    </div>
                  ))
                )}

                {/* Pagination */}
                <div className="pagination">
                  <button 
                    disabled={pagination.current_page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page - 1 }))}
                  >
                    Previous
                  </button>
                  <span>Page {pagination.current_page} of {pagination.total_pages}</span>
                  <button 
                    disabled={pagination.current_page === pagination.total_pages}
                    onClick={() => setPagination(prev => ({ ...prev, current_page: prev.current_page + 1 }))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ESGDetails;
