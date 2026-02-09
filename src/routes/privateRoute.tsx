import { Outlet, Navigate } from "react-router-dom";

type PrivateRouteProps = {
    allowedRoles: string[];
}

export function PrivateRoute({allowedRoles}: PrivateRouteProps) {
    // Intentar obtener el usuario del localStorage
    let user;
    try {
        const userStr = localStorage.getItem('user');
        console.log("Usuario en localStorage:", userStr);
        user = userStr ? JSON.parse(userStr) : null;
        console.log("Usuario parseado:", user);
    } catch (error) {
        console.error("Error al parsear usuario:", error);
        user = null;
    }

    // Verificar si el usuario está autenticado
    const token = localStorage.getItem('token');
    const isAuthenticated = !!token && !!user;
    console.log("¿Usuario autenticado?:", isAuthenticated);
    
    // Obtener roles del usuario (puede ser un array o un string)
    // El backend parece usar 'role' en singular. Si no hay rol, asignamos 'user' por defecto
    const userRoles = user?.role || user?.roles || ['user'];
    console.log("Roles del usuario:", userRoles);
    
    // Verificar si el usuario tiene alguno de los roles permitidos
    const hasAllowedRole = Array.isArray(userRoles) 
        ? userRoles.some(role => allowedRoles.includes(role))
        : allowedRoles.includes(userRoles);
    console.log("Roles permitidos:", allowedRoles);
    console.log("¿Tiene rol permitido?:", hasAllowedRole);

    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
        console.log("Usuario no autenticado, redirigiendo a login");
        return <Navigate to="/sign-in" replace />;
    }
    
    // Si está autenticado pero no tiene los roles necesarios, redirigir a 404
    if (!hasAllowedRole) {
        console.log("Usuario sin permisos, redirigiendo a 404");
        return <Navigate to="/404" replace />;
    }
    
    // Si está autenticado y tiene los roles necesarios, mostrar la ruta protegida
    console.log("Usuario autenticado y con permisos, mostrando contenido");
    return <Outlet />;
}