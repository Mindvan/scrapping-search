import './styles/fonts.scss';
import './styles/App.scss';
import React, {useState} from 'react';
import Navigation from './components/Navigation';
import Featured from './components/Featured';
import Main from './components/Main';
import Limits from "./components/Limits";
import Add from "./components/Add";

function App() {
    //const [activePage, setActivePage] = useState('main');
    const [modalAdd, setModalAdd] = useState(false);
    const [modalLimits, setModalLimits] = useState(false);
    const [modalFeatured, setModalFeatured] = useState(false);

    // function handleNavigationClick(componentName) {
    //     setActivePage(componentName);
    // }

    return (
        <div className='App'>
            <Add visibility={modalAdd} setVisibility={setModalAdd}/>
            <Limits visibility={modalLimits} setVisibility={setModalLimits}/>
            <Featured visibility={modalFeatured} setVisibility={setModalFeatured}/>
            <Navigation
                setModalAdd={setModalAdd}
                setModalLimits={setModalLimits}
                setModalFeatured={setModalFeatured}
            />
            <div className='block'>
                <Main />
            </div>
        </div>
    );
}

export default App;
