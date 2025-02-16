export const RolePermissions = {
    presidente: ['listausuarios', 'reports', 'crear-noticia'],
    abogados: ['reports'],
    comisionados: ['listausuarios', 'reports', 'crear-noticia'],
    secretario: ['listausuarios', 'reports', 'crear-noticia'],
    administrador: ['listausuarios', 'reports', 'crear-noticia'],
  };
  
  export const DefaultRedirect = {
    presidente: '/listausuarios',
    comisionados: '/listausuarios',
    secretario: '/listausuarios',
    administrador: '/listausuarios',
    abogados: '/reports',
  };
  