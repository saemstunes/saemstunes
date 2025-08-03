
import { Helmet } from "react-helmet";
import MainLayout from "@/components/layout/MainLayout";
import NotificationCenter from "@/components/notifications/NotificationCenter";

const Notifications = () => {
  return (
    <>
      <Helmet>
        <title>Notifications - Saem's Tunes</title>
        <meta name="description" content="Stay updated with the latest notifications from Saem's Tunes" />
      </Helmet>
      
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <NotificationCenter />
        </div>
      </MainLayout>
    </>
  );
};

export default Notifications;
