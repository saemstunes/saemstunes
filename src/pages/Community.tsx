import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { motion } from "framer-motion";
import { pageTransition } from "@/lib/animation-utils";
import { BookOpen, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-proxima font-bold">Community</h1>
          <p className="text-muted-foreground mt-1">
            Connect with fellow musicians, share your work, and collaborate on
            projects
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="col-span-2">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-proxima font-semibold mb-4">
                Latest Forum Posts
              </h2>
              <p className="text-muted-foreground">
                Stay up-to-date with the latest discussions and announcements
                from the community.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/forums")}
              >
                View All Forum Posts
              </Button>
            </div>
          </div>

          <div>
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-proxima font-semibold mb-4">
                Upcoming Events
              </h2>
              <p className="text-muted-foreground">
                Join us for live workshops, Q&A sessions, and other exciting
                events.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/events")}
              >
                View All Events
              </Button>
            </div>
          </div>

          <div className="col-span-3">
            <div className="bg-muted rounded-lg p-6">
              <h2 className="text-xl font-proxima font-semibold mb-4">
                Share Your Music
              </h2>
              <p className="text-muted-foreground">
                Showcase your original compositions, covers, and remixes to the
                community.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/upload")}
              >
                Upload Your Music
              </Button>
            </div>
          </div>
        </div>

        {/* Legal Links Footer */}
        <div className="flex justify-center space-x-4 pt-8 border-t">
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/privacy")}
            className="text-muted-foreground hover:text-gold"
          >
            Privacy Policy
          </Button>
          <span className="text-muted-foreground">•</span>
          <Button
            variant="link"
            size="sm"
            onClick={() => navigate("/terms")}
            className="text-muted-foreground hover:text-gold"
          >
            Terms of Service
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default Community;
