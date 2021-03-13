import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './App.css';

function Table(props) {
	//data отвечает за хранение текущих 50-ти данных
	const [data, setData] = useState([...props.dataCurrent]);
	//filter хранит строку по которой пройдет фильтрация
	const [filter, setFilter] = useState('');
	//sortConfig объект в который задает направление сортировки и ключ по которому будет идти сорртировка
	const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

	//обновляем переменные при новом рендере
	useEffect(() => {
		setData(props.dataCurrent);
		setSortConfig({ key: null, direction: null });
		setFilter(props.filter);
	}, [props.dataCurrent, props.filter]);

	//установка класса в зависимости от текущего sortConfig
	function classSetter(name) {
		if (!sortConfig) {
			return;
		}
		return sortConfig.key === name ? sortConfig.direction : undefined;
	}

	//задание нового sortConfig для сортировки
	function requestSort(key) {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	}

	//при обновлении sortConfig вызываем функцию сортировки
	useEffect(() => {
		sortBy();
	}, [sortConfig]);

	//функция сортировки
	function sortBy() {
		//создаем копию массива
		let sortedProducts = [...data];
		//сортировка в зависимости от направлния
		sortedProducts.sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
			if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
			return 0;
		});
		setData(sortedProducts);
	}

	return (
		<table>
			<thead>
				<tr>
					<th
						onClick={() => requestSort('index')}
						className={classSetter('index')}
					>id</th>
					<th
						onClick={() => requestSort('fName')}
						className={classSetter('fName')}
					>First name</th>
					<th
						onClick={() => requestSort('sName')}
						className={classSetter('sName')}
					>Sur name</th>
				</tr>
			</thead>
			<tbody>
				{
					//сначала идет фильтрация массива, затем сортировка по нужному столбцу
					data
						.filter((d) =>
							d.fName.toUpperCase().indexOf(filter.toUpperCase()) !== -1 || d.sName.toUpperCase().indexOf(filter.toUpperCase()) !== -1
						)
						.map((d) => (

							<tr key={d.id} >
								<td>{d.index + 1}</td>
								<td>{d.fName}</td>
								<td>{d.sName}</td>
							</tr>
						))
				}
			</tbody>
		</table>);
}

function App() {
	//data хранит массив из 1000 объектов
	const [data, setData] = useState([]);
	//pageСount количество страниц для пагинации
	const [pageCount, setPageCount] = useState(0);
	//filterText хранит строку которую вводит пользователь для фильтрации
	const [filterText, setFilterText] = useState('');
	//количество элементов за страницу
	const perPage = 50;
	//pageIndexes опрделяют начало и конец отрезка массива data, для передачи в компонент Table
	const [pageIndexes, setPageIndexes] = useState({ start: 0, end: perPage });

	// при прогрузке загрузить жсон url
	useEffect(() => {
		async function getData() {
			let res = await fetch('https://next.json-generator.com/api/json/get/Ek5OUQ3M5');
			let json = await res.json();
			setData(json);
			setPageCount(json.length / 50);
		}
		getData();
	}, []);

	//при изменении страницы обновить начало и конец отрезка
	function handlePageChange(e) {
		//e.selected возвращает выбранную страницу
		let elementStart = e.selected * perPage;
		setPageIndexes({ start: elementStart, end: elementStart + perPage });
	}

	function filterTable(e) {
		setFilterText(e.target.value);
	}
	return (
		<div className="App">
			{
				data.length
					? (<><input type="text" onChange={filterTable} placeholder="Filter..." />
						<Table dataCurrent={data.slice(pageIndexes.start, pageIndexes.end)} filter={filterText}></Table>
						<ReactPaginate
							previousLabel={"<<"}
							nextLabel={">>"}
							breakLabel={"..."}
							pageCount={pageCount}
							pageRangeDisplayed={3}
							marginPagesDisplayed={2}
							onPageChange={handlePageChange}
							containerClassName={'pagination__container'}
							pageLinkClassName={'pagination__page'}
							activeLinkClassName={'pagination__active'}
							nextLinkClassName={'pagination__page pagination__button'}
							previousLinkClassName={'pagination__page pagination__button'}
							breakLinkClassName={'pagination__page'}
						/>
					</>)
					: (<div className="loading">
						<div className="loading__wrapper">
							<p className="loading__name">Loading...</p>
							<div className="lds-dual-ring"></div>
						</div>
					</div>)
			}
		</div>
	);
}

export default App;