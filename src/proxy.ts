import { NextRequest, NextResponse } from 'next/server';
import { decrypt } from './utils/jwt';

// 認証していなくてもアクセスできるページのパス。
const PUBLIC_PATHS = ['/login', '/signup'];

// リクエストごとにセッションを確認し、ページへのアクセスを制御する。
export async function proxy(request: NextRequest) {
  
  // リクエストURLからパス部分（例: /login）を取り出す。
  const { pathname } = request.nextUrl;

  // Cookieからセッションを取得し、decryptでJWTを検証・復号する。
  // decryptは成功時にペイロードを返し、失敗時にはnullを返す。
  const cookie = request.cookies.get('session');
  const session = await decrypt(cookie?.value);

  // セッションにuserIdがあればログイン済みとし、現在のパスが公開ページかを調べる。
  const isAuthenticated = !!session?.userId;
  const isPublicPath = PUBLIC_PATHS.some((path) => pathname.startsWith(path));

  // ログイン済みでログイン・新規登録ページにアクセスした場合はトップページへ移動する。
  if (isAuthenticated && isPublicPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 未ログインで公開ページ以外にアクセスした場合はログインページへ移動する。
  if (!isAuthenticated && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // どちらのリダイレクト条件にも当てはまらない場合は、そのまま次の処理へ進める。
  return NextResponse.next();
}

// API、Next.jsの静的ファイル・画像、PNGファイルを除くリクエストにProxyを適用する。
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};