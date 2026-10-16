import Header from "../components/Header";
import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#F4F1EA]">
      <Header />
      <main className="mx-auto max-w-lg px-6 py-20">
        <div className="bg-white border border-black/10 p-10 shadow-xl">
          <h1 className="font-serif text-4xl uppercase mb-3">Diorama</h1>
          <p className="text-sm text-neutral-500 mb-10">Painel Editorial</p>
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
