import { useEffect, useState } from 'react';
import { TODOS_URL } from './constants';

export const useGetTodos = () => {
	const [todos, setTodos] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState('');

	useEffect(() => {
		let shouldSetState = true;

		fetch(TODOS_URL)
			.then((response) => {
				if (!response.ok) {
					throw new Error('Не удалось загрузить список дел');
				}

				return response.json();
			})
			.then((loadedTodos) => {
				if (shouldSetState) {
					setTodos(loadedTodos);
				}
			})
			.catch((loadedError) => {
				if (shouldSetState) {
					setError(loadedError.message);
				}
			})
			.finally(() => {
				if (shouldSetState) {
					setIsLoading(false);
				}
			});

		return () => {
			shouldSetState = false;
		};
	}, []);

	return { todos, setTodos, isLoading, error };
};
