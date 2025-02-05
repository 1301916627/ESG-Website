import React, { useState } from 'react';
import './ESGDetails.css';
import { useParams, useSearchParams } from "react-router-dom";


const ESGDetails = () => {
  const [selectedYear, setSelectedYear] = useState('2017');    //控制选中的年份
  const [activeTab, setActiveTab] = useState('environmental'); //控制当前激活的标签页（ESG)
  const { companyId } = useParams();



  // 包含不同年份的ESG数据对象
  const yearlyData = {
    '2016': { value: 850.25, unit: 'USD (000)', disclosure: 'E' },
    '2017': { value: 875.50, unit: 'USD (000)', disclosure: 'E' },
    '2018': { value: 890.75, unit: 'USD (000)', disclosure: 'E' },
    '2019': { value: 905.30, unit: 'USD (000)', disclosure: 'E' },
    '2020': { value: 895.80, unit: 'USD (000)', disclosure: 'E' },
    '2021': { value: 912.13, unit: 'USD (000)', disclosure: 'E' },
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

      <main className="main-content">
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
            <span>Hearquarter Country：南非</span> | <span>Industry：金属与采矿</span>
          </div>
          <div>
            {['environmental', 'social', 'governance'].map((tab) => (
              <button
                key={tab}
                className={`tab-button ${activeTab === tab ? 'active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'environmental' ? 'environment' : tab === 'social' ? 'social' : 'government'}
              </button>
            ))}
          </div>
          {activeTab === 'environmental' && (
            <div className="content-wrapper">
              <div className="sidebar">
                <h3 className="content-title">Contents</h3>
                <ul className="content-list">
                  <li>空气污染物_直接</li>
                  <li>空气污染物_间接</li>
                  <li>分析估计CO2总量</li>
                  <li>分析废物回收比率</li>
                  <li>生物多样性影响减少</li>
                </ul>
              </div>
              <div className="main-panel">
                <h3 className="content-title">Environment (43 results)</h3>
                <div>
                  {Object.keys(yearlyData).map((year) => (
                    <button
                      key={year}
                      className={`tab-button ${selectedYear === year ? 'active' : ''}`}
                      onClick={() => setSelectedYear(year)}
                    >
                      {year}
                    </button>
                  ))}
                </div>
                <div className="data-panel">
                  <div className="data-header">
                    <h4 className="data-title">空气污染物_直接</h4>
                    <span className="data-provider">Provider: Clarity AI</span>
                  </div>
                  <p className="data-description">
                    External cost of pollutants released to air by the consumption of fossil
                    fuels and production processes which are owned or controlled by the
                    company. Direct external environmental impacts are those impacts that a
                    company has on the environment through its own activities. Trucost
                    applies monetary values to air pollutant quantites, which represents the
                    global average damage of each environmental impact. All values
                    employed are secondary - the synthesis of existing published and
                    unpublished literature.
                  </p>
                  <div className="data-value">
                    <div>
                      <span className="value">{yearlyData[selectedYear].value}</span>
                      <span className="unit">{yearlyData[selectedYear].unit}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span className="disclosure">E</span>
                      <span className="na-value">N/A</span>
                    </div>
                  </div>
                  <button className="expand-button">Expand To See Graphical View</button>
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