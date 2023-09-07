import React from "react"
import { useAsset } from "@livepeer/react"
import Plyr from "plyr-react"
import "plyr-react/plyr.css"

export default function Player({ video }) {
  // Livepeer إستدعاء الفيديو من
  const { data: asset } = useAsset(video.hash)

  return (
    <div>
        <Plyr
            source={{ type: "video", title: asset?.name, sources: [{src: asset?.downloadUrl, type: "video/mp4"}]}}
            options={{autoplay: true}}
            autoPlay={true}
        />
        <div className="flex justify-between flex-row py-4">
            <div>
                <h3 className="text-2xl text-black">{video.title}</h3>
                <p className="text-gray-600 mt-1">{video.description}</p>
                <p className="text-gray-500 mt-1">
                    {video.category} •{" "}
                    {new Date(video.createdAt.toString() * 1000).toLocaleString("ar-IN")}
                </p>
            </div>
        </div>
    </div>
  );
}