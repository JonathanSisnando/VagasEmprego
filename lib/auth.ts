import crypto from "crypto";
import { cookies } from "next/headers";

const SESSION_COOKIE = "admin_session";
const SESSION_DURATION = 8 * 60 * 60 * 1000;

function getSecret(): string {
  return process.env.AUTH_SECRET ?? "fallback-secret";
}

function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? "admin",
    password: process.env.ADMIN_PASSWORD ?? "admin",
  };
}

type SessaoPayload = {
  username: string;
  exp: number;
};

export function criarToken(username: string): string {
  const payload: SessaoPayload = {
    username,
    exp: Date.now() + SESSION_DURATION,
  };

  const encoded = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getSecret())
    .update(encoded)
    .digest("hex");

  return `${encoded}.${sig}`;
}

export function verificarToken(token: string): string | null {
  try {
    const partes = token.split(".");

    if (partes.length !== 2) {
      return null;
    }

    const [encoded, sig] = partes;
    const expected = crypto
      .createHmac("sha256", getSecret())
      .update(encoded)
      .digest("hex");

    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) {
      return null;
    }

    const payload: SessaoPayload = JSON.parse(
      Buffer.from(encoded, "base64url").toString()
    );

    if (payload.exp < Date.now()) {
      return null;
    }

    return payload.username;
  } catch {
    return null;
  }
}

export async function getSessao(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  return verificarToken(token);
}

export async function setSessao(username: string) {
  const cookieStore = await cookies();
  const token = criarToken(username);

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION / 1000,
  });
}

export async function limparSessao() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export function validarCredenciais(username: string, password: string) {
  const admin = getAdminCredentials();
  return username === admin.username && password === admin.password;
}
