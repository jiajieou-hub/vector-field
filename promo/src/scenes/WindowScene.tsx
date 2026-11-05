import { Video } from "@remotion/media";
import { AbsoluteFill, staticFile } from "remotion";
import { AppWindow, Backdrop } from "../components/AppWindow";
import { Caption } from "../components/Caption";

/* A screen recording in the app window, with a caption above it.
   `zoom` lets a scene push in on part of the screen; it gets the footage as children. */
export const WindowScene: React.FC<{
  clip: string;
  kicker: string;
  title: string;
  zoom?: React.FC<{ children: React.ReactNode }>;
}> = ({ clip, kicker, title, zoom: Zoom }) => {
  const footage = (
    <Video
      name="Screen recording"
      src={staticFile(`clips/${clip}.webm`)}
      muted
      style={{ width: 1440, height: 810 }}
    />
  );
  return (
    <AbsoluteFill name="Scene">
      <Backdrop />
      <Caption kicker={kicker} title={title} />
      <AppWindow>{Zoom ? <Zoom>{footage}</Zoom> : footage}</AppWindow>
    </AbsoluteFill>
  );
};
