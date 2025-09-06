export async function Video({ fileName }: { fileName: string }) {
  return (
    <div className={"min-h-[inherit] w-full"}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={"min-h-[inherit] w-full h-full object-cover"}
      >
        <source src={"/" + fileName + ".webm"} type="video/webm" />
      </video>
    </div>
  );
}
