import { Router } from 'express';
import TodoController from '../controllers/todoController';
import { 
  validateCreateTodo, 
  validateUpdateTodo, 
  validateTodoId 
} from '../middleware/validation';

const router = Router();

// GET /api/todos - 获取所有待办事项
router.get('/', TodoController.getAllTodos);

// GET /api/todos/stats - 获取统计信息
router.get('/stats', TodoController.getStats);

// GET /api/todos/:id - 根据ID获取待办事项
router.get('/:id', validateTodoId, TodoController.getTodoById);

// POST /api/todos - 创建新待办事项
router.post('/', validateCreateTodo, TodoController.createTodo);

// PUT /api/todos/:id - 更新待办事项
router.put('/:id', validateTodoId, validateUpdateTodo, TodoController.updateTodo);

// PATCH /api/todos/:id/toggle - 切换完成状态
router.patch('/:id/toggle', validateTodoId, TodoController.toggleTodo);

// DELETE /api/todos/:id - 删除待办事项
router.delete('/:id', validateTodoId, TodoController.deleteTodo);

export default router;