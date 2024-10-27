import Image from "next/image";

export default function Navigation() {
  return (
    <header className="bg-mtc-black text-white h-20 flex items-center">
      <div>
        <Image src="/logo-transparent.png" alt="Logo" width={70} height={70} className={`ml-3`}/>
      </div>
    </header>
  );
}
