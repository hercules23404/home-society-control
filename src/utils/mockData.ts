
// Consistent mock data for the entire application

// Society data
export const mockSociety = {
  id: 'test-society-id',
  name: 'Green Valley Apartments',
  address: '123 Park Avenue',
  city: 'Mumbai',
  state: 'Maharashtra',
  zip: '400001',
  zip_code: '400001', // For compatibility with different field names
  total_units: 100,
  totalFlats: 100, // For compatibility with different field names
  occupiedFlats: 85,
  establishedYear: 2018,
  registrationNumber: 'MHSOC123456',
  email: 'admin@greenvalley.com',
  phone: '+91 98765 43210',
  description: 'A premium residential society in the heart of Mumbai',
  amenities: [
    'Swimming Pool',
    'Gym',
    'Community Hall',
    'Children\'s Play Area',
    'Gardens',
    'CCTV Surveillance',
    '24/7 Security',
    'Power Backup',
    'Rainwater Harvesting',
  ]
};

// Admin data
export const mockAdmin = {
  id: 'test-admin-id', 
  email: 'admin@example.com',
  name: 'Rahul Sharma',
  phone: '+91 98765 43210',
  role: 'admin',
  designation: 'Society Manager',
  society_id: 'test-society-id',
};

// Tenant data
export const mockTenants = [
  {
    id: '1',
    user_id: 'tenant-user-1',
    name: 'Amit Kumar',
    email: 'amit.kumar@example.com',
    phone: '+91 98765 43210',
    flat: 'A-101',
    flat_number: 'A-101',
    status: 'verified',
    verification_status: 'verified',
    joinedOn: 'Mar 15, 2025',
    created_at: '2025-03-15T10:00:00Z',
    role: 'tenant',
    society_id: 'test-society-id',
  },
  {
    id: '2',
    user_id: 'tenant-user-2',
    name: 'Priya Singh',
    email: 'priya.singh@example.com',
    phone: '+91 87654 32109',
    flat: 'B-205',
    flat_number: 'B-205',
    status: 'pending',
    verification_status: 'pending',
    joinedOn: 'Apr 2, 2025',
    created_at: '2025-04-02T10:00:00Z',
    role: 'tenant',
    society_id: 'test-society-id',
  },
  {
    id: '3',
    user_id: 'tenant-user-3',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@example.com',
    phone: '+91 76543 21098',
    flat: 'C-304',
    flat_number: 'C-304',
    status: 'verified',
    verification_status: 'verified',
    joinedOn: 'Feb 20, 2025',
    created_at: '2025-02-20T10:00:00Z',
    role: 'tenant',
    society_id: 'test-society-id',
  },
  {
    id: '4',
    user_id: 'tenant-user-4',
    name: 'Neha Gupta',
    email: 'neha.gupta@example.com',
    phone: '+91 65432 10987',
    flat: 'D-402',
    flat_number: 'D-402',
    status: 'rejected',
    verification_status: 'rejected',
    joinedOn: 'Jan 10, 2025',
    created_at: '2025-01-10T10:00:00Z',
    role: 'tenant',
    society_id: 'test-society-id',
  },
  {
    id: '5',
    user_id: 'tenant-user-5',
    name: 'Vikram Malhotra',
    email: 'vikram.m@example.com',
    phone: '+91 54321 09876',
    flat: 'E-501',
    flat_number: 'E-501',
    status: 'verified',
    verification_status: 'verified',
    joinedOn: 'Mar 5, 2025',
    created_at: '2025-03-05T10:00:00Z',
    role: 'tenant',
    society_id: 'test-society-id',
  },
];

// Current logged-in tenant (for tenant views)
export const mockCurrentTenant = mockTenants[0];

// Properties/Flats data
export const mockProperties = [
  {
    id: 'prop-1',
    title: 'Spacious 2BHK with Balcony',
    description: 'A well-ventilated apartment with modern amenities',
    type: 'rent',
    property_type: 'apartment',
    price: 25000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    area_sqft: 1200,
    society_id: 'test-society-id',
    owner_id: 'owner-1',
    status: 'available',
    images: ['https://placehold.co/600x400?text=Apartment+Image'],
    address: 'A-101, Green Valley Apartments',
    created_at: '2025-01-15T10:00:00Z',
    updated_at: '2025-04-01T10:00:00Z',
    amenities: ['Air Conditioning', 'Modular Kitchen', 'Power Backup'],
    city: 'Mumbai',
    state: 'Maharashtra',
    zip_code: '400001',
  },
  {
    id: 'prop-2',
    title: '3BHK Premium Apartment',
    description: 'Luxurious apartment with premium fittings',
    type: 'rent',
    property_type: 'apartment',
    price: 35000,
    bedrooms: 3,
    bathrooms: 2,
    area: 1500,
    area_sqft: 1500,
    society_id: 'test-society-id',
    owner_id: 'owner-2',
    status: 'rented',
    images: ['https://placehold.co/600x400?text=Premium+Apartment'],
    address: 'B-205, Green Valley Apartments',
    created_at: '2025-02-10T10:00:00Z',
    updated_at: '2025-04-05T10:00:00Z',
    amenities: ['Air Conditioning', 'Modular Kitchen', 'Power Backup', 'Swimming Pool Access'],
    city: 'Mumbai',
    state: 'Maharashtra',
    zip_code: '400001',
  },
  {
    id: 'prop-3',
    title: 'Cozy 1BHK Studio',
    description: 'Perfect for singles or young couples',
    type: 'rent',
    property_type: 'studio',
    price: 18000,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    area_sqft: 650,
    society_id: 'test-society-id',
    owner_id: 'owner-1',
    status: 'available',
    images: ['https://placehold.co/600x400?text=Studio+Apartment'],
    address: 'C-304, Green Valley Apartments',
    created_at: '2025-01-20T10:00:00Z',
    updated_at: '2025-03-15T10:00:00Z',
    amenities: ['Air Conditioning', 'Power Backup'],
    city: 'Mumbai',
    state: 'Maharashtra',
    zip_code: '400001',
  },
];

// Maintenance/Service Requests
export const mockRequests = [
  {
    id: '1',
    title: 'Plumbing Issue in Bathroom',
    description: 'There is a water leakage under the sink in the master bathroom.',
    status: 'in-progress',
    date: 'Apr 9, 2025',
    category: 'Plumbing',
    issue_type: 'Plumbing',
    tenant_id: 'tenant-user-1',
    tenant: 'Amit Kumar',
    flat: 'A-101',
    society_id: 'test-society-id',
    assignedTo: 'John Smith',
    assigned_worker: 'utility-worker-1',
  },
  {
    id: '2',
    title: 'Electrical Socket Not Working',
    description: 'The electrical socket in the living room is not working properly.',
    status: 'pending',
    date: 'Apr 8, 2025',
    category: 'Electrical',
    issue_type: 'Electrical',
    tenant_id: 'tenant-user-2',
    tenant: 'Priya Singh',
    flat: 'B-205',
    society_id: 'test-society-id',
  },
  {
    id: '3',
    title: 'Water Leakage from Ceiling',
    description: 'Water is leaking from the ceiling in the living room when it rains heavily.',
    status: 'pending',
    date: 'Apr 7, 2025',
    category: 'Structural',
    issue_type: 'Structural',
    tenant_id: 'tenant-user-3',
    tenant: 'Rahul Sharma',
    flat: 'C-304',
    society_id: 'test-society-id',
  },
  {
    id: '4',
    title: 'Main Door Lock Issue',
    description: 'The main door lock is not working properly, difficult to open with key.',
    status: 'resolved',
    date: 'Apr 5, 2025',
    category: 'Carpentry',
    issue_type: 'Carpentry',
    tenant_id: 'tenant-user-4',
    tenant: 'Neha Gupta',
    flat: 'D-402',
    society_id: 'test-society-id',
    assignedTo: 'Ganesh Rao',
    assigned_worker: 'utility-worker-5',
  },
];

// Notices
export const mockNotices = [
  {
    id: '1',
    title: 'Water Supply Interruption',
    content: 'Due to maintenance work, water supply will be interrupted on Saturday from 10 AM to 2 PM.',
    date: 'Apr 10, 2025',
    category: 'maintenance',
    notice_type: 'maintenance',
    society_id: 'test-society-id',
    created_by: 'test-admin-id',
    created_at: '2025-04-10T10:00:00Z',
  },
  {
    id: '2',
    title: 'Monthly Society Meeting',
    content: 'The monthly society meeting will be held on Sunday at the community hall at 4 PM.',
    date: 'Apr 15, 2025',
    category: 'events',
    notice_type: 'events',
    society_id: 'test-society-id',
    created_by: 'test-admin-id',
    created_at: '2025-04-05T10:00:00Z',
  },
  {
    id: '3',
    title: 'Fire Safety Drill',
    content: 'A mandatory fire safety drill will be conducted on April 20th at 11 AM. All residents are requested to participate.',
    date: 'Apr 18, 2025',
    category: 'emergency',
    notice_type: 'emergency',
    society_id: 'test-society-id',
    created_by: 'test-admin-id',
    created_at: '2025-04-01T10:00:00Z',
    is_pinned: true,
  },
];

// Utility Workers
export const mockUtilityWorkers = [
  {
    id: 'utility-worker-1',
    name: 'Ramesh Sharma',
    role: 'Security Guard',
    phone: '+91 87654 32109',
    shiftTiming: 'Morning (6 AM - 2 PM)',
    society_id: 'test-society-id',
    is_active: true,
  },
  {
    id: 'utility-worker-2',
    name: 'Suresh Kumar',
    role: 'Security Guard',
    phone: '+91 76543 21098',
    shiftTiming: 'Evening (2 PM - 10 PM)',
    society_id: 'test-society-id',
    is_active: true,
  },
  {
    id: 'utility-worker-3',
    name: 'Mahesh Patil',
    role: 'Security Guard',
    phone: '+91 65432 10987',
    shiftTiming: 'Night (10 PM - 6 AM)',
    society_id: 'test-society-id',
    is_active: true,
  },
  {
    id: 'utility-worker-4',
    name: 'Lakshmi Devi',
    role: 'Housekeeper',
    phone: '+91 54321 09876',
    shiftTiming: 'Morning (7 AM - 3 PM)',
    society_id: 'test-society-id',
    is_active: true,
  },
  {
    id: 'utility-worker-5',
    name: 'Ganesh Rao',
    role: 'Plumber',
    phone: '+91 43210 98765',
    shiftTiming: 'On Call',
    society_id: 'test-society-id',
    is_active: true,
  },
  {
    id: 'utility-worker-6',
    name: 'Rajesh Kumar',
    role: 'Electrician',
    phone: '+91 32109 87654',
    shiftTiming: 'On Call',
    society_id: 'test-society-id',
    is_active: true,
  },
];

// Tenant Documents
export const mockDocuments = [
  {
    id: 'doc-1',
    tenant_id: 'tenant-user-1',
    name: 'Rental Agreement',
    type: 'lease',
    file_path: 'https://placehold.co/400x500?text=Lease+Document',
    file_size: '1.2 MB',
    status: 'verified',
    uploaded_at: '2025-03-16T10:00:00Z',
    society_id: 'test-society-id',
  },
  {
    id: 'doc-2',
    tenant_id: 'tenant-user-1',
    name: 'ID Proof',
    type: 'identity',
    file_path: 'https://placehold.co/400x500?text=ID+Document',
    file_size: '800 KB',
    status: 'verified',
    uploaded_at: '2025-03-16T10:00:00Z',
    society_id: 'test-society-id',
  },
  {
    id: 'doc-3',
    tenant_id: 'tenant-user-2',
    name: 'Rental Agreement',
    type: 'lease',
    file_path: 'https://placehold.co/400x500?text=Lease+Document',
    file_size: '1.1 MB',
    status: 'pending',
    uploaded_at: '2025-04-03T10:00:00Z',
    society_id: 'test-society-id',
  }
];

// Rent Payments
export const mockRentPayments = [
  {
    id: 'payment-1',
    tenant_id: 'tenant-user-1',
    property_id: 'prop-1',
    society_id: 'test-society-id',
    amount: 25000,
    payment_status: 'paid',
    due_date: '2025-04-05',
    paid_date: '2025-04-03',
    payment_method: 'UPI',
    transaction_id: 'TXN123456789',
  },
  {
    id: 'payment-2',
    tenant_id: 'tenant-user-2',
    property_id: 'prop-2',
    society_id: 'test-society-id',
    amount: 35000,
    payment_status: 'pending',
    due_date: '2025-04-10',
    payment_method: null,
    transaction_id: null,
  },
];
