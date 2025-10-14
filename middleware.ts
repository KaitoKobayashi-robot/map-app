import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  // 環境変数からユーザー名とパスワードを取得
  const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
  const BASIC_AUTH_PASS = process.env.BASIC_AUTH_PASS;

  // リクエストヘッダーから認証情報を取得
  const authHeader = req.headers.get("authorization");

  if (authHeader) {
    const authValue = authHeader.split(" ")[1];
    // Base64デコードして "ユーザー名:パスワード" の形式に
    const [user, pass] = Buffer.from(authValue, "base64").toString().split(":");

    // ユーザー名とパスワードが一致すればアクセスを許可
    if (user === BASIC_AUTH_USER && pass === BASIC_AUTH_PASS) {
      return NextResponse.next();
    }
  }

  // 認証情報がない、または正しくない場合、401 Unauthorizedレスポンスを返す
  return new NextResponse("Authentication Required.", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Secure Area"',
    },
  });
}

export const config = {
  // ここで指定したパス配下のページがパスワード保護の対象になります
  // 例: /admin/dashboard や /admin/settings など
  matcher: ["/map", "/control"],
};
