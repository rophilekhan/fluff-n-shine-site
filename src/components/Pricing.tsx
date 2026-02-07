import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

const Pricing = () => {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Basic",
      price: "$29",
      period: "/month",
      description: "Perfect for individuals",
      features: [
        "Up to 20 lbs per month",
        "Standard wash & fold",
        "Free pickup & delivery",
        "48-hour turnaround",
        "Basic stain treatment"
      ],
      popular: false
    },
    {
      name: "Premium",
      price: "$59",
      period: "/month",
      description: "Best for families",
      features: [
        "Up to 50 lbs per month",
        "Wash, fold & dry cleaning",
        "Priority pickup & delivery",
        "24-hour turnaround",
        "Advanced stain removal",
        "Garment repairs included",
        "Eco-friendly detergents"
      ],
      popular: true
    },
    {
      name: "Business",
      price: "$199",
      period: "/month",
      description: "For hotels & restaurants",
      features: [
        "Unlimited laundry",
        "Commercial-grade cleaning",
        "Same-day service",
        "Dedicated account manager",
        "Custom pickup schedule",
        "Linen & uniform service",
        "Volume discounts",
        "24/7 support"
      ],
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={plan.name}
              className={`relative hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 animate-fade-in ${
                plan.popular ? "border-primary border-2 shadow-xl scale-105" : "border-2"
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
              )}
              
              <CardHeader className="text-center pb-8 pt-8">
                <CardTitle className="text-2xl mb-2">{plan.name}</CardTitle>
                <CardDescription className="text-base">{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </CardContent>
              
              <CardFooter>
                <Button 
                  variant={plan.popular ? "hero" : "outline"}
                  className="w-full"
                  size="lg"
                  onClick={() => navigate("/plans")}
                >
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
