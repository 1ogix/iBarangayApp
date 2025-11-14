'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { login } from "./actions";

export default function LoginPage({ searchParams }: { searchParams: { message: string } }) {
  const message = searchParams.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign in to BrgyGo</h1>
          <p className="text-sm text-muted-foreground">
            Use your Supabase-backed credentials to access the citizen or admin
            portals.
          </p>
        </div>
        {message && (
          <div className="rounded-md border border-blue-500 bg-blue-500/10 p-3 text-center text-sm text-blue-500">
            {message}
          </div>
        )}
        <form className="space-y-4" action={login}>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
          <Button className="w-full" type="submit">
            Continue
          </Button>
        </form>
        <div className="flex justify-between text-sm text-muted-foreground">
          <Link href="#" className="hover:text-primary">
            Forgot password?
          </Link>
          <Link href="/" className="hover:text-primary">
            Back to landing page
          </Link>
          <Link href={"/signup"} className="hover:text-primary">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
