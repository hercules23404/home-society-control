
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDown, ArrowUp, Wallet, Calendar, Clock, CheckCircle, XCircle, Plus, Download, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data for rent payments
const mockPayments = [
  {
    id: "pay-1",
    property_id: "prop-1",
    tenant_id: "test-tenant-id",
    tenant_name: "Priya Singh",
    amount: 15000,
    due_date: "2023-11-01",
    paid_date: "2023-10-28",
    status: "paid",
    late_fee: 0,
    payment_method: "UPI",
    property_name: "Green Valley Apartment A-101"
  },
  {
    id: "pay-2",
    property_id: "prop-1",
    tenant_id: "test-tenant-id",
    tenant_name: "Priya Singh",
    amount: 15000,
    due_date: "2023-12-01",
    paid_date: "2023-12-05",
    status: "paid",
    late_fee: 500,
    payment_method: "Bank Transfer",
    property_name: "Green Valley Apartment A-101"
  },
  {
    id: "pay-3",
    property_id: "prop-1",
    tenant_id: "test-tenant-id",
    tenant_name: "Priya Singh",
    amount: 15000,
    due_date: "2024-01-01",
    paid_date: null,
    status: "due",
    late_fee: 0,
    payment_method: null,
    property_name: "Green Valley Apartment A-101"
  },
  {
    id: "pay-4",
    property_id: "prop-2",
    tenant_id: "user-2",
    tenant_name: "Amit Sharma",
    amount: 18000,
    due_date: "2023-12-01",
    paid_date: "2023-12-01",
    status: "paid",
    late_fee: 0,
    payment_method: "Bank Transfer",
    property_name: "Green Valley Apartment B-203"
  },
  {
    id: "pay-5",
    property_id: "prop-2",
    tenant_id: "user-2",
    tenant_name: "Amit Sharma",
    amount: 18000,
    due_date: "2024-01-01",
    paid_date: null,
    status: "due",
    late_fee: 0,
    payment_method: null,
    property_name: "Green Valley Apartment B-203"
  },
];

const AdminPaymentsPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter payments based on search term and status
  const filteredPayments = mockPayments
    .filter(payment => {
      if (statusFilter === "all") return true;
      return payment.status === statusFilter;
    })
    .filter(payment => 
      payment.property_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.tenant_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      } else {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
    });

  // Calculate statistics
  const totalDue = mockPayments
    .filter(payment => payment.status === "due")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPaid = mockPayments
    .filter(payment => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalLateFees = mockPayments
    .filter(payment => payment.late_fee > 0)
    .reduce((sum, payment) => sum + payment.late_fee, 0);

  return (
    <DashboardLayout role="admin">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Payment Management</h1>
        <p className="text-rental-text-light">
          Track and manage rent payments across all properties
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Due</p>
                <h3 className="text-2xl font-bold mt-1">₹{totalDue.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-red-50 rounded-full text-red-600">
                <Wallet className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Collected (YTD)</p>
                <h3 className="text-2xl font-bold mt-1">₹{totalPaid.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-green-50 rounded-full text-green-600">
                <CheckCircle className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Late Fees Collected</p>
                <h3 className="text-2xl font-bold mt-1">₹{totalLateFees.toLocaleString()}</h3>
              </div>
              <div className="p-2 bg-amber-50 rounded-full text-amber-600">
                <Clock className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search by tenant or property..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="due">Due</SelectItem>
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline"
            className="gap-1"
            onClick={() => setSortOrder(sortOrder === 'newest' ? 'oldest' : 'newest')}
          >
            {sortOrder === 'newest' ? (
              <>
                <ArrowDown className="h-4 w-4" />
                Newest
              </>
            ) : (
              <>
                <ArrowUp className="h-4 w-4" />
                Oldest
              </>
            )}
          </Button>
          
          <Button className="bg-rental-primary hover:bg-rental-secondary">
            <Plus className="h-4 w-4 mr-2" />
            Generate Invoices
          </Button>
        </div>
      </div>
      
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No payments found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm || statusFilter !== "all" ? 'Try different search criteria' : 'There are no payment records yet'}
          </p>
        </div>
      ) : (
        <Card className="shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle>Payment Records</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Tenant</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Paid On</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Late Fee</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">{payment.property_name}</TableCell>
                    <TableCell>{payment.tenant_name}</TableCell>
                    <TableCell>{format(new Date(payment.due_date), "MMM d, yyyy")}</TableCell>
                    <TableCell>₹{payment.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge 
                        className={payment.status === "paid" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {payment.status === "paid" ? "Paid" : "Due"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {payment.paid_date ? format(new Date(payment.paid_date), "MMM d, yyyy") : "-"}
                    </TableCell>
                    <TableCell>{payment.payment_method || "-"}</TableCell>
                    <TableCell>
                      {payment.late_fee > 0 ? `₹${payment.late_fee.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        <Download className="h-3.5 w-3.5 mr-1" />
                        Receipt
                      </Button>
                      {payment.status === "due" && (
                        <Button size="sm" className="bg-rental-primary hover:bg-rental-secondary">
                          Mark Paid
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default AdminPaymentsPage;
