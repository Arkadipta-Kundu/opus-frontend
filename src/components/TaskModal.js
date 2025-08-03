import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { taskService } from '../services/authService';

const TaskModal = ({ task, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        taskTitle: '',
        taskDesc: '',
        taskStatus: 'TODO',
        date: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (task) {
            setFormData({
                taskTitle: task.taskTitle || '',
                taskDesc: task.taskDesc || '',
                taskStatus: task.taskStatus || 'TODO',
                date: task.date ? new Date(task.date).toISOString().slice(0, 16) : ''
            });
        }
    }, [task]);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        if (!formData.taskTitle.trim()) {
            setError('Task title is required');
            setIsLoading(false);
            return;
        }

        try {
            const taskData = {
                taskTitle: formData.taskTitle.trim(),
                taskDesc: formData.taskDesc.trim(),
                taskStatus: formData.taskStatus,
                date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString()
            };

            if (task) {
                // Update existing task
                await taskService.updateTask(task.taskId, taskData);
            } else {
                // Create new task
                await taskService.createTask(taskData);
            }

            onSave();
        } catch (error) {
            console.error('Failed to save task:', error);
            setError(error.response?.data?.message || 'Failed to save task. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                <div className="modal-header">
                    <h2 className="modal-title">
                        {task ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button
                        onClick={onCancel}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '0.5rem',
                            color: '#6b7280'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="taskTitle">Task Title *</label>
                        <input
                            type="text"
                            id="taskTitle"
                            name="taskTitle"
                            value={formData.taskTitle}
                            onChange={handleInputChange}
                            placeholder="Enter task title"
                            required
                            maxLength="100"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="taskDesc">Description</label>
                        <textarea
                            id="taskDesc"
                            name="taskDesc"
                            value={formData.taskDesc}
                            onChange={handleInputChange}
                            placeholder="Enter task description (optional)"
                            rows="3"
                            maxLength="500"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="taskStatus">Status</label>
                        <select
                            id="taskStatus"
                            name="taskStatus"
                            value={formData.taskStatus}
                            onChange={handleInputChange}
                        >
                            <option value="TODO">To Do</option>
                            <option value="IN_PROGRESS">In Progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="input-group">
                        <label htmlFor="date">Due Date & Time</label>
                        <input
                            type="datetime-local"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="btn btn-secondary"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading}
                        >
                            <Save size={16} />
                            {isLoading
                                ? (task ? 'Updating...' : 'Creating...')
                                : (task ? 'Update Task' : 'Create Task')
                            }
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TaskModal;
