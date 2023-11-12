import { useState, useEffect } from "react";
import { Card, Container } from "react-bootstrap";
import sanitize from "sanitize-filename";
import "./UploadYouTubeVideo.css";
import infoIcon from "../svg/Info.svg";
import TwelveLabsApi from "../api/api";
import { LoadingSpinner } from "../common/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import { UploadForm } from "./UploadForm";
import { UploadConfirmation } from "./UploadConfirmation";
import { TaskVideo } from "./TaskVideo";
import { Task } from "./Task";

const SERVER_BASE_URL = new URL("http://localhost:4001");
const JSON_VIDEO_INFO_URL = new URL("/json-video-info", SERVER_BASE_URL);
const CHANNEL_VIDEO_INFO_URL = new URL("/channel-video-info", SERVER_BASE_URL);
const PLAYLIST_VIDEO_INFO_URL = new URL(
  "/playlist-video-info",
  SERVER_BASE_URL
);
const DOWNLOAD_URL = new URL("/download", SERVER_BASE_URL);

/** Implements video download, submission, and indexing
 *
 * App -> VideoIndex -> UploadYoutubeVideo
 */

export function UploadYoutubeVideo({
  currIndex,
  taskVideos,
  setTaskVideos,
  taskVideosRef,
}) {
  console.log("🚀 > taskVideos=", taskVideos);
  console.log("🚀 > taskVideosRef=", taskVideosRef);
  const [pendingApiRequest, setPendingApiRequest] = useState(false);
  const [mainMessage, setMainMessage] = useState(null);
  const [selectedJSON, setSelectedJSON] = useState(null);
  const [youtubeChannelId, setYoutubeChannelId] = useState("");
  const [youtubePlaylistId, setYoutubePlaylistId] = useState("");
  const [indexId, setIndexId] = useState(null);
  const [searchQuery, setSearchQuery] = useState(null);
  const [taskIds, setTaskIds] = useState(null);
  console.log("🚀 > UploadYoutubeVideo > taskIds=", taskIds);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completeTasks, setCompleteTasks] = useState([]);
  const [failedTasks, setFailedTasks] = useState([]);
  console.log("🚀 > failedTasks=", failedTasks)
  console.log("🚀 > completeTasks=", completeTasks);

  const handleJSONSelect = (event) => {
    setSelectedJSON(event.target.files[0]);
  };

  const handleReset = () => {
    setPendingApiRequest(false);
    setTaskVideos(null);
    setSelectedJSON(null);
    setYoutubeChannelId("");
    setYoutubePlaylistId("");
    setSearchQuery(null);
    setIndexId(null);
    updateMainMessage(null);
  };

  const updateMainMessage = (text) => {
    if (text) {
      setPendingApiRequest(true);

      let apiRequestElement = (
        <div className="doNotLeaveMessageWrapper">
          <img src={infoIcon} alt="infoIcon" className="icon"></img>
          <div className="doNotLeaveMessage">{text}</div>
        </div>
      );
      setMainMessage(apiRequestElement);
    } else {
      setPendingApiRequest(false);
      setMainMessage(null);
    }
  };

  const handleYoutubeChannelIdEntry = (event) => {
    setYoutubeChannelId(event.target.value);
  };

  const handleYoutubePlaylistIdEntry = (event) => {
    setYoutubePlaylistId(event.target.value);
  };

  const getInfo = async () => {
    updateMainMessage("Getting Data...");
    if (selectedJSON) {
      let fileReader = new FileReader();
      fileReader.readAsText(selectedJSON);
      fileReader.onloadend = async () => {
        const jsonVideos = JSON.parse(fileReader.result);
        const response = await Promise.all(jsonVideos.map(getJsonVideoInfo));
        setTaskVideos(response);
        taskVideosRef.current = response;
      };
    } else if (youtubeChannelId) {
      const response = await getChannelVideoInfo(youtubeChannelId);
      setTaskVideos(response);
      taskVideosRef.current = response;
    } else if (youtubePlaylistId) {
      const response = await getPlaylistVideoInfo(youtubePlaylistId);
      setTaskVideos(response);
      taskVideosRef.current = response;
    }
    updateMainMessage();
  };

  const getJsonVideoInfo = async (videoData) => {
    const queryUrl = JSON_VIDEO_INFO_URL;
    queryUrl.searchParams.set("URL", videoData.url);
    const response = await fetch(queryUrl.href);
    return await response.json();
  };

  const getChannelVideoInfo = async () => {
    const queryUrl = CHANNEL_VIDEO_INFO_URL;
    queryUrl.searchParams.set("CHANNEL_ID", youtubeChannelId);
    const response = await fetch(queryUrl.href);
    return await response.json();
  };

  const getPlaylistVideoInfo = async () => {
    const queryUrl = PLAYLIST_VIDEO_INFO_URL;
    queryUrl.searchParams.set("PLAYLIST_ID", youtubePlaylistId);
    const response = await fetch(queryUrl.href);
    return await response.json();
  };

  const indexYouTubeVideos = async () => {
    setIsSubmitting(true);
    updateMainMessage(
      "Do not leave or refresh the page. Please wait until indexing is done for ALL videos."
    );

    const videoData = taskVideos.map((videoData) => {
      return {
        url: videoData.video_url || videoData.url,
        title: videoData.title,
        authorName: videoData.author.name,
      };
    });
    const requestData = {
      videoData: videoData,
      index_id: currIndex,
    };
    const data = {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    };
    const response = await fetch(DOWNLOAD_URL.toString(), data);
    const json = await response.json();
    const taskIds = json.taskIds;
    setIndexId(json.indexId);
    setTaskIds(taskIds);
  };

  useEffect(() => {
    if (taskIds?.length === completeTasks.length + failedTasks.length) {
      updateMetadata();
      handleReset();
    }
  }, [taskIds, completeTasks, failedTasks]);

  async function updateMetadata() {
    /**
     * 1. get video id
     * 2. find matching taskVideo and get author and youtubeUrl
     * 3. update video
     */

    const updatePromises = completeTasks.map(async (completeTask) => {
      const matchingVid = taskVideos?.find(
        (taskVid) => `${taskVid.title}.mp4` === completeTask.metadata?.filename
      );

      if (matchingVid) {
        const authorName = matchingVid.author.name;
        const youtubeUrl = matchingVid.video_url || matchingVid.shortUrl;

        //include custom data to add to the existing metadata
        const data = {
          metadata: {
            author: authorName,
            youtubeUrl: youtubeUrl,
          },
        };
        TwelveLabsApi.updateVideo(currIndex, completeTask.video_id, data);
      }
    });
    // Wait for all metadata updates to complete
    await Promise.all(updatePromises);
  }

  return (
    <div>
      {!taskVideos && (
        <UploadForm
          selectedJSON={selectedJSON}
          youtubeChannelId={youtubeChannelId}
          youtubePlaylistId={youtubePlaylistId}
          handleJSONSelect={handleJSONSelect}
          indexId={indexId}
          handleYoutubeChannelIdEntry={handleYoutubeChannelIdEntry}
          handleYoutubePlaylistIdEntry={handleYoutubePlaylistIdEntry}
          getInfo={getInfo}
          handleReset={handleReset}
          mainMessage={mainMessage}
          pendingApiRequest={pendingApiRequest}
        />
      )}

      {taskVideos && !isSubmitting && (
        <>
          <UploadConfirmation
            indexYouTubeVideos={indexYouTubeVideos}
            pendingApiRequest={pendingApiRequest}
            handleReset={handleReset}
            mainMessage={mainMessage}
            taskVideos={taskVideos}
          />

          <div className="taskVideoContainer">
            {taskVideos.map((taskVideo) => (
              <div className="taskVideo" key={taskVideo.videoId}>
                <TaskVideo
                  key={taskVideo.videoId}
                  taskVideo={taskVideo}
                  pendingApiRequest={pendingApiRequest}
                  className="taskVideo"
                />
              </div>
            ))}
          </div>
        </>
      )}

      {taskVideos && isSubmitting && (
        <>
          <div className="wrapper">
            <Container className="mainMessageWrapper">{mainMessage}</Container>

            <div className="taskVideoContainer">
              {taskVideos.map((taskVideo) => (
                <div className="taskVideo" key={taskVideo.videoId}>
                  <TaskVideo
                    key={taskVideo.videoId}
                    taskVideo={taskVideo}
                    pendingApiRequest={pendingApiRequest}
                    className="taskVideo"
                  />
                </div>
              ))}
            </div>
            {!taskIds && (
              <div className="downloadSubmit">
                <LoadingSpinner />
                Downloading & Submitting...
              </div>
            )}
            {taskIds && (
              <div className="taskVideoContainer">
                {taskIds.map((task) => (
                  <div className="task" key={task._id}>
                    <Task
                      key={task._id}
                      taskId={task._id}
                      taskVideos={taskVideos}
                      setCompleteTasks={setCompleteTasks}
                      setFailedTasks={setFailedTasks}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default UploadYoutubeVideo;
