export async function Video({ fileName }: { fileName: string }) {
  return (
    <div className={"min-h-[inherit]"}>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={"min-h-[inherit] object-cover"}
      >
        <source src={"/" + fileName + ".webm"} type="video/webm" />
      </video>
    </div>
  );
}
