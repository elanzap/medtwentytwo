import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search } from 'lucide-react';
import { useDrugStore } from '../../stores/drugStore';
import { DrugForm } from './DrugForm';
import type { Drug } from '../../types';

export const DrugList: React.FC = () => {
  const { drugs, addDrug, updateDrug, deleteDrug } = useDrugStore();
  const [showForm, setShowForm] = useState(false);
  const [editingDrug, setEditingDrug] = useState<Drug | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredDrugs = drugs.filter(drug =>
    drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    drug.genericName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (drugData: Omit<Drug, 'id'>) => {
    if (editingDrug) {
      updateDrug(editingDrug.id, drugData);
    } else {
      addDrug(drugData);
    }
    setShowForm(false);
    setEditingDrug(null);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this drug?')) {
      deleteDrug(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="relative flex-1 mr-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search drugs..."
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Drug
        </button>
      </div>

      {/* Drug List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Strength
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Generic Name
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDrugs.map((drug) => (
              <tr key={drug.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {drug.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.strength}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {drug.genericName || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => {
                      setEditingDrug(drug);
                      setShowForm(true);
                    }}
                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(drug.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Drug Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingDrug ? 'Edit Drug' : 'Add New Drug'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingDrug(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DrugForm
                initialData={editingDrug || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingDrug(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
