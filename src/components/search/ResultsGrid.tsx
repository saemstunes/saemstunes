import { SearchResult } from "@/lib/search";
import ArtistCard from "./ArtistCard";
import VideoCard from "./VideoCard";
import ResourceCard from "./ResourceCard";
import CourseCard from "./CourseCard";
import TrackCard from "./TrackCard";
import TutorCard from "./TutorCard";

interface ResultsGridProps {
  results: SearchResult[];
}

const ResultsGrid = ({ results }: ResultsGridProps) => {
  const renderCard = (result: SearchResult) => {
    switch (result.source_table) {
      case 'artists':
        return <ArtistCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      case 'video_content':
        return <VideoCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      case 'resources':
        return <ResourceCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      case 'courses':
        return <CourseCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      case 'tracks':
        return <TrackCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      case 'tutors':
        return <TutorCard key={`${result.source_table}-${result.source_id}`} result={result} />;
      default:
        return (
          <div key={`${result.source_table}-${result.source_id}`} className="p-4 border rounded-lg">
            <h3 className="font-semibold">{result.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: result.snippet }} />
          </div>
        );
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {results.map(renderCard)}
    </div>
  );
};

export default ResultsGrid;
