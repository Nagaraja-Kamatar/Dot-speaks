import { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleGate, PermissionGate } from "@/components/ProtectedRoute";
import { Bell, Shield, Palette, Globe, Users, Database, Settings as SettingsIcon, Lock, Smartphone, Monitor, Key, Zap, CreditCard } from "lucide-react";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    taskReminders: true,
    weeklyDigest: false,
    mentionAlerts: true,
  });

  const [appearance, setAppearance] = useState({
    darkMode: document.documentElement.classList.contains("dark"),
    compactView: false,
    animations: true,
    reducedMotion: false,
  });

  return (
    <AppLayout>
      <PageHeader 
        title="Settings" 
        description="Manage your preferences and account settings" 
        icon={SettingsIcon}
      />

      <Tabs defaultValue="notifications" className="space-y-6">
        <TabsList className="bg-muted/50 p-1 h-auto flex-wrap">
          <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
          <TabsTrigger value="appearance" className="gap-2"><Palette className="h-4 w-4" />Appearance</TabsTrigger>
          <TabsTrigger value="security" className="gap-2"><Shield className="h-4 w-4" />Security</TabsTrigger>
          <RoleGate allowedRoles={["director"]}>
            <TabsTrigger value="organization" className="gap-2"><Database className="h-4 w-4" />Organization</TabsTrigger>
          </RoleGate>
        </TabsList>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="card-interactive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notification Preferences</CardTitle>
                  <CardDescription>Choose how you want to be notified</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                {[
                  { id: "email", label: "Email notifications", desc: "Receive updates via email", checked: notifications.email },
                  { id: "push", label: "Push notifications", desc: "Browser push notifications", checked: notifications.push },
                  { id: "taskReminders", label: "Task reminders", desc: "Get reminded about upcoming deadlines", checked: notifications.taskReminders },
                  { id: "weeklyDigest", label: "Weekly digest", desc: "Summary of your weekly activity", checked: notifications.weeklyDigest },
                  { id: "mentionAlerts", label: "Mention alerts", desc: "When someone mentions you", checked: notifications.mentionAlerts },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch 
                      id={item.id} 
                      checked={item.checked}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [item.id]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card className="card-interactive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <CardTitle>Appearance</CardTitle>
                  <CardDescription>Customize the look and feel</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Theme Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", icon: Monitor, label: "Light" },
                    { id: "dark", icon: Smartphone, label: "Dark" },
                    { id: "system", icon: Globe, label: "System" },
                  ].map((theme) => (
                    <button
                      key={theme.id}
                      className={`p-4 rounded-xl border-2 transition-all duration-200 ${
                        (theme.id === "dark" && appearance.darkMode) || (theme.id === "light" && !appearance.darkMode)
                          ? "border-primary bg-primary/5"
                          : "border-transparent bg-muted/50 hover:bg-muted"
                      }`}
                      onClick={() => {
                        if (theme.id === "dark") {
                          document.documentElement.classList.add("dark");
                          setAppearance(prev => ({ ...prev, darkMode: true }));
                          localStorage.setItem("theme", "dark");
                        } else if (theme.id === "light") {
                          document.documentElement.classList.remove("dark");
                          setAppearance(prev => ({ ...prev, darkMode: false }));
                          localStorage.setItem("theme", "light");
                        }
                      }}
                    >
                      <theme.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm font-medium">{theme.label}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                {[
                  { id: "compactView", label: "Compact view", desc: "Reduce spacing and padding", checked: appearance.compactView },
                  { id: "animations", label: "Animations", desc: "Enable smooth transitions", checked: appearance.animations },
                  { id: "reducedMotion", label: "Reduced motion", desc: "Minimize animations for accessibility", checked: appearance.reducedMotion },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/30 transition-colors">
                    <div className="space-y-0.5">
                      <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch 
                      id={item.id} 
                      checked={item.checked}
                      onCheckedChange={(checked) => setAppearance(prev => ({ ...prev, [item.id]: checked }))}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="card-interactive">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <CardTitle>Security Settings</CardTitle>
                  <CardDescription>Protect your account</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-card/50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                    <Key className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <Label className="font-medium">Two-factor authentication</Label>
                    <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Switch />
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="p-4 rounded-xl border bg-card/50">
                  <Label className="font-medium mb-3 block">Change Password</Label>
                  <div className="space-y-3">
                    <Input type="password" placeholder="Current password" />
                    <Input type="password" placeholder="New password" />
                    <Input type="password" placeholder="Confirm new password" />
                    <Button className="w-full btn-glow">Update Password</Button>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-3 mb-3">
                  <Lock className="h-5 w-5 text-destructive" />
                  <Label className="font-medium text-destructive">Danger Zone</Label>
                </div>
                <p className="text-sm text-muted-foreground mb-3">Once you delete your account, there is no going back.</p>
                <Button variant="destructive" size="sm">Delete Account</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organization" className="space-y-6">
          <RoleGate allowedRoles={["director"]}>
            <Card className="card-interactive">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                    <Database className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle>Organization Settings</CardTitle>
                      <Badge variant="secondary" className="bg-primary/10 text-primary">Admin Only</Badge>
                    </div>
                    <CardDescription>Manage organization-wide configurations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { id: "audit", label: "Audit logging", desc: "Track all user activities", icon: Zap, checked: true },
                  { id: "sso", label: "SSO enabled", desc: "Single sign-on integration", icon: Key, checked: false },
                  { id: "mfa", label: "Enforce MFA", desc: "Require 2FA for all users", icon: Shield, checked: false },
                ].map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 rounded-xl border bg-card/50 hover:bg-muted/30 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-muted flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                        <p className="text-xs text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                    <Switch id={item.id} defaultChecked={item.checked} />
                  </div>
                ))}

                <Separator />

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1"><Users className="h-4 w-4 mr-2" />Manage Roles</Button>
                  <Button variant="outline" className="flex-1"><CreditCard className="h-4 w-4 mr-2" />Billing</Button>
                </div>
              </CardContent>
            </Card>
          </RoleGate>
        </TabsContent>
      </Tabs>
    </AppLayout>
  );
}
