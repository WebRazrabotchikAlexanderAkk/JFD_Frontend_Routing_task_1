import { useEffect, useState } from 'react';
import { TODOS_URL } from './constants';

export const useGetTodo = (id) => {
	const [todoState, setTodoState] = useState({
		id: null,
		todo: null,
		isLoading: true,
		error: '',
		isNotFound: false,
	});

	useEffect(() => {
		let shouldSetState = true;

		fetch(`${TODOS_URL}/${id}`)
			.then((response) => {
				if (response.status === 404) {
					throw new Error('NOT_FOUND');
				}

				if (!response.ok) {
					throw new Error('Не удалось загрузить дело');
				}

				return response.json();
			})
			.then((loadedTodo) => {
				if (shouldSetState) {
					setTodoState({
						id,
						todo: loadedTodo,
						isLoading: false,
						error: '',
						isNotFound: false,
					});
				}
			})
			.catch((loadedError) => {
				if (!shouldSetState) {
					return;
				}

				if (loadedError.message === 'NOT_FOUND') {
					setTodoState({
						id,
						todo: null,
						isLoading: false,
						error: '',
						isNotFound: true,
					});
					return;
				}

				setTodoState({
					id,
					todo: null,
					isLoading: false,
					error: loadedError.message,
					isNotFound: false,
				});
			});

		return () => {
			shouldSetState = false;
		};
	}, [id]);

	const isCurrentTodo = todoState.id === id;

	const setTodo = (todo) =>
		setTodoState({
			id,
			todo,
			isLoading: false,
			error: '',
			isNotFound: false,
		});

	return {
		todo: isCurrentTodo ? todoState.todo : null,
		setTodo,
		isLoading: !isCurrentTodo || todoState.isLoading,
		error: isCurrentTodo ? todoState.error : '',
		isNotFound: isCurrentTodo ? todoState.isNotFound : false,
	};
};
