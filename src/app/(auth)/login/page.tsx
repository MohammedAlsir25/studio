
'use client';

import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Loader2, Wallet } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { GoogleIcon } from '@/components/ui/google-icon';

export default function LoginPage() {
  const [isPending, startTransition] = useTransition();
  const { handleSubmit } = useForm();
  const { login } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const onSubmit = () => {
    startTransition(async () => {
      try {
        await login('user@email.com', 'password');
        toast({ title: "Login Successful", description: "Welcome back!" });
        router.push('/dashboard');
      } catch (error) {
        toast({ variant: 'destructive', title: "Login Failed", description: "Please check your credentials." });
      }
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-background p-4">
       <div className="flex items-center gap-2 font-headline text-2xl font-bold tracking-wider text-primary">
        <Wallet />
        <span>WalletWise</span>
      </div>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">Welcome Back!</CardTitle>
          <CardDescription>Enter your credentials to access your dashboard.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="user@email.com" defaultValue="user@email.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" defaultValue="password" required />
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-4">
            <Button type="submit" className="w-full font-bold" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Login
            </Button>
             <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <Button variant="outline" className="w-full" disabled={isPending}>
              <GoogleIcon className="mr-2 h-4 w-4" />
              Google
            </Button>
          </CardFooter>
        </form>
         <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="underline underline-offset-4 hover:text-primary">
              Sign up
            </Link>
          </p>
      </Card>
    </div>
  );
}
