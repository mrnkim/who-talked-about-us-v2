import "./App.css";
import IndexForm from "./indexes/IndexForm";
import VideoIndex from "./indexes/VideoIndex";
import Container from "react-bootstrap/Container";
import closeIcon from "./svg/Close.svg";
import backIcon from "./svg/Back.svg";
import loadingSpinner from "./svg/LoadingSpinner.svg";
import { useGetIndexes } from "./api/apiQueries";

/** UGC Analyzer application
 *
 * - indexes: list of indexes and loading status
 *   { data: [{_id: '1', index_name: 'testIndex2', index_options: Array(4),...},
 *            {_id: '2', index_name: 'testIndex2', index_options: Array(4),...}]
 *          , isLoading: false }
 *
 * App -> { IndexForm, VideoIndex }
 */

function App() {
  const { isLoading, data, refetch } = useGetIndexes();
  const indexes = data?.data.data;

  const handleRefetch = () => {
    refetch();
  };

  if (isLoading)
    return (
      <div className="text-center">
        <div className=" loading-spinner">
          <img src={loadingSpinner} alt="Loading Spinner" />
        </div>
        Loading
      </div>
    );

  return (
    <div className="App">
      <Container className="m-auto p-3">
        <h1 className="m-3 display-5">Who Talked About Us?</h1>
        <h4>Find the right influencers (organic brand fans) to reach out </h4>
      </Container>
      <Container className="m-auto p-3 indexFormContainer">
        <IndexForm handleRefetch={handleRefetch} />
      </Container>
      <Container className="m-auto p-3">
        {indexes &&
          indexes.map((index) => (
            <div className="mb-3" key={index._id}>
              <VideoIndex
                indexes={indexes}
                index={index}
                key={index._id}
                closeIcon={closeIcon}
                backIcon={backIcon}
                loadingSpinner={loadingSpinner}
              />
            </div>
          ))}
      </Container>
    </div>
  );
}

export default App;
