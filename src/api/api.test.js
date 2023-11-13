import TwelveLabsApi from "./api";
import axios from "axios";

jest.mock("axios");

describe("TwelveLabsApi", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockIndexes = [
    { _id: "index1", index_name: "Index 1" },
    { _id: "index2", index_name: "Index 2" },
  ];

  const mockVideos = [
    { _id: "video1", title: "Video 1" },
    { _id: "video2", title: "Video 2" },
  ];

  test("should fetch indexes", async () => {
    axios.request.mockResolvedValueOnce({ data: mockIndexes });

    const indexes = await TwelveLabsApi.getIndexes();

    expect(indexes.data).toEqual(mockIndexes);
    expect(axios.request).toHaveBeenCalledWith({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/indexes`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    });
  });

  test("should create index", async () => {
    const indexName = "New Index";
    const mockResponse = { _id: "new_index_id", index_name: indexName };

    axios.request.mockResolvedValueOnce(mockResponse);

    const response = await TwelveLabsApi.createIndex(indexName);

    expect(response.data).toEqual(mockResponse.data);
    expect(axios.request).toHaveBeenCalledWith({
      method: "POST",
      url: `${process.env.REACT_APP_API_URL}/indexes`,
      data: {
        engine_id: "marengo2.5",
        index_options: ["visual", "conversation", "text_in_video", "logo"],
        index_name: indexName,
      },
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
    });
  });

  test("should fetch videos", async () => {
    const indexId = "index1";

    axios.request.mockResolvedValueOnce({ data: { data: mockVideos } });

    const videos = await TwelveLabsApi.getVideos(indexId);

    expect(videos.data).toEqual(mockVideos);
    expect(axios.request).toHaveBeenCalledWith({
      method: "GET",
      url: `${process.env.REACT_APP_API_URL}/indexes/${indexId}/videos`,
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.REACT_APP_API_KEY,
      },
      params: {
        page_limit: "50",
      },
    });
  });
});
