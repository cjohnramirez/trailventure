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
        <p>
          {searchQuery.map((query, index) =>{
            return (
              <>
                <p key={index}>{query}</p>
              </>
            )
          })}
        </p>
      </div>
    </>
  );
}
export default SearchPage;
