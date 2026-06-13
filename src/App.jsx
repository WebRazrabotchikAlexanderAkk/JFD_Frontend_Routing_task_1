import { useEffect, useState } from 'react';
import './App.css';

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=1';

function App() {
	const [todos, setTodos] = useState([]);

	useEffect(() => {
		fetch(TODOS_URL)
			.then((response) => response.json())
			.then((loadedTodos) => setTodos(loadedTodos));
	}, []);

	return (
		<main className="todo-page">
			<section className="todo-panel">
				<p className="todo-kicker">JSON Placeholder</p>
				<h1>Todo List</h1>

				<ul className="todo-list">
					{todos.map((todo, index) => (
						<li className="todo-item" key={todo.id}>
							<span className="todo-number">{index + 1}</span>
							<span className="todo-text">{todo.title}</span>
						</li>
					))}
				</ul>
			</section>
		</main>
	);
}

export default App;
