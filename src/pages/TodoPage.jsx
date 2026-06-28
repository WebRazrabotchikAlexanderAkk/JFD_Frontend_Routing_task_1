import { useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';
import { useDeleteTodo } from '../hooks/useDeleteTodo';
import { useGetTodo } from '../hooks/useGetTodo';
import { usePutTodo } from '../hooks/usePutTodo';

export const TodoPage = () => {
	const { id } = useParams();
	const location = useLocation();
	const navigate = useNavigate();

	const { todo, setTodo, isLoading, error, isNotFound } = useGetTodo(id);
	const { putTodo, isUpdating } = usePutTodo();
	const { deleteTodo, isDeleting } = useDeleteTodo();

	const [editingTodo, setEditingTodo] = useState({ id: null, title: '' });
	const [actionError, setActionError] = useState('');

	if (isNotFound) {
		return <Navigate to="/404" replace />;
	}

	const editingTodoTitle =
		editingTodo.id === todo?.id ? editingTodo.title : (todo?.title ?? '');

	const handleBack = () => {
		if (location.state?.fromList) {
			navigate(-1);
			return;
		}

		navigate('/');
	};

	const handleSaveTodo = (event) => {
		event.preventDefault();

		const trimmedTitle = editingTodoTitle.trim();

		if (!todo || !trimmedTitle) {
			return;
		}

		setActionError('');

		putTodo({ ...todo, title: trimmedTitle })
			.then((updatedTodo) => {
				setTodo(updatedTodo);
				setEditingTodo({ id: updatedTodo.id, title: updatedTodo.title });
			})
			.catch((updateError) => setActionError(updateError.message));
	};

	const handleToggleTodo = () => {
		if (!todo) {
			return;
		}

		setActionError('');

		putTodo({ ...todo, completed: !todo.completed })
			.then(setTodo)
			.catch((updateError) => setActionError(updateError.message));
	};

	const handleDeleteTodo = () => {
		if (!todo) {
			return;
		}

		setActionError('');

		deleteTodo(todo.id)
			.then(() => navigate('/', { replace: true }))
			.catch((deleteError) => setActionError(deleteError.message));
	};

	return (
		<>
			<title>Задача</title>
			<main className="todo-page">
			<section className="todo-panel todo-detail-panel">
				<button className="todo-button todo-button-secondary" type="button" onClick={handleBack}>
					Назад
				</button>

				<p className="todo-kicker">Задача</p>
				<h1>Описание дела</h1>

				{(error || actionError) && (
					<p className="todo-message todo-message-error">{error || actionError}</p>
				)}

				{isLoading ? (
					<p className="todo-message">Загрузка...</p>
				) : (
					todo && (
						<>
							<p className={`todo-detail-text ${todo.completed ? 'todo-detail-completed' : ''}`}>
								{todo.title}
							</p>

							<label className="todo-checkbox-label todo-detail-status">
								<input
									className="todo-checkbox"
									type="checkbox"
									checked={todo.completed}
									disabled={isUpdating || isDeleting}
									onChange={handleToggleTodo}
								/>
								<span>{todo.completed ? 'Завершено' : 'В работе'}</span>
							</label>

							<form className="todo-edit-form" onSubmit={handleSaveTodo}>
								<input
									className="todo-input"
									type="text"
									value={editingTodoTitle}
									disabled={isDeleting}
									onChange={({ target }) =>
										setEditingTodo({ id: todo.id, title: target.value })
									}
								/>
								<div className="todo-actions todo-detail-actions">
									<button
										className="todo-button"
										type="submit"
										disabled={isUpdating || isDeleting || !editingTodoTitle.trim()}
									>
										Сохранить
									</button>
									<button
										className="todo-button todo-button-danger"
										type="button"
										disabled={isUpdating || isDeleting}
										onClick={handleDeleteTodo}
									>
										Удалить
									</button>
								</div>
							</form>
						</>
					)
				)}
			</section>
			</main>
		</>
	);
};
