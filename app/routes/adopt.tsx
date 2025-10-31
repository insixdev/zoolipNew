import { Link } from 'react-router';

export default function Adopt() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-6">Adopta una Mascota</h1>
          <p className="text-xl text-gray-600 mb-8">Encuentra a tu compañero perfecto</p>
          
          <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Example pet card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-gray-200">
                <img 
                  src="https://images.unsplash.com/photo-1587300003388-59208cc962cb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                  alt="Perro en adopción"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Max</h3>
                <p className="text-gray-600 mb-4">Macho • 2 años • Labrador Mix</p>
                <Link 
                  to="/adopt/max" 
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                  Conocer más
                </Link>
              </div>
            </div>

            {/* Add more pet cards here */}
          </div>
        </div>
      </div>
    </div>
  );
}