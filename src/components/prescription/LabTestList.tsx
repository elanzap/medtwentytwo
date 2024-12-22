import React from 'react';

interface LabTestListProps {
  labTests: string[];
}

export const LabTestList: React.FC<LabTestListProps> = ({ labTests }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Recommended Lab Tests</h3>
      <ul className="list-disc pl-5 space-y-2">
        {labTests.map((test, index) => (
          <li key={index} className="text-sm text-gray-700">{test}</li>
        ))}
      </ul>
    </div>
  );
};
