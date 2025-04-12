
// This file contains the data structure that will be used with Supabase
// These are the tables and their structures that should be created in Supabase

// User Types
export type UserRole = 'tenant' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

// Tenant specific data
export interface Tenant extends User {
  society_id: string;
  flat_number: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  documents: TenantDocument[];
}

// Admin specific data
export interface Admin extends User {
  society_id: string;
  designation: string;
}

// Society structure
export interface Society {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_flats: number;
  description?: string;
  admin_id: string;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

// Utility Worker structure
export interface UtilityWorker {
  id: string;
  name: string;
  role: string;
  phone?: string;
  society_id: string;
  created_at: string;
  updated_at: string;
}

// Notice structure
export interface Notice {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'maintenance' | 'events' | 'emergency';
  society_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

// Service/Maintenance Request
export interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
  tenant_id: string;
  society_id: string;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
  comments?: ServiceRequestComment[];
}

// Service Request Comments
export interface ServiceRequestComment {
  id: string;
  request_id: string;
  user_id: string;
  user_role: UserRole;
  content: string;
  created_at: string;
}

// Property Listing
export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'rent' | 'sale';
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  society_id: string;
  owner_id: string;
  status: 'available' | 'rented' | 'sold';
  images: string[];
  address: string;
  created_at: string;
  updated_at: string;
}

// Tenant Document
export interface TenantDocument {
  id: string;
  name: string;
  type: 'identity' | 'lease' | 'utility' | 'other';
  file_path: string;
  file_size: string;
  status: 'pending' | 'verified' | 'rejected';
  tenant_id: string;
  society_id: string;
  uploaded_at: string;
  verified_at?: string;
  verified_by?: string;
}

/*
Supabase Table Structure:

1. users
   - id (PK)
   - email
   - name
   - phone
   - role (tenant or admin)
   - created_at
   - updated_at

2. tenants
   - id (PK)
   - user_id (FK to users)
   - society_id (FK to societies)
   - flat_number
   - verification_status
   - created_at
   - updated_at

3. admins
   - id (PK)
   - user_id (FK to users)
   - society_id (FK to societies)
   - designation
   - created_at
   - updated_at

4. societies
   - id (PK)
   - name
   - address
   - city
   - state
   - pincode
   - total_flats
   - description
   - admin_id (FK to users)
   - created_at
   - updated_at

5. society_amenities
   - id (PK)
   - society_id (FK to societies)
   - amenity

6. utility_workers
   - id (PK)
   - name
   - role
   - phone
   - society_id (FK to societies)
   - created_at
   - updated_at

7. notices
   - id (PK)
   - title
   - content
   - category
   - society_id (FK to societies)
   - created_by (FK to users)
   - created_at
   - updated_at

8. service_requests
   - id (PK)
   - title
   - description
   - category
   - status
   - tenant_id (FK to users)
   - society_id (FK to societies)
   - assigned_to (FK to utility_workers, nullable)
   - created_at
   - updated_at

9. request_comments
   - id (PK)
   - request_id (FK to service_requests)
   - user_id (FK to users)
   - user_role
   - content
   - created_at

10. properties
   - id (PK)
   - title
   - description
   - type
   - price
   - bedrooms
   - bathrooms
   - area
   - society_id (FK to societies)
   - owner_id (FK to users)
   - status
   - address
   - created_at
   - updated_at

11. property_images
   - id (PK)
   - property_id (FK to properties)
   - image_url
   - created_at

12. tenant_documents
   - id (PK)
   - name
   - type
   - file_path
   - file_size
   - status
   - tenant_id (FK to users)
   - society_id (FK to societies)
   - uploaded_at
   - verified_at
   - verified_by (FK to users, nullable)
*/
