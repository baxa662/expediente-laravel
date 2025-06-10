import { Navbar } from "./components/Navbar";
import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from "react-router-dom";
import "./App.css";
import { PrivateRoutes } from "./components/PrivateRoutes";
import { PublicRoutes } from "./components/PublicRoutes";

function App() {
    return (
        <Router className="App">
            <div className="drawer">
                <input
                    id="my-drawer-3"
                    type="checkbox"
                    className="drawer-toggle"
                />
                <div className="drawer-content flex flex-col">
                    <div className="w-full navbar bg-base-100 shadow-sm">
                        <div className="flex-none lg:hidden">
                            <label
                                htmlFor="my-drawer-3"
                                className="btn btn-square btn-ghost"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block w-6 h-6 stroke-current"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    ></path>
                                </svg>
                            </label>
                        </div>
                        <div className="flex px-2 mx-2 items-center">
                            <div className="mr-2">UMER</div>
                            <div className="hidden lg:block">
                                <Navbar
                                    clase="menu menu-horizontal"
                                    idNav={"my-drawer-3"}
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Routes>
                            {localStorage.getItem("sessionToken") ? (
                                <Route
                                    exact
                                    path="/*"
                                    element={<PrivateRoutes />}
                                />
                            ) : (
                                <Route
                                    exact
                                    path="/*"
                                    element={<PublicRoutes />}
                                />
                            )}
                            <Route
                                path="*"
                                element={<Navigate to="/login" replace />}
                            />
                        </Routes>
                    </div>
                </div>
                <div className="drawer-side">
                    <label
                        htmlFor="my-drawer-3"
                        className="drawer-overlay"
                    ></label>
                    <Navbar
                        clase="menu p-4 w-80 h-full bg-base-100"
                        idNav={"my-drawer-3"}
                    />
                </div>
            </div>
        </Router>
    );
}

export default App;
