import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { authGet, authPost, authPatch, removeToken } from "@/lib/auth";
import { queryClient } from "@/lib/queryClient";
import { SiWhatsapp } from "react-icons/si";
import {
  Smartphone,
  QrCode,
  Hash,
  LogOut,
  Bot,
  MessageSquare,
  Shield,
  Zap,
  Loader2,
  Phone,
  CheckCircle2,
  XCircle,
  AlertCircle,
  CreditCard,
  RefreshCw,
  WifiOff,
  Wifi,
  Crown,
  Copy,
  Check,
  Globe,
  Lock,
  Settings,
  ToggleLeft,
  Type,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

export default function DashboardPage() {
  const [, setLocation] = useLocation();
  const { user, isLoading: authLoading, refetch: refetchUser } = useAuth();
  const { toast } = useToast();
  const [connectMethod, setConnectMethod] = useState<"qr" | "pairing">("qr");
  const [phoneInput, setPhoneInput] = useState("");
  const [payPhoneInput, setPayPhoneInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [activePayment, setActivePayment] = useState<string | null>(null);
  const [prefixInput, setPrefixInput] = useState<string | null>(null);
  const [strSettings, setStrSettings] = useState<Record<string, string>>({});
  const [savedStrKey, setSavedStrKey] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) setLocation("/login");
  }, [authLoading, user, setLocation]);

 const { data: waStatus, refetch: refetchWA } = useQuery({
  queryKey: ["/whatsapp/status"],
  queryFn: () => apiFetch("/api/whatsapp/status"),
  refetchInterval: 3000,
  enabled: !!user,
});

const { data: settings } = useQuery({
  queryKey: ["/settings"],
  queryFn: () => apiFetch("/api/settings"),
  enabled: !!user,
});

const { data: payments } = useQuery({
  queryKey: ["/payment/history"],
  queryFn: () => apiFetch("/api/payment/history"),
  enabled: !!user,
});

const connectMutation = useMutation({
  mutationFn: (data: { method: string; phoneNumber?: string }) =>
    apiFetch("/api/whatsapp/connect", { 
      method: "POST", 
      body: JSON.stringify(data), // <-- stringify
      headers: { "Content-Type": "application/json" } // optional, good practice
    }),
  onSuccess: () => {
    toast({ title: "Connecting...", description: "Preparing WhatsApp link" });
    refetchWA();
  },
  onError: (err: any) => {
    toast({ title: "Connection failed", description: err.message, variant: "destructive" });
  },
});


const disconnectMutation = useMutation({
  mutationFn: () => apiFetch("/api/whatsapp/disconnect", { method: "POST" }),
  onSuccess: () => {
    toast({ title: "Disconnected", description: "WhatsApp unlinked" });
    refetchWA();
    refetchUser();
  },
});

const cancelMutation = useMutation({
  mutationFn: () => apiFetch("/api/whatsapp/cancel", { method: "POST" }),
  onSuccess: () => {
    setConnectMethod("qr");
    setPhoneInput("");
    refetchWA();
  },
});

const payMutation = useMutation({
  mutationFn: (data: { phoneNumber: string }) =>
    apiFetch("/api/payment/initiate", { 
      method: "POST", 
      body: JSON.stringify(data), // <-- stringify
      headers: { "Content-Type": "application/json" } 
    }),
  onSuccess: (data: any) => {
    setActivePayment(data.transactionId);
    toast({ title: "Payment initiated", description: data.message });
  },
  onError: (err: any) => {
    toast({ title: "Payment failed", description: err.message, variant: "destructive" });
  },
});
const { data: paymentStatus } = useQuery({
  queryKey: ["/payment/status", activePayment],
  queryFn: () => apiFetch(`/api/payment/status/${activePayment}`),
  refetchInterval: 2000,
  enabled: !!activePayment,
});

  useEffect(() => {
    if (paymentStatus?.status === "completed") {
      toast({ title: "Payment successful!", description: "Your subscription is now active" });
      setActivePayment(null);
      refetchUser();
      queryClient.invalidateQueries({ queryKey: ["/api/payment/history"] });
    }
  }, [paymentStatus]);

  const SETTING_DEFAULTS: Record<string, any> = {
    alwaysonline: true, autoviewstatus: true, statusantidelete: true,
    autobio: false, anticall: false, chatbot: false, antibug: false,
    autotype: false, autoread: false, autoreact: false, autoblock: false,
    autoreactstatus: false, antisticker: false, antistickerkick: false,
    antistickerwarn: false, antiviewonce: false, autorecord: false, autorecordtype: false,
  };

  function getSetting(key: string): any {
    const val = (user?.botSettings as any)?.[key];
    return val !== undefined ? val : SETTING_DEFAULTS[key];
  }

 const toggleSetting = useMutation({
  mutationFn: (data: Record<string, any>) =>
    apiFetch("/api/bot/settings", {
      method: "PATCH",
      body: JSON.stringify(data), // stringify the data
      headers: { "Content-Type": "application/json" },
    }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
    refetchUser();
  },
  onError: (err: any) => {
    toast({ title: "Failed to save setting", description: err.message, variant: "destructive" });
  },
});

const toggleBot = useMutation({
  mutationFn: () =>
    apiFetch("/api/bot/toggle", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
    }),
  onSuccess: (data: any) => {
    refetchUser();
    toast({ title: data.botEnabled ? "Bot enabled" : "Bot disabled" });
  },
  onError: (err: any) => {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  },
});

const updateConfig = useMutation({
  mutationFn: (data: { botPrefix?: string; botMode?: string }) =>
    apiFetch("/api/bot/config", {
      method: "PATCH",
      body: JSON.stringify(data), // stringify the data
      headers: { "Content-Type": "application/json" },
    }),
  onSuccess: () => {
    refetchUser();
    setPrefixInput(null);
    toast({ title: "Settings saved" });
  },
  onError: (err: any) => {
    toast({ title: "Error", description: err.message, variant: "destructive" });
  },
});

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const daysLeft = user.subscriptionExpiry
    ? Math.max(0, Math.ceil((new Date(user.subscriptionExpiry).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
    : 0;

  const subProgress = user.subscriptionActive ? Math.min(100, (daysLeft / 30) * 100) : 0;

  const isConnected = waStatus?.status === "connected" || waStatus?.whatsappConnected;
  const isConnecting = waStatus?.status === "connecting" || waStatus?.status === "qr_ready" || waStatus?.status === "pairing_ready" || waStatus?.status === "reconnecting";


  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <SiWhatsapp className="text-primary-foreground w-4 h-4" />
              </div>
              <span className="font-bold text-lg">NX-MD BOT</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground hidden sm:block" data-testid="text-username">
                {user.username}
              </span>
              <Button
                variant="ghost"
                size="sm"
                data-testid="button-logout"
                onClick={() => {
                  removeToken();
                  setLocation("/login");
                }}
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-dashboard-title">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Manage your WhatsApp bot and subscription</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isConnected ? "bg-green-500/10" : "bg-muted"}`}>
                  {isConnected ? <Wifi className="w-5 h-5 text-green-500" /> : <WifiOff className="w-5 h-5 text-muted-foreground" />}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">WhatsApp</p>
                  <p className="font-semibold text-sm" data-testid="text-wa-status">
                    {isConnected ? "Connected" : isConnecting ? "Connecting..." : "Disconnected"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.subscriptionActive ? "bg-primary/10" : "bg-muted"}`}>
                  <Crown className={`w-5 h-5 ${user.subscriptionActive ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Subscription</p>
                  <p className="font-semibold text-sm" data-testid="text-sub-status">
                    {user.subscriptionActive ? `${daysLeft} days left` : "Inactive"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.botEnabled ? "bg-primary/10" : "bg-muted"}`}>
                  <Bot className={`w-5 h-5 ${user.botEnabled ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Bot Status</p>
                  <p className="font-semibold text-sm" data-testid="text-bot-status">
                    {user.botEnabled ? "Active" : "Disabled"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Number</p>
                  <p className="font-semibold text-sm" data-testid="text-wa-number">
                    {user.whatsappNumber || "Not linked"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {user.subscriptionActive && (
          <Card className="border-border/50 mb-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Subscription Progress</span>
                <span className="text-xs text-muted-foreground">
                  Expires {user.subscriptionExpiry ? new Date(user.subscriptionExpiry).toLocaleDateString() : "N/A"}
                </span>
              </div>
              <Progress value={subProgress} className="h-2" />
            </CardContent>
          </Card>
        )}

        <Tabs defaultValue="whatsapp" className="space-y-4">
          <TabsList className="w-full sm:w-auto flex-wrap">
            <TabsTrigger value="whatsapp" data-testid="tab-whatsapp">
              <Smartphone className="w-4 h-4 mr-1.5" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="settings" data-testid="tab-settings">
              <Settings className="w-4 h-4 mr-1.5" />
              Settings
            </TabsTrigger>
            <TabsTrigger value="payment" data-testid="tab-payment">
              <CreditCard className="w-4 h-4 mr-1.5" />
              Payment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <SiWhatsapp className="text-primary" />
                  Link WhatsApp Device
                </CardTitle>
                <CardDescription>Connect your WhatsApp using QR code or pairing code</CardDescription>
              </CardHeader>
              <CardContent>
                {isConnected ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h3 className="font-semibold text-lg mb-1" data-testid="text-connected-status">WhatsApp Connected</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Number: {waStatus?.whatsappNumber || user.whatsappNumber || "Unknown"}
                    </p>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => disconnectMutation.mutate()}
                      disabled={disconnectMutation.isPending}
                      data-testid="button-disconnect"
                    >
                      {disconnectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                      Disconnect
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {!isConnecting && !waStatus?.qr && !waStatus?.pairingCode && (
                      <div className="space-y-3">
                        <div className="flex gap-3">
                          <Button
                            onClick={() => {
                              setConnectMethod("qr");
                              connectMutation.mutate({ method: "qr" });
                            }}
                            disabled={connectMutation.isPending}
                            className="flex-1"
                            variant={connectMethod === "qr" ? "default" : "outline"}
                            data-testid="button-generate-qr"
                          >
                            {connectMutation.isPending && connectMethod === "qr" && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                            <QrCode className="w-4 h-4 mr-2" />
                            Generate QR Code
                          </Button>
                          <Button
                            variant={connectMethod === "pairing" ? "default" : "outline"}
                            onClick={() => setConnectMethod("pairing")}
                            disabled={connectMutation.isPending}
                            className="flex-1"
                            data-testid="button-generate-pair"
                          >
                            <Hash className="w-4 h-4 mr-2" />
                            Generate Pair Code
                          </Button>
                        </div>

                        {connectMethod === "pairing" && (
                          <div className="space-y-3">
                            <Input
                              placeholder="Enter phone number (e.g. 254712345678)"
                              value={phoneInput}
                              onChange={(e) => setPhoneInput(e.target.value)}
                              data-testid="input-pairing-phone"
                            />
                            <Button
                              onClick={() =>
                                connectMutation.mutate({ method: "pairing", phoneNumber: phoneInput })
                              }
                              disabled={connectMutation.isPending || !phoneInput}
                              className="w-full"
                              data-testid="button-submit-pairing"
                            >
                              {connectMutation.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                              Get Pairing Code
                            </Button>
                          </div>
                        )}
                      </div>
                    )}

                    {waStatus?.qr && (
                      <div className="mt-4 flex flex-col items-center gap-3">
                        <div className="p-4 bg-white rounded-xl inline-block">
                          <img
                            src={waStatus.qr}
                            alt="Scan this QR code with WhatsApp"
                            className="w-64 h-64"
                            data-testid="img-qr-code"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Open WhatsApp &gt; Settings &gt; Linked Devices &gt; Link a Device &gt; Scan QR
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelMutation.mutate()}
                          disabled={cancelMutation.isPending}
                          data-testid="button-cancel-qr"
                          className="text-muted-foreground"
                        >
                          {cancelMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                          Cancel — try pairing code instead
                        </Button>
                      </div>
                    )}

                    {waStatus?.pairingCode && waStatus.pairingCode !== "ERROR" && (
                      <div className="mt-4 p-6 bg-card border-2 border-primary/20 rounded-xl text-center">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                          <Hash className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium mb-1">Your Pairing Code</p>
                        <p className="text-xs text-muted-foreground mb-3">Copy and enter this code in WhatsApp</p>
                        <div className="relative inline-block">
                          <p className="text-4xl font-mono font-bold tracking-[0.3em] text-primary py-3 px-6 bg-primary/5 rounded-lg select-all" data-testid="text-pairing-code">
                            {waStatus.pairingCode}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-background border border-border shadow-sm"
                            data-testid="button-copy-code"
                            onClick={() => {
                              navigator.clipboard.writeText(waStatus.pairingCode);
                              setCopied(true);
                              toast({ title: "Copied!", description: "Pairing code copied to clipboard" });
                              setTimeout(() => setCopied(false), 2000);
                            }}
                          >
                            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                          </Button>
                        </div>
                        <div className="text-sm text-muted-foreground mt-4 text-left max-w-xs mx-auto space-y-2">
                          <p className="flex items-start gap-2"><span className="font-bold text-primary shrink-0">1.</span> Open WhatsApp on your phone</p>
                          <p className="flex items-start gap-2"><span className="font-bold text-primary shrink-0">2.</span> Go to <strong>Settings</strong> &gt; <strong>Linked Devices</strong></p>
                          <p className="flex items-start gap-2"><span className="font-bold text-primary shrink-0">3.</span> Tap <strong>"Link a Device"</strong></p>
                          <p className="flex items-start gap-2"><span className="font-bold text-primary shrink-0">4.</span> Tap <strong>"Link with phone number instead"</strong></p>
                          <p className="flex items-start gap-2"><span className="font-bold text-primary shrink-0">5.</span> Enter the code above</p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelMutation.mutate()}
                          disabled={cancelMutation.isPending}
                          data-testid="button-cancel-pairing"
                          className="mt-4 text-muted-foreground"
                        >
                          {cancelMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <XCircle className="w-4 h-4 mr-2" />}
                          Cancel — try QR code instead
                        </Button>
                      </div>
                    )}

                    {waStatus?.pairingCode === "ERROR" && (
                      <div className="mt-4 p-4 bg-destructive/5 border border-destructive/20 rounded-xl text-center space-y-3">
                        <XCircle className="w-8 h-8 text-destructive mx-auto" />
                        <p className="text-sm font-medium text-destructive">Failed to generate pairing code</p>
                        <p className="text-xs text-muted-foreground">Check the phone number format (e.g. 254712345678) and try again.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => cancelMutation.mutate()}
                          disabled={cancelMutation.isPending}
                          data-testid="button-cancel-error"
                        >
                          {cancelMutation.isPending ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          Try Again / Switch Method
                        </Button>
                      </div>
                    )}

                    {isConnecting && !waStatus?.qr && !waStatus?.pairingCode && (
                      <div className="flex flex-col items-center gap-3 py-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          {connectMethod === "pairing" ? "Requesting pairing code (5 seconds)..." : "Generating QR code..."}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => cancelMutation.mutate()}
                          disabled={cancelMutation.isPending}
                          data-testid="button-cancel-loading"
                          className="text-muted-foreground text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5 mr-1" />
                          Cancel
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" />
                  Bot Configuration
                </CardTitle>
                <CardDescription>Set prefix and mode — always available</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5 text-primary" />
                      Command Prefix
                    </label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g. . / ! / # (leave blank for none)"
                        value={prefixInput !== null ? prefixInput : ((user as any).botPrefix ?? ".")}
                        onChange={(e) => setPrefixInput(e.target.value)}
                        maxLength={5}
                        className="font-mono"
                        data-testid="input-bot-prefix"
                      />
                      <Button
                        size="sm"
                        onClick={() => updateConfig.mutate({ botPrefix: prefixInput ?? ((user as any).botPrefix ?? ".") })}
                        disabled={updateConfig.isPending || prefixInput === null}
                        data-testid="button-save-prefix"
                      >
                        {updateConfig.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Current: <span className="font-mono font-bold text-primary">{(user as any).botPrefix || "(none)"}</span>
                      {" "}— Commands: <span className="font-mono">{(user as any).botPrefix || ""}menu</span>, <span className="font-mono">{(user as any).botPrefix || ""}ping</span>
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-1.5">
                      <Shield className="w-3.5 h-3.5 text-primary" />
                      Bot Mode
                    </label>
                    <div className="flex gap-2">
                      <Button
                        variant={(user as any).botMode === "public" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => updateConfig.mutate({ botMode: "public" })}
                        disabled={updateConfig.isPending}
                        data-testid="button-mode-public"
                      >
                        <Globe className="w-4 h-4 mr-1.5" />
                        Public
                      </Button>
                      <Button
                        variant={(user as any).botMode === "private" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => updateConfig.mutate({ botMode: "private" })}
                        disabled={updateConfig.isPending}
                        data-testid="button-mode-private"
                      >
                        <Lock className="w-4 h-4 mr-1.5" />
                        Private
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {(user as any).botMode === "private"
                        ? "🔒 Only you (the linked number) can use commands"
                        : "🌐 Anyone who messages can use commands"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {user.subscriptionActive && (
              <Card className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${user.botEnabled ? "bg-primary/10" : "bg-muted"}`}>
                        <Bot className={`w-5 h-5 ${user.botEnabled ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <p className="font-medium">Master Bot Toggle</p>
                        <p className="text-xs text-muted-foreground">Enable or disable all bot features</p>
                      </div>
                    </div>
                    <Switch
                      checked={user.botEnabled}
                      onCheckedChange={() => toggleBot.mutate()}
                      disabled={toggleBot.isPending}
                      data-testid="switch-bot-master"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {!user.subscriptionActive ? (
              <Card className="border-border/50">
                <CardContent className="p-8 text-center">
                  <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Subscription Required</h3>
                  <p className="text-muted-foreground text-sm">Activate your subscription to access bot settings.</p>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <ToggleLeft className="w-4 h-4 text-primary" />
                      Toggle Features
                    </CardTitle>
                    <CardDescription>Same as <code className="text-xs bg-muted px-1 rounded">.getsettings</code> — toggle each feature on or off</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        { key: "anticall", label: "Anti Call", desc: "Reject all incoming calls" },
                        { key: "chatbot", label: "Chatbot", desc: "AI replies to all messages" },
                        { key: "antibug", label: "Anti Bug", desc: "Block exploit messages" },
                        { key: "autotype", label: "Auto Type", desc: "Show typing indicator" },
                        { key: "autoread", label: "Auto Read", desc: "Mark messages as read" },
                        { key: "autoreact", label: "Auto React", desc: "React to every message" },
                        { key: "autoblock", label: "Auto Block", desc: "Block callers (with anticall)" },
                        { key: "alwaysonline", label: "Always Online", desc: "Always show as online" },
                        { key: "autobio", label: "Auto Bio", desc: "Auto-update profile bio" },
                        { key: "autoviewstatus", label: "Auto View Status", desc: "View all statuses" },
                        { key: "autoreactstatus", label: "Auto React Status", desc: "React to statuses" },
                        { key: "statusantidelete", label: "Status Anti Delete", desc: "Recover deleted statuses" },
                        { key: "antisticker", label: "Anti Sticker", desc: "Delete stickers in groups" },
                        { key: "antistickerkick", label: "Sticker Kick", desc: "Kick sticker senders" },
                        { key: "antistickerwarn", label: "Sticker Warn", desc: "Warn sticker senders" },
                        { key: "antiviewonce", label: "Anti View Once", desc: "Bypass view-once media" },
                        { key: "autorecord", label: "Auto Record", desc: "Show recording indicator" },
                        { key: "autorecordtype", label: "Auto Record Type", desc: "Use recording instead of typing" },
                      ].map((f) => {
                        const val = !!getSetting(f.key);
                        return (
                          <div key={f.key} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-card/50">
                            <div>
                              <p className="text-sm font-medium">{f.label}</p>
                              <p className="text-xs text-muted-foreground">{f.desc}</p>
                            </div>
                            <Switch
                              checked={val}
                              onCheckedChange={(checked) => toggleSetting.mutate({ [f.key]: checked })}
                              disabled={toggleSetting.isPending}
                              data-testid={`switch-setting-${f.key}`}
                            />
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Type className="w-4 h-4 text-primary" />
                      Bot Identity
                    </CardTitle>
                    <CardDescription>Bot name, owner info, and branding settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: "botname", label: "Bot Name", placeholder: "NX-MD" },
                      { key: "ownername", label: "Owner Name", placeholder: "Not Set!" },
                      { key: "ownernumber", label: "Owner Number", placeholder: "254712345678" },
                      { key: "author", label: "Sticker Author", placeholder: "X" },
                      { key: "packname", label: "Sticker Pack Name", placeholder: "NX-MD" },
                      { key: "watermark", label: "Watermark", placeholder: "Powered by Nutterx Technologies" },
                      { key: "statusemoji", label: "Status Emojis (comma-separated)", placeholder: "🧡,💚,🔥,✨,❤️" },
                      { key: "timezone", label: "Timezone", placeholder: "Africa/Nairobi" },
                    ].map((f) => {
                      const cur = (user.botSettings as any)?.[f.key] ?? "";
                      const edited = strSettings[f.key] ?? null;
                      const displayVal = edited !== null ? edited : cur;
                      return (
                        <div key={f.key} className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</label>
                          <div className="flex gap-2">
                            <Input
                              value={displayVal}
                              placeholder={f.placeholder}
                              onChange={(e) => setStrSettings(s => ({ ...s, [f.key]: e.target.value }))}
                              className="text-sm"
                              data-testid={`input-setting-${f.key}`}
                            />
                            <Button
                              size="sm"
                              variant={savedStrKey === f.key ? "default" : "outline"}
                              onClick={async () => {
                                await toggleSetting.mutateAsync({ [f.key]: displayVal });
                                setSavedStrKey(f.key);
                                setTimeout(() => setSavedStrKey(null), 2000);
                                setStrSettings(s => { const n = { ...s }; delete n[f.key]; return n; });
                              }}
                              disabled={toggleSetting.isPending || edited === null}
                              data-testid={`button-save-${f.key}`}
                            >
                              {savedStrKey === f.key ? <Check className="w-3.5 h-3.5" /> : "Save"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-primary" />
                      Messages & Limits
                    </CardTitle>
                    <CardDescription>Custom messages for welcome, goodbye, anticall, and warnings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { key: "welcomemsg", label: "Welcome Message", placeholder: "Welcome {name} to {group}! 👋", rows: 3 },
                      { key: "goodbyemsg", label: "Goodbye Message", placeholder: "Goodbye {name}! 👋", rows: 2 },
                      { key: "anticallmsg", label: "Anti-Call Message", placeholder: "Sorry, calls are not allowed.", rows: 2 },
                    ].map((f) => {
                      const cur = (user.botSettings as any)?.[f.key] ?? "";
                      const edited = strSettings[f.key] ?? null;
                      const displayVal = edited !== null ? edited : cur;
                      return (
                        <div key={f.key} className="space-y-1">
                          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{f.label}</label>
                          <Textarea
                            value={displayVal}
                            placeholder={f.placeholder}
                            rows={f.rows}
                            onChange={(e) => setStrSettings(s => ({ ...s, [f.key]: e.target.value }))}
                            className="text-sm resize-none"
                            data-testid={`textarea-setting-${f.key}`}
                          />
                          <div className="flex justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={async () => {
                                await toggleSetting.mutateAsync({ [f.key]: displayVal });
                                setSavedStrKey(f.key);
                                setTimeout(() => setSavedStrKey(null), 2000);
                                setStrSettings(s => { const n = { ...s }; delete n[f.key]; return n; });
                              }}
                              disabled={toggleSetting.isPending || edited === null}
                              data-testid={`button-save-msg-${f.key}`}
                            >
                              {savedStrKey === f.key ? "✅ Saved" : "Save"}
                            </Button>
                          </div>
                        </div>
                      );
                    })}

                    <Separator />

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Warn Limit</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={20}
                            value={strSettings["warnLimit"] ?? String((user.botSettings as any)?.warnLimit ?? 5)}
                            onChange={(e) => setStrSettings(s => ({ ...s, warnLimit: e.target.value }))}
                            className="text-sm"
                            data-testid="input-setting-warnLimit"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const n = parseInt(strSettings["warnLimit"] || "5");
                              if (!isNaN(n)) {
                                await toggleSetting.mutateAsync({ warnLimit: n });
                                setStrSettings(s => { const x = { ...s }; delete x["warnLimit"]; return x; });
                              }
                            }}
                            disabled={toggleSetting.isPending || !strSettings["warnLimit"]}
                            data-testid="button-save-warnLimit"
                          >
                            Save
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Menu Style</label>
                        <div className="flex gap-2">
                          <Input
                            type="number"
                            min={1}
                            max={5}
                            value={strSettings["menustyle"] ?? String((user.botSettings as any)?.menustyle ?? 2)}
                            onChange={(e) => setStrSettings(s => ({ ...s, menustyle: e.target.value }))}
                            className="text-sm"
                            data-testid="input-setting-menustyle"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={async () => {
                              const n = parseInt(strSettings["menustyle"] || "2");
                              if (!isNaN(n)) {
                                await toggleSetting.mutateAsync({ menustyle: n });
                                setStrSettings(s => { const x = { ...s }; delete x["menustyle"]; return x; });
                              }
                            }}
                            disabled={toggleSetting.isPending || !strSettings["menustyle"]}
                            data-testid="button-save-menustyle"
                          >
                            Save
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Settings className="w-4 h-4 text-primary" />
                      Advanced Settings
                    </CardTitle>
                    <CardDescription>Anti-delete, anti-edit, and font style options</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Anti Delete</label>
                      <div className="flex gap-2">
                        {["off", "everyone", "private", "group"].map(opt => (
                          <Button
                            key={opt}
                            size="sm"
                            variant={(getSetting("antidelete") || "off") === opt ? "default" : "outline"}
                            onClick={() => toggleSetting.mutate({ antidelete: opt })}
                            disabled={toggleSetting.isPending}
                            className="flex-1 text-xs"
                            data-testid={`button-antidelete-${opt}`}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Anti Edit</label>
                      <div className="flex gap-2">
                        {["off", "private", "everyone"].map(opt => (
                          <Button
                            key={opt}
                            size="sm"
                            variant={(getSetting("antiedit") || "off") === opt ? "default" : "outline"}
                            onClick={() => toggleSetting.mutate({ antiedit: opt })}
                            disabled={toggleSetting.isPending}
                            className="flex-1 text-xs"
                            data-testid={`button-antiedit-${opt}`}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Font Style</label>
                      <div className="flex flex-wrap gap-2">
                        {["normal", "bold", "italic", "mono", "fancy"].map(opt => (
                          <Button
                            key={opt}
                            size="sm"
                            variant={(getSetting("fontstyle") || "normal") === opt ? "default" : "outline"}
                            onClick={() => toggleSetting.mutate({ fontstyle: opt })}
                            disabled={toggleSetting.isPending}
                            className="text-xs"
                            data-testid={`button-font-${opt}`}
                          >
                            {opt}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <Button
                      variant="destructive"
                      size="sm"
                      className="w-full mt-2"
                      onClick={() => {
                        if (confirm("Reset ALL bot settings to defaults?")) {
                          toggleSetting.mutate({
                            autobio: false, anticall: false, chatbot: false, antibug: false,
                            autotype: false, autoread: false, autoreact: false, autoblock: false,
                            alwaysonline: true, autoviewstatus: true, autoreactstatus: false,
                            statusantidelete: true, antisticker: false, antistickerkick: false,
                            antistickerwarn: false, antiviewonce: false, antidelete: "off",
                            antiedit: "off", fontstyle: "normal", menustyle: 2, warnLimit: 5,
                            botname: "NX-MD", ownername: "Not Set!", ownernumber: "not set",
                            statusemoji: "🧡,💚,🔥,✨,❤️,🥰,😎", watermark: "Powered by Nutterx Technologies",
                            author: "X", packname: "NX-MD", timezone: "Africa/Nairobi",
                            welcomemsg: "", goodbyemsg: "", anticallmsg: "",
                          });
                          setStrSettings({});
                        }
                      }}
                      disabled={toggleSetting.isPending}
                      data-testid="button-reset-settings"
                    >
                      Reset All Settings to Defaults
                    </Button>
                  </CardContent>
                </Card>
              </>
            )}
          </TabsContent>

          <TabsContent value="payment" className="space-y-4">
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <CreditCard className="text-primary w-5 h-5" />
                  {user.subscriptionActive ? "Renew Subscription" : "Activate Subscription"}
                </CardTitle>
                <CardDescription>
                  Pay KSh {settings?.subscriptionPrice || 70} for {settings?.subscriptionDays || 30} days of full bot access
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Amount</span>
                    <span className="text-2xl font-bold text-primary" data-testid="text-price">
                      KSh {settings?.subscriptionPrice || 70}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {settings?.subscriptionDays || 30}-day subscription with full bot access and 154+ commands
                  </p>
                </div>

                <div className="p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5 shrink-0" />
                  <div className="text-xs">
                    <p className="font-semibold text-yellow-600 dark:text-yellow-400">Automatic payments unavailable</p>
                    <p className="text-muted-foreground mt-0.5">M-Pesa STK push is not yet configured. Please use manual payment below.</p>
                  </div>
                </div>

                <Button
                  className="w-full"
                  variant="outline"
                  onClick={() => toast({ title: "Automatic payments unavailable", description: "Please use the manual payment method below to activate your subscription.", variant: "destructive" })}
                  data-testid="button-pay"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay with M-Pesa (Auto — Unavailable)
                </Button>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Phone className="w-4 h-4 text-primary" />
                  Manual Payment Guide
                </CardTitle>
                <CardDescription>Pay via M-Pesa then send confirmation to admin for activation</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { step: "1", text: "Open M-Pesa on your phone", detail: "Go to Lipa na M-Pesa → Send Money" },
                    { step: "2", text: "Send KSh 70 to 0758891491", detail: "Payee: Nutterx Technologies" },
                    { step: "3", text: "Copy the M-Pesa confirmation SMS", detail: "Example: FRQ2GH7K2A Confirmed. KSh70.00 sent to NUTTERX..." },
                    { step: "4", text: "Send the confirmation to our WhatsApp", detail: "WhatsApp: +254758891491 — include your registered email" },
                    { step: "5", text: "Admin activates your subscription", detail: "Activation done within a few hours (Mon–Sun 8am–10pm)" },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border/50">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-xs font-bold text-primary-foreground">{item.step}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium">{item.text}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{item.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <a href="https://wa.me/254758891491?text=Hi%2C%20I%20have%20paid%20for%20NX-MD%20BOT%20subscription%20(KSh%2070).%20My%20M-Pesa%20message%20is%3A%20" target="_blank" rel="noopener noreferrer" data-testid="link-manual-pay">
                  <Button className="w-full">
                    <SiWhatsapp className="w-4 h-4 mr-2" />
                    Send Payment Confirmation to Admin
                  </Button>
                </a>
              </CardContent>
            </Card>

            {payments && payments.length > 0 && (
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="text-lg">Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {payments.map((p: any) => (
                      <div key={p._id} className="flex items-center justify-between p-3 rounded-lg bg-card border border-border/50" data-testid={`row-payment-${p._id}`}>
                        <div>
                          <p className="text-sm font-medium">KSh {p.amount}</p>
                          <p className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</p>
                        </div>
                        <Badge
                          variant={p.status === "completed" ? "default" : p.status === "pending" ? "secondary" : "destructive"}
                        >
                          {p.status === "completed" && <CheckCircle2 className="w-3 h-3 mr-1" />}
                          {p.status === "pending" && <RefreshCw className="w-3 h-3 mr-1" />}
                          {p.status === "failed" && <XCircle className="w-3 h-3 mr-1" />}
                          {p.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <Card className="border-border/50 mt-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm">Need Help?</p>
                  <p className="text-xs text-muted-foreground">Contact Nutterx Technologies for support</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href="https://wa.me/254758891491"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-testid="link-support-whatsapp"
                >
                  <Button variant="outline" size="sm">
                    <SiWhatsapp className="w-4 h-4 mr-1.5" />
                    0758891491
                  </Button>
                </a>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
