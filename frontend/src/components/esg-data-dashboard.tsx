import React, { useState } from 'react';

const ESGDataDashboard = () => {
  const [selectedYear, setSelectedYear] = useState('2017');
  const [activeTab, setActiveTab] = useState('environmental');

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f3f4f6', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#1f2937', color: 'white', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>ecoM</span>
            <nav>
              <ul style={{ display: 'flex', gap: '1rem', listStyle: 'none', padding: 0 }}>
                <li>搜索</li>
                <li>比较工具</li>
                <li>框架</li>
              </ul>
            </nav>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span>您好，zhongshuoming</span>
            <button style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}>登出</button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '2rem auto', padding: '0 1rem' }}>
        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>ESG 数据</h1>
        
        <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Sasol Ltd</h2>
            <div>
              <button style={{ backgroundColor: '#14b8a6', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', marginRight: '0.5rem', cursor: 'pointer' }}>
                下载报告
              </button>
              <button style={{ backgroundColor: '#22c55e', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '0.25rem', cursor: 'pointer' }}>
                查看 ESG 得分
              </button>
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem' }}>
            <span>总部国家：南非</span> | <span>行业：金属与采矿</span>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            {['environmental', 'social', 'governance'].map((tab) => (
              <button
                key={tab}
                style={{
                  marginRight: '0.5rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '0.25rem',
                  backgroundColor: activeTab === tab ? '#3b82f6' : '#e5e7eb',
                  color: activeTab === tab ? 'white' : 'black',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'environmental' ? '环境' : tab === 'social' ? '社会' : '治理'}
              </button>
            ))}
          </div>
          {activeTab === 'environmental' && (
            <div style={{ display: 'flex' }}>
              <div style={{ width: '25%', paddingRight: '1rem' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>目录</h3>
                <ul style={{ fontSize: '0.875rem', paddingLeft: '1.5rem' }}>
                  <li>空气污染物_直接</li>
                  <li>空气污染物_间接</li>
                  <li>分析估计CO2总量</li>
                  <li>分析废物回收比率</li>
                  <li>生物多样性影响减少</li>
                </ul>
              </div>
              <div style={{ width: '75%' }}>
                <h3 style={{ fontWeight: '600', marginBottom: '0.5rem' }}>环境 (43 个结果)</h3>
                <div style={{ backgroundColor: '#eff6ff', padding: '1rem', borderRadius: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: '600', margin: 0 }}>空气污染物_直接</h4>
                    <span style={{ fontSize: '0.875rem', color: '#6b7280' }}>提供者: Clarity AI</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', marginBottom: '1rem' }}>
                    公司拥有或控制的化石燃料消耗和生产过程向空气释放污染物的外部成本。直接外部环境影响是公司通过自身活动对环境产生的影响。Trucost 对空气污染物数量应用货币价值，代表每种环境影响的全球平均损害。所有使用的值都是次要的 - 现有已发表和未发表文献的综合。
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>2654590</span>
                      <span style={{ fontSize: '0.875rem', marginLeft: '0.5rem' }}>美元 (千)</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <span style={{ backgroundColor: '#22c55e', color: 'white', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>E</span>
                      <span style={{ color: '#ef4444' }}>N/A</span>
                    </div>
                  </div>
                  <button style={{ color: '#3b82f6', fontSize: '0.875rem', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                    展开查看图表视图
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

export default ESGDataDashboard;
