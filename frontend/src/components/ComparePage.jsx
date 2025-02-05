import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as htmlToImage from 'html-to-image';
import { jsPDF } from 'jspdf';
import { calculateTotalScore } from "./calculateScore";
import './ESGDetails.css';

// const ComparePage = ({corporationList}) => {
    const ComparePage = () => {
        // const navigate = useNavigate();
        // console.log(corporationList);
    
        const [corporationYearsDict, setCorporationYearsDict] = useState({});
        const [corporationInfoDict, setCorporationInfoDict] = useState({});
        const [chart, setChart] = useState([]);
        const [framework, setFramework] = useState(null);
        const [totalScoreDict, setTotalScoreDict] = useState({});
        const [chart2, setChart2] = useState([]);
        const [customizedWeight, setCustomizedWeight] = useState({
            ew: "",
            sw: "",
            gw: ""
        });
        
        const [tempWeight, setTempWeight] = useState({
            ew: "",
            sw: "",
            gw: ""
        });
    
        const chartRef = useRef(null);
        const chart2Ref = useRef(null);
    
        const [companyList, setCompanyList] = useState([]); // API获取到的公司数据
        const [selectedCompanies, setSelectedCompanies] = useState([]); // 选中的公司ID
        const [corporationShowList, setCorporationShowList] = useState([]); // 提交后的公司ID列表
      
        // 获取公司数据
        useEffect(() => {
            async function getAllCompany() {
                const formData = new URLSearchParams();
                try {
                    const response = await fetch('http://localhost:5000/api/query_data', {
                        method: 'POST', 
                        headers: {
                                'Content-Type': 'application/x-www-form-urlencoded', 
                        },
                        body: formData.toString()
                    });
                                
                    const data = await response.json();
                    /* 这里应该是所有的data */
                    const uniqueCompany = new Map();
                    for (const item of data.data) {
                        uniqueCompany.set(item.perm_id, {perm_id: item.perm_id, company_name: item.company_name});
                    }
                    const uniqueCompanyList = Array.from(uniqueCompany.values());
                    setCompanyList(uniqueCompanyList);
                    console.log(uniqueCompanyList);
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
            getAllCompany();
        }, []);
      
        // 处理复选框选中
        const handleCheckboxChange = (perm_id) => {
            setSelectedCompanies((prevSelected) =>
                prevSelected.includes(perm_id)
                ? prevSelected.filter((id) => id !== perm_id) 
                : [...prevSelected, perm_id] 
            );
        };
      
        // 提交选择的公司
        const handleSubmitCompany = () => {
            setCorporationShowList(selectedCompanies);
        };
      
    
        useEffect(() => {
            if (framework !== null && corporationShowList && corporationShowList.length > 0) {
                const corporationYears = {}; 
    
                const calculateCommonYears = async () => {
                    for (const corporation of corporationShowList) {
                        const request = { 
                            perm_id: corporation 
                        };
                        const formData = new URLSearchParams();
                        for (const key in request) {
                            formData.append(key, request[key]);
                        }
                        try {
                            const response = await fetch('http://localhost:5000/api/query_data', {
                                method: 'POST', 
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded', 
                                },
                                body: formData.toString()
                            });
                            
                            const data = await response.json();
                            console.log(data.data[0]);
                            console.log(corporation);
                            // console.log(Object.keys(data.data[0]));
                            const yearStringList = Object.keys(data.data[0]).filter(key => /^\d{4}_(E|S|G)_Marks$/.test(key));
                            console.log(yearStringList);
                            const yearList = new Set(yearStringList.map(year_string => parseInt(year_string.split('_')[0])));
                            console.log(yearList);
                            console.log(yearList.size);
                            if (yearList.size > 0) {
                                const latest_year = Math.max(...yearList); 
                                console.log(latest_year);
                                corporationYears[corporation] = latest_year;
                            }
                            console.log(corporationYears);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }
                    console.log(corporationYears);
                    setCorporationYearsDict(corporationYears);
                };
    
                calculateCommonYears();
            }
        }, [corporationShowList]);
    
        useEffect(() => {
            if (corporationShowList && corporationShowList.length > 0 && Object.keys(corporationYearsDict).length > 0) {
                const corporationInfo = {}; 
    
                const getCorporationsInfo = async () => {
                    for (const corporation of corporationShowList) {
                        if (!corporationYearsDict.hasOwnProperty(corporation)) {
                            console.log("这个公司没有年份数据");
                            continue;
                        }
                        const request = { 
                            perm_id: corporation,
                            year: corporationYearsDict[corporation]
                        };
                        const formData = new URLSearchParams();
                        for (const key in request) {
                            formData.append(key, request[key]);
                        }
                        try {
                            const response = await fetch('http://localhost:5000/api/query_data', {
                                method: 'POST', 
                                headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded', 
                                },
                                body: formData.toString()
                            });
                            
                            const data = await response.json();
                            console.log(data.data[0]);
                            console.log(corporation);
                            /* 获取最新一年的数据 */
                            const year = corporationYearsDict[corporation];
                            const e_value = data.data[0][`${year}_E_Marks`] || 0;
                            const s_value = data.data[0][`${year}_S_Marks`] || 0;
                            const g_value = data.data[0][`${year}_G_Marks`] || 0;
    
                            corporationInfo[corporation] = {
                                "year": `${year}`,
                                "E": e_value,
                                "S": s_value,
                                "G": g_value
                            };
                            console.log(corporationInfo);
                        } catch (error) {
                            console.error('Error fetching data:', error);
                        }
                    }
                    console.log(corporationInfo);
                    setCorporationInfoDict(corporationInfo);
                };
    
                getCorporationsInfo();
            }
        }, [corporationYearsDict]);
    
        /* 对这个corporationYearsDict里的每个corporation的 */
        const downloadChartPDF = async () => {
            const pdf = new jsPDF();
            pdf.text('ESG Performance In Different Corporations', 10, 10);
            try {
                const chartImage = await htmlToImage.toPng(chartRef.current); 
                pdf.addImage(chartImage, 'PNG', 10, 20, 200, 100); 
                const chart2Image = await htmlToImage.toPng(chart2Ref.current); 
                pdf.addImage(chart2Image, 'PNG', 10, 130, 200, 100); 
                pdf.save(' Comparison Report.pdf');
            } catch (error) {
                console.error('Error:', error);
            }
        };
        
        let chartData = {};
        useEffect(() => {
            console.log(corporationInfoDict);
            chartData = Object.entries(corporationInfoDict).map(([corporation, values]) => ({
                corporation,
                year: values.year,
                E: values.E || 0,
                S: values.S || 0,
                G: values.G || 0,
            }));
        
            console.log(chartData);
            setChart(chartData);
        }, [corporationInfoDict]);
        console.log(chart);
    
        let chart2Data = {};
        useEffect(() => {
            console.log(totalScoreDict);
            chart2Data = Object.entries(totalScoreDict).map(([corporation, values]) => ({
                corporation,
                score: values.score
            }));
        
            console.log(chart2Data);
            setChart2(chart2Data);
        }, [totalScoreDict]);
        console.log(chart2);
    
    
    
    
    
        const updateInputChange = (e) => {
            const {name, value} = e.target;
            setTempWeight((prev) => ({
              ...prev,
              [name]: value || ""
            }));
        };
        
        const clickCustomizeButton = () => {
            setCustomizedWeight({...tempWeight});
            console.log("new weights: ", [tempWeight.ew, tempWeight.sw, tempWeight.gw]);
        };
        
        return (
            <div>
                <div>Compare Corporations</div>
                {/* 首先要在search界面把需要被compare的公司perm_id加到一个列表，然后在这个界面返回这个列表  */}
                {/* <div>corporationList: {corporationShowList}</div> */}
                <div> 
                    <label>Framework</label>
                    <Select
                    value={framework}
                    onChange={setFramework}
                    options={[
                        { label: "IFRS S1", value: "IFRS S1" },
                        { label: "IFRS S2", value: "IFRS S2" },
                        { label: "TCFD", value: "TCFD" },
                        { label: "CUSTOMIZE", value: "CUSTOMIZE" },
                    ]}
                    isSearchable
                    placeholder="Please Select Framework"
                    />
                </div>
                <div>
                    <label>Environmental: </label>
                    <input
                    type="text"
                    name="ew"
                    value={tempWeight.ew}
                    onChange={updateInputChange}
                    />
                    <label>Social: </label>
                    <input
                    type="text"
                    name="sw"
                    value={tempWeight.sw}
                    onChange={updateInputChange}
                    />
                    <label>Governance: </label>
                    <input
                    type="text"
                    name="gw"
                    value={tempWeight.gw}
                    onChange={updateInputChange}
                    />
                    <button onClick={clickCustomizeButton}>Submit Customize Framework</button>
                </div>
                <div>
                    <h3>Select Companies</h3>
                    {companyList.map((company) => (
                        <div key={company.perm_id}>
                            <label>
                                <input
                                type="checkbox"
                                value={company.perm_id}
                                checked={selectedCompanies.includes(company.perm_id)}
                                onChange={() => handleCheckboxChange(company.perm_id)}
                                />
                                {company.company_name}
                            </label>
                        </div>
                    ))}
                    <button onClick={handleSubmitCompany}>Submit Company</button>
                    
                    <h3>Selected Corporation List</h3>
                    <ul>
                        {corporationShowList.map((id) => (
                        <li key={id}>{id}</li>
                        ))}
                    </ul>
                </div>
                {/* 接下来对这个corporationList里的每个perm_id都获取get_data_key，然后获取所有的年份，放到一个yearList里
                然后把每个yearList存到一个corporationYearsList里，然后对这个corporationYearsList里的每个元素求交集，就是这些选中的公司的共有年份 */}
                
                
                <div ref={chartRef}>
                    <BarChart width={800} height={500} data={chart}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="corporation" /> 
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="E" fill="#6a7ee2" name="E Marks" />
                        <Bar dataKey="S" fill="#e46c68" name="S Marks" />
                        <Bar dataKey="G" fill="#47bcae" name="G Marks" />
                    </BarChart>
                </div>
                <div ref={chart2Ref}>
                    <BarChart width={800} height={500} data={chart2}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="corporation" /> 
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" fill="#0a855b" name="Total Score" barSize={20}/>
                    </BarChart>
                </div>
                <button onClick={downloadChartPDF}>Download</button>
            </div>
        );
    }
    
    export default ComparePage;
    
