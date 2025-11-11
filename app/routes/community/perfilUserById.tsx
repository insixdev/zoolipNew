// componente el cual muestra el perfil de un usuario por su id
// al obtener todos los usuarios

export async function loader({ params }) {
  const { userId } = params;
  return { userId };
};

// profle card ya usada para el perfil del usuario actual
export function ProfileById({ userId}) {
  return <div>ProfileById</div>;
}
