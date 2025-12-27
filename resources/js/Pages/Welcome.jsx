import { Link } from '@inertiajs/react';
import Header from '../Components/Header';
import Footer from '../Components/Footer';

export default function Welcome({ user }) {
  return (
    <div className="min-h-screen bg-white">
      <Header user={user} />
      
      <section className="py-20 px-4 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Bienvenue sur AnnoncesHub</h1>
        <p className="text-xl text-gray-600 mb-8">La plateforme complète pour vos annonces</p>
        <div className="flex gap-4 justify-center">
          <Link href="/ads" className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Parcourir les annonces
          </Link>
          {!user && (
            <Link href="/register" className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
              S'inscrire
            </Link>
          )}
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
