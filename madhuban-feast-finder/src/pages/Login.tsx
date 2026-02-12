import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { API_BASE_URL } from "@/lib/api";
import { useNavigate, useLocation, Link } from "react-router-dom";
import heroImage from "@/assets/curry-hero.jpg";
import { useToast } from "@/hooks/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();

  // redirect back after login
  const redirectTo = (location.state as any)?.from || "/";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      const text = await res.text();
      let data: any = {};
      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        data = {};
      }

      if (!res.ok) {
        toast({
          title: "Login failed",
          description: data.message || "Please try again.",
          variant: "destructive",
        });
        return;
      }

      // ✅ Save JWT token
      localStorage.setItem("token", data.token);
      const savedUsername = data.user?.username || username.trim();
      if (savedUsername) {
        localStorage.setItem("username", savedUsername);
      }
      const isAdmin = Boolean(data.user?.isAdmin);
      localStorage.setItem("isAdmin", String(isAdmin));
      sessionStorage.setItem("justLoggedIn", "1");

      toast({
        title: "✅ Login successful",
        description: "Welcome back!",
      });
      navigate(isAdmin ? "/admin" : redirectTo, { replace: true });
    } catch (err) {
      console.error(err);
      toast({
        title: "❌ Server error",
        description: "Please try again in a moment.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      {loading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-white/90 px-6 py-5 shadow-xl">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <div className="text-sm font-medium text-foreground">
              Logging in...
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-md" />
      <Card className="w-full max-w-md relative z-10 shadow-2xl">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              type="text"
              placeholder="Username"
              value={username}
              required
              onChange={(e) => setUsername(e.target.value)}
            />

            <Input
              type="password"
              placeholder="Password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            New user?{" "}
            <Link className="text-primary hover:underline" to="/register">
              Create an account
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
