
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/context/AuthContext";
import { UserRole } from "@/context/AuthContext";
import TutorCard from "@/components/booking/TutorCard";
import { mockTutors } from "@/data/mockData";
import UpcomingBookings from "@/components/dashboard/UpcomingBookings";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";
import { useState } from "react";

const Bookings = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  // Extract unique specialties for filtering
  const allSpecialties = mockTutors.flatMap(tutor => tutor.specialties);
  const uniqueSpecialties = ["all", ...new Set(allSpecialties)];

  // Filter tutors based on search and specialty filter
  const filteredTutors = mockTutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesSpecialty = specialtyFilter === "all" || 
      tutor.specialties.includes(specialtyFilter);
    
    return matchesSearch && matchesSpecialty;
  });

  return (
    <MainLayout>
      <div>
        <h1 className="text-3xl font-serif font-bold mb-6">Bookings</h1>
        
        <Tabs defaultValue="tutors" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="tutors">Find Tutors</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming Sessions</TabsTrigger>
            {user && (user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
              <TabsTrigger value="manage">Manage Sessions</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="tutors" className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tutors by name or specialty..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <div>
                <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by specialty" />
                  </SelectTrigger>
                  <SelectContent>
                    {uniqueSpecialties.map((specialty) => (
                      <SelectItem key={specialty} value={specialty}>
                        {specialty === "all" ? "All Specialties" : specialty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {filteredTutors.length > 0 ? (
              <div className="grid grid-cols-1 gap-6">
                {filteredTutors.map((tutor) => (
                  <TutorCard key={tutor.id} tutor={tutor} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium">No tutors found</h3>
                <p className="text-muted-foreground text-sm mt-2">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="upcoming">
            <UpcomingBookings limit={10} />
          </TabsContent>
          
          {user && (user.role === UserRole.TEACHER || user.role === UserRole.ADMIN) && (
            <TabsContent value="manage">
              <div className="text-center py-12 bg-muted rounded-lg">
                <h3 className="text-lg font-medium">Session Management</h3>
                <p className="text-muted-foreground mt-2">
                  Teacher and admin session management will be available soon.
                </p>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Bookings;
