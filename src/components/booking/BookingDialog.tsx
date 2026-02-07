import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { format, addDays } from "date-fns";

interface TimeSlot {
  id: string;
  slot_name: string;
  start_time: string;
  end_time: string;
}

interface BookingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
  hasSubscription: boolean;
}

const BookingDialog = ({ open, onOpenChange, onSuccess, hasSubscription }: BookingDialogProps) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(addDays(new Date(), 1));
  const [selectedSlot, setSelectedSlot] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      fetchTimeSlots();
      fetchUserProfile();
    }
  }, [open]);

  const fetchTimeSlots = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .eq("is_active", true)
        .order("start_time");

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("address")
        .eq("user_id", user.id)
        .maybeSingle();

      if (error) throw error;
      if (data?.address) {
        setAddress(data.address);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSubmit = async () => {
    if (!user || !selectedDate || !selectedSlot || !address.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        user_id: user.id,
        pickup_date: format(selectedDate, "yyyy-MM-dd"),
        pickup_time_slot_id: selectedSlot,
        address: address.trim(),
        special_instructions: instructions.trim() || null,
        status: "pending",
      });

      if (error) throw error;

      toast({
        title: "Booking Confirmed!",
        description: "We'll pick up your laundry on the scheduled date.",
      });
      
      // Reset form
      setStep(1);
      setSelectedDate(addDays(new Date(), 1));
      setSelectedSlot("");
      setInstructions("");
      
      onOpenChange(false);
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasSubscription) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Choose a Plan First</DialogTitle>
            <DialogDescription>
              You need an active subscription to schedule pickups. Choose a plan that fits your needs.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={() => navigate("/plans")}>
              View Plans
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule a Pickup</DialogTitle>
          <DialogDescription>
            Step {step} of 3: {step === 1 ? "Choose Date" : step === 2 ? "Select Time Slot" : "Confirm Details"}
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            {step === 1 && (
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
              </div>
            )}

            {step === 2 && (
              <RadioGroup value={selectedSlot} onValueChange={setSelectedSlot} className="space-y-3">
                {timeSlots.map((slot) => (
                  <div
                    key={slot.id}
                    className={`flex items-center space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSlot === slot.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedSlot(slot.id)}
                  >
                    <RadioGroupItem value={slot.id} id={slot.id} />
                    <Label htmlFor={slot.id} className="cursor-pointer flex-1">
                      <span className="font-medium">{slot.slot_name}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                  <p className="text-sm text-muted-foreground">Pickup Date</p>
                  <p className="font-medium">
                    {selectedDate && format(selectedDate, "MMMM d, yyyy")}
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">Time Slot</p>
                  <p className="font-medium">
                    {timeSlots.find((s) => s.id === selectedSlot)?.slot_name}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Pickup Address *</Label>
                  <Input
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Enter your pickup address"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea
                    id="instructions"
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="Any special handling instructions..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </>
        )}

        <DialogFooter className="flex gap-2">
          {step > 1 && (
            <Button variant="outline" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          )}
          {step < 3 ? (
            <Button
              variant="hero"
              onClick={() => setStep(step + 1)}
              disabled={
                (step === 1 && !selectedDate) ||
                (step === 2 && !selectedSlot)
              }
            >
              Continue
            </Button>
          ) : (
            <Button variant="hero" onClick={handleSubmit} disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Booking...
                </>
              ) : (
                "Confirm Booking"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BookingDialog;
