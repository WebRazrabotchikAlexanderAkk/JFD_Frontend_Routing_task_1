import { Link } from 'react-router';

export const NotFoundPage = () => (
	<>
		<title>Страница не найдена</title>
		<main className="todo-page">
		<section className="todo-panel todo-not-found">
			<p className="todo-kicker">404</p>
			<h1>Страница не найдена</h1>
			<p className="todo-message">Адрес не существует или задача была удалена.</p>
			<Link className="todo-button todo-home-link" to="/">
				На главную
			</Link>
		</section>
		</main>
	</>
);
