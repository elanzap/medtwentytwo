import React, { useState } from 'react';
import { Plus, Pencil, Trash2, Search, TestTubes } from 'lucide-react';
import type { DiagnosticTest } from '../../types';
import { DiagnosticTestForm } from './DiagnosticTestForm';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';

export const DiagnosticTestList: React.FC = () => {
  const { tests, addTest, updateTest, deleteTest } = useDiagnosticTestStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTest, setEditingTest] = useState<DiagnosticTest | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTests = tests.filter(test =>
    test.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmit = (testData: Omit<DiagnosticTest, 'id'>) => {
    if (editingTest) {
      updateTest(editingTest.id, testData);
    } else {
      addTest(testData);
    }
    setShowForm(false);
    setEditingTest(null);
  };

  const handleEdit = (test: DiagnosticTest) => {
    setEditingTest(test);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this test?')) {
      deleteTest(id);
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
            placeholder="Search diagnostic tests..."
          />
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Test
        </button>
      </div>

      {/* Test List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        {filteredTests.length === 0 ? (
          <div className="text-center py-12">
            <TestTubes className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No diagnostic tests</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by adding a new diagnostic test.
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Test
              </button>
            </div>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Test Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredTests.map((test) => (
                <tr key={test.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {test.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${test.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(test)}
                      className="text-indigo-600 hover:text-indigo-900 mr-4"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(test.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add/Edit Test Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {editingTest ? 'Edit Diagnostic Test' : 'Add New Diagnostic Test'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false);
                    setEditingTest(null);
                  }}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <span className="sr-only">Close</span>
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <DiagnosticTestForm
                initialData={editingTest || undefined}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingTest(null);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
