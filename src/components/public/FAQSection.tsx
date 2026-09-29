import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { FAQJsonLd } from '@/components/shared/JsonLd';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What documents are required for property registration?",
    answer: "For property registration, you typically need the original sale deed, identity proof (Aadhaar/PAN), address proof, passport size photographs, property tax receipts, encumbrance certificate, and previous sale deed if applicable. Contact us for the complete list based on your specific case."
  },
  {
    question: "How long does document registration take?",
    answer: "The timeline varies based on document type and government office processing times. Contact us for current processing timelines for your specific document type."
  },
  {
    question: "What are the fees for document services?",
    answer: "Fees vary based on document type, property value, and government charges. Contact us for current fee structure for your specific requirements."
  },
  {
    question: "Do you provide services for areas outside Gangaikondan?",
    answer: "We primarily serve Gangaikondan and surrounding areas in Tirunelveli district. Contact us to check if we can assist with your specific location."
  },
  {
    question: "Can you help with urgent document requirements?",
    answer: "Yes, we can assist with urgent requirements. Contact us directly to discuss your timeline and we'll do our best to accommodate your needs."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept various payment methods including cash, UPI, and bank transfers. Contact us for specific payment options for your service."
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <>
      <FAQJsonLd faqs={faqs} />
      <section className="py-16 bg-slate-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
                  aria-expanded={openIndex === index}
                >
                  <span className="font-semibold text-slate-900 pr-4">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4 pt-2 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
