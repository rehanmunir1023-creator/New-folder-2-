import React from "react";
import { Composition } from "remotion";
import { NanaBananaBlueprintVideo } from "./NanaBananaBlueprintVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="NanaBananaBlueprint"
      component={NanaBananaBlueprintVideo}
      durationInFrames={600}
      fps={30}
      width={1920}
      height={1080}
    />
  );
};
