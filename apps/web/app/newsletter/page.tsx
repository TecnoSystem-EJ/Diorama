import { PublicPage } from "../components/PublicPage";
import { NewsletterForm } from "../components/NewsletterForm";
export default function NewsletterPage() {
  return <PublicPage title="Newsletter"><div className="max-w-md"><p>Cadastre seu e-mail para receber novidades da Diorama.</p><NewsletterForm /></div></PublicPage>;
}
