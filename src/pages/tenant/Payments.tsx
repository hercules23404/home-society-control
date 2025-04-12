
import React, { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ArrowDown, ArrowUp, Wallet, Calendar, Clock, CheckCircle, XCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

// Mock data for rent payments
const mockPayments = [
  {
    id: "pay-1",
    property_id: "prop-1",
    tenant_id: "test-tenant-id",
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
    amount: 15000,
    due_date: "2024-01-01",
    paid_date: null,
    status: "due",
    late_fee: 0,
    payment_method: null,
    property_name: "Green Valley Apartment A-101"
  },
];

const PaymentsPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  // Filter payments for the current tenant
  const tenantPayments = mockPayments.filter(payment => 
    payment.tenant_id === user?.id
  );

  // Further filter based on search term
  const filteredPayments = tenantPayments
    .filter(payment => 
      payment.property_name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.due_date).getTime() - new Date(a.due_date).getTime();
      } else {
        return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
      }
    });

  // Calculate statistics
  const totalDue = filteredPayments
    .filter(payment => payment.status === "due")
    .reduce((sum, payment) => sum + payment.amount, 0);
  
  const totalPaid = filteredPayments
    .filter(payment => payment.status === "paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const nextPayment = filteredPayments
    .filter(payment => payment.status === "due")
    .sort((a, b) => new Date(a.due_date).getTime() - new Date(b.due_date).getTime())[0];

  return (
    <DashboardLayout role="tenant">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2 text-rental-text">Rent Payments</h1>
        <p className="text-rental-text-light">
          View and manage your rent payments
        </p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Due Amount</p>
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
                <p className="text-sm text-muted-foreground">Total Paid (YTD)</p>
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
                <p className="text-sm text-muted-foreground">Next Payment</p>
                <h3 className="text-2xl font-bold mt-1">
                  {nextPayment 
                    ? format(new Date(nextPayment.due_date), "MMM d, yyyy")
                    : "No upcoming payments"}
                </h3>
              </div>
              <div className="p-2 bg-blue-50 rounded-full text-blue-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-between mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search payments..."
            className="pl-9"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm"
          className="ml-2 gap-1"
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
      </div>
      
      {filteredPayments.length === 0 ? (
        <div className="text-center py-12">
          <Wallet className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-2 text-lg font-medium">No payments found</h3>
          <p className="mt-1 text-gray-500">
            {searchTerm ? 'Try a different search term' : 'You do not have any payment records yet'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((payment) => (
            <Card key={payment.id} className="shadow-sm">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{payment.property_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      Due: {format(new Date(payment.due_date), "MMM d, yyyy")}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4 md:mt-0">
                    <div className="text-right md:text-left">
                      <Badge 
                        className={payment.status === "paid" 
                          ? "bg-green-100 text-green-800 hover:bg-green-100" 
                          : "bg-red-100 text-red-800 hover:bg-red-100"
                        }
                      >
                        {payment.status === "paid" ? "Paid" : "Due"}
                      </Badge>
                      <p className="text-xl font-bold mt-1">₹{payment.amount.toLocaleString()}</p>
                    </div>
                    
                    {payment.status === "paid" ? (
                      <div className="flex items-center text-sm text-muted-foreground gap-1">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        Paid on {format(new Date(payment.paid_date!), "MMM d, yyyy")}
                      </div>
                    ) : (
                      <Button className="bg-rental-primary hover:bg-rental-secondary">
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
                
                {payment.late_fee > 0 && (
                  <div className="mt-4 text-sm text-red-600 flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Late fee: ₹{payment.late_fee.toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default PaymentsPage;
