import { LoginForm } from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F4F1EA" }}>
      
      {/* Navbar */}
      <header className="w-full border-b border-black/10 bg-[#F4F1EA]/90 backdrop-blur-md sticky top-0 z-50 h-16 flex items-center px-6 md:px-12 justify-between">
        <span className="font-serif text-3xl font-bold tracking-tight uppercase" style={{ color: "#111111" }}>
          DIORAMA
        </span>
        <nav className="hidden md:flex gap-8 text-[11px] uppercase tracking-widest font-semibold items-center text-[#111111]">
          <a href="#" className="hover:text-[#1A365D] transition-colors">Projetos</a>
          <a href="#" className="hover:text-[#1A365D] transition-colors">Edições</a>
          <a href="#" className="hover:text-[#1A365D] transition-colors">Sobre Nós</a>
          <a href="#" className="hover:text-[#1A365D] transition-colors">Blog</a>
          <span className="border-l border-black/20 pl-8 ml-2 text-[#1A365D] font-bold">
            Login
          </span>
        </nav>
      </header>

      {/* Card */}
      <main className="flex-1 flex items-center justify-center py-20 px-6">
        <div className="bg-white border border-black/10 shadow-2xl p-12 md:p-20 w-full max-w-lg flex flex-col gap-10">
          
          <div className="text-center flex flex-col gap-2">
            <h1 className="font-serif text-5xl uppercase tracking-tighter text-[#111111]">
              Diorama
            </h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-black/40">
              Painel Editorial
            </p>
          </div>

          <LoginForm />

        </div>
      </main>
    </div>
  );
}