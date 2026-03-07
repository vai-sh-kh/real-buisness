"use client";

import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSettings, useUpdateSettings } from "@/hooks/useSettings";
import {
  adminSettingsSchema,
  type AdminSettingsFormValues,
} from "@/lib/validations/settings.schema";
import type { ThemePreference } from "@/types";
import {
  Bell,
  User,
  Settings,
  Shield,
  Loader2,
  Mail,
  Lock,
  Info,
  Sun,
  Moon,
  Monitor,
} from "lucide-react";
import { useAdminTheme } from "./AdminThemeContext";
import { cn } from "@/lib/utils";

const THEMES: {
  value: ThemePreference;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "system", label: "System", icon: Monitor },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "hi", label: "Hindi" },
  { value: "te", label: "Telugu" },
  { value: "ta", label: "Tamil" },
  { value: "ml", label: "Malayalam" },
];

const TIMEZONES = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "America/New_York", label: "Eastern (EST)" },
  { value: "America/Los_Angeles", label: "Pacific (PST)" },
  { value: "Europe/London", label: "London (GMT)" },
];

export function SettingsView() {
  const { data, isLoading } = useSettings();
  const updateMutation = useUpdateSettings();
  const { theme, setTheme } = useAdminTheme();
  const searchParams = useSearchParams();
  const settings = data?.data;

  const form = useForm<AdminSettingsFormValues>({
    resolver: zodResolver(adminSettingsSchema),
    defaultValues: {
      display_name: "",
      avatar_url: "",
      phone: "",
      notifications_enabled: true,
      email_notifications: true,
      lead_alerts: true,
      browser_notifications: true,
      theme: "dark",
      language: "en",
      timezone: "UTC",
    },
    values: settings
      ? {
          display_name: settings.display_name ?? "",
          avatar_url: settings.avatar_url ?? "",
          phone: settings.phone ?? "",
          notifications_enabled: settings.notifications_enabled,
          email_notifications: settings.email_notifications,
          lead_alerts: settings.lead_alerts,
          browser_notifications: settings.browser_notifications,
          theme: settings.theme,
          language: settings.language,
          timezone: settings.timezone,
        }
      : undefined,
  });

  const { handleSubmit, watch, setValue } = form;
  const isPending = updateMutation.isPending;

  async function onSubmit(values: AdminSettingsFormValues) {
    await updateMutation.mutateAsync({
      ...values,
      avatar_url: values.avatar_url || null,
    });
  }

  async function handleToggle(
    field: keyof AdminSettingsFormValues,
    value: boolean,
  ) {
    setValue(field, value);
    await updateMutation.mutateAsync({ [field]: value });
  }

  if (isLoading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-200">
        <div className="grid w-full max-w-2xl grid-cols-4 gap-1 rounded-xl bg-muted p-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 rounded-lg bg-muted/80 animate-pulse"
            />
          ))}
        </div>
        <div className="rounded-xl border border-admin-card-border bg-admin-card-bg p-6 shadow-sm">
          <div className="mb-6 space-y-1">
            <div className="h-6 w-48 rounded bg-muted animate-pulse" />
            <div className="h-4 w-72 max-w-full rounded bg-muted animate-pulse" />
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30"
              >
                <div className="space-y-2">
                  <div className="h-4 w-40 rounded bg-muted animate-pulse" />
                  <div className="h-3 w-56 rounded bg-muted animate-pulse" />
                </div>
                <div className="h-6 w-11 rounded-full bg-muted animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const tabParam = searchParams.get("tab");
  const defaultTab = [
    "notifications",
    "profile",
    "general",
    "account",
  ].includes(tabParam ?? "")
    ? tabParam!
    : "notifications";

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue={defaultTab} className="space-y-6">
        <TabsList className="flex w-full overflow-x-auto gap-1 p-1 h-auto bg-muted rounded-xl lg:grid lg:max-w-2xl lg:grid-cols-4 [&>button]:shrink-0">
          <TabsTrigger
            value="notifications"
            className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2"
          >
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2"
          >
            <User className="h-4 w-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="general"
            className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2"
          >
            <Settings className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="account"
            className="rounded-lg py-2.5 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow-sm gap-2"
          >
            <Shield className="h-4 w-4" />
            Account
          </TabsTrigger>
        </TabsList>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-0">
          <Card className="border-admin-card-border bg-admin-card-bg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                Notification preferences
              </CardTitle>
              <CardDescription>
                Control how and when you receive notifications.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Enable notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Master switch for all notification types
                  </p>
                </div>
                <Switch
                  checked={watch("notifications_enabled")}
                  onCheckedChange={(v) =>
                    handleToggle("notifications_enabled", v)
                  }
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Email notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Receive alerts for new leads and updates via email
                  </p>
                </div>
                <Switch
                  checked={watch("email_notifications")}
                  onCheckedChange={(v) =>
                    handleToggle("email_notifications", v)
                  }
                  disabled={!watch("notifications_enabled")}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">Lead alerts</Label>
                  <p className="text-sm text-gray-500">
                    Get notified when a new lead is submitted
                  </p>
                </div>
                <Switch
                  checked={watch("lead_alerts")}
                  onCheckedChange={(v) => handleToggle("lead_alerts", v)}
                  disabled={!watch("notifications_enabled")}
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-admin-card-border p-4 bg-muted/30">
                <div className="space-y-0.5">
                  <Label className="text-base font-medium">
                    Browser notifications
                  </Label>
                  <p className="text-sm text-gray-500">
                    Show desktop notifications when you are on the site
                  </p>
                </div>
                <Switch
                  checked={watch("browser_notifications")}
                  onCheckedChange={(v) =>
                    handleToggle("browser_notifications", v)
                  }
                  disabled={!watch("notifications_enabled")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-0">
          <Card className="border-admin-card-border bg-admin-card-bg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Profile information</CardTitle>
              <CardDescription>
                Update your display name and contact details.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display name</Label>
                <Input
                  id="display_name"
                  placeholder="Admin User"
                  {...form.register("display_name")}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar_url">Avatar URL</Label>
                <Input
                  id="avatar_url"
                  type="url"
                  placeholder="https://example.com/avatar.jpg"
                  {...form.register("avatar_url")}
                  className="max-w-md"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 98765 43210"
                  {...form.register("phone")}
                  className="max-w-md"
                />
              </div>
              <Button type="submit" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving…
                  </>
                ) : (
                  "Save profile"
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* General Tab */}
        <TabsContent value="general" className="mt-0">
          <Card className="border-gray-200 shadow-sm dark:border-gray-800 dark:bg-gray-900/50">
            <CardHeader>
              <CardTitle className="text-lg">General preferences</CardTitle>
              <CardDescription className="dark:text-gray-400">
                Customize appearance and regional settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label>Theme</Label>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Choose light, dark, or follow your system preference.
                </p>
                <div className="flex flex-wrap gap-3">
                  {THEMES.map((t) => {
                    const Icon = t.icon;
                    const isActive = (watch("theme") ?? theme) === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => {
                          const v = t.value as ThemePreference;
                          setValue("theme", v);
                          setTheme(v);
                          updateMutation.mutate({ theme: v });
                        }}
                        className={cn(
                          "flex items-center gap-3 rounded-xl border-2 px-4 py-3 transition-all min-w-[120px]",
                          isActive
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background hover:border-muted-foreground/30",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0" />
                        <span className="font-medium">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Language</Label>
                <Select
                  value={watch("language")}
                  onValueChange={(v) => {
                    setValue("language", v);
                    updateMutation.mutate({ language: v });
                  }}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l.value} value={l.value}>
                        {l.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Timezone</Label>
                <Select
                  value={watch("timezone")}
                  onValueChange={(v) => {
                    setValue("timezone", v);
                    updateMutation.mutate({ timezone: v });
                  }}
                >
                  <SelectTrigger className="max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="mt-0">
          <Card className="border-admin-card-border bg-admin-card-bg shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Account settings</CardTitle>
              <CardDescription>
                View your account information. Credentials are managed via
                environment variables.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-3 rounded-xl border border-admin-card-border p-4 bg-muted/30">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <Label className="text-xs text-gray-500">Email</Label>
                  <p className="font-medium text-gray-900">
                    {settings?.email ?? "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/50 dark:bg-amber-950/30 p-4">
                <Lock className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <Label className="text-xs text-amber-700">Password</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Admin credentials are configured via environment variables (
                    <code className="bg-amber-100 px-1 rounded">
                      ADMIN_EMAIL
                    </code>
                    ,{" "}
                    <code className="bg-amber-100 px-1 rounded">
                      ADMIN_PASSWORD
                    </code>
                    ). To change your password, update your deployment
                    environment.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/30 p-4">
                <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                <div>
                  <Label className="text-xs text-blue-700">Security</Label>
                  <p className="text-sm text-gray-600 mt-1">
                    This admin panel uses session-based authentication. Ensure
                    your session secret is stored securely in production.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </form>
  );
}
