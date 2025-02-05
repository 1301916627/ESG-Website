import React, { useState } from 'react';
import './ESGDetails.css';  // 假设上述CSS保存在这个文件中


const ESGScores = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFramework, setSelectedFramework] = useState(null);
  
  // 框架数据
  const frameworks = [
    'IFRS S1',
    'IFRS S2',
    'TNFD'
  ];

  // 过滤框架
  const filteredFrameworks = frameworks.filter(framework =>
    framework.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <div className="user-section">
            <span style={{ marginRight: '1rem' }}>Hi there, zhangshuoming</span>
            <button className="logout-button">LOG OUT</button>
          </div>
        </div>
      </header>

      <div className="main-content">
        <h1 className="page-title">ESG Scores</h1>

        <div className="card">
          <div className="card-header">
            <h2 className="company-name">Sasol Ltd</h2>
          </div>
          
          <div className="company-info">
          <h4>This page calculates ESG scores for a company by analysing and integrating data across various environmental, social, and governance metrics. Users can select relevant ESG frameworks, and generate a comprehensive breakdown that highlight the company's performance and risk in these areas.</h4>
          </div>

          <div className="content-wrapper">
            <div className="sidebar">
              <h3 className="content-title">Select A Framework To Continue</h3>
              
              {/* 搜索框 */}
              <div style={{ marginBottom: '1rem' }}>
                <input
                  type="text"
                  className="search-input"
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.375rem',
                  }}
                  placeholder="Framework Name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* 框架列表 */}
              <div 
                style={{
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.375rem',
                  overflow: 'hidden'
                }}
              >
                {filteredFrameworks.map((framework, index) => (
                  <div
                    key={framework}
                    className={`data-panel ${selectedFramework === framework ? 'active' : ''}`}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: index < filteredFrameworks.length - 1 ? '1px solid #e5e7eb' : 'none',
                      cursor: 'pointer',
                      backgroundColor: selectedFramework === framework ? '#f3f4f6' : 'white'
                    }}
                    onClick={() => setSelectedFramework(framework)}
                  >
                    {framework}
                  </div>
                ))}
              </div>
            </div>

            <div className="content-panel">
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button
                  className="action-button download-button"
                  onClick={() => {
                    if (selectedFramework) {
                      console.log('Applying framework:', selectedFramework);
                    }
                  }}
                  disabled={!selectedFramework}
                >
                  Apply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ESGScores;