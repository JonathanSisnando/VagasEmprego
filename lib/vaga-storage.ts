import { readFile, writeFile, mkdir } from "fs/promises";
import { join } from "path";
import type { Vaga } from "../data/vagas";

const DATA_DIR = process.env.VERCEL
  ? "/tmp"
  : join(process.cwd(), "data");

const ARQUIVO_VAGAS = join(DATA_DIR, "vagas-cadastradas.json");

export async function lerVagasUsuario(): Promise<Vaga[]> {
  try {
    await mkdir(DATA_DIR, { recursive: true });
    const data = await readFile(ARQUIVO_VAGAS, "utf-8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function salvarVagasUsuario(vagas: Vaga[]) {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(ARQUIVO_VAGAS, JSON.stringify(vagas, null, 2), "utf-8");
}
