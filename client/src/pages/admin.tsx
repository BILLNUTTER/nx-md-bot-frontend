import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { setAdminKey, getAdminKey, removeAdminKey } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import {
  Users,
  DollarSign,
  Smartphone,
  Shield,
  Settings,
  LogOut,
  Loader2,
  CheckCircle2,
  XCircle,
  Ban,
  CreditCard,
  Crown,
  Trash2,
} from "lucide-react";

// 🔹 Add backend URL at the top
const BASE_URL = "https://nx-md-bot-65f116873bb7.herokuapp.com";

export default function AdminPage() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { toast } = useToast();
  const [adminKeyInput, setAdminKeyInput] = useState("");
  const [isAuthed, setIsAuthed] = useState(() => {
    const params = new URLSearchParams(search || window.location.search);
    if (params.get("admin") !== "true") return false;
    return !!getAdminKey();
  });
  const [priceInput, setPriceInput] = useState("");
  const [daysInput, setDaysInput] = useState("");

  const hasAdminParam = new URLSearchParams(search || window.location.search).get("admin") === "true";

  useEffect(() => {
    if (!hasAdminParam) setLocation("/");
  }, [hasAdminParam]);

  async function handleAdminLogin() {
    if (!adminKeyInput.trim()) return;
    const key = adminKeyInput.trim();
    try {
      const res = await fetch(`${BASE_URL}/api/admin/stats`, {
        headers: { "x-admin-key": key },
      });
      if (res.status === 403) {
        toast({ title: "Invalid admin key", description: "Wrong key — please try again.", variant: "destructive" });
        return;
      }
      setAdminKey(key);
      setIsAuthed(true);
    } catch {
      toast({ title: "Connection error", description: "Could not reach the server.", variant: "destructive" });
    }
  }

  function handleAdminLogout() {
    removeAdminKey();
    setIsAuthed(false);
    setLocation("/");
  }

  const fetchWithAdmin = async (path: string) => {
    const key = getAdminKey();
    const res = await fetch(`${BASE_URL}${path}`, { headers: { "x-admin-key": key || "" } });
    if (!res.ok) {
      if (res.status === 403) {
        setIsAuthed(false);
        removeAdminKey();
        throw new Error("Invalid admin key");
      }
      throw new Error("Request failed");
    }
    return res.json();
  };

  const patchWithAdmin = async (path: string, data: any) => {
    const key = getAdminKey();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", "x-admin-key": key || "" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

  const deleteWithAdmin = async (path: string) => {
    const key = getAdminKey();
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: { "x-admin-key": key || "" },
    });
    if (!res.ok) throw new Error("Request failed");
    return res.json();
  };

// Queries
const { data: stats, isLoading: statsLoading } = useQuery({
  queryKey: [`${BASE_URL}/api/admin/stats`],
  queryFn: () => fetchWithAdmin("/api/admin/stats"),
  enabled: isAuthed,
});

const { data: users, isLoading: usersLoading } = useQuery({
  queryKey: [`${BASE_URL}/api/admin/users`],
  queryFn: () => fetchWithAdmin("/api/admin/users"),
  enabled: isAuthed,
});

const { data: adminSettings } = useQuery({
  queryKey: [`${BASE_URL}/api/settings`],
  queryFn: () => fetchWithAdmin("/api/settings"),
  enabled: isAuthed,
});

const { data: adminPayments } = useQuery({
  queryKey: [`${BASE_URL}/api/admin/payments`],
  queryFn: () => fetchWithAdmin("/api/admin/payments"),
  enabled: isAuthed,
});

// Mutations
const updateUser = useMutation({
  mutationFn: ({ userId, data }: { userId: string; data: any }) =>
    patchWithAdmin(`/api/admin/user/${userId}`, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/api/admin/users`] });
    queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/api/admin/stats`] });
    toast({ title: "User updated" });
  },
  onError: (err: any) => {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  },
});

const updateSettings = useMutation({
  mutationFn: (data: any) => patchWithAdmin("/api/admin/settings", data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/api/settings`] });
    toast({ title: "Settings updated" });
  },
});

const deleteUser = useMutation({
  mutationFn: (userId: string) => deleteWithAdmin(`/api/admin/user/${userId}`),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/api/admin/users`] });
    queryClient.invalidateQueries({ queryKey: [`${BASE_URL}/api/admin/stats`] });
    toast({ title: "User deleted", description: "User and all associated data removed." });
  },
  onError: (err: any) => {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  },
});

// Sync inputs with settings
useEffect(() => {
  if (adminSettings) {
    setPriceInput(String(adminSettings.subscriptionPrice || 70));
    setDaysInput(String(adminSettings.subscriptionDays || 30));
  }
}, [adminSettings]);

// Render login if not authenticated
if (!isAuthed) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-border/50">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-2xl bg-destructive/10 flex items-center justify-center">
              <Shield className="text-destructive w-7 h-7" />
            </div>
          </div>
          <CardTitle className="text-2xl">Admin Access</CardTitle>
          <CardDescription>Enter your admin key to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="password"
              placeholder="Admin key"
              value={adminKeyInput}
              onChange={(e) => setAdminKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdminLogin()}
              data-testid="input-admin-key"
            />
            <Button className="w-full" onClick={handleAdminLogin} data-testid="button-admin-login">
              <Shield className="w-4 h-4 mr-2" />
              Access Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ✅ From here you can continue rendering the dashboard tabs, tables, etc.
// All fetches now automatically go through BASE_URL + your endpoints

return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-destructive flex items-center justify-center">
                <Shield className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-lg">Admin Panel</span>
            </div>
            <Button variant="ghost" size="sm" onClick={handleAdminLogout} data-testid="button-admin-logout">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[
            { label: "Total Users", value: stats?.totalUsers || 0, icon: Users, color: "text-blue-500" },
            { label: "Active Subs", value: stats?.activeSubscriptions || 0, icon: Crown, color: "text-primary" },
            { label: "Devices", value: stats?.connectedDevices || 0, icon: Smartphone, color: "text-green-500" },
            { label: "Payments", value: stats?.totalPayments || 0, icon: CreditCard, color: "text-yellow-500" },
            { label: "Revenue", value: `KSh ${stats?.totalRevenue || 0}`, icon: DollarSign, color: "text-emerald-500" },
          ].map((stat) => (
            <Card key={stat.label} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <p className="font-bold text-lg" data-testid={`text-stat-${stat.label.toLowerCase().replace(' ', '-')}`}>{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList>
            <TabsTrigger value="users" data-testid="tab-admin-users">
              <Users className="w-4 h-4 mr-1.5" />
              Users
            </TabsTrigger>
            <TabsTrigger value="payments" data-testid="tab-admin-payments">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-admin-settings">
              <Settings className="w-4 h-4 mr-1.5" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">All Users</CardTitle>
                <CardDescription>{users?.length || 0} registered users</CardDescription>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin" />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>WhatsApp</TableHead>
                          <TableHead>Subscription</TableHead>
                          <TableHead>Bot</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users?.map((u: any) => (
                          <TableRow key={u._id} data-testid={`row-user-${u._id}`}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{u.username}</p>
                                <p className="text-xs text-muted-foreground">{u.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.whatsappConnected ? "default" : "secondary"}>
                                {u.whatsappConnected ? (
                                  <><CheckCircle2 className="w-3 h-3 mr-1" />Connected</>
                                ) : (
                                  <><XCircle className="w-3 h-3 mr-1" />Offline</>
                                )}
                              </Badge>
                              {u.whatsappNumber && (
                                <p className="text-xs text-muted-foreground mt-1">{u.whatsappNumber}</p>
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant={u.subscriptionActive ? "default" : "secondary"}>
                                {u.subscriptionActive ? "Active" : "Inactive"}
                              </Badge>
                              {u.subscriptionExpiry && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  {new Date(u.subscriptionExpiry).toLocaleDateString()}
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <Switch
                                checked={u.botEnabled}
                                onCheckedChange={(checked) =>
                                  updateUser.mutate({ userId: u._id, data: { botEnabled: checked } })
                                }
                                data-testid={`switch-admin-bot-${u._id}`}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                <Button
                                  variant={u.isRestricted ? "default" : "outline"}
                                  size="sm"
                                  onClick={() =>
                                    updateUser.mutate({
                                      userId: u._id,
                                      data: { isRestricted: !u.isRestricted },
                                    })
                                  }
                                  data-testid={`button-restrict-${u._id}`}
                                >
                                  <Ban className="w-3 h-3 mr-1" />
                                  {u.isRestricted ? "Unblock" : "Block"}
                                </Button>
                                <Button
                                  variant={u.subscriptionActive ? "destructive" : "default"}
                                  size="sm"
                                  onClick={() =>
                                    updateUser.mutate({
                                      userId: u._id,
                                      data: { subscriptionActive: !u.subscriptionActive, days: 30 },
                                    })
                                  }
                                  data-testid={`button-toggle-sub-${u._id}`}
                                >
                                  <Crown className="w-3 h-3 mr-1" />
                                  {u.subscriptionActive ? "Deactivate" : "Activate (30d)"}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="text-destructive border-destructive/30 hover:bg-destructive/10"
                                  onClick={() => {
                                    if (confirm(`Delete user "${u.username}"? This cannot be undone.`)) {
                                      deleteUser.mutate(u._id);
                                    }
                                  }}
                                  disabled={deleteUser.isPending}
                                  data-testid={`button-delete-${u._id}`}
                                >
                                  <Trash2 className="w-3 h-3 mr-1" />
                                  Delete
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Phone</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminPayments?.map((p: any) => (
                        <TableRow key={p._id} data-testid={`row-admin-payment-${p._id}`}>
                          <TableCell>
                            <p className="text-sm font-medium">{p.userId?.username || "Unknown"}</p>
                            <p className="text-xs text-muted-foreground">{p.userId?.email || ""}</p>
                          </TableCell>
                          <TableCell className="font-medium">KSh {p.amount}</TableCell>
                          <TableCell className="text-sm">{p.phoneNumber}</TableCell>
                          <TableCell>
                            <Badge variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}>
                              {p.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(p.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Platform Settings</CardTitle>
                <CardDescription>Configure subscription pricing and platform settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subscription Price (KSh)</label>
                    <Input
                      type="number"
                      value={priceInput}
                      onChange={(e) => setPriceInput(e.target.value)}
                      data-testid="input-admin-price"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1.5 block">Subscription Days</label>
                    <Input
                      type="number"
                      value={daysInput}
                      onChange={(e) => setDaysInput(e.target.value)}
                      data-testid="input-admin-days"
                    />
                  </div>
                </div>
                <Button
                  onClick={() =>
                    updateSettings.mutate({
                      subscriptionPrice: Number(priceInput),
                      subscriptionDays: Number(daysInput),
                    })
                  }
                  disabled={updateSettings.isPending}
                  data-testid="button-save-settings"
                >
                  {updateSettings.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Save Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
