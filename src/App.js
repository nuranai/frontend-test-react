import React, { useState, useEffect } from 'react';
// import ReactPaginate from 'react-paginate';
import './App.css';

function App() {
	const [data, setData] = useState([]);
	// const [sortColoumn, setSortColoumn] = useState(null);
	const [sortConfig, setSortConfig] = useState({key : null, direction : null});

	useEffect(() => {
		async function getData() {
			let res = await fetch('http://www.filltext.com?rows=10&uName={username}&id={index}&fName={firstName}');
			let json = await res.json();
			setData(json);
		}
		getData();
	}, []);

	function requestSort(key) {
		let direction = 'ascending';
		if (sortConfig.key === key && sortConfig.direction === 'ascending') {
			direction = 'descending';
		}
		setSortConfig({ key, direction });
		// sortBy();
	}

	useEffect(() => {
		sortBy();
	}, [sortConfig]);

	function sortBy() {
		let sortedProducts = [...data];
		sortedProducts.sort((a, b) => {
			if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === 'ascending' ? -1 : 1;
			if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === 'ascending' ? 1 : -1;
			return 0;

			// return b[e] - a[e];
		});
		setData(sortedProducts);
	}

	return (
		<table>
			<thead>
				<tr>
					<th 
						onClick={() => requestSort('id')}
						
						>id</th>
					<th 
						onClick={() => requestSort('uName')}
						
						>username</th>
					<th 
						onClick={() => requestSort('fName')}
						
						>First name</th>
				</tr>
			</thead>
			<tbody>
				{
					data.length
						? data.map((d, i) => (
							<tr key={i}>
								<td>{d.id}</td>
								<td>{d.uName}</td>
								<td>{d.fName}</td>
							</tr>
						))
						: <tr><td><h6>Loading...</h6></td></tr>
				}
			</tbody>
		</table>
	);

}

export default App;