import React, { useState, useEffect, useRef } from 'react';
import { Search, Printer, Plus, X, List } from 'lucide-react';
import type { Prescription, LabInvoice } from '../../types';
import { useDiagnosticTestStore } from '../../stores/diagnosticTestStore';
import { useLabInvoiceStore } from '../../stores/labInvoiceStore';
import { LabInvoiceList } from './LabInvoiceList';

interface LabOrderInvoiceProps {
  prescriptions: Prescription[];
}

export const LabOrderInvoice: React.FC<LabOrderInvoiceProps> = ({ prescriptions }) => {
  const [view, setView] = useState<'list' | 'search' | 'create'>('list');
  const [prescriptionId, setPrescriptionId] = useState('');
  const [discount, setDiscount] = useState(0);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [patientName, setPatientName] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const { tests } = useDiagnosticTestStore();
  const { addInvoice } = useLabInvoiceStore();

  const resetForm = () => {
    setPrescriptionId('');
    setDiscount(0);
    setSelectedPrescription(null);
    setShowInvoice(false);
    setSelectedTests([]);
    setPatientName('');
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const filteredTests = tests.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedTests.includes(test.name)
  );

  const handleSearch = () => {
    if (!prescriptionId.trim()) {
      alert('Please enter a Prescription ID');
      return;
    }

    const prescription = prescriptions.find(p => 
      p.prescriptionId.toLowerCase() === prescriptionId.toLowerCase()
    );

    if (prescription && prescription.labTests && prescription.labTests.length > 0) {
      setSelectedPrescription(prescription);
      setShowInvoice(true);
    } else {
      alert('No lab tests found for this prescription ID');
    }
  };

  const handleCreateManualOrder = () => {
    if (!patientName.trim()) {
      alert('Please enter patient name');
      return;
    }
    if (selectedTests.length === 0) {
      alert('Please select at least one test');
      return;
    }

    const manualPrescription: Prescription = {
      prescriptionId: 'M' + Date.now(),
      visitId: 'MV' + Date.now(),
      patientId: 'MP' + Date.now(),
      patientName: patientName.trim(),
      date: new Date().toISOString(),
      labTests: selectedTests
    };

    setSelectedPrescription(manualPrescription);
    setShowInvoice(true);
  };

  const handleTestSelect = (testName: string) => {
    setSelectedTests(prev => [...prev, testName]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleTestRemove = (testName: string) => {
    setSelectedTests(prev => prev.filter(test => test !== testName));
  };

  const getTestPrice = (testName: string): number => {
    const test = tests.find(t => t.name === testName);
    return test?.price || 0;
  };

  const calculateTotal = () => {
    if (!selectedPrescription?.labTests) return 0;
    return selectedPrescription.labTests.reduce((total, test) => {
      return total + getTestPrice(test);
    }, 0);
  };

  const calculateDiscountedTotal = () => {
    const total = calculateTotal();
    const discountAmount = (total * discount) / 100;
    return total - discountAmount;
  };

  const handleSaveAndPrint = async () => {
    if (!selectedPrescription) return;

    const invoice: LabInvoice = {
      id: `INV${Date.now()}`,
      date: new Date().toISOString(),
      prescriptionId: selectedPrescription.prescriptionId,
      patientName: selectedPrescription.patientName,
      tests: selectedPrescription.labTests || [],
      subtotal: calculateTotal(),
      discount,
      total: calculateDiscountedTotal(),
      status: 'printed'
    };

    addInvoice(invoice);
    window.print();
    resetForm();
    setView('list');
  };

  const handleSave = () => {
    if (!selectedPrescription) return;

    const invoice: LabInvoice = {
      id: `INV${Date.now()}`,
      date: new Date().toISOString(),
      prescriptionId: selectedPrescription.prescriptionId,
      patientName: selectedPrescription.patientName,
      tests: selectedPrescription.labTests || [],
      subtotal: calculateTotal(),
      discount,
      total: calculateDiscountedTotal(),
      status: 'saved'
    };

    addInvoice(invoice);
    resetForm();
    setView('list');
  };

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="bg-white rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {
              resetForm();
              setView('list');
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              view === 'list'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <List className="h-4 w-4 mr-2" />
            All Invoices
          </button>
          <button
            onClick={() => {
              resetForm();
              setView('search');
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              view === 'search'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Search className="h-4 w-4 mr-2" />
            Search Prescription
          </button>
          <button
            onClick={() => {
              resetForm();
              setView('create');
            }}
            className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
              view === 'create'
                ? 'bg-indigo-100 text-indigo-700'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Order
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg p-6">
        {/* List View */}
        {view === 'list' && <LabInvoiceList />}

        {/* Search View */}
        {view === 'search' && !showInvoice && (
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label htmlFor="prescriptionId" className="block text-sm font-medium text-gray-700">
                  Prescription ID
                </label>
                <input
                  type="text"
                  id="prescriptionId"
                  value={prescriptionId}
                  onChange={(e) => setPrescriptionId(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Enter Prescription ID"
                />
              </div>
              <button
                onClick={handleSearch}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Search className="h-4 w-4 mr-2" />
                Search
              </button>
            </div>
          </div>
        )}

        {/* Create View */}
        {view === 'create' && !showInvoice && (
          <div className="space-y-4">
            <div>
              <label htmlFor="patientName" className="block text-sm font-medium text-gray-700">
                Patient Name
              </label>
              <input
                type="text"
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            {/* Selected Tests Display */}
            {selectedTests.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Selected Tests
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedTests.map((test) => (
                    <span
                      key={test}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm bg-indigo-100 text-indigo-800"
                    >
                      {test}
                      <button
                        type="button"
                        onClick={() => handleTestRemove(test)}
                        className="ml-1.5 inline-flex items-center justify-center text-indigo-400 hover:text-indigo-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Test Selection */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tests
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Search and select tests..."
                />
                {isDropdownOpen && (
                  <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                    {filteredTests.length > 0 ? (
                      filteredTests.map((test) => (
                        <div
                          key={test.id}
                          className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          onClick={() => handleTestSelect(test.name)}
                        >
                          <span className="text-gray-900">{test.name}</span>
                          <span className="text-gray-500">₹{test.price}</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        No tests found
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setView('list');
                }}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateManualOrder}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Generate Invoice
              </button>
            </div>
          </div>
        )}

        {/* Invoice Display */}
        {showInvoice && selectedPrescription && (
          <div className="space-y-6">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">Lab Tests Invoice</h2>
                <p className="text-sm text-gray-500">Prescription ID: {selectedPrescription.prescriptionId}</p>
                <p className="text-sm text-gray-500">Patient Name: {selectedPrescription.patientName}</p>
                <p className="text-sm text-gray-500">Date: {new Date(selectedPrescription.date).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Save
                </button>
                <button
                  onClick={handleSaveAndPrint}
                  className="inline-flex items-center px-3 py-1 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  Save & Print
                </button>
              </div>
            </div>

            {/* Test List */}
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {selectedPrescription.labTests?.map((test, index) => {
                  const price = getTestPrice(test);
                  return (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {test}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                        ₹{price.toFixed(2)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Totals */}
            <div className="space-y-4">
              <div className="flex items-center justify-end space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Discount (%)
                </label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={discount}
                  onChange={(e) => setDiscount(Number(e.target.value))}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
              <div className="flex justify-end space-x-4 text-sm">
                <div className="text-gray-500">Subtotal:</div>
                <div className="font-medium">₹{calculateTotal().toFixed(2)}</div>
              </div>
              {discount > 0 && (
                <div className="flex justify-end space-x-4 text-sm">
                  <div className="text-gray-500">Discount ({discount}%):</div>
                  <div className="font-medium text-red-600">
                    -₹{((calculateTotal() * discount) / 100).toFixed(2)}
                  </div>
                </div>
              )}
              <div className="flex justify-end space-x-4 text-lg font-bold border-t pt-4">
                <div>Total:</div>
                <div>₹{calculateDiscountedTotal().toFixed(2)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
