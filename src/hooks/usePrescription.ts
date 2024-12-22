import { useState, useEffect, useCallback } from 'react';
import type { Prescription, VitalSigns, Medication } from '../types';

export const usePrescription = (patientId: string, initialData?: Partial<Prescription>) => {
  const [prescription, setPrescription] = useState<Partial<Prescription>>({
    patientId,
    date: new Date().toISOString(),
    diagnoses: [],
    medications: [],
    labTests: [],
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setPrescription(prev => ({ ...prev, ...initialData }));
    }
  }, [initialData?.prescriptionId]);

  const updateVitalSigns = useCallback((vitalSigns: VitalSigns) => {
    setPrescription(prev => ({ ...prev, vitalSigns }));
  }, []);

  const updateSymptoms = useCallback((symptoms: string) => {
    setPrescription(prev => ({ ...prev, symptoms }));
  }, []);

  const updateDiagnoses = useCallback((diagnoses: string[]) => {
    setPrescription(prev => ({ ...prev, diagnoses }));
  }, []);

  const updateMedications = useCallback((medications: Medication[]) => {
    setPrescription(prev => ({ ...prev, medications }));
  }, []);

  const updateLabTests = useCallback((labTests: string[]) => {
    setPrescription(prev => ({ ...prev, labTests }));
  }, []);

  return {
    prescription,
    updateVitalSigns,
    updateSymptoms,
    updateDiagnoses,
    updateMedications,
    updateLabTests,
  };
};
