import { useState } from 'react';
import { Link } from 'react-router';
import { useDebounce } from '../hooks/useDebounce';
import { useGetTodos } from '../hooks/useGetTodos';
import { usePostTodo } from '../hooks/usePostTodo';

const getVisibleTodos = (todos, searchPhrase, isAlphabetSortEnabled) => {
	const normalizedSearchPhrase = searchPhrase.trim().toLowerCase();
	const filteredTodos = normalizedSearchPhrase
		? todos.filter(({ title }) => title.toLowerCase().includes(normalizedSearchPhrase))
		: todos;

	if (!isAlphabetSortEnabled) {
		return filteredTodos;
	}

	return [...filteredTodos].sort((a, b) =>
		a.title.localeCompare(b.title, ['ru', 'en'], {
			numeric: true,
		}),
	);
};

export const TodoListPage = () => {
	const { todos, setTodos, isLoading, error } = useGetTodos();
	const { postTodo, isCreating } = usePostTodo();

	const [newTodoTitle, setNewTodoTitle] = useState('');
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isAlphabetSortEnabled, setIsAlphabetSortEnabled] = useState(false);
	const [actionError, setActionError] = useState('');

	const debouncedSearchPhrase = useDebounce(searchPhrase, 500);
	const visibleTodos = getVisibleTodos(
		todos,
		debouncedSearchPhrase,
		isAlphabetSortEnabled,
	);

	const handleCreateTodo = (event) => {
		event.preventDefault();

		const trimmedTitle = newTodoTitle.trim();

		if (!trimmedTitle) {
			return;
		}

		setActionError('');

		postTodo({ title: trimmedTitle, completed: false })
			.then((createdTodo) => {
				setTodos((currentTodos) => [...currentTodos, createdTodo]);
				setNewTodoTitle('');
			})
			.catch((createError) => setActionError(createError.message));
	};

	return (
		<>
			<title>Список дел</title>
			<main className="todo-page">
			<section className="todo-panel">
				<p className="todo-kicker">JSON Server - React Router</p>
				<h1>Todo List</h1>

				<form className="todo-form" onSubmit={handleCreateTodo}>
					<input
						className="todo-input"
						type="text"
						value={newTodoTitle}
						placeholder="Новое дело"
						onChange={({ target }) => setNewTodoTitle(target.value)}
					/>
					<button
						className="todo-button"
						type="submit"
						disabled={isCreating || !newTodoTitle.trim()}
					>
						Добавить
					</button>
				</form>

				<div className="todo-toolbar">
					<input
						className="todo-input"
						type="search"
						value={searchPhrase}
						placeholder="Поиск по делам"
						onChange={({ target }) => setSearchPhrase(target.value)}
					/>
					<button
						className={`todo-button todo-button-secondary ${
							isAlphabetSortEnabled ? 'todo-button-active' : ''
						}`}
						type="button"
						onClick={() =>
							setIsAlphabetSortEnabled((currentSortState) => !currentSortState)
						}
					>
						А-Я
					</button>
				</div>

				{(error || actionError) && (
					<p className="todo-message todo-message-error">{error || actionError}</p>
				)}

				{isLoading ? (
					<p className="todo-message">Загрузка...</p>
				) : (
					<>
						{visibleTodos.length === 0 ? (
							<p className="todo-message">
								{todos.length === 0 ? 'Список дел пуст' : 'Дела по запросу не найдены'}
							</p>
						) : (
							<ul className="todo-list">
								{visibleTodos.map((todo, index) => (
									<li
										className={`todo-item ${todo.completed ? 'todo-item-completed' : ''}`}
										key={todo.id}
									>
										<span className="todo-number">{index + 1}</span>
										<span className="todo-status">
											{todo.completed ? 'Завершено' : 'В работе'}
										</span>
										<Link
											className="todo-link"
											to={`/task/${todo.id}`}
											state={{ fromList: true }}
										>
											{todo.title}
										</Link>
									</li>
								))}
							</ul>
						)}
					</>
				)}
			</section>
			</main>
		</>
	);
};
