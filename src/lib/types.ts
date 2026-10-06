export type ServiceType =
  | 'document_registration'
  | 'marriage_registration'
  | 'ec_request'
  | 'document_copy'
  | 'birth_death_certificate'
  | 'patta_chitta';

export type RequestStatus = 'pending' | 'in_review' | 'processing' | 'completed' | 'rejected';

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'completed' | 'cancelled';

export type PaymentStatus = 'pending' | 'paid' | 'refunded' | 'failed';

export type ECStatus = 'pending' | 'processing' | 'completed' | 'rejected';

export interface Settings {
  id: string;
  business_name: string;
  tamil_name: string;
  address: string;
  location: string;
  phone: string;
  whatsapp: string;
  email: string;
  office_hours: string;
  about: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceRequest {
  id: string;
  customer_id: string;
  service_type: ServiceType;
  status: RequestStatus;
  form_data: Record<string, unknown>;
  admin_notes: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface ECRequest {
  id: string;
  service_request_id: string;
  district: string;
  taluk: string;
  village: string;
  survey_number: string;
  subdivision_number: string;
  ec_period_from: string;
  ec_period_to: string;
  ec_certificate_url: string;
  status: ECStatus;
  admin_notes: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_type: ServiceType;
  preferred_date: string;
  preferred_time: string;
  status: AppointmentStatus;
  notes: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface DocumentRecord {
  id: string;
  customer_id: string | null;
  service_request_id: string | null;
  file_name: string;
  file_url: string;
  file_type: string;
  document_type: string;
  file_size: number;
  created_at: string;
  customer?: Customer;
}

export interface Payment {
  id: string;
  customer_id: string | null;
  service_request_id: string | null;
  amount: number;
  payment_status: PaymentStatus;
  payment_method: string;
  transaction_id: string;
  notes: string;
  created_at: string;
  updated_at: string;
  customer?: Customer;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  related_id: string | null;
  related_type: string;
  is_read: boolean;
  created_at: string;
}

export interface StorageUsage {
  total_bytes: number;
  used_bytes: number;
  available_bytes: number;
  usage_percentage: number;
  total_files: number;
  buckets: BucketUsage[];
}

export interface BucketUsage {
  id: string;
  name: string;
  public: boolean;
  file_size: number;
  file_count: number;
  size_bytes: number;
}

export interface StorageFile {
  id: string;
  name: string;
  bucket_id: string;
  bucket_name: string;
  created_at: string;
  last_accessed_at: string;
  metadata: Record<string, unknown>;
  size_bytes: number;
  owner: string;
  path: string;
  updated_at: string;
}
