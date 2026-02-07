import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Check, Clock, Sparkles, Shield, Leaf, Star } from "lucide-react";

const services = [
  {
    id: "wash-fold",
    title: "Wash & Fold",
    description: "Professional washing and folding service for your everyday clothes",
    fullDescription: "Our wash and fold service is perfect for busy professionals and families. We carefully sort your laundry, wash it with premium detergents, and fold everything neatly. Your clothes come back fresh, clean, and ready to wear or store.",
    icon: Sparkles,
    color: "from-blue-500 to-cyan-500",
    features: [
      "Sorted by color and fabric type",
      "Premium eco-friendly detergents",
      "Careful stain pre-treatment",
      "Perfectly folded and organized",
      "Available for same-day service",
      "Weight-based pricing"
    ],
    process: [
      "Drop off or schedule pickup",
      "We sort and inspect items",
      "Wash with care",
      "Dry at optimal temperature",
      "Fold neatly",
      "Ready for pickup or delivery"
    ],
    pricing: "$1.50/lb"
  },
  {
    id: "dry-cleaning",
    title: "Dry Cleaning",
    description: "Expert dry cleaning for delicate and formal wear",
    fullDescription: "Trust your finest garments to our professional dry cleaning service. We use state-of-the-art equipment and eco-friendly solvents to clean suits, dresses, silk, wool, and other delicate fabrics that require special care.",
    icon: Star,
    color: "from-purple-500 to-pink-500",
    features: [
      "Expert handling of delicates",
      "Eco-friendly cleaning solvents",
      "Professional pressing and finishing",
      "Minor repairs included",
      "Wedding dress cleaning available",
      "Suit and formal wear specialists"
    ],
    process: [
      "Garment inspection",
      "Stain identification and treatment",
      "Gentle dry cleaning process",
      "Hand pressing and finishing",
      "Quality inspection",
      "Packaging and delivery"
    ],
    pricing: "Starting at $8/item"
  },
  {
    id: "ironing",
    title: "Ironing & Pressing",
    description: "Crisp, wrinkle-free clothes ready to wear",
    fullDescription: "Get perfectly pressed clothes without the hassle. Our professional ironing service ensures your shirts, pants, and other garments look crisp and professional. Perfect for business attire and special occasions.",
    icon: Shield,
    color: "from-amber-500 to-orange-500",
    features: [
      "Professional steam pressing",
      "Crease perfection",
      "Collar and cuff attention",
      "Hang or fold options",
      "Quick turnaround available",
      "Bulk discounts for businesses"
    ],
    process: [
      "Sort by fabric type",
      "Apply appropriate heat settings",
      "Steam and press carefully",
      "Attention to details",
      "Final inspection",
      "Hang or fold as requested"
    ],
    pricing: "$3/item"
  },
  {
    id: "eco-friendly",
    title: "Eco-Friendly Wash",
    description: "Sustainable cleaning with organic products",
    fullDescription: "Our eco-friendly wash service uses only organic, biodegradable detergents and cold water washing techniques to minimize environmental impact. Perfect for those who care about sustainability without compromising on clean.",
    icon: Leaf,
    color: "from-green-500 to-emerald-500",
    features: [
      "100% organic detergents",
      "Cold water washing",
      "Biodegradable packaging",
      "Carbon-neutral delivery",
      "Safe for sensitive skin",
      "Plant-based fabric softeners"
    ],
    process: [
      "Sort and inspect items",
      "Use organic detergents",
      "Cold water wash cycle",
      "Air dry when possible",
      "Eco-friendly packaging",
      "Carbon-neutral delivery"
    ],
    pricing: "$2.00/lb"
  }
];

const ServiceDetails = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
        <Navbar />
        <div className="container mx-auto px-4 pt-24 pb-12 text-center">
          <h1 className="text-3xl font-bold mb-4">Service Not Found</h1>
          <p className="text-muted-foreground mb-6">The service you're looking for doesn't exist.</p>
          <Button variant="hero" onClick={() => navigate("/")}>
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  const Icon = service.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-12">
        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        {/* Hero Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <div className="animate-fade-in">
            <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${service.color} mb-6`}>
              <Icon className="h-12 w-12 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-muted-foreground mb-6">{service.fullDescription}</p>
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-primary">
                <Clock className="h-5 w-5" />
                <span>24-48 hour turnaround</span>
              </div>
              <span className="text-2xl font-bold text-primary">{service.pricing}</span>
            </div>
            <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
              Get Started
            </Button>
          </div>

          {/* Features Card */}
          <Card className="animate-fade-in-right">
            <CardHeader>
              <CardTitle>What's Included</CardTitle>
              <CardDescription>Everything you get with this service</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-4 h-4 text-primary" />
                  </div>
                  <span>{feature}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Process Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
            {service.process.map((step, index) => (
              <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${service.color} text-white flex items-center justify-center mx-auto mb-4 font-bold`}>
                  {index + 1}
                </div>
                <p className="text-sm">{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary/10 to-secondary/10 border-0">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Sign up today and experience the convenience of professional laundry service. 
              Your first pickup is just a click away.
            </p>
            <div className="flex gap-4 justify-center">
              <Button variant="hero" size="lg" onClick={() => navigate("/signup")}>
                Create Account
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate("/plans")}>
                View Plans
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceDetails;
