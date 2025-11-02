import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/Avatar";
import TrendingSidebar from "~/components/community/buscar/TrendingSidebar";

type TrendingItem = {
  tag: string;
  posts: string;
};

type UserToFollow = {
  name: string;
  user: string;
  avatar: string;
};
/*
 * trendingSection commponent
 * for COMMUNITY page trending section
 * @returns {JSX.Element}
 *
 * */
export default function TrendingSection() {
  const trendingItems: TrendingItem[] = [
    { tag: "#AdoptaConAmor", posts: "12.5K" },
    { tag: "#Perros", posts: "8,231" },
    { tag: "#Gatos", posts: "5,982" },
    { tag: "#CuidadoAnimal", posts: "3,104" },
    { tag: "#HistoriasFelices", posts: "2,457" },
  ];

  // Convertir datos para el componente TrendingSidebar
  const trendingTopics = trendingItems.map((item) => ({
    tag: item.tag,
    posts:
      parseInt(item.posts.replace(/[K,]/g, "")) *
      (item.posts.includes("K") ? 1000 : 1),
    growth: `+${Math.floor(Math.random() * 20) + 5}%`, // Crecimiento aleatorio para demo
  }));

  const usersToFollow: UserToFollow[] = [
    {
      name: "María González",
      user: "@mariag",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Juan Pérez",
      user: "@juanperez",
      avatar: "https://i.pravatar.cc/100?img=8",
    },
    {
      name: "Laura Martínez",
      user: "@lauramtz",
      avatar: "https://i.pravatar.cc/100?img=9",
    },
  ];

  return (
    <div className="sticky top-24 h-[calc(100vh-6rem)] flex flex-col">
      {/* Contenedor principal con scroll */}
      <div className="flex-1 overflow-y-auto pl-6 pr-2 scrollbar-hide">
        {/* Sección de Tendencias - Fija en la parte superior */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm rounded-lg shadow-sm mb-3">
          <div className="px-4 py-2.5">
            <h3 className="text-sm font-semibold text-rose-700 text-center tracking-wide">
              Tendencias para ti
            </h3>
          </div>
        </div>

        <TrendingSidebar trendingTopics={trendingTopics} />

        {/* Sección de Usuarios a Seguir */}
        <Card className="bg-white/80 backdrop-blur-sm border border-rose-50 mt-4">
          <CardHeader className="pb-3">
            <CardTitle className="text-base text-rose-800">
              A quién seguir
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {usersToFollow.map((user) => (
              <div
                key={user.user}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500">{user.user}</p>
                  </div>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-rose-100 text-rose-700 text-sm font-medium hover:bg-rose-200 transition-colors">
                  Seguir
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Enlaces de interés - Ahora es parte del flujo normal */}
        <div className="mt-4 text-xs text-gray-400 space-y-2 px-2 py-4">
          <div className="flex flex-wrap gap-x-3 justify-center">
            <Link
              to="/info/terminos"
              className="hover:text-rose-600 transition-colors"
            >
              Términos
            </Link>
            <Link
              to="/info/privacidad"
              className="hover:text-rose-600 transition-colors"
            >
              Privacidad
            </Link>
            <Link
              to="/info/cookies"
              className="hover:text-rose-600 transition-colors"
            >
              Cookies
            </Link>
          </div>
          <p className="text-center text-gray-400">© 2025 Zoolip</p>
        </div>
      </div>
    </div>
  );
}
