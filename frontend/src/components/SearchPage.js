import React, { useState, useEffect } from 'react';
// import React, { useState } from 'react';
import Select from 'react-select'; 
import { useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import './ESGDetails.css';


const selectStyles = {
  control: (base) => ({
    ...base,
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    minHeight: '38px',
    backgroundColor: '#ffffff',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : '#ffffff',
    color: state.isSelected ? '#ffffff' : '#000000',
  }),
};





const SearchPage = ({ addToCorporationList }) => {
  const navigate = useNavigate();
  /* 选中的下拉菜单展示内容 */
  const [industry, setIndustry] = useState(null);
  const [corporation, setCorporation] = useState(null);
  const [region, setRegion] = useState(null);
  const [year, setYear] = useState(null);
  const [corporationFiltered, setCorporationFiltered] = useState(null);
  const [indicatorFiltered, setIndicatorFiltered] = useState(null);
  const [pillar, setPillar] = useState(null);
  const [indicatorInfo, setIndicatorInfo] = useState({});

  console.log(`industry=${industry}`);
  console.log(`corporation=${corporation}`);
  console.log(`region=${region}`);
  console.log(`corporationFiltered=${corporationFiltered}`);
  
  console.log(`indicatorFiltered=${indicatorFiltered}`);


  /* 下拉菜单待选项 */
  const [industryOptions, setIndustryOptions] = useState([]);
  const [corporationOptions, setCorporationOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [yearOptions, setYearOptions] = useState([]);
  const [indicatorOptions, setIndicatorOptions] = useState([]);


  const handleViewDetails = () => {
    if (corporationFiltered) {
      navigate(`/esgdetails/${corporationFiltered}`);  // 使用 URL 参数传递 perm_id
    } else {
      console.error('No corporation selected');
    }
  };

  useEffect(() => {
    setRegion([]);
    setRegionOptions([]);
    setCorporation([]);
    setCorporationOptions([]);
    const formData = new URLSearchParams(); // 创建空的表单数据对象

    fetch('http://localhost:5000/api/query_data', {
      method: 'POST', // 使用POST请求
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded', // 设置Content-Type为表单格式
      },
      body: formData.toString() // 空表单数据
    })
      .then(response => response.json())
      .then(data => {
        const industryOptions = data.data.map(item => ({
          value: item.industry,
          label: item.industry
        }));
        setIndustryOptions(industryOptions);  
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []); 


  useEffect(() => {
    console.log(industry);
    console.log(region);
    if (industry && region) {
      const request = {
        industry: industry.value,
        headquarter_country: region.value,
      };
      const formData = new URLSearchParams(); // 创建空的表单数据对象
      for (const key in request) {
        formData.append(key, request[key]);
      }
      fetch('http://localhost:5000/api/query_data', {
        method: 'POST', // 使用POST请求
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 设置Content-Type为表单格式
        },
        body: formData.toString() 
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);

          const corporationOptions = Array.from(new Map(data.data.map(item => [item.perm_id, { value: item.perm_id, label: item.company_name }])).values());
          setCorporationOptions(corporationOptions);
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [industry, region]); 

  useEffect(() => {
    setCorporation([]);
    setCorporationOptions([]);
    if (industry) {
      const request = {
        industry: industry.value
      };
      const formData = new URLSearchParams(); // 创建空的表单数据对象
      for (const key in request) {
        formData.append(key, request[key]);
      }
      fetch('http://localhost:5000/api/query_data', {
        method: 'POST', // 使用POST请求
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // 设置Content-Type为表单格式
        },
        body: formData.toString()
      })
        .then(response => response.json())
        .then(data => {
          console.log(data);
          const setRegions = Array.from(new Set(data.data.map(item => item.headquarter_country)));
          const regionOptions = setRegions.map(region => ({
            value: region,
            label: region
          }));
          setRegionOptions(regionOptions);  
        })
        .catch(error => console.error('Error fetching data:', error));
    }
  }, [industry]); 
  console.log(indicatorFiltered);
  useEffect(() => {
    if (indicatorFiltered && corporationFiltered && pillar) {
      console.log('Sending request with:', indicatorFiltered.value);
      const request = {
        metric_name: indicatorFiltered.value,
        // metric_name: indicatorFiltered,
        perm_id: corporationFiltered,
        pillar: pillar
      };
      // console.log(request);
      const formData = new URLSearchParams();
      for (const key in request) {
        formData.append(key, request[key]);
      }
      fetch('http://localhost:5000/api/query_data', {
        method: 'POST', 
        headers: {
          // 'Content-Type': 'application/json'
          'Content-Type': 'application/x-www-form-urlencoded', 
        },
        // body: JSON.stringify(request) 
        body: formData.toString()
      })
      .then(response => response.json())
      .then(data => {
        if (data && Array.isArray(data.data)) { 
          const uniqueYearOptions = [...new Set(data.data.map(item => item.metric_year))];
          console.log(setYearOptions);
          const yearOptions = uniqueYearOptions.map(year => ({
            value: year,
            label: year
          }));

          console.log(yearOptions);
          setYearOptions(yearOptions); /* 获取到的year列表转换成下拉菜单待选项 */
        }
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
    }
  }, [indicatorFiltered, corporationFiltered, pillar]);

  // const handleClick = () => {};
  const handleClick = async (pillar_class) => {
    if (!corporationFiltered) {
      console.error('Please select corporation first!');
      return;
    }

    try {
      const request = {
        perm_id: corporationFiltered,
        pillar: pillar_class  
      };
      const formData = new URLSearchParams();
      for (const key in request) {
        formData.append(key, request[key]);
      }
      console.log(request);
      const response = await fetch('http://localhost:5000/api/query_data', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        // body: JSON.stringify(request),
        body: formData.toString(),
      });

      if (!response.ok) {
        throw new Error('No response');
      }

      const data = await response.json();
      
      console.log(data);
      console.log("哈哈哈哈哈哈哈哈哈哈");
      if (data && Array.isArray(data.data)) { 
        const setNameOptions = [...new Set(data.data.map(item => item.metric_name))];
        console.log(setNameOptions);
        const indicatorOptions = setNameOptions.map(indicator => ({
          value: indicator,
          label: indicator
        }));
        console.log(indicatorOptions);
        setIndicatorOptions(indicatorOptions); /* 获取到的indicator列表转换成下拉菜单待选项 */
        setPillar(pillar_class);
      } 
      else {
        throw new Error('No such data');
      }
    }
    catch (error) {
      console.error('Error fetching indicators:', error);
    }
  };
  console.log(`indicatorOptions=${indicatorOptions}`);

  // const searchFilter = () => {}; 
  const searchFilter = async () => {
    if (industry && corporation && region) {
      try {
        const request = {
          industry: industry.label,  
          company_name: corporation.label,  
          headquarter_country: region.label  
        };
        const formData = new URLSearchParams();
        for (const key in request) {
          formData.append(key, request[key]);
        }
        const response = await fetch('http://localhost:5000/api/query_data', {
          method: 'POST',  
          headers: {
            // 'Content-Type': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          // body: JSON.stringify(request),
          body: formData.toString(),
        });
        if (!response.ok) {
          throw new Error('No response');
        }
        const data = await response.json();
        console.log(data);
        const perm_id_data = data.data.map(item => item.perm_id);
        if (perm_id_data.length > 0) {
            setCorporationFiltered(perm_id_data[0]); /* 获取到的公司id */
        }
        else {
          throw new Error('No such data');
        }
      } 
      catch (error) {
        console.error('Fetching data failed:', error);
      }
    } 
    else {
      console.error('Please select first!');
    }
  };


  useEffect(() => {
    if (indicatorFiltered && corporationFiltered && pillar && year) {
      const getIndicatorInfo = async () => {
        try {
          const request = {
            metric_name: indicatorFiltered.value,  
            perm_id: corporationFiltered,  
            pillar: pillar,
            metric_year: year.label
          };
          const formData = new URLSearchParams();
          for (const key in request) {
            formData.append(key, request[key]);
          }
          console.log(request);
          const response = await fetch('http://localhost:5000/api/query_data', {
            method: 'POST',
            headers: {
              // 'Content-Type': 'application/json',
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            // body: JSON.stringify(request),
            body: formData.toString(),
          });

          if (!response.ok) {
            throw new Error('No related information');
          }

          const data = await response.json();
          console.log(data);

          if (data && Array.isArray(data.data)) {
            const data_match = {
              metric_description: data.data[0].metric_description,
              metric_value: data.data[0].metric_value,
              metric_unit: data.data[0].metric_unit,
              disclosure: data.data[0].disclosure,
              nb_points_of_observations: data.data[0].nb_points_of_observations,
              reported_date: data.data[0].reported_date
            };
            setIndicatorInfo(data_match); 
          }  
        } 
        catch (error) {
          console.error('Fetching information failed:', error);
        }
      };

      getIndicatorInfo();  
    }
  }, [indicatorFiltered, corporationFiltered, pillar, year]);  

  // console.log(indicatorInfo);

  const downloadMetricInfoPDF = () => {
    const pdf = new jsPDF();
    pdf.text(`Company: ${corporationFiltered}`, 10, 10);  
    pdf.text('Indicator Information', 10, 20); 
    pdf.text(`Indicator: ${indicatorInfo.metric_name}`, 10, 30); 
    pdf.text(`Description: ${indicatorInfo.metric_description}`, 10, 40, { maxWidth: 190 }); 
    pdf.text(`Value: ${indicatorInfo.metric_value}`, 10, 80); 
    pdf.text(`Unit: ${indicatorInfo.metric_unit}`, 10, 90); 
    pdf.text(`Disclosure: ${indicatorInfo.disclosure}`, 10, 100); 
    pdf.text(`Number of Observation Points: ${indicatorInfo.nb_points_of_observations}`, 10, 110); 
    pdf.text(`Reported Date: ${indicatorInfo.reported_date}`, 10, 120); 
  
    pdf.save('Indicator Information Report.pdf');
  };
  const handleCompareClick = () => {
    navigate('/compare'); 
  };

  const sentToCompareClick = () => {
    addToCorporationList(corporationFiltered);
  }

  return (
    <div>
      <div className="header">
        <div className="header-content">
          <div className="logo">EcoM Search</div>
          <nav>
            <ul className="nav-menu">
            <li><div className="navLink" onClick={handleCompareClick}>Comparison</div></li>
            </ul>
          </nav>
        </div>
      </div>

      <div className="main-content">
        {/* Search Section */}
        <div className="card">
          <div className="card-header">
            <h2 className="page-title">ESG Metrics filter</h2>
          </div>
          
          <div className="content-wrapper">
            <div style={{ flex: 1 }}>
              <label className="content-title">Industry</label>
              <Select
                value={industry}
                onChange={setIndustry}
                options={industryOptions}
                isSearchable
                placeholder="Select Industry"
                styles={selectStyles}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="content-title">Corporation</label>
              <Select
                value={corporation}
                onChange={setCorporation}
                options={corporationOptions}
                isSearchable
                placeholder="Select Corporation"
                styles={selectStyles}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label className="content-title">Region</label>
              <Select
                value={region}
                onChange={setRegion}
                options={regionOptions}
                isSearchable
                placeholder="Select Region"
                styles={selectStyles}
              />
            </div>
            <div style={{ flex: 0.5, display: 'flex', alignItems: 'flex-end' }}>
              <button onClick={searchFilter} className="action-button view-scores-button">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <div className="card" style={{ marginTop: '1.5rem' }}>
          <div className="card-header">
            <div>
              <h3 className="company-name">
                {corporation ? corporation.label : "Please select corporation first!"}
              </h3>
              <div className="company-info">
                {pillar ? `Selected Pillar: ${pillar}` : "Please select pillar first!"}
              </div>
            </div>
            
            <div>
              <button onClick={downloadMetricInfoPDF} className="action-button download-button">
                Download Report
              </button>
              <button onClick={sentToCompareClick} className="action-button view-scores-button" style={{ marginRight: '0.5rem' }}>
                Send To Compare
              </button>
              <button 
                onClick={handleViewDetails} 
                className="action-button view-scores-button"
                style={{ backgroundColor: '#3b82f6' }} 
              >
                View Details
               </button>
              
            </div>
          </div>

          <div className="content-wrapper">
            {/* Left Sidebar */}
            <div className="sidebar">
              <button
                onClick={() => handleClick("E")}
                className={`tab-button ${pillar === "E" ? "active" : ""}`}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                Environmental
              </button>
              <button
                onClick={() => handleClick("S")}
                className={`tab-button ${pillar === "S" ? "active" : ""}`}
                style={{ width: '100%', marginBottom: '0.5rem' }}
              >
                Social
              </button>
              <button
                onClick={() => handleClick("G")}
                className={`tab-button ${pillar === "G" ? "active" : ""}`}
                style={{ width: '100%', marginBottom: '1rem' }}
              >
                Governance
              </button>

              <div style={{ marginBottom: '1rem' }}>
                <label className="content-title">Indicator</label>
                <Select
                  value={indicatorFiltered}
                  onChange={setIndicatorFiltered}
                  options={indicatorOptions}
                  isSearchable
                  styles={selectStyles}
                />
              </div>

              <div>
                <label className="content-title">Year</label>
                <Select
                  value={year}
                  onChange={setYear}
                  options={yearOptions}
                  isSearchable
                  styles={selectStyles}
                />
              </div>
            </div>

            {/* Main Panel */}
            <div className="main-panel">
              <div className="data-panel">
                <div className="data-header">
                  <h4 className="data-title">
                    {indicatorFiltered?.value || "No indicator selected"}
                  </h4>
                </div>
                <p className="data-description">
                  {indicatorInfo?.metric_description || "No related description"}
                </p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
                {/* Metric Value */}
                <div className="data-panel">
                  <div className="data-header">
                    <h4 className="data-title">Metric Value</h4>
                  </div>
                  <div className="data-value">
                    <span className="value">
                      {indicatorInfo?.metric_value || "N/A"}
                    </span>
                    <span className="unit">
                      {indicatorInfo?.metric_unit}
                    </span>
                  </div>
                </div>

                {/* Metric Unit */}
                <div className="data-panel">
                  <div className="data-header">
                    <h4 className="data-title">Disclosure</h4>
                  </div>
                  <div className="data-value">
                    <span className={`disclosure ${!indicatorInfo?.disclosure ? 'na-value' : ''}`}>
                      {indicatorInfo?.disclosure || "No Data"}
                    </span>
                  </div>
                </div>

                {/* Number of Observation Points */}
                <div className="data-panel">
                  <div className="data-header">
                    <h4 className="data-title">Observation Points</h4>
                  </div>
                  <div className="data-value">
                    <span className="value">
                      {indicatorInfo?.nb_points_of_observations || "N/A"}
                    </span>
                  </div>
                </div>

                {/* Reported Date */}
                <div className="data-panel">
                  <div className="data-header">
                    <h4 className="data-title">Reported Date</h4>
                  </div>
                  <div className="data-value">
                    <span className="value">
                      {indicatorInfo?.reported_date || "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SearchPage;

