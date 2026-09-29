import { FileText, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { ServiceType } from '@/lib/types';

interface ServiceContentProps {
  serviceKey: ServiceType;
}

const serviceContent: Record<ServiceType, {
  description: string;
  documentsRequired: string[];
  processSteps: string[];
  fees: string;
  timeline: string;
}> = {
  document_registration: {
    description: "Document registration is the official process of recording legal documents with government authorities. In Tamil Nadu, document registration is mandatory for property transactions, agreements, and other legal documents to ensure their validity and prevent fraud. IDIRAN TECH provides professional document registration services in Gangaikondan and surrounding areas.",
    documentsRequired: [
      "Original document to be registered",
      "Identity proof (Aadhaar card, PAN card)",
      "Address proof",
      "Passport size photographs",
      "Property tax receipts (for property documents)",
      "Encumbrance Certificate (EC)",
      "Previous sale deed (for property transactions)"
    ],
    processSteps: [
      "Document verification and preparation",
      "Payment of stamp duty and registration fees",
      "Appointment scheduling at sub-registrar office",
      "Biometric verification and document submission",
      "Collection of registered document"
    ],
    fees: "Contact us for current registration fees and stamp duty rates",
    timeline: "Contact us for current processing timeline"
  },
  marriage_registration: {
    description: "Marriage registration is the official recording of a marriage with government authorities, providing legal recognition and proof of marriage. In Tamil Nadu, marriages can be registered under the Hindu Marriage Act or Special Marriage Act. IDIRAN TECH assists with complete marriage registration procedures in Gangaikondan.",
    documentsRequired: [
      "Marriage invitation card (optional)",
      "Birth certificates of both parties",
      "Identity proof (Aadhaar card, PAN card)",
      "Address proof of both parties",
      "Passport size photographs (4 each)",
      "Marriage photographs (2-3)",
      "Witness identity proofs and photographs"
    ],
    processSteps: [
      "Document collection and verification",
      "Application form preparation",
      "Appointment scheduling at registrar office",
      "Verification by registrar",
      "Issuance of marriage certificate"
    ],
    fees: "Contact us for current registration fees",
    timeline: "Contact us for current processing timeline"
  },
  ec_request: {
    description: "Encumbrance Certificate (EC) is a crucial document that shows whether a property has any legal dues or encumbrances. It's essential for property transactions, loans, and verification of property ownership. IDIRAN TECH provides efficient EC services for properties in Gangaikondan and Tirunelveli district.",
    documentsRequired: [
      "Property details (survey number, subdivision number)",
      "Property tax receipt",
      "Identity proof of applicant",
      "Address proof",
      "Copy of sale deed (if available)",
      "Application form with property details"
    ],
    processSteps: [
      "Property details collection and verification",
      "Application submission to concerned authority",
      "Processing and verification at tahsildar office",
      "EC issuance and collection"
    ],
    fees: "Contact us for current EC fees",
    timeline: "Contact us for current processing timeline"
  },
  document_copy: {
    description: "Document copy services provide certified copies of registered documents from government records. These copies are legally valid and can be used for various purposes including property transactions, legal proceedings, and personal records. IDIRAN TECH assists in obtaining certified document copies efficiently.",
    documentsRequired: [
      "Document registration number and year",
      "Property details (for property documents)",
      "Identity proof of applicant",
      "Address proof",
      "Relationship proof (if applicable)",
      "Authorization letter (if applying on behalf of someone)"
    ],
    processSteps: [
      "Document details verification",
      "Application preparation and submission",
      "Payment of copy fees",
      "Processing at concerned authority",
      "Collection of certified copy"
    ],
    fees: "Contact us for current copy fees",
    timeline: "Contact us for current processing timeline"
  },
  birth_death_certificate: {
    description: "Birth and death certificates are essential legal documents issued by government authorities. They are required for various purposes including school admission, passport applications, property matters, and government benefits. IDIRAN TECH provides assistance in obtaining birth and death certificates in Gangaikondan.",
    documentsRequired: [
      "Hospital discharge record (for births)",
      "Death certificate from hospital (for deaths)",
      "Identity proof of parents/applicant",
      "Address proof",
      "Birth/death details (date, time, place)",
      "Parents' marriage certificate (for birth certificates)"
    ],
    processSteps: [
      "Document collection and verification",
      "Application form preparation",
      "Submission to concerned authority",
      "Verification and processing",
      "Certificate issuance"
    ],
    fees: "Contact us for current certificate fees",
    timeline: "Contact us for current processing timeline"
  },
  patta_chitta: {
    description: "Patta and Chitta are important land records in Tamil Nadu. Patta is a revenue record showing land ownership, while Chitta contains land details including area, classification, and ownership. These documents are essential for property transactions, loans, and verification of land ownership. IDIRAN TECH provides expert assistance for Patta/Chitta services.",
    documentsRequired: [
      "Property survey number and subdivision number",
      "Property tax receipt",
      "Identity proof of landowner",
      "Address proof",
      "Sale deed or possession document",
      "Encumbrance Certificate",
      "Previous Patta/Chitta (if available)"
    ],
    processSteps: [
      "Property details verification",
      "Application preparation for Patta transfer or new Patta",
      "Submission to revenue department",
      "Field verification by revenue officials",
      "Patta/Chitta issuance"
    ],
    fees: "Contact us for current Patta/Chitta fees",
    timeline: "Contact us for current processing timeline"
  }
};

export function ServiceContent({ serviceKey }: ServiceContentProps) {
  const content = serviceContent[serviceKey];
  
  if (!content) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* What is this service */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">What is {serviceKey === 'ec_request' ? 'an Encumbrance Certificate' : serviceKey.replace(/_/g, ' ')}?</h2>
        <p className="text-slate-600 leading-relaxed">{content.description}</p>
      </div>

      {/* Documents Required */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <FileText className="w-6 h-6 text-primary-600" />
          Documents Required
        </h2>
        <ul className="space-y-3">
          {content.documentsRequired.map((doc, index) => (
            <li key={index} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-slate-200">
              <CheckCircle className="w-5 h-5 text-accent-600 flex-shrink-0 mt-0.5" />
              <span className="text-slate-700">{doc}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Process Steps */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
          <Clock className="w-6 h-6 text-primary-600" />
          How It Works
        </h2>
        <div className="space-y-4">
          {content.processSteps.map((step, index) => (
            <div key={index} className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center font-bold flex-shrink-0">
                {index + 1}
              </div>
              <p className="text-slate-700 pt-1">{step}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fees and Timeline */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary-600" />
            Fees
          </h3>
          <p className="text-slate-600">{content.fees}</p>
        </div>
        <div className="p-6 bg-white rounded-xl border border-slate-200">
          <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary-600" />
            Timeline
          </h3>
          <p className="text-slate-600">{content.timeline}</p>
        </div>
      </div>

      {/* Why Choose Us */}
      <div className="p-6 bg-gradient-to-r from-primary-50 to-accent-50 rounded-xl border border-primary-200">
        <h3 className="font-bold text-slate-900 mb-3">Why Choose IDIRAN TECH?</h3>
        <ul className="space-y-2 text-slate-700">
          <li>✓ Professional service with years of experience</li>
          <li>✓ Complete documentation assistance</li>
          <li>✓ Transparent pricing with no hidden charges</li>
          <li>✓ Quick turnaround time</li>
          <li>✓ Personalized service for local residents</li>
        </ul>
      </div>
    </div>
  );
}
