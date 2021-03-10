import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';
import './App.css';

function Table(props) {
	const [data, setData] = useState([...props.dataCurrent]);
	const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
	
	function classSetter(name) {
		if (!sortConfig) {
			return;
		}
		return sortConfig.key === name ? sortConfig.direction : undefined;
	}

	function requestSort(key) {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
	}

	useEffect(() => {
		setData(props.dataCurrent);
		setSortConfig({ key: null, direction: null });
	}, [props.dataCurrent]);

	useEffect(() => {
		sortBy();
	}, [sortConfig]);

	function sortBy() {
		let sortedProducts = [...data];
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
					data.length
						? data.map((d) => (
							d.show ?
								<tr key={d.id}>
									<td>{d.index + 1}</td>
									<td>{d.fName}</td>
									<td>{d.sName}</td>
								</tr>
								: null
						))
						: <tr><td><h6>Loading...</h6></td></tr>
				}
			</tbody>
		</table>);
}

function App() {
	const [data, setData] = useState([]);
	const [pageCount, setPageCount] = useState(0);
	const perPage = 50;
	const [pageIndexes, setPageIndexes] = useState({ start: 0, end: 50 });

	useEffect(() => {
		async function getData() {
			let res = await fetch('https://next.json-generator.com/api/json/get/Ek5OUQ3M5');
			let json = await res.json();
			setData(json);
			setPageCount(json.length / 50);
		}
		getData();
	}, []);

	function handlePageChange(e) {
		let elementStart = e.selected * perPage;
		setPageIndexes({ start: elementStart, end: elementStart + perPage });
	}

	function filterTable(e) {
		console.log(e.target.value);
	}
	return (
		<div>
			{
				data.length
					? (<><input type="text" onChange={filterTable} />
						<Table dataCurrent={data.slice(pageIndexes.start, pageIndexes.end)}></Table>
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
					: <p>Loading...</p>
			}
		</div>
	);

}

export default App;