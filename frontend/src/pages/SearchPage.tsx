import { useParams } from "react-router-dom";

function SearchPage() {
  const { location, startdate, enddate, startprice, endprice } = useParams();

  const searchQuery: String[] = [
    location || "",
    startdate || "",
    enddate || "",
    startprice || "",
    endprice || "",
  ];

  return (
    <>
      <div>
        
      </div>
    </>
  );
}
export default SearchPage;
