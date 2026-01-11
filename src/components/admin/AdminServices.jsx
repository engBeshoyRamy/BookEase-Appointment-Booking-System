import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, DollarSign, ToggleLeft, ToggleRight } from 'lucide-react';
import { Modal } from '../shared/Modal';
import { LoadingSpinner } from '../shared/LoadingSpinner';
import { useServices } from '../../hooks/useServices';
import { useApp } from '../../context/AppContext';
import { validateService } from '../../utils/validators';

export const AdminServices = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    category: '',
    isActive: true,
  });
  const [errors, setErrors] = useState({});

  const { services, loading, addService, updateService, deleteService, toggleServiceActive } = useServices();
  const { addToast } = useApp();

  const handleOpenModal = (service) => {
    if (service) {
      setEditingService(service);
      setFormData({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: service.isActive,
      });
    } else {
      setEditingService(null);
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: '',
        isActive: true,
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const validationErrors = validateService(formData);
    if (validationErrors.length > 0) {
      const errorMap = {};
      validationErrors.forEach(err => {
        errorMap[err.field] = err.message;
      });
      setErrors(errorMap);
      return;
    }

    let success = false;
    if (editingService) {
      success = await updateService(editingService.id, formData);
    } else {
      success = !!(await addService(formData));
    }

    if (success) {
      addToast(`Service ${editingService ? 'updated' : 'added'} successfully`, 'success');
      setShowModal(false);
    } else {
      addToast(`Failed to ${editingService ? 'update' : 'add'} service`, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      const success = await deleteService(id);
      if (success) {
        addToast('Service deleted successfully', 'success');
      } else {
        addToast('Failed to delete service', 'error');
      }
    }
  };

  const handleToggleActive = async (id) => {
    const success = await toggleServiceActive(id);
    if (success) {
      addToast('Service status updated', 'success');
    } else {
      addToast('Failed to update service status', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" text="Loading services..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Services</h1>
          <p className="text-gray-600">Add, edit, or remove available services</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Add Service
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                <p className="text-sm text-gray-500">{service.category}</p>
              </div>
              <button
                onClick={() => handleToggleActive(service.id)}
                className="text-gray-400 hover:text-gray-600"
              >
                {service.isActive ? (
                  <ToggleRight className="w-8 h-8 text-green-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{service.description}</p>

            <div className="flex items-center gap-4 mb-4 text-sm">
              <div className="flex items-center gap-1 text-gray-700">
                <Clock className="w-4 h-4" />
                <span>{service.duration} min</span>
              </div>
              <div className="flex items-center gap-1 font-semibold text-blue-600">
                <DollarSign className="w-4 h-4" />
                <span>${service.price}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleOpenModal(service)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDelete(service.id)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingService ? 'Edit Service' : 'Add New Service'}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Service Name *</label>
            <input
              type="text"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes) *</label>
              <input
                type="number"
                value={formData.duration}
                onChange={e => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })}
                min="15"
                step="15"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input
                type="number"
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
            <input
              type="text"
              value={formData.category}
              onChange={e => setFormData({ ...formData, category: e.target.value })}
              className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none focus:border-blue-600 ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive}
              onChange={e => setFormData({ ...formData, isActive: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="isActive" className="text-sm font-medium text-gray-700">
              Active (available for booking)
            </label>
          </div>

          <div className="flex gap-3 justify-end pt-4">
            <button
              onClick={() => setShowModal(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              {editingService ? 'Update' : 'Add'} Service
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};