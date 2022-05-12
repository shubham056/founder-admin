import { BrowserRouter } from 'react-router-dom';
import Routes from './Routes/Routes';
import { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css'

function App() {
  return (
    <>
      <SkeletonTheme highlightColor='#525252' borderRadius="0.5rem" height={10}>
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </SkeletonTheme>
    </>
  );
}

//Exporting app
export default App; 
