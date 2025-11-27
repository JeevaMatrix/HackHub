import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home.jsx';
import Login from './pages/Login/Login.jsx';
import Signup from './pages/Signup/Signup.jsx';
import Navbar from "./components/Navbar/Navbar";
import EventDetails from './pages/EventDetails/EventDetails.jsx';
import RegisterEvent from './pages/RegisterEvent/RegisterEvent.jsx';
import MyRegistrations from './pages/MyRegistrations/MyRegistrations.jsx';
import OrganizerDashboard from './pages/OrganizerDashboard/OrganizerDashboard.jsx';
import CreateEvent from './pages/CreateEvent/CreateEvent.jsx';
import EditEvent from './pages/EditEvent/EditEvent.jsx';
import Footer from './components/Footer/Footer.jsx';
import ContactUs from "./pages/ContactUs/ContactUs";
import Terms from "./pages/Terms/Terms";
import Refunds from "./pages/Refunds/Refunds";
import Shipping from "./pages/Shipping/Shipping";
import About from "./pages/About/About";

function App() {
  return (
    <div className="App">
        <Navbar />
        <Routes>
          {/* authentication routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* my registrations page */}
          <Route path="/my-registrations" element={<MyRegistrations />} />

          {/* event details page */}
          <Route path="/events/:id" element={<EventDetails />} />

          {/* register event page */}
          <Route path="/register/:id" element={<RegisterEvent />} />

          {/* Home Page */}
          <Route path="/" element={<Home/>} />

          {/* organizer dashboard */}
          <Route path="/dashboard" element={<OrganizerDashboard />} />

          {/* create event page */}
          <Route path="/create-event" element={<CreateEvent />} />
          {/* edit event page */}
          <Route path="/edit-event/:id" element={<EditEvent />} />

          {/* terms and conditions page */}
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/refunds" element={<Refunds />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/about" element={<About />} />


        </Routes>
        <Footer />
    </div>
  );
}

export default App;
