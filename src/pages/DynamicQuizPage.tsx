
import { useParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";

export default function DynamicQuizPage() {
  const { quizId } = useParams();
  
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-6">Quiz {quizId}</h1>
        <p>Dynamic quiz content will be loaded here.</p>
      </div>
    </MainLayout>
  );
}
