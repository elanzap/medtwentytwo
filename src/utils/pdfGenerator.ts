import jsPDF from 'jspdf';
import type { Prescription } from '../types';

const formatPrescriptionText = (prescription: Partial<Prescription>): string[] => {
  const lines: string[] = [];
  
  // Header
  lines.push('PRESCRIPTION');
  lines.push(`Date: ${new Date().toLocaleDateString()}`);
  lines.push('');
  
  // Patient Info
  lines.push(`Patient ID: ${prescription.patientId}`);
  lines.push('');
  
  // Vital Signs
  lines.push('Vital Signs:');
  lines.push(`Blood Pressure: ${prescription.vitalSigns?.bloodPressure}`);
  lines.push(`Pulse Rate: ${prescription.vitalSigns?.pulseRate} bpm`);
  lines.push(`Temperature: ${prescription.vitalSigns?.temperature}°F`);
  lines.push(`Weight: ${prescription.vitalSigns?.weight} kg`);
  lines.push('');
  
  // Symptoms
  lines.push('Symptoms:');
  lines.push(prescription.symptoms || 'None');
  lines.push('');
  
  // Diagnosis
  lines.push('Diagnosis:');
  lines.push(prescription.diagnosis || 'None');
  lines.push('');
  
  // Medications
  lines.push('Medications:');
  prescription.medications?.forEach((med) => {
    lines.push(`- ${med.name} ${med.dosage}`);
    lines.push(`  Interval: ${med.interval}`);
    lines.push(`  Duration: ${med.duration}`);
    lines.push(`  Instructions: ${med.instructions}`);
    lines.push('');
  });
  
  // Lab Tests
  lines.push('Lab Tests:');
  prescription.labTests?.forEach((test) => {
    lines.push(`- ${test}`);
  });
  
  return lines;
};

export const generatePrescriptionPDF = async (prescription: Partial<Prescription>): Promise<void> => {
  const doc = new jsPDF();
  const lines = formatPrescriptionText(prescription);
  
  let y = 20;
  lines.forEach((line) => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 20, y);
    y += 7;
  });
  
  doc.save(`prescription-${Date.now()}.pdf`);
};
