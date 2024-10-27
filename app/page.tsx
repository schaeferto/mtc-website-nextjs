export default function Home() {
  return (
    <div className={`flex h-screen w-full`}>
      <h1
        className={`absolute inset-0 flex items-center justify-center text-4xl text-center text-white font-bold font-findel`}
      >
        MTC
      </h1>
      <h2
        className={`top-48 absolute inset-0 flex items-center justify-center text-2xl text-center text-white font-bold font-montserrat`}
      >
        Soon in next.js ...
      </h2>
      <video
        autoPlay
        muted
        loop
        playsInline
        className={`h-full w-full object-cover`}
      >
        <source src="/header-video.webm" type="video/webm" />
        <source src="/header-video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}
