'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { useData } from '@/hooks/use-data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Monitor, Moon, Sun } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();
  const { clearAllData } = useData();
  const { toast } = useToast();
  const router = useRouter();
  const [isClearDataDialogOpen, setIsClearDataDialogOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
    router.push('/login');
  };
  
  const handleClearData = async () => {
    await clearAllData();
    toast({ title: 'Data Cleared', description: 'All your local data has been deleted.' });
    setIsClearDataDialogOpen(false);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-4xl font-black tracking-tighter">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application settings.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
          <CardDescription>Manage your session and account details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Appearance</CardTitle>
          <CardDescription>Customize the look and feel of the application.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="dark-mode" className="flex flex-col gap-1">
              <span>Theme</span>
              <span className="text-xs font-normal text-muted-foreground">
                Select your preferred color scheme.
              </span>
            </Label>
             <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-36">
                    <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="light">
                        <div className="flex items-center gap-2">
                            <Sun className="size-4" />
                            <span>Light</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                            <Moon className="size-4" />
                            <span>Dark</span>
                        </div>
                    </SelectItem>
                    <SelectItem value="system">
                        <div className="flex items-center gap-2">
                            <Monitor className="size-4" />
                            <span>System</span>
                        </div>
                    </SelectItem>
                </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
          <CardDescription>Manage your application data.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="destructive" onClick={() => setIsClearDataDialogOpen(true)}>
            Clear Local Data
          </Button>
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently delete all your expenses and budgets from this device. This action cannot be undone.
          </p>
        </CardContent>
      </Card>

      <AlertDialog open={isClearDataDialogOpen} onOpenChange={setIsClearDataDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete all your expenses and budget data from your browser's local storage.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleClearData}>
              Yes, delete my data
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
