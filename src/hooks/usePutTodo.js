import { useState } from 'react';
import { TODOS_URL } from './constants';

export const usePutTodo = () => {
	const [isUpdating, setIsUpdating] = useState(false);

	const putTodo = (todo) => {
		setIsUpdating(true);

		return fetch(`${TODOS_URL}/${todo.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(todo),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Не удалось обновить дело');
				}

				return response.json();
			})
			.finally(() => setIsUpdating(false));
	};

	return { putTodo, isUpdating };
};
