
import './App.css';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';


import { BrowserRouter, Route, Routes  } from "react-router-dom";

import UserForm from './components/UserForm';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <main>
      <Routes>
        <Route path="/" element={<UserForm />} exact />
      </Routes>

      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
