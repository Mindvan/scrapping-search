import './styles/fonts.scss';
import './styles/App.scss';
import React, {useState} from 'react';
import Navigation from './components/Navigation';
import Featured from './components/Featured';
import Main from './components/Main';

function App() {
    const [activePage, setActivePage] = useState('main');

    function handleNavigationClick(componentName) {
        setActivePage(componentName);
    }

    return (
        <div className='App'>
            <Navigation onNavigationClick={handleNavigationClick}/>
            <div className='block'>
                {activePage === 'main' && <Main />}
                {activePage === 'featured' && <Featured />}
            </div>
        </div>
    );
}

export default App;
