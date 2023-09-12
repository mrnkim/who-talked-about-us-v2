import React, { useState } from "react";
import InputForm from "../common/InputForm";
import { Alert } from "react-bootstrap";

/** Form to search videos
 *
 * - query: search term that updates based on the user input
 *
 * VideoIndex -> SearchForm -> InputForm
 */

function SearchForm({ index, search }) {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");

  /** Updates form input */
  function handleChange(evt) {
    const input = evt.target;
    setQuery(input.value);
  }

  /** Calls parent function to search videos based on a query */
  async function handleSubmit(evt) {
    evt.preventDefault();
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setError("Please enter the search term");
    } else {
      search(index, trimmedQuery);
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-center">
      <InputForm
        handleSubmit={handleSubmit}
        handleChange={handleChange}
        input={query}
        type="What are you looking for? (e.g., applying MAC lipstick)"
        buttonText="Search"
      />
      {error && (
        <Alert variant="danger" dismissible>
          {error}
        </Alert>
      )}
    </div>
  );
}

export default SearchForm;
