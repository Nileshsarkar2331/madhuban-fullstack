import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const ThankYou = () => {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="max-w-2xl mx-auto text-center">
        <div className="text-3xl sm:text-4xl font-bold text-primary mb-4">
          Thank you for your order!
        </div>
        <p className="text-muted-foreground text-lg mb-6">
          Your order will be delivered within 35–40 minutes.
        </p>
        <p className="text-muted-foreground mb-8">
          For more information, contact us at{" "}
          <span className="font-semibold text-primary">+91 7500111774</span>.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={() => navigate("/")}>Back to Home</Button>
          <Button variant="outline" onClick={() => navigate("/menu")}>
            Order More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
