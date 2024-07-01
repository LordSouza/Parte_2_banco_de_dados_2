'use client'
import styles from "./page.module.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Home() {

  const [selectedTables, setSelectedTables] = useState([]);
  const [selectedAtributos, setSelectedAtributos] = useState([]);
  const [atributoNomes, setAtributoNomes] = useState([]);
  const [primaryTable, setPrimaryTable] = useState(null);
  const [secondaryTables, setSecondaryTables] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [keys, setKeys] = useState([]);
  const [values, setValues] = useState([]);
  const [orderby, setOrderby] = useState(null);
  const [tables, setTables] = useState({});
  const [remainingAtributos, setRemainingAtributos] = useState([]);
  const [filters, setFilters] = useState({});
  const [currentFilter, setCurrentFilter] = useState("");
  const [selectedAttribute, setSelectedAttribute] = useState("");


  const handleCheckboxFilter = (event) => {
    const { id, checked } = event.target;
    if (checked) {
      const parts = id.split('-');
      const attributeName = parts.slice(1).join('-');
      setSelectedAttribute(attributeName);
    } else {
      setSelectedAttribute("");
    }
  };

  const handleClearFilter = () => {
    setFilters({});
    setCurrentFilter("");
    setSelectedAttribute("");
  };

  const handleCheckboxChange = (event) => {
    const { id, checked } = event.target;
  
    setSelectedTables((prevSelectedTables) => {

      const isSecondaryTable = primaryTable !== null && primaryTable !== id;
  
      if (checked) {
        if (isSecondaryTable) {

          setSecondaryTables((prevSecondaryTables) => [...prevSecondaryTables, id]);
        } else {
          setPrimaryTable(id);
        }
        return [...prevSelectedTables, id];
      } else {
        if (primaryTable === id) {

          setPrimaryTable(null);
          const updatedTables = prevSelectedTables.filter((table) => table !== id);
          if (updatedTables.length > 0) {
            setPrimaryTable(updatedTables[0]);
            setSecondaryTables(updatedTables.slice(1));
          }
        } else {

          setSecondaryTables((prevSecondaryTables) =>
            prevSecondaryTables.filter((table) => table !== id)
          );
        }
        setSelectedAtributos((prevSelectedAtributos) =>
          prevSelectedAtributos.filter((atributo) => !atributo.startsWith(`${id}-`))
        );
        return prevSelectedTables.filter((table) => table !== id);
      }
    });
  };
  
  const handleFilterChange = (event) => {
    setCurrentFilter(event.target.value);
  };

  const handleApplyFilter = () => {
    if (selectedAttribute && currentFilter) {
      setFilters(prevFilters => ({
        ...prevFilters,
        [selectedAttribute]: currentFilter
      }));
      setCurrentFilter("");
    }
  };

  const distributeAtributos = (updatedSelectedAtributos) => {
    let newRemainingAtributos = [...updatedSelectedAtributos];
    const newTables = {};
  
    secondaryTables.forEach(table => {
      const atributosForTable = newRemainingAtributos
        .filter(atributo => atributo.startsWith(`${table}-`))
        .map(atributo => {
          const parts = atributo.split('-');
          return parts.slice(1).join('-');
        });
  
      newRemainingAtributos = newRemainingAtributos.filter(atributo => !atributo.startsWith(`${table}-`));
  
      if (atributosForTable.length > 0) {
        newTables[table] = atributosForTable;
      }
    });
  
    const remainingAtributosFinal = newRemainingAtributos.map(atributo => {
      const parts = atributo.split('-');
      return parts.slice(1).join('-'); 
    });
  
    setRemainingAtributos(remainingAtributosFinal);
    setTables(newTables);
  };
  
  
  const handleCheckboxChangeAtributos = (event) => {
    const { id, checked } = event.target;
    let updatedSelectedAtributos;
  
    if (checked) {
      updatedSelectedAtributos = [...selectedAtributos, id];
    } else {
      updatedSelectedAtributos = selectedAtributos.filter(atributo => atributo !== id);
    }
  
    setSelectedAtributos(updatedSelectedAtributos);
    distributeAtributos(updatedSelectedAtributos);
  }; 

  const handleOrderbyChange = (event) => {
    const { id, checked } = event.target;
  
    if (checked) {
      const parts = id.split('-');
      const atributoName = parts.slice(1).join('-');
      setOrderby(atributoName);
    } else {
      setOrderby(null);
    }
  };

  useEffect(() => {
    distributeAtributos(selectedAtributos);
    extractAtributoNomes();
  }, [selectedAtributos]);
  
  const extractAtributoNomes = () => {
    const nomes = remainingAtributos.map((atributo) => {
      const parts = atributo.split('-');
      return parts.length > 1 ? parts.slice(1).join('-') : atributo;
    });
    setAtributoNomes(nomes);
  };
  

  const handleSubmit = async () => {
    if (!primaryTable) {
      setError("Sem tabela principal");
      return;
    }
  
    const requestData = {
      orderby: orderby,
      tables: tables,
      filtros: filters,
      columns: remainingAtributos,
      inicio: 0,
      fim: 10
    };
  
    try {
      const response = await axios.post(
        `http://localhost:8000/${primaryTable}`,
        requestData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
        }
      );
      setResponseData(response.data);
      const formattedData = formatResponseData(response.data);
      setKeys(formattedData.keys);
      setValues(formattedData.values);
    } catch (error) {
      console.log(error.message);
    }
  };

  const formatResponseData = (responseData) => {
    if (!responseData.result || !Array.isArray(responseData.result)) {
      throw new Error('Formato dos dados da resposta incorreto');
    }

    const keys = Object.keys(responseData.result[0]);
    const values = responseData.result.map(item => {
      return keys.map(key => item[key]);
    });

    const modifiedKeys = keys.map(key => {
      const parts = key.split('.');
      return parts.slice(1).join('.'); 
    });
  
    return { keys: modifiedKeys, values };
  };

  const handleSubmitExcel = async () => {
    if (!primaryTable) {
      setError("Sem tabela principal");
      return;
    }
  
    const requestData = {
      orderby: orderby,
      tables: tables,
      filtros: filters,
      columns: remainingAtributos,
      inicio: 0,
      fim: 100
    };
  
    try {
      const response = await axios.post(
        `http://localhost:8000/${primaryTable}/excel`,
        requestData,
        {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json',
          },
          responseType: 'blob' 
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'data.xlsx'); 
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <main className={styles.main}>
        <header className={styles.cabecalho}>
          <svg className={styles.iconCabecalho} xmlns="http://www.w3.org/2000/svg" height="40px" viewBox="0 -960 960 960" width="40px" fill="#068b95"><path d="M480-80q-83.33 0-156.33-31.5-73-31.5-127.17-85.67-54.17-54.16-85.33-127.5Q80-398 80-481.33 80-565 111.17-637.5q31.16-72.5 85.33-126.67 54.17-54.16 127.17-85Q396.67-880 480-880q83.67 0 156.5 30.83 72.83 30.84 127 85Q817.67-710 848.83-637.5 880-565 880-481.33q0 83.33-31.17 156.66-31.16 73.34-85.33 127.5-54.17 54.17-127 85.67T480-80Zm0-66q32-36 54-80t36-101.33H390.67Q404-272.67 426-227.67T480-146Zm-91.33-13.33q-22.67-36.34-39.17-77.5Q333-278 322-327.33H182.67q35 64 82.83 103.33t123.17 64.67ZM572-160q66.67-21.33 119.5-64.33t85.83-103H638.67Q627-278.67 610.83-237.5 594.67-196.33 572-160ZM158-394h151.33q-3-24.67-3.83-45.5-.83-20.83-.83-41.83 0-23.67 1.16-43.17Q307-544 310-566.67H158q-6.33 22.67-8.83 41.84-2.5 19.16-2.5 43.5 0 24.33 2.5 44.5 2.5 20.16 8.83 42.83Zm219.33 0h206q3.67-27.33 4.84-46.83 1.16-19.5 1.16-40.5 0-20.34-1.16-39.17-1.17-18.83-4.84-46.17h-206q-3.66 27.34-4.83 46.17-1.17 18.83-1.17 39.17 0 21 1.17 40.5t4.83 46.83ZM650-394h152q6.33-22.67 8.83-42.83 2.5-20.17 2.5-44.5 0-24.34-2.5-43.5-2.5-19.17-8.83-41.84H650.67q3 30 4.16 48.84Q656-499 656-481.33q0 21.66-1.5 41.16-1.5 19.5-4.5 46.17Zm-12-239.33h139.33Q745.67-696 692.83-739q-52.83-43-121.5-61.67Q594-765 610.17-724.5 626.33-684 638-633.33Zm-247.33 0h180q-11.34-50-35-96-23.67-46-55.67-83.34-30 30-51 72.34-21 42.33-38.33 107Zm-208 0h140Q333-682 348.83-722.17 364.67-762.33 388-800q-68.67 18.67-120.5 61t-84.83 105.67Z"/></svg>
          <div className={styles.nomeCabecalho}>
            <p className={styles.ciber}>ciber</p>
            <p className={styles.ameacas}>AMEAÇAS</p>
          </div>
        </header>
        <div className={styles.divBody}>
            <div className={styles.divBodyOpcoes1}>
            <h2 className={styles.divBodyTitle}>Tabelas</h2>
                <div className={styles.divBodyOpcoes1Tabelas}>
                  <div className={styles.divNomeTabelas}>
                    <ul className={styles.listaAtributosTabela}>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="ameacas" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Ameaças </label>
                            <input type="checkbox" id="ameacas" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('ameacas') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="ameacas-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> categoria </label>
                                <input type="checkbox" id="ameacas-categoria" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> descontinuado </label>
                                <input type="checkbox" id="ameacas-descontinuado" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> descricao </label>
                                <input type="checkbox" id="ameacas-descricao" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_adicionado </label>
                                <input type="checkbox" id="ameacas-hora_adicionado" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_atualizado </label>
                                <input type="checkbox" id="ameacas-hora_atualizado" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_descontinuado </label>
                                <input type="checkbox" id="ameacas-hora_descontinuado" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_visto </label>
                                <input type="checkbox" id="ameacas-hora_visto" className={styles.listaAtributosTabelaItemInputAmeacas}onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> nome </label>
                                <input type="checkbox" id="ameacas-nome" className={styles.listaAtributosTabelaItemInputAmeacas}onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> risco </label>
                                <input type="checkbox" id="ameacas-risco" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> wiki_link </label>
                                <input type="checkbox" id="ameacas-wiki_link" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> wiki_sumario </label>
                                <input type="checkbox" id="ameacas-wiki_sumario" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="atributos" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Atributos </label>
                            <input type="checkbox" id="atributos" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('atributos') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> atid </label>
                                <input type="checkbox" id="atributos-atid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="atributos-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> categoria </label>
                                <input type="checkbox" id="atributos-categoria" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> descrição </label>
                                <input type="checkbox" id="atributos-descricao" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="outrosnomes" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> OutrosNomes </label>
                            <input type="checkbox" id="outrosnomes" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('outrosnomes') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> onid </label>
                                <input type="checkbox" id="outrosnomes-onid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="outrosnomes-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> Nomes </label>
                                <input type="checkbox" id="outrosnomes-nomes" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="novidades" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Novidades </label>
                            <input type="checkbox" id="novidades" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('novidades') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> nid </label>
                                <input type="checkbox" id="novidades-nid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> canal </label>
                                <input type="checkbox" id="novidades-canal" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_adicionado </label>
                                <input type="checkbox" id="novidades-hora_adicionado" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> icone </label>
                                <input type="checkbox" id="novidades-icone" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> link </label>
                                <input type="checkbox" id="novidades-link" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="novidades-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> titulo </label>
                                <input type="checkbox" id="novidades-titulo" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="relacionados" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Relacionados </label>
                            <input type="checkbox" id="relacionados" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('relacionados') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> relid </label>
                                <input type="checkbox" id="relacionados-relid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="relacionados-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> categoria </label>
                                <input type="checkbox" id="relacionados-categoria" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> hora_link </label>
                                <input type="checkbox" id="relacionados-hora_link" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> nome </label>
                                <input type="checkbox" id="relacionados-nome" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> risco </label>
                                <input type="checkbox" id="risco" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                        <li className={styles.listaAtributosTabelaItem}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="taticas_e_tecnicas" className={styles.listaAtributosTabelaItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200Zm80-400h560v-160H200v160Zm213 200h134v-120H413v120Zm0 200h134v-120H413v120ZM200-400h133v-120H200v120Zm427 0h133v-120H627v120ZM200-200h133v-120H200v120Zm427 0h133v-120H627v120Z"/></svg> Taticas_e_Tecnicas </label>
                            <input type="checkbox" id="taticas_e_tecnicas" className={styles.listaAtributosTabelaItemInput} onChange={handleCheckboxChange}/>
                          </div>
                          {selectedTables.includes('taticas_e_tecnicas') && (
                            <div className={styles.divAtributosAmeacas}>
                              <ul className={styles.listaAtributosTabelaAmeacas}>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> ttpsid </label>
                                <input type="checkbox" id="taticas_e_tecnicas-ttpsid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> categoria </label>
                                <input type="checkbox" id="taticas_e_tecnicas-categoria" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> descricao </label>
                                <input type="checkbox" id="taticas_e_tecnicas-descricao" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                                <li className={styles.listaAtributosTabelaItemAmeaca}> <label htmlFor="Atributameacas" className={styles.listaAtributosTabelaItemLabelAmeacas}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> tid </label>
                                <input type="checkbox" id="taticas_e_tecnicas-tid" className={styles.listaAtributosTabelaItemInputAmeacas} onChange={handleCheckboxChangeAtributos}/>
                                </li>
                              </ul>
                            </div>
                          )}
                        </li>
                      </ul>
                  </div>
                </div>
                <h2 className={styles.divBodyTitle}>Funções</h2>
              <div className={styles.divBodyOpcoes1Funcoes}>
                <div className={styles.divNomeTabelas}>
                  <ul className={styles.listaAtributosTabela}>
                    {['orderby'].map((func) => (
                      <li className={styles.listaAtributosTabelaItem} key={func}>
                        <div className={styles.divlistaAtributosTabelaItemLabel}>
                          <label htmlFor={func} className={styles.listaAtributosFuncoesItemLabel}>
                            <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95">
                              <path d="M686-132 444-376q-20 8-40.5 12t-43.5 4q-100 0-170-70t-70-170q0-36 10-68.5t28-61.5l146 146 72-72-146-146q29-18 61.5-28t68.5-10q100 0 170 70t70 170q0 23-4 43.5T584-516l244 242q12 12 12 29t-12 29l-84 84q-12 12-29 12t-29-12Zm29-85 27-27-256-256q18-20 26-46.5t8-53.5q0-60-38.5-104.5T386-758l74 74q12 12 12 28t-12 28L332-500q-12 12-28 12t-28-12l-74-74q9 57 53.5 95.5T360-440q26 0 52-8t47-25l256 256ZM472-488Z"/>
                            </svg>
                            {func.charAt(0).toUpperCase() + func.slice(1)}
                          </label>
                          <input
                            type="checkbox"
                            id={func}
                            className={styles.listaAtributosTabelaItemInput}
                            onChange={handleCheckboxChange}
                            checked={selectedTables.includes(func)}
                          />
                        </div>
                        {selectedTables.includes(func) && (
                          <div className={styles.divAtributosAmeacas}>
                            <ul className={styles.listaAtributosTabelaAmeacas}>
                              {atributoNomes.map((nome) => (
                                <li className={styles.listaAtributosTabelaItemLabelAmeacas} key={nome}>
                                  <label htmlFor={nome} className={styles.listaAtributosTabelaItemLabelAmeacas}>
                                    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95">
                                      <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/>
                                    </svg> 
                                    {nome}
                                  </label>
                                  <input
                                    type="checkbox"
                                    id={`orderby-${nome}`}
                                    className={styles.listaAtributosTabelaItemInputAmeacas}
                                    onChange={handleOrderbyChange}
                                    checked={orderby === nome}
                                  />
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className={styles.divBodyTabela}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    {keys.map((key, index) => (
                      <th key={index}>{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {values.map((valueRow, index) => (
                    <tr key={index}>
                      {valueRow.map((value, idx) => (
                        <td key={idx}>{value}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.divBodyOpcoes2}>
              <div className={styles.divBodyOpcoes2Filtro}>
              <h2 className={styles.divBodyTitle}>Filtro</h2>
                <div className={styles.divBodyOpcoes2FiltroCheck}>
                  <div className={styles.divNomeTabelas}>
                    <ul className={styles.listaAtributosTabela}>
                      {atributoNomes.map((nome) => (
                        <li className={styles.listaAtributosTabelaItem} key={nome}>
                          <div className={styles.divlistaAtributosTabelaItemLabel}>
                            <label htmlFor="atributosSelecionados" className={styles.listaAtributosFuncoesItemLabel}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg> {nome} </label>
                          <input type="checkbox" id ={`atributo-${nome}`} onChange={handleCheckboxFilter} checked={selectedAttribute === nome} className={styles.listaAtributosTabelaItemInput}/>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div> 
                
                <div className={styles.labelInputFiltro}>
                  <label for="nome" className={styles.labelFiltro}> <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#068b95"><path d="M400-240v-80h160v80H400ZM240-440v-80h480v80H240ZM120-640v-80h720v80H120Z"/></svg> Filtrar por valor:</label>
                  <input type="text" name="nome" value={currentFilter} onChange={handleFilterChange} className={styles.inputFiltro}></input>
                </div>
              </div>
              <button onClick={handleApplyFilter} className={styles.applyFilterButton}>Aplicar Filtro</button>
              <button onClick={handleClearFilter} className={styles.clearFilterButton}>Limpar Filtro</button>
              <button className={styles.buttonGerar} onClick={handleSubmit} >Gerar</button>
              <button className={styles.buttonDownload} onClick={handleSubmitExcel}>Download</button>
            </div>
        </div>
    </main>
  );
}
