import { list, ListBlobResult, ListBlobResultBlob } from '@vercel/blob';

export async function Video({ fileName }: { fileName: string }) {
  const { blobs }: ListBlobResult = await list({
    prefix: `${fileName}`,
  });
  const { url }: ListBlobResultBlob = blobs.filter((blob) => blob.pathname.endsWith('.webm'))[0];
  return (
    <div className={'min-h-[inherit]'}>
    <video autoPlay muted loop playsInline className={'min-h-[inherit] object-cover'}>
      <source src={url} type="video/webm"/>
    </video>
    </div>
  );
}
