import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Calendar, Package, Clock, Plus, Loader2 } from "lucide-react";
import BookingDialog from "@/components/booking/BookingDialog";
import { format } from "date-fns";

interface Booking {
  id: string;
  pickup_date: string;
  status: string;
  address: string;
  created_at: string;
  pickup_time_slot: {
    slot_name: string;
  } | null;
}

interface Subscription {
  id: string;
  status: string;
  start_date: string;
  plan: {
    name: string;
    price: number;
    features: unknown;
  } | null;
}

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [showBookingDialog, setShowBookingDialog] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch bookings
      const { data: bookingsData, error: bookingsError } = await supabase
        .from("bookings")
        .select(`
          id,
          pickup_date,
          status,
          address,
          created_at,
          pickup_time_slot:time_slots!bookings_pickup_time_slot_id_fkey(slot_name)
        `)
        .eq("user_id", user!.id)
        .order("pickup_date", { ascending: false })
        .limit(10);

      if (bookingsError) throw bookingsError;
      setBookings(bookingsData || []);

      // Fetch active subscription
      const { data: subData, error: subError } = await supabase
        .from("user_subscriptions")
        .select(`
          id,
          status,
          start_date,
          plan:plans(name, price, features)
        `)
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(subData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "confirmed":
        return "bg-blue-100 text-blue-800";
      case "picked_up":
      case "processing":
        return "bg-purple-100 text-purple-800";
      case "ready":
        return "bg-green-100 text-green-800";
      case "delivered":
        return "bg-green-200 text-green-900";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome Back!</h1>
            <p className="text-muted-foreground">Manage your laundry services</p>
          </div>
          <Button variant="hero" onClick={() => setShowBookingDialog(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Schedule Pickup
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {/* Current Plan */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" />
                Current Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div>
                  <p className="text-2xl font-bold">{subscription.plan?.name}</p>
                  <p className="text-muted-foreground">
                    ${subscription.plan?.price}/month
                  </p>
                  <p className="text-sm text-green-600 mt-2">Active</p>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-3">No active plan</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/plans")}>
                    Choose a Plan
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Total Bookings */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Total Pickups
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{bookings.length}</p>
              <p className="text-muted-foreground">All time</p>
            </CardContent>
          </Card>

          {/* Next Pickup */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Next Pickup
              </CardTitle>
            </CardHeader>
            <CardContent>
              {bookings.find((b) => b.status === "pending" || b.status === "confirmed") ? (
                <div>
                  <p className="text-xl font-bold">
                    {format(
                      new Date(
                        bookings.find(
                          (b) => b.status === "pending" || b.status === "confirmed"
                        )!.pickup_date
                      ),
                      "MMM d, yyyy"
                    )}
                  </p>
                  <p className="text-muted-foreground">
                    {
                      bookings.find((b) => b.status === "pending" || b.status === "confirmed")
                        ?.pickup_time_slot?.slot_name
                    }
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground">No upcoming pickups</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Bookings</CardTitle>
            <CardDescription>Your latest laundry pickups and deliveries</CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No bookings yet</p>
                <Button variant="outline" onClick={() => setShowBookingDialog(true)}>
                  Schedule Your First Pickup
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium">
                        {format(new Date(booking.pickup_date), "MMMM d, yyyy")}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {booking.pickup_time_slot?.slot_name}
                      </p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {booking.address}
                      </p>
                    </div>
                    <span
                      className={`mt-2 sm:mt-0 inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                        booking.status
                      )}`}
                    >
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1).replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <BookingDialog
        open={showBookingDialog}
        onOpenChange={setShowBookingDialog}
        onSuccess={fetchData}
        hasSubscription={!!subscription}
      />
    </div>
  );
};

export default Dashboard;
