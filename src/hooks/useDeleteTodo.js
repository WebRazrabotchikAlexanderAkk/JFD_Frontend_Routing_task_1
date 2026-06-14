import { useState } from 'react';
import { TODOS_URL } from './constants';

export const useDeleteTodo = () => {
	const [isDeleting, setIsDeleting] = useState(false);

	const deleteTodo = (id) => {
		setIsDeleting(true);

		return fetch(`${TODOS_URL}/${id}`, {
			method: 'DELETE',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Не удалось удалить дело');
				}
			})
			.finally(() => setIsDeleting(false));
	};

	return { deleteTodo, isDeleting };
};
