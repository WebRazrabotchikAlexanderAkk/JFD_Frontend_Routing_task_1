import { useState } from 'react';
import './App.css';
import { useDebounce } from './hooks/useDebounce';
import { useDeleteTodo } from './hooks/useDeleteTodo';
import { useGetTodos } from './hooks/useGetTodos';
import { usePostTodo } from './hooks/usePostTodo';
import { usePutTodo } from './hooks/usePutTodo';

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

function App() {
	const { todos, setTodos, isLoading, error } = useGetTodos();
	const { postTodo, isCreating } = usePostTodo();
	const { putTodo, isUpdating } = usePutTodo();
	const { deleteTodo, isDeleting } = useDeleteTodo();

	const [newTodoTitle, setNewTodoTitle] = useState('');
	const [editingTodoId, setEditingTodoId] = useState(null);
	const [editingTodoTitle, setEditingTodoTitle] = useState('');
	const [searchPhrase, setSearchPhrase] = useState('');
	const [isAlphabetSortEnabled, setIsAlphabetSortEnabled] = useState(false);
	const [actionError, setActionError] = useState('');

	const debouncedSearchPhrase = useDebounce(searchPhrase, 500);
	const visibleTodos = getVisibleTodos(
		todos,
		debouncedSearchPhrase,
		isAlphabetSortEnabled,
	);

	const isActionInProgress = isCreating || isUpdating || isDeleting;

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

	const handleStartEdit = (todo) => {
		setEditingTodoId(todo.id);
		setEditingTodoTitle(todo.title);
		setActionError('');
	};

	const handleCancelEdit = () => {
		setEditingTodoId(null);
		setEditingTodoTitle('');
	};

	const updateTodoInState = (updatedTodo) => {
		setTodos((currentTodos) =>
			currentTodos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo)),
		);
	};

	const handleSaveTodo = (todo) => {
		const trimmedTitle = editingTodoTitle.trim();

		if (!trimmedTitle) {
			return;
		}

		setActionError('');

		putTodo({ ...todo, title: trimmedTitle })
			.then((updatedTodo) => {
				updateTodoInState(updatedTodo);
				handleCancelEdit();
			})
			.catch((updateError) => setActionError(updateError.message));
	};

	const handleToggleTodo = (todo) => {
		setActionError('');

		putTodo({ ...todo, completed: !todo.completed })
			.then(updateTodoInState)
			.catch((updateError) => setActionError(updateError.message));
	};

	const handleDeleteTodo = (id) => {
		setActionError('');

		deleteTodo(id)
			.then(() => {
				setTodos((currentTodos) => currentTodos.filter((todo) => todo.id !== id));
			})
			.catch((deleteError) => setActionError(deleteError.message));
	};

	return (
		<main className="todo-page">
			<section className="todo-panel">
				<p className="todo-kicker">JSON Server</p>
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
										<label className="todo-checkbox-label">
											<input
												className="todo-checkbox"
												type="checkbox"
												checked={todo.completed}
												disabled={isActionInProgress}
												onChange={() => handleToggleTodo(todo)}
											/>
											<span className="todo-status">
												{todo.completed ? 'Завершено' : 'В работе'}
											</span>
										</label>

										{editingTodoId === todo.id ? (
											<input
												className="todo-input todo-edit-input"
												type="text"
												value={editingTodoTitle}
												onChange={({ target }) => setEditingTodoTitle(target.value)}
											/>
										) : (
											<span className="todo-text">{todo.title}</span>
										)}

										<div className="todo-actions">
											{editingTodoId === todo.id ? (
												<>
													<button
														className="todo-button todo-button-small"
														type="button"
														disabled={isUpdating || !editingTodoTitle.trim()}
														onClick={() => handleSaveTodo(todo)}
													>
														Сохранить
													</button>
													<button
														className="todo-button todo-button-secondary todo-button-small"
														type="button"
														disabled={isUpdating}
														onClick={handleCancelEdit}
													>
														Отмена
													</button>
												</>
											) : (
												<>
													<button
														className="todo-button todo-button-secondary todo-button-small"
														type="button"
														disabled={isActionInProgress}
														onClick={() => handleStartEdit(todo)}
													>
														Изменить
													</button>
													<button
														className="todo-button todo-button-danger todo-button-small"
														type="button"
														disabled={isActionInProgress}
														onClick={() => handleDeleteTodo(todo.id)}
													>
														Удалить
													</button>
												</>
											)}
										</div>
									</li>
								))}
							</ul>
						)}
					</>
				)}
			</section>
		</main>
	);
}

export default App;
