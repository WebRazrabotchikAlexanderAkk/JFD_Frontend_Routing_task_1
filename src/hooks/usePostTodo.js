import { useState } from 'react';
import { TODOS_URL } from './constants';

export const usePostTodo = () => {
	const [isCreating, setIsCreating] = useState(false);

	const postTodo = (todo) => {
		setIsCreating(true);

		return fetch(TODOS_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(todo),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Не удалось добавить дело');
				}

				return response.json();
			})
			.finally(() => setIsCreating(false));
	};

	return { postTodo, isCreating };
};
