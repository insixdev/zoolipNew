export function profileButton() {
  function handleLogin() {

  }

  return (
    <div className="flex-none flex gap-2 items-center">


      <button className="btn btn-ghost btn-circle">
      </button>
      <div className="dropdown dropdown-end">
        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
          <div className="w-10 rounded-full">
            <div className="relative inline-block">
              <img className="inline-block size-11 rounded-full" src="https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80" alt="Avatar"/>
              <span className="absolute top-0 end-0 block size-3 rounded-full ring-2 ring-white bg-teal-400 dark:ring-neutral-900"></span>
            </div>

            <img src="https://via.placeholder.com/150" alt="Perfil" />
          </div>
        </label>
        <ul
          tabIndex={0}
          className="menu menu-sm dropdown-content bg-base-100 rounded-box z-5 mt-2 w-52 p-2 shadow"
        >
          <li>
            <a href="profile" onClick={handleLogin}>mi perfil </a>
          </li>
          <li><a>Configuración</a></li>
          <li><a>Cerrar Sesión</a></li>
        </ul>
      </div>
    </div>
  );
}
