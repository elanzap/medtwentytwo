import React from 'react';
import { Printer, Save } from 'lucide-react';
import type { Prescription } from '../../types';
import { generatePrescriptionPDF } from '../../utils/pdfGenerator';

interface PrescriptionActionsProps {
  prescription: Partial<Prescription>;
  onSave: (prescription: Partial<Prescription>) => void;
}

export const PrescriptionActions: React.FC<PrescriptionActionsProps> = ({
  prescription,
  onSave,
}) => {
  const handleSave = async () => {
    try {
      await generatePrescriptionPDF(prescription);
      onSave(prescription);
      alert('Prescription saved successfully!');
    } catch (error) {
      console.error('Error saving prescription:', error);
      alert('Error saving prescription. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex justify-end space-x-4">
      <button
        type="button"
        onClick={handlePrint}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Printer className="h-4 w-4 mr-2" />
        Print
      </button>
      <button
        type="button"
        onClick={handleSave}
        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Save className="h-4 w-4 mr-2" />
        Save
      </button>
    </div>
  );
};
