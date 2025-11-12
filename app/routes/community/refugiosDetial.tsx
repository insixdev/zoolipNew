// app/routes/community/institution.$id.tsx
import {  type LoaderFunctionArgs } from "react-router";
import { useLoaderData, Link } from "react-router";
import { FaArrowLeft, FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaClock, FaPaw, FaHeart, FaHome, FaCalendarAlt, FaUsers } from "react-icons/fa";

export async function loader({ params }: LoaderFunctionArgs) {
  const institutionId = params.id;
  // In a real app, you would fetch the institution data from your API
  // For now, we'll use a mock function
  const institution = await getInstitutionById(institutionId);
  
  if (!institution) {
    throw new Response("Institution not found", { status: 404 });
  }
  
  return json({ institution });
}

export default function InstitutionDetails() {
  const { institution } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            to="/community/refugios"
            className="inline-flex items-center text-rose-600 hover:text-rose-800 mb-4"
          >
            <FaArrowLeft className="mr-2" />
            Volver a refugios
          </Link>
          
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <img
                className="h-32 w-32 rounded-full ring-4 ring-white"
                src={institution.logo || "https://via.placeholder.com/150"}
                alt={institution.name}
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {institution.name}
                </h1>
                {institution.verified && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verificado
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-600">{institution.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-4">
                <div className="flex items-center text-sm text-gray-500">
                  <FaMapMarkerAlt className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.address}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaPhone className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.phone}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaEnvelope className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.email}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <FaClock className="mr-1.5 h-4 w-4 flex-shrink-0 text-rose-500" />
                  {institution.workingHours}
                </div>
                {institution.website && (
                  <a
                    href={institution.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-rose-600 hover:text-rose-800"
                  >
                    <FaGlobe className="mr-1.5 h-4 w-4 flex-shrink-0" />
                    Sitio web
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Sobre nosotros
              </h2>
              <div className="space-y-4 text-gray-600">
                <p>{institution.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaHome className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Fundado en</p>
                      <p className="text-sm text-gray-500">{institution.established}</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaPaw className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Animales rescatados</p>
                      <p className="text-sm text-gray-500">{institution.animalsRescued}+</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaHeart className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">Adopciones</p>
                      <p className="text-sm text-gray-500">{institution.adoptionsCompleted}+</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
                      <FaUsers className="h-5 w-5 text-rose-600" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">En adopción</p>
                      <p className="text-sm text-gray-500">{institution.currentAnimals} actualmente</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Available Pets */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Mascotas disponibles para adopción
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {institution.availablePets.map((pet) => (
                  <div
                    key={pet.id}
                    className="group relative rounded-lg overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-32 sm:h-40 object-cover"
                    />
                    <div className="p-3">
                      <h3 className="text-sm font-medium text-gray-900">{pet.name}</h3>
                      <p className="text-xs text-gray-500">{pet.type === 'dog' ? 'Perro' : 'Gato'} • {pet.age}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaMapMarkerAlt className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Dirección</p>
                    <p className="text-sm text-gray-500">{institution.address}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaPhone className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Teléfono</p>
                    <p className="text-sm text-gray-500">{institution.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaEnvelope className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <a
                      href={`mailto:${institution.email}`}
                      className="text-sm text-rose-600 hover:text-rose-800"
                    >
                      {institution.email}
                    </a>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <FaClock className="h-5 w-5 text-rose-600" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">Horario de atención</p>
                    <p className="text-sm text-gray-500">{institution.workingHours}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    institution.address
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500"
                >
                  Ver en el mapa
                </a>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Estadísticas</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Animales rescatados</span>
                    <span className="font-semibold text-rose-600">
                      {institution.animalsRescued}+
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full"
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Adopciones exitosas</span>
                    <span className="font-semibold text-rose-600">
                      {institution.adoptionsCompleted}+
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full"
                      style={{
                        width: `${(institution.adoptionsCompleted / institution.animalsRescued) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">En adopción</span>
                    <span className="font-semibold text-rose-600">
                      {institution.currentAnimals}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-rose-600 h-2 rounded-full"
                      style={{
                        width: `${(institution.currentAnimals / institution.animalsRescued) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Mock function - replace with actual API call
async function getInstitutionById(id: string) {
  // In a real app, you would fetch this from your API
  const institutions = [
    {
      id: "1",
      name: "Refugio Esperanza Animal",
      description:
        "Dedicados al rescate y rehabilitación de perros y gatos abandonados. Más de 15 años ayudando a encontrar hogares amorosos para nuestros amigos de cuatro patas.",
      image:
        "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=300&fit=crop",
      logo: "https://i.pravatar.cc/100?img=50",
      location: "Ciudad de México",
      address: "Av. Insurgentes Sur 1234, Col. Del Valle, CDMX",
      phone: "+52 55 1234-5678",
      email: "contacto@esperanzaanimal.org",
      website: "https://esperanzaanimal.org",
      established: "2008",
      animalsRescued: 2847,
      adoptionsCompleted: 2156,
      currentAnimals: 89,
      specialties: ["Perros", "Gatos", "Rehabilitación", "Cirugías"],
      workingHours: "Lun-Dom 9:00-18:00",
      availablePets: [
        {
          id: "p1",
          name: "Max",
          type: "dog",
          age: "2 años",
          image:
            "https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=400&h=400&fit=crop",
        },
        {
          id: "p2",
          name: "Luna",
          type: "cat",
          age: "1 año",
          image:
            "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
        },
        {
          id: "p3",
          name: "Rocky",
          type: "dog",
          age: "3 años",
          image:
            "https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=400&h=400&fit=crop",
        },
        {
          id: "p4",
          name: "Mimi",
          type: "cat",
          age: "6 meses",
          image:
            "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
        },
      ],
      verified: true,
    },
    // Add more mock data as needed
  ];

  return institutions.find((institution) => institution.id === id);
}
