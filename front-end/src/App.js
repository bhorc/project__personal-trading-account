import './index.css';
import React from "react";
import AsideMenu from "./components/UI/Menu/AsideMenu";
import HeaderMenu from "./components/UI/Menu/HeaderMenu";
import UserMenu from "./components/UI/Menu/UserMenu";
import PersonalStatistics from "./components/UI/Statistics/PersonalStatistics";
import { userStatistics } from "./components/API/API.js";

function App() {
    return (
        <div className="App flex w-screen h-screen gap-1.5">
            <AsideMenu />
            <div className="flex flex-col grow items-stretch">
                <HeaderMenu />
                <main className="flex grow gap-1.5 rounded p-1 bg-gray-600">
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                    <PersonalStatistics className="grow bg-gray-500 rounded" userStatistics={userStatistics} />
                </main>
            </div>
            <div className="flex flex-col w-80 items-stretch">
                <UserMenu />
                <aside className="grow gap-1.5 rounded bg-gray-600">
                    <PersonalStatistics userStatistics={userStatistics} />
                </aside>
            </div>
        </div>
    );
}

export default App;