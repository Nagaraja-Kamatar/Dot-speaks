import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { Mail, Building2, Briefcase, Edit2, Camera, User, Shield, Clock, Calendar, Star, TrendingUp, Award, Target } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const initials = user?.name?.split(" ").map(n => n[0]).join("") || "U";

  const getRoleBadgeStyles = (role: string) => {
    switch (role) {
      case "director": return "bg-gradient-to-r from-violet-500 to-purple-500 text-white border-0";
      case "manager": return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white border-0";
      default: return "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-0";
    }
  };

  const activityStats = [
    { label: "Tasks Completed", value: 47, icon: Target, color: "text-success" },
    { label: "Hours Logged", value: 156, icon: Clock, color: "text-primary" },
    { label: "Reviews", value: 12, icon: Star, color: "text-warning" },
    { label: "Projects", value: 5, icon: Briefcase, color: "text-accent" },
  ];

  return (
    <AppLayout>
      <PageHeader 
        title="Profile" 
        description="Manage your personal information" 
        icon={User}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1 card-interactive overflow-hidden">
          {/* Cover gradient */}
          <div className="h-24 bg-gradient-to-br from-primary via-accent to-primary/50" />
          
          <CardContent className="pt-0 -mt-12 text-center">
            <div className="relative inline-block">
              <Avatar className="h-24 w-24 mx-auto ring-4 ring-background shadow-xl">
                <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/20 to-accent/20 text-primary font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <Button 
                size="icon" 
                variant="secondary" 
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 shadow-lg hover:scale-110 transition-transform"
              >
                <Camera className="h-4 w-4" />
              </Button>
            </div>
            
            <h2 className="mt-4 text-xl font-bold">{user?.name}</h2>
            <p className="text-sm text-muted-foreground">{user?.title || user?.role}</p>
            <Badge className={`mt-3 ${getRoleBadgeStyles(user?.role || "")} capitalize`}>
              {user?.role}
            </Badge>
            
            <Separator className="my-6" />
            
            <div className="space-y-4 text-left">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm font-medium truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-accent" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Department</p>
                  <p className="text-sm font-medium">{user?.department || "Not set"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Briefcase className="h-5 w-5 text-success" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs text-muted-foreground">Job Title</p>
                  <p className="text-sm font-medium">{user?.title || "Not set"}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Activity Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {activityStats.map((stat, index) => (
              <Card key={stat.label} className="p-4 card-interactive animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-muted flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="info" className="space-y-6">
            <TabsList className="bg-muted/50">
              <TabsTrigger value="info">Personal Info</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="info">
              <Card className="card-interactive">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Personal Information</CardTitle>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Edit2 className="h-4 w-4" />Edit
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Full Name</Label>
                      <Input defaultValue={user?.name} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Email</Label>
                      <Input defaultValue={user?.email} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Department</Label>
                      <Input defaultValue={user?.department} readOnly className="bg-muted/50" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-muted-foreground">Job Title</Label>
                      <Input defaultValue={user?.title} readOnly className="bg-muted/50" />
                    </div>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between p-4 rounded-xl border bg-success/5 border-success/20">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-success/10 flex items-center justify-center">
                        <Shield className="h-5 w-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold">Account Status</h3>
                        <p className="text-sm text-muted-foreground">Your account is active and verified</p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-success/10 text-success border-success/30">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activity">
              <Card className="card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Completed task", detail: "API Integration", time: "2 hours ago", icon: Target },
                      { action: "Received review", detail: "Q4 Performance Review", time: "1 day ago", icon: Star },
                      { action: "Joined project", detail: "Mobile App Redesign", time: "3 days ago", icon: Briefcase },
                      { action: "Achievement unlocked", detail: "10 Tasks Streak", time: "1 week ago", icon: Award },
                    ].map((activity, index) => (
                      <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors">
                        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <activity.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">{activity.detail}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="card-interactive">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Security Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 rounded-xl border">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="font-medium">Password</p>
                        <p className="text-xs text-muted-foreground">Last changed 30 days ago</p>
                      </div>
                      <Button variant="outline" size="sm">Change</Button>
                    </div>
                    <Progress value={75} className="h-2" />
                    <p className="text-xs text-muted-foreground mt-2">Password strength: Strong</p>
                  </div>
                  <div className="p-4 rounded-xl border flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-factor authentication</p>
                      <p className="text-xs text-muted-foreground">Not enabled</p>
                    </div>
                    <Button size="sm" className="btn-glow">Enable</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AppLayout>
  );
}
