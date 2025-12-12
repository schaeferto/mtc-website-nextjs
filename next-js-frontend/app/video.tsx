"use client";

export function Video({ fileName }: { fileName: string }) {
  return (
    <div className={"min-h-[inherit] w-full"}>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        webkit-playsinline="true"
        x5-playsinline="true"
        className={"min-h-[inherit] w-full h-full object-cover"}
      >
        <source src={"/" + fileName + ".webm"} type="video/webm" />
      </video>
    </div>
  );
}
