import { Navigate, Route, Routes } from 'react-router';
import './App.css';
import { NotFoundPage } from './pages/NotFoundPage';
import { TodoListPage } from './pages/TodoListPage';
import { TodoPage } from './pages/TodoPage';

function App() {
	return (
		<Routes>
			<Route path="/" element={<TodoListPage />} />
			<Route path="/task/:id" element={<TodoPage />} />
			<Route path="/404" element={<NotFoundPage />} />
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	);
}

export default App;
