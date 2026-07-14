import React, { useState } from "react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { User, Palette, Moon, Sun, Shield, LogOut, Bell } from "lucide-react";

export default function Settings() {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState(
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({ full_name: fullName });
      toast({ title: "Profile updated", description: "Your name has been saved." });
    } catch {
      toast({ title: "Update failed", description: "Please try again.", variant: "destructive" });
    }
    setSaving(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    try {
      localStorage.setItem("theme", newTheme);
    } catch {}
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Profile</h2>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Full Name</Label>
          <Input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
            className="mt-1"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground">Email</Label>
          <Input value={user?.email || ""} disabled className="mt-1" />
        </div>
        <Button onClick={handleSaveProfile} disabled={saving} className="gap-2">
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Appearance */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {theme === "dark" ? <Moon className="w-5 h-5 text-muted-foreground" /> : <Sun className="w-5 h-5 text-muted-foreground" />}
            <div>
              <p className="text-sm font-medium">{theme === "dark" ? "Dark Mode" : "Light Mode"}</p>
              <p className="text-xs text-muted-foreground">Toggle between dark and light themes</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Switch to {theme === "dark" ? "Light" : "Dark"}
          </Button>
        </div>
      </div>

      {/* Privacy */}
      <div className="rounded-xl border border-border bg-card p-5 space-y-3">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-primary" />
          <h2 className="font-semibold text-sm">Privacy & Security</h2>
        </div>
        <div className="space-y-2 text-sm text-muted-foreground">
          <p>• All your trade reviews are private and visible only to you.</p>
          <p>• Your data is encrypted and never shared with third parties.</p>
          <p>• AI analysis runs on your data to provide personalized insights.</p>
          <p>• You can delete any review at any time.</p>
        </div>
      </div>

      {/* Account */}
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <LogOut className="w-4 h-4 text-rose-400" />
          <h2 className="font-semibold text-sm text-rose-400">Account</h2>
        </div>
        <Button variant="outline" onClick={() => logout()} className="gap-2 text-rose-400 border-rose-500/20 hover:bg-rose-500/10">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
