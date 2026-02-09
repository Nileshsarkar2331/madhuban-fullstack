import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useCart } from "@/hooks/use-cart";

type DeliveryDetails = {
  id: string;
  name: string;
  phone: string;
  altPhone: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  instructions: string;
};

const STORAGE_KEY = "delivery_addresses_v1";

const emptyDetails: DeliveryDetails = {
  id: "",
  name: "",
  phone: "",
  altPhone: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  city: "",
  state: "",
  pincode: "",
  instructions: "",
};

const Checkout = () => {
  const navigate = useNavigate();
  const { items: cartItems } = useCart();
  const [addresses, setAddresses] = useState<DeliveryDetails[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [details, setDetails] = useState<DeliveryDetails>(emptyDetails);
  const [editMode, setEditMode] = useState(true);
  const [addingNew, setAddingNew] = useState(false);
  const [showSelector, setShowSelector] = useState(false);
  const [errors, setErrors] = useState<{ phone?: string; altPhone?: string }>(
    {}
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as DeliveryDetails[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAddresses(parsed);
          setSelectedId(parsed[0].id);
          setDetails({ ...emptyDetails, ...parsed[0] });
          setEditMode(false);
          setAddingNew(false);
          setShowSelector(false);
        }
      } catch {
        setDetails(emptyDetails);
      }
    }
  }, []);

  const grandTotal = useMemo(
    () =>
      cartItems.reduce(
        (sum, item) => sum + (item.price || 0) * item.quantity,
        0
      ),
    [cartItems]
  );

  const normalize = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const freeDeliveryAreas = new Set([
    "taigor nagar",
    "main market",
    "indra market",
  ]);

  const normalizedVillage = normalize(details.state || "");
  const compactVillage = normalizedVillage.replace(/\s+/g, "");
  const isFreeDeliveryArea =
    freeDeliveryAreas.has(normalizedVillage) ||
    freeDeliveryAreas.has(compactVillage);

  const freeDeliveryThreshold = isFreeDeliveryArea ? 100 : 200;
  const deliveryFee = grandTotal >= freeDeliveryThreshold ? 0 : 30;
  const gst = Math.round(grandTotal * 0.05);
  const orderTotal = grandTotal + deliveryFee + gst;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setDetails((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nextErrors: { phone?: string; altPhone?: string } = {};
    const phoneDigits = details.phone.replace(/\D/g, "");
    const altDigits = details.altPhone.replace(/\D/g, "");

    if (phoneDigits.length !== 10) {
      nextErrors.phone = "Phone number must be 10 digits";
    }
    if (details.altPhone) {
      if (altDigits.length !== 10) {
        nextErrors.altPhone = "Alternate phone must be 10 digits";
      } else if (altDigits === phoneDigits) {
        nextErrors.altPhone = "Alternate phone must be different";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const newId = details.id || `${Date.now()}`;
    const nextDetails = { ...details, id: newId };
    const nextAddresses = addresses.some((a) => a.id === newId)
      ? addresses.map((a) => (a.id === newId ? nextDetails : a))
      : [nextDetails, ...addresses];
    setAddresses(nextAddresses);
    setSelectedId(newId);
    setDetails(nextDetails);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextAddresses));
    setEditMode(false);
    setAddingNew(false);
    setShowSelector(false);
  };

  return (
    <div className="min-h-screen bg-background px-4 py-12 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
        <Button variant="outline" onClick={() => navigate("/cart")}>
          Back to Cart
        </Button>
      </div>

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <Card className="card-restaurant">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Delivering To</CardTitle>
            {!editMode && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setShowSelector(true);
                    setEditMode(false);
                    setAddingNew(false);
                  }}
                >
                  Change
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setDetails({ ...emptyDetails, id: "" });
                    setEditMode(true);
                    setAddingNew(true);
                    setShowSelector(false);
                  }}
                >
                  Add New
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {showSelector && !editMode ? (
              <div className="space-y-3">
                <div className="text-sm font-medium text-foreground">
                  Select a delivery address
                </div>
                <div className="space-y-2">
                  {addresses.map((addr) => {
                    const isSelected = selectedId === addr.id;
                    return (
                      <label
                        key={addr.id}
                        className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border/60"
                        }`}
                      >
                        <input
                          type="radio"
                          name="selectedAddress"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedId(addr.id);
                            setDetails({ ...emptyDetails, ...addr });
                          }}
                          className="mt-1"
                        />
                        <div className="space-y-1">
                          <div className="font-medium">{addr.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {addr.addressLine1}
                            {addr.addressLine2 ? `, ${addr.addressLine2}` : ""}
                            {addr.landmark ? `, ${addr.landmark}` : ""}
                            {addr.city ? `, ${addr.city}` : ""}
                            {addr.state ? `, ${addr.state}` : ""}
                            {addr.pincode ? ` - ${addr.pincode}` : ""}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            Phone: {addr.phone}
                            {addr.altPhone ? ` | Alt: ${addr.altPhone}` : ""}
                          </div>
                        </div>
                      </label>
                    );
                  })}
                </div>
                <Button
                  type="button"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    const found = addresses.find((a) => a.id === selectedId);
                    if (found) {
                      setDetails({ ...emptyDetails, ...found });
                      setEditMode(false);
                      setShowSelector(false);
                    }
                  }}
                >
                  Deliver to this address
                </Button>
              </div>
            ) : editMode ? (
              <form onSubmit={handleSave} className="space-y-4">
                {addresses.length > 0 && !addingNew && (
                  <div className="flex items-center justify-between rounded-md border border-border/60 p-3 text-sm">
                    <span className="text-muted-foreground">
                      Want to add a different address?
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      onClick={() => {
                        setDetails({ ...emptyDetails, id: "" });
                        setAddingNew(true);
                      }}
                    >
                      Add New
                    </Button>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  <Input
                    name="name"
                    placeholder="Full Name"
                    value={details.name}
                    onChange={handleChange}
                    required
                  />
                  <div className="space-y-1">
                    <Input
                      name="phone"
                      placeholder="Phone Number"
                      value={details.phone}
                      onChange={handleChange}
                      required
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-1">
                  <Input
                    name="altPhone"
                    placeholder="Alternate Phone (optional)"
                    value={details.altPhone}
                    onChange={handleChange}
                  />
                  {errors.altPhone && (
                    <p className="text-xs text-red-500">{errors.altPhone}</p>
                  )}
                </div>

                <Input
                  name="addressLine1"
                  placeholder="House/Flat No., Street"
                  value={details.addressLine1}
                  onChange={handleChange}
                  required
                />
                <Input
                  name="addressLine2"
                  placeholder="Area/Locality"
                  value={details.addressLine2}
                  onChange={handleChange}
                />

                <div className="grid sm:grid-cols-3 gap-4">
                  <Input
                    name="landmark"
                    placeholder="Landmark"
                    value={details.landmark}
                    onChange={handleChange}
                  />
                  <Input
                    name="city"
                    placeholder="City"
                    value={details.city}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    name="state"
                    placeholder="Village"
                    value={details.state}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Input
                  name="pincode"
                  placeholder="Pincode"
                  value={details.pincode}
                  onChange={handleChange}
                  required
                />

                <Textarea
                  name="instructions"
                  placeholder="Delivery instructions (optional)"
                  value={details.instructions}
                  onChange={handleChange}
                />

                <Button type="submit" className="w-full sm:w-auto">
                  Save Address
                </Button>
              </form>
            ) : (
              <div className="space-y-2 relative">
                <div className="font-semibold">{details.name}</div>
                <div className="text-muted-foreground">
                  {details.addressLine1}
                  {details.addressLine2 ? `, ${details.addressLine2}` : ""}
                  {details.landmark ? `, ${details.landmark}` : ""}
                  {details.city ? `, ${details.city}` : ""}
                  {details.state ? `, ${details.state}` : ""}
                  {details.pincode ? ` - ${details.pincode}` : ""}
                </div>
                <div className="text-muted-foreground">
                  Phone: {details.phone}
                  {details.altPhone ? ` | Alt: ${details.altPhone}` : ""}
                </div>
                {details.instructions && (
                  <div className="text-muted-foreground">
                    Instructions: {details.instructions}
                  </div>
                )}
                <div className="absolute right-0 bottom-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setEditMode(true);
                      setAddingNew(false);
                      setShowSelector(false);
                    }}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="card-restaurant h-fit">
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span>Items</span>
              <span>₹{grandTotal}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>Delivery</span>
              <span>{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span>GST (5%)</span>
              <span>₹{gst}</span>
            </div>
            <div className="flex items-center justify-between text-lg font-semibold pt-2">
              <span>Order Total</span>
              <span>₹{orderTotal}</span>
            </div>
            {grandTotal < freeDeliveryThreshold && (
              <div className="text-sm text-muted-foreground">
                Add ₹{freeDeliveryThreshold - grandTotal} more for free delivery.
              </div>
            )}
            <Button className="w-full" disabled={editMode || cartItems.length === 0}>
              Place Order
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;
