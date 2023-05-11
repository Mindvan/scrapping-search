import './styles/fonts.scss';
import './styles/App.scss';
import React, {useState} from 'react';
import Navigation from './components/Navigation';
import Featured from './components/Featured';
import Main from './components/Main';
import Limits from "./components/Limits";

function App() {
    const [activePage, setActivePage] = useState('main');
    const [modal, setModal] = useState(false);

    function handleNavigationClick(componentName) {
        setActivePage(componentName);
    }

    return (
        <div className='App'>
            <Limits visibility={modal} setVisibility={setModal}/>
            <Navigation onNavigationClick={handleNavigationClick} setModal={setModal}/>
            <div className='block'>
                {activePage === 'main' && <Main />}
                {activePage === 'featured' && <Featured />}
            </div>
        </div>
    );
}

export default App;
