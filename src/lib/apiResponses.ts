import { NextResponse } from "next/server";

export function ok<T extends object>(payload: T, status = 200) {
  return NextResponse.json(payload, { status });
}

export function fail(error: string, status = 500, details?: string) {
  return NextResponse.json(
    details ? { error, details } : { error },
    { status },
  );
}
