import React from "react";
import { render, waitFor } from "@testing-library/react";
import VideoPlayer from "../VideoPlayer.js";
import { TEST_OPTIONS } from "./_testCommon.js";

it("renders without crashing", function () {
  render(<VideoPlayer options={TEST_OPTIONS} />);
});

it("matches snapshot", function () {
  const { container } = render(<VideoPlayer options={TEST_OPTIONS} />);
  expect(container).toMatchSnapshot();
});
