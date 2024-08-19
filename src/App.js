import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrollToTop from './component/ScrollToTop';
import ProtectedRoute from './component/ProtectedRoute';
import PublicRoute from './component/PublicRoute';
import Login from './pages/Login';
import HomePage from './pages/HomePage';
import Profile from './pages/User/Profile';
import ConfirmAccount from './pages/AccountConfirm';
import CreateEvent from './pages/Organizer/CreateEvent';
import EventDetail from './pages/EventDetail';
import Events from './pages/Organizer/Events';
import User from './pages/Admin/User';
import EventAdmin from './pages/Admin/EventAdmin';
import ForumAdmin from './pages/Admin/ForumAdmin';
import RateEvent from './pages/Home/RateEvent';
import Dashboard from './pages/Admin/Dashboard';
import CategoryList from './pages/Admin/ManageCategory';
import MyTicket from './pages/User/MyTicket';
import ChooseTicket from './pages/Payment/ChooseTicket';
import TicketDetail from './pages/User/TicketDetail';
import Payment from './pages/Payment/Payment';
import EditEvent from './pages/Organizer/EditEvent';
import NewsManage from './pages/Organizer/NewsManage';
import CheckinTicket from './pages/Staff/CheckinTicket';
import ManageStaff from './pages/Organizer/ManageStaff';
import Search from './pages/Home/Search';
import ManageNews from './pages/Admin/ManageNews';
import NewsDetail from './pages/Admin/NewsDetail';
import EventStatistics from './pages/Organizer/EventStatistics';
import PaymentSuccess from './pages/Payment/PaymentSuccess';
import PostProvider from './context/PostContext';
import CommentProvider from './context/CommentContext';
import Forum from './component/Forum/Forum';
import CheckinHistory from './pages/Staff/CheckinHistory';
import NewsDetails from './pages/NewsDetail';
import Status403 from './pages/Error/403';
import Status404 from './pages/Error/404';
import Status500 from './pages/Error/500';
import NewsListPage from './pages/NewsListPage';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<PublicRoute element={<HomePage />} />} />
        <Route path="/login" element={<PublicRoute element={<Login />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} allowedRoles={[1, 2, 3, 4]} />} />
        <Route path="/confirmaccount/:email" element={<ConfirmAccount />}/>
        <Route path="/event-detail/:encodedId" element={<EventDetail />} />
        <Route path="/rate/:ratingid" element={<ProtectedRoute element={<RateEvent />} allowedRoles={[2]} />} />
        <Route path="/organizer/create-event" element={<ProtectedRoute element={<CreateEvent />} allowedRoles={[2, 3]} />} />
        <Route path="/admin/user" element={<ProtectedRoute element={<User />} allowedRoles={[1]} />} />
        <Route path="/admin/events" element={<ProtectedRoute element={<EventAdmin />} allowedRoles={[1]} />} />
        <Route path="/admin/forum" element={<ProtectedRoute element={<ForumAdmin />} allowedRoles={[1]} />} />
        <Route path="/organizer/events" element={<ProtectedRoute element={<Events />} allowedRoles={[2, 3]} />} />
        <Route path="/admin/dashboard" element={<ProtectedRoute element={<Dashboard />} allowedRoles={[1]} />} />
        <Route path="/manage-category" element={<ProtectedRoute element={<CategoryList />} allowedRoles={[1]} />} />
        <Route path="/seclectTicket" element={<ProtectedRoute element={<ChooseTicket />} allowedRoles={[2]} />} />
        <Route path="/payment" element={<ProtectedRoute element={<Payment />} allowedRoles={[2]} />} />
        <Route path="/myticket" element={<ProtectedRoute element={<MyTicket />} allowedRoles={[2]} />} />
        <Route path="/myticket/detail/:id" element={<ProtectedRoute element={<TicketDetail />} allowedRoles={[2]} />} />
        <Route path="/organizer/edit-event/:encodedId" element={<ProtectedRoute element={<EditEvent />} allowedRoles={[2, 3]} />} />
        <Route path="/organizer/manage-news" element={<ProtectedRoute element={<NewsManage />} allowedRoles={[3]} />} />
        <Route path="/organizer/manage-staff" element={<ProtectedRoute element={<ManageStaff />} allowedRoles={[3]} />} />
        <Route path="/staff/checkin" element={<ProtectedRoute element={<CheckinTicket />} allowedRoles={[4]} />} />
        <Route path="/staff/checkin-history" element={<ProtectedRoute element={<CheckinHistory />} allowedRoles={[4]} />} />
        <Route path="/search" element={<Search />} />
        <Route path="/admin/manage-news" element={<ProtectedRoute element={<ManageNews />} allowedRoles={[1]} />} />
        <Route path="/admin/news/news-detail/:newsId" element={<NewsDetail />} />
        <Route path="/event-statistics/:encodedId" element={<ProtectedRoute element={<EventStatistics />} allowedRoles={[3]} />} />
        <Route path="/payment-success" element={<ProtectedRoute element={<PaymentSuccess />} allowedRoles={[2]} />} />
        <Route path="/payment-success/:orderId" element={<ProtectedRoute element={<PaymentSuccess />} allowedRoles={[2]} />} />
        <Route path="/news" element={<NewsListPage />}/>
        <Route path="/newsdetail/:newsId" element={<NewsDetails />} />
        <Route path="/forum" element={<PostProvider><CommentProvider><Forum/></CommentProvider></PostProvider>}></Route>
        <Route path="/403" element={<Status403/>}/>
        <Route path="/500" element={<Status500/>}/>
        <Route path="*" element={<Status404/>}/>
      </Routes>
    </Router>
  );
}

export default App;
