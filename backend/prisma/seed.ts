import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const vaccines = [
  { name: 'BCG', description: 'Bacille Calmette-Guerin vaccine for tuberculosis', recommendedAgeMonths: 0, doseNumber: 1, isMandatory: true, sideEffects: 'Small sore at injection site', precautions: 'Do not give to immunocompromised individuals', schedule: 'At birth' },
  { name: 'Hepatitis B - Dose 1', description: 'Hepatitis B vaccine, first dose', recommendedAgeMonths: 0, doseNumber: 1, isMandatory: true, sideEffects: 'Soreness at injection site, mild fever', precautions: 'None significant', schedule: 'At birth' },
  { name: 'OPV Zero Dose', description: 'Oral Polio Vaccine, zero dose', recommendedAgeMonths: 0, doseNumber: 1, isMandatory: true, sideEffects: 'Rare - vaccine-associated paralytic poliomyelitis', precautions: 'Not for immunocompromised', schedule: 'At birth' },
  { name: 'DTwP/DTaP - Dose 1', description: 'Diphtheria, Tetanus, Pertussis vaccine, first dose', recommendedAgeMonths: 1.5, doseNumber: 1, isMandatory: true, sideEffects: 'Fever, irritability, redness at injection site', precautions: 'Previous severe reaction to vaccine', schedule: '6 weeks' },
  { name: 'IPV - Dose 1', description: 'Inactivated Polio Vaccine, first dose', recommendedAgeMonths: 1.5, doseNumber: 1, isMandatory: true, sideEffects: 'Mild soreness at injection site', precautions: 'None significant', schedule: '6 weeks' },
  { name: 'Hib - Dose 1', description: 'Haemophilus influenzae type b vaccine, first dose', recommendedAgeMonths: 1.5, doseNumber: 1, isMandatory: true, sideEffects: 'Mild fever, irritability', precautions: 'None significant', schedule: '6 weeks' },
  { name: 'Rotavirus - Dose 1', description: 'Rotavirus vaccine, first dose', recommendedAgeMonths: 1.5, doseNumber: 1, isMandatory: false, sideEffects: 'Mild diarrhea, vomiting', precautions: 'Severe combined immunodeficiency', schedule: '6 weeks' },
  { name: 'PCV - Dose 1', description: 'Pneumococcal Conjugate Vaccine, first dose', recommendedAgeMonths: 1.5, doseNumber: 1, isMandatory: true, sideEffects: 'Fever, irritability, soreness', precautions: 'None significant', schedule: '6 weeks' },
  { name: 'Hepatitis B - Dose 2', description: 'Hepatitis B vaccine, second dose', recommendedAgeMonths: 1.5, doseNumber: 2, isMandatory: true, sideEffects: 'Soreness at injection site, mild fever', precautions: 'None significant', schedule: '6 weeks' },
  { name: 'DTwP/DTaP - Dose 2', description: 'Diphtheria, Tetanus, Pertussis vaccine, second dose', recommendedAgeMonths: 2.5, doseNumber: 2, isMandatory: true, sideEffects: 'Fever, irritability, redness at injection site', precautions: 'Previous severe reaction to vaccine', schedule: '10 weeks' },
  { name: 'IPV - Dose 2', description: 'Inactivated Polio Vaccine, second dose', recommendedAgeMonths: 2.5, doseNumber: 2, isMandatory: true, sideEffects: 'Mild soreness at injection site', precautions: 'None significant', schedule: '10 weeks' },
  { name: 'Hib - Dose 2', description: 'Haemophilus influenzae type b vaccine, second dose', recommendedAgeMonths: 2.5, doseNumber: 2, isMandatory: true, sideEffects: 'Mild fever, irritability', precautions: 'None significant', schedule: '10 weeks' },
  { name: 'Rotavirus - Dose 2', description: 'Rotavirus vaccine, second dose', recommendedAgeMonths: 2.5, doseNumber: 2, isMandatory: false, sideEffects: 'Mild diarrhea, vomiting', precautions: 'Severe combined immunodeficiency', schedule: '10 weeks' },
  { name: 'PCV - Dose 2', description: 'Pneumococcal Conjugate Vaccine, second dose', recommendedAgeMonths: 2.5, doseNumber: 2, isMandatory: true, sideEffects: 'Fever, irritability, soreness', precautions: 'None significant', schedule: '10 weeks' },
  { name: 'DTwP/DTaP - Dose 3', description: 'Diphtheria, Tetanus, Pertussis vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: true, sideEffects: 'Fever, irritability, redness at injection site', precautions: 'Previous severe reaction to vaccine', schedule: '14 weeks' },
  { name: 'IPV - Dose 3', description: 'Inactivated Polio Vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: true, sideEffects: 'Mild soreness at injection site', precautions: 'None significant', schedule: '14 weeks' },
  { name: 'Hib - Dose 3', description: 'Haemophilus influenzae type b vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: true, sideEffects: 'Mild fever, irritability', precautions: 'None significant', schedule: '14 weeks' },
  { name: 'Rotavirus - Dose 3', description: 'Rotavirus vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: false, sideEffects: 'Mild diarrhea, vomiting', precautions: 'Severe combined immunodeficiency', schedule: '14 weeks' },
  { name: 'PCV - Dose 3', description: 'Pneumococcal Conjugate Vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: true, sideEffects: 'Fever, irritability, soreness', precautions: 'None significant', schedule: '14 weeks' },
  { name: 'Hepatitis B - Dose 3', description: 'Hepatitis B vaccine, third dose', recommendedAgeMonths: 3.5, doseNumber: 3, isMandatory: true, sideEffects: 'Soreness at injection site, mild fever', precautions: 'None significant', schedule: '14 weeks' },
  { name: 'Influenza', description: 'Influenza vaccine, yearly', recommendedAgeMonths: 6, doseNumber: 1, isMandatory: false, sideEffects: 'Soreness, mild fever, fatigue', precautions: 'Severe egg allergy', schedule: '6 months, yearly' },
  { name: 'MMR - Dose 1', description: 'Measles, Mumps, Rubella vaccine, first dose', recommendedAgeMonths: 9, doseNumber: 1, isMandatory: true, sideEffects: 'Mild rash, fever, joint pain', precautions: 'Pregnancy, severe immunocompromise', schedule: '9 months' },
  { name: 'Hepatitis A - Dose 1', description: 'Hepatitis A vaccine, first dose', recommendedAgeMonths: 12, doseNumber: 1, isMandatory: true, sideEffects: 'Soreness at injection site, mild fever', precautions: 'None significant', schedule: '12 months' },
  { name: 'Typhoid Conjugate Vaccine', description: 'Typhoid conjugate vaccine', recommendedAgeMonths: 12, doseNumber: 1, isMandatory: true, sideEffects: 'Fever, headache, soreness', precautions: 'None significant', schedule: '12 months' },
  { name: 'MMR - Dose 2', description: 'Measles, Mumps, Rubella vaccine, second dose', recommendedAgeMonths: 15, doseNumber: 2, isMandatory: true, sideEffects: 'Mild rash, fever, joint pain', precautions: 'Pregnancy, severe immunocompromise', schedule: '15 months' },
  { name: 'Varicella - Dose 1', description: 'Chickenpox vaccine, first dose', recommendedAgeMonths: 15, doseNumber: 1, isMandatory: true, sideEffects: 'Mild rash, fever', precautions: 'Pregnancy, severe immunocompromise', schedule: '15 months' },
  { name: 'PCV Booster', description: 'Pneumococcal Conjugate Vaccine booster dose', recommendedAgeMonths: 15, doseNumber: 4, isMandatory: true, sideEffects: 'Fever, irritability, soreness', precautions: 'None significant', schedule: '15 months' },
  { name: 'DTwP/DTaP Booster 1', description: 'Diphtheria, Tetanus, Pertussis booster, first booster', recommendedAgeMonths: 18, doseNumber: 4, isMandatory: true, sideEffects: 'Fever, irritability, redness at injection site', precautions: 'Previous severe reaction to vaccine', schedule: '18 months' },
  { name: 'IPV Booster', description: 'Inactivated Polio Vaccine booster', recommendedAgeMonths: 18, doseNumber: 4, isMandatory: true, sideEffects: 'Mild soreness at injection site', precautions: 'None significant', schedule: '18 months' },
  { name: 'Hib Booster', description: 'Haemophilus influenzae type b vaccine booster', recommendedAgeMonths: 18, doseNumber: 4, isMandatory: true, sideEffects: 'Mild fever, irritability', precautions: 'None significant', schedule: '18 months' },
  { name: 'Hepatitis A - Dose 2', description: 'Hepatitis A vaccine, second dose', recommendedAgeMonths: 24, doseNumber: 2, isMandatory: true, sideEffects: 'Soreness at injection site, mild fever', precautions: 'None significant', schedule: '24 months' },
  { name: 'DTwP/DTaP Booster 2', description: 'Diphtheria, Tetanus, Pertussis booster, second booster', recommendedAgeMonths: 54, doseNumber: 5, isMandatory: true, sideEffects: 'Fever, irritability, redness at injection site', precautions: 'Previous severe reaction to vaccine', schedule: '48-72 months' },
  { name: 'MMR - Dose 3', description: 'Measles, Mumps, Rubella vaccine, third dose', recommendedAgeMonths: 54, doseNumber: 3, isMandatory: true, sideEffects: 'Mild rash, fever, joint pain', precautions: 'Pregnancy, severe immunocompromise', schedule: '48-72 months' },
  { name: 'Varicella - Dose 2', description: 'Chickenpox vaccine, second dose', recommendedAgeMonths: 54, doseNumber: 2, isMandatory: true, sideEffects: 'Mild rash, fever', precautions: 'Pregnancy, severe immunocompromise', schedule: '48-72 months' },
  { name: 'Tdap', description: 'Tetanus, diphtheria, acellular pertussis', recommendedAgeMonths: 120, doseNumber: 1, isMandatory: true, sideEffects: 'Soreness, redness, swelling at injection site', precautions: 'Previous severe reaction', schedule: '10-12 years' },
  { name: 'HPV', description: 'Human Papillomavirus vaccine', recommendedAgeMonths: 120, doseNumber: 1, isMandatory: false, sideEffects: 'Soreness, redness, dizziness', precautions: 'Pregnancy', schedule: '10-12 years' },
  { name: 'Tdap Booster', description: 'Tetanus, diphtheria, acellular pertussis booster', recommendedAgeMonths: 192, doseNumber: 2, isMandatory: true, sideEffects: 'Soreness, redness, swelling at injection site', precautions: 'Previous severe reaction', schedule: '16 years' },
];

async function main() {
  console.log('Seeding database...');

  await prisma.vaccine.deleteMany();

  for (const vaccine of vaccines) {
    await prisma.vaccine.create({ data: vaccine });
  }

  console.log(`Seeded ${vaccines.length} vaccines.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
