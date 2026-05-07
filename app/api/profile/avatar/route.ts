import { NextRequest } from "next/server";
import { fail, ok } from "@/src/lib/apiResponses";
import { getBearerToken, requireRouteUser } from "@/src/lib/routeAuth";
import { getSupabaseAnonClientForUser, getSupabaseServerClient } from "@/src/lib/supabaseServer";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);

function extForMime(mime: string): string | null {
  switch (mime) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return null;
  }
}

export async function POST(request: NextRequest) {
  const service = getSupabaseServerClient();
  if (!service) {
    return fail("Supabase server configuration missing", 500);
  }

  const auth = await requireRouteUser(request, service);
  if (auth instanceof Response) return auth;

  const token = getBearerToken(request);
  if (!token) {
    return fail("Unauthorized", 401);
  }

  const userClient = getSupabaseAnonClientForUser(token);
  if (!userClient) {
    return fail("Supabase public configuration missing", 500);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return fail("Invalid form data", 400);
  }

  const entry = formData.get("avatar");
  if (!entry || typeof entry === "string") {
    return fail("Missing avatar file", 400);
  }

  const file = entry as File;
  const mime = (file.type || "").toLowerCase().split(";")[0]?.trim() || "";
  if (!ALLOWED_TYPES.has(mime)) {
    return fail("Invalid file type", 400, "Use JPG, PNG, WebP, or GIF.");
  }
  if (file.size > MAX_BYTES) {
    return fail("File too large", 400, "Maximum size is 5 MB.");
  }

  const ext = extForMime(mime);
  if (!ext) {
    return fail("Invalid file type", 400);
  }

  const userId = auth.user.id;
  const path = `${userId}/avatar.${ext}`;
  const body = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await userClient.storage.from("avatars").upload(path, body, {
    upsert: true,
    contentType: mime,
    cacheControl: "3600",
  });

  if (uploadError) {
    return fail("Upload failed", 500, uploadError.message);
  }

  const { data: pub } = userClient.storage.from("avatars").getPublicUrl(path);
  const avatarUrl = pub.publicUrl;

  const { error: dbError } = await service.from("profiles").update({ avatar_url: avatarUrl }).eq("id", userId);
  if (dbError) {
    return fail("Failed to save profile photo", 500, dbError.message);
  }

  return ok({ avatarUrl });
}
