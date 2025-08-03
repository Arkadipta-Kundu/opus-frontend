import React, { useState, useEffect } from 'react';
import { LogOut, Plus, Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { taskService } from '../services/authService';
import TaskModal from './TaskModal';

const Dashboard = ({ onLogout }) => {
    const [tasks, setTasks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [editingTask, setEditingTask] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            setIsLoading(true);
            const tasksData = await taskService.getTasks();
            setTasks(Array.isArray(tasksData) ? tasksData : []);
            setError('');
        } catch (error) {
            console.error('Failed to load tasks:', error);
            setError('Failed to load tasks. Please try again.');
            setTasks([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateTask = () => {
        setEditingTask(null);
        setShowTaskModal(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setShowTaskModal(true);
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            try {
                await taskService.deleteTask(taskId);
                await loadTasks();
            } catch (error) {
                console.error('Failed to delete task:', error);
                setError('Failed to delete task. Please try again.');
            }
        }
    };

    const handleTaskSaved = async () => {
        setShowTaskModal(false);
        setEditingTask(null);
        await loadTasks();
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'TODO':
                return <AlertCircle size={16} className="status-icon" />;
            case 'IN_PROGRESS':
                return <Clock size={16} className="status-icon" />;
            case 'DONE':
                return <CheckCircle2 size={16} className="status-icon" />;
            default:
                return <AlertCircle size={16} className="status-icon" />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'TODO':
                return 'status-todo';
            case 'IN_PROGRESS':
                return 'status-in-progress';
            case 'DONE':
                return 'status-done';
            default:
                return 'status-todo';
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'No date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'ALL') return true;
        return task.taskStatus === filter;
    });

    const taskStats = {
        total: tasks.length,
        todo: tasks.filter(t => t.taskStatus === 'TODO').length,
        inProgress: tasks.filter(t => t.taskStatus === 'IN_PROGRESS').length,
        done: tasks.filter(t => t.taskStatus === 'DONE').length
    };

    return (
        <div>
            {/* Navigation Header */}
            <div className="nav-header">
                <h1 className="nav-title">📋 Task Manager</h1>
                <button
                    onClick={onLogout}
                    className="btn btn-secondary btn-sm"
                >
                    <LogOut size={16} />
                    Logout
                </button>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Stats Cards */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '1rem',
                    marginBottom: '2rem'
                }}>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Total Tasks</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#111827' }}>
                            {taskStats.total}
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>To Do</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#f59e0b' }}>
                            {taskStats.todo}
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>In Progress</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#3b82f6' }}>
                            {taskStats.inProgress}
                        </p>
                    </div>
                    <div className="card" style={{ textAlign: 'center', padding: '1.5rem' }}>
                        <h3 style={{ margin: '0 0 0.5rem 0', color: '#6b7280' }}>Completed</h3>
                        <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0, color: '#10b981' }}>
                            {taskStats.done}
                        </p>
                    </div>
                </div>

                {/* Tasks Header */}
                <div className="tasks-header">
                    <h2 style={{ margin: 0, color: '#111827' }}>Your Tasks</h2>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        {/* Filter Buttons */}
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {['ALL', 'TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setFilter(status)}
                                    className={`btn btn-sm ${filter === status ? 'btn-primary' : 'btn-secondary'}`}
                                >
                                    {status === 'ALL' ? 'All' : status.replace('_', ' ')}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={handleCreateTask}
                            className="btn btn-primary"
                        >
                            <Plus size={16} />
                            New Task
                        </button>
                    </div>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {/* Loading State */}
                {isLoading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>
                        <p>Loading tasks...</p>
                    </div>
                ) : (
                    /* Tasks List */
                    <div className="tasks-grid">
                        {filteredTasks.length === 0 ? (
                            <div className="empty-state">
                                <Calendar size={64} className="empty-state-icon" />
                                <h3 style={{ marginBottom: '0.5rem' }}>No tasks found</h3>
                                <p>
                                    {filter === 'ALL'
                                        ? "You don't have any tasks yet. Create your first task to get started!"
                                        : `No tasks with status "${filter.replace('_', ' ')}" found.`
                                    }
                                </p>
                                {filter === 'ALL' && (
                                    <button
                                        onClick={handleCreateTask}
                                        className="btn btn-primary"
                                        style={{ marginTop: '1rem' }}
                                    >
                                        <Plus size={16} />
                                        Create Your First Task
                                    </button>
                                )}
                            </div>
                        ) : (
                            filteredTasks.map((task) => (
                                <div key={task.taskId} className="task-item">
                                    <div className="task-content">
                                        <h3 className="task-title">{task.taskTitle}</h3>
                                        {task.taskDesc && (
                                            <p className="task-desc">{task.taskDesc}</p>
                                        )}
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                                            <span className={`task-status ${getStatusClass(task.taskStatus)}`}>
                                                {getStatusIcon(task.taskStatus)}
                                                {task.taskStatus.replace('_', ' ')}
                                            </span>
                                            {task.date && (
                                                <span style={{ fontSize: '0.875rem', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                                    <Calendar size={14} />
                                                    {formatDate(task.date)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="task-actions">
                                        <button
                                            onClick={() => handleEditTask(task)}
                                            className="btn btn-secondary btn-sm"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDeleteTask(task.taskId)}
                                            className="btn btn-danger btn-sm"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Task Modal */}
            {showTaskModal && (
                <TaskModal
                    task={editingTask}
                    onSave={handleTaskSaved}
                    onCancel={() => {
                        setShowTaskModal(false);
                        setEditingTask(null);
                    }}
                />
            )}
        </div>
    );
};

export default Dashboard;
