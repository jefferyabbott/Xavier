import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ApolloProvider, ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from "@apollo/client/link/context";
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Applications from './pages/Applications';
import Profiles from './pages/Profiles';
import Users from './pages/Users';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import AllDevices from './pages/AllDevices';
import MacDetail from './pages/MacDetail';
import IPhoneDetail from './pages/IPhoneDetail';
import IPadDetail from './pages/IPadDetail';
import MacEncryptionList from './pages/dashboardListPages/MacEncryptionList.jsx';
import MacSIPList from './pages/dashboardListPages/MacSIPList.jsx';
import MacMDMEnrolledList from './pages/dashboardListPages/MacMDMEnrolledList.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ScrollToTop } from './components/ScrollToTop.jsx';


const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        macs: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const authLink = setContext((_, { headers }) => {
  const token = JSON.parse(localStorage.getItem('user')).token;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer: ${token}` : '',
    }
  }
});

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_BACKEND_SERVER}/graphql`,
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
});

function App() {
  return (
    <>
    <ApolloProvider client={client}>
      <Router>
        <ScrollToTop />
        <Navbar/>
        <div className='page'>
        <Sidebar/>
          <div className='container'>
            <Routes>
              <Route path="/login" element={<Login />}/>
              <Route path="/" element={<Dashboard />} />
              <Route path="/all" element={<AllDevices />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/profiles" element={<Profiles />} />
              <Route path="/users" element={<Users />} />
              <Route path="/mac/:SerialNumber" element={<MacDetail />} />
              <Route path="/iphone/:SerialNumber" element={<IPhoneDetail />} />
              <Route path="/ipad/:SerialNumber" element={<IPadDetail />} />
              <Route path="/macos/encryptionStatus/:FDE_Enabled" element={<MacEncryptionList />} />
              <Route path="/macos/sipStatus/:SystemIntegrityProtectionEnabled" element={<MacSIPList />} />
              <Route path="/macos/mdmEnrolled/:mdmProfileInstalled" element={<MacMDMEnrolledList />} />
              <Route path="*" element={<NotFound />} /> 
            </Routes>
          </div>
        </div>
        </Router>
        <ToastContainer position="bottom-right" theme="colored"/>
    </ApolloProvider>
  </>
  );
}

export default App;
