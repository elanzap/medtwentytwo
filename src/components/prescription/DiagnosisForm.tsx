import React from 'react';
import { X } from 'lucide-react';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import type { DiagnosisTemplate } from '../../types';

interface DiagnosisFormProps {
  value: string[];
  onChange: (diagnoses: string[]) => void;
  onTemplateSelect?: (template: DiagnosisTemplate) => void;
}

export const DiagnosisForm: React.FC<DiagnosisFormProps> = ({ 
  value, 
  onChange,
  onTemplateSelect 
}) => {
  const [selectedDiagnosis, setSelectedDiagnosis] = React.useState('');
  const { diagnoses, diagnosisTemplates } = useDiagnosisStore();

  const handleAdd = () => {
    if (!selectedDiagnosis) return;

    // Check if a template was selected
    const selectedTemplate = diagnosisTemplates.find(t => t.id === selectedDiagnosis);
    
    if (selectedTemplate) {
      // If it's a template, add the template name and trigger template selection
      if (!value.includes(selectedTemplate.name)) {
        onChange([...value, selectedTemplate.name]);
        if (onTemplateSelect) {
          onTemplateSelect(selectedTemplate);
        }
      }
    } else {
      // If it's a regular diagnosis, just add it
      if (!value.includes(selectedDiagnosis)) {
        onChange([...value, selectedDiagnosis]);
      }
    }
    setSelectedDiagnosis('');
  };

  const handleRemove = (diagnosisToRemove: string) => {
    onChange(value.filter(d => d !== diagnosisToRemove));
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-gray-700">
        Diagnoses
      </label>
      
      <div className="flex gap-2">
        <select
          value={selectedDiagnosis}
          onChange={(e) => setSelectedDiagnosis(e.target.value)}
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select diagnosis...</option>
          {diagnosisTemplates.length > 0 && (
            <optgroup label="Templates">
              {diagnosisTemplates
                .filter(template => !value.includes(template.name))
                .map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.name} (Template)
                  </option>
                ))}
            </optgroup>
          )}
          <optgroup label="Standard Diagnoses">
            {diagnoses
              .filter(diagnosis => !value.includes(diagnosis))
              .map((diagnosis) => (
                <option key={diagnosis} value={diagnosis}>
                  {diagnosis}
                </option>
              ))}
          </optgroup>
        </select>
        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedDiagnosis}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>

      {value.length > 0 && (
        <div className="mt-3">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Selected Diagnoses:</h4>
          <div className="flex flex-wrap gap-2">
            {value.map((diagnosis) => (
              <span
                key={diagnosis}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {diagnosis}
                {diagnosisTemplates.some(t => t.name === diagnosis) && (
                  <span className="ml-1 text-xs bg-indigo-200 px-1 rounded">Template</span>
                )}
                <button
                  type="button"
                  onClick={() => handleRemove(diagnosis)}
                  className="ml-2 inline-flex items-center p-0.5 rounded-full text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
