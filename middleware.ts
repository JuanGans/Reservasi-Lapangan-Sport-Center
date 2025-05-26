// middleware.ts
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();
  const { pathname } = req.nextUrl;

  // 🛑 Skip static files & public assets
  if (pathname.startsWith("/_next/") || pathname.startsWith("/images/") || pathname.startsWith("/assets/") || pathname.startsWith("/uploads/") || pathname.startsWith("/favicon.ico")) {
    return NextResponse.next();
  }

  const isAuthPage = ["/login", "/register", "/forget_password", "/reset_password", "/ubah_password"].includes(pathname);
  const isProtectedPage = pathname.startsWith("/admin") || pathname.startsWith("/member") || pathname === "/profile";
  const isPublicPage = !isProtectedPage && !isAuthPage;

  if (token) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      const { payload } = await jwtVerify(token, secret);

      const user = payload as { id: number; role: string };
      const userRole = user.role; // 'admin' | 'member'
      const isAdminPath = pathname.startsWith("/admin");
      const isMemberPath = pathname.startsWith("/member");

      // ⛔ Admin coba buka /member → balikin ke /admin
      if (userRole === "admin" && isMemberPath) {
        url.pathname = "/admin";
        url.searchParams.set("restricted", "1");
        return NextResponse.redirect(url);
      }

      // ⛔ Member coba buka /admin → balikin ke /member
      if (userRole === "member" && isAdminPath) {
        url.pathname = "/member";
        url.searchParams.set("restricted", "1");
        return NextResponse.redirect(url);
      }

      // ⛔ Kalau sudah login dan ke public/auth page → redirect ke dashboard
      if (isAuthPage || isPublicPage) {
        url.pathname = userRole === "admin" ? "/admin" : "/member";
        url.searchParams.set("repeat", "1");
        return NextResponse.redirect(url);
      }
    } catch (err) {
      // ⛔ Token invalid / expired → redirect ke logout page
      url.pathname = "/api/auth/logout"; // BUAT halaman /logout yg panggil /api/auth/logout
      url.searchParams.set("expired", "1");
      return NextResponse.redirect(url);
    }
  } else if (isProtectedPage) {
    // ⛔ Gak ada token, tapi mau akses halaman dilindungi
    url.pathname = "/";
    url.searchParams.set("unauthorized", "1");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"], // hanya intercept halaman, bukan API
};
