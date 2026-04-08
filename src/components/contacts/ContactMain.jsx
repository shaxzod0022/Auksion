import { styles } from "@/styles/styles";
import ContactForm from "./ContactForm";
import ContactInfo from "./ContactInfo";

export default function ContactMain() {
  return (
    <div
      className={`${styles.paddingCont} grid grid-cols-1 md:grid-cols-2 gap-10`}
    >
      <ContactForm />
      <ContactInfo />
    </div>
  );
}
