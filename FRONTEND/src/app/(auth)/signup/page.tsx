'use client';

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signup } from "./actions";

export default function SignupPage({ searchParams }: { searchParams: { message: string } }) {
  const message = searchParams.message;

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 px-6 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border bg-white p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Create an account</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to create your account.
          </p>
        </div>
        {message && (
          <div className="rounded-md border border-destructive bg-destructive/10 p-3 text-center text-sm text-destructive">
            {message}
          </div>
        )}
        <form className="space-y-4" action={signup}>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="full_name">
              Full Name
            </label>
            <Input
              id="full_name"
              name="full_name"
              type="text"
              placeholder="Your full name"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="space-y-2 text-left">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
            />
          </div>
          <Button className="w-full" type="submit">
            Create account
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
