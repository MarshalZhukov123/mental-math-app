import { NavLink, Outlet } from "react-router";
import { useAuthActions } from "@convex-dev/auth/react";
import { Authenticated, Unauthenticated } from "convex/react";

export default function Layout() {
    const { signOut } = useAuthActions();

    return (
        <div className="min-h-screen" data-theme="night">
            <nav className="bg-base-300 p-4 flex justify-between">
                {/* menus */}
                <div className="flex gap-4">
                    <NavLink
                        to="/"
                        className={({ isActive }) => (isActive ? "text-primary" : "")}
                    >
                        Map
                    </NavLink>
                    <NavLink
                        to="/dungeon"
                        className={({ isActive }) => (isActive ? "text-primary" : "")}
                    >
                        Dungeon
                    </NavLink>
                </div>

                {/* user info */}
                <div>
                    <Authenticated>
                        <button className="btn btn-sm" onClick={() => signOut()}>
                            Logout
                        </button>
                    </Authenticated>
                    <Unauthenticated>
                        <NavLink to="/login">
                            <button className="btn btn-sm">Login</button>
                        </NavLink>
                    </Unauthenticated>
                </div>
            </nav>
            <Outlet />
        </div>
    );
}