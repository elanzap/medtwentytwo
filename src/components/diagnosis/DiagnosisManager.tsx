import React, { useState } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { DiagnosisTemplateForm } from './DiagnosisTemplateForm';

export const DiagnosisManager: React.FC = () => {
  const { diagnosisTemplates, deleteDiagnosisTemplate } = useDiagnosisStore();
  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      deleteDiagnosisTemplate(id);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTemplate(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Diagnosis Templates</h3>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Template
          </button>
        </div>

        <div className="space-y-4">
          {diagnosisTemplates.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-sm text-gray-500">No templates added yet</div>
              <button
                onClick={() => setShowForm(true)}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Template
              </button>
            </div>
          ) : (
            diagnosisTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-gray-900">{template.name}</h4>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setEditingTemplate(template.id)}
                      className="text-indigo-600 hover:text-indigo-900"
                      title="Edit template"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-600 hover:text-red-900"
                      title="Delete template"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {template.medications.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700">Medications:</h5>
                    <ul className="mt-1 space-y-1">
                      {template.medications.map((med, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          {med.name} - {med.dosage} ({med.interval} for {med.duration})
                          {med.instructions && (
                            <div className="ml-4 text-xs text-gray-500">
                              Instructions: {med.instructions}
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {template.labTests.length > 0 && (
                  <div className="mt-2">
                    <h5 className="text-xs font-medium text-gray-700">Lab Tests:</h5>
                    <ul className="mt-1 list-disc list-inside">
                      {template.labTests.map((test, index) => (
                        <li key={index} className="text-sm text-gray-600">{test}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {(showForm || editingTemplate) && (
        <DiagnosisTemplateForm
          templateId={editingTemplate}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};
