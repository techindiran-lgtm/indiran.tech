import type { ServiceType, RequestStatus, AppointmentStatus, PaymentStatus, ECStatus } from './types';

export interface ServiceInfo {
  key: ServiceType;
  name: string;
  tamilName: string;
  icon: string;
  description: string;
  details: string[];
  fields: ServiceField[];
}

export interface ServiceField {
  name: string;
  label: string;
  tamilLabel: string;
  type: 'text' | 'textarea' | 'date' | 'select' | 'tel' | 'file' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
}

export const SERVICES: ServiceInfo[] = [
  {
    key: 'document_registration',
    name: 'Document Registration',
    tamilName: 'பத்திரப் பதிவு',
    icon: 'FileText',
    description: 'Register property documents and deeds with official records.',
    details: [
      'Property sale deed registration',
      'Gift deed registration',
      'Mortgage deed registration',
      'Lease agreement registration',
      'Power of attorney registration',
    ],
    fields: [
      { name: 'document_type', label: 'Document Type', tamilLabel: 'ஆவண வகை', type: 'select', required: true, options: ['Sale Deed', 'Gift Deed', 'Mortgage Deed', 'Lease Agreement', 'Power of Attorney', 'Other'] },
      { name: 'property_address', label: 'Property Address', tamilLabel: 'சொத்து முகவரி', type: 'textarea', required: true },
      { name: 'survey_number', label: 'Survey Number', tamilLabel: 'அளவை எண்', type: 'text', required: true },
      { name: 'document_value', label: 'Document Value (Rs.)', tamilLabel: 'ஆவண மதிப்பு', type: 'number', required: true },
      { name: 'party1_name', label: 'First Party Name', tamilLabel: 'முதல் தரப்பு பெயர்', type: 'text', required: true },
      { name: 'party2_name', label: 'Second Party Name', tamilLabel: 'இரண்டாம் தரப்பு பெயர்', type: 'text', required: true },
      { name: 'remarks', label: 'Remarks', tamilLabel: 'குறிப்புகள்', type: 'textarea', required: false },
    ],
  },
  {
    key: 'marriage_registration',
    name: 'Marriage Registration',
    tamilName: 'திருமணப் பதிவு',
    icon: 'Heart',
    description: 'Official marriage registration and certificate issuance.',
    details: [
      'Hindu Marriage Act registration',
      'Special Marriage Act registration',
      'Marriage certificate issuance',
      'Name change after marriage',
    ],
    fields: [
      { name: 'groom_name', label: 'Groom Full Name', tamilLabel: 'மணமகன் பெயர்', type: 'text', required: true },
      { name: 'bride_name', label: 'Bride Full Name', tamilLabel: 'மணமகள் பெயர்', type: 'text', required: true },
      { name: 'marriage_date', label: 'Date of Marriage', tamilLabel: 'திருமண தேதி', type: 'date', required: true },
      { name: 'marriage_place', label: 'Place of Marriage', tamilLabel: 'திருமண இடம்', type: 'text', required: true },
      { name: 'groom_aadhaar', label: 'Groom Aadhaar Number', tamilLabel: 'மணமகன் ஆதார் எண்', type: 'text', required: true },
      { name: 'bride_aadhaar', label: 'Bride Aadhaar Number', tamilLabel: 'மணமகள் ஆதார் எண்', type: 'text', required: true },
      { name: 'witness1_name', label: 'Witness 1 Name', tamilLabel: 'சாட்சி 1 பெயர்', type: 'text', required: true },
      { name: 'witness2_name', label: 'Witness 2 Name', tamilLabel: 'சாட்சி 2 பெயர்', type: 'text', required: true },
    ],
  },
  {
    key: 'ec_request',
    name: 'Encumbrance Certificate (EC)',
    tamilName: 'வில்லங்கச் சான்றிதழ்',
    icon: 'ShieldCheck',
    description: 'Request an Encumbrance Certificate for property verification.',
    details: [
      'Property encumbrance verification',
      'EC for specified period',
      'Manual processing by our office',
      'Certificate upload upon completion',
    ],
    fields: [
      { name: 'district', label: 'District', tamilLabel: 'மாவட்டம்', type: 'text', required: true, placeholder: 'e.g., Tirunelveli' },
      { name: 'taluk', label: 'Taluk', tamilLabel: 'வட்டம்', type: 'text', required: true, placeholder: 'e.g., Radhapuram' },
      { name: 'village', label: 'Village', tamilLabel: 'கிராமம்', type: 'text', required: true },
      { name: 'survey_number', label: 'Survey Number', tamilLabel: 'அளவை எண்', type: 'text', required: true },
      { name: 'subdivision_number', label: 'Subdivision Number', tamilLabel: 'உட்பிரிவு எண்', type: 'text', required: false },
      { name: 'ec_period_from', label: 'EC Period From', tamilLabel: 'காலம் தொடக்கம்', type: 'date', required: true },
      { name: 'ec_period_to', label: 'EC Period To', tamilLabel: 'காலம் முடிவு', type: 'date', required: true },
    ],
  },
  {
    key: 'document_copy',
    name: 'Document Copy',
    tamilName: 'ஆவண நகல்',
    icon: 'Copy',
    description: 'Get certified copies of registered documents.',
    details: [
      'Certified copy of registered deed',
      'Copy of sale agreement',
      'Copy of mortgage document',
      'Copy of power of attorney',
    ],
    fields: [
      { name: 'document_type', label: 'Document Type', tamilLabel: 'ஆவண வகை', type: 'select', required: true, options: ['Sale Deed', 'Gift Deed', 'Mortgage Deed', 'Lease Agreement', 'Power of Attorney', 'Will', 'Other'] },
      { name: 'document_year', label: 'Document Registration Year', tamilLabel: 'பதிவு ஆண்டு', type: 'text', required: true },
      { name: 'document_number', label: 'Document Registration Number', tamilLabel: 'பதிவு எண்', type: 'text', required: true },
      { name: 'property_address', label: 'Property Address', tamilLabel: 'சொத்து முகவரி', type: 'textarea', required: true },
      { name: 'number_of_copies', label: 'Number of Copies Needed', tamilLabel: 'நகல்களின் எண்ணிக்கை', type: 'number', required: true },
    ],
  },
  {
    key: 'birth_death_certificate',
    name: 'Birth / Death Certificate',
    tamilName: 'பிறப்பு/இறப்பு சான்றிதழ்',
    icon: 'Certificate',
    description: 'Apply for birth or death certificate copies and corrections.',
    details: [
      'Birth certificate issuance',
      'Death certificate issuance',
      'Certificate corrections',
      'Delayed registration',
    ],
    fields: [
      { name: 'certificate_type', label: 'Certificate Type', tamilLabel: 'சான்றிதழ் வகை', type: 'select', required: true, options: ['Birth Certificate', 'Death Certificate'] },
      { name: 'person_name', label: 'Person Name', tamilLabel: 'நபர் பெயர்', type: 'text', required: true },
      { name: 'event_date', label: 'Date of Birth/Death', tamilLabel: 'பிறந்த/இறந்த தேதி', type: 'date', required: true },
      { name: 'event_place', label: 'Place of Birth/Death', tamilLabel: 'இடம்', type: 'text', required: true },
      { name: 'father_name', label: 'Father/Husband Name', tamilLabel: 'தந்தை/கணவர் பெயர்', type: 'text', required: true },
      { name: 'mother_name', label: 'Mother Name', tamilLabel: 'தாய் பெயர்', type: 'text', required: false },
      { name: 'gender', label: 'Gender', tamilLabel: 'பாலினம்', type: 'select', required: true, options: ['Male', 'Female', 'Other'] },
      { name: 'purpose', label: 'Purpose', tamilLabel: '�ோக்கம்', type: 'textarea', required: false },
    ],
  },
  {
    key: 'patta_chitta',
    name: 'Patta / Chitta',
    tamilName: 'பட்டா சிட்டா',
    icon: 'LandPlot',
    description: 'Apply for Patta and Chitta land records.',
    details: [
      'Patta transfer application',
      'Chitta extract',
      'Joint Patta application',
      'Land record verification',
    ],
    fields: [
      { name: 'request_type', label: 'Request Type', tamilLabel: 'வேண்டுகோள் வகை', type: 'select', required: true, options: ['New Patta', 'Patta Transfer', 'Chitta Extract', 'Joint Patta', 'Name Correction'] },
      { name: 'district', label: 'District', tamilLabel: 'மாவட்டம்', type: 'text', required: true },
      { name: 'taluk', label: 'Taluk', tamilLabel: 'வட்டம்', type: 'text', required: true },
      { name: 'village', label: 'Village', tamilLabel: 'கிராமம்', type: 'text', required: true },
      { name: 'survey_number', label: 'Survey Number', tamilLabel: 'அளவை எண்', type: 'text', required: true },
      { name: 'subdivision_number', label: 'Subdivision Number', tamilLabel: 'உட்பிரிவு எண்', type: 'text', required: false },
      { name: 'owner_name', label: 'Owner Name (as per records)', tamilLabel: 'உரிமையாளர் பெயர்', type: 'text', required: true },
      { name: 'land_extent', label: 'Land Extent (acres)', tamilLabel: 'நில அளவு', type: 'text', required: false },
    ],
  },
];

export const SERVICE_MAP: Record<string, ServiceInfo> = SERVICES.reduce(
  (acc, s) => ({ ...acc, [s.key]: s }),
  {} as Record<string, ServiceInfo>
);

export const REQUEST_STATUS_LABELS: Record<RequestStatus, string> = {
  pending: 'Pending',
  in_review: 'In Review',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
};

export const REQUEST_STATUS_COLORS: Record<RequestStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  in_review: 'bg-blue-100 text-blue-800 border-blue-200',
  processing: 'bg-purple-100 text-purple-800 border-purple-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};

export const APPOINTMENT_STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  rescheduled: 'Rescheduled',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const APPOINTMENT_STATUS_COLORS: Record<AppointmentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  confirmed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rescheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-teal-100 text-teal-800 border-teal-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  pending: 'Pending',
  paid: 'Paid',
  refunded: 'Refunded',
  failed: 'Failed',
};

export const PAYMENT_STATUS_COLORS: Record<PaymentStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  paid: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  refunded: 'bg-blue-100 text-blue-800 border-blue-200',
  failed: 'bg-red-100 text-red-800 border-red-200',
};

export const EC_STATUS_LABELS: Record<ECStatus, string> = {
  pending: 'Pending',
  processing: 'Processing',
  completed: 'Completed',
  rejected: 'Rejected',
};

export const EC_STATUS_COLORS: Record<ECStatus, string> = {
  pending: 'bg-amber-100 text-amber-800 border-amber-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
};
