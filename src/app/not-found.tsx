import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center px-4 text-center">
      <div>
        <p className="font-brand text-8xl text-accent text-glow">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold text-white uppercase">Página no encontrada</h1>
        <p className="mt-2 text-zinc-400">Parece que este cable no lleva a ningún lado.</p>
        <Link href="/" className="btn-primary mt-8">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
