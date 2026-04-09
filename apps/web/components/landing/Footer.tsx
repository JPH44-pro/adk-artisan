import { SocialIcon } from "react-social-icons";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Mail } from "lucide-react";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-slate-950 text-slate-800 dark:text-white py-16 px-4 border-t border-slate-200/50 dark:border-slate-800/50">
      <div className="max-w-6xl mx-auto">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Brand Section */}
          <div className="text-center md:text-left">
            <div className="flex items-center space-x-3 mb-6 justify-center md:justify-start">
              <Image
                src="/logo.png"
                alt="ReglePro"
                width={40}
                height={40}
                className="flex-shrink-0 rounded-xl"
              />
              <div className="text-2xl font-bold text-slate-800 dark:text-white">
                ReglePro
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 mb-4 max-w-md mx-auto md:mx-0">
              Le poste de pilotage pour artisans et TPE du bâtiment : devis,
              factures, dossier client et agenda. Un abonnement clair, pas une
              commission cachée sur vos chantiers.
            </p>
            <div className="flex gap-3 justify-center md:justify-start">
              <SocialIcon
                url="https://twitter.com"
                className="h-9 w-9 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="currentColor"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                url="https://linkedin.com"
                className="p-0 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="currentColor"
                style={{ height: 40, width: 40 }}
              />
              <SocialIcon
                url="https://github.com"
                className="h-9 w-9 hover:opacity-80 transition-opacity duration-200"
                bgColor="transparent"
                fgColor="currentColor"
                style={{ height: 40, width: 40 }}
              />
            </div>
          </div>

          {/* Links Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center md:text-left">
            {/* Product Links */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white text-lg mb-4">
                Produit
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="#features"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Fonctionnalités
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Tarifs
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#demo"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Aperçu
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-semibold text-slate-800 dark:text-white text-lg mb-4">
                Légal
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="mailto:contact@reglepro.io"
                    className="flex items-center justify-center md:justify-start gap-2 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    <Mail className="w-4 h-4" />
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Confidentialité
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Conditions d&apos;utilisation
                  </Link>
                </li>
                <li>
                  <Link
                    href="/cookies"
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors duration-200"
                  >
                    Cookies
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-500 dark:text-slate-500 text-sm">
              © {new Date().getFullYear()} ReglePro. Tous droits réservés.
            </p>
            <Badge className="bg-primary/10 hover:bg-primary/10 border-primary/20 text-primary text-xs">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                Service opérationnel
              </div>
            </Badge>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
